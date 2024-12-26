import React from 'react'
import Link from 'next/link'
import Image from 'next/image';
import { FaTelegram } from "react-icons/fa";
import { FiInstagram } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa6";
const Footer = () => {


  return (

<footer className="relative  text-lfont pt-16 ">
  <div className='flex max-md:flex-col md:justify-between  px-5 max-md:space-y-5 md:space-x-5 my-10 md:px-36'>
    <div className=''>
    <Link href="/" className="font-blanka hover:text-purple duration-500 text-xl">
		  ATLAS DOOR
    </Link>
      <div  className=" text-[10px] md:text-[10px]  mt-3 space-x-3 flex">
        <p>تمامی حقوق شما در سایت ما محفوظ است</p>
        <span>© 1381 <span className='font-blanka'>ATLAS DOOR™</span></span> 
      {/* <Link href="privacy-policy">Privay</Link>
      <Link href="privacy-policy">Terms</Link>
      <Link href="privacy-policy">Cookies</Link> */}
    </div>
      <p className=" text-[10px] md:text-[10px] ">حق کپی رایت فقط با ذکر نام نام پیگرد قانونی ندارد</p>

     <div className='flex  gap-5 mt-3 text-2xl'>
         <a className='' href="https://eitaa.com/Atlasdoor96" target="_blank" rel="noopener noreferrer">
          <Image width={36} height={36}  src="/icon/eitaa.svg" className="size-6" alt="eitaa icon" />
         </a>
         <a className='' href="https://rubika.ir/Atlasdoor96" target="_blank" rel="noopener noreferrer">
          <Image width={36} height={36} src="/icon/rubika.svg" className="size-6" alt="rubika icon" />
         </a>
         <a className='text-blue duration-500' href="https://t.me/Atlasdoor96" target="_blank" rel="noopener noreferrer"><FaTelegram/></a>
         <a className='text-[violet] duration-500' href="https://www.instagram.com/atlasshishe96" target="_blank" rel="noopener noreferrer"><FiInstagram/></a>
         <a className='text-darkgreen duration-500' href="https://wa.me/+989334922498" target="_blank" rel="noopener noreferrer"><FaWhatsapp/></a>
       </div>
    </div>
     <div className=' text-sm md:my-auto  max-md:py-2 '>
          <p>آدرس : تهران اتوبان آزادگان آهن مکان فاز ۳ مرکزی پلاک ۶۸۲</p>
     </div>
    
 
  </div>
</footer>
  )
}

export default Footer;


