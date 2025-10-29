import React, { useRef, useState } from 'react'
import Image from 'next/image'
import { FiUpload } from 'react-icons/fi'
import * as yup from 'yup'
import { imageFileValidation, imageUrlValidation } from '@/lib/validation'
import { useUploadMutation } from '@/components/posts/mutations'
import { toast } from 'sonner'

type ImageInputProps = {
  setValue: (name: string, value: any) => void
  selectedImage: string | null
  setSelectedImage: (url: string | null) => void
  selectedInputImage: string
  setSelectedInputImage: (url: string) => void
  rmThumbnailFile: string | null
  setRmThumbnailFile: (url: string | null) => void
}

const ImageInput: React.FC<ImageInputProps> = ({
  setValue,
  selectedImage,
  setSelectedImage,
  selectedInputImage,
  setSelectedInputImage,
  rmThumbnailFile,
  setRmThumbnailFile,
}) => {
  const uploadMutation = useUploadMutation()
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [fileError, setFileError] = useState('')

  const setImageByUrl = (imageUrl: string) => {
    if (imageUrl) {
      const schema = yup.object().shape({
        image: imageUrlValidation.fields.image,
      })
      schema
        .validate({ image: imageUrl })
        .then(() => {
          setFileError('')
          setSelectedImage(imageUrl)
          setValue('image', imageUrl)
        })
        .catch((err) => {
          setFileError(err.errors[0])
          setSelectedImage(null)
        })
    }
  }

  const handleImageUpload = (file: File) => {
    const formData = new FormData()
    formData.append('file', file)

    uploadMutation.mutate(formData, {
      onSuccess: (data: any) => {
        toast.success('File uploaded')
        if (data.imageUrl) {
          setValue('image', data.imageUrl)
        } else {
          toast.error('image upload failed')
        }
      },
      onError: () => {
        toast.error('Failed to upload file. Please try again.')
      },
    })
  }

  function handleImageChange(file?: File) {
    if (file) {
      const imageUrl = URL.createObjectURL(file)
      const schema = yup.object().shape({
        image: imageFileValidation.fields.image,
      })
      schema
        .validate({ image: file })
        .then(() => {
          setFileError('')
          setSelectedImage(imageUrl)
          handleImageUpload(file)
        })
        .catch((err) => {
          setFileError(err.errors[0])
          setSelectedImage(null)
        })
    }
  }

  return (
    <>
      <input
        type="file"
        accept="image/*"
        aria-label='upload image'
        onChange={(e) => {
          handleImageChange(e.target.files?.[0])
        }}
        ref={fileInputRef}
        className="hidden sr-only "
      />
      {selectedImage ? (
        <>
          <Image
            src={selectedImage}
            alt="avatar preview"
            width={150}
            height={150}
            className="size-32 w-full flex-none rounded-2xl object-cover"
          />
          <button
            type="button"
            onClick={() => {
              setValue('image', null)
              setRmThumbnailFile(selectedImage)
              setSelectedImage(null)
            }}
            className="text-black border-2 rounded-lg px-3 py-1 w-full text-center text-sm dark:border-white etxt-black dark:text-white disabled:cursor-not-allowed"
          >
            Change Thumbnail
          </button>
        </>
      ) : (
        <>
          <button
            type="button"
            className="group relative block w-full"
            onClick={() => {
              fileInputRef.current?.click()
            }}
          >
            <div className="h-full bg-gradient-to-tr p-3 from-lbtn to-lcard dark:from-dbtn dark:to-dcard rounded-xl items-center align-middle justify-center flex flex-col space-y-1 text-lfont">
              <div className="bg-lcard dark:bg-dcard rounded-2xl text-sm p-3">
                <FiUpload />
              </div>
              <p className="text-sm ">Drop your image or browse</p>
              <p className="text-[10px]">upload file up to 2mb</p>
            </div>
          </button>
          <input
            type="text"
            className="resize-none block bg-lcard dark:bg-dcard px-2 py-2 rounded-lg focus:outline-none  w-full focus:ring-2 focus:ring-black dark:ring-white   duration-200 "
            placeholder="Image Url"
            onChange={(e) => {
              setSelectedInputImage(e.target.value)
            }}
            value={selectedImage ?? selectedInputImage}
          />
          <button
            className="bg-black text-white w-full py-2 px-3 dark:bg-white dark:text-black rounded-lg "
            type="button"
            onClick={() => {
              setImageByUrl(selectedInputImage)
              setSelectedInputImage('')
            }}
          >
            Set Image by Url
          </button>
          {fileError && <p className="text-red text-[10px] md:text-sm">{fileError}</p>}
        </>
      )}
    </>
  )
}

export default ImageInput