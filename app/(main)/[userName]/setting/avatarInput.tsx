import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { FiUpload } from "react-icons/fi";
import * as yup from 'yup';
import { imageFileValidation } from "@/lib/validation";
import { imageUrlValidation } from "@/lib/validation";
import { toast } from 'sonner';
import Input from '@/components/ui/input';
import ImageCom from '@/components/ui/Image';
import { BsFillPersonVcardFill } from "react-icons/bs";
import { UseFormSetValue } from 'react-hook-form';

// Define component props interface
interface AvatarInputProps {
  avatar: string | null;
  setValue: UseFormSetValue<any>;
  selectedImage: string | null;
  setSelectedImage: (image: string | null) => void;
  selectedInputImage: string;
  setSelectedInputImage: (image: string) => void;
  removedAvatar: string;
  setRemovedAvatar: (avatar: string) => void;
}

const AvatarInput: React.FC<AvatarInputProps> = ({
  avatar,
  setValue,
  selectedImage,
  setSelectedImage,
  selectedInputImage,
  setSelectedInputImage,
  removedAvatar,
  setRemovedAvatar
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileError, setFileError] = useState<string>('');

  const setImageByUrl = (imageUrl: string): void => {
    if (imageUrl) {
      const schema = yup.object().shape({
        image: imageUrlValidation.fields.image,
      });
      schema.validate({ image: imageUrl }).then(() => {
        setFileError('');
        setSelectedImage(imageUrl);
        setValue('image', imageUrl);
      })
        .catch((err: yup.ValidationError) => {
          setFileError(err.errors[0]);
          setSelectedImage(null);
        });
    }
  };

  function handleImageChange(file: File | null): void {
    if (file) {
      if (avatar) {
        setRemovedAvatar(avatar.split("/").pop() || "");
      }
      const imageUrl = URL.createObjectURL(file);
      const extension = file.name.split(".").pop();
      const formData = new File([file], `avatar_${crypto.randomUUID()}.${extension}.webp`);
      const schema = yup.object().shape({
        image: imageFileValidation.fields.image,
      });
      schema.validate({ image: file }).then(() => {
        setFileError('');
        setSelectedImage(imageUrl);
        setValue('image', formData);
      })
        .catch((err: yup.ValidationError) => {
          setFileError(err.errors[0]);
          setSelectedImage(null);
        });
    }
  }

  const handleRemoveImage = (removedImage: string): void => {
    const deletedImage = removedImage.split("/").pop();
    if (deletedImage) {
      setValue("rmFiles", deletedImage);
    }
  };

  return (
    <>
      <input
        aria-label='avatar input'
        type='file'
        accept='image/*'
        onChange={(e) => { handleImageChange(e.target.files?.[0] || null); }}
        ref={fileInputRef}
        className='hidden sr-only '
      />
      {selectedImage || avatar ? (
        <div className={`rounded-2xl size-20 cursor-pointer relative`} onClick={() => { fileInputRef.current?.click(); }}>
          <ImageCom src={selectedImage || avatar || ""} alt="user avatar" className='rounded-2xl size-20 cursor-pointer' />
          <div className="absolute  inset-0 top-0 right-0  text-xl text-white bg-black bg-opacity-20  rounded-xl flex items-center justify-center">
            <h1><BsFillPersonVcardFill /></h1>
          </div>
        </div>
      ) : (
        <div className='bg-gradient-to-tr from-darkgreen to-blue size-20 rounded-xl ' onClick={() => { fileInputRef.current?.click(); }}></div>
      )}
      {fileError && <p className='text-red text-[10px] md:text-sm'>{fileError}</p>}
    </>
  );
};

export default AvatarInput;

