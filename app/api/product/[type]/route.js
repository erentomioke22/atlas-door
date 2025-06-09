import { prisma } from "@utils/database";
import { auth } from "@auth";
import { getProductDataInclude, getUserDataSelect } from "@lib/types";
// import { zarinpal } from "@zarinpal/zarinpal";

export async function GET(req, { params }) {
  try {
    const session = await auth();
    if (!session) return Response.json({ error: "unauthorized" }, { status: 401 });
    const { type } = await params;
    // console.log(type);
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
            // status: "PENDING",
          },
          include: {
            // product:{
            //     include:getProductDataInclude(session?.user.id)
            // },
            // user:{
            //     select:getUserDataSelect(session?.user.id)
            // },
            // color:true,
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
    }

    // const count = await prisma.cartItem.count({
    //     where:{userId:session?.user.id}
    // })

    // console.log(orders)

    return Response.json({ orders });
  } catch (error) {
    console.log(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

// export async function POST(req) {
//   const session = await auth();
//   if (!session?.user) {
//     return Response.json({ error: "Unauthorized" }, { status: 401 });
//   }

//   const { cartItemIds } = await req.json();

//   // Get cart items
//   const cartItems = await prisma.cartItem.findMany({
//     where: {
//       id: { in: cartItemIds },
//       userId: session.user.id,
//     },
//     include: { product: true },
//   });

//   if (cartItems.length === 0) {
//     return Response.json({ error: "No items selected" }, { status: 400 });
//   }

//   // Calculate total
//   const total = cartItems.reduce(
//     (sum, item) => sum + item.product.price * item.quantity,
//     0
//   );

//   // Create order
//   const order = await prisma.order.create({
//     data: {
//       userId: session.user.id,
//       total,
//       items: {
//         create: cartItems.map((item) => ({
//           productId: item.productId,
//           quantity: item.quantity,
//           price: item.product.price,
//         })),
//       },
//     },
//   });

//   // Initialize ZarinPal payment
//   const payment = await zarinpal.PaymentRequest({
//     Amount: total,
//     CallbackURL: `${process.env.NEXT_PUBLIC_BASE_URL}/orders/${order.id}/verify`,
//     Description: `Payment for order ${order.id}`,
//     Email: session.user.email || "",
//     Mobile: "", // Add if you have user's phone number
//   });

//   if (payment.status === 100) {
//     // Update order with payment ID
//     await prisma.order.update({
//       where: { id: order.id },
//       data: { paymentId: payment.authority },
//     });

//     // Redirect to payment gateway
//     return Response.json({ url: payment.url });
//   }

//   return Response.json(
//     { error: "Payment initialization failed" },
//     { status: 500 }
//   );
// }
