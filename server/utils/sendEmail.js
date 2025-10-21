const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, htmlContent) => {
  const transporter = nodemailer.createTransport({
    service: "gmail", // or use "hotmail", "yahoo" etc.
    auth: {
      user: process.env.EMAIL_USER, // your email
      pass: process.env.EMAIL_PASS, // your app password (not your normal password)
    },
  });

  const mailOptions = {
    from: `"Evangadi Forum" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html: htmlContent,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
