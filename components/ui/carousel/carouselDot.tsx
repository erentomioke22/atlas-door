import React, { useCallback, useEffect, useState, ButtonHTMLAttributes } from 'react'
import type { EmblaCarouselType } from 'embla-carousel'

export const useDotButton = (emblaApi: EmblaCarouselType | undefined) => {
  const [selectedIndexDot, setSelectedIndexDot] = useState(0)
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([])

  const onDotButtonClick = useCallback(
    (index: number) => {
      if (!emblaApi) return
      emblaApi.scrollTo(index)
    },
    [emblaApi]
  )

  const onInit = useCallback((api: EmblaCarouselType) => {
    setScrollSnaps(api.scrollSnapList())
  }, [])

  const onSelect = useCallback((api: EmblaCarouselType) => {
    setSelectedIndexDot(api.selectedScrollSnap())
  }, [])

  useEffect(() => {
    if (!emblaApi) return
    onInit(emblaApi)
    onSelect(emblaApi)
    emblaApi.on('reInit', onInit).on('reInit', onSelect).on('select', onSelect)
  }, [emblaApi, onInit, onSelect])

  return {
    selectedIndexDot,
    scrollSnaps,
    onDotButtonClick
  }
}

type DotButtonProps = ButtonHTMLAttributes<HTMLButtonElement>

export const DotButton = (props: DotButtonProps) => {
  const { children, ...restProps } = props
  return (
    <button type="button" {...restProps}>
      {children}
    </button>
  )
}