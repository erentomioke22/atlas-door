import { prisma } from "@utils/database";
import { getPostDataInclude } from "@/lib/types"; // Adjust as needed
import { auth } from "@/auth";

export async function GET(req) {
  try {
    const session = await auth();
    const postTitle = req.nextUrl.searchParams.get("postTitle") || "";
    // const postId = req.nextUrl.searchParams.get("postId") || "";
    // const postTags = req.nextUrl.searchParams.get("postTags") || [];


    const postId = req.nextUrl.searchParams.get("postId") || "";
    // Fetch the current post to get its tags
    const currentPost = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        tags: true,
      },
    });

    if (!currentPost) {
      return new Response(JSON.stringify({ error: "هیچ مقاله ای یافت نشد" }), { status: 404 });
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
                  contains: postTitle, // Adjust as needed for minimum letters
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
      orderBy: [
        { comments: { _count: "desc" } },
        { createdAt: "desc" },
      ],
      take: 6,
    });

        return Response.json(posts);
  } catch (error) {
    console.log(error)
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
}
