"use client"

import React,{useState} from 'react'
import Link from 'next/link';
import { IoShareOutline } from "react-icons/io5";
import {toast } from 'sonner'
import { useSession } from 'next-auth/react';
// import moment from 'moment';
import { formatNumber } from '@lib/utils';
import { TbMessageCircleFilled } from "react-icons/tb";
import ImageCom from '@components/ui/Image';
import moment from 'moment-jalaali'




moment.loadPersian({ usePersianDigits: true }) 



const PostCard = ({post,draft}) => {
 
  const {data:session}=useSession();
  const [link,setLink]=useState(draft ? `/edit-post/${post.link}` :`/posts/${post.link}`)



  const copyToClipboard = () => {
    navigator.clipboard.writeText(link);
    toast.success("لینک اشترک گذاری کپی شد")
  };


   const createdAt = moment(post.createdAt, 'YYYY-MM-DDTHH:mm:ss.SSSZ').locale('fa') 
const formattedDate = createdAt.isValid() ? createdAt.fromNow(): 'تاریخ نامعتبر'

  return (

    <div className="  bg-lcard dark:bg-dcard  dark:hover:ring-dbtn sm:w-64  hover:ring-2 hover:ring-lbtn  duration-500   max-sm:w-full  rounded-3xl py-2 space-y-1 px-3  ">
              <div className='flex justify-between'>
                  <div
                   className='flex gap-1 sm:gap-2   p-1 text-[10px]   '>
                    <div className='relative w-[32px] h-[32px]'>
                    {post.user.image === null ?
                  <div className="h-9 w-9 rounded-lg bg-gradient-to-tr from-redorange to-yellow"></div>
                  :
                      <ImageCom src={post.user.image} className='  rounded-lg' alt={`${post?.user?.name} avatar`}/>
                  }
                    </div>
                   <div className='flex flex-col truncate'>
                     <p className='truncate'>{post.user.displayName}</p>
                     <p className='text-lfont truncate' >{formattedDate}</p>
                   </div>
                  </div>
                  <div className='my-auto'>
                    {session?.user.role === 'admin' ? 
                   <Link href={`/admin/edit-post/${post.link}`}
                   className='text-[10px]  text-lfont' >
                       Edit Post
                   </Link>
                     :
                     <button className='text-sm my-auto' onClick={copyToClipboard}>
                     <IoShareOutline className='text-[16px]'/> 
                    </button> 
                    }
                  </div>

              </div>
          <Link href={link} className='flex flex-col justify-between h-full'>
                <div>
              {post?.images[0] && 
                <div className='relative w-full h-36 md:h-40  rounded-3xl '>
              <ImageCom 
               className={'object-cover  rounded-3xl w-full'}
               alt={post?.title} 
               src={post?.images[0]}
              //  src={post?.images[0].startsWith('https://') ?  `${post?.images[0]}` :`${process.env.NEXT_PUBLIC_BASE_URL}${post.images[0]}`}
               size={'h-36 md:h-40'} />
              </div>
               }
              <div className="space-y-1 text-wrap">
                <h1 className='text-wrap line-clamp-3  hover:underline duration-150 decoration-2'>{post.title}</h1>
                <h3 className="text-lfont text-[10px] line-clamp-2 ">{post?.desc}</h3>
              </div>
              </div>
              <div className='flex justify-between mt-2' >
               <div>
                <p className="text-sm text-lfont flex">  {formatNumber(post._count.comments)} <TbMessageCircleFilled className="my-auto mr-1"/></p>
              </div>
               <div className='flex  flex-wrap gap-1 justify-end text-[12px]'>
                 {post.tags.slice(0,post.tags.length >= 3 ? 3 : post.tags.length).map((tag,index)=>{return <p className='text-lfont' key={index}><span className='text-black dark:text-white'>#</span>{tag?.name}</p>  })}
                 <span className='text-lfont'>{post.tags.length >= 3 && ". . ."}</span>
               </div>


              </div> 


         </Link>
          </div>
  )
}

export default PostCard;

// components/ImageWithLoading.js

