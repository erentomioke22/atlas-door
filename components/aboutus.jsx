import React from 'react';
import { FaTelegram } from "react-icons/fa";
import { FiInstagram } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa6";
import Image from 'next/image';

const AboutUs = () => {
  return (
    <>
      <div className="bg-lcard dark:bg-dcard w-full md:w-2/3 md:rounded-xl mx-auto px-5 py-20 space-y-5 gap-5">

        <div className='space-y-7 text-center'>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-7xl">درباره ی ما</h1>
          <h2 className="font-medium md:w-2/3 mx-auto">
            &quot;با بیش از دو دهه فعالیت در حوزه‌های مختلف از جمله کرکره برقی، شیشه سکوریت، درب اتوماتیک و جام بالکن‌ها، به دنبال ایجاد رضایت حداکثری مشتریان و ارائه خدمات با کیفیت و ماندگار هستیم.&quot;
          </h2>
          <h3 className='text-lfont text-sm'>آدرس : تهران اتوبان آزادگان آهن مکان فاز ۳ مرکزی پلاک ۶۸۲</h3>

          <div className='flex flex-wrap justify-center gap-5 md:gap-7 mt-3 text-2xl md:text-4xl'>
            <a href="https://eitaa.com/Atlasdoor96" target="_blank" rel="noopener noreferrer">
              <Image src="/icon/eitaa.svg" width={36} height={36} className="size-6 md:size-9" alt="Eitaa Icon" />
            </a>
            <a href="https://rubika.ir/Atlasdoor96" target="_blank" rel="noopener noreferrer">
              <Image src="/icon/rubika.svg" width={36} height={36} className="size-6 md:size-9" alt="Rubika Icon" />
            </a>
            <a className='text-blue duration-500' href="https://t.me/Atlasdoor96" target="_blank" rel="noopener noreferrer"><FaTelegram /></a>
            <a className='text-[violet] duration-500' href="https://www.instagram.com/atlasshishe96" target="_blank" rel="noopener noreferrer"><FiInstagram /></a>
            <a className='text-darkgreen duration-500' href="https://wa.me/+989334922498" target="_blank" rel="noopener noreferrer"><FaWhatsapp /></a>
          </div>
        </div>

        {/* <div className="flex flex-wrap space-x-5 text-sm md:text-lg justify-end text-start">
           <p>021 2121 256</p>
           <p>0912 375 8621</p>
           <p>0990 119 6140</p>
         </div> */}
      </div>
    </>
  );
}

export default AboutUs;
