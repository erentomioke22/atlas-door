"use client"

import React,{useState} from 'react'
import Link from 'next/link';
import { IoShareOutline } from "react-icons/io5";
import {toast } from 'sonner'
import { useSession } from 'next-auth/react';
// import moment from 'moment';
import { formatNumber, formatPrice } from '@lib/utils';
import { TbMessageCircleFilled } from "react-icons/tb";
import ImageCom from '@components/ui/Image';
import moment from 'moment-jalaali'
import AddToCartButton from './AddToCartButton';




moment.loadPersian({ usePersianDigits: true }) 



const ProductCard = ({product,draft}) => {
 
  const {data:session}=useSession();
  const [link,setLink]=useState(draft ? `/edit-product/${post.name}` :`/products/${product.name}`)



  const copyToClipboard = () => {
    navigator.clipboard.writeText(link);
    toast.success("لینک اشترک گذاری کپی شد")
  };


   const createdAt = moment(product.createdAt, 'YYYY-MM-DDTHH:mm:ss.SSSZ').locale('fa') 
const formattedDate = createdAt.isValid() ? createdAt.fromNow(): 'تاریخ نامعتبر'

  return (

    <div className="  bg-lcard dark:bg-dcard  dark:hover:ring-dbtn sm:w-64  hover:ring-2 hover:ring-lbtn   duration-500   max-sm:w-full  rounded-3xl py-2 space-y-1 px-3   select-none">
              <div className='flex justify-between'>

                  {/* <div className='my-auto'>
                    {session?.user.role === 'admin' ? 
                   <Link href={`/edit-product/${product.name}`}
                   className='text-[10px]  text-lfont' >
                       Edit product
                   </Link>
                     :
                     <button className='text-sm my-auto' onClick={copyToClipboard}>
                     <IoShareOutline className='text-[16px]'/> 
                    </button> 
                    }
                  </div> */}

              </div>
          <Link href={link}>
              {product?.images[0] && 
                <div className='relative w-full h-36 md:h-40  rounded-3xl '>
              <ImageCom 
               className={'object-cover  rounded-3xl w-full'}
               alt={product?.name} 
              //  src={product?.images[0].startsWith('https://') ?  `${product?.images[0]}` :`${process.env.NEXT_PUBLIC_BASE_URL}${product?.images[0]}`}
               src={product?.images[0]}
               size={'h-36 md:h-40'} />
               <div className='inset-0 absolute '>
                <div className='flex justify-between m-2'>
                  <div>
                    <div className='flex gap-2 backdrop-blur-sm p-2 rounded-lg  bg-white/20'>
                    {product?.colors.map((color)=>{
                       return(
                         <div style={{backgroundColor:color.hexCode}} key={color?.id} className=' rounded-full p-2'></div>
                       )
                    })}

                 </div>
                  </div>
                  {product?.colors[0].discount > 0 && 
                 <div>
                  <div className='text-white backdrop-blur-sm p-2 rounded-xl  bg-white/20 border border-dfont text-sm'>{product?.colors[0].discount}%</div>
                 </div>
                  }
                </div>
               </div>
              </div>
               }

                <h1 href={link} className='text-wrap line-clamp-3  hover:underline duration-150 decoration-2'>{product?.name}</h1>
         </Link>

         <div className='flex justify-between'>
         {/* <AddToCartButton
                       className={"text-sm w-full flex justify-between  hover:bg-lcard rounded-lg p-2 dark:hover:bg-dcard duration-300"}
                       name={"AddToCartButton"}
                       productId={product?.id}
                       initialState={{
                        // quantity:product?.quantity,
                        quantity: product?.cartItems?.find(
                          (cartItem) => cartItem.userId === session?.user?.id,
                        )?.quantity || 1,
                         isCarted: product?.cartItems?.some(
                           (cartItem) => cartItem.userId === session?.user?.id,
                        ),
                     }}
                     stocks={product?.stocks}
                     card={true}
                   />  */}
                   {/* <div className='my-auto'>
                     <button className='text-sm bg-black text-white dark:bg-white dark:text-black rounded-full px-3 py-2'>ADD TO CART</button>
                   </div> */}
                   <div>
                      <h2>{formatPrice(product?.colors[0].price - (product?.colors[0].price * product?.colors[0].discount)/100)}ت</h2>
                      {product?.colors[0].discount > 0 &&
                      <h4 className='line-through text-[10px] decoration-red  text-red/70'>{formatPrice(product?.colors[0].price)}ت</h4>
                      }
                   </div>
         </div>
         <button className="bg-lbtn dark:bg-dbtn rounded-lg text-sm w-full py-2 ">
              <a href="tel:02155589837" onClick={()=>{toast.success('شماره کپی شد');navigator.clipboard.writeText('02155589837')}} >
                تماس
              </a>
                </button>
          </div>
  )
}

export default ProductCard;

// components/ImageWithLoading.js

