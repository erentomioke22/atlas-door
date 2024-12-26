import { NextResponse ,NextRequest} from "next/server";
import { prisma } from "@utils/database"
import { deleteVerificationTokenById } from "@data/verification-token";






export async function POST(req) {
  try {
    const token = await req.nextUrl.searchParams.get('token');
    const existingToken = await prisma.verificationToken.findFirst({where:{token}});

    if (!existingToken) {
      return NextResponse.json({ error: "Invalid token" });
    }

    const hasExpired = new Date(existingToken.expires) < new Date();

    if (hasExpired) {
      return NextResponse.json({ error: "Token has expired" });
    }

    const existingUser = await prisma.user.findFirst({ where: { email: existingToken.email } });

    if (!existingUser) {
      return NextResponse.json({ error: "User not found" });
    }

    await prisma.user.update({
      where: { id: existingUser.id },
      data: { emailVerified: new Date(), email: existingToken.email }
    });
    //  console.log(existingToken.id);
     const verificationId = existingToken.id;

     await deleteVerificationTokenById(verificationId);
    // await prisma.verificationToken.delete({ where: { id: existingToken.id } });

    return NextResponse.json({ message: "Email verified",data:existingToken.id });
  } catch (error) {
    // console.log(error);
    return NextResponse.json({ error: error, status: 400 });
  }
}
