"use client";

import axios from "axios";
import Comment from "@components/posts/comments/comment";
import PageLoading from "@components/ui/loading/pageLoading";
import { toast } from 'sonner'
import { useQuery } from "@tanstack/react-query";
import Conneccted from "./Connected";
import Accordion from "@components/ui/Accordion";
import AboutUs from "@components/aboutus";
import  TOC  from "./TocPost";
import {usePathname } from 'next/navigation';
// import moment from 'moment';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import ImageCom from "@components/ui/Image";
import moment from 'moment-jalaali'





const PostPage = ({params}) => {
  const {data:session}=useSession();


// console.log(params)
const {data: post,status,}=useQuery({
    queryKey: ["post", params.title],
    queryFn: async()=>{const response = await axios.get(`/api/posts?postTitle=${params.title}`);
     return response.data
    }
  });



  const pathName = usePathname();
  const currentUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/${pathName}`;
  const copyToClipboard = () => {
    navigator.clipboard.writeText(currentUrl);
    toast.success("لینک اشتراک گذاری کپی شد")
  };


// console.log(post)

  if (status === "success" && post?.error) {
    return (
      <p className="text-center text-lfont">
        هیچ مطلبی در اینجا قرار داده نشده است
      </p>
    );
  }

  if (status === "error") {
    return (
      <p className="text-center text-lfont">
        مشکلی در برقراری ارتباط بوجود امده
      </p>
    );
  }

  const scrollToComment = () => { 
    const commentElement = document.querySelector('.comment'); 
    if (commentElement) { 
       const topPos = commentElement.getBoundingClientRect().top + window.scrollY - 120; 
       window.scrollTo({ top: topPos, behavior: 'smooth' }); 
      } };
// console.log(post?.content)
// console.log(post)
// console.log(status)
   const createdAt = moment(post?.createdAt, 'YYYY-MM-DDTHH:mm:ss.SSSZ').locale('fa') 
const formattedDate = createdAt.isValid() ? createdAt.fromNow(): 'تاریخ نامعتبر'
  return (
    <>
      {
      status === "pending" 
      // !post
      ?
       (
        <PageLoading />
      ) : (
        <>

          {/* <div className="w-full flex justify-center overflow-hidden">
            <div className="absolute w-full max-w-lg mt-52 md:mt-36">
              <div className="absolute md:-left-72 w-60 h-60 md:w-[450px]  md:h-[450px]   bg-purple  rounded-full mix-blend-multiple dark:mix-blend-lighten-light dark:opacity-95 filter blur-2xl opacity-95 animate-blob "></div>
            </div>
          </div> */}

          
          <div className="w-full space-y-5 md:space-y-16 overflow-hidden mt-20">

          <div className="px-7 lg:px-32 xl:px-44 space-y-10 md:space-y-20">
     
     
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
               <div className="space-y-5 md:space-y-10 md:mt-7 text-right text-black dark:text-white order-2 lg:order-1">
                <div className="space-y-4 ">
                   <h1 className="text-xl md:text-5xl w-full break-words ">{post?.title}</h1>   
                           <h3 className="flex gap-2 flex-wrap">
                              {post?.tags.slice(0,post?.tags.length >= 5 ? 5 : post?.tags.length).map((tag,index)=>{return <p className='text-black dark:text-white text-[10px] md:text-[13px]' key={index}><span className='text-lfont '>#</span>{tag?.name}</p>  })}
                              <span className='text-lfont text-[10px] md:text-[13px]'>{post?.tags.length >= 5 && ". . ."}</span>
                           </h3>
                </div> 
                <div className="space-y-3">
          <div className='flex gap-2 text-ellipsis  md:gap-3  text-[12px]  md:text-md '>
                    <div className="relative h-[40px] w-[40px]">
                      <ImageCom
                        src={
                          post?.user?.image === null
                            ? 
                            `${process.env.NEXT_PUBLIC_BASE_URL}/images/logo/user-avatar-people-icon-solid-style-icon-design-element-icon-template-background-free-vector.jpg`
                            : `${process.env.NEXT_PUBLIC_BASE_URL}${post?.user?.image}`
                        }
                        className="rounded-xl"
                        alt={'avatar'}
                      />
                    </div>
                    <div className="flex flex-col">
                        <p className="text-[10px] md:text-sm " >نوشته شده توسط تیم اطلس در</p>
                        <p className="text-lfont text-[10px] md:text-[13px]">
                        {formattedDate}
                        </p>
                    </div>
                    
      
          </div>

          <div className='flex text-md  md:text-xl gap-2 my-auto  flex-wrap'>


          <div>
            <button 
             onClick={copyToClipboard} 
             type='button'
             className="text-sm border-2  bg-transparent text-black rounded-full dark:text-white py-1 px-2 text-nowrap ">
              اشتراک گذاری
            </button>
          </div>
          <div>
            <button 
             onClick={scrollToComment} 
             type='button'
             className="text-sm border-2  bg-transparent text-black rounded-full dark:text-white py-1 px-2 text-nowrap ">
               ارسال بازخورد
            </button>
          </div>
          {session && session?.user.role === 'admin' && 
              <Link href={`/edit-post/${post?.link}`} className="text-sm border-2  bg-transparent text-black rounded-full dark:text-white py-1 px-2 text-nowrap " >
                  Edit Post
              </Link>
            }

          </div>
                  </div> 


               </div>
              <div className="h-[200px]  sm:h-[300px] md:h-[400px] w-full relative order-1 lg:order-2">
               <ImageCom 
                 className=" rounded-xl md:rounded-2xl absolute  mx-auto max-md:order-last"
                 alt={post?.title} 
                 src={`${process.env.NEXT_PUBLIC_BASE_URL}${post?.images[0]}`} 
                 size={'h-[200px]  sm:h-[300px] md:h-[400px]'}
               />
              </div>



   
            </div>
          
           <div className='grid grid-cols-1  lg:gap-5 lg:grid-cols-4'>
              <div className="sticky top-10 col-span-1  my-10">
                  {post?.tocs.length >= 2 && 
                     <TOC selector='.content' items={post?.tocs}/>
                  } 
             </div>
           
            <div className="col-span-3 ">
              <div
                id="post-content"
                className="content break-words w-full  normal-case leading-relaxed md:text-lg max-md:text-sm  decoration-purple decoration-2 underline-offset-4"
                dangerouslySetInnerHTML={{ __html: post?.content }}
              />
            </div>
          </div>
        

          </div>

          
          {post?.faqs?.length >= 1 && 
          <div className="w-full px-5 md:px-0 md:w-5/6 grid grid-cols-1 md:grid-cols-2 gap-5 mx-auto mt-10 my-20"> 
                          <div className="space-y-5"> 
                {post?.faqs?.map((faq,index)=>(
                        <Accordion title={faq.question} key={index}> <p>{faq.answer}</p> </Accordion>
                    ))}
                </div>  
          
            <div className="flex flex-col justify-center items-center space-y-5">
                    <div className="text-center">
                      <p className="text-4xl md:text-[60px] leading-normal">سوالات متداول</p>
                      <p className="text-sm md:text-md  text-lfont">از سوالات شما همیشه استقبال میشود;سوالات شما جرقه گفتگوهایی را میدهند که منجر به نوآوری میشود</p>
                    </div>
                  {/* <div className="flex justify-center mx-auto my-5">
                      <Comment post={post} />
                    </div> */}
                  </div>

          </div>
          }
          
          <div className="comment w-full sm:w-4/5 lg:w-1/2 mx-auto px-3 sm:px-5 my-20 ">
          <h1 className="text-4xl md:text-[60px] text-center leading-normal my-5">ارسال بازخورد</h1>
          <Comment post={post}  />
          </div>

          <Conneccted postTitle={post?.title} postId={post?.id}/>

           <AboutUs/>
          </div>



        </>
      )}
    </>
  );
};

export default PostPage;

