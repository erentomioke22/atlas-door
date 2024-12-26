import { prisma } from "@utils/database";
import { getPostDataInclude, PostsPage } from "@/lib/types";
import { auth } from "@/auth";


export async function GET(req) {
  try {
    const cursor = req.nextUrl.searchParams.get("cursor") || undefined;

    const pageSize = 10;

    const session = await auth();

    // if (!session) {
    //   return Response.json({ error: "Unauthorized" }, { status: 401 });
    // }

    const posts = await prisma.post.findMany({
      include: getPostDataInclude(session?.user?.id),
      orderBy: [
        {createdAt: "desc" },
      ],
      take: pageSize + 1,
      cursor: cursor ? { id: cursor } : undefined,
    });

    const nextCursor = posts.length > pageSize ? posts[pageSize].id : null;

    const data = {
      posts: posts.slice(0, pageSize),
      nextCursor,
    };

    return Response.json(data);
  } catch (error) {
    // console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}