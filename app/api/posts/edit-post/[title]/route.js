import { validateRequest } from "@/auth";
import { prisma } from "@utils/database";
import { getPostDataInclude, PostsPage } from "@/lib/types";
import { auth } from "@/auth";
import { NextResponse } from "next/server";



export async function GET(req,{params}) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const post = await prisma.post.findFirst({
      include: getPostDataInclude(session?.user?.id),
      where:{link:params.title},
    });

    if(!post) return NextResponse.json({error:'not found any post'},{status:400});

    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}