// // import { cn } from '@/lib/utils'
// import { Node } from '@tiptap/pm/model'
// import { useCallback, useRef } from 'react'
// import { useState } from 'react';
// import { Editor, NodeViewWrapper, NodeViewContent, ReactNodeViewProps } from '@tiptap/react'

// interface ImageViewProps extends ReactNodeViewProps {}
// interface ImageViewProps {
//   editor: Editor;
//   getPos: () => number;
//   node: Node;
//   updateAttributes: (attrs: Record<string, any>) => void;
// }

// export const ImageView = (props: ImageViewProps) => {
//   const [loading, setLoading] = useState(true);

//   const { editor, getPos, node, updateAttributes } = props;
//   const imageWrapperRef = useRef<HTMLDivElement>(null);
//   const { src, alt, caption, width } = node.attrs as {
//     src: string;
//     alt: string;
//     caption?: string;
//     width?: string;
//   };

//   const onClick = useCallback(() => {
//     const pos = getPos();
//     editor.commands.setNodeSelection(pos); 
//     editor.chain().focus(pos).run(); 
//   }, [getPos, editor.commands]);

//   return (
//     <NodeViewWrapper className=" mx-auto my-5 " style={{ width }}
//     >
//       <div className='image-cover' contentEditable={false} ref={imageWrapperRef} onClick={onClick}>
//         {loading && (
//           <div className='image-loader'></div>
//         )}
//         {src && (
//           <img
//             src={src}
//             alt={alt || 'Blog Image'}
//             onClick={onClick}
//             onLoad={() => { setLoading(false); }}
//             onError={() => { setLoading(false); }}
//             className={` transition-opacity duration-500 ${loading ? ' opacity-0' : ' opacity-100'} `}
//           />
//         )}
//       </div>
//     </NodeViewWrapper>
//   )
// }

// export default ImageView

import { cn } from '@/lib/utils'
import { Node } from '@tiptap/pm/model'
import { Editor, NodeViewWrapper, NodeViewContent, ReactNodeViewProps } from '@tiptap/react'
import { useCallback, useRef } from 'react'
import { useState } from 'react';

interface ImageViewProps extends ReactNodeViewProps {}

export const ImageView = (props: ImageViewProps) => {
  const [loading, setLoading] = useState(true);

  const { editor, getPos, node, updateAttributes } = props;
  const imageWrapperRef = useRef<HTMLDivElement>(null);
  const { src, alt, caption, width } = node.attrs as {
    src: string;
    alt: string;
    caption?: string;
    width?: string;
  };

  const onClick = useCallback(() => {
    const pos = getPos();
    if (typeof pos === 'number') {
      editor.commands.setNodeSelection(pos); 
      editor.chain().focus(pos).run(); 
    }
  }, [getPos, editor.commands]);

  return (
    <NodeViewWrapper className=" mx-auto my-5 " style={{ width }}
    >
      <div className='image-cover' contentEditable={false} ref={imageWrapperRef} onClick={onClick}>
        {loading && (
          <div className='image-loader'></div>
        )}
        {src && (
          <img
            src={src}
            alt={alt || 'Blog Image'}
            onClick={onClick}
            onLoad={() => { setLoading(false); }}
            onError={() => { setLoading(false); }}
            className={` transition-opacity duration-500 ${loading ? ' opacity-0' : ' opacity-100'} `}
          />
        )}
      </div>
    </NodeViewWrapper>
  )
}

export default ImageView