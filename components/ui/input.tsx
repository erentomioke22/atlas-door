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
      ...rest
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
          {...rest}
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