import { resend } from "../../config/resend.js";
import { escapeHtml } from "../../utils/htmlEscape.js";

export async function sendOtpEmail(email: string, otp: string, name: string) {
  const safeName = escapeHtml(name);

  const { data, error } = await resend.emails.send({
    from: "CommunityCare <onboarding@resend.dev>",
    to: email,
    subject: "Verify your CommunityCare account",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 30px;">
        <h2>Welcome to CommunityCare, ${safeName}!</h2>

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

export async function sendPasswordResetEmail(
  email: string,
  name: string,
  token: string,
) {
  const safeName = escapeHtml(name);

  const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${token}`;

  const { data, error } = await resend.emails.send({
    from: "CommunityCare <onboarding@resend.dev>",
    to: email,
    subject: "Reset your CommunityCare password",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 30px;">
        <h2>Reset your password</h2>

        <p>Hi ${safeName},</p>

        <p>
          We received a request to reset your CommunityCare password.
        </p>

        <p>
          Click the button below to create a new password:
        </p>

        <div style="margin: 30px 0;">
          <a
            href="${resetLink}"
            style="
              display: inline-block;
              padding: 12px 24px;
              background: #000;
              color: #fff;
              text-decoration: none;
              border-radius: 6px;
            "
          >
            Reset Password
          </a>
        </div>

        <p>
          This link will expire in <strong>15 minutes</strong>.
        </p>

        <p>
          If you did not request a password reset, you can safely ignore this email.
        </p>

        <p>
          Thanks,<br />
          CommunityCare Team
        </p>
      </div>
    `,
  });

  if (error) {
    console.error("Resend password reset error:", error);
    throw new Error(error.message);
  }

  console.log("Password reset email sent:", data?.id);
}
