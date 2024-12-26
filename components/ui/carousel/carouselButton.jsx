import React, { useCallback, useEffect, useState } from 'react'
import { FaCaretLeft,FaCaretRight } from "react-icons/fa6";


export const usePrevNextButtons = (emblaApi) => {
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

  const onSelect = useCallback((emblaApi) => {
    setPrevBtnDisabled(!emblaApi.canScrollPrev())
    setNextBtnDisabled(!emblaApi.canScrollNext())
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

export const PrevButton = (props) => {
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

export const NextButton = (props) => {
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
