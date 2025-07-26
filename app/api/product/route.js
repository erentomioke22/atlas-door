import { prisma } from "@utils/database";
import { getProductDataInclude } from "@/lib/types";
import { auth } from "@/auth";


export async function GET(req) {
  try {
    const category = req.nextUrl.searchParams.get("category") || undefined;
    const cursor = req.nextUrl.searchParams.get("cursor") || undefined;
    const pageSize = 10;

    const  session  = await auth();
    const userId = session?.user?.id || undefined;



    let products;
    switch (category) {
      case 'following':
         products = await prisma.product.findMany({
          where: {
            colors:{
              some:{
                status:"EXISTENT"
              }
            },
          },
          orderBy: { createdAt: "desc" },
          take: pageSize + 1,
          cursor: cursor ? { id: cursor } : undefined,
          include: getPostDataInclude(userId),
        });
        break;
      case 'popular':
          products = await prisma.product.findMany({
           where: {
            colors:{
              some:{
                status:"EXISTENT"
              }
            }
           },
           include: getProductDataInclude(userId),
           orderBy: [
             {likes: {_count:"desc"} },
             {views: {_count:"desc"} }, 
             {createdAt: "desc" },
           ],
           take: pageSize + 1,
           cursor: cursor ? { id: cursor } : undefined,
         });
        break;
      case 'new-product':
          products = await prisma.product.findMany({
           where: {
                         colors:{
              some:{
                status:"EXISTENT"
              }
            },
           },
           include: getProductDataInclude(userId),
           orderBy: {createdAt: "desc"},
           take: pageSize + 1,
           cursor: cursor ? { id: cursor } : undefined,
         });
        break;
      case 'for-you':
          products = await prisma.product.findMany({
           where: {
                         colors:{
              some:{
                status:"EXISTENT"
              }
            },
             tags: {
               some: {
                 id: {
                   in: followedTagIds,
                 },
               },
             },
           },
           include: getProductDataInclude(userId),
           orderBy: { createdAt: "desc" },
           take: pageSize + 1,
           cursor: cursor ? { id: cursor } : undefined,
         });
        break;
      default:
        products = await prisma.product.findMany({
           include: getProductDataInclude(userId),
           orderBy: { createdAt: "desc" },
           take: pageSize + 1,
           cursor: cursor ? { id: cursor } : undefined,
        });
    }



    const nextCursor = products.length > pageSize ? products[pageSize].id : null;

    const data = {
      products: products.slice(0, pageSize) ?? [],
      nextCursor,
    };
    return Response.json(data);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}


    // if (!userId) {
    //   return Response.json({ error: "Unauthorized" }, { status: 401 });
    // }
    
    // const includeData = getPostDataInclude(userId);
    
    // if (!includeData) {
    //   console.error("getPostDataInclude returned null or undefined");
    //   return Response.json({ error: "Internal server error" }, { status: 403 });
    // }

    // const blockedUserIds = await prisma.block.findMany({
    //   where: {
    //     OR: [
    //       { blockerId: session?.user.id },
    //       { blockingId: session?.user.id }
    //     ]
    //   },
    //   select: {
    //     blockerId: true,
    //     blockingId: true
    //   }
    // });

    // const blockedIds = blockedUserIds.map(block => 
    //   block.blockerId === session?.user.id ? block.blockingId : block.blockerId
    // );

    // const followedTags = await prisma.tag.findMany({
    //   where: {
    //     users: {
    //       some: {
    //         id: session?.user.id,
    //       },
    //     },
    //   },
    // });

    // const followedTagIds = followedTags.map(tag => tag.id);

    // console.log("Session ID:", session?.user?.id);
    // console.log("Blocked IDs:", blockedIds);
    // console.log("Category:", category);
    // console.log("Followed Tags:", followedTagIds);