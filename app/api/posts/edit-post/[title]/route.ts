import { prisma } from "@/utils/database";
import { getPostDataInclude } from "@/lib/types";
import { getServerSession } from "@/lib/get-session";
import { NextRequest, NextResponse } from "next/server";
import { PostLite } from "@/components/posts/postCard";

interface RouteParams {
  params: Promise<{ title: string }>;
}

export async function GET(
  req: NextRequest,
  { params }: RouteParams
): Promise<NextResponse<PostLite | { error: string }>> {
  try {
    const session = await getServerSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title } = await params;

    const post = await prisma.post.findFirst({
      include: getPostDataInclude(session?.user?.id),
      where: { slug: title },
    });

    if (!post) {
      return NextResponse.json(
        { error: "not found any post" },
        { status: 404 }
      );
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
