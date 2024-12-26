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
  const tocs = values.tocs?.filter(toc => toc !== undefined && toc.textContent) || [];
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
      contentImages: values.contentImages,
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
      tocs: { 
        create:tocs.map((toc) => ({ 
          link: toc.id, 
          itemIndex: toc.itemIndex, 
          level: toc.level, 
          originalLevel: toc.originalLevel, 
          textContent: toc.textContent, 
        })), 
    },
    },
    include: getPostDataInclude(session?.user?.id),
  })
  
// console.log(newPost)
  
  // const deleteArchived = await prisma.archive.findMany({
  //   where:{
  //      userId:session?.user.id,
  //      url:{
  //       notIn:imagesKey
  //     }
  //   },
  //   select:{
  //     url:true
  //   }
  // })
  
  // console.log(deleteArchived.map((url)=>url.url))
  // if(deleteArchived){
  //   try{
  //     await utapi.deleteFiles(deleteArchived.map((url)=>url.url));
  //     await prisma.archive.deleteMany({
  //       where:{
  //         userId:session?.user.id,
  //         url:{
  //           in:imagesKey
  //         }
  //       }
  //     })
  //   }
  //   catch(err){
  //     console.error(err)
  //     throw new Error('field to delete archive image')
  //   }
  // }


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
 const tocs = values.tocs?.filter(toc => toc !== undefined && toc.textContent) || [];
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
  // await prisma.post.update({ 
  //   where: { 
  //     id: values.postId 
  //   },
  //    data: { 
  //     tags: { set: [], },
  //    }, 
  //   });
  // console.log(values.rmFiles);
  // if (values.rmFiles.length > 0) {
  //   try {
  //     await utapi.deleteFiles(values.rmFiles);
  //   } catch (err) {
  //     console.error(err);
  //     throw new Error('Failed to delete archive image');
  //   }
  // }

  // // Delete faqs that are no longer in the updated values
  // await prisma.faq.deleteMany({
  //   where: {
  //     postId: values.postId,
  //     // question: {
  //     //   notIn: values.faqs.map(faq => faq.question),
  //     // },
  //   },
  // });

  // // Delete tocs that are no longer in the updated values
  // await prisma.toc.deleteMany({
  //   where: {
  //     postId: values.postId,
  //     // link: {
  //     //   notIn: values.tocs.map(toc => toc.id),
  //     // },
  //   },
  // });

  const newPost = await prisma.post.update({
    where: { id: values.postId },
    data: {
      title: values.title,
      desc: values.desc,
      images: [values.image],
      contentImages: values.contentImages,
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
      tocs: {
        deleteMany:{},
        create:tocs.map(toc => ({
          link:toc.id, 
          itemIndex: toc.itemIndex, 
          level: toc.level, 
          originalLevel: toc.originalLevel, 
          textContent: toc.textContent, 
        })),
        // update: values.tocs.map(toc => ({
        //   where: { id: toc.id },
        //   data: {
        //     link: toc.link,
        //     itemIndex: toc.itemIndex,
        //     level: toc.level,
        //     originalLevel: toc.originalLevel,
        //     textContent: toc.textContent,
        //   },
        // })),
      },
    },
    include: getPostDataInclude(session?.user?.id),
  });

  return newPost;
}


export async function deletePost(values) {
  console.log(values)
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


// export async function createArchive(url) {

//   const session = await auth()
//   if (!session) throw new Error("Unauthorized");
  
//   const newArchive = await prisma.archive.create({
//       data:{
//         url:url,
//         userId:session?.user.id
//       }
//   })
  
//   return newArchive;
  
//   }



