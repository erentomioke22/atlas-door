import { cn } from '@/lib/utils'
import { Node } from '@tiptap/pm/model'
import { Editor, NodeViewWrapper,NodeViewContent } from '@tiptap/react'
import { useCallback, useRef } from 'react'
import { useState } from 'react';



export const ImageView = (props) => {
  const [loading, setLoading] = useState(true);

  const { editor, getPos, node, updateAttributes } = props;
  const imageWrapperRef = useRef(null);
  const { src,alt,caption,width } = node.attrs;

  // const wrapperClassName = cn(
  //   node.attrs.align === 'left' ? 'ml-0' : 'ml-auto',
  //   node.attrs.align === 'right' ? 'mr-0' : 'mr-auto',
  //   node.attrs.align === 'center' && 'mx-auto'
  // );

  const onClick = useCallback(() => {
    const pos = getPos();
    editor.commands.setNodeSelection(pos); 
    editor.chain().focus(pos).run(); 
  }, [getPos, editor.commands]);




  return (
    <NodeViewWrapper className=" mx-auto my-5 " style={{ width }}
    >
      <div className='image-cover' contentEditable={false}  ref={imageWrapperRef} onClick={onClick}>
     {loading && (
        <div className='image-loader'></div>
      )}
        {src && (
          <img
          src={src}
          alt={alt || 'Blog Image'}
          onClick={onClick}
          onLoad={()=>{setLoading(false);}}
          onError={()=>{setLoading(false);}}
          className={` transition-opacity duration-500 ${loading ? ' opacity-0' : ' opacity-100'} `}
        />
        )}
      </div>
    </NodeViewWrapper>

  )
}

export default ImageView

