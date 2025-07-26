import { prisma } from "@utils/database";
import { getPostDataInclude, PostsPage } from "@/lib/types";
import { auth } from "@/auth";


export async function GET(req,{params}) {
  try {
    const pgnum = +(req.nextUrl.searchParams.get('pgnum') ?? 0);
    const pgsize = +(req.nextUrl.searchParams.get('pgsize') ?? 10);
    const category = req.nextUrl.searchParams.get("category") || undefined;

    const session = await auth();
    const {tag} = await params;



    let posts;
    switch (category) {
      case 'following':
         posts = await prisma.post.findMany({
          where:{
              tags:{
                  some:{
                      name:tag
                  },
              },
                status:"PUBLISHED"
          },
        include: getPostDataInclude(session?.user?.id),
        skip:pgnum * pgsize,
        take: pgsize,
      });
        break;
      case 'popular':
         posts = await prisma.post.findMany({
          where:{
            tags:{
                some:{
                    name:tag
                },
            },
              status:"PUBLISHED"
         },
          include: getPostDataInclude(session?.user?.id),
          orderBy: [
            {comments: {_count:"desc"} }, 
            {createdAt: "desc" },
          ],
          skip:pgnum * pgsize,
          take: pgsize,
        });
        break;
      case 'new-post':
         posts = await prisma.post.findMany({
          where:{
            tags:{
                some:{
                    name:tag
                },
            },
              status:"PUBLISHED"
         },
          include: getPostDataInclude(session?.user?.id),
          orderBy: {createdAt: "desc"},
          skip:pgnum * pgsize,
          take: pgsize,
        });
        break;
      default:
        posts = await prisma.post.findMany({
          include: getPostDataInclude(session?.user?.id),
          orderBy: {createdAt: "desc"},
          skip:pgnum * pgsize,
          take: pgsize,
        });
    }

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