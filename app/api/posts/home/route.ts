import { prisma } from "@/utils/database";
import { getPostDataInclude, getProductDataInclude } from "@/lib/types";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/get-session";

interface HomeResponse {
  posts: any[];
  products: any[];
}

type CategoryType = 'following' | 'popular' | 'new-post' | 'for-you';

export async function GET(req: NextRequest): Promise<NextResponse<HomeResponse | { error: string }>> {
  try {
    const category = req.nextUrl.searchParams.get("category") as CategoryType | undefined;
    const session = await getServerSession();
    const userId = session?.user?.id || null;

    let posts: any[];
    let products: any[];

    // Fetch posts based on category
    switch (category) {
      case 'following':
        posts = await prisma.post.findMany({
          where: {
            status: "PUBLISHED",
          },
          orderBy: { createdAt: "desc" },
          take: 6,
          include: getPostDataInclude(userId),
        });
        break;
      case 'popular':
        posts = await prisma.post.findMany({
          where: {
            status: "PUBLISHED",
          },
          include: getPostDataInclude(userId),
          orderBy: [
            // { likes: { _count: "desc" } },
            // { views: { _count: "desc" } },
            { createdAt: "desc" },
          ],
          take: 6,
        });
        break;
      case 'new-post':
        posts = await prisma.post.findMany({
          where: {
            status: "PUBLISHED",
          },
          include: getPostDataInclude(userId),
          orderBy: { createdAt: "desc" },
          take: 6,
        });
        break;
      case 'for-you':
        posts = await prisma.post.findMany({
          where: {
            status: "PUBLISHED",
          },
          include: getPostDataInclude(userId),
          orderBy: { createdAt: "desc" },
          take: 6,
        });
        break;
      default:
        posts = await prisma.post.findMany({
          where: {
            status: "PUBLISHED",
          },
          include: getPostDataInclude(userId),
          orderBy: { createdAt: "desc" },
          take: 6,
        });
    }

    // Fetch products based on category
    switch (category) {
      case 'following':
        products = await prisma.product.findMany({
          orderBy: { createdAt: "desc" },
          take: 6,
          include: getProductDataInclude(userId),
        });
        break;
      case 'popular':
        products = await prisma.product.findMany({
          include: getProductDataInclude(userId),
          orderBy: [
            // { likes: { _count: "desc" } },
            // { views: { _count: "desc" } },
            { createdAt: "desc" },
          ],
          take: 6,
        });
        break;
      case 'new-post':
        products = await prisma.product.findMany({
          include: getProductDataInclude(userId),
          orderBy: { createdAt: "desc" },
          take: 6,
        });
        break;
      case 'for-you':
        products = await prisma.product.findMany({
          include: getProductDataInclude(userId),
          orderBy: { createdAt: "desc" },
          take: 6,
        });
        break;
      default:
        products = await prisma.product.findMany({
          include: getProductDataInclude(userId),
          orderBy: { createdAt: "desc" },
          take: 6,
        });
    }

    return NextResponse.json({ posts, products });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
