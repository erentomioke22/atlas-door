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

const ProductCard: React.FC<ProductCardProps> = ({ product, draft }) => {
  const link = draft
    ? `/edit-product/${product.slug}`
    : `/products/${product.slug}`;

  const firstColor = product.colors?.[0];
  const discount = firstColor?.discount || 0;
  const price = firstColor?.price || 0;
  const discountedPrice = price - (price * discount) / 100;
 console.log(product)
  return (
    <div className="sm:w-64 border-2 border-lcard dark:border-dcard rounded-3xl shadow-sm duration-500 max-sm:w-full py-2 space-y-2 px-3 select-none">
      <Link href={link as any}>
        {product?.images?.[0] && (
          <div className="relative w-full h-36 md:h-40 rounded-3xl">
            <ImageCom
              className="h-36 md:h-40 rounded-3xl w-full"
              alt={product?.name}
              src={product?.images[0]}
            />
            <div className="inset-0 absolute">
              <div className="flex justify-between m-2">
                {/* ✅ نمایش رنگ‌ها */}
                <div className="flex gap-2 backdrop-blur-sm p-2 rounded-lg bg-white/20">
                  {product?.colors?.slice(0, 4).map((color, index) => (
                    <div
                      key={color?.id || `color-${product._id}-${index}`}
                      title={getColorLabel(color.name)}   // ✅ اسم فارسی
                      className="rounded-full w-4 h-4 border border-white/50"
                      style={{
                        backgroundColor: color.hexCode || getColorHex(color.name),
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <h1 className="text-wrap line-clamp-3 text-neutral-500 dark:text-neutral-400 hover:underline decoration-black dark:decoration-white duration-150 decoration-2">
          {product?.name}
        </h1>
      </Link>

      <div className="flex justify-between">
        <div className="gap-2">
          <h2>{formatPriceFa(discountedPrice)} تومان</h2>
          {discount > 0 && (
            <h3 className="line-through text-sm decoration-2 my-auto text-neutral-500 dark:text-neutral-400">
              {formatPriceFa(price)}
            </h3>
          )}
        </div>
        <div>
        {discount > 1 && (
                  <div className="text-white backdrop-blur-sm p-1.5 rounded-lg bg-redorange text-[10px]">
                    {formatNumberFa(discount)}%
                  </div>
                )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;