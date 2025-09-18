"use client";

import LoadingCard from "@components/ui/loading/loadingCard";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import EmblaCarousel from "@components/ui/carousel/carousel";
import ProductCard from "./productCard";


function Conneccted({productTitle,productId}) {


  const {
    data:products,
    isFetching,
    status,
    error
  } = useQuery({
    queryKey: ["connected-Products",productTitle],
    queryFn: async () => {
      const response = await axios.get(
        `/api/product/connected?productTitle=${productTitle}&productId=${productId}`
      );
      return response.data;
    },
  });



  return (
    <div className="px-7 space-y-5">




{status === "error" || products?.error || error && 
          <p className="text-center text-lfont underline">
            مشکلی در دریافت اطلاعات پیش آمده لطفا صفحه را یکبار رفرش کنید
          </p>
      }

      {status === "success" && products?.length <= 0  && 
        <p className="text-center text-lfont underline">
           هنوز محصولی در اینجا قرار داده نشده
       </p>
      }

     <EmblaCarousel options={{loop:false,dragFree: true,direction:'rtl'}}                 
               dot={false}
               autoScroll={false}>
            {status === "pending" && 
                    Array(10)
                      .fill({})
                      .map((_,index) => {
                        return <div className="transform translate-x-0 translate-y-0 translate-z-0  flex-none basis-[75%] md:basis-[45%] lg:basis-[30%] min-w-0 pl-4" key={index}><LoadingCard /></div>;
                  })
            }
          {products?.map((product)=>(
        <div className="transform translate-x-0 translate-y-0 translate-z-0  flex-none basis-[75%] sm:basis-auto  min-w-0 pl-4 sm:pr-2 my-2" 
         key={product.id}>
               <ProductCard product={product} />
         </div>
          ))}
          
         
        </EmblaCarousel>

    </div>
  );
}

export default Conneccted;