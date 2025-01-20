import { prisma } from "@utils/database";
import { getPostDataInclude, PostsPage } from "@/lib/types";
import { auth } from "@/auth";


export async function GET(req,{params}) {
  try {
    const session = auth()
    const posts = await prisma.post.findMany({
      include: getPostDataInclude(session?.user?.id),
      orderBy: {createdAt: "desc"},
      take: 6,
    });

    return Response.json(posts);

  } catch (error) {
    // console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}