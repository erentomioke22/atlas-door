import { prisma } from "@utils/database";
import { getPostDataInclude, PostsPage } from "@/lib/types";
import { auth } from "@/auth";


export async function GET(req,{params}) {
  try {
    const pgnum = +(req.nextUrl.searchParams.get('pgnum') ?? 0);
    const pgsize = +(req.nextUrl.searchParams.get('pgsize') ?? 10);

    const session = await auth();

    const posts = await prisma.post.findMany({
        where:{
            tags:{
                some:{
                    name:params.tag
                },
            },
        },
      include: getPostDataInclude(session?.user?.id),
      orderBy: [
        {createdAt: "desc" },
      ],
      skip:pgnum * pgsize,
      take: pgsize,
    });

    const count = await prisma.post.count({ 
    where:{
      tags:{
          some:{
              name:params.tag
          },
      },
  },});

    return Response.json({posts,count});
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}