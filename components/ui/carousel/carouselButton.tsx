import React, { useCallback, useEffect, useState, ButtonHTMLAttributes } from 'react'
import type { EmblaCarouselType } from 'embla-carousel'
import { FaCaretLeft,FaCaretRight } from "react-icons/fa6";

export const usePrevNextButtons = (emblaApi: EmblaCarouselType | undefined) => {
  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true)
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true)

  const onPrevButtonClick = useCallback(() => {
    if (!emblaApi) return
    emblaApi.scrollPrev()
  }, [emblaApi])

  const onNextButtonClick = useCallback(() => {
    if (!emblaApi) return
    emblaApi.scrollNext()
  }, [emblaApi])

  const onSelect = useCallback((api: EmblaCarouselType) => {
    setPrevBtnDisabled(!api.canScrollPrev())
    setNextBtnDisabled(!api.canScrollNext())
  }, [])

  useEffect(() => {
    if (!emblaApi) return
    onSelect(emblaApi)
    emblaApi.on('reInit', onSelect).on('select', onSelect)
  }, [emblaApi, onSelect])

  return {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick
  }
}

type NavButtonProps = ButtonHTMLAttributes<HTMLButtonElement>

export const PrevButton = (props: NavButtonProps) => {
  const { children, ...restProps } = props

  return (
    <button
      className="bg-black text-white  dark:bg-white dark:text-black  rounded-full px-3 py-1  text-lg disabled:cursor-not-allowed "
      type="button"
      {...restProps}
    >
      <FaCaretRight/>
      {children}
    </button>
  )
}

export const NextButton = (props: NavButtonProps) => {
  const { children, ...restProps } = props

  return (
    <button
      className="bg-black text-white  dark:bg-white dark:text-black  rounded-full px-3 py-1  text-lg disabled:cursor-not-allowed "
      type="button"
      {...restProps}
    >
      <FaCaretLeft/>
      {children}
    </button>
  )
}
