import { NextResponse ,NextRequest} from "next/server";
import { prisma } from "@utils/database"







export async function POST(req) {
  try {
    const {message, type, url,reason } =await req.json();
    await prisma.report.create({
      data:{
        message,
        type,
        reason,
        url
      }
    });

    return NextResponse.json({});
  } catch (error) {
    // console.log(error);
    return NextResponse.json({ error: error, status: 400 });
  }
}
