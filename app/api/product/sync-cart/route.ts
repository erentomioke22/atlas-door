import { NextRequest, NextResponse } from 'next/server';
import { client } from '@/sanity/lib/client';
import { groq } from 'next-sanity';

export async function POST(req: NextRequest) {
  try {
    const { productIds } = (await req.json()) as { productIds: string[] };

    if (!productIds || productIds.length === 0) {
      return NextResponse.json({ products: [] });
    }

    const query = groq`
      *[_type == "product" && _id in $productIds] {
        _id,
        name,
        "slug": slug.current,
        "images": images[].asset->url,
        colors[] {
          _key,
          color,
          price,
          discount,
          stock
        }
      }
    `;

    const products = await client.fetch(query, { productIds });

    return NextResponse.json({ products });
  } catch (error) {
    console.error('Sync cart error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}