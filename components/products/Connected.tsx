"use client";

import LoadingCard from "../ui/loading/loadingCard";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import EmblaCarousel from "../ui/carousel/carousel";
import ProductCard from "./productCard";

interface ConnectedProps {
  productTitle: string;
  productId: string;
}

interface ConnectedProduct {
  id: string;
  name: string;
  images: string[];
  colors: Array<{ id: string; hexCode: string; price: number; discount: number }>;
  createdAt: string | Date;
}

function Conneccted({ productTitle, productId }: ConnectedProps) {
  const {
    data: products,
    status,
    error
  } = useQuery<ConnectedProduct[], Error>({
    queryKey: ["connected-Products", productTitle],
    queryFn: async () => {
      const response = await axios.get(
        `/api/product/connected?productTitle=${productTitle}&productId=${productId}`
      );
      return response.data.products;
    },
  });

  if (status === "success" && products.length === 0) {
    return (
      <p className="text-center text-destructive h-52 flex flex-col justify-center items-center">
        هیچ محصولی یافت نشد
      </p>
    );
  }

  if (status === "error" || error) {
    return (
      <p className="text-center text-destructive h-52 flex flex-col justify-center items-center">
        مشکلی در برقراری ارتباط وجود دارد
      </p>
    );
  }

  return (
    <div className="px-7 space-y-5">

      <EmblaCarousel options={{ loop: false, dragFree: true, direction: 'rtl' }} dot={false} autoScroll={false}>
        {status === "pending" &&
          Array(10)
            .fill({})
            .map((_, index) => {
              return (
                <div
                  className="transform translate-x-0 translate-y-0 translate-z-0  flex-none basis-[75%] md:basis-[45%] lg:basis-[30%] min-w-0 pl-4"
                  key={index}
                >
                  <LoadingCard />
                </div>
              );
            })}
        {products?.map((product) => (
          <div
            className="transform translate-x-0 translate-y-0 translate-z-0  flex-none basis-[75%] sm:basis-auto  min-w-0 pl-4 sm:pr-2 my-2"
            key={product.id}
          >
            <ProductCard product={product as any} />
          </div>
        ))}
      </EmblaCarousel>
    </div>
  );
}

export default Conneccted;