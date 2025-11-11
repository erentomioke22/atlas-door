"use client";

import React, { useState } from "react";
import PostCard, { PostLite } from "@/components/posts/postCard";
import LoadingCard from "@/components/ui/loading/loadingCard";
import Link from "next/link";
import EmblaCarousel from "@/components/ui/carousel/carousel";
import { FaCaretRight } from "react-icons/fa6";
import AboutUs from "@/components/aboutus";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import ImageCom from "@/components/ui/Image";
import ProductCard, { ProductLite } from "@/components/products/productCard";
import { LuShieldCheck, LuHammer, LuTimer, LuBadgeDollarSign , LuBaggageClaim ,LuCircleCheckBig  } from "react-icons/lu";

interface Project {
  name: string;
  url: string;
  image: string;
}



interface HomeData {
  posts?: PostLite[];
  products?: ProductLite[];
}

function Home() {
  const [item, setItem] = useState("new-post");

  const {
    data,
    status,
  } = useQuery<HomeData>({
    queryKey: ["home-data"],
    queryFn: async () => {
      const response = await axios.get(`/api/posts/home?category=${item}`);
      return response.data;
    },
  });

  const projects: Project[] = [
    {
      name: 'درب اتوماتیک',
      url: '/posts/درب-های-اتوماتیک_lxi5fhspu7',
      image: '/images/automatic-door/slide/thumnail.jpg'
    },
    {
      name: 'شیشه سکوریت',
      url: '/posts/شیشه-سکوریت-چیست؟-مزایا،-کاربردها-و-تفاوت-با-شیشه-معمولی_b2qh02hbuv',
      image: '/images/tempered-glass/1732009538381.jpg'
    },
    {
      name: 'شیشه لمینت',
      url: '/posts/شیشه-لمینت:-انواع،-مزایا،-معایب-و-کاربردها-در-ساختمان-و-خودرو-|-راهنمای-جامع_jucfrkg1a7',
      image: '/images/laminet-glass/thumnail.jpg'
    },
    {
      name: 'پارتیشن شیشه ای',
      url: '/posts/پارتیشن-شیشه‌ای:-راهنمای-کامل-نصب،-مزایا،-معایب-و-انواع-|-قیمت-و-طراحی_aqscgthk3m',
      image: '/images/partition/1732009538326.jpg'
    },
    {
      name: 'جام بالکن',
      url: '/posts/شیشه-های-بالکنی-و-شیشه-های-ایمنی-برای-پرتگاه-ها:-راهنمای-جامع_4unfbbxaua',
      image: '/images/balcony/media_20241118_121418_6280590525011645464.jpg'
    },
  ];

  const handlePhoneClick = () => {
    toast.success('شماره کپی شد');
    navigator.clipboard.writeText('09901196140');
  };

  return (
    <div className="container max-w-2xl lg:max-w-7xl px-5 py-20 mx-auto space-y-20">

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="text-center lg:text-start mx-auto space-y-5">
          <h4 className="leading-normal text-balance text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight">
            تمرکز ما بر <span className="bg-linear-to-tr text-clip from-blue to-darkgreen text-transparent bg-clip-text">کیفیت و عملکرد</span> هربار تجربه ای زیبا را تضمین میکند
          </h4>
          <h1 className="text-pretty text-base md:text-lg leading-loose">
            نمايندگی شيشه سكوريت و خام - فروش و ارائه خدمات كركره برقی - فروش و ارائه خدمات انواع درب های اتوماتيک - نصب و تعمير انواع شيشه های سكوريت ، نرده های شيشه ای ، پارتيشن های اداری ، حمام شیشه ای و جام بالكن ها 
          </h1>
           <div className="flex flex-wrap gap-3 text-center justify-center lg:justify-start text-sm lg:text-base">
            <div className="flex gap-1">
              <LuCircleCheckBig className="text-darkgreen text-lg my-auto"/>
              <p className="text-lfont">پروژه های انجام شده : </p>
              <span>+ ۱۰۰۰</span>
            </div>
            <div className="flex gap-1">
              <LuBaggageClaim className="text-blue text-lg my-auto"/>
              <p className="text-lfont">محصولات و خدمات : </p>
              <span>+ ۱۰</span>
            </div>
           </div>
  
          <div className="flex justify-center lg:justify-start gap-3">
            <a 
              href="tel:09901196140" 
              onClick={handlePhoneClick}
              className="bg-black px-10 text-center py-2 text-white dark:bg-white dark:text-black rounded-full"
            >
              تماس
            </a>
            <Link href="/posts" className="bg-lcard dark:bg-dcard rounded-lg py-2 px-5">
              مقاله ها
            </Link>
          </div>
        </div >
        <div className="relative  w-full h-64 sm:h-96 lg:h-full ">
            <ImageCom 
                    className='object-cover rounded-xl w-full h-full'
                    alt={"thumnail Image"} 
                    src={'/images/balcony/media_20241118_121418_7608682146116698746.jpg'} 
                  />
        </div>
      </div>

      <div className="space-y-10">
        <div className="text-center">
          <h4 className="leading-normal text-balance text-4xl md:text-[60px] font-semibold tracking-tight">
            <span className="bg-linear-to-tr text-clip from-blue to-darkgreen text-transparent bg-clip-text">خدمات و محصولات</span> ما برای خدمت به شما مشتریان عزیز
          </h4>
        </div>

        <EmblaCarousel 
          options={{ loop: true, dragFree: true, direction: 'rtl' }}                 
          dot={false}
          autoScroll={false}
        >
          {projects.map((project) => (
            <div 
              className="transform translate-x-0 translate-y-0 translate-z-0 flex-none basis-[75%] md:basis-[45%] lg:basis-[30%] min-w-0 pl-4" 
              key={project.url}
            >
              <Link href={project.url as any}>
                <div className="relative w-full h-[200px] md:h-[250px]">
                  <ImageCom 
                    className='object-cover h-[200px] md:h-[250px] rounded-xl w-full'
                    alt={"thumnail Image"} 
                    src={project.image} 
                  />
                  <div className="absolute inset-x-0 bottom-0 rounded-b-xl mx-auto py-3 w-full bg-linear-to-t from-black/75 from-50% to-transparent flex justify-between px-3 items-center">
                    <h1 className="text-2xl text-white">{project.name}</h1>
                    <button
                       aria-label="right icon" 
                      title="right icon" 
                      className="bg-white p-1 text-sm rounded-full text-black my-auto">
                      <FaCaretRight/>
                    </button>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </EmblaCarousel>
      </div>

      <div className="space-y-10 relative px-5">
        <div className="text-center">
          <h4 className="text-4xl md:text-[60px] leading-normal text-balance font-semibold tracking-tight">
            هر چیزی که برای انجام <span className="bg-linear-to-tr text-clip from-blue to-darkgreen text-transparent bg-clip-text">پروژه</span> هایتان نیاز دارید
          </h4>
        </div>

        <div className="grid gap-4 lg:grid-cols-3 lg:grid-rows-2">
          <div className="px-8 py-5 lg:row-span-2 space-y-3 hover:bg-lcard dark:hover:bg-dcard duration-200 rounded-xl max-lg:text-center">
            <LuBadgeDollarSign className="text-4xl max-lg:mx-auto"/>
            <p className="text-2xl">قیمت</p>
            <p className="text-lfont">
              خريد محصولات و دريافت خدمات با رقابتی ترين قيمت بازار
            </p>
          </div>
          
          <div className="px-8 py-5 lg:row-span-2 space-y-3 hover:bg-lcard dark:hover:bg-dcard duration-200 rounded-xl max-lg:text-center">
            <LuHammer className="text-4xl max-lg:mx-auto"/>
            <p className="mt-2 text-2xl">عملکرد</p>
            <p className="text-lfont">
            قدرت محصولات با کیفیت مارا که برای عملکرد زیبا در طول زمان طراحی شده اند ؛ تجربه کنید .
            </p>
          </div>

          <div className="px-8 py-5 lg:row-span-2 space-y-3 hover:bg-lcard dark:hover:bg-dcard duration-200 rounded-xl max-lg:text-center">
            <LuShieldCheck className="text-4xl max-lg:mx-auto"/>
            <p className="mt-2 text-2xl">استاندارد</p>
            <p className="text-lfont">
              استاندارد را در خرید محصولات و خدمات ما تجربه کنید
            </p>
          </div>

          <div className="px-8 py-5 lg:row-span-2 space-y-3 hover:bg-lcard dark:hover:bg-dcard duration-200 rounded-xl max-lg:text-center">
            <LuTimer className="text-4xl max-lg:mx-auto"/>
            <p className="mt-2 text-2xl">زمان</p>
            <p className="text-lfont">
              تمامی خدمات ما در کمترین زمان ممکن به مشتری ها ارائه میشوند
            </p>
          </div>
        </div>
      </div>

      <AboutUs/>

      <div className="space-y-10">
        <div>
          <div className="flex justify-between">
            <p className="text-2xl">مقاله ها</p>
            <div>
              <Link className="bg-black py-2 px-3 rounded-full dark:bg-white text-white dark:text-black text-center" href={'/posts'}>
                تمام مقاله ها 
              </Link>
            </div>
          </div>
        </div>

        {status === "error" && 
          <p className="text-center text-lfont underline">
            مشکلی در دریافت اطلاعات پیش آمده لطفا صفحه را یکبار رفرش کنید
          </p>
        }

        {status === "success" && !data?.posts?.length && 
          <p className="text-center text-lfont underline">
            هنوز پستی در اینجا قرار داده نشده
          </p>
        }

        <EmblaCarousel 
          options={{ loop: false, dragFree: true, direction: 'rtl' }}                 
          dot={false}
          autoScroll={false}
        >
          {status === "pending" && 
            Array(10)
              .fill({})
              .map((_, index) => (
                <div 
                  className="transform translate-x-0 translate-y-0 translate-z-0 flex-none basis-[75%] md:basis-[45%] lg:basis-[30%] min-w-0 pl-4" 
                  key={index}
                >
                  <LoadingCard />
                </div>
              ))
          }
          {data?.posts?.map((post) => (
            <div 
              className="transform translate-x-0 translate-y-0 translate-z-0 flex-none basis-[75%] sm:basis-auto min-w-0 pl-4 sm:pr-2 my-2" 
              key={post.id}
            >
              <PostCard post={post} />
            </div>
          ))}
        </EmblaCarousel>
      </div>

      <div className="space-y-10">
        <div>
          <div className="flex justify-between">
            <p className="text-2xl">محصولات</p>
            <div>
              <Link className="bg-black py-2 px-3 rounded-full dark:bg-white text-white dark:text-black text-center" href={'/products'}>
                تمام محصولات  
              </Link>
            </div>
          </div>
        </div>

        {status === "error" && 
          <p className="text-center text-lfont underline">
            مشکلی در دریافت اطلاعات پیش آمده لطفا صفحه را یکبار رفرش کنید
          </p>
        }

        {status === "success" && !data?.products?.length && 
          <p className="text-center text-lfont underline">
            هنوز محصولی در اینجا قرار داده نشده
          </p>
        }

        <EmblaCarousel 
          options={{ loop: false, dragFree: true, direction: 'rtl' }}                 
          dot={false}
          autoScroll={false}
        >
          {status === "pending" && 
            Array(10)
              .fill({})
              .map((_, index) => (
                <div 
                  className="transform translate-x-0 translate-y-0 translate-z-0 flex-none basis-[75%] md:basis-[45%] lg:basis-[30%] min-w-0 pl-4" 
                  key={index}
                >
                  <LoadingCard />
                </div>
              ))
          }
          {data?.products?.map((product) => (
            <div 
              className="transform translate-x-0 translate-y-0 translate-z-0 flex-none basis-[75%] sm:basis-auto min-w-0 pl-4 sm:pr-2 my-2" 
              key={product.id}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </EmblaCarousel>
      </div>
    </div>
  );
}

export default Home;
