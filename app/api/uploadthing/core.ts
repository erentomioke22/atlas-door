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

// import fs from 'fs';
// import { NextRequest, NextResponse } from 'next/server';
// import { join } from 'path';
// import sharp from 'sharp';
// import { getServerSession } from '@/lib/get-session';
// interface UploadResponse {
//   status: number;
//   message: string;
//   imageUrl?: string;
//   error?: string;
//   details?: string;
// }

// export async function POST(req: NextRequest): Promise<NextResponse<UploadResponse>> {
//   try {
//     const session = await getServerSession();
//     if (!session) {
//       return NextResponse.json({ success:false, status: 400, message: 'Invalid request' });
//     }

//     const data = await req.formData();
//     const file = data.get('file') as File;

//     if (!file) {
//       return NextResponse.json({ success:false, status: 400, message: 'File not exist' });
      
//     }

//     const bytes = await file.arrayBuffer();
//     const buffer = Buffer.from(bytes);
//     const uploadDir = join(process.cwd(), 'public', 'uploads', 'post-content');
    
//     // Ensure the upload directory exists
//     if (!fs.existsSync(uploadDir)) {
//       fs.mkdirSync(uploadDir, { recursive: true });
//     }

//     const webpFileName = `${file.name.split('.')[0]}.webp`;
//     const webpFilePath = join(uploadDir, webpFileName);

//     // Check if the WebP file already exists
//     if (fs.existsSync(webpFilePath)) {
//       return NextResponse.json({ 
//         status: 200, 
//         message: 'Image already exists', 
//         imageUrl: `/uploads/post-content/${webpFileName}` 
//       });
//     }

//     // Convert to WebP format and save the file
//     await sharp(buffer).webp().toFile(webpFilePath);

//     // Return the WebP image URL
//     return NextResponse.json({ 
//       status: 200, 
//       message: 'Image upload successful', 
//       imageUrl: `/uploads/post-content/${webpFileName}` 
//     });
//   } catch (error) {
//     console.error('Upload error', error);
//     return NextResponse.json( 
//       { 
//         success:false,
//         status: 500,
//         message: 'Internal Server Error', 
//         details: error instanceof Error ? error.message : 'Unknown error'
//       }
//     );
//   }
// }