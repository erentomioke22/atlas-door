import { NextResponse } from "next/server";
import { prisma } from "@utils/database";
import { getProductDataInclude } from "@/lib/types";
import { auth } from "@auth";


export async function GET (req){
 try{
    const session = auth()
   const productName = req.nextUrl.searchParams.get('productName')
   const currentProduct = await prisma.product.findFirst({
    where:{name:productName},
    include: getProductDataInclude(session?.user?.id),
}) 
   if(!currentProduct) return NextResponse.json({error:'not found any product'});
   return NextResponse.json(currentProduct)
 }
 catch(error){
   console.log(error)
    return NextResponse.json({error})
 }
}