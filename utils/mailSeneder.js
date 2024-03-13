import nodemailer from 'nodemailer'

const sendEmail = async (email, subject, text) => {
    try {
      const transporter = nodemailer.createTransport({
        service: "Gmail",
        tls: {
          rejectUnauthorized: false
        },
        auth: {
          user: 'nikolai.blashchuk@gmail.com',
          pass: 'dcqr vsur zdtr zlbi',
        },
      });
  
      await transporter.sendMail({
        from: 'nikolai.blashchuk@gmail.com',
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