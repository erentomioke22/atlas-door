import { Icon } from '@/components/ui/Icon'
import { Surface } from '@/components/ui/Surface'
import { useState, useCallback, useMemo } from 'react'
import { FaCheck } from "react-icons/fa";

export type LinkEditorPanelProps = {
  initialUrl?: string
  initialOpenInNewTab?: boolean
  onSetLink: (url: string, openInNewTab?: boolean) => void
}

// export const useLinkEditorState = ({ initialUrl, initialOpenInNewTab, onSetLink }: LinkEditorPanelProps) => {
//   const [url, setUrl] = useState(initialUrl || '')
//   const [openInNewTab, setOpenInNewTab] = useState(initialOpenInNewTab || false)

//   const onChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
//     setUrl(event.target.value)
//   }, [])

//   const isValidUrl = useMemo(() => /^(\S+):(\/\/)?\S+$/.test(url), [url])

//   const handleSubmit = useCallback(
//     (e: React.FormEvent) => {
//       e.preventDefault()
//       if (isValidUrl) {
//         onSetLink(url, openInNewTab)
//       }
//     },
//     [url, isValidUrl, openInNewTab, onSetLink],
//   )

//   return {
//     url,
//     setUrl,
//     openInNewTab,
//     setOpenInNewTab,
//     onChange,
//     handleSubmit,
//     isValidUrl,
//   }
// }

// export const LinkEditorPanel = ({ onSetLink, initialOpenInNewTab, initialUrl }: LinkEditorPanelProps) => {
//   const state = useLinkEditorState({ onSetLink, initialOpenInNewTab, initialUrl })

//   return (
//     <Surface className="p-2">
//       <form 
//       // onSubmit={state.handleSubmit}
//        className="flex items-center gap-2">
//         <label className="flex items-center gap-2  p-1 rounded-lg  cursor-text">
//         <Icon name="Link" className="flex-none text-black dark:text-white" />
//           <input
//             type="url"
//             className="resize-none block text-white dark:text-black bg-dcard dark:bg-lcard px-2 py-2 rounded-lg focus:outline-none  w-full focus:ring-2 focus:ring-white dark:ring-black   duration-200 "
//             placeholder="Enter URL"
//             value={state.url}
//             onChange={state.onChange}
//           />
//         </label>
//         <button className='bg-transparent text-sm text-white border-2  px-2 py-2   rounded-lg  dark:text-black disabled:brightness-75 disabled:cursor-not-allowed' type="button"  onClick={handleSubmit} disabled={!state.isValidUrl}>
//           Set Link
//         </button>
//       </form>
//       {/* <div className="mt-3">
//         <label className="flex items-center justify-start gap-2 text-sm font-semibold cursor-pointer select-none text-neutral-500 dark:text-neutral-400">
//           Open in new tab
//           <Toggle active={state.openInNewTab} onChange={state.setOpenInNewTab} />
//         </label>
//       </div> */}
//     </Surface>
//   )
// }


export const LinkEditorPanel = ({ onSetLink, initialOpenInNewTab, initialUrl } : LinkEditorPanelProps) => {
  const [url, setUrl] = useState(initialUrl || '')
  const [openInNewTab, setOpenInNewTab] = useState(initialOpenInNewTab || false)

  const onChange = useCallback((event : React.ChangeEvent<HTMLInputElement>) => {
    setUrl(event.target.value)
  }, [])

  // const isValidUrl = useMemo(() => /^(\S+):(\/\/)?\S+$/.test(url), [url])

  const handleSubmit = useCallback((e : React.FormEvent) => {
    // e.preventDefault()
    // if (isValidUrl) {
        onSetLink(url, openInNewTab)
    // }
}, [url,
  //  isValidUrl,
    openInNewTab, onSetLink])

  return (
    <Surface className="p-1" >
      <div 
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
        <button className='bg-transparent text-sm text-white border-2  px-2 py-2  cursor-pointer rounded-lg  dark:text-black disabled:brightness-75 disabled:cursor-not-allowed'  type="button" aria-label='set link' onClick={handleSubmit} 
        // disabled={!isValidUrl}
        >
          <FaCheck/>
        </button>
      </div>
      <div className="mt-3">
        {/* <label className="flex items-center justify-start gap-2 text-sm font-semibold cursor-pointer select-none text-neutral-500 dark:text-neutral-400">
          Open in new tab
          <Toggle active={state.openInNewTab} onChange={state.setOpenInNewTab} />
        </label> */}
      </div>
    </Surface>
  )
}