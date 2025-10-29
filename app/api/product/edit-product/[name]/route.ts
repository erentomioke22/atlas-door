import { prisma } from "@/utils/database";
import { getProductDataInclude } from "@/lib/types";
import { getServerSession } from "@/lib/get-session";
import { NextRequest, NextResponse } from "next/server";
import { ProductLite } from "@/components/products/productCard";

interface RouteParams {
  params: Promise<{ name: string }>;
}

export async function GET(
  req: NextRequest,
  { params }: RouteParams
): Promise<NextResponse<ProductLite | { error: string }>> {
  try {
    const session = await getServerSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name } = await params;

    if (!name) {
      return NextResponse.json(
        { error: "Product name is required" },
        { status: 400 }
      );
    }

    const product = await prisma.product.findFirst({
      where: { name: name },
      include: getProductDataInclude(session?.user?.id),
    });

    if (!product) {
      return NextResponse.json(
        { error: "not found any product" },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
