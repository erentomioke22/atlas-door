import { prisma } from "@utils/database";
import { BookmarkInfo } from "@/lib/types";
import { auth } from "@auth";


// async function checkStock(userId,productId,colorId, requestedQuantity) {
//   const product = await prisma.product.findUnique({
//     where: { id: productId },
//     select: { 
//       colors: {
//         select: {
//           stocks: true
//         }
//       }
//     }
//   });

//   if (!product) {
//     throw new Error("Product not found");
//   }

//   // Get current cart quantity
//   const currentCartItem = await prisma.cartItem.findUnique({
//     where: {
//       userId_productId_colorId: {
//         userId,
//         productId,
//         colorId
//       },
//     },
//     select: { quantity: true }
//   });

//   const currentQuantity = currentCartItem?.quantity || 0;
//   const newTotalQuantity = requestedQuantity;

//   if (newTotalQuantity > product.stocks) {
//     throw new Error(`Only ${product.stocks} items available in stock`);
//   }

//   return true;
// }
// async function checkStock(userId, productId, colorId, requestedQuantity) {
//   const product = await prisma.product.findUnique({
//     where: { id: productId },
//     select: { 
//       colors: {
//         where: { id: colorId },
//         select: {
//           stocks: true
//         }
//       }
//     }
//   });

//   if (!product) {
//     throw new Error("Product not found");
//   }

//   const colorStock = product.colors[0]?.stocks || 0;
  
//   if (colorStock === 0) {
//     throw new Error("This color is out of stock");
//   }

//   // Get current cart quantity
//   const currentCartItem = await prisma.cartItem.findUnique({
//     where: {
//       userId_productId_colorId: {
//         userId,
//         productId,
//         colorId
//       },
//     },
//     select: { quantity: true }
//   });

//   const currentQuantity = currentCartItem?.quantity || 0;
//   const newTotalQuantity = currentQuantity + requestedQuantity;

//   if (newTotalQuantity > colorStock) {
//     throw new Error(`Only ${colorStock} items available in stock for this color`);
//   }

//   return true;
// }


// async function checkStock(userId, productId, colorId, requestedQuantity, isUpdate = false) {
//   const color = await prisma.color.findUnique({
//     where: { 
//       id: colorId,
//       productId: productId // This ensures the color belongs to the correct product
//     },
//     select: {
//       stocks: true,
//       product: {
//         select: {
//           id: true
//         }
//       }
//     }
//   });

//   if (!color) {
//     throw new Error("Color not found for this product");
//   }

//   const colorStock = color.stocks || 0;
  
//   if (colorStock === 0) {
//     throw new Error("This color is out of stock");
//   }

//   // Get current cart quantity
//   const currentCartItem = await prisma.orderItem.findUnique({
//     where: {
//       // userId_productId_colorId: {
//         // userId,
//         productId,
//         colorId
//       // },
//     },
//     select: { quantity: true }
//   });

//   const currentQuantity = currentCartItem?.quantity || 0;
//   // const newTotalQuantity = isUpdate ? requestedQuantity : (currentQuantity + requestedQuantity);

//   // if (newTotalQuantity > colorStock) {
//   if (currentQuantity > colorStock) {
//     throw new Error(`Only ${colorStock} items available in stock for this color`);
//   }

//   return true;
// }


async function checkStock(userId, productId, colorId, requestedQuantity, isUpdate = false) {
  const color = await prisma.color.findUnique({
    where: { 
      id: colorId,
      productId: productId
    },
    select: {
      stocks: true,
      product: {
        select: {
          id: true
        }
      }
    }
  });

  if (!color) {
    throw new Error("Color not found for this product");
  }

  const colorStock = color.stocks || 0;
  
  if (colorStock === 0) {
    throw new Error("This color is out of stock");
  }

  // Get current cart quantity for this user
  const currentCartItem = await prisma.cartItem.findUnique({
    where: {
      userId_productId_colorId: {
        userId,
        productId,
        colorId
      }
    },
    select: { quantity: true }
  });

  // Get total quantity in all carts for this color
  const totalCartQuantity = await prisma.cartItem.aggregate({
    where: {
      productId,
      colorId,
      userId: {
        not: userId // Exclude current user's cart
      }
    },
    _sum: {
      quantity: true
    }
  });

  // Get total quantity in all orders for this color
  const totalOrderQuantity = await prisma.orderItem.aggregate({
    where: {
      productId,
      colorId,
      order: {
        status: {
          in: ['PENDING', 'PAID'] // Only count items in pending or paid orders
        }
      }
    },
    _sum: {
      quantity: true
    }
  });

  const currentQuantity = currentCartItem?.quantity || 0;
  const otherCartsQuantity = totalCartQuantity._sum.quantity || 0;
  const orderQuantity = totalOrderQuantity._sum.quantity || 0;
  
  // Calculate available stock by subtracting items in other carts and orders
  const availableStock = colorStock - otherCartsQuantity - orderQuantity;
  
  // For update, we need to add back the current user's cart quantity
  const newTotalQuantity = isUpdate ? requestedQuantity : (currentQuantity + requestedQuantity);

  if (requestedQuantity > availableStock) {
    throw new Error(`Only ${availableStock} items available in stock for this color`);
  }

  return true;
}

export async function GET(req,{params}) {
  try {
    // const {productId} =await params;
    const productId = req.nextUrl.searchParams.get('productId')
    const colorId = req.nextUrl.searchParams.get('colorId')
      const session = await auth();

    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const cartItem = await prisma.cartItem.findUnique({
      where: {
        userId_productId_colorId: {
          userId: session.user?.id,
          productId,
          colorId,
        },
      },
    });

    const data = {
      isCarted: !!cartItem,
    };

    return Response.json({data,userId:session.user?.id,id:productId});
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}


export async function POST(req,{params}) {
  try {
    // const {productId} =await params;
    const productId = req.nextUrl.searchParams.get('productId')
    const colorId = req.nextUrl.searchParams.get('colorId')
      const session = await auth();

    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    await checkStock(session.user?.id,productId, colorId,1);


   await prisma.cartItem.upsert({
      where: {
        userId_productId_colorId: {
          userId:session.user?.id,
          productId,
          colorId,
        },
      },
      create: {
        userId:session.user?.id,
        productId,
        colorId,
        quantity:1,
      },
      update:{

        quantity:{
          increment:1
        }
      }
    });


    return new Response();
  } catch (error) {
    console.error(error);
    return Response.json({ error }, { status: 500 });
  }
}


export async function PUT(req, { params }) {
  try {
    // const { productId,colorId } = await params;
   const productId = req.nextUrl.searchParams.get('productId')
   const colorId = req.nextUrl.searchParams.get('colorId')

    const session = await auth();
    const { quantity } = await req.json();

    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }


    await checkStock(session.user?.id,productId,colorId, quantity);

    await prisma.cartItem.upsert({
      where: {
        userId_productId_colorId: {
          userId: session.user?.id,
          productId,
          colorId
        },
      },
      create: {
        userId: session.user?.id,
        productId: productId,
        colorId,
        quantity,
      },
      update: {
        quantity,
      }
    });

    return new Response();
  } catch (error) {
    console.error(error.message);
    return Response.json({ error:error.message }, { status: 500 });
  }
}


export async function DELETE(req,{ params}) {
  try {
    // const {productId} =await params;
    const productId = req.nextUrl.searchParams.get('productId')
    const colorId = req.nextUrl.searchParams.get('colorId')
    const session = await auth();

    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.cartItem.deleteMany({
      where: {
        userId:session.user?.id,
        productId,
        colorId
      },
    });

    return new Response();
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}