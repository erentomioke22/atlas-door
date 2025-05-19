"use client"

import React,{useState} from 'react'
import Link from 'next/link';
import { IoShareOutline } from "react-icons/io5";
import {toast } from 'sonner'
import { useSession } from 'next-auth/react';
// import moment from 'moment';
import { formatNumber,formatPrice} from '@lib/utils';
import { TbMessageCircleFilled } from "react-icons/tb";
import ImageCom from '@components/ui/Image';
import moment from 'moment-jalaali'
import AddToCartButton from './AddToCartButton';



moment.loadPersian({ usePersianDigits: true }) 



const OrderCard = ({order}) => {
//  console.log(post)
 
  const {data:session}=useSession();
  const [link,setLink]=useState(`/products/${order?.name}`)
console.log(order,order?.cartItems.userId)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(link);
    toast.success("لینک اشترک گذاری کپی شد")
  };
  const price = order?.price * order?.cartItems?.find(
    (cartItem) => cartItem.userId === session?.user?.id,
  )?.quantity || 1;

  // const createdAt = moment(order.createdAt, 'YYYY-MM-DDTHH:mm:ss.SSSZ').locale('fa') 
  // const formattedDate = createdAt.isValid() ? createdAt.fromNow(): 'تاریخ نامعتبر'

  return (

    <div className="  w-full  rounded-3xl py-2 space-y-1 px-3  mx-auto">

           
             <div className='flex gap-2'>
              {order?.images[0] && 
                <div className='relative  w-20 h-20  rounded-2xl '>
              <ImageCom 
               className={'object-cover  rounded-xl w-full'}
               alt={order?.name} 
              //  src={product?.images[0].startsWith('https://') ?  `${product?.images[0]}` :`${process.env.NEXT_PUBLIC_BASE_URL}${product?.images[0]}`}
               src={order?.images[0]}
               size={'h-36 md:h-40'} />
              </div>
               }

           <Link href={link} className='flex flex-col justify-between h-full'>
              <div className="space-y-1 text-wrap">
                <h1 className='text-wrap line-clamp-3  hover:underline duration-150 decoration-2'>{order?.name}</h1>
              </div>
           </Link>


         <AddToCartButton
                       className={"text-sm w-full flex justify-between  hover:bg-lcard rounded-lg p-2 dark:hover:bg-dcard duration-300"}
                       productId={order?.id}
                       price={order?.price}
                       initialState={{
                         quantity: order?.cartItems?.find(
                            (cartItem) => cartItem.userId === session?.user?.id,
                         )?.quantity || 1,
                         isCarted: order?.cartItems?.some(
                           (cartItem) => cartItem.userId === session?.user?.id,
                        ),
                        userId:session?.user.id
                     }}
                       stocks={order?.stocks}
                   /> 

             <h1>

                        {formatPrice(price)} تومان
             </h1>

              </div>





          </div>
  )
}

export default OrderCard;

// components/ImageWithLoading.js

