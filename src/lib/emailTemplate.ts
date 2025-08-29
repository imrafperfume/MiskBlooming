export function emailVerificationTemplate(link: string, name = "User") {
    return `
  <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: auto; padding: 30px; border: 1px solid #e0e0e0; border-radius: 12px; background-color: #ffffff; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
    <h1 style="color: #1a1a1a; text-align: center; font-size: 24px; margin-bottom: 20px;">Welcome to Miskblooming</h1>

    <p style="color: #555555; font-size: 16px; line-height: 1.6;">
      Hi <strong>${name}</strong>,
    </p>
    <p style="color: #555555; font-size: 16px; line-height: 1.6;">
      Thank you for signing up at <strong>Miskblooming</strong>. To get started, please verify your email address by clicking the button below:
    </p>

    <div style="text-align: center; margin: 35px 0;">
      <a href="${link}" style="background-color: #4CAF50; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: 600; display: inline-block;">
        Verify Email
      </a>
    </div>

    <p style="color: #777777; font-size: 14px; text-align: center;">
      Or copy and paste this link into your browser:
    </p>
    <p style="word-break: break-all; color: #0066cc; font-size: 14px; text-align: center;">
      ${link}
    </p>

    <hr style="margin: 40px 0; border: none; border-top: 1px solid #e0e0e0;">

    <p style="color: #999999; font-size: 12px; text-align: center;">
      If you did not request this email, please ignore it.  
      © ${new Date().getFullYear()} Miskblooming. All rights reserved.
    </p>
  </div>
  `;
}
