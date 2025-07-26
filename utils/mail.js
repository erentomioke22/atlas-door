// import nodemailer from 'nodemailer';

// const domain = process.env.NEXT_PUBLIC_BASE_URL

// export const sendVerificationEmail = async(email,token)=> {
//     const confirmationLink = `${domain}/verify-email?token=${token}`
//     let transporter = nodemailer.createTransport({
//         service: 'gmail',
//         auth: {
//           user: 'atlastechnology1010@gmail.com', 
//           pass: 'ckde qxoj cjnq auxm'
//         }
//       });
    
//     await transporter.sendMail({
//       from:{
//          address:'atlastechnology1010@gmail.com',
//          name:'ATLAS TECH',
//       },
//       to:`${email}`,
//       subject: 'verify your email',
//       html:`<p>click <a href="${confirmationLink}">here</a> to verify your email</p>`,
//     });

// }


import nodemailer from 'nodemailer';

const domain = process.env.NEXT_PUBLIC_BASE_URL;

export const sendVerificationEmail = async (email, token) => {
    const confirmationLink = `${domain}/verify-email?token=${token}`;
    
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'atlastechnology1010@gmail.com', 
            pass: 'ckde qxoj cjnq auxm'
        }
    });

    const htmlTemplate = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Verification</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
            }
            .container {
                border: 1px solid #e0e0e0;
                border-radius: 8px;
                padding: 30px;
                background-color: #f9f9f9;
            }
            .header {
                text-align: center;
                margin-bottom: 30px;
            }
            .logo {
                font-size: 24px;
                font-weight: bold;
                color: #2563eb;
                margin-bottom: 10px;
            }
            .button {
                display: inline-block;
                padding: 12px 24px;
                background-color: #2563eb;
                color: white !important;
                text-decoration: none;
                border-radius: 4px;
                font-weight: bold;
                margin: 20px 0;
            }
            .footer {
                margin-top: 30px;
                font-size: 12px;
                color: #666;
                text-align: center;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">ATLAS DOOR</div>
                <h2>ایمیلتان را تایید کنید</h2>
            </div>
            
            <p>با تشکر از ثبت نام در سرویس ما. برای تکمیل ثبت نام خود، لطفا ایمیل خود را تایید کنید با ضربه روی دکمه زیر:</p>
            
            <div style="text-align: center;">
                <a href="${confirmationLink}" class="button">تایید کردن ایمیل</a>
            </div>
            
            <p>اگر با ضربه روی کلید عملی انجام نشد دامنه را روی مرورگر اجرا کنید:</p>
            <p><a href="${confirmationLink}">${confirmationLink}</a></p>
            
            <p>اگر شما اکانتی به این مام نساختید این ایمیل را نادیدیه یا حذف کنید</p>
            
            <div class="footer">
                <p>© ${new Date().getFullYear()} ATLAS DOOR. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    `;

    await transporter.sendMail({
        from: {
            address: 'atlastechnology1010@gmail.com',
            name: 'ATLAS TECH',
        },
        to: email,
        subject: 'Verify your email address',
        html: htmlTemplate,
    });
};