import { NextResponse } from "next/server";
import { prisma } from "@utils/database";
import { getPostDataInclude, PostsPage } from "@/lib/types";
import { auth } from "@auth";


export async function GET (req){
 try{
    const session = auth()
   const postTitle = req.nextUrl.searchParams.get('postTitle')
   const currentPost = await prisma.post.findFirst({
    where:{link:postTitle},
    include: getPostDataInclude(session?.user?.id),
}) 
   if(!currentPost) return NextResponse.json({error:'not found any post'},{status:400});
   return NextResponse.json(currentPost)
 }
 catch(error){
   console.error(error)
    return NextResponse.json({error},{status:500})
 }
}