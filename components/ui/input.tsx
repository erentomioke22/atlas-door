import React, { forwardRef } from 'react'

type InputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> & {
  title?: string
  error?: string
  label?: boolean
  className?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      title,
      value,
      error,
      name,
      type,
      className,
      onChange,
      onBlur,
      onInput,
      label,
      placeholder,
      min,
      max,
      step,
      ...props
    },
    ref,
  ) => (
    <>
      <div className="relative space-y-1">
        {label && <label className="truncate text-wrap text-sm  capitalize">{title}</label>}
        <input
          type={type}
          ref={ref}
          onChange={onChange}
          onBlur={onBlur}
          name={name}
          id="floating_outlined"
          className={`${error ? 'border-red  focus:ring-2 focus:ring-red' : ' focus:ring-2 ring-black dark:ring-white '} ${className} resize-none w-full appearance-none  rounded-xl px-3 py-2 block border-2 text-sm focus:outline-none dark:bg-dcard  bg-lcard dark:border-dcard  border-lcard  duration-200  `}
          placeholder={placeholder}
          value={value}
          onInput={onInput as React.FormEventHandler<HTMLInputElement> | undefined}
          min={min}
          max={max}
          step={step}
          {...props}
        />
      </div>

      <div
        className={`text-red mt-2 text-[10px] md:text-sm transition-opacity duration-300 ${
          error ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {error}
      </div>


    </>
  ),
)

Input.displayName = 'Input'
export default Input

// import * as React from "react"

// import { cn } from "@/lib/utils"

// function Input({ className, type, ...props  }: React.ComponentProps<"input">) {
//   return (
//     <input
//       type={type}
//       data-slot="input"
//       className={` ${className} resize-none w-full appearance-none  rounded-xl px-3 py-2 block border-2 text-sm focus:outline-none dark:bg-dcard  bg-lcard dark:border-dcard  border-lcard  duration-200  `}
//       {...props}
//     />
//   )
// }

// export { Input }

// components/ui/input.tsx
// import React from 'react';
// import { forwardRef } from 'react';

// interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
//   title: string;
//   error?: string;
// }

// const Input = forwardRef<HTMLInputElement, InputProps>(
//   ({ title, error, ...props }, ref) => {
//     return (
//       <div className="space-y-1">
//         <input
//           ref={ref}
//           {...props}
//           className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue dark:bg-gray-700 dark:border-gray-600 dark:text-white"
//         />
//         {error && (
//           <p className="text-red-500 text-sm">{error}</p>
//         )}
//       </div>
//     );
//   }
// );

// Input.displayName = 'Input';

// export default Input;

