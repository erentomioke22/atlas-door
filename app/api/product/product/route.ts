import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/utils/database";
import { getProductDataInclude } from "@/lib/types";
import { getServerSession } from "@/lib/get-session";
import { ProductLite } from "@/components/products/productCard";

export async function GET(
  req: NextRequest
): Promise<NextResponse<ProductLite | { error: string }>> {
  try {
    const session = await getServerSession();
    const productName = req.nextUrl.searchParams.get("productName");

    if (!productName) {
      return NextResponse.json(
        { error: "Product name is required" },
        { status: 400 }
      );
    }

    const currentProduct = await prisma.product.findFirst({
      where: { name: productName },
      include: getProductDataInclude(session?.user?.id),
    });

    if (!currentProduct) {
      return NextResponse.json(
        { error: "not found any product" },
        { status: 404 }
      );
    }

    return NextResponse.json(currentProduct);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
