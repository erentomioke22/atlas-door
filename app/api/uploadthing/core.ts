import { getServerSession } from "@/lib/get-session";
import { createUploadthing,type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
 
 

 const f = createUploadthing();

export const ourFileRouter = {
  post: f({
    image: { maxFileSize: "4MB", maxFileCount: 5 },
    // video: { maxFileSize: "64MB", maxFileCount: 5 },
  })
  .middleware(async () => {
    const session = await getServerSession();

    if (session?.user.role !== 'admin') throw new UploadThingError("Unauthorized");
    return { session };
  })
  .onUploadComplete(async ({metadata, file }) => {

 }),
}satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;

