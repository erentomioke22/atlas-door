// lib/sanity/transformers.ts
import { SanityProduct, ProductLite, ProductColorLite } from '@/lib/types';
import { getColorHex } from '@/lib/constants';

export function transformProductToLite(product: SanityProduct): ProductLite {
  const colors: ProductColorLite[] = (product.colors || []).map(
    (color, index) => ({
      id: color._key || `color-${index}`,
      name: color.color,                          // ✅ اسم رنگ (مثلاً "black")
      hexCode: getColorHex(color.color),          // ✅ تبدیل name به hex
      price: color.price,
      discount: color.discount || 0,
      stocks: color.stock || 0,
      status: color.stock > 0 ? 'EXISTENT' : 'NON-EXISTENT',
    })
  );

  return {
    _id: product._id,
    name: product.name,
    slug: product.slug,
    desc: product.desc || '',
    content: product.content || '',
    images: product.images || [],
    mainImage: product.mainImage || product.images?.[0] || '',
    category: product.category,
    sellerId: product.seller?._id,
    seller: product.seller
      ? {
          _id: product.seller._id,
          name: product.seller.name,
          image: product.seller.image || null,
        }
      : undefined,
    colors,
    material: product.material,
    dimensions: product.dimensions,
    assemblyRequired: product.assemblyRequired,
    createdAt: product.publishedAt || new Date().toISOString(),
    updatedAt: product._updatedAt || new Date().toISOString(),
  };
}