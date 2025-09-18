

// export async function GET(req, { params }) {
//   try {
//     const session = await auth();
//     if (!session) return Response.json({ error: "unauthorized" }, { status: 401 });
//     const { type } = await params;
//     const cursor = req.nextUrl.searchParams.get("cursor") || undefined; 
//     const pageSize = 10;
//     if (type === "admin" && session?.user.role !== "admin") return Response.json({ error: "unauthorized" }, { status: 401 });

//     let orders;
//     switch (type) {
//       case "bag":
//         orders = await prisma.cartItem.findMany({
//           where: {
//             userId: session?.user.id,
//           },
//           include: {
//             product: {
//               include: getProductDataInclude(session?.user.id),
//             },
//             user: {
//               select: getUserDataSelect(session?.user.id),
//             },
//             color: true,
//           },
//           orderBy: {
//             createdAt: "desc",
//           },
//         });
//         break;
//       case "orders":
//         orders = await prisma.order.findMany({
//           where: {
//             userId: session?.user?.id,
//             // status: "PENDING",
//           },
//           include: {
//             // product:{
//             //     include:getProductDataInclude(session?.user.id)
//             // },
//             // user:{
//             //     select:getUserDataSelect(session?.user.id)
//             // },
//             // color:true,
//             items: {
//               include: {
//                 product: {
//                   include: getProductDataInclude(session?.user.id),
//                 },
//                 color: true,
//               },
//             },
//           },
//           orderBy: {
//             createdAt: "desc",
//           },
//         });
//         break;
//       case "delivered":
//         orders = await prisma.order.findMany({
//           where: {
//             userId: session?.user?.id,
//             status: "DELIVERED",
//           },
//           include: {
//             items: {
//               include: {
//                 product: {
//                   include: getProductDataInclude(session?.user.id),
//                 },
//                 color: true,
//               },
//             },
//           },
//           orderBy: {
//             createdAt: "desc",
//           },
//         });
//         break;
//       case "admin":
//         orders = await prisma.order.findMany({
//             include: {
//               items: {
//                 include: {
//                   product: {
//                     include: getProductDataInclude(session?.user.id),
//                   },
//                   color: true,
//                 },
//               },
//             },
//             orderBy: {
//               createdAt: "desc",
//             },
//             take: pageSize + 1,
//             cursor: cursor ? { id: cursor } : undefined,
//           });
//     }

//     // const count = await prisma.cartItem.count({
//     //     where:{userId:session?.user.id}
//     // })
//     if (type === "admin"){
//       const nextCursor = orders.length > pageSize ? orders[pageSize].id : null;
  
//       const data = {
//         orders: orders.slice(0, pageSize),
//         nextCursor,
//       };
//       return Response.json({ data });
//     }else{
//       return Response.json({ orders });
//     }

//   } catch (error) {
//     console.log(error);
//     return Response.json({ error: "Internal server error" }, { status: 500 });
//   }
// }



import { prisma } from "@utils/database";
import { auth } from "@auth";
import { getProductDataInclude, getUserDataSelect } from "@lib/types";

export async function GET(req, { params }) {
  try {
    const session = await auth();
    if (!session) return Response.json({ error: "unauthorized" }, { status: 401 });
    const { type } = await params;
    const cursor = req.nextUrl.searchParams.get("cursor") || undefined; 
    const q = req.nextUrl.searchParams.get("q") || undefined;
    const pageSize = 10;
    if (type === "admin" && session?.user.role !== "admin") return Response.json({ error: "unauthorized" }, { status: 401 });

    let orders;
    switch (type) {
      case "bag":
        orders = await prisma.cartItem.findMany({
          where: {
            userId: session?.user.id,
          },
          include: {
            product: {
              include: getProductDataInclude(session?.user.id),
            },
            user: {
              select: getUserDataSelect(session?.user.id),
            },
            color: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        });
        break;
      case "orders":
        orders = await prisma.order.findMany({
          where: {
            userId: session?.user?.id,
          },
          include: {
            items: {
              include: {
                product: {
                  include: getProductDataInclude(session?.user.id),
                },
                color: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        });
        break;
      case "delivered":
        orders = await prisma.order.findMany({
          where: {
            userId: session?.user?.id,
            status: "DELIVERED",
          },
          include: {
            items: {
              include: {
                product: {
                  include: getProductDataInclude(session?.user.id),
                },
                color: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        });
        break;
      case "admin":
        orders = await prisma.order.findMany({
            where: q
              ? {
                  orderCode: {
                    contains: q,
                    mode: "insensitive",
                  },
                }
              : undefined,
            include: {
              items: {
                include: {
                  product: {
                    include: getProductDataInclude(session?.user.id),
                  },
                  color: true,
                },
              },
            },
            orderBy: {
              createdAt: "desc",
            },
            take: pageSize + 1,
            cursor: cursor ? { id: cursor } : undefined,
            skip: cursor ? 1 : 0,
          });
    }

    if (type === "admin"){
      const nextCursor = orders.length > pageSize ? orders[pageSize].id : null;

      return Response.json({
        orders: orders.slice(0, pageSize),
        nextCursor,
      });
    }else{
      return Response.json({ orders });
    }

  } catch (error) {
    console.log(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}