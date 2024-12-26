import { memo, useCallback, useEffect, useState } from 'react'
import Dropdown from '@components/ui/dropdown'


export const ImageAlt = memo(({ onChange, value }) => {
const [altText,setAltText]=useState('')

  return (
    <Dropdown className="right-0 px-2 bg-black dark:bg-white rounded-lg" title={'Alt Text'} btnStyle={'text-white dark:text-black p-1 my-auto text-sm'}>
      <div className='space-y-1 text-white dark:text-black'>
      <label htmlFor="altText" >Alt Text</label>
      <input
        id="altText"
        type="text"
        value={altText}
        onChange={(e) => setAltText(e.target.value)}
        className="bg-transparent p-2  ring-0 outline-none border-2 border-white dark:border-black rounded-lg"
        placeholder="Enter alt text"
      />
      <button className='text-black bg-white dark:bg-black dark:text-white w-full py-1 text-sm rounded-lg' onClick={()=>{onChange(altText);}} type='button'> 
        Set Alt Text
      </button>
      </div>
    </Dropdown>
  )
})


ImageAlt.displayName = 'ImageAlt'