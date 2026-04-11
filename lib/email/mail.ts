import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASS,
  },
});

export const sendOTPMail = async (email: string, otp: string) => {

  const mailOptions = {
    from: `"Hostel Management System" <${process.env.EMAIL_SERVER_USER}>`,
    to: email,
    subject: `Auth Code: ${otp}`,
    text: `Your verification code: ${otp}. Expires in 10 minutes.`,
    html: `
      <div style="font-family: monospace; padding: 40px; border-radius: 4px;">
        <p style="font-size: 14px; margin-bottom: 30px;">
          OTP to reset your password is ${otp}. If you didn't request this, please ignore this email.:
        </p>

        <p style="font-size: 11px; margin-top: 30px; line-height: 1.6;">
          Exp: 10_MINUTES<br />
        </p>
      </div>
    `,
  };

  return await transporter.sendMail(mailOptions);
};