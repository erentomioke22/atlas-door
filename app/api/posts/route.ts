import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/utils/database";
import { getPostDataInclude } from "@/lib/types";
import { getServerSession } from "@/lib/get-session";

interface PostResponse {
  id: string;
  title: string;
  desc: string;
  slug: string;
  content: string;
  images: string[];
  status: string;
  discussions: boolean;
  isHot: boolean;
  userId: string;
  createdAt: Date;
  expiresAt: Date | null;
  updatedAt: Date;
  user: any;
  tags: any[];
  _count: {
    comments: number;
  };
}

export async function GET(
  req: NextRequest
): Promise<NextResponse<PostResponse | { error: string }>> {
  try {
    const session = await getServerSession();
    const postTitle = req.nextUrl.searchParams.get("postTitle");

    if (!postTitle) {
      return NextResponse.json(
        { error: "Post title is required" },
        { status: 400 }
      );
    }

    const currentPost = await prisma.post.findFirst({
      where: { slug: postTitle , status: "PUBLISHED",},
      include: getPostDataInclude(session?.user?.id),
    });

    if (!currentPost) {
      return NextResponse.json(
        { error: "not found any post" },
        { status: 404 }
      );
    }

    return NextResponse.json(currentPost);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
