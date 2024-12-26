import { prisma } from "@utils/database"
import { NextResponse } from "next/server"; 
import { auth } from "@auth";
import { getPostDataInclude, PostsPage } from "@/lib/types";
import { NextRequest } from "next/server";



export async function GET(req) {
  try {
    const searchQuery = await req.nextUrl.searchParams.get('searchQuery')
    const session = await auth()

    const posts = await prisma.post.findMany({
      where: {
        OR: [
          {
            title: {
              contains: searchQuery,
            },
          },
          {
            user: {
              displayName: {
                contains: searchQuery,
              },
            },
          },
          {
            user: {
              name: {
                contains: searchQuery,
              },
            },
          },
        ],
      },
      include: getPostDataInclude(session?.user?.id),
      orderBy: { createdAt: "desc" },
    });



    return Response.json(posts);
  } catch (error) {
    // console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}