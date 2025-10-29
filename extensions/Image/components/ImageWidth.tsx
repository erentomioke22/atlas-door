import { memo, useCallback, useEffect, useState } from 'react'
import { MdWidthFull } from "react-icons/md";
import { MdWidthWide } from "react-icons/md";
import { MdWidthNormal } from "react-icons/md";

interface ImageWidthProps {
  onChange: (value: number) => void;
  value?: number;
}

export const ImageWidth = memo<ImageWidthProps>(({ onChange, value }) => {
  const [currentValue, setCurrentValue] = useState(value || 100)

  useEffect(() => {
    setCurrentValue(value || 100)
  }, [value])

  const handleChange = useCallback(
    (nextValue: number) => {
      onChange(nextValue)
      setCurrentValue(nextValue)
    },
    [onChange],
  )

  return (
    <div className="flex items-center gap-2 ">
      <button 
        aria-label='normal width'
        className={`${currentValue === 75 ? 'bg-white text-black dark:bg-black dark:text-white': 'text-white dark:text-black'} p-1 rounded-lg text-xl`} 
        type='button' 
        onClick={() => handleChange(75)}
      >
        <MdWidthNormal/>
      </button>
      <button 
        aria-label='wide width'
        className={`${currentValue === 100 ? 'bg-white text-black dark:bg-black dark:text-white': 'text-white dark:text-black'} p-1 rounded-lg text-xl`} 
        type='button' 
        onClick={() => handleChange(100)}
      >
        <MdWidthWide/>
      </button>
    </div>
  )
})

ImageWidth.displayName = 'ImageWidth'
