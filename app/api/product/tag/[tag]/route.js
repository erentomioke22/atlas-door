import { prisma } from "@utils/database";
import { getProductDataInclude } from "@/lib/types";
import { auth } from "@/auth";


export async function GET(req,{params}) {
  try {
    const pgnum = +(req.nextUrl.searchParams.get('pgnum') ?? 0);
    const pgsize = +(req.nextUrl.searchParams.get('pgsize') ?? 10);
    const category = req.nextUrl.searchParams.get("category") || undefined;

    const session = await auth();
    // const {tag} = await params;



    let products;
    switch (category) {
      case 'following':
         products = await prisma.product.findMany({
          where:{
              // tags:{
              //     some:{
              //         name:tag
              //     },
              // },
              //   status:"PUBLISHED"
          },
        include: getProductDataInclude(session?.user?.id),
        skip:pgnum * pgsize,
        take: pgsize,
      });
        break;
      case 'popular':
         products = await prisma.product.findMany({
          where:{
            // tags:{
            //     some:{
            //         name:tag
            //     },
            // },
            //   status:"PUBLISHED"
         },
          include: getProductDataInclude(session?.user?.id),
          orderBy: [
            {comments: {_count:"desc"} }, 
            {cartItems: { _count: 'desc' } },  
            {createdAt: "desc" },
          ],
          skip:pgnum * pgsize,
          take: pgsize,
        });
        break;
      case 'new-product':
         products = await prisma.product.findMany({
          where:{
            // tags:{
            //     some:{
            //         name:tag
            //     },
            // },
            //   status:"PUBLISHED"
         },
          include: getProductDataInclude(session?.user?.id),
          orderBy: {createdAt: "desc"},
          skip:pgnum * pgsize,
          take: pgsize,
        });
        break;
      case 'best-sell':
         products = await prisma.product.findMany({
          where:{
            // tags:{
            //     some:{
            //         name:tag
            //     },
            // },
            //   status:"PUBLISHED"
         },
          include: getProductDataInclude(session?.user?.id),
          orderBy: [
            { orderItems: { _count: 'desc' } }, 
            { cartItems: { _count: 'desc' } },  
            { createdAt: 'desc' },              
          ],
          skip:pgnum * pgsize,
          take: pgsize,
        });
        break;
      default:
        products = await prisma.product.findMany({
          include: getProductDataInclude(session?.user?.id),
          orderBy: {createdAt: "desc"},
          skip:pgnum * pgsize,
          take: pgsize,
        });
    }

    const count = await prisma.product.count({ 
      where:{
        // tags:{
        //     some:{
        //         name:params.tag
        //     },
        // },
    },});

    return Response.json({products,count});

  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}