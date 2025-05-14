import { User } from "../models/user-model.js";
import bcrypt from "bcryptjs";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import { sendVerificationEmail, sendWelcomeEmail } from "../mailtrap/emails.js";

const signup = async (req, res) => {
  const { email, password, name } = req.body;

  try {
    if (!email || !password || !name) {
      throw new Error("All fields are required!");
    }

    const userAlreadyExists = await User.findOne({ email });
    if (userAlreadyExists) {
      return res.status(400).json({
        success: false,
        message: `User with the email: '${email}' already exists!'`,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = Math.floor(
      100000 + Math.random() * 900000
    ).toString(); // 6-digit OTP

    const user = new User({
      email,
      password: hashedPassword,
      name,
      verificationToken,
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, // -> 24 hrs
    });

    await user.save(); //saving the user to the database

    //*jwt

    generateTokenAndSetCookie(res, user._id);

    //mailtrap
    await sendVerificationEmail(user.email, verificationToken);

    res.status(201).json({
      success: true,
      message: `User created successfully!`,
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: "Signup failed! Check your request body, link, or code logic.",
      data: error.message,
    });
  }
};

const verifyEmail = async (req, res) => {
  // __ __ __ __ __ __  : entering the OTP like this
  const { code } = req.body;
  try {
    const user = await User.findOne({
      verificationToken: code,
      verificationTokenExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid verification code...",
      });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;
    await user.save();

    await sendWelcomeEmail(user.email, user.name);
    res.status(200).json({
      success: true,
      message: "Email verified successfully!",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    res.status(500).json({
    success: false,
    message: "Email verification failed.",
    data: error.message,
  });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email })
    if(!user){
      return res.status(400).json({ success: false, message: "Invalid Credentials"})
    }
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if(!isPasswordValid){
      return res.status(400).json({ success: false, message: "Invalid Credentials"})
    }

    generateTokenAndSetCookie(res, user._id)

    user.lastLoginDate = new Date()
    await user.save()
    res.status(200).json({
      success: true,
      message: "LoggedIn successfully!",
      user: {
        ...User._doc,
        password: undefined,
      },
    });
  } catch (error) {
    res.status(500).json({
    success: false,
    message: "Login failed.",
    data: error.message,
  });
  }
};

const logout = async (req, res) => {
  res.clearCookie("token")
  res.status(200).json({
    success: true,
    message: "Logged out successfully.."
  })
};

export { signup, login, logout, verifyEmail };
