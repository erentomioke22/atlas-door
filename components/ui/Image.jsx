'use client'

import React, { useState } from 'react';
import Image from 'next/image';

const imageLoader = ({ src, width, quality }) => {
  return `${src}?w=${width}&q=${quality || 75}`
}

const ImageCom = ({ src, alt, width, height,className,size }) => {
  const [loading, setLoading] = useState(true);
  return (
    <>
    <Image
        src={src}
        alt={`${alt}`}
        onLoad={() => setLoading(false)}
        fill
        priority 
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className={`${className} transition-opacity duration-500 select-none pointer-events-none ${loading ? ' opacity-0' : ' opacity-100'} `}
        loader={imageLoader}
        // width={width}
        // height={height}
      />
    <div className={` ${loading ? 'animate-pulse' : ''}`}>
      {loading && (
        <div className={`${size}  flex items-center justify-center bg-lbtn dark:bg-dbtn w-full rounded-3xl`}></div>
      )}
    </div>
    </>
  );
};

export default ImageCom;