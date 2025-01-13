import React, { forwardRef } from 'react'

export const TextArea = forwardRef(({placeholder,title,value,error,name,type,className,onChange,onBlur,label,watch},ref) => (

        <>
           <div className="relative">
            {label && <label className=''>{title}</label>} 
             <textarea
               type={type}
               ref={ref}
               name={name}
               className={`${error  ? "border-red  focus:ring-2 focus:ring-red" : " focus:ring-2 ring-black dark:ring-white "} ${className} resize-none w-full appearance-none  rounded-xl px-3 py-2 block border-2 text-sm focus:outline-none dark:border-dcard  border-lcard  duration-200  `}
               placeholder={placeholder}
               onChange={onChange}
               onBlur={onBlur}
               value={value}
               error={error}
             />
             <div className='flex justify-between'>
               <div className={`text-red mt-2 text-[10px] md:text-sm transition-opacity duration-300 ${error ? "opacity-100" : "opacity-0"}`}>{error}</div>
              {watch && <p className={`${watch?.length >=200 ?"text-red " : "text-lfont"} text-end  text-[10px]`}>{watch?.length ? watch?.length : "0"}/200</p>} 
             </div>
           </div>
        </>
      ))
      TextArea.displayName = 'TextArea'; 

export default TextArea;