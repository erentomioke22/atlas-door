import { NextResponse ,NextRequest} from "next/server";
import nodemailer from 'nodemailer';
import { prisma } from "@utils/database"
import { hash } from "bcryptjs";




export async function POST(req) {
  try {
    const{email}=await req.json();

    function generatePassword() {
      const length = 8;
      const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*~?/";
      let retVal = "";
    
      for (let i = 0; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * charset.length));
      }
    
      return retVal;
    }

    const randomPassword = generatePassword();
    const newPassword = await hash(randomPassword,12)
    const userProvider = await prisma.user.findFirst({where:{email}});
    if(!userProvider){
      return NextResponse.json({error:"this user not exist"})
    }
    if(userProvider.image){
      return NextResponse.json({error:"this account verified"})
    }

    if(userProvider.emailVerified){
      return NextResponse.json({error:"this account verified"})
    }
    const updatedUser = await prisma.user.update({where:{email},data:{password:newPassword}});

    
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
      to:`${updatedUser.email}`,
      subject: 'New Contact Form Submission',
      text: `Name: ${updatedUser.username}\nEmail: ${email}\nMessage: your new passowrd ${randomPassword} please after login change your password`,
    });

   return NextResponse.json({message:"email send",data:randomPassword})
  } catch (error) {
    return NextResponse.json({ error: error });
  }
}


