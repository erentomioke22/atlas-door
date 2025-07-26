import { memo, useCallback, useEffect, useState } from 'react'
import { MdWidthFull } from "react-icons/md";
import { MdWidthWide } from "react-icons/md";
import { MdWidthNormal } from "react-icons/md";

export const ImageWidth = memo(({ onChange, value }) => {
  const [currentValue, setCurrentValue] = useState(value || 100)

  useEffect(() => {
    setCurrentValue(value)
  }, [value])

  const handleChange = useCallback(
    (nextValue) => {
      onChange(nextValue)
      setCurrentValue(nextValue)
      // const nextValue = parseInt(e.target.value)
    },
    [onChange],
  )

  return (
    <div className="flex items-center gap-2 ">
      {/* <input
        className="h-2 bg-neutral-200 border-0 rounded appearance-none fill-neutral-300"
        type="range"
        min="25"
        max="100"
        step="25"
        onChange={handleChange}
        value={currentValue}
      /> */}
      {/* <span className="text-xs font-semibold text-neutral-500 select-none">{value}%</span> */}
      <button className={`${currentValue === 75 ? 'bg-white text-black dark:bg-black dark:text-white': 'text-white dark:text-black'} p-1 rounded-lg text-xl`} type='button' onClick={()=>handleChange(75)}><MdWidthNormal/></button>
      <button className={`${currentValue === 100 ? 'bg-white text-black dark:bg-black dark:text-white': 'text-white dark:text-black'} p-1 rounded-lg text-xl`} type='button' onClick={()=>handleChange(100)}><MdWidthWide/></button>
    </div>
  )
})

ImageWidth.displayName = 'ImageWidth'
