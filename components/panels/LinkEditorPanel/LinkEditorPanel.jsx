import { Icon } from '@components/ui/Icon'
import { Surface } from '@components/ui/Surface'
// import { Toggle } from '@components/ui/Toggle/Toggle'
import { useState, useCallback, useMemo } from 'react'



export const LinkEditorPanel = ({ onSetLink, initialOpenInNewTab, initialUrl }) => {
  const [url, setUrl] = useState(initialUrl || '')
  const [openInNewTab, setOpenInNewTab] = useState(initialOpenInNewTab || false)

  const onChange = useCallback((event) => {
    setUrl(event.target.value)
  }, [])

  // const isValidUrl = useMemo(() => /^(\S+):(\/\/)?\S+$/.test(url), [url])

  const handleSubmit = useCallback((e) => {
    // e.preventDefault()
    // if (isValidUrl) {
        onSetLink(url, openInNewTab)
    // }
}, [url,
  //  isValidUrl,
    openInNewTab, onSetLink])

  return (
    <Surface className="p-1" >
      <form 
      // onSubmit={handleSubmit}
       className="flex items-center gap-2">
        <label className="flex items-center gap-2  p-1 rounded-lg  cursor-text">
          <Icon name="Link" className="flex-none text-white dark:text-black" />
          <input
            type="url"
            className="resize-none block text-white dark:text-black bg-dcard dark:bg-lcard px-2 py-2 rounded-lg focus:outline-none  w-full focus:ring-2 focus:ring-white dark:ring-black   duration-200 "
            placeholder="Enter URL"
            value={url}
            onChange={onChange}
          />
        </label>
        <button className='bg-transparent text-sm text-white border-2  px-2 py-2   rounded-lg  dark:text-black disabled:brightness-75 disabled:cursor-not-allowed' buttonSize="small" type="button" onClick={handleSubmit} 
        // disabled={!isValidUrl}
        >
          Set Link
        </button>
      </form>
      <div className="mt-3">
        {/* <label className="flex items-center justify-start gap-2 text-sm font-semibold cursor-pointer select-none text-neutral-500 dark:text-neutral-400">
          Open in new tab
          <Toggle active={state.openInNewTab} onChange={state.setOpenInNewTab} />
        </label> */}
      </div>
    </Surface>
  )
}
