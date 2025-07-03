"use client";

import React, { useState,useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import TextArea from "@components/ui/TextArea";
import Dropdown from "@components/ui/dropdown";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { IoClose } from "react-icons/io5";
import { useEditProductMutation } from "@components/products/mutations";
import { useDeleteProductMutation } from "@components/products/mutations";
import LoadingIcon from "@components/ui/loading/LoadingIcon";
import BlockEditor from "@components/BlockEditor/BlockEditor";
import { useMemo } from "react";
import { Doc as YDoc } from "yjs";
import { useSearchParams } from "next/navigation";
import Accordion from "@components/ui/Accordion";
import ImageInput from "@components/ui/imageInput";
import EditPostLoading from "@components/ui/loading/editPostLoading";
import usePreventNavigation from "@hook/usePreventNavigation";
import NotFound from "@app/(main)/not-found";
import { useUploadThing } from "@lib/uploadthing";
import EmblaCarousel from "@components/ui/carousel/carousel";
import { FaImage, FaPlus, FaCheck, FaQuestion,FaPalette} from "react-icons/fa6";
import ImageCom from "@components/ui/Image";
import Offcanvas from "@components/ui/offcanvas";
import Button from "@components/ui/button";
import Darkmode from "@components/ui/darkmode";
import Input from "@components/ui/input";
import * as yup from "yup";
import {
  productValidation,
  imageFileValidation,
  imageUrlValidation,
} from "@lib/validation";
import { formatPrice } from "@lib/utils";
import { IoPencil } from "react-icons/io5";

const EditProduct = ({ name }) => {
  const { data: session } = useSession();
  const [dropTag, setDropTag] = useState([]);
  const router = useRouter();
  const mutation = useEditProductMutation();
  const deleteMutation = useDeleteProductMutation();
  const [files, setFiles] = useState([]);
  const [deletedPostFiles, setDeletedPostFiles] = useState([]);
  const [deletedFiles, setDeletedFiles] = useState([]);
  const [onClose, setOnClose] = useState(false);
  const ydoc = useMemo(() => new YDoc(), []);
  const [preventNavigation, setPreventNavigation] = useState(false);
  const blobUrlToUploadedUrlMap = [];
  const [editorContent, setEditorContent] = useState();
  const [contentImages, setContentImages] = useState();
  const [thumnailIndex, setThumnailIndex] = useState();
  const [cancel, setCancel] = useState(false);
  const [productThumnail, setProductThumnail] = useState(0);
  const [productPictures, setProductPictures] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [editColorIndex, setEditColorIndex] = useState(null);
  const [answer, setAnswer] = useState("");
  const [question, setQuestion] = useState("");
  const [faqs, setFaqs] = useState([]);
  const [colors, setColors] = useState([]);
  const [colorName, setColorName] = useState('');
  const [colorHex, setColorHex] = useState('');
  const [colorPrice, setColorPrice] = useState('');
  const [colorDiscount, setColorDiscount] = useState('');
  const [colorStocks, setColorStocks] = useState('');
  const [fileError, setFileError] = useState("");
  const [selectedInputImage, setSelectedInputImage] = useState();
  const [selectedImage, setSelectedImage] = useState();
  const [selectedImageUrl, setSelectedImageUrl] = useState();
  const fileInputRef = useRef(null);
  const [editingColorIndex, setEditingColorIndex] = useState(null);
  // const [items, setItems] = useState([])
  // const [rmThumbnailFile, setRmThumbnailFile] = useState([]);
  // const [imageUrl, setImageUrl] = useState();
  // const [selectedImage, setSelectedImage] = useState();
  // const [selectedInputImage, setSelectedInputImage] = useState();
  // const [thumnail, setThumnail] = useState()
  // const [provider, setProvider] = useState(null);
  // const [collabToken, setCollabToken] = useState();
  // const hasCollab =parseInt(searchParams?.get("noCollab")) !== 1 && collabToken !== null;
  // const searchParams = useSearchParams();
  // const blobUrlToUploadedUrlMap = new Map();
  // const [content, setContent] = useState();
  // const [imageInput, setImageInput] = useState();
  // const [modal, setModal] = useState(false);
  // const [ThumbnailFile, setThumbnailFile] = useState([]);

  // const ArchiveMutation = useCreateArchiveMutation();
  // console.log(items)

  usePreventNavigation(preventNavigation);

  console.log(colors)
  console.log(productPictures,productThumnail,thumnailIndex,deletedFiles)
  // console.log(faqs);
  // console.log(deletedPostFiles);
  // console.log(deletedFiles);
  // console.log(dropTag);





  const predefinedColors = [
    { name: 'Red', hexCode: '#FF0000' },
    { name: 'Blue', hexCode: '#0000FF' },
    { name: 'Green', hexCode: '#00FF00' },
    { name: 'Yellow', hexCode: '#FFFF00' },
    { name: 'Black', hexCode: '#000000' },
    { name: 'White', hexCode: '#FFFFFF' },
    { name: 'Purple', hexCode: '#800080' },
    { name: 'Orange', hexCode: '#FFA500' },
    { name: 'Pink', hexCode: '#FFC0CB' },
    { name: 'Brown', hexCode: '#A52A2A' },
    { name: 'Gray', hexCode: '#808080' },
    { name: 'Custom', hexCode: '#000000' }
  ];

  const {
    data: product,
    isPending,
    fetchNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useQuery({
    queryKey: ["edit-product", name],
    queryFn: async () => {
      const response = await axios.get(`/api/product/edit-product/${name}`);
      console.log(response);
      return response.data;
    },
  });

  console.log(product);

  if (status === "success" && product?.error) {
    return (
      <p className="text-center text-muted-foreground">
        No products found. Start following people to see their product here.
      </p>
    );
  }

  if (status === "error") {
    return (
      <p className="text-center text-destructive">
        An error occurred while loading product.
      </p>
    );
  }

  if (!session || !product) {
    NotFound();
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
    setValue,
    getValues,
  } = useForm({
    defaultValues: {
      productId: product?.id,
      name: "",
      desc: "",
      images: [],
      faqs: [],
      rmFiles: [],
      colors: [],
      content: "",
      // faqs:[],
      // tocs:[]
      // contentImages: [],
    },
    resolver: yupResolver(productValidation),
  });

  useEffect(() => {
    if (product) {
      setValue("name", product?.name);
      setValue("desc", product?.desc);
      setValue("productId", product?.id);
      setValue("content", product?.content);
      setValue("images", product?.images);
      setValue("colors", product?.colors);
      setProductThumnail(product?.images[0]);
      setColors(product?.colors);
      setFaqs(product?.faqs);
      setProductPictures(product?.images);
      // setImageUrl(post?.images[0]);
      // setSelectedImage(post?.images[0]);
      // setDeletedPostFiles((prevFiles) => [...prevFiles, post?.images[0]]);
      // setContent(post?.content);
      // setDeletedPostFiles([...deletedPostFiles, post?.images[0]]);
    }
  }, [
    product,
    // setValue,
    //  deletedPostFiles
  ]);

  // console.log(getValues('tocs'))

  const { startUpload: postUpload, isUploading: productIsUploading } =
    useUploadThing("post", {
      onClientUploadComplete: (data) => {
        toast.success("uploaded successfully!");
        console.log(data);
        // return data[0].url;
      },
      onUploadError: () => {
        throw new Error("error occurred while uploading");
      },
      onUploadBegin: ({ file }) => {
        console.log("upload has begun for", file);
      },
    });



  const onSubmit = async (values) => {
    try {
     console.log(values)
      const removeKey = deletedFiles.map((deletedFile) => {
        if (typeof deletedFile === "string") {
          return deletedFile.split("/").pop();
        }
        return null;
      });

      setValue("rmFiles", removeKey.filter(Boolean));


      const filesData = productPictures
        .map(({ file }) => {
          if (file && typeof file !== "string") {
            const extension = file.name.split(".").pop();
            return new File(
              [file],
              `post_${crypto.randomUUID()}.${extension}.webp`
            );
          }
          return null;
        })
        .filter(Boolean);

console.log(filesData)

      if (filesData.length >= 1) {
        const uploadedData = await postUpload(filesData);
        // const uploadedUrls = uploadedData.map(item => item.url);

        // Create a map of uploaded URLs
        const newBlobUrlMap = productPictures.map((picture, index) => {
          if (picture.file) {
            // For files that were uploaded
            return {
              blobUrl: picture.url,
              url: uploadedData.shift()?.url, // Take the first uploaded URL for each file
            };
          } else {
            // For URLs that were already provided
            return {
              blobUrl: picture || picture.url,
              url: picture || picture.url, // Keep the original URL
            };
          }
        });

        setProductPictures(newBlobUrlMap);
        console.log(newBlobUrlMap)
        if (productThumnail) {
          console.log(productThumnail)
          const allImages = newBlobUrlMap.map((item) => item.url);
          console.log(allImages)
          const thumbnailIndex = productPictures.findIndex(
            (picture) => picture.url === productThumnail
          );
          if (thumbnailIndex !== -1) {
            // Move thumbnail to the front
            const thumbnailUrl = allImages[thumbnailIndex];
            const remainingImages = allImages.filter((_, index) => index !== thumbnailIndex);
            setValue("images", [thumbnailUrl, ...remainingImages]);
          } else {
            setValue("images", allImages);
          }
        }
      }
      else{
        console.log(productPictures)
        if (productThumnail) {
          console.log(productThumnail)
          const allImages = productPictures.map((item) => item || item.url);
          console.log(allImages)
          const thumbnailIndex = productPictures.findIndex(
            (picture) => picture === productThumnail || picture.url === productThumnail
          );
          console.log(thumnailIndex)
          if (thumbnailIndex !== -1) {
            // Move thumbnail to the front
            const thumbnailUrl = allImages[thumbnailIndex];
            console.log(thumbnailUrl)
            const remainingImages = allImages.filter((_, index) => index !== thumbnailIndex);
            console.log(remainingImages)
            const currentImages = [thumbnailUrl, ...remainingImages];
            console.log(currentImages)
            setValue("images", currentImages);
          } else {
            setValue("images", allImages);
          }
        }
      }



       console.log(values)
       const finalValues = getValues();
       console.log("Submitting form with values:", finalValues);

      mutation.mutate(values, {
        onSuccess: () => {
          // reset();
          // setFaqs([]);
          // setColors([]);
          // setProductPictures([]);
          // setProductThumnail(null);
          // setDeletedFiles([]);
          // setFiles([])
          // router.back();
        },
      });
    } catch (err) {
      toast.error(err.message || "An error occurred");
      // console.log(err.message)
    }
  };



  const handleAddFaq = () => {
    if (editIndex !== null) {
      const updatedFaqs = faqs.map((faq, index) =>
        index === editIndex ? { question, answer } : faq
      );
      setFaqs(updatedFaqs);
      setValue("faqs", updatedFaqs, { shouldValidate: true });
      setEditIndex(null);
    } else {
      setFaqs([...faqs, { question, answer }]);
      setValue("faqs", [...faqs, { question, answer }], {
        shouldValidate: true,
      });
    }
    setAnswer("");
    setQuestion("");
  };

  const handleRemoveFaq = (index) => {
    const removeFaq = faqs.filter((_, i) => i !== index);
    setFaqs(removeFaq);
    setValue("faqs", removeFaq);
  };

  const handleEditFaq = (index) => {
    const faq = faqs[index];
    setQuestion(faq.question);
    setAnswer(faq.answer);
    setEditIndex(index);
  };

  // console.log(files)

  function handleAddImage(file) {
    if (file) {
      console.log(file);
      const schema = yup.object().shape({
        image: imageFileValidation.fields.image,
      });
      schema
        .validate({ image: file })
        .then(() => {
          setFileError("");
          const url = URL.createObjectURL(file);
          console.log(url);
          if (productPictures.length === 0) {
            setProductThumnail(url);
            setProductPictures((prevFiles) => {
              const updatedFiles = [...prevFiles, { file, url }];
              return updatedFiles;
            });
          } else {
            setProductPictures((prevFiles) => {
              const updatedFiles = [...prevFiles, { file, url }];
              return updatedFiles;
            });
          }
        })
        .catch((err) => {
          setFileError(err.errors[0]);
        });
    }
  }

  const setImageByUrl = (url) => {
    if (url) {
      // console.log(imageUrl)
      const schema = yup.object().shape({
        image: imageUrlValidation.fields.image,
      });
      schema
        .validate({ image: url })
        .then(() => {
          setFileError("");
          if (productPictures.length === 0) {
            setProductThumnail(url);
            setProductPictures((prevFiles) => {
              const updatedFiles = [...prevFiles, url];
              return updatedFiles;
            });
          } else {
            setProductPictures((prevFiles) => {
              const updatedFiles = [...prevFiles, url];
              return updatedFiles;
            });
          }
        })
        .catch((err) => {
          setFileError(err.errors[0]);
          setSelectedImage(null);
        });
    }
  };



  const handleRemoveImage = (indexToRemove, urlToRemove) => {
    setDeletedFiles(prev => [...prev, urlToRemove]);
    // setValue('rmFiles', prev => [...prev, urlToRemove]);
    
    if (urlToRemove === productThumnail) {
      // Get the remaining images after removal
      const remainingImages = productPictures.filter((_, index) => index !== indexToRemove);
      setValue("images",remainingImages)
      
      if (remainingImages.length > 0) {
        // Try to get the next image first, if not available, get the previous one
        const nextImage = productPictures[indexToRemove + 1] || productPictures[indexToRemove - 1];
        if (nextImage) {
          // Handle both string and object cases
          const nextImageUrl = typeof nextImage === 'string' ? nextImage : nextImage.url;
          setProductThumnail(nextImageUrl);
        }
      }
    }
    
    setProductPictures((prevImages) =>
      prevImages.filter((_, index) => index !== indexToRemove)
    );
  };


  const handleAddColor = () => {
    if (editColorIndex !== null) {
      const updatedColor = colors.map((color, index) =>
        index === editColorIndex ? { name:colorName, hexCode:colorHex,price:colorPrice,discount:colorDiscount,stocks:colorStocks } : color
      );
      setColors(updatedColor);
      setValue("colors", updatedColor, { shouldValidate: true });
      setEditColorIndex(null);
    } else {
      setColors([...colors, { name:colorName, hexCode:colorHex,price:colorPrice,discount:colorDiscount,stocks:colorStocks}]);
      setValue("colors", [...colors, { name:colorName, hexCode:colorHex,price:colorPrice,discount:colorDiscount,stocks:colorStocks}], {
        shouldValidate: true,
      });
    }
    setColorHex("");
    setColorName("");
    setColorPrice("");
    setColorDiscount("");
    setColorStocks("");
  };

  const handleRemoveColor = (index) => {
    const removeColor = colors.filter((_, i) => i !== index);
    setColors(removeColor);
    setValue("colors", removeColor);
    setEditColorIndex(null);
  };

  const handleEditColor = (index) => {
    const color = colors[index];
    console.log(color)
    setColorName(color.name);
    setColorHex(color.hexCode);
    setColorPrice(color.price);
    setColorDiscount(color.discount);
    setColorStocks(color.stocks);
    setEditColorIndex(index);
  };



  return (
    <div className="mb-2 px-2 sm:px-5">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-7">
        {!cancel && (
          <div className="flex justify-between  w-full sticky top-0 bg-white dark:bg-black z-[10] py-2 ">


            <div className="flex gap-2 ">
              <div>
                <Button
                  type="button"
                  disabled={
                    isPending ||
                    deleteMutation.isPending ||
                    mutation.isPending ||
                    productIsUploading
                  }
                  variant="delete"
                  className="text-[10px] md:text-sm px-3  py-1"
                  onClick={() => {
                    const removeKey = deletedFiles.map((file) => {
                      if (typeof file === "string") {
                        return file.split("/").pop();
                      }
                      return null;
                    });
                    console.log(removeKey);
                    let id = product?.id;
                    deleteMutation.mutate(
                      { id, removeKey },
                      {
                        onSuccess: () => {
                          reset();
                          router.push("/");
                        },
                      }
                    );
                  }}
                >
                  {deleteMutation.isPending ? (
                    <LoadingIcon color={"bg-redorange"}/>
                  ) : (
                    "Delete Product"
                  )}
                </Button>
              </div>
              <div className="flex gap-1">
                <Offcanvas
                  title={"Edit Product"}
                  disabled={
                    isPending ||
                    deleteMutation.isPending ||
                    mutation.isPending ||
                    productIsUploading
                  }
                  btnStyle={
                    "bg-black text-white  border-black dark:border-white dark:bg-white dark:text-black rounded-full border-2 text-[10px] md:text-sm px-3  py-1  md:text-sm duration-300  disabled:cursor-not-allowed   "
                  }
                  // className={"right-0  z-50 h-fit w-72 px-3 bg-white border border-lbtn  dark:border-dbtn dark:bg-black"}
                  position={"top-0 right-0"}
                  size={
                    "h-screen max-w-full w-80 border-l-2 border-l-lcard dark:border-l-dcard"
                  }
                  openTransition={"translate-x-0"}
                  closeTransition={"translate-x-full"}
                  onClose={onClose}
                >
                  <div className="flex justify-between mb-5">
                    <h1 className={" text-xl "}>Edit Product</h1>

                    <Button
                      onClick={() => {
                        setOnClose(!onClose);
                      }}
                      variant="close"
                      className="text-lg px-2 py-1"
                      type="button"
                    >
                      <IoClose />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <div className="space-y-2">
                      <button className="text-lg underline underline-offset-2 decoration-2" type="button" onClick={()=>{setProductPictures(product?.images);setProductThumnail(product?.images[0]);setDeletedFiles([])}}>reset Images</button>
                      <p className="text-sm">Thumbnail preview</p>

                    <EmblaCarousel
                      options={{ loop: false, direction: "rtl" }}
                      dot={true}
                      autoScroll={false}
                      length={productPictures.length > 1}
                    >
{productPictures?.map((item, index) => {
  // Get the URL whether it's a string or object
  const imageUrl = typeof item === 'string' ? item : item.url;
  const isSelected = imageUrl === productThumnail;

  return (
    <div
      className="transform translate-x-0 translate-y-0 translate-z-0 flex-none basis-[100%] h-44 min-w-0 pl-4"
      onClick={() => setProductThumnail(imageUrl)}
      key={index}
    >
      <div
        className={`
          rounded-xl w-full h-44 relative cursor-pointer group
          ${isSelected ? "border-dashed border-4 border-black dark:border-white" : ""}
        `}
      >
        <ImageCom
          className="w-full h-full object-cover rounded-xl"
          size="w-full h-full"
          src={imageUrl}
          alt="post thumbnail"
        />

        <button
          onClick={(e) => {
            e.stopPropagation();
            handleRemoveImage(index, imageUrl);
          }}
          type="button"
          className="absolute top-3 right-3 p-2 text-white text-3xl rounded-full z-10 shadow-md bg-black/35 ring-white/30 ring-1 backdrop-blur-sm"
        >
          <IoClose className="text-lg" />
        </button>

        {isSelected && (
          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-xl flex items-center justify-center">
            <h1>
              <FaCheck className="text-5xl text-white" />
            </h1>
          </div>
        )}
      </div>
    </div>
  );
})}
                      <div className="transform translate-x-0 translate-y-0 translate-z-0  flex-none basis-[100%] h-44 min-w-0 pl-4 space-y-2">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            handleAddImage(e.target.files?.[0]);
                          }}
                          ref={fileInputRef}
                          className="hidden sr-only"
                        />

                        <div
                          type="button"
                          className=" w-full "
                          onClick={() => {
                            fileInputRef.current?.click();
                          }}
                        >
                          <div className="flex justify-between text-sm border-4 border-dashed rounded-xl py-5 px-3 cursor-pointer">
                            <div className="my-auto text-xl">
                              <FaPlus />
                            </div>
                            <p>Add Image from your Device</p>
                          </div>
                        </div>

                        <div className="flex gap-2 w-full">
                          <div>
                            <Input
                              type="text"
                              className="w-full"
                              placeholder="add Image with Url"
                              onChange={(e) => {
                                setSelectedInputImage(e.target.value);
                              }}
                              value={selectedInputImage || ""}
                            />
                          </div>
                          <div className="">
                            <button
                              className="bg-black text-white  py-3 px-4 dark:bg-white dark:text-black rounded-lg "
                              type="button"
                              onClick={() => {
                                setImageByUrl(selectedInputImage);
                                setSelectedInputImage("");
                              }}
                            >
                              <FaCheck />
                            </button>
                          </div>
                        </div>
                        {fileError && <p className="text-red">{fileError}</p>}
                      </div>

                    </EmblaCarousel>
                    </div>
                    <p className="text-sm">Title , Tags & desc </p>
                    <div>
                    <TextArea
                      placeholder={"Write Your Post name ..."}
                      name={"name"}
                      type={"text"}
                      ref={register}
                      // watch={watch('title')}
                      label={false}
                      className={
                        "resize-none  bg-lcard dark:bg-dcard rounded-lg placeholder:text-[#000000a4] dark:placeholder:text-lfont text-lg  p-2 focus:ring-2 focus:ring-black dark:focus:ring-white outline-none duration-200"
                      }
                      error={errors?.name?.message}
                      {...register("name")}
                    />
                  </div>

                  <div>
                    <TextArea
                      placeholder={"Write Your Post Description ..."}
                      name={"desc"}
                      type={"text"}
                      label={false}
                      ref={register}
                      className={
                        "resize-none  bg-lcard dark:bg-dcard rounded-lg placeholder:text-[#000000a4] dark:placeholder:text-lfont text-sm  p-2 focus:ring-2 focus:ring-black dark:focus:ring-white outline-none duration-200"
                      }
                      error={errors?.desc?.message}
                      {...register("desc")}
                    />
                  </div>


                    <div>
                      <Button
                        className="rounded-lg  w-full py-2"
                        variant="menuActive"
                        disabled={
                          mutation.isPending ||
                          // isUploading ||
                          productIsUploading
                        }
                        type="submit"
                      >
                        {mutation.isPending || productIsUploading ? (
                          //  mutation.isPending || uploadMutation.isPending
                          <LoadingIcon color={"bg-white dark:bg-black"}/>
                        ) : (
                          "Edit Product"
                        )}
                      </Button>
                    </div>
                  </div>
                </Offcanvas>


              </div>
            </div>

            <div>
              <Button
                className={"text-[10px] md:text-sm px-3 w-full py-1"}
                variant="close"
                onClick={() => setCancel(true)}
                type="button"
              >
                cancel
              </Button>
            </div>
          </div>
        )}

          {cancel && (
        <div className="flex justify-between  py-2 w-full sticky top-0 z-[10]">
            {/* <div className="space-x-2"> */}
              <Button
                className={"px-3 py-1 text-[10px] md:text-sm"}
                variant="close"
                onClick={() => setCancel(false)}
                type="button"
              >
                Continue
              </Button>

              <Button
                className={"text-[10px] md:text-sm px-3  py-1"}
                variant="delete"
                onClick={() => router.back()}
                type="button"
              >
                Cancle and Discard all Changes
              </Button>

            {/* </div> */}
            
        </div>
          )}





        {isPending ? (
          <EditPostLoading />
        ) : (
            <div className="w-full md:w-2/3 mx-auto  space-y-3 ">
            <div className="flex space-x-2">
                <div className="relative  w-9 h-9">
                {product?.seller?.image === null ?
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-redorange to-yellow"></div>
                  :
                  <ImageCom
                  src={
                    product?.seller?.image && product?.seller?.image 
                  }
                  className="h-9 w-9 rounded-lg"
                  alt=""
                  />
                }
                </div>
                <div className="flex flex-col ">
                  <p className="text-sm ">
                    {product?.seller.displayName
                      && product?.seller.displayName}
                  </p>
                  <p className=" text-lfont text-[10px] text-start">
                    {new Date().toLocaleDateString()}
                  </p>
                </div>

              </div>
              <Controller
                name="content"
                control={control}
                render={({ field: { onChange, onBlur, value, name, ref } }) => (
                  <BlockEditor
                    content={value}
                    onChange={onChange}
                    ref={ref}
                    setValue={setValue}
                    ydoc={ydoc}
                    initialContent={value}
                    files={files}
                    setFiles={setFiles}
                    contentImages={contentImages}
                    setContentImage={setContentImages}
                    thumnailIndex={thumnailIndex}
                    setThumnailIndex={setThumnailIndex}
                    // items={items}
                    // setItems={setItems}
                    // hasCollab={hasCollab}
                    // provider={provider}
                  />
                )}
              />

              <div
                className={`text-red mt-2 text-[10px] md:text-sm transition-opacity duration-300  ${
                  errors?.content?.message ? "opacity-100" : "opacity-0"
                }`}
              >
                {errors?.content?.message}
              </div>


              <Dropdown
            className={
              "right-0 bg-white px-2 dark:bg-black border border-lbtn  dark:border-dbtn"
            }
            title={<FaQuestion />}
            btnStyle={
              "bg-black text-white dark:bg-white dark:text-black rounded-full px-3 py-2"
            }
          >
            <div className="flex flex-col space-y-1">
              <input
                type="text"
                className="resize-none block bg-lcard dark:bg-dcard px-2 py-2 rounded-lg focus:outline-none  w-full focus:ring-2 focus:ring-black dark:ring-white   duration-200 "
                placeholder="question"
                value={question}
                onChange={(e) => {
                  setQuestion(e.target.value);
                }}
              />
              <textarea
                type="text"
                className="resize-none block bg-lcard dark:bg-dcard px-2 py-2 rounded-lg focus:outline-none  w-full focus:ring-2 focus:ring-black dark:ring-white   duration-200 "
                placeholder="answer"
                value={answer}
                onChange={(e) => {
                  setAnswer(e.target.value);
                }}
              />
              <button
                type="button"
                className="bg-black text-white rounded-lg w-full py-2 px-3 text-sm dark:bg-white dark:text-black"
                onClick={handleAddFaq}
              >
                {editIndex !== null ? "Update FAQ" : "Add FAQ"}
              </button>
            </div>
          </Dropdown>

          <Dropdown
            className={
              "right-0 bg-white px-2 dark:bg-black border border-lbtn  dark:border-dbtn"
            }
            title={<FaPalette />}
            btnStyle={
              "bg-black text-white dark:bg-white dark:text-black rounded-full px-3 py-2"
            }
          >
            <div className="flex flex-col space-y-1">
              <Input
                name={"price"}
                step="0.01" 
                type={"number"}
                label={false}
                placeholder="Color Price"
                value={colorPrice}
                onChange={(e) => {
                  setColorPrice(e.target.value);
                }}
              />


                    <Input
                      placeholder={"Color Discount"}
                      name={"discount"}
                      type={"number"}
                      step="0.01"
                      min={0}
                      max={100}
                      label={false}
                      value={colorDiscount}
                      onChange={(e)=>{setColorDiscount(e.target.value)}}
                    />

                    <Input
                      placeholder={"Color Stocks"}
                      name={"stocks"}
                      step="0.01"
                      type={"number"}
                      label={false}
                      value={colorStocks}
                      onChange={(e)=>{setColorStocks(e.target.value)}}
                    />
              <Input
                type="text"
                placeholder="Color Name"
                value={colorName}
                onChange={(e) => {
                  setColorName(e.target.value);
                }}
              />

<div className="grid grid-cols-4 gap-2">
                  {predefinedColors.map((color) => (
                    <button
                      key={color.hexCode}
                      type="button"
                      onClick={() => {
                        setColorHex(color.hexCode); setColorName(color.name)
                      }}
                      className={`flex flex-col items-center gap-1 p-2 rounded-lg 
                           'ring-2 ring-black dark:ring-white' 
                           'hover:bg-gray-100 dark:hover:bg-gray-800'
                      `}
                    >
                      <div 
                        className="w-8 h-8 rounded-full border" 
                        style={{ backgroundColor: color.hexCode }}
                      />
                      <span className="text-xs">{color.name}</span>
                    </button>
                  ))}
                </div>

                <div>
                <label className="block text-sm font-medium mb-1">Custom Color</label>
                <Input
                  type="color"
                  value={colorHex}
                  onChange={(e) => setColorHex( e.target.value )}
                  className="w-full h-10"
                />
              </div>
              <button
                type="button"
                className="bg-black text-white rounded-lg w-full py-2 px-3 text-sm dark:bg-white dark:text-black"
                onClick={handleAddColor}
              >
                {editColorIndex !== null ? "Update Color" : "Add Color"}
              </button>
            </div>
          </Dropdown>




            </div>
        )}
      </form>




      <div>
        {faqs?.map((faq, index) => (
          <div key={index} className="flex space-x-2">
            <Accordion menuStyle={"p-4 text-lfont text-sm"} btnStyle={"text-lg sm:text-xl lg:text-2xl"} title={faq.question}>
              {" "}
              <p>{faq.answer}</p>{" "}
            </Accordion>
            <button className="text-red" onClick={() => handleRemoveFaq(index)}>
              <IoClose/>
            </button>
            <button
              className="text-yellow"
              onClick={() => handleEditFaq(index)}
            >
               <IoPencil/>
            </button>
          </div>
        ))}
      </div>

      <div className="w-2/3 flex flex-wrap gap-2 mx-auto items-center my-5">
        {colors?.map((color, index) => (
          <div key={index} className=" bg-lcard dark:bg-dcard p-2 rounded-xl">
            <div className="flex gap-2">
                  <div 
                    className="w-10 h-10 rounded-xl " 
                    style={{ backgroundColor: color.hexCode }}
                  />
<div className="flex flex-col text-sm">
    <p>{color.name}</p>
    {color?.price && (
        <p className={color.discount >=1 && "line-through text-red decoration-red"}>
            {formatPrice(color.price)}
        </p>
    )}
    {color?.price && color?.discount >= 1 && (
        <p >
            {formatPrice(color.price * (1 - color.discount/100))}
        </p>
    )}
</div>
            <button className="bg-lbtn dark:bg-dbtn text-lfont text-[10px] p-1 rounded-lg" onClick={() => handleRemoveColor(index)}>
            <IoClose/>
            </button>
            <button
              className="bg-lbtn dark:bg-dbtn text-lfont text-[10px] p-1 rounded-lg"
              onClick={() => handleEditColor(index)}
            >
              <IoPencil/>
            </button>
            </div>
            <div>
              <p>{color.discount}%</p>
              <p>{color.stocks}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="fixed bottom-10 right-10">
        <div>
          <Darkmode name={false} />
        </div>
      </div>
    </div>
  );
};

export default EditProduct;