import { hash } from "bcryptjs";
import { prisma } from "@utils/database"
import { NextResponse } from "next/server"; 
import { generateVerificationToken } from "@utils/token";
import { sendVerificationEmail } from "@utils/mail";




export async function POST(req) {
  try {
    const {name, email, password } =await req.json();
    
    let sanitizedUsername = name.replace(/\s+/g, '_').toLowerCase();
    const usernameRegex = /^(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d_]+$/;

    const randomString = Math.random().toString(36).substring(2, 12);

    sanitizedUsername += `_${randomString}`;

    // console.log(sanitizedUsername);


    const existEmail = await prisma.user.findUnique({
      where: {
          email,
      },
      include: { accounts: true }
    });

    const existName = await prisma.user.findUnique({
      where: {
          name :sanitizedUsername
      },
      include: { accounts: true }
    });
    


    if(existEmail && !existEmail.emailVerified && existEmail.accounts.length <= 0){
      const verificationToken = await generateVerificationToken(email);
      await sendVerificationEmail(email,verificationToken.token)
      return NextResponse.json({ message: "EMAIL VERIFICATION WAS RESEND" });
    }

    if(existName){
        return NextResponse.json({error: "this UserName exist",});
    }
    if(existEmail){
        return NextResponse.json({error: "this Email exist",});
    }


    if (!password) {
      return NextResponse.json({ error: "Password is required",});
    }

    const hashedPassword = await hash(password, 12);
    const newUser = await prisma.user.create({
        data:{
          name:sanitizedUsername,
          displayName:name,
          email:email,
          password:hashedPassword
        }
      });
      
    const verificationToken = await generateVerificationToken(email);
    await sendVerificationEmail(email,verificationToken.token)

    return NextResponse.json({ message: "EMAIL VERIFICATION WAS SEND", user: newUser });
  } catch (error) {
    // console.log(error)
    return NextResponse.json({ error: error });
  }
}

