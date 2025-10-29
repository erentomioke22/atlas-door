"use client"

import React, {useCallback, useEffect, useState, PropsWithChildren} from 'react'
import {PrevButton, NextButton, usePrevNextButtons} from './carouselButton'
import useEmblaCarousel from 'embla-carousel-react'
import type { EmblaOptionsType, EmblaCarouselType } from 'embla-carousel'
import AutoScroll from 'embla-carousel-auto-scroll'
import { BsFillPauseFill } from "react-icons/bs";
import { BsFillPlayFill } from "react-icons/bs";
import { DotButton, useDotButton } from './carouselDot';

type EmblaCarouselProps = PropsWithChildren<{
  options?: EmblaOptionsType
  slides?: number[] | React.ReactNode[]
  buttons?: boolean
  autoScroll?: boolean
  dot?: boolean
  length?: boolean
}>

const EmblaCarousel = ({children, options, slides, buttons = false, autoScroll = true, dot, length = true}: EmblaCarouselProps) => {
  const [emblaRef, emblaApi] = useEmblaCarousel(options, autoScroll ? [AutoScroll({ playOnInit: true })] : [])
  const [isPlaying, setIsPlaying] = useState(false)

  const { selectedIndexDot, scrollSnaps, onDotButtonClick } = useDotButton(emblaApi as EmblaCarouselType | undefined)
  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick
  } = usePrevNextButtons(emblaApi as EmblaCarouselType | undefined)

  const toggleAutoplay = useCallback(() => {
    const auto = (emblaApi as any)?.plugins?.()?.autoScroll as
      | { isPlaying(): boolean; stop(): void; play(): void }
      | undefined
    if (!auto) return
    const playOrStop = auto.isPlaying() ? auto.stop : auto.play
    playOrStop()
  }, [emblaApi])

  useEffect(() => {
    const auto = (emblaApi as any)?.plugins?.()?.autoScroll as
      | { isPlaying(): boolean; stop(): void; play(): void }
      | undefined
    if (!auto) return

    setIsPlaying(auto.isPlaying())
    emblaApi
      ?.on('autoScroll:play', () => setIsPlaying(true))
      ?.on('autoScroll:stop', () => setIsPlaying(false))
      ?.on('reInit', () => setIsPlaying(auto.isPlaying()))
  }, [emblaApi])

  return (
    <section className="w-full mx-auto">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex touch-pan-y touch-pinch-zoom ">
          {children}
        </div>
      </div>

      <div className={`m-5 flex ${buttons === true ? 'justify-between' : 'justify-center'}`}>
        {buttons && length &&
          <div className='flex gap-3'>
            <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
            <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
          </div>
        }
        {dot === true && length &&
          <div className="flex flex-wrap justify-center my-3 gap-2 ">
            {scrollSnaps.map((_, index) => (
              <DotButton
                key={index}
                onClick={() => onDotButtonClick(index)}
                className={`w-3 h-3   flex items-center justify-center rounded-lg ${index === selectedIndexDot ? 'bg-black dark:bg-white' : 'bg-lbtn dark:bg-dbtn'}`}
              />
            ))}
          </div>}
        {autoScroll &&
          <button
            className="bg-black text-white  dark:bg-white dark:text-black  rounded-full px-3 py-1  text-lg flex justify-start"
            onClick={toggleAutoplay} type="button">
            {isPlaying ? <BsFillPauseFill/> : <BsFillPlayFill/>}
          </button>
        }
      </div>
    </section>
  )
}

export default EmblaCarousel;




