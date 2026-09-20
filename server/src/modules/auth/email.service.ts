import { resend } from "../../config/resend.js";

export async function sendOtpEmail(
  email: string,
  otp: string,
  name: string,
) {
  const { data, error } = await resend.emails.send({
    from: "CommunityCare <onboarding@resend.dev>",
    to: email,
    subject: "Verify your CommunityCare account",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 30px;">
        <h2>Welcome to CommunityCare, ${name}!</h2>

        <p>Please use the verification code below to verify your email address:</p>

        <div style="font-size: 32px; font-weight: bold; letter-spacing: 8px; margin: 25px 0;">
          ${otp}
        </div>

        <p>This code will expire in <strong>5 minutes</strong>.</p>

        <p>If you did not create this account, you can safely ignore this email.</p>

        <p>Thanks,<br />CommunityCare Team</p>
      </div>
    `,
  });

  if (error) {
    console.error("Resend email error:", error);
    throw new Error(error.message);
  }

  console.log("Email sent successfully:", data?.id);
}