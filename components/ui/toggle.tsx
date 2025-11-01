import React, { forwardRef } from 'react'

type ToggleProps = {
  title?: React.ReactNode
  checked?: boolean
  onChange?: React.ChangeEventHandler<HTMLInputElement>
  onBlur?: React.FocusEventHandler<HTMLInputElement>
  className?: string
}

const Toggle = forwardRef<HTMLInputElement, ToggleProps>(({ title, checked, onChange, onBlur, ...props}, ref) => {
  return (
    <label className="flex items-center cursor-pointer">
      <input
        type="checkbox"
        value=""
        className="sr-only peer"
        checked={checked}
        onChange={onChange}
        onBlur={onBlur}
        ref={ref}
        {...props}
      />
      <div className="relative w-11 h-6 bg-lbtn duration-500 dark:bg-dbtn  peer-focus:ring-none peer-focus:ring-2 peer-focus:ring-black dark:peer-focus:ring-white rounded-full peer  peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-lcard dark:after:bg-dcard after:border-black dark:after:border-white  after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-lcard peer-checked:bg-black dark:peer-checked:bg-white"></div>
      <span className="ms-2 text-sm  text-lfont ">{title}</span>
    </label>
  )
})

Toggle.displayName = 'Toggle'
export default Toggle