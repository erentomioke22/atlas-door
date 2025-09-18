"use client"

import React,{useCallback,useEffect,useState} from 'react'
import {PrevButton,NextButton,usePrevNextButtons} from './carouselButton'
import useEmblaCarousel from 'embla-carousel-react'
import AutoScroll from 'embla-carousel-auto-scroll'
import { BsFillPauseFill } from "react-icons/bs";
import { BsFillPlayFill } from "react-icons/bs";
import { DotButton, useDotButton } from './carouselDot';

const EmblaCarousel = ({children,options,slides,buttons=false,autoScroll=true,dot,length=true}) => {

  const [emblaRef, emblaApi] = useEmblaCarousel(options
    , autoScroll ? [AutoScroll({  playOnInit: true })] : []
  )
  const [isPlaying, setIsPlaying] = useState(false)
  const { selectedIndexDot, scrollSnaps, onDotButtonClick } = useDotButton(emblaApi);
  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick
  } = usePrevNextButtons(emblaApi)




  // const { slides, options } = props
  // const [selectedIndex, setSelectedIndex] = useState(0)
  // const [emblaMainRef, emblaMainApi] = useEmblaCarousel(options)
  // const [emblaThumbsRef, emblaThumbsApi] = useEmblaCarousel({
  //   containScroll: 'keepSnaps',
  //   dragFree: true
  // })

  // const onThumbClick = useCallback(
  //   (index) => {
  //     if (!emblaMainApi || !emblaThumbsApi) return
  //     emblaMainApi.scrollTo(index)
  //   },
  //   [emblaMainApi, emblaThumbsApi]
  // )

  // const onSelect = useCallback(() => {
  //   if (!emblaMainApi || !emblaThumbsApi) return
  //   setSelectedIndex(emblaMainApi.selectedScrollSnap())
  //   emblaThumbsApi.scrollTo(emblaMainApi.selectedScrollSnap())
  // }, [emblaMainApi, emblaThumbsApi, setSelectedIndex])

  // useEffect(() => {
  //   if (!emblaMainApi) return
  //   onSelect()

  //   emblaMainApi.on('select', onSelect).on('reInit', onSelect)
  // }, [emblaMainApi, onSelect])






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


          {/* <div className="embla-thumbs">
          <div className="embla-thumbs__viewport" ref={emblaThumbsRef}>
            <div className="embla-thumbs__container">
              {slides.map((index) => (
                <Thumb
                  key={index}
                  onClick={() => onThumbClick(index)}
                  selected={index === selectedIndex}
                  index={index}
                />
              ))}
            </div>
          </div>
        </div> */}
    </section>
  )
}

export default EmblaCarousel;




