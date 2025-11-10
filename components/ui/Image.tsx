'use client'

import React, { useState } from 'react'
import NextImage, { type ImageLoader } from 'next/image'

const imageLoader: ImageLoader = ({ src, width, quality }) => {
  return `${src}?w=${width}&q=${quality || 75}`
}

type ImageComProps = {
  src: string
  alt: string
  className?: string
  size?: string
}

const ImageCom: React.FC<ImageComProps> = ({ src, alt, className }) => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const handleLoad = () => {
    setLoading(false)
    setError(false)
  }

  const handleError = () => {
    setLoading(false)
    setError(true)
  }
  return (
    <>
      <NextImage
        src={src}
        alt={alt}
        onLoad={handleLoad}
        onError={handleError}
        fill
        priority
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className={`${className} transition-opacity duration-500 select-none pointer-events-none ${loading || error ? 'opacity-0' : 'opacity-100'} `}
        loader={imageLoader}
      />

      {(loading || error) && (
        <div 
          className={`${className}  absolute inset-0 flex items-center justify-center bg-lbtn dark:bg-dbtn ${
            loading ? 'animate-pulse' : ''
          }`}
        >
          {error && (
            <p className="text-[10px] text-center text-lfont underline">
              مشکلی در بارگذاری تصویر وجود دارد!
            </p>
          )}
        </div>
      )}
    </>
  )
}

export default ImageCom;