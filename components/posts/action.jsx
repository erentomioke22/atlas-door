"use server";

import { prisma } from "@utils/database";
import { getPostDataInclude } from "@/lib/types";
import { auth } from "@auth";
// import { utapi } from "@server/uploadthing";

export async function submitPost(values) {

  
  try{
  const session = await auth()
  if (!session) throw new Error("Unauthorized");
  // console.log(values)


  let sanitizedTitle = values.title.replace(/\s+/g, '-').toLowerCase();
  const randomString = Math.random().toString(36).substring(2, 12);
  sanitizedTitle += `_${randomString}`;
 
  const faqs = values.faqs?.filter(faq => faq !== undefined && faq.question && faq.answer) || [];
  // const tocs = values.tocs?.filter(toc => toc !== undefined && toc.textContent) || [];
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
      images: [values.image],
      contentImages:values.files,
      content: values.content,
      userId: session.user.id,
      tags: {
        connect: existingTags.map((tag) => ({ id: tag.id })), 
        create:tags
          .filter((tagName) => !existingTags.some((tag) => tag.name === tagName))
          .map((tagName) => ({ name: tagName})), 
      },
      faqs: { 
        create:faqs.map((faq) => ({ 
          question: faq.question, 
          answer: faq.answer, 
        })), 
    },
    status: values.scheduledPublish && new Date(values.scheduledPublish) > new Date() 
    ? "SCHEDULED" 
    : "PUBLISHED",
  // If there's a scheduled publish date, set it as expiresAt (which we'll use as publishAt)
  ...(values.scheduledPublish && new Date(values.scheduledPublish) > new Date() && {
    expiresAt: new Date(values.scheduledPublish)
  }),
    //   tocs: { 
    //     create:tocs.map((toc) => ({ 
    //       link: toc.id, 
    //       itemIndex: toc.itemIndex, 
    //       level: toc.level, 
    //       originalLevel: toc.originalLevel, 
    //       textContent: toc.textContent, 
    //     })), 
    // },
    },
    include: getPostDataInclude(session?.user?.id),
  })
  



if(!newPost)throw new Error("Failed to create the post");
  
  return newPost;

  
}
catch(err){
  // console.error(err)
  // console.log(err)
  throw new Error (err)
}



}




export async function editPost(values) {
  const session = await auth();
  if (!session) throw new Error("Unauthorized");

 const faqs = values.faqs?.filter(faq => faq !== undefined && faq.question && faq.answer) || [];
//  const tocs = values.tocs?.filter(toc => toc !== undefined && toc.textContent) || [];
 const tags = values.tags?.filter(tag => tag !== undefined) || [];
  // console.log(values);
  // console.log(faqs);
  // console.log(tocs);
  // console.log(tags);
  
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
      images: [values.image],
      contentImages:values.files,
      content: values.content,
      items: values.items,
      userId: session?.user.id,
      tags: {
        set:[],
        connect: existingTags.map(tag => ({ id: tag.id })), 
        create: tags
          .filter(tagName => !existingTags.some(tag => tag.name === tagName))
          .map(tagName => ({ name: tagName })), 
      },
      faqs: {
        deleteMany:{},
        create: faqs.map(faq => ({ 
          id: faq.id,
          question: faq.question, 
          answer: faq.answer, 
        })),
        // update: values.faqs.map(faq => ({
        //   where: { id: faq.id },
        //   data: {
        //     question: faq.question,
        //     answer: faq.answer,
        //   },
        // })),
      },
      // tocs: {
      //   deleteMany:{},
      //   create:tocs.map(toc => ({
      //     link:toc.id, 
      //     itemIndex: toc.itemIndex, 
      //     level: toc.level, 
      //     originalLevel: toc.originalLevel, 
      //     textContent: toc.textContent, 
      //   })),
      //   // update: values.tocs.map(toc => ({
      //   //   where: { id: toc.id },
      //   //   data: {
      //   //     link: toc.link,
      //   //     itemIndex: toc.itemIndex,
      //   //     level: toc.level,
      //   //     originalLevel: toc.originalLevel,
      //   //     textContent: toc.textContent,
      //   //   },
      //   // })),
      // },
    },
    include: getPostDataInclude(session?.user?.id),
  });

  return newPost;
}


export async function deletePost(values) {
  // console.log(values)
  const id = values.id; 

const session = await  auth();
if (!session) throw new Error("Unauthorized");

const post = await prisma.post.findUnique({
  where: { id },
});

if (!post) throw new Error("Post not found");

if (post.userId !== session?.user?.id) throw new Error("Unauthorized");

// console.log(values.removeKey)
// if(values.removeKey.length > 0){
//   try{
//     await utapi.deleteFiles(values.removeKey);
//   }
//   catch(err){
//     console.error(err)
//     throw new Error('field to delete archive image')
//   }
// }

const deletedPost = await prisma.post.delete({
  where: { id },
  include: getPostDataInclude(session?.user?.id),
});

  return deletedPost;
}






