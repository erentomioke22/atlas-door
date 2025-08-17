"use client";

import React from "react";
import { useState, useRef } from "react";
import TextArea from "@components/ui/TextArea";
import Dropdown from "@components/ui/dropdown";
import { toast } from "sonner";
import { useSubmitProductMutation } from "@components/products/mutations";
import LoadingIcon from "@components/ui/loading/LoadingIcon";
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from "@hookform/resolvers/yup";
import BlockEditor from "@components/BlockEditor/BlockEditor";
import { useMemo } from "react";
import { Doc as YDoc } from "yjs";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import EmblaCarousel from "@components/ui/carousel/carousel";
import {FaPlus, FaCheck } from "react-icons/fa6";
import ImageCom from "@components/ui/Image";
import Offcanvas from "@components/ui/offcanvas";
import { IoClose } from "react-icons/io5";
import Input from "@components/ui/input";
import * as yup from "yup";
import {
  productValidation,
  imageFileValidation,
  imageUrlValidation,
} from "@lib/validation";
import { useUploadThing } from "@lib/uploadthing";
import { FaPalette } from "react-icons/fa6"; 
import { formatPrice } from "@lib/utils";
import { IoPencil } from "react-icons/io5";
import Darkmode from "@components/ui/darkmode";
import { notFound } from "next/navigation";


const CreateProduct = () => {
  const { data: session } = useSession();
  const [onClose, setOnClose] = useState(false);
  const router = useRouter();
  const [thumnailIndex, setThumnailIndex] = useState(0);
  const [productThumnail, setProductThumnail] = useState(0);
  const [contentImages, setContentImages] = useState([]);
  const [productPictures, setProductPictures] = useState([]);
  const [cancel, setCancel] = useState(false);
  const [editColorIndex, setEditColorIndex] = useState(null);
  const [colors, setColors] = useState([]);
  const [colorName, setColorName] = useState('');
  const [colorHex, setColorHex] = useState('');
  const [colorPrice, setColorPrice] = useState('');
  const [colorDiscount, setColorDiscount] = useState('');
  const [colorStocks, setColorStocks] = useState('');
  const ydoc = useMemo(() => new YDoc(), []);
  const mutation = useSubmitProductMutation();
  const [fileError, setFileError] = useState("");
  const [selectedInputImage, setSelectedInputImage] = useState();
  const [files, setFiles] = useState([]);
  const fileInputRef = useRef(null);



  if (session?.user.role !== "admin") {
    notFound()
  }






  const predefinedColors = [
    { name: 'قرمز', hexCode: '#FF0000' },
    { name: 'آبی', hexCode: '#0000FF' },
    { name: 'سبز', hexCode: '#00FF00' },
    { name: 'زرد', hexCode: '#FFFF00' },
    { name: 'مشکی', hexCode: '#000000' },
    { name: 'سفید', hexCode: '#FFFFFF' },
    { name: 'بنفش', hexCode: '#800080' },
    { name: 'نارنجی', hexCode: '#FFA500' },
    { name: 'صورتی', hexCode: '#FFC0CB' },
    { name: 'قهوه ای', hexCode: '#A52A2A' },
    { name: 'خاکستری', hexCode: '#808080' },
    { name: 'نقره ای', hexCode: '#C0C0C0' },
    { name: 'طلایی', hexCode: '#FFD700' },
    { name: 'خاکی', hexCode: '##F0E68C' },
    { name: 'شکلاتی', hexCode: '##D2691E' },
    { name: 'برنز', hexCode: '###ff5733' },
    { name: 'Custom', hexCode: '#000000' }
  ];

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
      name: "",
      desc: "",
      images: [],
      content: "",
      colors: [],
    },
    resolver: yupResolver(productValidation),
  });





  const { startUpload: postUpload, isUploading: postIsUploading } =
    useUploadThing("post", {
      onClientUploadComplete: (data) => {
        toast.success("uploaded successfully!");
      },
      onUploadError: () => {
        throw new Error("error occurred while uploading");
      },
      onUploadBegin: ({ file }) => {
        // console.log("upload has begun for", file);
      },
    });

  const onSubmit = async (values) => {
    try {
      values.colors = colors;
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
              blobUrl: picture.url,
              url: picture.url, // Keep the original URL
            };
          }
        });

        setProductPictures(newBlobUrlMap);

        // Set the images array with thumbnail as first image
        if (productThumnail) {
          const allImages = newBlobUrlMap.map((item) => item.url);
          const thumbnailIndex = productPictures.findIndex(
            (picture) => picture.url === productThumnail
          );
          if (thumbnailIndex !== -1) {
            // Move thumbnail to the front
            const thumbnailUrl = allImages[thumbnailIndex];
            allImages.splice(thumbnailIndex, 1); // Remove from current position
            setValue("images", [thumbnailUrl, ...allImages]);
          } else {
            setValue("images", allImages);
          }
        }
      }

      mutation.mutate(values, {
        onSuccess: () => {
          reset();
          setColors([]);
          setProductPictures([]);
          // router.back();
          //  setFiles([])
        },
      });
    } catch (err) {
      toast.error(err.message || "An error occurred");
      // console.log(err.message)
    }
  };



  function handleAddImage(file) {
    if (file) {
      const schema = yup.object().shape({
        image: imageFileValidation.fields.image,
      });
      schema
        .validate({ image: file })
        .then(() => {
          setFileError("");
          const url = URL.createObjectURL(file);
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
              const updatedFiles = [...prevFiles, { url }];
              return updatedFiles;
            });
          } else {
            setProductPictures((prevFiles) => {
              const updatedFiles = [...prevFiles, { url }];
              return updatedFiles;
            });
          }
        })
        .catch((err) => {
          setFileError(err.errors[0]);
        });
    }
  };

  const handleRemoveImage = (indexToRemove, urlToRemove) => {
    if (urlToRemove === productThumnail) {
      if (productPictures.length > 1) {
        setProductThumnail(productPictures[1].url);
      }
      setProductPictures((prevImages) =>
        prevImages.filter((_, index) => index !== indexToRemove)
      );
    } else {
      setProductPictures((prevImages) =>
        prevImages.filter((_, index) => index !== indexToRemove)
      );
    }
  };



  const handleAddColor = () => {
    if (!colorName || !colorHex || !colorPrice || colorDiscount === '' || !colorStocks) {
      toast.error("Please fill all color fields");
      return;
    }
  
    const newColor = {
      name: colorName,
      hexCode: colorHex,
      price: parseFloat(colorPrice),
      discount: parseFloat(colorDiscount),
      stocks: parseInt(colorStocks),
    };
  
    if (editColorIndex !== null) {
      const updatedColors = colors.map((color, index) =>
        index === editColorIndex ? newColor : color
      );
      setColors(updatedColors);
      setValue("colors", updatedColors, { shouldValidate: true });
      setEditColorIndex(null);
    } else {
      const updatedColors = [...colors, newColor];
      setColors(updatedColors);
      setValue("colors", updatedColors, { shouldValidate: true });
    }
  
    setColorName("");
    setColorHex("");
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
    setColorName(color.name);
    setColorHex(color.hexCode);
    setColorPrice(color.price);
    setColorDiscount(color.discount);
    setColorStocks(color.stocks);
    setEditColorIndex(index);
  };



  return (
    <div className="mb-2">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-7">
        {!cancel && (
          <div className="flex justify-between  w-full sticky top-0 bg-white dark:bg-black z-[10] py-2 px-2 sm:px-5">
            <div className="">
              <Offcanvas
                title={"Create Product"}
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
                  <h1 className={" text-xl "}>Create Product</h1>

                  <button
                    onClick={() => {
                      setOnClose(!onClose);
                    }}
                    className="  text-lg bg-lcard dark:bg-dcard px-2 py-1  rounded-full border-2 text-lfont"
                    type="button"
                  >
                    <IoClose />
                  </button>
                </div>

                <div className="space-y-2">
                  <div className="space-y-2">
                    <p className="text-sm">Thumbnail preview</p>
                    {/* <ImageInput selectedImage={selectedImage}  setSelectedImage={setSelectedImage} selectedInputImage={selectedInputImage}  setSelectedInputImage={setSelectedInputImage} setValue={setValue} rmThumbnailFile={rmThumbnailFile} setRmThumbnailFile={setRmThumbnailFile}/> */}
                    {/* <div
                                         className={`text-red  text-[10px] md:text-sm transition-opacity duration-300  ${
                                           errors?.image?.message ? "opacity-100" : "opacity-0"
                                         }`}
                                       >
                                         {errors?.image?.message}
                                       </div> */}

                    <EmblaCarousel
                      options={{ loop: false, direction: "rtl" }}
                      dot={true}
                      autoScroll={false}
                    >
                      {productPictures?.map(({ url }, index) => (
                        <div
                          className="transform translate-x-0 translate-y-0 translate-z-0  flex-none basis-[100%] h-44 min-w-0 pl-4 "
                          onClick={() => {
                            setProductThumnail(url);
                          }}
                          key={index}
                        >
                          <div
                            className={`
        ${
          url === productThumnail &&
          "border-dashed border-4 border-black dark:border-white"
        }
        rounded-xl w-full h-44 relative cursor-pointer group
      `}
                          >
                            <ImageCom
                              className="w-full h-full object-cover rounded-xl"
                              size="w-full h-full"
                              src={`${url}`}
                              alt="post thumnail"
                            />

                            <button
                              onClick={(e) => {
                                e.stopPropagation(); // Prevents triggering the thumbnail selection
                                handleRemoveImage(index, url);
                              }}
                              type="button"
                              className="absolute top-3 right-3 p-2 text-white text-3xl rounded-full z-10 shadow-md  bg-black/35 ring-white/30 ring-1 backdrop-blur-sm"
                            >
                              <IoClose className="text-lg" />
                            </button>

                            {url === productThumnail && (
                              <div className="absolute inset-0 bg-black bg-opacity-50 rounded-xl flex items-center justify-center">
                                <h1>
                                  <FaCheck className="text-5xl text-white" />
                                </h1>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}

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
                      {/* {contentImages?.map(({url, index}) => (
                          <div
                            className="transform translate-x-0 translate-y-0 translate-z-0  flex-none basis-[100%] h-44 min-w-0 pl-4 "
                            onClick={() => {
                              setThumnailIndex(url);
                            }}
                            key={index}
                          >
                            <div
                              className={`${
                                url === thumnailIndex &&
                                "border-dashed border-4 border-black dark:border-white "
                              } rounded-xl w-full h-44 relative cursor-pointer`}
                            >
                              <ImageCom
                                className={`  w-full h-full object-cover rounded-xl`}
                                src={`${url}`}
                                alt={"post thumnail"}
                              />
                              {url === thumnailIndex && (
                                <div className="absolute  inset-0 top-0 right-0  text-5xl text-white bg-black bg-opacity-50  rounded-xl flex items-center justify-center">
                                  <h1>
                                    <FaCheck />
                                  </h1>
                                </div>
                              )}
                              <div className="absolute inset-0 right-3 bottom-3 bg-black/30 backdrop-blur-sm">
                                <button 
                                  onClick={() => handleRemoveImage(index)} 
                                  className="bg-transparent text-red  rounded-full">
                                  <FaXmark />
                                  </button>                          
                              </div>
                            </div>
                              </div>
                        ))} */}
                    </EmblaCarousel>

                    <div
            className={`text-red mt-2 text-[10px] md:text-sm transition-opacity duration-300  ${
              errors?.images?.message ? "opacity-100" : "opacity-0"
            }`}
          >
            {errors?.images?.message}
          </div>
                  </div>

                  <p className="text-sm">name , Tags & desc </p>
                  <div>
                    <TextArea
                      placeholder={"Write Your Product name ..."}
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
                      placeholder={"Write Your Product Description ..."}
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



                  <div className=" w-full ">
                    <button
                      className="bg-black rounded-lg text-white dark:bg-white dark:text-black w-full text-sm py-2 disabled:brightness-90 disabled:cursor-not-allowed "
                      disabled={postIsUploading || mutation.isPending}
                      type="submit"
                    >
                      {postIsUploading || mutation.isPending ? (
                        <LoadingIcon
                          color={
                            "bg-white dark:bg-black"
                          }
                        />
                      ) : (
                        "Create Product"
                      )}
                    </button>
                  </div>
                </div>
              </Offcanvas>
            </div>

            <div>
              <button
                className={
                  "bg-lcard text-lfont dark:bg-dcard rounded-full text-[10px] md:text-sm px-3 w-full py-1 border-2 "
                }
                onClick={() => setCancel(true)}
                type="button"
              >
                cancel
              </button>
            </div>
          </div>
        )}
        <div className="flex  px-2 sm:px-5 py-2 w-full sticky top-0 z-[10]">
          {cancel && (
            <div className="flex gap-2">
              <button
                className={
                  "bg-transparent text-redorange text-[10px] md:text-sm px-3  py-1  border-2 rounded-full  "
                }
                onClick={() => router.back()}
                type="button"
              >
                Cancle and delete All data
              </button>

              <button
                className={
                  "bg-lcard text-lfont dark:bg-dcard border-2 rounded-full px-3 py-1 text-[10px] md:text-sm"
                }
                onClick={() => setCancel(false)}
                type="button"
              >
                Continue
              </button>
            </div>
          )}
        </div>

        <div className="w-full md:w-2/3 mx-auto  space-y-3 px-3">
          {session && (
            <div className="flex gap-2">
              <div className="relative h-10 w-10">
                {session?.user?.image === null ? (
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-redorange to-yellow"></div>
                ) : (
                  <ImageCom
                    className="rounded-xl h-10 w-10 "
                    size={"h-10 w-10"}
                    src={session.user.image}
                    alt={`${session.user?.name} avatar`}
                  />
                )}
              </div>
              <div className="flex flex-col ">
                <p className=" text-black dark:text-white text-sm">
                  {session?.user.displayName}
                </p>
                <p className=" text-lfont text-[10px]">
                  {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>
          )}

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
          

          <div
  className={`text-red mt-2 text-[10px] md:text-sm transition-opacity duration-300  ${
    errors?.colors?.message ? "opacity-100" : "opacity-0"
  }`}
>
  {errors?.colors?.message}
</div>



        </div>
      </form>




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

export default CreateProduct;
