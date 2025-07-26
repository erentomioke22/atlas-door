import { prisma } from "@utils/database";
import { getPostDataInclude, PostsPage } from "@/lib/types";
import { auth } from "@/auth";


export async function GET(req) {
  try {

    const pgnum = +(req.nextUrl.searchParams.get('pgnum') ?? 0);
    const pgsize = +(req.nextUrl.searchParams.get('pgsize') ?? 10);

    const session = await auth();

    // if (!session) {
    //   return Response.json({ error: "Unauthorized" }, { status: 401 });
    // }

    const posts = await prisma.post.findMany({
      include: getPostDataInclude(session?.user?.id),
      orderBy: [
        {createdAt: "desc" },
      ],
      skip:pgnum * pgsize,
      take: pgsize,
    });

    const count = await prisma.post.count({});

    return Response.json({posts,count});
  } catch (error) {
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}



