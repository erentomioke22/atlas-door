// components/products/productCard.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { formatNumberFa, formatPriceFa } from '@/lib/utils';
import { getColorHex, getColorLabel } from '@/lib/constants';
import ImageCom from '../ui/Image';
import { ProductLite } from '@/lib/types';

interface ProductCardProps {
  product: ProductLite;
  draft?: boolean;
}

function getImageUrl(image: any): string | null {
  if (!image) return null;
  if (typeof image === 'string') return image;
  if (typeof image === 'object' && image.url) return image.url;
  return null;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, draft }) => {
  const link = draft
    ? `/edit-product/${product.slug}`
    : `/products/${product.slug}`;

  const firstColor = product.colors?.[0];
  const discount = firstColor?.discount || 0;
  const price = firstColor?.price || 0;
  const discountedPrice = price - (price * discount) / 100;

  const imageUrl = getImageUrl(product.images?.[0]);

  return (
    <div className="sm:w-64 border-2 border-lcard dark:border-dcard rounded-3xl shadow-sm duration-500 max-sm:w-full py-2 space-y-2 px-3 select-none">
      <Link href={link as any}>
        {imageUrl && (
          <div className="relative w-full h-36 md:h-40 rounded-3xl">
            <ImageCom
              className="h-36 md:h-40 rounded-3xl w-full"
              alt={product?.name}
              src={imageUrl}
            />
          </div>
        )}

        <h1 className="text-wrap line-clamp-3 text-xl hover:underline decoration-neutral-500 duration-150 decoration-2">
          {product?.name}
        </h1>
      </Link>

      <div className="flex mt-2 gap-2 justify-between">
        <div className="gap-2">
          <h2 className="text-nowrap text-xl">
            {formatPriceFa(discountedPrice)} تومان
          </h2>
          <div className="flex gap-1">
            {discount > 0 && (
              <h3 className="line-through text-sm decoration-1 my-auto text-neutral-500 dark:text-neutral-400">
                {formatPriceFa(price)}
              </h3>
            )}
            {discount > 1 && (
              <div className="text-orange p-1 rounded-lg bg-amber-100 text-xs">
                {formatNumberFa(discount)}%
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-wrap gap-1 my-auto">
          {product?.colors?.slice(0, 4).map((color, index) => (
            <div
              key={color?.id || `color-${product.id}-${index}`}
              title={getColorLabel(color.name)}
              className="rounded-lg w-6 h-6 border border-white/50"
              style={{
                backgroundColor: color.hexCode || getColorHex(color.name),
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;