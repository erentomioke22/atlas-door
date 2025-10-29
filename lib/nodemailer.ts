import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  service: 'gmail',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER || 'atlastechnology1010@gmail.com',
    pass: process.env.EMAIL_PASS || 'ckde qxoj cjnq auxm',
  },
});

export default transporter;