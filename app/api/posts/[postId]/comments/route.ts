import { prisma } from "@/utils/database";
import { getCommentDataInclude } from "@/lib/types";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/get-session";

interface CommentsResponse {
  comments: any[];
  nextCursor: string | null;
}

interface RouteParams {
  params: Promise<{ postId: string }>;
}

export async function GET(
  req: NextRequest,
  { params }: RouteParams
): Promise<NextResponse<CommentsResponse | { error: string }>> {
  try {
    const { postId } = await params;
    const category = req.nextUrl.searchParams.get("category") || undefined;
    const cursor = req.nextUrl.searchParams.get("cursor") || undefined;
    const pageSize = 10;

    const session = await getServerSession();

    let comments: any[];
    switch (category) {
      case "toppest":
        comments = await prisma.comment.findMany({
          where: {
            postId: postId,
          },
          include: getCommentDataInclude(session?.user?.id),
          orderBy: [
            { replies: { _count: "desc" } },
            // { likes: { _count: "desc" } },
            { createdAt: "desc" },
          ],
          take: pageSize + 1,
          cursor: cursor ? { id: cursor } : undefined,
        });
        break;
      case "latest":
        comments = await prisma.comment.findMany({
          where: {
            postId: postId,
          },
          include: getCommentDataInclude(session?.user?.id),
          orderBy: { createdAt: "desc" },
          take: pageSize + 1,
          cursor: cursor ? { id: cursor } : undefined,
        });
        break;
      default:
        comments = await prisma.comment.findMany({
          where: { postId: postId },
          include: getCommentDataInclude(session?.user?.id),
          take: pageSize + 1,
          cursor: cursor ? { id: cursor } : undefined,
        });
    }

    const nextCursor =
      comments.length > pageSize ? comments[pageSize].id : null;

    const data: CommentsResponse = {
      comments: comments.slice(0, pageSize),
      nextCursor,
    };

    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
