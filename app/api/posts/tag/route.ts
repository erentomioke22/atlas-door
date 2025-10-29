import { prisma } from "@/utils/database";
import { getPostDataInclude } from "@/lib/types";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/get-session";

interface TagPostsResponse {
  posts: any[];
  count: number;
}

export async function GET(
  req: NextRequest
): Promise<NextResponse<TagPostsResponse | { error: string }>> {
  try {
    const pgnum = +(req.nextUrl.searchParams.get("pgnum") ?? 0);
    const pgsize = +(req.nextUrl.searchParams.get("pgsize") ?? 10);

    const session = await getServerSession();

    const posts = await prisma.post.findMany({
      include: getPostDataInclude(session?.user?.id),
      orderBy: [{ createdAt: "desc" }],
      skip: pgnum * pgsize,
      take: pgsize,
    });

    const count = await prisma.post.count({});

    return NextResponse.json({ posts, count });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
