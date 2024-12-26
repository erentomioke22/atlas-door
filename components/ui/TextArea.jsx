import React, { forwardRef } from 'react'

const TextArea = forwardRef(({ title,value,error,name,type,className,onChange,onBlur,label,watch},ref) => (

        <>
           <div className="relative">
            {label && <label className='text-purple'>{name}</label>} 
             <textarea
               type={type}
               ref={ref}
               name={name}
               id="floating_outlined"
               className={`block p-2 w-full capitalize  ${className}`}
               placeholder={title}
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

export default TextArea