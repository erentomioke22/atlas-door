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
 
  const {data:session}=useSession();
  const [link,setLink]=useState(`/products/${order?.product.name}`)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(link);
    toast.success("لینک اشترک گذاری کپی شد")
  };
  const price = order?.color.price * order?.quantity || 1;
  // const createdAt = moment(order.createdAt, 'YYYY-MM-DDTHH:mm:ss.SSSZ').locale('fa') 
  // const formattedDate = createdAt.isValid() ? createdAt.fromNow(): 'تاریخ نامعتبر'

  return (

    <div className="  w-full   p-3 space-y-1   mx-auto flex flex-wrap justify-between gap-2">

           
             <div className='flex gap-2'>
              {order?.product.images[0] && 
                <div className='relative  w-20 h-20  rounded-2xl '>
              <ImageCom 
               className={'object-cover  rounded-xl w-full'}
               alt={order?.product.name} 
              //  src={product?.images[0].startsWith('https://') ?  `${product?.images[0]}` :`${process.env.NEXT_PUBLIC_BASE_URL}${product?.images[0]}`}
               src={order?.product.images[0]}
               size={'h-36 md:h-40'} />
              </div>
               }

           <Link href={link} className='flex flex-col justify-between h-full space-y-1'>
              
              <div className="space-y-1 text-wrap">
                <h1 className='text-wrap line-clamp-3  hover:underline duration-150 decoration-2'>{order?.product.name}</h1>
              </div>

              <div className='flex gap-2'>
                <div className='h-5 w-5 rounded-md border border-lcard dark:border-dcard' style={{backgroundColor:order?.color?.hexCode}}></div>
                <p className='text-sm'>{order?.color?.name}</p>
              </div>

              <div>
                <p className='text-sm'>  قیمت هر واحد {formatPrice(order?.color?.price)}</p>
              </div>
           </Link>

        

              </div>

              <div className='flex flex-col space-y-1'>
                <div>
               <AddToCartButton
                       className={"text-sm w-full flex justify-between  hover:bg-lcard rounded-lg p-2 dark:hover:bg-dcard duration-300"}
                       productId={order?.product.id}
                       price={order?.color.price}
                       colorId={order?.colorId}
                    //  name={name}
                     initialState={{
                         quantity: order?.quantity || 1,
                         isCarted: order?.product.cartItems?.some(
                             (cartItem) => cartItem.userId === session?.user?.id && cartItem.colorId === order?.colorId
                         ),
                         userId: session?.user.id
                     }}
                     stocks={order?.color?.stocks}
                      //  stocks={order?.stocks}
                   /> 
                </div>
                <div>
                      <h1>{formatPrice(price)} تومان</h1>
                </div>
              </div>





          </div>
  )
}

export default OrderCard;

// components/ImageWithLoading.js

