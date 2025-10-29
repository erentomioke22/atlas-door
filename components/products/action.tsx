"use server";

import { prisma } from "@/utils/database";
import { getProductDataInclude } from "@/lib/types";
import { getServerSession } from "@/lib/get-session";
import { utapi } from "@/server/uploadthing";

type ColorInput = {
  id?: string;
  name: string;
  hexCode: string;
  price: string | number;
  discount: string | number;
  stocks: string | number;
};

type SubmitProductValues = {
  name: string;
  desc: string;
  content: unknown;
  images: string[];
  colors: ColorInput[];
};

export async function submitProduct(values: SubmitProductValues) {
  try {
    const session = await getServerSession();
    if (!session) throw new Error("Unauthorized");

    const existProduct = await prisma.product.findMany({
      where: {
        name: values.name,
      },
    });
    if (existProduct.length > 0) {
      throw new Error("محصولی با این نام وجود دارد");
    }

    const newProduct = await prisma.product.create({
      data: {
        name: values.name,
        desc: values.desc,
        content: values.content as any,
        images: values.images,
        sellerId: session?.user?.id!,
        colors: {
          create: values.colors.map((color) => ({
            status: "EXISTENT",
            name: color.name,
            hexCode: color.hexCode,
            price: parseFloat(String(color.price)),
            discount: parseFloat(String(color.discount)),
            stocks: parseInt(String(color.stocks)),
          })),
        },
      },
      include: getProductDataInclude(session?.user?.id),
    });

    if (!newProduct) {
      throw new Error("Failed to create the product");
    }

    return newProduct;
  } catch (err: any) {
    console.error(err);
    throw new Error(err);
  }
}

type EditProductValues = {
  productId: string;
  name: string;
  desc: string;
  content: unknown;
  images: string[];
  colors: ColorInput[];
  rmFiles: string[];
};

export async function editProduct(values: EditProductValues) {
  try {
    const session = await getServerSession();
    if (!session) throw new Error("Unauthorized");

    if (values.rmFiles.length > 0) {
      try {
        const deletedImages = await utapi.deleteFiles(values.rmFiles);
        console.log(deletedImages);
      } catch (err) {
        console.error(err);
        throw new Error("field to delete archive image");
      }
    }

    const incomingColors = Array.isArray(values.colors) ? values.colors : [];
    const keepIds = incomingColors
      .filter((c) => c.id)
      .map((c) => c.id!) as string[];

    const [, editedProduct] = await prisma.$transaction([
      prisma.color.deleteMany({
        where: {
          productId: values.productId,
          id: { notIn: keepIds.length ? keepIds : ["_no_match_"] },
        },
      }),

      prisma.product.update({
        where: { id: values.productId },
        data: {
          name: values.name,
          desc: values.desc,
          content: values.content as any,
          images: values.images,
          colors: {
            update: incomingColors
              .filter((c) => c.id)
              .map((c) => ({
                where: { id: c.id! },
                data: {
                  status: "EXISTENT",
                  name: c.name,
                  hexCode: c.hexCode,
                  price: parseFloat(String(c.price)),
                  discount: parseFloat(String(c.discount || 0)),
                  stocks: parseInt(String(c.stocks || 0)),
                },
              })),
            create: incomingColors
              .filter((c) => !c.id)
              .map((c) => ({
                status: "EXISTENT",
                name: c.name,
                hexCode: c.hexCode,
                price: parseFloat(String(c.price)),
                discount: parseFloat(String(c.discount || 0)),
                stocks: parseInt(String(c.stocks || 0)),
              })),
          },
        },
        include: getProductDataInclude(session?.user?.id),
      }),
    ]);

    return editedProduct;
  } catch (error: any) {
    throw new Error(error);
  }
}

type DeleteProductValues = {
  id: string;
  removeKey: string[];
};

export async function deleteProduct(values: DeleteProductValues) {
  try {
    const id = values.id;
    const session = await getServerSession();
    if (!session) throw new Error("Unauthorized");

    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) throw new Error("product not found");

    if (product.sellerId !== session?.user?.id) throw new Error("Unauthorized");

    if (values.removeKey.length > 0) {
      try {
        const deletedImages = await utapi.deleteFiles(values.removeKey);
        console.log(deletedImages);
      } catch (err) {
        console.error(err);
        throw new Error("field to delete archive image");
      }
    }

    const deletedProduct = await prisma.product.delete({
      where: { id },
      include: getProductDataInclude(session?.user?.id),
    });

    return deletedProduct;
  } catch (error: any) {
    throw new Error(error);
  }
}
