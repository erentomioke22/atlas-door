import React from 'react'
import Link from 'next/link'
import Image from 'next/image';
import { FaTelegram } from "react-icons/fa";
import { FiInstagram } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa6";

const Footer: React.FC = () => {
  return (

<footer className="container max-w-7xl mx-auto  text-lfont pt-16 ">
  <div className='flex max-md:flex-col md:justify-between  px-5 max-md:space-y-5 md:space-x-5 my-10 '>
    <div className='flex-col space-y-3'>
    <Link href="/" className="font-blanka font-bold hover:text-black dark:hover:text-white duration-500 text-xl">
    <h1>
		  ATLAS DOOR
    </h1>
    </Link>
      <div  className=" text-[10px] md:text-[10px]  mt-3 space-x-3 flex">
        <p>تمامی حقوق شما در سایت ما محفوظ است</p>
        <span>© 1381 <span className='font-blanka font-bold'>ATLAS DOOR™</span></span> 
    </div>
      <p className=" text-[10px] md:text-[10px] ">حق کپی رایت فقط با ذکر نام  پیگرد قانونی ندارد</p>

     <div className='flex  gap-5 mt-3 text-2xl'>
         <a className='' href="https://eitaa.com/Atlasdoor96" target="_blank" rel="noopener noreferrer" title="eitaa">
          <Image width={36} height={36}  src="/icon/eitaa.svg" className="size-6" alt="eitaa icon" />
         </a>
         <a className='' href="https://rubika.ir/Atlasdoor96" target="_blank" rel="noopener noreferrer" title="rubika">
          <Image width={36} height={36} src="/icon/rubika.svg" className="size-6" alt="rubika icon" />
         </a>
         <a className='text-blue duration-500' href="https://t.me/Atlasdoor96" target="_blank" rel="noopener noreferrer" title="telegram"><FaTelegram/></a>
         <a className='text-[violet] duration-500' href="https://www.instagram.com/atlasshishe96" target="_blank" rel="noopener noreferrer" title="instagram"><FiInstagram/></a>
         <a className='text-darkgreen duration-500' href="https://wa.me/+989334922498" target="_blank" rel="noopener noreferrer" title="WhatsApp"><FaWhatsapp/></a>
    </div>
    <div className='flex gap-5 text-xs'>
      <Link href="/privacy-policy">سیاست حفظ حریم خصوصی</Link>
      <Link href="/about-us">درباره ی ما</Link>
    </div>
     <div className='size-16'>
       <a referrerPolicy='origin' rel='noopener' aria-label='enamad' title='enamad' target='_blank' href='https://trustseal.enamad.ir/?id=676467&Code=D9AtshITMsWD7xr8ZQweznQrxmkFpaJN'>
        <img 
        referrerPolicy='origin' 
        src='https://trustseal.enamad.ir/logo.aspx?id=676467&Code=D9AtshITMsWD7xr8ZQweznQrxmkFpaJN' 
        alt='' 
        className='cursor-pointer' 
        data-code='D9AtshITMsWD7xr8ZQweznQrxmkFpaJN'/>
        </a>
     </div>
    </div>
     <div className=' text-sm md:my-auto  max-md:py-2 '>
          <h2>آدرس : تهران اتوبان آزادگان آهن مکان فاز ۳ مرکزی پلاک ۶۸۲</h2>
     </div>
    
 
  </div>
</footer>
  )
}

export default Footer;


