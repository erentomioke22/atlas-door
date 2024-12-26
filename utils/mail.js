import nodemailer from 'nodemailer';

const domain = 'http://localhost:3000'

export const sendVerificationEmail = async(email,token)=> {
    const confirmationLink = `${domain}/verify-email?token=${token}`
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'atlastechnology1010@gmail.com', 
          pass: 'ckde qxoj cjnq auxm'
        }
      });
    
    await transporter.sendMail({
      from:{
         address:'atlastechnology1010@gmail.com',
         name:'ATLAS TECH',
      },
      to:`${email}`,
      subject: 'verify your email',
      html:`<p>click <a href="${confirmationLink}">here</a> to verify your email</p>`,
    });

}