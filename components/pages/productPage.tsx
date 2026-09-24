'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import ImageCom from '@/components/ui/Image';
import { FaArrowLeftLong, FaPhone } from 'react-icons/fa6';
import { IoShareOutline } from 'react-icons/io5';
import { FaEraser } from 'react-icons/fa6';
import { toast } from 'sonner';
import EmblaCarousel from '@/components/ui/carousel/carousel';
import { formatPriceFa } from '@/lib/utils';
import { ProductFull, ProductColorLite } from '@/lib/types';
import Button from '@/components/ui/button';
import dynamic from 'next/dynamic';
import { PortableText } from '@portabletext/react';
import { portableTextComponents } from '@/lib/portableTextComponents';
import type { Session } from '@/lib/auth';
import { useCartSync } from '@/hook/useCartSync';
import { getColorHex, getColorLabel } from '@/lib/constants';

const Comments = dynamic(() => import('@/components/comments/comments'));
const Connected = dynamic(() => import('@/components/products/Connected'));
const AddToCartButton = dynamic(
  () => import('@/components/products/AddToCartButtonRoot')
);

interface ProductPageProps {
  initialProduct: ProductFull;
  session: Session | null;
}

interface ColorState {
  id: string;
  name: string;
  discount: number | null;
  price: number;
  discountedPrice: number;
  stocks: number;
  hexCode: string;
}

const ProductPage: React.FC<ProductPageProps> = ({ initialProduct, session }) => {
  useCartSync();
  const [product] = useState(initialProduct);
  const [selectedColor, setSelectedColor] = useState<ColorState | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  const currentUrl = useMemo(
    () => `${process.env.NEXT_PUBLIC_BASE_URL}${pathname}`,
    [pathname]
  );

  const priceRange = useMemo(() => {
    if (!product.colors?.length) return null;
    const prices = product.colors.map((c) => c.price);
    return {
      min: formatPriceFa(Math.min(...prices)),
      max: formatPriceFa(Math.max(...prices)),
    };
  }, [product.colors]);

  useEffect(() => {
    if (product?.colors?.length > 0 && !selectedColor) {
      const availableColors = product.colors.filter(
        (color) => color.status === 'EXISTENT' && color.stocks >= 1
      );

      if (availableColors.length > 0) {
        const firstColor = availableColors[0];
        setSelectedColor({
          id: firstColor.id,
          name: firstColor.name,
          discount: firstColor.discount,
          price: firstColor.price,
          discountedPrice: firstColor.discount
            ? firstColor.price - (firstColor.price * firstColor.discount) / 100
            : firstColor.price,
          stocks: firstColor.stocks,
          hexCode: firstColor.hexCode,
        });
      }
    }
  }, [product, selectedColor]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.desc,
          url: currentUrl,
        });
      } catch {
        await navigator.clipboard.writeText(currentUrl);
        toast.success('لینک کپی شد');
      }
    } else {
      await navigator.clipboard.writeText(currentUrl);
      toast.success('لینک کپی شد');
    }
  };

  const handleColorSelect = (color: ProductColorLite) => {
    setSelectedColor({
      id: color.id,
      name: color.name,
      discount: color.discount,
      price: color.price,
      discountedPrice: color.discount
        ? color.price - (color.price * color.discount) / 100
        : color.price,
      stocks: color.stocks,
      hexCode: color.hexCode,
    });
  };

  if (!selectedColor) {
    return (
      <div className="container max-w-4xl lg:max-w-6xl mx-auto px-4 lg:px-6 py-8">
        <div className="animate-pulse space-y-5">
          <div className="h-8 bg-lcard dark:bg-dcard rounded w-1/3" />
          <div className="h-96 bg-lcard dark:bg-dcard rounded" />
        </div>
      </div>
    );
  }

  const availableColors =
    product.colors?.filter(
      (color) => color.status === 'EXISTENT' && color.stocks >= 1
    ) || [];
console.log(availableColors)
  return (
    <div className="px-5 container sm:max-w-xl lg:max-w-4xl xl:max-w-7xl mx-auto mt-16">
      <Button
        variant="back"
        onClick={() => router.back()}
        className="mb-6 text-sm flex"
      >
        بازگشت
        <FaArrowLeftLong className="ml-2 my-auto" />
      </Button>

      <div className="flex gap-2 sm:gap-3 my-auto">
        <a
          href="tel:09901196140"
          onClick={() => {
            toast.success('شماره کپی شد');
            navigator.clipboard.writeText('09901196140');
          }}
          title="call number"
          aria-label="call number"
          className="bg-lcard dark:bg-dcard rounded-full p-2 text-sm sm:text-lg"
        >
          <FaPhone />
        </a>
        <div>
          <button
            aria-label="share product"
            title="share product"
            className="bg-lcard dark:bg-dcard rounded-full p-2 text-sm sm:text-lg"
            onClick={handleShare}
          >
            <IoShareOutline />
          </button>
        </div>
        {session?.user?.id === product?.sellerId && (
          <a
            className="bg-lcard dark:bg-dcard rounded-full p-2 text-sm sm:text-lg"
            href={`/admin/edit-product/${product?.slug}`}
          >
            <FaEraser />
          </a>
        )}

        <Comments
          target={{
            targetType: 'product',
            targetId: product._id,
            targetOwnerId: product.sellerId,
            discussions: true, // یا از Sanity
          }}
          session={session}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="space-y-10 md:space-y-12">
          <div className="space-y-5 md:mt-7">
            <div className="space-y-3">
              {priceRange && priceRange.min !== priceRange.max && (
                <span className="text-neutral-500 dark:text-neutral-300 text-[10px] md:text-sm">
                  قیمت از {priceRange.min} تا {priceRange.max} تومان
                </span>
              )}
              <h1 className="text-xl md:text-4xl w-full wrap-break-word text-black dark:text-white leading-8 md:leading-[60px]">
                {product.name}
              </h1>
            </div>
          </div>
<div className='text-wrap flex justify-between gap-2'>
          {availableColors.map((color) => (
  <button
    key={color.id}
    onClick={() => handleColorSelect(color)}
    aria-label={`انتخاب رنگ ${getColorLabel(color.name)}`}
    title={getColorLabel(color.name)}         // ✅ اسم فارسی
    className={`
      relative w-9 h-9 rounded-xl transition-all border-2 duration-300
      ${
        selectedColor.id === color.id
          ? 'ring-2 ring-black dark:ring-white'
          : 'border-lcard dark:border-dcard hover:border-lbtn dark:hover:border-dbtn'
      }
    `}
    style={{ backgroundColor: color.hexCode }}  // ✅ hex درست
  />
))}

{/* نمایش اسم رنگ */}
<span className="text-sm text-muted-foreground">
  {getColorLabel(selectedColor.name)}   {/* ✅ "مشکی" به جای "black" */}
</span>

</div>

          <div className="flex flex-wrap justify-between gap-2">
            <p className="my-auto">قیمت</p>
            <div className="flex flex-col flex-wrap gap-2 text-xl">
              <p className="my-auto">
                {formatPriceFa(selectedColor.discountedPrice)} تومان
              </p>
              {selectedColor.discount !== null && selectedColor.discount > 0 && (
                <div className="flex gap-1 text-end">
                  <p className="line-through decoration-2 my-auto text-neutral-500 dark:text-neutral-300">
                    {formatPriceFa(selectedColor.price)}
                  </p>
                  <span className="text-redorange text-sm">
                    {selectedColor.discount}% تخفیف
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-wrap justify-between my-auto gap-2">
            {/* <div className="flex flex-col gap-2">
              <div>
                <a
                  className="bg-lcard dark:bg-dcard rounded-xl text-sm px-10 py-2 border-2 border-lfont"
                  href="tel:09901196140"
                  onClick={() => {
                    toast.success('شماره کپی شد');
                    navigator.clipboard.writeText('09901196140');
                  }}
                >
                  تماس
                </a>
              </div>
            </div> */}

            <div>
              <AddToCartButton
                session={session}
                product={product}
                colorId={selectedColor.id}
                stocks={selectedColor.stocks}
                disabled={selectedColor.stocks === 0}
              />
            </div>
          </div>
        </div>

        <EmblaCarousel
          options={{ loop: false, direction: 'rtl' }}
          dot={true}
          buttons={true}
          autoScroll={false}
          length={product?.images?.length > 1}
        >
          {product?.images?.map((image, index) => (
            <div
              className="transform translate-x-0 translate-y-0 translate-z-0 flex-none basis-full h-64 md:h-96 min-w-0 pl-2"
              key={index}
            >
              <ImageCom
                className="basis-full h-64 md:h-96 rounded-xl"
                src={image}
                alt={`${product.name} - تصویر ${index + 1}`}
              />
            </div>
          ))}
        </EmblaCarousel>
      </div>

      {product.content && (
        <article className="content wrap-break-word w-full normal-case leading-relaxed md:text-lg max-md:text-sm my-12 prose prose-lg dark:prose-invert max-w-none">
          <PortableText
            value={product.content as any}
            components={portableTextComponents}
          />
        </article>
      )}

      <section className="space-y-10">
        <div>
          <h1 className="text-lg sm:text-xl text-neutral-500 dark:text-neutral-300">
            <span className="text-2xl sm:text-4xl text-black dark:text-white uppercase">
              محصولات
            </span>{' '}
            پرفروش و مرتبط
          </h1>
        </div>

        {/* <Connected
          productTitle={product?.name}
          productId={product?._id}
          relatedProducts={product.relatedProducts}
        /> */}
      </section>
    </div>
  );
};

export default ProductPage;