import nodemailer from 'nodemailer';

export const sendEmail = async ({ to, subject, text, html }) => {
  try {
    // Configure transporter for Gmail (use App Password, not your actual Gmail password)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    // Send the email
    const info = await transporter.sendMail({
      from: `"StayFinder 🏡" <${process.env.SMTP_EMAIL}>`,
      to,
      subject,
      text: text || html?.replace(/<[^>]+>/g, ''), // fallback: plain text from HTML
      html,
    });

    console.log(`📧 Email sent to ${to}: ${info.messageId}`);
  } catch (error) {
    console.error('❌ Failed to send email:', error.message);
    throw error;
  }
};
