import React from 'react';
import { FaTelegram } from "react-icons/fa";
import { FiInstagram } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa6";
import Image from 'next/image';

const AboutUs: React.FC = () => {
  return (
      <div className=" mx-auto   space-y-5 ">

        <div className='space-y-7 text-center'>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-7xl">درباره ی ما</h1>
          <h2 className="font-medium md:w-2/3 mx-auto">
            &quot;با بیش از دو دهه فعالیت در حوزه‌های مختلف از جمله کرکره برقی، شیشه سکوریت، درب اتوماتیک و جام بالکن‌ها، به دنبال ایجاد رضایت حداکثری مشتریان و ارائه خدمات با کیفیت و ماندگار هستیم.&quot;
          </h2>
          <h3 className='text-neutral-500 dark:text-neutral-400 text-sm'>آدرس : تهران اتوبان آزادگان آهن مکان فاز ۳ مرکزی پلاک ۶۸۲</h3>

          <div className='flex flex-wrap justify-center gap-5 md:gap-7 mt-3 text-2xl md:text-4xl'>
            <a href="https://eitaa.com/Atlasdoor96" target="_blank" rel="noopener noreferrer" title='eitaa'>
              <Image src="/icon/eitaa.svg" width={36} height={36} className="size-6 md:size-9" alt="Eitaa Icon" />
            </a>
            <a href="https://rubika.ir/Atlasdoor96" target="_blank" rel="noopener noreferrer" title='rubika'>
              <Image src="/icon/rubika.svg" width={36} height={36} className="size-6 md:size-9" alt="Rubika Icon" />
            </a>
            <a className='text-blue duration-500' href="https://t.me/Atlasdoor96" target="_blank" rel="noopener noreferrer" title='telegram'><FaTelegram /></a>
            <a className='text-[violet] duration-500' href="https://www.instagram.com/atlasshishe96" target="_blank" rel="noopener noreferrer" title='instagram'><FiInstagram /></a>
            <a className='text-darkgreen duration-500' href="https://wa.me/+989334922498" target="_blank" rel="noopener noreferrer" title='whatsapp'><FaWhatsapp /></a>
          </div>
        </div>

      </div>
  );
}

export default AboutUs;