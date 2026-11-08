
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const sendOtpEmail = async (email, otp) => {
  try {
    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          name: "T-ResumeIQ Team",
          email: process.env.EMAIL_FROM,
        },

        to: [
          {
            email: email,
          },
        ],

        subject: "Your Email Verification OTP",

        htmlContent: `
          <div style="font-family: Arial; padding: 20px;">
            <h2>Welcome to TotaResumeIQ!</h2>
            <p>Your email verification OTP is:</p>
            <h1 style="color: #7657ff; letter-spacing: 8px;">
              ${otp}
            </h1>
            <p>This OTP will expire in 10 minutes.</p>
          </div>
        `,
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Email sending failed:",
      error.response?.data || error.message
    );

    throw new Error("Unable to send OTP email");
  }
};

export default sendOtpEmail;
