import { validateRequest } from "@/auth";
import { prisma } from "@utils/database";
import { getPostDataInclude, PostsPage } from "@/lib/types";
import { auth } from "@/auth";



export async function GET(req,{params}) {
  try {
    const session = await auth();

    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const posts = await prisma.post.findFirst({
      include: getPostDataInclude(session?.user?.id),
      where:{link:params.title},
    });


    return Response.json(posts);
  } catch (error) {
    // console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}