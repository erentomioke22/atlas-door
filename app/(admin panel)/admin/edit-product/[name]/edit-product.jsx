"use client";

import React, { useState, useRef, useEffect } from "react";
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
import EditPostLoading from "@components/ui/loading/editPostLoading";
import usePreventNavigation from "@hook/usePreventNavigation";
import { useUploadThing } from "@lib/uploadthing";
import EmblaCarousel from "@components/ui/carousel/carousel";
import { FaPlus, FaCheck, FaPalette } from "react-icons/fa6";
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
import { formatPriceFa } from "@lib/utils";
import { IoPencil } from "react-icons/io5";
import { notFound } from "next/navigation";

const EditProduct = ({ name }) => {
  const { data: session } = useSession();
  const router = useRouter();
  const mutation = useEditProductMutation();
  const deleteMutation = useDeleteProductMutation();
  const [files, setFiles] = useState([]);
  const [deletedFiles, setDeletedFiles] = useState([]);
  const [onClose, setOnClose] = useState(false);
  const ydoc = useMemo(() => new YDoc(), []);
  const [preventNavigation, setPreventNavigation] = useState(false);
  const [contentImages, setContentImages] = useState();
  const [thumnailIndex, setThumnailIndex] = useState();
  const [cancel, setCancel] = useState(false);
  const [productThumnail, setProductThumnail] = useState(0);
  const [productPictures, setProductPictures] = useState([]);
  const [editColorIndex, setEditColorIndex] = useState(null);
  const [colors, setColors] = useState([]);
  const [colorName, setColorName] = useState("");
  const [colorHex, setColorHex] = useState("");
  const [colorPrice, setColorPrice] = useState("");
  const [colorDiscount, setColorDiscount] = useState("");
  const [colorStocks, setColorStocks] = useState("");
  const [fileError, setFileError] = useState("");
  const [selectedInputImage, setSelectedInputImage] = useState();
  const fileInputRef = useRef(null);

  if (!session || session?.user.role !== "admin") {
    notFound();
  }

  usePreventNavigation(preventNavigation);

  const predefinedColors = [
    { name: "قرمز", hexCode: "#FF0000" },
    { name: "آبی", hexCode: "#0000FF" },
    { name: "سبز", hexCode: "#00FF00" },
    { name: "زرد", hexCode: "#FFFF00" },
    { name: "مشکی", hexCode: "#000000" },
    { name: "سفید", hexCode: "#FFFFFF" },
    { name: "بنفش", hexCode: "#800080" },
    { name: "نارنجی", hexCode: "#FFA500" },
    { name: "صورتی", hexCode: "#FFC0CB" },
    { name: "قهوه ای", hexCode: "#A52A2A" },
    { name: "خاکستری", hexCode: "#808080" },
    { name: "نقره ای", hexCode: "#C0C0C0" },
    { name: "طلایی", hexCode: "#FFD700" },
    { name: "خاکی", hexCode: "#F0E68C" },
    { name: "شکلاتی", hexCode: "#D2691E" },
    { name: "برنز", hexCode: "#ff5733" },
    { name: "Custom", hexCode: "#00000000" },
  ];

  const {
    data: product,
    isPending,
    fetchNextPage,
    isFetching,
    isFetchingNextPage,
    status,
    error
  } = useQuery({
    queryKey: ["edit-product", name],
    queryFn: async () => {
      const response = await axios.get(`/api/product/edit-product/${name}`);
      return response.data;
    },
  });






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
      rmFiles: [],
      colors: [],
      content: "",
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
      setProductPictures(product?.images);
      setDeletedFiles(product?.images);
    }
  }, [
    product,
    // setValue,
    //  deletedPostFiles
  ]);

  const { startUpload: postUpload, isUploading: productIsUploading } =
    useUploadThing("post", {
      onClientUploadComplete: (data) => {
        toast.success("uploaded successfully!");
        // return data[0].url;
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

      if (filesData.length >= 1) {
        const uploadedData = await postUpload(filesData);
        const newBlobUrlMap = productPictures.map((picture, index) => {
          if (picture.file) {
            return {
              blobUrl: picture.url,
              url: uploadedData.shift()?.url,
            };
          } else {
            return {
              blobUrl: picture || picture.url,
              url: picture || picture.url,
            };
          }
        });

        setProductPictures(newBlobUrlMap);
        if (productThumnail) {
          const allImages = newBlobUrlMap.map((item) => item.url);
          // const thumbnailIndex = productPictures.findIndex(
          const thumbnailIndex = newBlobUrlMap.findIndex(
            (picture) => picture.blobUrl === productThumnail
          );
          if (thumbnailIndex !== -1) {
            // Move thumbnail to the front
            const thumbnailUrl = allImages[thumbnailIndex];
            const remainingImages = allImages.filter(
              (_, index) => index !== thumbnailIndex
            );
            setValue("images", [thumbnailUrl, ...remainingImages]);
          } else {
            setValue("images", allImages);
          }
        }
      } else {
        if (productThumnail) {
          const allImages = productPictures.map((item) => item || item.url);
          const thumbnailIndex = productPictures.findIndex(
            (picture) =>
              picture === productThumnail || picture.url === productThumnail
          );
          if (thumbnailIndex !== -1) {
            const thumbnailUrl = allImages[thumbnailIndex];
            const remainingImages = allImages.filter(
              (_, index) => index !== thumbnailIndex
            );
            const currentImages = [thumbnailUrl, ...remainingImages];
            setValue("images", currentImages);
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
          setProductThumnail(null);
          setDeletedFiles([]);
          setFiles([]);
          router.back();
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
        });
    }
  };

  const handleRemoveImage = (indexToRemove, urlToRemove) => {
    setDeletedFiles((prev) => [...prev, urlToRemove]);
    if (urlToRemove === productThumnail) {
      const remainingImages = productPictures.filter(
        (_, index) => index !== indexToRemove
      );
      setValue("images", remainingImages);

      if (remainingImages.length > 0) {
        const nextImage =
          productPictures[indexToRemove + 1] ||
          productPictures[indexToRemove - 1];
        if (nextImage) {
          const nextImageUrl =
            typeof nextImage === "string" ? nextImage : nextImage.url;
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
        index === editColorIndex
          ? {
              ...color, // preserve id/status
              name: colorName,
              hexCode: colorHex,
              price: colorPrice === "" ? undefined : Number(colorPrice),
              discount: colorDiscount === "" ? 0 : Number(colorDiscount),
              stocks: colorStocks === "" ? 0 : Number(colorStocks),
            }
          : color
      );
      setColors(updatedColor);
      setValue("colors", updatedColor, { shouldValidate: true });
      setEditColorIndex(null);
    } else {
      setColors([
        ...colors,
        {
          name: colorName,
          hexCode: colorHex,
          price: colorPrice === "" ? undefined : Number(colorPrice),
          discount: colorDiscount === "" ? 0 : Number(colorDiscount),
          stocks: colorStocks === "" ? 0 : Number(colorStocks),
        },
      ]);
      setValue(
        "colors",
        [
          ...colors,
          {
            name: colorName,
            hexCode: colorHex,
            price: colorPrice === "" ? undefined : Number(colorPrice),
            discount: colorDiscount === "" ? 0 : Number(colorDiscount),
            stocks: colorStocks === "" ? 0 : Number(colorStocks),
          },
        ],
        {
          shouldValidate: true,
        }
      );
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
    setColorName(color.name);
    setColorHex(color.hexCode);
    setColorPrice(color.price);
    setColorDiscount(color.discount);
    setColorStocks(color.stocks);
    setEditColorIndex(index);
  };



  if (status === "success" && product?.length <= 0) {
    return (
      <p className="text-center text-destructive h-52 flex flex-col justify-center items-center">
        No products found. Start following people to see their product here.
        </p>
    );
  }


  
  if (status === "error" || product?.error || error) {
    return (
      <p className="text-center text-destructive h-52 flex flex-col justify-center items-center">
        An error occurred while loading product.
        </p>
    );
  }


  return (
    <div className="container max-w-5xl  xl:max-w-7xl min-h-screen mx-auto px-2 sm:px-5">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-7">
        <div className="flex justify-between  w-full sticky top-0 bg-white dark:bg-black z-[10] py-2">
          {!cancel ? (
            <>
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
                      <LoadingIcon color={"bg-redorange"} />
                    ) : (
                      "DELETE PRODUCT"
                    )}
                  </Button>
                </div>
                <div className="flex gap-1">
                  <Offcanvas
                    title={"EDIT PRODUCT"}
                    disabled={
                      isPending ||
                      deleteMutation.isPending ||
                      mutation.isPending ||
                      productIsUploading
                    }
                    btnStyle={
                      "bg-black text-white  border-black dark:border-white dark:bg-white dark:text-black rounded-full border-2 text-[10px] md:text-sm px-3  py-1  md:text-sm duration-300  disabled:cursor-not-allowed   "
                    }
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
                        <button
                          className="text-lg underline underline-offset-2 decoration-2"
                          type="button"
                          onClick={() => {
                            setProductPictures(product?.images);
                            setProductThumnail(product?.images[0]);
                            setDeletedFiles(product?.images);
                          }}
                        >
                          reset Images
                        </button>
                        <p className="text-sm">Thumbnail preview</p>

                        <EmblaCarousel
                          options={{ loop: false, direction: "rtl" }}
                          dot={true}
                          autoScroll={false}
                          length={productPictures.length > 1}
                        >
                          {productPictures?.map((item, index) => {
                            const imageUrl =
                              typeof item === "string" ? item : item.url;
                            const isSelected = imageUrl === productThumnail;

                            return (
                              <div
                                className="transform translate-x-0 translate-y-0 translate-z-0 flex-none basis-[100%] h-44 min-w-0 "
                                onClick={() => setProductThumnail(imageUrl)}
                                key={index}
                              >
                                <div
                                  className={`
          rounded-xl w-full h-44 relative cursor-pointer group
          ${
            isSelected
              ? "border-dashed border-4 border-black dark:border-white"
              : ""
          }
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
                            {fileError && (
                              <p className="text-red">{fileError}</p>
                            )}
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
                            <LoadingIcon color={"bg-white dark:bg-black"} />
                          ) : (
                            "EDIT PRODUCT"
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
            </>
          ) : (
            <>
              <Button
                className={"text-[10px] md:text-sm px-3  py-1"}
                variant="delete"
                onClick={() => router.back()}
                type="button"
              >
                Cancle and Discard all Changes
              </Button>
              <Button
                className={"px-3 py-1 text-[10px] md:text-sm"}
                variant="close"
                onClick={() => setCancel(false)}
                type="button"
              >
                Continue
              </Button>
            </>
          )}
        </div>

        {isPending ? (
          <EditPostLoading />
        ) : (
          <div className="  space-y-4 py-10 ">
            <div className="flex gap-2">
              <div className="relative  w-9 h-9">
                {product?.seller?.image === null ? (
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-redorange to-yellow"></div>
                ) : (
                  <ImageCom
                    src={product?.seller?.image}
                    className="h-9 w-9 rounded-lg"
                    alt=""
                  />
                )}
              </div>
              <div className="flex flex-col ">
                <p className="text-sm ">
                  {product?.seller.displayName && product?.seller.displayName}
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
                  onChange={(e) => {
                    setColorDiscount(e.target.value);
                  }}
                />

                <Input
                  placeholder={"Color Stocks"}
                  name={"stocks"}
                  step="0.01"
                  type={"number"}
                  label={false}
                  value={colorStocks}
                  onChange={(e) => {
                    setColorStocks(e.target.value);
                  }}
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
                        setColorHex(color.hexCode);
                        setColorName(color.name);
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
                  <label className="block text-sm font-medium mb-1">
                    Custom Color
                  </label>
                  <Input
                    type="color"
                    value={colorHex}
                    onChange={(e) => setColorHex(e.target.value)}
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

      <div className="flex flex-wrap gap-2 justify-center items-center my-5">
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
                  <p
                    className={
                      color.discount >= 1 &&
                      "line-through text-red decoration-red"
                    }
                  >
                    {formatPriceFa(color.price)}
                  </p>
                )}
                {color?.price && color?.discount >= 1 && (
                  <p>
                    {formatPriceFa(color.price * (1 - color.discount / 100))}
                  </p>
                )}
              </div>
              <button
                className="bg-lbtn dark:bg-dbtn text-lfont text-[10px] p-1 rounded-lg"
                onClick={() => handleRemoveColor(index)}
              >
                <IoClose />
              </button>
              <button
                className="bg-lbtn dark:bg-dbtn text-lfont text-[10px] p-1 rounded-lg"
                onClick={() => handleEditColor(index)}
              >
                <IoPencil />
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
