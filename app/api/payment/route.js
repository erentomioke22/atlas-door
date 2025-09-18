// function generatePaymentId() {
//   // Generate a random 6-digit number
//   const randomNum = Math.floor(100000 + Math.random() * 900000);
//   // Get current timestamp
//   const timestamp = Date.now().toString().slice(-6);
//   // Combine and hash
//   const uniqueString = `${randomNum}${timestamp}`;
//   return crypto.createHash('md5').update(uniqueString).digest('hex').slice(0, 8).toUpperCase();
// }


// export async function POST(req) {
//   try {
//     const {user, phone, address, rule} = await req.json();
//     const session = await auth();
//     if (!session) {
//       return NextResponse.json({ error: "غیر قابل دسترسی" }, { status: 401 });
//     }
//     // const paymentId = generatePaymentId();
//     // Get cart items for the user
//     const cartItems = await prisma.cartItem.findMany({
//       where: {
//         userId: session.user.id
//       },
//       include: {
//         product: true,
//         color:true
//       }
//     });

//     if (!cartItems.length) {
//       return NextResponse.json({ error: "سبد خالی است !" }, { status: 400 });
//     }

//     const totalAmount = cartItems.reduce((sum, item) => {
//       const itemPrice = item.color.price - (item.color.price * (item.color?.discount || 0) / 100);
//       return sum + (itemPrice * item.quantity);
//     }, 0);

//     if (rule === "direct") {
//       // Verify paymentId if provided
//       // if (!paymentId) {
//       //   return NextResponse.json({ error: "Payment ID is required for direct payment" }, { status: 400 });
//       // }

//       // Create order with paymentId
//       const order = await prisma.order.create({
//         data: {
//           userId: session.user.id,
//           recipient: user,
//           phone: phone,
//           address: address,
//           total: totalAmount,
//           status: "PENDING",
//           // paymentId: paymentId,
//           items: {
//             create: cartItems.map(item => ({
//               quantity: item.quantity,
//               price: item.color.price - (item.color.price * (item.color?.discount || 0) / 100),
//               colorId: item.color.id,
//               productId: item.product.id
//             }))
//           }
//         }
//       });

//       // Clear cart and update stock
//       await prisma.cartItem.deleteMany({
//         where: {
//           userId: session.user.id
//         }
//       });

//       for (const item of cartItems) {
//         await prisma.color.update({
//           where: {
//             id: item.colorId,
//             productId: item.productId
//           },
//           data: {
//             stocks: {
//               decrement: item.quantity
//             }
//           }
//         });
//       }

//       return NextResponse.json({
//         success: true,
//         orderId: order.id,
//         message:"سفارش شما با موفقیت ثبت شد"
//       });
//     } else if (rule === "gateway") {
//       // Create pending order
//       const order = await prisma.order.create({
//         data: {
//           userId: session.user.id,
//           recipient: user,
//           phone: phone,
//           address: address,
//           total: totalAmount,
//           status: "PENDING",
//           items: {
//             create: cartItems.map(item => ({
//               quantity: item.quantity,
//               price: item.color.price - (item.color.price * (item.color?.discount || 0) / 100),
//               colorId: item.color.id,
//               productId: item.product.id
//             }))
//           }
//         }
//       });

//       // Initialize Zarinpal payment
//       const response = await fetch('https://api.zarinpal.com/pg/v4/payment/request.json', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           merchant_id: process.env.ZARINPAL_MERCHANT_ID,
//           amount: totalAmount,
//           callback_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/verify?orderId=${order.id}`,
//           description: `Order #${order.id}`,
//         }),
//       });

//       const data = await response.json();

//       if (data.data.code === 100) {
//         // Clear cart after successful order creation
//         await prisma.cartItem.deleteMany({
//           where: {
//             userId: session.user.id
//           }
//         });

//         for (const item of cartItems) {
//           await prisma.color.update({
//             where: {
//               id: item.colorId,
//               productId: item.productId
//             },
//             data: {
//               stocks: {
//                 decrement: item.quantity
//               }
//             }
//           });
//         }
        
//         return NextResponse.json({
//           success: true,
//           paymentUrl: `https://www.zarinpal.com/pg/StartPay/${data.data.authority}`
//         });
//       } else {
//         return NextResponse.json({ error: "Payment initialization failed" }, { status: 400 });
//       }
//     } else {
//       return NextResponse.json({ error: "Invalid payment rule" }, { status: 400 });
//     }
//   } catch (error) {
//     console.error('Payment error:', error);
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 });
//   }
// }


import { NextResponse } from "next/server";
import { auth } from "@auth";
import { prisma } from "@utils/database";

// Generate a readable unique order code like AT-20250915-7F3C9B
function generateOrderCode() {
  const date = new Date();
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const rand = Math.random().toString(16).slice(2, 8).toUpperCase();
  return `AT-${y}${m}${d}-${rand}`;
}

async function getUniqueOrderCode() {
  for (let i = 0; i < 5; i++) {
    const code = generateOrderCode();
    const exists = await prisma.order.findUnique({ where: { orderCode: code } });
    if (!exists) return code;
  }
  // fallback: include timestamp chunk to ensure uniqueness
  return `AT-${Date.now()}-${Math.random().toString(16).slice(2, 6).toUpperCase()}`;
}

export async function POST(req) {
  try {
    const {user, phone, address, rule} = await req.json();
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "غیر قابل دسترسی" }, { status: 401 });
    }

    // Get cart items for the user
    const cartItems = await prisma.cartItem.findMany({
      where: {
        userId: session.user.id
      },
      include: {
        product: true,
        color:true
      }
    });

    if (!cartItems.length) {
      return NextResponse.json({ error: "سبد خالی است !" }, { status: 400 });
    }

    const totalAmount = cartItems.reduce((sum, item) => {
      const itemPrice = item.color.price - (item.color.price * (item.color?.discount || 0) / 100);
      return sum + (itemPrice * item.quantity);
    }, 0);

    const orderCode = await getUniqueOrderCode();

    if (rule === "direct") {
      const order = await prisma.order.create({
        data: {
          userId: session.user.id,
          recipient: user,
          phone: phone,
          address: address,
          total: totalAmount,
          status: "PENDING",
          orderCode,
          items: {
            create: cartItems.map(item => ({
              quantity: item.quantity,
              price: item.color.price - (item.color.price * (item.color?.discount || 0) / 100),
              colorId: item.color.id,
              productId: item.product.id
            }))
          }
        }
      });

      await prisma.notification.create({
        data: {
          recipientId: session.user.id,
          issuerId: 'cmczx3noi0000ohg8excltr4o', 
          type: 'PAID', 
        },
      });

      await prisma.cartItem.deleteMany({
        where: {
          userId: session.user.id
        }
      });

      for (const item of cartItems) {
        await prisma.color.update({
          where: {
            id: item.colorId,
            productId: item.productId
          },
          data: {
            stocks: {
              decrement: item.quantity
            }
          }
        });
      }

      return NextResponse.json({
        success: true,
        orderId: order.id,
        orderCode: order.orderCode,
        message:"سفارش شما با موفقیت ثبت شد"
      });
    } else if (rule === "gateway") {
      const order = await prisma.order.create({
        data: {
          userId: session.user.id,
          recipient: user,
          phone: phone,
          address: address,
          total: totalAmount,
          status: "PENDING",
          orderCode,
          items: {
            create: cartItems.map(item => ({
              quantity: item.quantity,
              price: item.color.price - (item.color.price * (item.color?.discount || 0) / 100),
              colorId: item.color.id,
              productId: item.product.id
            }))
          }
        }
      });

      const response = await fetch('https://api.zarinpal.com/pg/v4/payment/request.json', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          merchant_id: process.env.ZARINPAL_MERCHANT_ID,
          amount: totalAmount,
          callback_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/verify?orderId=${order.id}`,
          description: `Order #${order.orderCode}`,
        }),
      });

      const data = await response.json();

      if (data.data.code === 100) {
        await prisma.cartItem.deleteMany({
          where: {
            userId: session.user.id
          }
        });

        for (const item of cartItems) {
          await prisma.color.update({
            where: {
              id: item.colorId,
              productId: item.productId
            },
            data: {
              stocks: {
                decrement: item.quantity
              }
            }
          });
        }
        
        return NextResponse.json({
          success: true,
          paymentUrl: `https://www.zarinpal.com/pg/StartPay/${data.data.authority}`,
          orderCode: order.orderCode
        });
      } else {
        return NextResponse.json({ error: "Payment initialization failed" }, { status: 400 });
      }
    } else {
      return NextResponse.json({ error: "Invalid payment rule" }, { status: 400 });
    }
  } catch (error) {
    console.error('Payment error:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

