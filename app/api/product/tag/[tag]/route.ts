import { prisma } from "@/utils/database";
import { getProductDataInclude } from "@/lib/types";
import { getServerSession } from "@/lib/get-session";
import { NextRequest, NextResponse } from "next/server";

interface TagProductsResponse {
  products: any[];
  count: number;
}

interface RouteParams {
  params: Promise<{ tag: string }>;
}

type ProductCategory = "following" | "popular" | "new-product" | "best-sell";

export async function GET(
  req: NextRequest,
  { params }: RouteParams
): Promise<NextResponse<TagProductsResponse | { error: string }>> {
  try {
    const pgnum = +(req.nextUrl.searchParams.get("pgnum") ?? 0);
    const pgsize = +(req.nextUrl.searchParams.get("pgsize") ?? 10);
    const category = req.nextUrl.searchParams.get("category") as
      | ProductCategory
      | undefined;

    const session = await getServerSession();

    let products: any[];

    switch (category) {
      case "following":
        products = await prisma.product.findMany({
          include: getProductDataInclude(session?.user?.id),
          skip: pgnum * pgsize,
          take: pgsize,
        });
        break;
      case "popular":
        products = await prisma.product.findMany({
          include: getProductDataInclude(session?.user?.id),
          orderBy: [
            { comments: { _count: "desc" } },
            { cartItems: { _count: "desc" } },
            { createdAt: "desc" },
          ],
          skip: pgnum * pgsize,
          take: pgsize,
        });
        break;
      case "new-product":
        products = await prisma.product.findMany({
          include: getProductDataInclude(session?.user?.id),
          orderBy: { createdAt: "desc" },
          skip: pgnum * pgsize,
          take: pgsize,
        });
        break;
      case "best-sell":
        products = await prisma.product.findMany({
          include: getProductDataInclude(session?.user?.id),
          orderBy: [
            { orderItems: { _count: "desc" } },
            { cartItems: { _count: "desc" } },
            { createdAt: "desc" },
          ],
          skip: pgnum * pgsize,
          take: pgsize,
        });
        break;
      default:
        products = await prisma.product.findMany({
          include: getProductDataInclude(session?.user?.id),
          orderBy: { createdAt: "desc" },
          skip: pgnum * pgsize,
          take: pgsize,
        });
    }

    const count = await prisma.product.count({});

    return NextResponse.json({ products, count });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
