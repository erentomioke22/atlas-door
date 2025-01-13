import React,{useState} from 'react';
import { NodeViewWrapper } from '@tiptap/react';



const ImageGalleryComponent = ({ node }) => {
  // const images = node.content.content.map((imageNode) => imageNode.attrs.src);
  const[images,setImages]=useState([])
  return (
    <NodeViewWrapper className="carousel-wrapper">
        <div className='w-full overflow-x-auto '>
         <div className="flex space-x-5 px-10 py-5" style={{ width: 'calc(33.33% * 5)' }}>
           {images.map((src, index) => (
             <div key={index} className="image-item ">
               <img className='h-36 w-36' src={src} alt={`image ${index + 1}`} />
             </div>
           ))}

         </div>
        </div>
    </NodeViewWrapper>
  );
};

export default ImageGalleryComponent;