import React, { forwardRef } from 'react'

export const Input = forwardRef(({title,value,error,name,type,className,onChange,onBlur,onInput,label,placeholder,min,max,step},ref) => (
    <>
       <div className="relative space-y-1">
       {label && <label className='truncate text-wrap text-sm  capitalize'>{title}</label>}
         <input
           type={type}
           ref={ref} 
           onChange={onChange} 
           onBlur={onBlur}
           name={name}
           id="floating_outlined"
          //  className={`${error  ? "border-red block px-2.5 pb-2.5 pt-4 w-full text-sm bg-lcard dark:bg-dfont rounded-xl border-2  appearance-none dark:focus:border-red focus:outline-none focus:ring-0 focus:border-red peer transition-colors ease-in delay-50" : 
          //                                     "border-lbtn shadow-md dark:border-dbtn block px-2.5 pb-2.5 pt-4 w-full text-sm bg-lcard dark:bg-dfont rounded-xl border-2  appearance-none dark:focus:border-purple focus:outline-none focus:ring-0 focus:border-purple peer transition-colors ease-in delay-50"
          //                                   } ${className}`}
           className={`${error  ? "border-red  focus:ring-2 ring-red" : " focus:ring-2 ring-black dark:ring-white "} ${className} w-full appearance-none  rounded-xl px-3 py-3 block  text-sm focus:outline-none dark:bg-dcard  bg-lcard  duration-200  `}
           placeholder={placeholder}
           value={value}
           error={error}
           onInput={onInput}
           min={min}
           max={max}
           step={step}
         />
         
         {/* <label
           htmlFor="floating_outlined"
           className={`${error  ? "text-red    uppercase absolute text-sm duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-lcard dark:bg-dfont px-2 peer-focus:px-2 peer-focus:text-lcard     peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1 focus:bg-[#ffffff] rounded-md peer-focus:bg-red" 
                                            : "text-lfont  uppercase absolute text-sm duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-lcard dark:bg-dfont px-2 peer-focus:px-2 peer-focus:text-lcard  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1 focus:bg-[#ffffff] rounded-md peer-focus:bg-purple"
                                          }`}
         >
           {title}
         </label> */}

       </div>

        <div className={`text-red mt-2 text-[10px] md:text-sm transition-opacity duration-300 ${error ? "opacity-100" : "opacity-0"}`}>{error}</div>
    </>
  ))

  Input.displayName = 'Input'; 
  export default Input;