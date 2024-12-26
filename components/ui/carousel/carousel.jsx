"use client"

import React,{useCallback,useEffect,useState} from 'react'
import {PrevButton,NextButton,usePrevNextButtons} from './carouselButton'
import useEmblaCarousel from 'embla-carousel-react'
import AutoScroll from 'embla-carousel-auto-scroll'
import { BsFillPauseFill } from "react-icons/bs";
import { BsFillPlayFill } from "react-icons/bs";


const EmblaCarousel = ({children,options,slides,buttons=false,autoScroll=true}) => {

  const [emblaRef, emblaApi] = useEmblaCarousel(options
    , autoScroll ? [AutoScroll({  playOnInit: true })] : []
  )
  const [isPlaying, setIsPlaying] = useState(false)

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick
  } = usePrevNextButtons(emblaApi)



  const toggleAutoplay = useCallback(() => {
    const autoScroll = emblaApi?.plugins()?.autoScroll
    if (!autoScroll) return

    const playOrStop = autoScroll.isPlaying()
      ? autoScroll.stop
      : autoScroll.play
    playOrStop()
  }, [emblaApi])

  useEffect(() => {
    const autoScroll = emblaApi?.plugins()?.autoScroll
    if (!autoScroll) return

    setIsPlaying(autoScroll.isPlaying())
    emblaApi
      .on('autoScroll:play', () => setIsPlaying(true))
      .on('autoScroll:stop', () => setIsPlaying(false))
      .on('reInit', () => setIsPlaying(autoScroll.isPlaying()))
  }, [emblaApi])



  return (
    <section className="w-full mx-auto px-5 md:px-10">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex touch-pan-y touch-pinch-zoom -ml-4">
          {/* {slides.map((index) => ( */}
            {children}
          {/* ))} */}
        </div>
      </div>

      <div className="">
        <div className="mt-5 flex gap-3">
          {buttons && 
          <>
          <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
          <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
          </>
          }
          {autoScroll &&
          <button 
          className="bg-black text-white  dark:bg-white dark:text-black  rounded-full px-3 py-1  text-lg" 
          onClick={toggleAutoplay} type="button">
          {isPlaying ? <BsFillPauseFill/> : <BsFillPlayFill/>}
        </button>
          }
        </div>
      </div>
    </section>
  )
}

export default EmblaCarousel