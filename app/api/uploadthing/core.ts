import { createUploadthing,FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
// import { auth } from "@auth";
// import { UploadThingError, UTApi } from "uploadthing/server";
// import { prisma } from "@utils/database";
 
 
// export const ourFileRouter = {
//   imageUploader: f({ image: { maxFileSize: "4MB" } }).onUploadComplete(async ({ metadata, file }) => {
//       console.log("file url", file.url);
//     }),
// }
 


const f = createUploadthing();

export const ourFileRouter = {
  thumbnail: f({
    image: { maxFileSize: "512KB" },
  })
    // .middleware(async () => {
      // const { session } = await getServerSession();

      // if (!session) throw new UploadThingError("Unauthorized");

      // return { session };
    // })
    .onUploadComplete(async ({ metadata, file }) => {
      // console.log("file url", file.url);
      // const oldAvatarUrl = metadata.user.avatarUrl;

      // if (oldAvatarUrl) {
      //   const key = oldAvatarUrl.split(
      //     `/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/`,
      //   )[1];

      //   await new UTApi().deleteFiles(key);
      // }

      // const newAvatarUrl = file.url.replace(
      //   "/f/",
      //   `/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/`,
      // );

      // await Promise.all([
      //   prisma.user.update({
      //     where: { id: metadata.user.id },
      //     data: {
      //       avatarUrl: newAvatarUrl,
      //     },
      //   }),
      // ]);

      // return { avatarUrl: newAvatarUrl };
    }),


  post: f({
    image: { maxFileSize: "4MB", maxFileCount: 5 },
    // video: { maxFileSize: "64MB", maxFileCount: 5 },
  })
    // .middleware(async () => {
    //   const { user } = await validateRequest();

    //   if (!user) throw new UploadThingError("Unauthorized");

    //   return {};
    // })
    .onUploadComplete(async ({ file }) => {
      // console.log("file url", file.url);
      // const media = await prisma.media.create({
      //   data: {
      //     url: file.url.replace(
      //       "/f/",
      //       `/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/`,
      //     ),
      //     type: file.type.startsWith("image") ? "IMAGE" : "VIDEO",
      //   },
      // });

      // return { mediaId: media.id };
    }),
}satisfies FileRouter;
export type OurFileRouter = typeof ourFileRouter;;

