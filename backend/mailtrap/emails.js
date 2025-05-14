import {
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
  VERIFICATION_EMAIL_TEMPLATE,
} from "./email-templates.js";
import { mailtrapClient, sender } from "./mailtrap-config.js";

const sendVerificationEmail = async (email, verificationToken) => {
  const recipient = [{ email }];

  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Verify your email",
      html: VERIFICATION_EMAIL_TEMPLATE.replace(
        "{verificationCode}",
        verificationToken
      ),
      category: "Email Verification",
    });

    console.log(`Email sent successfully. Data: ${response}`);
  } catch (error) {
    console.log(`Error sending verification email. Code: ${error}`);
    throw new Error(`Error sending verification email. Code: ${error}`);
  }
};

const sendWelcomeEmail = async (email, name) => {
  const recipient = [{ email }];
  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      template_uuid: "b54c0579-8aa8-4ed2-b572-df87971f698a",
      template_variables: {
        name: name,
        company_info_name: "P.SENN ANIME STREAMING",
      },
    });

    console.log(`Email sent successfully. Response: ${response}`);
  } catch (error) {
    console.log(`Error sending email: ${error}`);

    throw new Error(`Error sending email: ${error}`);
  }
};

const sendPasswordResetEmail = async (email, resetURL) => {
  const recipient = [{ email }];
  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Reset your password",
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
      category: "Password Reset",
    });
  } catch (error) {
    console.log(`Error sending password reset email`, error);

    throw new Error(`Error sending password reset email: ${error}`);
  }
};

const sendResetSuccessEmail = async (email) => {
  const recipient = [{ email }]
  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Password reset successful!",
      html: PASSWORD_RESET_SUCCESS_TEMPLATE,
      category: "Password Reset",
    })

    console.log(`Password reset email was sent successfully. Code: ${response}`)
  } catch (error) {
    console.error(`Error sending password reset success email: ${error}`)

    throw new Error(`Error sending password reset success email: ${error}`)
  }
};

export {
  sendVerificationEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendResetSuccessEmail,
};
