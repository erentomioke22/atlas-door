// "use client"

// import React from 'react'
// import Link from 'next/link';
// import { IoShareOutline } from "react-icons/io5";
// import {toast } from 'sonner'
// import ImageCom from '@/components/ui/Image';
// import moment from 'moment-jalaali'
// import { PostLite } from '@/lib/types';


// moment.loadPersian({ usePersianDigits: true }) 


// interface PostCardProps {
//   post: PostLite;
// }

// const PostCard: React.FC<PostCardProps> = ({post}) => {

//   const handleShare = async () => {
//     const link = `/posts/${post.slug}`;
//     try {
//       await navigator.share({
//         title: post.title,
//         text: post.desc || '',
//         url: link,
//       });
//     } catch {
//       await navigator.clipboard.writeText(link);
//       toast.success('لینک کپی شد');
//     }
//   };

//   const formattedDate = post.publishedAt
//   ? moment(post.publishedAt).locale('fa').fromNow()
//   : 'تاریخ نامعتبر';

//   return (
//     <div className="  bg-lcard dark:bg-dcard  dark:hover:ring-dbtn sm:w-64  hover:ring-2 hover:ring-lbtn  duration-500   max-sm:w-full  rounded-3xl py-2 space-y-1 px-3  select-none">
//       <div className='flex justify-between'>
//         <div
//           className='flex gap-1 sm:gap-2   p-1 text-[10px]   '>
//             {post.author?.image === null ?
//               <div className="h-9 w-9 rounded-lg bg-linear-to-tr from-redorange to-yellow"></div>
//               :
//               <ImageCom src={post.author?.image ?? ""} className='w-8 h-8 rounded-lg' alt={`${post?.author?.name} avatar`}/>
//             }
//           <div className='flex flex-col truncate'>
//             <p className='truncate capitalize'>{post.author?.name}</p>
//             <p className='text-neutral-500 dark:text-neutral-400 truncate' >{formattedDate}</p>
//           </div>
//         </div>
//         <div className='my-auto'>   
//             <button
//               aria-label="share post"
//               title="share post"
//             className='text-sm my-auto' onClick={handleShare}>
//               <IoShareOutline className='text-[16px]'/> 
//             </button> 
//           {/* </div> */}
//         </div>
//       </div>
//       <Link href={`/posts/${post.slug}`} className='flex flex-col justify-between h-full'>
//         <div>
//         {post.mainImage && (
//             <ImageCom
//               className="w-full h-36 md:h-40 rounded-3xl"
//               alt={post.imageAlt || post.title}
//               src={post.mainImage}
//             />
//           )}
//           <div className="space-y-1 text-wrap">
//             <h1 className='text-wrap line-clamp-3  hover:underline duration-150 decoration-2'>{post.title}</h1>
//             <h3 className="text-neutral-500 dark:text-neutral-400 text-[10px] line-clamp-2 ">{post?.desc ?? ""}</h3>
//           </div>
//         </div>
//         <div className="flex flex-wrap gap-1 justify-end text-[12px] mt-2">
//           {post.tags?.slice(0, 3).map((tag) => (
//             <span key={tag._id} className="text-neutral-500 dark:text-neutral-400">
//               <span className="text-black dark:text-white">#</span>{tag.name}
//             </span>
//           ))}
//           {post.tags && post.tags.length > 3 && (
//             <span className="text-neutral-500 dark:text-neutral-400">...</span>
//           )}
//         </div>
//       </Link>
//     </div>
//   )
// }

// export default PostCard;
// components/posts/postCard.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { IoShareOutline } from 'react-icons/io5';
import { toast } from 'sonner';
import moment from 'moment-jalaali';
import { PostLite } from '@/lib/types';

moment.loadPersian({ usePersianDigits: true });

interface PostCardProps {
  post: PostLite;
}

export default function PostCard({ post }: PostCardProps) {
  const handleShare = async () => {
    const link = `/posts/${post.slug}`;
    try {
      if (navigator.share) {
        await navigator.share({
          title: post.title,
          text: post.desc || '',
          url: link,
        });
      } else {
        await navigator.clipboard.writeText(link);
        toast.success('لینک کپی شد');
      }
    } catch {
      // کاربر لغو کرد
    }
  };

  const formattedDate = post.publishedAt
    ? moment(post.publishedAt).locale('fa').fromNow()
    : 'تاریخ نامعتبر';

  return (
    <article className="bg-lcard dark:bg-dcard dark:hover:ring-dbtn sm:w-64 hover:ring-2 hover:ring-lbtn duration-500 max-sm:w-full rounded-3xl py-2 space-y-1 px-3 select-none">
      <div className="flex justify-between">
        <div className="flex gap-1 sm:gap-2 p-1 text-[10px]">
          {post.author?.image ? (
            <Image
              src={post.author.image}
              alt={post.author.name}
              width={32}
              height={32}
              className="w-8 h-8 rounded-lg"
            />
          ) : (
            <div className="h-9 w-9 rounded-lg bg-linear-to-tr from-redorange to-yellow" />
          )}
          <div className="flex flex-col truncate">
            <p className="truncate capitalize">{post.author?.name || 'ناشناس'}</p>
            <p className="text-neutral-500 dark:text-neutral-400 truncate">
              {formattedDate}
            </p>
          </div>
        </div>
        <button
          aria-label="اشتراک‌گذاری"
          className="text-sm my-auto"
          onClick={handleShare}
        >
          <IoShareOutline className="text-[16px]" />
        </button>
      </div>

      <Link href={`/posts/${post.slug}`} className="flex flex-col justify-between h-full">
        <div>
          {post.mainImage && (
            <div className="relative w-full h-36 md:h-40 rounded-3xl overflow-hidden">
              <Image
                src={post.mainImage}
                alt={post.imageAlt || post.title}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 256px"
              />
            </div>
          )}
          <div className="space-y-1 text-wrap">
            <h2 className="text-wrap line-clamp-3 hover:underline duration-150 decoration-2">
              {post.title}
            </h2>
            <p className="text-neutral-500 dark:text-neutral-400 text-[10px] line-clamp-2">
              {post.desc || ''}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-1 justify-end text-[12px] mt-2">
          {post.tags?.slice(0, 3).map((tag) => (
            <span key={tag._id} className="text-neutral-500 dark:text-neutral-400">
              <span className="text-black dark:text-white">#</span>
              {tag.name}
            </span>
          ))}
          {post.tags && post.tags.length > 3 && (
            <span className="text-neutral-500 dark:text-neutral-400">...</span>
          )}
        </div>
      </Link>
    </article>
  );
}