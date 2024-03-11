import nodemailer from 'nodemailer'

const sendEmail = async (email, subject, text) => {
    try {
      const transporter = nodemailer.createTransport({
        service: "Gmail",
        tls: {
          rejectUnauthorized: false
        },
        auth: {
          user: 'soloists.academy@gmail.com',
          pass: 'As541035ac0250ar#',
        },
      });
  
      await transporter.sendMail({
        from: 'soloists.academy@gmail.com',
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