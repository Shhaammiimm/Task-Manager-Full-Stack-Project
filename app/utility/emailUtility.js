import nodemailer from "nodemailer";

const SendEmail = async (EmailTo, EmailText, EmailSubject) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT),
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      secure: false, // Use STARTTLS
      tls: { rejectUnauthorized: false },
    });

    await transporter.sendMail({
      from: `"Task Manager" <${process.env.EMAIL_USER}>`,
      to: EmailTo,
      subject: EmailSubject,
      text: EmailText,
    });

    console.log(`Email sent to ${EmailTo}`);
    return true;
  } catch (err) {
    console.error("Error sending email:", err);
    return false;
  }
};

export default SendEmail;
