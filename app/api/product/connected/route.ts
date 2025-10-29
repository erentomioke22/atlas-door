import { prisma } from "@/utils/database";
import { getProductDataInclude } from "@/lib/types";
import { getServerSession } from "@/lib/get-session";
import { NextRequest, NextResponse } from "next/server";
import { ProductLite } from "@/components/products/productCard";

export async function GET(
  req: NextRequest
): Promise<NextResponse<{ products: ProductLite[] } | { error: string }>> {
  try {
    const session = await getServerSession();
    const productTitle = req.nextUrl.searchParams.get("productTitle") || "";
    const productId = req.nextUrl.searchParams.get("productId") || "";

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    // Fetch similar products based on title, excluding the current product
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
                  contains: productTitle,
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

    return NextResponse.json({ products });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
