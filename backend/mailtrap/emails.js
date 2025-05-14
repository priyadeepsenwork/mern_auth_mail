import { VERIFICATION_EMAIL_TEMPLATE } from "./email-templates.js";
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

    console.log(`Email sent successfully. Response: ${response}`)
  } catch (error) {
    console.log(`Error sending email: ${error}`)

    throw new Error(`Error sending email: ${error}`)
  }
};

export {
    sendVerificationEmail,
    sendWelcomeEmail
}
