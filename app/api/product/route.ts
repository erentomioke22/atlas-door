import { prisma } from "@/utils/database";
import { getProductDataInclude } from "@/lib/types";
import { getServerSession } from "@/lib/get-session";
import { NextRequest, NextResponse } from "next/server";

interface ProductsResponse {
  products: any[];
  nextCursor: string | null;
}

type ProductCategory = "following" | "popular" | "new-product" | "for-you";

export async function GET(
  req: NextRequest
): Promise<NextResponse<ProductsResponse | { error: string }>> {
  try {
    const category = req.nextUrl.searchParams.get("category") as
      | ProductCategory
      | undefined;
    const cursor = req.nextUrl.searchParams.get("cursor") || undefined;
    const pageSize = 10;

    const session = await getServerSession();
    const userId = session?.user?.id || undefined;

    let products: any[];

    switch (category) {
      case "following":
        products = await prisma.product.findMany({
          where: {
            colors: {
              some: {
                status: "EXISTENT",
              },
            },
          },
          orderBy: { createdAt: "desc" },
          take: pageSize + 1,
          cursor: cursor ? { id: cursor } : undefined,
          include: getProductDataInclude(userId),
        });
        break;
      case "popular":
        products = await prisma.product.findMany({
          where: {
            colors: {
              some: {
                status: "EXISTENT",
              },
            },
          },
          include: getProductDataInclude(userId),
          orderBy: [
            // { likes: { _count: "desc" } },
            // { views: { _count: "desc" } },
            { createdAt: "desc" },
          ],
          take: pageSize + 1,
          cursor: cursor ? { id: cursor } : undefined,
        });
        break;
      case "new-product":
        products = await prisma.product.findMany({
          where: {
            colors: {
              some: {
                status: "EXISTENT",
              },
            },
          },
          include: getProductDataInclude(userId),
          orderBy: { createdAt: "desc" },
          take: pageSize + 1,
          cursor: cursor ? { id: cursor } : undefined,
        });
        break;
      case "for-you":
        // Get followed tags for the user
        const followedTags = await prisma.tag.findMany({
          where: {
            users: {
              some: {
                id: session?.user?.id,
              },
            },
          },
        });

        const followedTagIds = followedTags.map((tag) => tag.id);

        products = await prisma.product.findMany({
          where: {
            colors: {
              some: {
                status: "EXISTENT",
              },
            },
            tags: {
              some: {
                id: {
                  in: followedTagIds,
                },
              },
            },
          },
          include: getProductDataInclude(userId),
          orderBy: { createdAt: "desc" },
          take: pageSize + 1,
          cursor: cursor ? { id: cursor } : undefined,
        });
        break;
      default:
        products = await prisma.product.findMany({
          include: getProductDataInclude(userId),
          orderBy: { createdAt: "desc" },
          take: pageSize + 1,
          cursor: cursor ? { id: cursor } : undefined,
        });
    }

    const nextCursor =
      products.length > pageSize ? products[pageSize].id : null;

    const data: ProductsResponse = {
      products: products.slice(0, pageSize) ?? [],
      nextCursor,
    };

    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
