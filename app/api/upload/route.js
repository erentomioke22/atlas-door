import fs from 'fs';
import { writeFile } from 'fs/promises';
import { NextResponse } from 'next/server';
import path, { join } from 'path';
import formidable from 'formidable';
import sharp from 'sharp';
import { auth } from '@auth';

// export const runtime = 'nodejs';
// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

export async function POST(req) {
  try {
    const session = auth();
    if (!session) {
      return NextResponse.json({ status: 400, error: 'Invalid request' });
    }

    const data = await req.formData();
    const file = data.get('file');
    // console.log(file);

    if (!file) {
      return NextResponse.json({ status: 400, error: 'File not exist' });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = join(process.cwd(), 'public', 'uploads', 'post-content');

    // Ensure the upload directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const uniqueSuffix = Date.now() + '_' + Math.round(Math.random() * 10);
    const originalFileName = `${uniqueSuffix}-${file.name}`;
    const webpFileName = `${uniqueSuffix}-${file.name.split('.')[0]}.webp`;
    const originalFilePath = join(uploadDir, originalFileName);
    const webpFilePath = join(uploadDir, webpFileName);

    // Save the original file
    await writeFile(originalFilePath, buffer);

    // Convert to WebP format
    await sharp(buffer).webp().toFile(webpFilePath);

    // Return the WebP image URL
    return NextResponse.json({ 
      status: 200, 
      message: 'Image upload successful', 
      imageUrl: `/uploads/post-content/${webpFileName}` 
    });

  } catch (error) {
    // console.error('Upload error', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    );
  }
}
