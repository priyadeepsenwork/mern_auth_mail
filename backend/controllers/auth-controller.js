import bcrypt from "bcryptjs";
import crypto from "crypto";

import { User } from "../models/user-model.js";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import {
  sendVerificationEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendResetSuccessEmail,
} from "../mailtrap/emails.js";
import { resourceLimits } from "worker_threads";

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
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Credentials" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Credentials" });
    }

    generateTokenAndSetCookie(res, user._id);

    user.lastLoginDate = new Date();
    await user.save();
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
  res.clearCookie("token");
  res.status(200).json({
    success: true,
    message: "Logged out successfully..",
  });
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found with the provided email! Please Try again ...",
      });
    }

    //* Generate reset token
    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpiryDate = Date.now() + 1 * 60 * 60 * 1000; //1 hour
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiresAt = resetTokenExpiryDate;

    await user.save();

    //send the email
    await sendPasswordResetEmail(
      user.email,
      `${process.env.CLIENT_URL}/reset-password/${resetToken}`
    );

    res.status(200).json({
      success: true,
      message: "Password reset link is sent to your MailBox. Please check it.",
    });
  } catch (error) {
    console.log(`Error in forgot password: ${error}`);

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: `Invalid or expired reset token`,
      });
    }

    //update password and also the tokens
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;

    await user.save();

    await sendResetSuccessEmail(user.email);

    res.status(200).json({
      success: true,
      message: "Password has been reset successfully!",
    });
  } catch (error) {
    console.log(`Error in reset password. Code: ${error}`);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const checkAuth = async (req, res) => {
  try {
    const user = await User.findById(req.userId)
    if(!user){
      return res.status(400).json({
        success: false,
        message: `User not found`,
      });
    }

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    console.log(`Error in checkAuth. Code: ${error}`)
    res.status(400).json({
      success: false,
      message: error.message
    })
  }
}

export { 
  signup, 
  login, 
  logout, 
  verifyEmail, 
  forgotPassword, 
  resetPassword,
  checkAuth
};
