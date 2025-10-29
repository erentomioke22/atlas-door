// lib/email-templates.ts
export const generateVerificationTemplate = (link: string,description:string): string =>  `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>تایید ایمیل</title>
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
            color: #13ce66;
            margin-bottom: 10px;
        }
        .button {
            display: inline-block;
            padding: 12px 24px;
            background-color: #13ce66;
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
        <p>${description}</p>
        
        <div style="text-align: center;">
            <a href="${link}" class="button">تایید کردن ایمیل</a>
        </div>
        
        <p>اگر با ضربه روی کلید عملی انجام نشد دامنه را روی مرورگر اجرا کنید:</p>
        <p><a href="${link}">${link}</a></p>
        
        <p>اگر شما اکانتی به این نام نساختید این ایمیل را نادیدیه یا حذف کنید</p>
        
        <div class="footer">
            <p>© ${new Date().getFullYear()} ATLAS DOOR. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`;

export const generatePasswordResetTemplate = (link: string,description:string): string => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>بازنشانی رمز عبور</title>
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
            color: #13ce66;
            margin-bottom: 10px;
        }
        .button {
            display: inline-block;
            padding: 12px 24px;
            background-color: #13ce66;
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
            <h2>بازنشانی رمز عبور</h2>
        </div>
        
        <p>${description}</p>
        
        <div style="text-align: center;">
            <a href="${link}" class="button">بازنشانی رمز عبور</a>
        </div>
        
        <p>اگر با ضربه روی کلید عملی انجام نشد دامنه را روی مرورگر اجرا کنید:</p>
        <p><a href="${link}">${link}</a></p>
        
        <p>اگر شما اکانتی به این نام نساختید این ایمیل را نادیدیه یا حذف کنید</p>
        
        <div class="footer">
            <p>© ${new Date().getFullYear()} ATLAS DOOR. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`;

export const generateEmailChangeTemplate = (newEmail: string, url: string): string => `
// تمپلیت برای تغییر ایمیل
`;