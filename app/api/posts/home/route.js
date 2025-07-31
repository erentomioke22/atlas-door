import { prisma } from "@utils/database";
import { getPostDataInclude,getProductDataInclude } from "@/lib/types";
import { auth } from "@/auth";
// export const dynamic = 'force-dynamic';

export async function GET(req) {
  try {
    const category = req.nextUrl.searchParams.get("category") || undefined;
    // const cursor = req.nextUrl.searchParams.get("cursor") || undefined;
    // const pageSize = 10;

    const  session  = await auth();
    const userId = session?.user?.id || null;

    // if (!userId) {
    //   return Response.json({ error: "Unauthorized" }, { status: 401 });
    // }
    
    


    let posts;
    switch (category) {
      case 'following':
         posts = await prisma.post.findMany({
          // where: {
          //   user: {
          //     followers: {
          //       some: {
          //         followerId: userId,
          //       },
          //     },
          //   },
          //   userId: {
          //     notIn: blockedIds ?? []
          //   },
          //   save:false
          // },
          orderBy: { createdAt: "desc" },
          take: pageSize + 1,
          cursor: cursor ? { id: cursor } : undefined,
          include: getPostDataInclude(userId),
        });
        break;
      case 'popular':
          posts = await prisma.post.findMany({
          //  where: {
          //    userId: {
          //      notIn: blockedIds ?? []
          //    },
          //    save:false
          //  },
           include: getPostDataInclude(userId),
           orderBy: [
             {likes: {_count:"desc"} },
             {views: {_count:"desc"} }, 
             {createdAt: "desc" },
           ],
           take: 6,
          //  take: pageSize + 1,
          //  cursor: cursor ? { id: cursor } : undefined,
         });
        break;
      case 'new-post':
          posts = await prisma.post.findMany({
          //  where: {
          //    userId: {
          //      notIn: blockedIds ?? []
          //    },
          //    save:false
          //  },
           include: getPostDataInclude(userId),
           orderBy: {createdAt: "desc"},
           take: 6,
          //  take: pageSize + 1,
          //  cursor: cursor ? { id: cursor } : undefined,
         });
        break;
      case 'for-you':
          posts = await prisma.post.findMany({
          //  where: {
          //    userId: {
          //      notIn: blockedIds ?? []
          //    },
          //    save: false,
          //    tags: {
          //      some: {
          //        id: {
          //          in: followedTagIds,
          //        },
          //      },
          //    },
          //  },
           include: getPostDataInclude(userId),
           orderBy: { createdAt: "desc" },
           take: 6,
          //  take: pageSize + 1,
          //  cursor: cursor ? { id: cursor } : undefined,
         });
        break;
      default:
        posts = await prisma.post.findMany({
           include: getPostDataInclude(userId),
           orderBy: { createdAt: "desc" },
           take: 6,

          //  take: pageSize + 1,
          //  cursor: cursor ? { id: cursor } : undefined,
        });
    }


    let products;
    switch (category) {
      case 'following':
         products = await prisma.product.findMany({
          // where: {
          //   user: {
          //     followers: {
          //       some: {
          //         followerId: userId,
          //       },
          //     },
          //   },
          //   userId: {
          //     notIn: blockedIds ?? []
          //   },
          //   save:false
          // },
          orderBy: { createdAt: "desc" },
          take: pageSize + 1,
          cursor: cursor ? { id: cursor } : undefined,
          include: getProductDataInclude(userId),
        });
        break;
      case 'popular':
          products = await prisma.product.findMany({
          //  where: {
          //    userId: {
          //      notIn: blockedIds ?? []
          //    },
          //    save:false
          //  },
           include: getProductDataInclude(userId),
           orderBy: [
             {likes: {_count:"desc"} },
             {views: {_count:"desc"} }, 
             {createdAt: "desc" },
           ],
           take: 6,
          //  take: pageSize + 1,
          //  cursor: cursor ? { id: cursor } : undefined,
         });
        break;
      case 'new-post':
          products = await prisma.product.findMany({
          //  where: {
          //    userId: {
          //      notIn: blockedIds ?? []
          //    },
          //    save:false
          //  },
           include: getProductDataInclude(userId),
           orderBy: {createdAt: "desc"},
           take: 6,
          //  take: pageSize + 1,
          //  cursor: cursor ? { id: cursor } : undefined,
         });
        break;
      case 'for-you':
          products = await prisma.product.findMany({
          //  where: {
          //    userId: {
          //      notIn: blockedIds ?? []
          //    },
          //    save: false,
          //    tags: {
          //      some: {
          //        id: {
          //          in: followedTagIds,
          //        },
          //      },
          //    },
          //  },
           include: getProductDataInclude(userId),
           orderBy: { createdAt: "desc" },
           take: 6,
          //  take: pageSize + 1,
          //  cursor: cursor ? { id: cursor } : undefined,
         });
        break;
      default:
        products = await prisma.product.findMany({
           include: getProductDataInclude(userId),
           orderBy: { createdAt: "desc" },
           take: 6,

          //  take: pageSize + 1,
          //  cursor: cursor ? { id: cursor } : undefined,
        });
    }



    // const nextCursor = posts.length > pageSize ? posts[pageSize].id : null;

    // const data = {
    //   posts: posts.slice(0, pageSize) ?? [],
    //   nextCursor,
    // };
    // return Response.json(data);
    return Response.json({posts,products});
  } catch (error) {
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
