import nodemailer from "nodemailer";

export async function sendVerificationEmail(email: string, token: string) {
  const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/verify?token=${token}`;

  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  const mailOptions = {
    to: email,
    subject: "Confirm Your Email Address - Carpola.lk",
    html: `
      <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <div style="text-align: center; padding-bottom: 20px;">
          <img src="https://carpola.lk/logo.png" alt="Carpola.lk" style="width: 120px;"/>
        </div>
        
        <h2 style="color: #4CAF50;">Welcome to Carpola.lk!</h2>
        <p>Hi there,</p>
        <p>Thank you for signing up with Carpola.lk! We're excited to have you on board. To complete your registration, please verify your email address by clicking the link below:</p>
        
        <div style="text-align: center; margin: 20px 0;">
          <a href="${verificationUrl}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Verify Email Address</a>
        </div>
        
        <p>If the button above doesn’t work, you can also verify your email by copying and pasting the following URL into your browser:</p>
        <p style="word-break: break-all;">${verificationUrl}</p>
        
        <p>If you did not create an account with Carpola.lk, please ignore this email.</p>
        
        <p>Best Regards,<br/>
        The Carpola.lk Team</p>
        
        <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;" />
        
        <p style="font-size: 12px; color: #666;">You are receiving this email because you recently created an account or requested email verification on Carpola.lk.</p>
        <p style="font-size: 12px; color: #666;">Carpola.lk, 1234 Some Street, Colombo, Sri Lanka</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}
