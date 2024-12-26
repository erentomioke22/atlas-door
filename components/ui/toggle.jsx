import React from 'react'

const Toggle =  ({title,checked,onChange,onBlur,ref}) => {
  return (
    <label className="flex items-center cursor-pointer">
       <input type="checkbox" value="" className="sr-only peer" checked={checked} onChange={onChange} onBlur={onBlur} ref={ref}/>
       <div className="relative w-11 h-6 bg-lbtn duration-500 dark:bg-dbtn  peer-focus:ring-none peer-focus:ring-2 peer-focus:ring-purple dark:peer-focus:ring-purple rounded-full peer  peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-lcard dark:after:bg-dcard after:border-purple  after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-lcard peer-checked:bg-purple"></div>
       <span className="ms-2 text-sm  text-lfont ">{title}</span>
    </label>
  )
}

export default Toggle