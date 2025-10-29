"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import TextArea from "@/components/ui/Textarea";
import Dropdown from "@/components/ui/Dropdown";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { IoClose } from "react-icons/io5";
import { useEditProductMutation } from "@/components/products/mutations";
import { useDeleteProductMutation } from "@/components/products/mutations";
import LoadingIcon from "@/components/ui/loading/LoadingIcon";
import { BlockEditor } from "@/components/BlockEditor";
import { useMemo } from "react";
import { Doc as YDoc } from "yjs";
import EditPostLoading from "@/components/ui/loading/editPostLoading";
import usePreventNavigation from "@/hook/usePreventNavigation";
import { useUploadThing } from "@/lib/uploadthing";
import EmblaCarousel from "@/components/ui/carousel/carousel";
import { FaPlus, FaCheck, FaPalette } from "react-icons/fa6";
import ImageCom from "@/components/ui/Image";
import Offcanvas from "@/components/ui/offcanvas";
import Button from "@/components/ui/Button";
import Darkmode from "@/components/ui/darkmode";
import Input from "@/components/ui/input";
import type { Session } from "@/lib/auth";
import { z } from "zod";
import {
  productValidation,
  imageFileValidation,
  imageUrlValidation,
} from "@/lib/validation";
import { formatPriceFa } from "@/lib/utils";
import { IoPencil } from "react-icons/io5";

interface EditProductProps {
  name: string;
  session:Session | null;
}

interface Color {
  name: string;
  hexCode: string;
  price: number;
  discount: number;
  stocks: number;
}



export interface FileItem {
  file?: File;
  url: string;
  blobUrl?: string;
} 
type FormData = z.infer<typeof productValidation>;

const EditProduct: React.FC<EditProductProps> = ({ name , session}) => {
  const router = useRouter();
  const mutation = useEditProductMutation();
  const deleteMutation = useDeleteProductMutation();
  const [files, setFiles] = useState<FileItem[]>([]);
  const [deletedFiles, setDeletedFiles] = useState<string[]>([]);
  const [onClose, setOnClose] = useState<boolean>(false);
  const ydoc = useMemo(() => new YDoc(), []);
  const [preventNavigation, setPreventNavigation] = useState<boolean>(false);
  const [deletedPostFiles, setDeletedPostFiles] = useState<string[]>([]);
  const [editorContent, setEditorContent] = useState<any>();
  const [thumnailIndex, setThumnailIndex] = useState<string | null>(null);
  const [cancel, setCancel] = useState<boolean>(false);
  const [productThumnail, setProductThumnail] = useState<string | null>(null);
  const [productPictures, setProductPictures] = useState<FileItem[]>([]);
  const [editColorIndex, setEditColorIndex] = useState<number | null>(null);
  const [colors, setColors] = useState<Color[]>([]);
  const [colorName, setColorName] = useState<string>("");
  const [colorHex, setColorHex] = useState<string>("");
  const [colorPrice, setColorPrice] = useState<string>("");
  const [colorDiscount, setColorDiscount] = useState<string>("");
  const [colorStocks, setColorStocks] = useState<string>("");
  const [fileError, setFileError] = useState<string>("");
  const [selectedInputImage, setSelectedInputImage] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);


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
    // fetchNextPage,
    // isFetching,
    // isFetchingNextPage,
    status,
    error,
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
  } = useForm<FormData>({
    defaultValues: {
      productId: product?.id,
      name: "",
      desc: "",
      images: [],
      rmFiles: [],
      colors: [],
      content: "",
    },
    resolver: zodResolver(productValidation),
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
  }, [product]);

  const { startUpload: postUpload, isUploading: productIsUploading } =
    useUploadThing("post", {
      onClientUploadComplete: (data: any) => {
        toast.success("uploaded successfully!");
      },
      onUploadError: () => {
        throw new Error("error occurred while uploading");
      },
      onUploadBegin: () => {},
    });

  const setValueForEditor = (name: string, value: unknown) => {
    setValue(name as any, value as any);
  };

  const onSubmit = async (values: FormData) => {
    try {
      const removeKey = deletedFiles.map((deletedFile) => {
        if (typeof deletedFile === "string") {
          return deletedFile.split("/").pop();
        }
        return null;
      });


      const filesData: File[] = productPictures
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
        .filter((f): f is File => f !== null);
      
      let finalImages: string[] = [];

      if (filesData.length >= 1) {
        const uploadedData = await postUpload(filesData);
        if (!uploadedData || uploadedData.length === 0) {
          throw new Error("Upload failed - no data returned");
        }
        const newBlobUrlMap: FileItem[] = productPictures.map((picture) => {
          const pictureUrl = typeof picture === 'string' ? picture : picture.url;
          if (picture.file) {
            return {
              blobUrl: picture.url,
              url: uploadedData?.shift()?.url || picture.url,
            };
          } else {
            return {
              blobUrl: pictureUrl,
              url: pictureUrl,
            };
          }
        });

        setProductPictures(newBlobUrlMap);
      
        if (productThumnail) {
          const allImages = newBlobUrlMap.map((item) => item.url);
          const thumbnailIndex = productPictures.findIndex(
            (picture) => picture.url === productThumnail
          );
          if (thumbnailIndex !== -1) {
            const thumbnailUrl = allImages[thumbnailIndex];
            allImages.splice(thumbnailIndex, 1);
            finalImages = [thumbnailUrl, ...allImages];
          } else {
            finalImages = allImages;
          }
        }
      } else {
        if (productThumnail) {
          const allImages = productPictures.map(picture =>  typeof picture === 'string' ? picture : picture.url);
          const thumbnailIndex = productPictures.findIndex(
            (picture) =>  typeof picture === 'string' ?  picture === productThumnail : picture.url === productThumnail 
          );
          console.log(productPictures,allImages,thumbnailIndex)
          if (thumbnailIndex !== -1) {
            const thumbnailUrl = allImages[thumbnailIndex];
            allImages.splice(thumbnailIndex, 1);
            finalImages = [thumbnailUrl, ...allImages];
           console.log(finalImages)

          } else {
            finalImages = allImages;
          }
        } else {
          finalImages = productPictures.map(picture => typeof picture === 'string' ? picture : picture.url);
        }
      }
      mutation.mutate(
        {
          ...values,
          productId: product?.id ?? "",
          rmFiles: removeKey.filter(Boolean) as string[],
          images: finalImages,
        },
        {
          onSuccess: () => {
            reset();
            setColors([]);
            setProductPictures([]);
            setProductThumnail(null);
            setDeletedFiles([]);
            setFiles([]);
            router.back();
          },
        }
      );
    } catch (err: any) {
      toast.error(err.message || "An error occurred");
    }
  };

  function handleAddImage(file: File | null) {
    if (file) {
      const result = imageFileValidation.safeParse({ image: file });
      if (result.success) {
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
        }
        else {
          setFileError(result.error.issues[0]?.message || "Invalid URL");
        }
    }
  }

  const setImageByUrl = (url: string) => {
    if (url) {
    const result = imageUrlValidation.safeParse({ image: url });
      if (result.success) {
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
        }
        else {
          setFileError(result.error.issues[0]?.message || "Invalid URL");
        }
    }
  };

  const handleRemoveImage = (indexToRemove: number, urlToRemove: string) => {
    setDeletedFiles((prev) => [...prev, urlToRemove]);
    if (urlToRemove === productThumnail) {
      const remainingImages = productPictures
        .filter((_, index) => index !== indexToRemove)
        .map((item) => item.url);
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
              ...color,
              name: colorName,
              hexCode: colorHex,
              price: colorPrice === "" ? 0 : Number(colorPrice),
              discount: Number(colorDiscount) || 0,
              stocks: Number(colorStocks) || 0,
            }
          : color
      );
      setColors(updatedColor);
      setValue("colors", updatedColor, { shouldValidate: true });
      setEditColorIndex(null);
    } else {
      const newColor = {
        name: colorName,
        hexCode: colorHex,
        price: colorPrice === "" ? 0 : Number(colorPrice),
        discount: Number(colorDiscount) || 0,
        stocks: Number(colorStocks) || 0,
      };
      setColors([...colors, newColor]);
      setValue("colors", [...colors, newColor], { shouldValidate: true });
    }
    setColorHex("");
    setColorName("");
    setColorPrice("");
    setColorDiscount("");
    setColorStocks("");
  };


  const handleRemoveColor = (index: number) => {
    const removeColor = colors.filter((_, i) => i !== index);
    setColors(removeColor);
    setValue("colors", removeColor);
    setEditColorIndex(null);
  };

  const handleEditColor = (index: number) => {
    const color = colors[index];
    setColorName(color.name);
    setColorHex(color.hexCode);
    setColorPrice(color.price.toString());
    setColorDiscount(color.discount.toString());
    setColorStocks(color.stocks.toString());
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
                      // const removeKey = deletedFiles.map((file) => {
                      //   if (typeof file === "string") {
                      //     return file.split("/").pop();
                      //   }
                      //   return null;
                      // });
                      // let id = product?.id;
                      deleteMutation.mutate(
                        {
                          id: product?.id ?? "",
                          removeKey: deletedFiles
                            .map((file: string) => {
                              if (typeof file === "string") {
                                return file.split("/").pop();
                              }
                              return null;
                            })
                            .filter((f): f is string => f !== null) as string[],
                        },
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
                                    aria-label="remove image"
                                    title="remove image"
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
                                handleAddImage(e.target.files?.[0] || null);
                              }}
                              ref={fileInputRef}
                              className="hidden sr-only"
                              aria-label="add image"
                            />

                            <div
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
                                  aria-label="set image by url"
                                  title="set image by url"
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
                          // name={"name"}
                          // type={"text"}
                          // ref={register}
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
                          // name={"desc"}
                          // type={"text"}
                          // ref={register}
                          label={false}
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
                          disabled={mutation.isPending || productIsUploading}
                          type="submit"
                        >
                          {mutation.isPending || productIsUploading ? (
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
                  Cancel
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
                  {product?.seller.displayName && product?.seller.name}
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
                  initialContent={value}
                  onChange={onChange}
                  // ref={ref}
                  ydoc={ydoc}
                  files={files}
                  setFiles={setFiles}
                  setEditorContent={setEditorContent}
                  setDeletedFiles={setDeletedFiles}
                  setDeletedPostFiles={setDeletedPostFiles}
                  setValue={setValueForEditor}
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
                      color.discount >= 1
                        ? "line-through text-red decoration-red"
                        : ""
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
                aria-label="remove color"
                title="remove color"
              >
                <IoClose />
              </button>
              <button
                className="bg-lbtn dark:bg-dbtn text-lfont text-[10px] p-1 rounded-lg"
                onClick={() => handleEditColor(index)}
                aria-label="edit color"
                title="edit color"
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
