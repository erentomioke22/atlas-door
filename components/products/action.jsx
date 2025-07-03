"use server";

import { prisma } from "@utils/database";
import { getProductDataInclude } from "@/lib/types";
import { auth } from "@auth";
import { utapi } from "@server/uploadthing";

export async function submitProduct(values) {
  try {
    const session = await auth();
    if (!session) throw new Error("Unauthorized");
    console.log(values);

    const faqs =
      values.faqs?.filter(
        (faq) => faq !== undefined && faq.question && faq.answer
      ) || [];

    // const colors =
    //   values.colors?.filter(
    //     (color) => color !== undefined && color.name && color.hexCode && color.price && color.discount && color.stocks
    //   ) || [];

    const newProduct = await prisma.product.create({
      data: {
        name: values.name,
        desc: values.desc,
        content: values.content,
        images: values.images,
        sellerId: session?.user.id,
        faqs: {
          create: faqs.map((faq) => ({
            question: faq.question,
            answer: faq.answer,
          })),
        },
        colors: {
          create: values.colors.map((color) => ({
            status: "EXISTENT",
            name: color.name,
            hexCode: color.hexCode,
            price: parseFloat(color.price),
            discount: parseFloat(color.discount),
            stocks: parseInt(color.stocks),
          })),
        },
      },
      include: getProductDataInclude(session?.user?.id),
    });

    if (!newProduct) throw new Error("Failed to create the product");

    return newProduct;
  } catch (err) {
    // console.error(err)
    // console.log(err)
    throw new Error(err);
  }
}

export async function editProduct(values) {
  try {
    const session = await auth();
    if (!session) throw new Error("Unauthorized");
    console.log(values)
    const faqs =
      values.faqs?.filter(
        (faq) => faq !== undefined && faq.question && faq.answer
      ) || [];
      
      if(values.rmFiles.length > 0){
        try{
         const deletedImages = await utapi.deleteFiles(values.rmFiles);
         console.log(deletedImages)
        }
        catch(err){
          console.error(err)
          throw new Error('field to delete archive image')
        }
      }
    const editedProduct = await prisma.product.update({
      where: { id: values.productId },
      data: {
        name: values.name,
        desc: values.desc,
        content: values.content,
        images: values.images,
        faqs: {
          deleteMany:{},
          create: faqs.map((faq) => ({
            question: faq.question,
            answer: faq.answer,
          })),
        },
        colors: {
          deleteMany:{},
          create:values.colors.map((color) => ({
            status: "EXISTENT",
            name: color.name,
            hexCode: color.hexCode,
            price: parseFloat(color.price),
            discount: parseFloat(color.discount),
            stocks: parseInt(color.stocks),
          })),
        },
      },
      include: getProductDataInclude(session?.user?.id),
    });

    return editedProduct;
  } catch (error) {
    throw new Error(error);
  }
}

export async function deleteProduct(values) {
  try{
    console.log(values)
    const id = values.id;
  
    const session = await auth();
    if (!session) throw new Error("Unauthorized");
  
    const product = await prisma.product.findUnique({
      where: { id },
    });
  
    if (!product) throw new Error("product not found");
  
    if (product.sellerId !== session?.user?.id) throw new Error("Unauthorized");
  
    // console.log(values.removeKey)
    if(values.removeKey.length > 0){
      try{
        await utapi.deleteFiles(values.removeKey);
      }
      catch(err){
        console.error(err)
        throw new Error('field to delete archive image')
      }
    }
  
    const deletedProduct = await prisma.product.delete({
      where: { id },
      include: getProductDataInclude(session?.user?.id),
    });
  
    return deletedProduct;
  }
  catch(error){
    throw new Error(error)
  }
}
