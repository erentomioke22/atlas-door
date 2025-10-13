"use client";

import React,{useState} from "react";
import PostCard from "@components/posts/postCard";
import LoadingCard from "@components/ui/loading/loadingCard";
import Link from "next/link";
import EmblaCarousel from "@components/ui/carousel/carousel";
import { FaCaretRight } from "react-icons/fa6";
import AboutUs from "@components/aboutus";
import axios from "axios";
import { useQuery} from "@tanstack/react-query";
import { toast } from "sonner";
import ImageCom from "@components/ui/Image";
import ProductCard from "@components/products/productCard";
import { LuShieldCheck,LuHammer,LuTimer,LuBadgeDollarSign } from "react-icons/lu";



function Home() {
  const [item,setItem] = useState("new-post")

  const {
    data,
    status,
  } = useQuery({
    queryKey: ["home-data"],
    queryFn: async () => {const response = await axios.get(`/api/posts/home?category=${item}`);
      return response.data;
    },
  });




const projects=[
  {
    name:'درب اتوماتیک',
    url:'/posts/درب-های-اتوماتیک_lxi5fhspu7',
    image:'/images/automatic-door/slide/thumnail.jpg'
  },
  {
    name:'شیشه سکوریت',
    url:'/posts/شیشه-سکوریت-چیست؟-مزایا،-کاربردها-و-تفاوت-با-شیشه-معمولی_b2qh02hbuv',
    image:'/images/tempered-glass/1732009538381.jpg'
  },
  {
    name:'شیشه لمینت',
    url:'/posts/شیشه-لمینت:-انواع،-مزایا،-معایب-و-کاربردها-در-ساختمان-و-خودرو-|-راهنمای-جامع_jucfrkg1a7',
    image:'/images/laminet-glass/thumnail.jpg'
  },
  {
    name:'پارتیشن شیشه ای',
    url:'/posts/پارتیشن-شیشه‌ای:-راهنمای-کامل-نصب،-مزایا،-معایب-و-انواع-|-قیمت-و-طراحی_aqscgthk3m',
    image:'/images/partition/1732009538326.jpg'
  },
  {
    name:'جام بالکن',
    url:'/posts/شیشه-های-بالکنی-و-شیشه-های-ایمنی-برای-پرتگاه-ها:-راهنمای-جامع_4unfbbxaua',
    image:'/images/balcony/media_20241118_121418_6280590525011645464.jpg'
  },
  
  // {
  //   name:'کرکره برقی',
  //   url:'/roller-shutter',
  //   image:'/images/roller-shutter/blade/thumnail.jpg'
  // },
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
    <div className=" container  max-w-7xl px-5 py-20  mx-auto space-y-20">


      {/* <div className="mx-auto "> */}
        {/* <div className=" px-5 pt-16  sm:px-16 md:pt-24 lg:flex lg:gap-x-20 lg:px-24 lg:pt-0"> */}

          <div className=" text-center mx-auto  space-y-5">
            <h1 className="leading-normal text-balance text-4xl md:text-[60px] font-semibold tracking-tight ">
            تمرکز ما بر <span className="bg-gradient-to-tr text-clip from-blue to-darkgreen text-transparent bg-clip-text">کیفیت و عملکرد</span>   هربار تجربه ای زیبا را تضمین میکند
            </h1>
            <h1 className=" text-pretty text-lg  leading-loose">
            نمايندگی شيشه سكوريت و خام - فروش و ارائه خدمات كركره برقی - فروش و ارائه خدمات انواع درب اتوماتيک - نصب و تعميرانواع پارتيشن های اداری و حمامی و جام بالكن ها 
            </h1>
            <h3 className=" text-pretty text-md text-lfont">
             قدرت محصولات با کیفیت مارا که برای عملکرد زیبا در طول زمان طراحی شده اند ; تجربه کنید .
            </h3>

            <div className=" flex justify-center  gap-3">
              <a href="tel:09901196140" onClick={()=>{toast.success('شماره کپی شد');navigator.clipboard.writeText('09901196140')}} className="bg-black px-10 text-center py-2  text-white dark:bg-white dark:text-black rounded-full">
                تماس
              </a>
              <Link href="/posts" className="bg-lcard dark:bg-dcard rounded-lg py-2 px-5">
                مقاله ها
              </Link>
            </div>

          </div>
      {/* </div> */}


      <div className="space-y-10 ">
        <div className="text-center">
          <h1 className="leading-normal text-balance text-4xl md:text-[60px] font-semibold tracking-tight"><span className="bg-gradient-to-tr text-clip from-blue to-darkgreen text-transparent bg-clip-text">خدمات و محصولات</span> ما برای خدمت به شما مشتریان عزیز</h1>
          {/* <p className=" text-md text-lfont">تمامی خدمات توسط ما با بهترین قیمت  در کمترین زمان ارايه میشود</p> */}
        </div>

        <EmblaCarousel options={{loop:true,dragFree: true,direction:'rtl'}}                 
               dot={false}
               autoScroll={false}>
          {projects.map((project)=>(
        <div className="transform translate-x-0 translate-y-0 translate-z-0  flex-none basis-[75%] md:basis-[45%] lg:basis-[30%] min-w-0 pl-4" 
         key={project.url}>
          <Link href={project.url}>
          <div className="relative w-full h-[200px] md:h-[250px]  ">
            <ImageCom 
             className='object-cover  rounded-xl w-full '
             size={'h-[200px] md:h-[250px]'}
             alt={"thumnail Image"} 
             src={`${process.env.NEXT_PUBLIC_BASE_URL}${project.image}`} 
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

    {/* <div className="w-full  flex justify-center overflow-hidden">
        <div className="absolute w-full max-w-lg mt-24 ">
          <div className="absolute top-0 left-10 md:-left-4             w-28 h-32 md:w-72 md:h-72            bg-purple      rounded-full mix-blend-multiple dark:mix-blend-lighten-light dark:opacity-90 filter blur-2xl opacity-95 animate-blob "></div>
          <div className="absolute top-0 left-52 md:left-44             w-28 h-32 md:w-72 md:h-72            bg-yellow      rounded-full mix-blend-multiple dark:mix-blend-lighten-light dark:opacity-90 filter blur-2xl opacity-95 animate-blob animation-delay-4000"></div>
          <div className="absolute top-0 left-28 md:left-20  -bottom-20 w-28 h-32 md:w-72 md:h-72            bg-redorange   rounded-full mix-blend-multiple dark:mix-blend-lighten-light dark:opacity-90 filter blur-2xl opacity-95 animate-blob animation-delay-6000"></div>
        </div>
      </div> */}

    <div className=" space-y-10 relative px-5">
      <div className="text-center">
        <h1 className="text-4xl md:text-[60px]  leading-normal text-balance  font-semibold tracking-tight">هر چیزی که برای انجام <span className="bg-gradient-to-tr text-clip from-blue to-darkgreen text-transparent bg-clip-text">پروژه</span> هایتان نیاز دارید</h1>
      </div>


        <div className=" grid gap-4  lg:grid-cols-3 lg:grid-rows-2">
          

              <div className="px-8  py-5    lg:row-span-2 space-y-3 hover:bg-lcard dark:hover:bg-dcard duration-200 rounded-xl max-lg:text-center">
                <LuBadgeDollarSign className="text-4xl max-lg:mx-auto"/>
                <p className=" text-2xl  ">
                 قیمت              
                </p>
                <p className=" text-lfont">
                خريد محصولات و دريافت خدمات با رقابتي ترين قيمت بازار
                </p>
              </div>
              
              <div className="px-8  py-5    lg:row-span-2 space-y-3  hover:bg-lcard dark:hover:bg-dcard duration-200 rounded-xl  max-lg:text-center">
              <LuHammer className="text-4xl max-lg:mx-auto"/>
                <p className=" mt-2 text-2xl  ">
                عملکرد
                </p>
                <p className=" text-lfont">
                عملکرد بالا در مدت زمان طولاني را با محصولات ما تجربه کنید
                </p>
              </div>

              <div className="px-8  py-5    lg:row-span-2 space-y-3 hover:bg-lcard dark:hover:bg-dcard duration-200 rounded-xl  max-lg:text-center">
              <LuShieldCheck className="text-4xl max-lg:mx-auto"/>
                <p className=" mt-2 text-2xl  ">
                  امنیت            
                </p>
                <p className=" text-lfont">
                امنیت را در خرید محصولات و خدمات ما تجربه کنید
                </p>
              </div>

              <div className="px-8  py-5    lg:row-span-2 space-y-3 hover:bg-lcard dark:hover:bg-dcard duration-200 rounded-xl  max-lg:text-center">
              <LuTimer className="text-4xl max-lg:mx-auto"/>
                <p className=" mt-2 text-2xl  ">
                  زمان
                </p>
                <p className=" text-lfont">
                  تمامی خدمات ما در کمترین زمان ممکن به مشتری ارائه میشوند
                </p>
              </div>


        </div>
  


    </div>


    <AboutUs/>


   <div className="space-y-10  ">
     <div>
        <div className="flex justify-between">
          <p className="text-2xl  ">مقاله ها</p>
          {/* <p className=" text-md text-lfont">با دیدن مطالب ما میتوانید با خدمات و محصولات ما آشنا شوید و نحوه کارکرد و نوع استفاده از اونهارو یاد بگیرید</p> */}
            <div >
               <Link className=" bg-black py-2 px-3 rounded-full dark:bg-white text-white dark:text-black text-center" href={'/posts'}>
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

      {status === "success" && !data?.posts?.length  && 
        <p className="text-center text-lfont underline">
           هنوز پستی در اینجا قرار داده نشده
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
          {data?.posts?.map((post)=>(
        <div className="transform translate-x-0 translate-y-0 translate-z-0  flex-none basis-[75%] sm:basis-auto  min-w-0 pl-4 sm:pr-2 my-2" 
         key={post.id}>
               <PostCard post={post} />
         </div>
          ))}
          
         
     </EmblaCarousel>


     
   </div>
  
   <div className="space-y-10  ">
     <div>
        <div className="flex justify-between">
          <p className="text-2xl  ">محصولات</p>
          {/* <p className=" text-md text-lfont">با دیدن مطالب ما میتوانید با خدمات و محصولات ما آشنا شوید و نحوه کارکرد و نوع استفاده از اونهارو یاد بگیرید</p> */}
            <div >
               <Link className=" bg-black py-2 px-3 rounded-full dark:bg-white text-white dark:text-black text-center" href={'/products'}>
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

      {status === "success" && !data?.products?.length  && 
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
          {data?.products?.map((product)=>(
        <div className="transform translate-x-0 translate-y-0 translate-z-0  flex-none basis-[75%] sm:basis-auto  min-w-0 pl-4 sm:pr-2 my-2" 
         key={product.id}>
               <ProductCard product={product} />
         </div>
          ))}
          
         
        </EmblaCarousel>


     
   </div>
  

 



    </div>
  );
}

export default Home;
