// components/products/Connected.tsx
'use client';

import React from 'react';
import ProductCard from '@/components/products/productCard';
import EmblaCarousel from '@/components/ui/carousel/carousel';
import { ProductLite } from '@/lib/types';

interface RelatedProductsProps {
  relatedProducts: ProductLite[];
}

export default function Connected({ relatedProducts }: RelatedProductsProps) {
  if (!relatedProducts || relatedProducts.length === 0) {
    return (
      <p className="text-center text-neutral-500 dark:text-neutral-400 h-52 flex flex-col justify-center items-center">
        هیچ محصول مرتبطی یافت نشد
      </p>
    );
  }

  return (
    <EmblaCarousel
      options={{ loop: false, dragFree: true, direction: 'rtl' }}
      dot={false}
      autoScroll={false}
    >
      {relatedProducts.map((product) => (
        <div
          className="transform translate-x-0 translate-y-0 translate-z-0 flex-none basis-[75%] sm:basis-auto min-w-0 pl-4 sm:pr-2 my-2"
          key={product._id}
        >
          <ProductCard product={product} />
        </div>
      ))}
    </EmblaCarousel>
  );
}