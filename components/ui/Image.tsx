'use client'

import React, { useState } from 'react'
import NextImage, { type ImageLoader } from 'next/image'
import { FaCircleExclamation } from "react-icons/fa6";

const imageLoader: ImageLoader = ({ src, width, quality }) => {
  return `${src}?w=${width}&q=${quality || 75}`
}

type ImageComProps = {
  src: string
  alt: string
  className?: string
  size?: string

  layout?: 'fill' | 'natural'
  width?: number
  height?: number
  maxWidth?: number | string
  priority?:boolean
}

const ImageCom: React.FC<ImageComProps> = ({
  src,
  alt,
  className,
  layout = 'fill',
  width,
  height,
  maxWidth,
  ...props
}) => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  // حالت خطا یا src خالی
  if (!src || src.trim() === '') {
    return (
      <div
        className={`relative overflow-hidden shrink-0 bg-lbtn dark:bg-dbtn ${
          layout === 'natural' ? 'w-full aspect-video' : className
        }`}
      >
        <FaCircleExclamation className="absolute inset-0 m-auto text-sm text-neutral-500 dark:text-neutral-300" />
      </div>
    )
  }

  const handleLoad = () => {
    setLoading(false)
    setError(false)
  }

  const handleError = () => {
    setLoading(false)
    setError(true)
  }

  if (layout === 'natural') {
    return (
      <div className="relative w-full">
        <NextImage
          src={src}
          alt={alt}
          width={width ?? 1200}
          height={height ?? 800}
          onLoad={handleLoad}
          onError={handleError}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className={`h-auto w-full object-contain transition-opacity duration-500 select-none ${
            loading || error ? 'opacity-0' : 'opacity-100'
          } ${className ?? ''}`}
          loader={imageLoader}
          style={maxWidth ? { maxWidth } : undefined}
          {...props}
        />

        {(loading || error) && (
          <div className="absolute inset-0 flex items-center justify-center bg-lbtn dark:bg-dbtn animate-pulse">
            {error && (
              <FaCircleExclamation className="text-sm text-center text-neutral-500 dark:text-neutral-300" />
            )}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={`relative overflow-hidden shrink-0 ${className}`}>
      <NextImage
        src={src}
        alt={alt}
        onLoad={handleLoad}
        onError={handleError}
        fill
        priority
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className={`object-cover transition-opacity duration-500 select-none pointer-events-none ${
          loading || error ? 'opacity-0' : 'opacity-100'
        }`}
        loader={imageLoader}
        {...props}
      />

      {(loading || error) && (
        <div
          className={`absolute inset-0 flex items-center justify-center bg-lbtn dark:bg-dbtn ${
            loading ? 'animate-pulse' : ''
          }`}
        >
          {error && (
            <FaCircleExclamation className="text-sm text-center text-neutral-500 dark:text-neutral-300" />
          )}
        </div>
      )}
    </div>
  )
}

export default ImageCom;