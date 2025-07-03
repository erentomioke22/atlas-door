import React, {useRef, useState } from 'react'
import Image from 'next/image'
import { FiUpload } from "react-icons/fi";
import * as yup from 'yup';
import { imageFileValidation } from "@lib/validation";
import { imageUrlValidation } from "@lib/validation";
// import { useUploadMutation } from '@components/posts/mutations';
import { toast } from 'sonner';
import Input from '@components/ui/input';
import ImageCom from '@components/ui/Image';
import { BsFillPersonVcardFill } from "react-icons/bs";

const AvatarInput = ({avatar,setValue,selectedImage, setSelectedImage,selectedInputImage, setSelectedInputImage,removedAvatar,setRemovedAvatar}) => {


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



     function handleImageChange(file) { 
      if (file) { 
        // console.log(file)
        setRemovedAvatar(avatar.split("/").pop())
        const imageUrl = URL.createObjectURL(file);
        const extension = file.name.split(".").pop();
        const formData = new File([file], `avatar_${crypto.randomUUID()}.${extension}.webp`)
       const schema = yup.object().shape({ 
        image: imageFileValidation.fields.image, 
      }); 
      schema.validate({ image: file }).then(() => { 
        setFileError(''); 
        setSelectedImage(imageUrl);  
        setValue('image',formData)
      }) 
        .catch(err => { 
          setFileError(err.errors[0]); 
          setSelectedImage(null); 
        });  
      } 
    }

  const  handleRemoveImage = (removedImage)=>{
   const deletedImage = removedImage.split("/").pop();
    setValue("rmFiles", deletedImage);
  }

  return (
    <>
    <input
    type='file'
    accept='image/*'
    onChange={(e)=>{handleImageChange(e.target.files?.[0])}}
    ref={fileInputRef}
    className='hidden sr-only '/>
        {selectedImage || avatar
        ?
            <div className={`rounded-2xl size-20 cursor-pointer relative`} onClick={()=>{fileInputRef.current?.click()}}>
             <ImageCom  src={selectedImage || avatar || null} alt="user avatar" className='rounded-2xl size-20 cursor-pointer'  />
            
                                                                <div className="absolute  inset-0 top-0 right-0  text-xl text-white bg-black bg-opacity-20  rounded-xl flex items-center justify-center">
                                                                 <h1><BsFillPersonVcardFill /></h1>
                                                               </div>
                                                          </div>
//         :
//         <>
//     {avatar 
//     ? 
//     // <Image
//     // src={avatar}
//     // onClick={()=>{fileInputRef.current?.click()}}
//     // alt='avatar preview'
//     // width={150}
//     // height={150}
//     // className=' size-28 flex-none rounded-2xl object-cover mx-auto cursor-pointer'/>
//     <div className='rounded-xl size-20 cursor-pointer relative'>
//     <ImageCom  src={selectedImage || null} alt="user avatar" className='rounded-xl size-20 cursor-pointer' onClick={()=>{fileInputRef.current?.click()}} />
// </div>
    :
    <div className='bg-gradient-to-tr from-darkgreen to-blue size-20 rounded-xl '  onClick={()=>{fileInputRef.current?.click()}}></div>
    }
    {/* <Input type="text" placeholder='Image Url' onChange={(e)=>{setSelectedInputImage(e.target.value)}} value={selectedImage}/>
    <button className='bg-black text-white w-full py-2 px-3 dark:bg-white dark:text-black rounded-lg ' type='button' onClick={()=>{setImageByUrl(selectedInputImage);setSelectedInputImage('')}}>Set Image by Url</button> */}
    {fileError && <p className='text-red text-[10px] md:text-sm'>{fileError}</p>} 
       {/* </> */}
        {/* } */}
    </>
  )
}

export default AvatarInput;

