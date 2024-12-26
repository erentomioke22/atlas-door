"use client";

import React, { useState, useEffect } from "react";
import PostCard from "@components/posts/postCard";
import LoadingPage from "@components/ui/loading/loadingPage";
import Link from "next/link";
import EmblaCarousel from "@components/ui/carousel/carousel";
import { FaCaretRight } from "react-icons/fa6";
import  Image  from "next/image";
import { FaDollarSign } from "react-icons/fa6";
import { IoTimerOutline } from "react-icons/io5";
import { IoSpeedometerOutline } from "react-icons/io5";
import AboutUs from "@components/aboutus";
import axios from "axios";
import { useQuery} from "@tanstack/react-query";
import { toast } from "sonner";
import ImageCom from "@components/ui/Image";


function Home() {

  const {
    data:posts,
    status,
  } = useQuery({
    queryKey: ["new-post"],
    queryFn: async () => {const response = await axios.get('/api/posts/new-post');
      return response.data;
    },
  });


  // console.log(posts)


const projects=[
  {
    name:'درب اتوماتیک',
    url:'/automatic-door',
    image:'/images/automatic-door/slide/thumnail.jpg'
  },
  {
    name:'کرکره برقی',
    url:'/roller-shutter',
    image:'/images/roller-shutter/blade/thumnail.jpg'
  },
  {
    name:'شیشه سکوریت',
    url:'/tempered-glass',
    image:'/images/tempered-glass/1732009538394.jpg'
  },
  {
    name:'پارتیشن شیشه ای',
    url:'/partition-glass',
    image:'/images/partition/media_20241118_121418_2590378291697560303.jpg'
  },
  {
    name:'شیشه بالکنی',
    url:'/balcony-glass',
    image:'/images/balcony/media_20241118_121418_6280590525011645464.jpg'
  },

  // {
  //   name:'انواع آیینه',
  //   url:'/mirror',
  //   image:'/images/mirror/1732009538001.jpg'
  // },
  // {
  //   name:'UPVC پنجره ی',
  //   url:'/upvc-window',
  //   image:'/images/balcony/media_20241118_121418_8417747443732456636.jpg'
  // },
  // {
  //   name:'شیشه دورریز',
  //   url:'/trash-glass',
  //   image:'/images/balcony/media_20241118_121418_8417747443732456636.jpg'
  // },
  // {
  //   name:'سایبان برقی',
  //   url:'/electric-canopies',
  //   image:'/images/balcony/media_20241118_121418_8417747443732456636.jpg'
  // },
]

  return (
    <>


      <div className="mx-auto ">
        <div className=" px-5 pt-16  sm:px-16 md:pt-24 lg:flex lg:gap-x-20 lg:px-24 lg:pt-0">
        {/* <div className=" mt-16 h-60 lg:mt-8">
            <img
              alt="App screenshot"
              src="https://www.embla-carousel.com/static/embla-logo-light-theme-blur-db7093b8d7d20cb8c2429e3f6e05156a.svg"
              width={1240}
              height={600}
              className="absolute left-0 top-0 w-[30rem] max-w-none rounded-md bg-white/5 ring-1 ring-white/10"
            />
         </div> */}

          <div className="mt-10 text-center  space-y-5">
            <h1 className="leading-normal text-balance text-4xl md:text-[60px] font-semibold tracking-tight ">
            تمرکز ما بر <span className="bg-gradient-to-tr text-clip from-blue to-darkgreen text-transparent bg-clip-text">کیفیت و عملکرد</span>   هربار تجربه ای زیبا را تضمین میکند
            </h1>
            <h2 className=" text-pretty text-md text-lfont">
             قدرت محصولات با کیفیت مارا که برای عملکرد زیبا در طول زمان طراحی شده اند ; تجربه کنید
            </h2>
            <div className=" flex justify-center  gap-3">
              <a href="tel:02155589837" onClick={()=>{toast.success('شماره کپی شد');navigator.clipboard.writeText('02155589837')}} className="bg-black w-20 md:w-28 text-center py-2 text-sm text-white dark:bg-white dark:text-black rounded-full">
                تماس
              </a>
              <Link href="/posts" className="bg-transparent w-20 md:w-28 text-center py-2 text-sm text-black  dark:text-white border-2 border-black dark:border-white rounded-full">
                مقاله ها
              </Link>
            </div>
          </div>
        </div>
      </div>


    <div className="bg-lcard my-16 py-16 dark:bg-dcard">
      <div className="space-y-10 ">
        <div className=" w-full md:w-1/2  px-5">
          <h1 className="text-4xl md:text-[60px] leading-normal"><span className="bg-gradient-to-tr text-clip from-blue to-darkgreen text-transparent bg-clip-text">خدمات و محصولات</span> ما برای خدمت به شما مشتریان عزیز</h1>
          <p className=" text-md text-lfont">تمامی خدمات توسط ما با بهترین قیمت  در کمترین زمان ارايه میشود</p>
        </div>
        <EmblaCarousel options={{loop:true,dragFree: true,direction:'rtl'}}  >
          {projects.map((project)=>(
        <div className="transform translate-x-0 translate-y-0 translate-z-0  flex-none basis-[75%] md:basis-[45%] lg:basis-[30%] min-w-0 pl-4" 
         key={project.url}>
          <Link href={project.url}>
          <div className="relative w-full h-[200px] md:h-[250px]  ">
            <ImageCom 
             className='object-cover  rounded-xl w-full '
             size={'h-[200px] md:h-[250px]'}
             alt={"thumnail Image"} 
             src={project.image} 
             />
            <div className="absolute  inset-x-0 bottom-0 rounded-b-xl mx-auto py-3 w-full bg-gradient-to-t from-black/75 from-50% to-transparent  flex  justify-between px-3 items-center">
            <h1 className="text-2xl text-white">{project.name}</h1>
            <button className="bg-white p-1 text-sm rounded-full text-black my-auto"><FaCaretRight/></button>
            </div>
            </div>
            </Link>
         </div>
          ))}
         
        </EmblaCarousel>

      </div>
    </div>

    {/* <div className="w-full  flex justify-center overflow-hidden">
        <div className="absolute w-full max-w-lg mt-24 ">
          <div className="absolute top-0 left-10 md:-left-4             w-28 h-32 md:w-72 md:h-72            bg-purple      rounded-full mix-blend-multiple dark:mix-blend-lighten-light dark:opacity-90 filter blur-2xl opacity-95 animate-blob "></div>
          <div className="absolute top-0 left-52 md:left-44             w-28 h-32 md:w-72 md:h-72            bg-yellow      rounded-full mix-blend-multiple dark:mix-blend-lighten-light dark:opacity-90 filter blur-2xl opacity-95 animate-blob animation-delay-4000"></div>
          <div className="absolute top-0 left-28 md:left-20  -bottom-20 w-28 h-32 md:w-72 md:h-72            bg-redorange   rounded-full mix-blend-multiple dark:mix-blend-lighten-light dark:opacity-90 filter blur-2xl opacity-95 animate-blob animation-delay-6000"></div>
        </div>
      </div> */}

    <div className="my-20 space-y-10 relative px-5">
      <div className="w-full md:w-1/2 mx-auto">
        <p className="text-4xl md:text-[60px] text-center leading-normal  underline">هر چیزی که برای انجام پروژه هایتان نیاز دارید</p>
      </div>


    <div >
      <div className="mx-auto max-w-2xl px-6 lg:max-w-7xl lg:px-8">
        <div className="mt-10 grid gap-4 sm:mt-16 lg:grid-cols-3 lg:grid-rows-2">
          

            <div className="relative lg:row-span-2 flex h-full flex-col ">
              <div className="px-8 py-5 text-white flex flex-col h-60 justify-between bg-redorange rounded-xl">
                <p className=" mt-2 text-lg font-medium tracking-tight text-gray-950 ">
                  قیمت 
                </p>
                <p className="text-2xl">
                  سعی ما بر مشتری مداری باعث میشود قیمت های ما بسیار رقابتی و پایین باشند
                </p>
              </div>

            </div>


          <div className="relative max-lg:row-start-1">
            <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] max-lg:rounded-t-[calc(2rem+1px)]">
              <div className="px-8  pt-8 sm:px-10 sm:pt-10">
                <p className="bg-gradient-to-tr text-clip from-blue to-darkgreen text-transparent bg-clip-text mt-2 text-lg font-medium tracking-tight text-gray-950 ">
                   عملکرد
                </p>
                <p className="text-2xl">
                  عملکرد بالا در طول مدت زمان بلند را با محصولات ما تجربه کنید
                </p>
              </div>
              <div className="flex flex-1 items-center justify-center px-8 max-lg:pb-12 max-lg:pt-10 sm:px-10 lg:pb-2">
                <img
                  className="w-full max-lg:max-w-xs"
                  src="https://tailwindui.com/plus/img/component-images/bento-03-performance.png"
                  alt=""
                />
              </div>
            </div>
          </div>



          <div className="relative ">
            <div className="max-lg:row-start-3 bg-purple text-white lg:col-start-2 lg:row-start-2 relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)]">
              <div className="px-8 pt-8 sm:px-10 sm:pt-10 ">
                <p className=" mt-2 text-lg font-medium tracking-tight text-gray-950 ">
                  امنیت 
                </p>
                <p className="text-2xl">
                  امنیت را در خرید محصولات و خدمات ما تجربه کنید
                </p>
              </div>
              <div className="flex flex-1 items-center [container-type:inline-size] max-lg:py-6 lg:pb-2">
                <img
                  className="h-[min(152px,40cqw)] object-cover"
                  src="https://tailwindui.com/plus/img/component-images/bento-03-security.png"
                  alt=""
                />
              </div>
            </div>
          </div>

            <div className="relative flex h-full flex-col  lg:row-span-2">
              <div className="px-8  py-5  rounded-2xl text-white bg-black dark:bg-white dark:text-black h-60 flex flex-col justify-between">
                <p className=" mt-2 text-lg font-medium tracking-tight text-gray-950 ">
                  زمان
                </p>
                <p className="text-2xl">
                  تمامی خدمات ما در کمترین زمان ممکن به مشتری ارائه میشوند
                </p>
              </div>

            </div>

        </div>
      </div>
    </div>
  


    </div>


    <AboutUs/>


   <div className="space-y-10 my-20 px-5 md:px-20 ">
     <div>
        <div className="text-center space-y-3">
          <p className="text-4xl md:text-[60px] leading-normal ">پست های آموزشی ما</p>
          <p className=" text-md text-lfont">با دیدن مطالب ما میتوانید با خدمات و محصولات ما آشنا شوید و نحوه کارکرد و نوع استفاده از اونهارو یاد بگیرید</p>
        </div>
     </div>


     {status === "error" && 
          <p className="text-center text-lfont underline">
            مشکلی در دریافت اطلاعات پیش آمده لطفا صفحه را یکبار رفرش کنید
          </p>
      }

      {status === "success" && !posts?.length  && 
        <p className="text-center text-lfont underline">
           هنوز پستی در اینجا قرار داده نشده
       </p>
      }
        <div className="max-sm:space-y-5 sm:flex sm:flex-wrap justify-center gap-3 max-sm:px-3  ">
          {status === "pending" && 
                  Array(3)
                    .fill({})
                    .map((_,index) => {
                      return <LoadingPage key={index}/>;
                })
          }


          {posts?.map((post) => (
            <div key={post?.id}>
              <PostCard post={post} />
            </div>
          ))}
         </div>
            <div className="flex justify-center">
               <Link className="w-60 bg-black py-2 rounded-full dark:bg-white text-white dark:text-black text-center" href={'/posts'}>
               مشاهده تمام مقاله ها 
               </Link>
            </div>

     
   </div>
  

 



    </>
  );
}

export default Home;
