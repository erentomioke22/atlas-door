import { prisma } from "@/utils/database";
import { getPostDataInclude } from "@/lib/types";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/get-session";

interface TagPostsResponse {
  posts: any[];
  count: number;
}

interface RouteParams {
  params: Promise<{ tag: string }>;
}

type CategoryType = "following" | "popular" | "new-post";


export async function GET(
  req: NextRequest,
  { params }: RouteParams
): Promise<NextResponse<TagPostsResponse | { error: string }>> {
  try {
    const pgnum = +(req.nextUrl.searchParams.get("pgnum") ?? 0);
    const pgsize = +(req.nextUrl.searchParams.get("pgsize") ?? 10);
    const category = req.nextUrl.searchParams.get("category") as
      | CategoryType
      | undefined;

    const session = await getServerSession();
    const { tag } = await params;

    const baseWhere = {
      status: "PUBLISHED"
    };

    // Build the where condition based on tag
    let whereCondition: any = baseWhere;

    if (tag && tag.trim() !== "" && tag !== "all") {
      whereCondition = {
        ...baseWhere,
        tags: {
          some: {
            name: tag,
          },
        },
      };
    }

    let posts: any[];
    switch (category) {
      case "following":
        posts = await prisma.post.findMany({
          where: whereCondition,
          include: getPostDataInclude(session?.user?.id),
          skip: pgnum * pgsize,
          take: pgsize,
        });
        break;
      case "popular":
        posts = await prisma.post.findMany({
          where: whereCondition,
          include: getPostDataInclude(session?.user?.id),
          orderBy: [{ comments: { _count: "desc" } }, { createdAt: "desc" }],
          skip: pgnum * pgsize,
          take: pgsize,
        });
        break;
      case "new-post":
        posts = await prisma.post.findMany({
          where: whereCondition,
          include: getPostDataInclude(session?.user?.id),
          orderBy: { createdAt: "desc" },
          skip: pgnum * pgsize,
          take: pgsize,
        });
        break;
      default:
        posts = await prisma.post.findMany({
          where: whereCondition,
          include: getPostDataInclude(session?.user?.id),
          orderBy: { createdAt: "desc" },
          skip: pgnum * pgsize,
          take: pgsize,
        });
    }

    const count = await prisma.post.count({
      where: whereCondition,
    });

    return NextResponse.json({ posts, count });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}