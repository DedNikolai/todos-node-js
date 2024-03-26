import nodemailer from 'nodemailer';
import 'dotenv/config';

const sendEmail = async (email, subject, text) => {
    try {
      const transporter = nodemailer.createTransport({
        service: "Gmail",
        tls: {
          rejectUnauthorized: false
        },
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
  
      await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: email,
        subject: subject,
        text: text,
      });
      console.log("email sent sucessfully");
    } catch (error) {
      console.log("email not sent");
      console.log(error);
    }
  };

  export default sendEmail;