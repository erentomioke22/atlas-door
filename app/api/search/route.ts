import { prisma } from "@/utils/database";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/get-session";
import { getPostDataInclude, getProductDataInclude } from "@/lib/types";
import { PostLite } from "@/components/posts/postCard";
import { ProductLite } from "@/components/products/productCard";

interface SearchResponse {
  posts: PostLite[];
  products: ProductLite[];
}

export async function GET(
  req: NextRequest
): Promise<NextResponse<SearchResponse | { error: string }>> {
  try {
    const searchQuery = req.nextUrl.searchParams.get("searchQuery");

    if (!searchQuery) {
      return NextResponse.json(
        { error: "Search query is required" },
        { status: 400 }
      );
    }

    const session = await getServerSession();

    const posts = await prisma.post.findMany({
      where: {
        OR: [
          {
            title: {
              contains: searchQuery,
              mode: "insensitive",
            },
          },
          {
            user: {
              name: {
                contains: searchQuery,
                mode: "insensitive",
              },
            },
          },
          {
            user: {
              name: {
                contains: searchQuery,
                mode: "insensitive",
              },
            },
          },
        ],
        status:"PUBLISHED"
      },
      include: getPostDataInclude(session?.user?.id),
      orderBy: { createdAt: "desc" },
    });

    const products = await prisma.product.findMany({
      where: {
        OR: [
          {
            name: {
              contains: searchQuery,
              mode: "insensitive",
            },
          },
          {
            seller: {
              name: {
                contains: searchQuery,
                mode: "insensitive",
              },
            },
          },
          {
            seller: {
              name: {
                contains: searchQuery,
                mode: "insensitive",
              },
            },
          },
        ],
      },
      include: getProductDataInclude(session?.user?.id),
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ posts, products });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
