import { prisma } from "@utils/database";
import {getProductDataInclude } from "@/lib/types"; // Adjust as needed
import { auth } from "@/auth";

export async function GET(req) {
  try {
    const session = await auth();
    const productTitle = req.nextUrl.searchParams.get("productTitle") || "";
    const productId = req.nextUrl.searchParams.get("productId") || "";



    // Fetch similar posts based on title or tags, excluding the current post
    const products = await prisma.product.findMany({
      where: {
        AND: [
          {
            NOT: {
              id: productId,
            },
          },
          {
            OR: [
              {
                name: {
                  contains: productTitle, // Adjust as needed for minimum letters
                  mode: "insensitive",
                },
              },
            ],
          },
        ],
      },
      include: getProductDataInclude(session?.user?.id),
      orderBy: [
        { orderItems: { _count: "desc" } },
        { cartItems: { _count: "desc" } },
        { comments: { _count: "desc" } },
        { createdAt: "desc" },
      ],
      take: 6,
    });

        return Response.json(products);
  } catch (error) {
    console.log(error)
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
}
