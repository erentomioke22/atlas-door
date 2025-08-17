"use server";

import { prisma } from "@utils/database";
import { getPostDataInclude } from "@/lib/types";
import { auth } from "@auth";
import { utapi } from "@server/uploadthing";

export async function submitPost(values) {
  try{



  const session = await auth()
  if (!session) throw new Error("Unauthorized");


  let sanitizedTitle = values.title.replace(/\s+/g, '-').toLowerCase();
  const randomString = Math.random().toString(36).substring(2, 12);
  sanitizedTitle += `_${randomString}`;
 


  const tags = values.tags?.filter(tag => tag !== undefined) || [];

  const existingTags = await prisma.tag.findMany({
      where: {
        name: {
          in: tags,
        },
      },
  });

  const newPost = await prisma.post.create({
    data: {
      title: values.title,
      link:sanitizedTitle,
      desc:values.desc,
      images: values.images,
      content: values.content,
      userId: session.user.id,
      tags: {
        connect: existingTags.map((tag) => ({ id: tag.id })), 
        create:tags
          .filter((tagName) => !existingTags.some((tag) => tag.name === tagName))
          .map((tagName) => ({ name: tagName})), 
      },
    status: values.scheduledPublish && new Date(values.scheduledPublish) > new Date() 
    ? "SCHEDULED" 
    : "PUBLISHED",
  ...(values.scheduledPublish && new Date(values.scheduledPublish) > new Date() && {
    expiresAt: new Date(values.scheduledPublish)
  }),
    },
    include: getPostDataInclude(session?.user?.id),
  })
  



if(!newPost)throw new Error("Failed to create the post");
  
  return newPost;

  
}
catch(err){
  throw new Error (err)
}



}




export async function editPost(values) {
  try{

    const session = await auth();
    if (!session) throw new Error("Unauthorized");
  
   const tags = values.tags?.filter(tag => tag !== undefined) || [];
    

   if(values.rmFiles.length > 0){
    try{
      await utapi.deleteFiles(values.rmFiles);
    }
    catch(err){
      console.error(err)
      throw new Error('field to delete archive image')
    }
  }

    const existingTags = await prisma.tag.findMany({
      where: {
        name: {
          in:tags,
        },
      },
    });
  
  
    const newPost = await prisma.post.update({
      where: { id: values.postId },
      data: {
        title: values.title,
        desc: values.desc,
        images: values.images,
        content: values.content,
        userId: session?.user.id,
        tags: {
          set:[],
          connect: existingTags.map(tag => ({ id: tag.id })), 
          create: tags
            .filter(tagName => !existingTags.some(tag => tag.name === tagName))
            .map(tagName => ({ name: tagName })), 
        },
      },
      include: getPostDataInclude(session?.user?.id),
    });
  
    return newPost;
  }
  catch(error){
   throw new Error(error)
  }
}


export async function deletePost(values) {
  try{
    const id = values.id; 
  
  const session = await  auth();
  if (!session) throw new Error("Unauthorized");
  
  const post = await prisma.post.findUnique({
    where: { id },
  });
  
  if (!post) throw new Error("Post not found");
  
  if (post.userId !== session?.user?.id) throw new Error("Unauthorized");
  
  if(values.removeKey.length > 0){
    try{
      await utapi.deleteFiles(values.removeKey);
    }
    catch(err){
      console.error(err)
      throw new Error('field to delete archive image')
    }
  }
  
  const deletedPost = await prisma.post.delete({
    where: { id },
    include: getPostDataInclude(session?.user?.id),
  });
  
    return deletedPost;

  }
  catch(error){
    throw new Error(error)
  }
}






