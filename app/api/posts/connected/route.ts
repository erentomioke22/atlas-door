import { prisma } from "@/utils/database";
import { getPostDataInclude } from "@/lib/types";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/get-session";
import { PostLite } from "@/components/posts/postCard";

export async function GET(
  req: NextRequest
): Promise<NextResponse<{ posts: PostLite[] } | { error: string }>> {
  try {
    const session = await getServerSession();
    const postTitle = req.nextUrl.searchParams.get("postTitle") || "";
    const postId = req.nextUrl.searchParams.get("postId") || "";

    if (!postId) {
      return NextResponse.json(
        { error: "Post ID is required" },
        { status: 400 }
      );
    }

    const currentPost = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        tags: true,
      },
    });

    if (!currentPost) {
      return NextResponse.json(
        { error: "هیچ مقاله ای یافت نشد" },
        { status: 404 }
      );
    }

    // Extract tag IDs from the current post
    const tagIds = currentPost.tags.map((tag) => tag.id);

    // Fetch similar posts based on title or tags, excluding the current post
    const posts = await prisma.post.findMany({
      where: {
        AND: [
          {
            NOT: {
              id: postId,
            },
          },
          {
            OR: [
              {
                title: {
                  contains: postTitle,
                  mode: "insensitive",
                },
              },
              {
                tags: {
                  some: {
                    id: {
                      in: tagIds,
                    },
                  },
                },
              },
            ],
          },
        ],
      },
      include: getPostDataInclude(session?.user?.id),
      orderBy: [{ comments: { _count: "desc" } }, { createdAt: "desc" }],
      take: 6,
    });

    return NextResponse.json({ posts });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
