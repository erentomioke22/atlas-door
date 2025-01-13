"use client"

import { useState ,useEffect } from "react";
import { IoMdArrowRoundUp } from "react-icons/io";


const GoUpBtn = () => {
  const[isVisible,setIsVisible]=useState(false);

  function gotoup(){
    window.scrollTo({top:0 ,left:0 ,behavior:"smooth"})
 }


    

    function listenToScroll(){
    let heightToHidden = 1250;
    const winScroll= document.body.scrollTop || document.documentElement.scrollTop;
  
    if(winScroll> heightToHidden){
      setIsVisible(true);
    }
    else{
      setIsVisible(false);
    }
  }
  
  useEffect(()=>{
    window.addEventListener("scroll",listenToScroll)
  },[])
  
    return(
        <>
           
            <button onClick={gotoup} 
              className={`${isVisible ? " opacity-1 " : " opacity-0"} fixed bottom-5 right-5 text-md font-bold text-lfont  px-3 py-2 border-2 dark:bg-dcard bg-lcard hover:bg-lbtn hover:dark:bg-dbtn duration-500 rounded-xl uppercase `}>
              <IoMdArrowRoundUp/>
            </button>

        </>   
    )

  }

export default GoUpBtn;