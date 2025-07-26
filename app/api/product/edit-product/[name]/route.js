import { prisma } from "@utils/database";
import { getProductDataInclude } from "@/lib/types";
import { auth } from "@/auth";



export async function GET(req,{params}) {
  try {
    const session = await auth();

    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (!params.name) {
      return Response.json({ error: "not found any product" }, { status: 401 });
    }

    const product = await prisma.product.findFirst({
      where:{name:params.name},
      include: getProductDataInclude(session?.user?.id),
    });

    if (!product) {
      return Response.json({ error: "not found any product" }, { status: 401 });
    }
    return Response.json(product);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}