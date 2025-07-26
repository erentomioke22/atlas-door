import React, {useRef, useState } from 'react'
import Image from 'next/image'
import { FiUpload } from "react-icons/fi";
import * as yup from 'yup';
import { imageFileValidation } from "@lib/validation";
import { imageUrlValidation } from "@lib/validation";
import { useUploadMutation } from '@components/posts/mutations';
import { toast } from 'sonner';
const ImageInput = ({setValue,selectedImage, setSelectedImage,selectedInputImage, setSelectedInputImage,rmThumbnailFile,setRmThumbnailFile}) => {



    const uploadMutation = useUploadMutation();
    const fileInputRef = useRef(null); 
     const [fileError, setFileError] = useState('');

     const setImageByUrl = ((imageUrl) => {
      if (imageUrl) { 
       const schema = yup.object().shape({ 
        image: imageUrlValidation.fields.image, 
      }); 
      schema.validate({ image: imageUrl }).then(() => { 
        setFileError(''); 
        setSelectedImage(imageUrl);  
        setValue('image',imageUrl)
      }) 
        .catch(err => { 
          setFileError(err.errors[0]); 
          setSelectedImage(null); 
        });  
      } 
      }
    )

    const handleImageUpload = (file) => {
        const formData = new FormData();
        formData.append('file', file);
    
        uploadMutation.mutate(formData, {
          onSuccess: (data) => {
            toast.success('File uploaded');
            if (data.imageUrl) {
              setValue('image',data.imageUrl)
            } else {
              toast.error('image upload failed')
            }
          },
          onError: (error) => {
            toast.error('Failed to upload file. Please try again.');
          },
        });
    };

     function handleImageChange(file) { 
      if (file) { 
        const imageUrl = URL.createObjectURL(file);
        // const extension = file.name.split(".").pop();
        // const formData = new File([file], `thumnail_${crypto.randomUUID()}.${extension}.webp`)
       const schema = yup.object().shape({ 
        image: imageFileValidation.fields.image, 
      }); 
      schema.validate({ image: file }).then(() => { 
        setFileError(''); 
        setSelectedImage(imageUrl);  
        // setValue('image',formData)
        // setValue('image',file)
        handleImageUpload(file)
      }) 
        .catch(err => { 
          setFileError(err.errors[0]); 
          setSelectedImage(null); 
        });  
      } 
    }
  return (
    <>
    <input
    type='file'
    accept='image/*'
    onChange={(e)=>{handleImageChange(e.target.files?.[0])}}
    ref={fileInputRef}
    className='hidden sr-only '/>
        {selectedImage
        ?
        <>
        <Image
         src={selectedImage}
         alt='avatar preview'
         width={150}
         height={150}
         className='size-32 w-full flex-none rounded-2xl object-cover'/>
          <button type="button" onClick={()=>{setValue('image',null);setRmThumbnailFile(selectedImage) ; setSelectedImage(null)}} className="text-black border-2 rounded-lg px-3 py-1 w-full text-center text-sm dark:border-white etxt-black dark:text-white disabled:cursor-not-allowed">
              Change Thumbnail
          </button>
        </>
        :
        <>
    <button 
    type='button'
    className='group relative block w-full'
    onClick={()=>{fileInputRef.current?.click()}}>
     <div className= "h-full bg-gradient-to-tr p-3 from-lbtn to-lcard dark:from-dbtn dark:to-dcard rounded-xl items-center align-middle justify-center flex flex-col space-y-1 text-lfont">
         <div className="bg-lcard dark:bg-dcard rounded-2xl text-sm p-3">
           <FiUpload />
         </div>
         <p className="text-sm ">Drop your image or browse</p>
         <p className="text-[10px]">upload file up to 2mb</p>
      </div>
    </button>
    <input type="text" className='resize-none block bg-lcard dark:bg-dcard px-2 py-2 rounded-lg focus:outline-none  w-full focus:ring-2 focus:ring-black dark:ring-white   duration-200 ' placeholder='Image Url' onChange={(e)=>{setSelectedInputImage(e.target.value)}} value={selectedImage}/>
    <button className='bg-black text-white w-full py-2 px-3 dark:bg-white dark:text-black rounded-lg ' type='button' onClick={()=>{setImageByUrl(selectedInputImage);setSelectedInputImage('')}}>Set Image by Url</button>
    {fileError && <p className='text-red text-[10px] md:text-sm'>{fileError}</p>} 
    </>
        }
    </>
  )
}

export default ImageInput;