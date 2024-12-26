// import { EmojiItem } from '@tiptap-pro/extension-emoji'
// import React, { useCallback, useEffect, useImperativeHandle, useState } from 'react'

// import { Panel } from '@components/ui/Panel'
// // import { EmojiListProps } from '../types'
// // import { SuggestionKeyDownProps } from '@tiptap/suggestion'

// const EmojiList = 
//   (props, ref) => {
//     const [selectedIndex, setSelectedIndex] = useState(0)

//     useEffect(() => setSelectedIndex(0), [props.items])

//     const selectItem = useCallback(
//       (index) => {
//         const item = props.items[index]

//         if (item) {
//           props.command({ name: item.name })
//         }
//       },
//       [props],
//     )

//     useImperativeHandle(ref, () => {
//       const scrollIntoView = (index) => {
//         const item = props.items[index]

//         if (item) {
//           const node = document.querySelector(`[data-emoji-name="${item.name}"]`)

//           if (node) {
//             node.scrollIntoView({ block: 'nearest' })
//           }
//         }
//       }

//       const upHandler = () => {
//         const newIndex = (selectedIndex + props.items.length - 1) % props.items.length
//         setSelectedIndex(newIndex)
//         scrollIntoView(newIndex)
//       }

//       const downHandler = () => {
//         const newIndex = (selectedIndex + 1) % props.items.length
//         setSelectedIndex(newIndex)
//         scrollIntoView(newIndex)
//       }

//       const enterHandler = () => {
//         selectItem(selectedIndex)
//       }

//       return {
//         onKeyDown: ({ event }) => {
//           if (event.key === 'ArrowUp') {
//             upHandler()
//             return true
//           }

//           if (event.key === 'ArrowDown') {
//             downHandler()
//             return true
//           }

//           if (event.key === 'Enter') {
//             enterHandler()
//             return true
//           }

//           return false
//         },
//       }
//     }, [props, selectedIndex, selectItem])

//     const createClickHandler = useCallback((index) => () => selectItem(index), [selectItem])

//     if (!props.items || !props.items.length) {
//       return null
//     }

//     return (
//       <Panel className="overflow-y-auto max-w-[18rem] max-h-[18rem]">
//         {props.items.map((item, index) => (
//           <button
//             active={index === selectedIndex}
//             variant="ghost"
//             className="justify-start w-full"
//             buttonSize="small"
//             key={item.name}
//             onClick={createClickHandler(index)}
//             data-emoji-name={item.name}
//           >
//             {item.fallbackImage ? <img src={item.fallbackImage} className="w-5 h-5" alt="emoji" /> : item.emoji}{' '}
//             <span className="truncate text-ellipsis">:{item.name}:</span>
//           </button>
//         ))}
//       </Panel>
//     )
//   }


// EmojiList.displayName = 'EmojiList'

// export default EmojiList
import React, { useCallback, useEffect, useImperativeHandle, useState } from 'react';
import { Panel } from '@components/ui/Panel';

const EmojiList = React.forwardRef((props, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => setSelectedIndex(0), [props.items]);

  const selectItem = useCallback((index) => {
    const item = props.items[index];
    if (item) {
      props.command({ name: item.name });
    }
  }, [props]);

  useImperativeHandle(ref, () => ({
    onKeyDown({ event }) {
      if (event.key === 'ArrowUp') {
        const newIndex = (selectedIndex + props.items.length - 1) % props.items.length;
        setSelectedIndex(newIndex);
        scrollIntoView(newIndex);
        return true;
      }
      if (event.key === 'ArrowDown') {
        const newIndex = (selectedIndex + 1) % props.items.length;
        setSelectedIndex(newIndex);
        scrollIntoView(newIndex);
        return true;
      }
      if (event.key === 'Enter') {
        selectItem(selectedIndex);
        return true;
      }
      return false;
    },
  }), [props, selectedIndex, selectItem]);

  const scrollIntoView = (index) => {
    const item = props.items[index];
    if (item) {
      const node = document.querySelector(`[data-emoji-name="${item.name}"]`);
      if (node) {
        node.scrollIntoView({ block: 'nearest' });
      }
    }
  };

  const createClickHandler = useCallback((index) => () => selectItem(index), [selectItem]);

  if (!props.items || !props.items.length) {
    return null;
  }

  return (
    <div className="w-52 flex flex-wrap max-h-36 py-2 px-3 overflow-y-auto text-wrap rounded-xl relative bg-black dark:bg-white shadow-sm gap-1 ">
      {props.items.map((item, index) => (
        <button
          key={item.name}
          onClick={createClickHandler(index)}
          data-emoji-name={item.name}
          className="  mx-auto  hover:active:bg-lcard hover:active:dark:bg-dcard"
        >
          {item.fallbackImage ? <img src={item.fallbackImage} className="w-5 h-5" alt="emoji" /> : item.emoji}{' '}
          {/* <span className="truncate text-ellipsis">:{item.name}:</span> */}
        </button>
      ))}
    </div>
  );
});

EmojiList.displayName = 'EmojiList';
export default EmojiList;
