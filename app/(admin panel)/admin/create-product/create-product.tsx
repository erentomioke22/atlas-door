"use client";

import React from "react";
import { useState, useRef, useEffect } from "react";
import TextArea from "@/components/ui/textarea";
import Dropdown from "@/components/ui/Dropdown";
import { toast } from "sonner";
import { useSubmitProductMutation } from "@/components/products/mutations";
import LoadingIcon from "@/components/ui/loading/LoadingIcon";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BlockEditor } from "@/components/BlockEditor";
import { useMemo } from "react";
import { Doc as YDoc } from "yjs";
import { useRouter } from "next/navigation";
import EmblaCarousel from "@/components/ui/carousel/carousel";
import { FaPlus, FaCheck } from "react-icons/fa6";
import ImageCom from "@/components/ui/Image";
import Offcanvas from "@/components/ui/offcanvas";
import { IoClose } from "react-icons/io5";
import Input from "@/components/ui/input";
import {
  productValidation,
  imageFileValidation,
  imageUrlValidation,
} from "@/lib/validation";
import { useUploadThing } from "@/lib/uploadthing";
import { FaPalette } from "react-icons/fa6";
import { formatPriceFa } from "@/lib/utils";
import { IoPencil } from "react-icons/io5";
import Darkmode from "@/components/ui/darkmode";
import { useDebounce } from "use-debounce";
import Button from "@/components/ui/Button";
import type { Session } from "@/lib/auth";
import { z } from "zod";

interface Color {
  name: string;
  hexCode: string;
  price: number;
  discount: number;
  stocks: number;
}

interface ProductPicture {
  file?: File;
  url: string;
}

interface PredefinedColor {
  name: string;
  hexCode: string;
}

export interface FileItem {
  file?: File;
  url: string;
  blobUrl?: string;
}

type FormData = z.infer<typeof productValidation>;

const CreateProduct = ({ session }: { session: Session | null }) => {
  const [onClose, setOnClose] = useState<boolean>(false);
  const router = useRouter();
  const [editorContent, setEditorContent] = useState<any>();
  const [deletedFiles, setDeletedFiles] = useState<string[]>([]);
  const [deletedPostFiles, setDeletedPostFiles] = useState<string[]>([]);
  const [thumnailIndex, setThumnailIndex] = useState<string | null>(null);
  const [productThumnail, setProductThumnail] = useState<string | number>(0);
  const [productPictures, setProductPictures] = useState<ProductPicture[]>([]);
  const [cancel, setCancel] = useState<boolean>(false);
  const [editColorIndex, setEditColorIndex] = useState<number | null>(null);
  const [colors, setColors] = useState<Color[]>([]);
  const [colorName, setColorName] = useState<string>("");
  const [colorHex, setColorHex] = useState<string>("");
  const [colorPrice, setColorPrice] = useState<string>("");
  const [colorDiscount, setColorDiscount] = useState<string>("");
  const [colorStocks, setColorStocks] = useState<string>("");
  const ydoc = useMemo(() => new YDoc(), []);
  const mutation = useSubmitProductMutation();
  const [fileError, setFileError] = useState<string>("");
  const [selectedInputImage, setSelectedInputImage] = useState<string>("");
  const [files, setFiles] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const predefinedColors: PredefinedColor[] = [
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
    { name: "Custom", hexCode: "#0000" },
  ];

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
    setValue,
    getValues,
    watch,
  } = useForm<FormData>({
    defaultValues: {
      name: "",
      desc: "",
      images: [],
      content: "",
      colors: [],
    },
    resolver: zodResolver(productValidation),
  });

  const { startUpload: postUpload, isUploading: postIsUploading } =
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
          const pictureUrl =
            typeof picture === "string" ? picture : picture.url;
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
          const allImages = productPictures.map((picture) =>
            typeof picture === "string" ? picture : picture.url
          );
          const thumbnailIndex = productPictures.findIndex((picture) =>
            typeof picture === "string"
              ? picture === productThumnail
              : picture.url === productThumnail
          );
          if (thumbnailIndex !== -1) {
            const thumbnailUrl = allImages[thumbnailIndex];
            allImages.splice(thumbnailIndex, 1);
            finalImages = [thumbnailUrl, ...allImages];
          } else {
            finalImages = allImages;
          }
        } else {
          finalImages = productPictures.map((picture) =>
            typeof picture === "string" ? picture : picture.url
          );
        }
      }

      mutation.mutate(
        { ...values, images: finalImages },
        {
          onSuccess: () => {
            localStorage.removeItem("productDraft");
            reset();
            setColors([]);
            setProductPictures([]);
            router.back();
            setFiles([]);
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
      } else {
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
      } else {
        setFileError(result.error.issues[0]?.message || "Invalid URL");
      }
    }
  };

  const handleRemoveImage = (indexToRemove: number, urlToRemove: string) => {
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
    if (
      !colorName ||
      !colorHex ||
      !colorPrice ||
      colorDiscount === "" ||
      !colorStocks
    ) {
      toast.error("Please fill all color fields");
      return;
    }

    const newColor: Color = {
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

  const content = watch("content");
  const name = watch("name");
  const draftColors = watch("colors");

  const [debouncedContent] = useDebounce(content, 3500);
  const [debouncedName] = useDebounce(name, 3500);
  const [debouncedColor] = useDebounce(draftColors, 3500);

  const stripImagesFromContent = (html: string) => {
    if (!html) return "";
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    const images = tempDiv.querySelectorAll("figure");
    images.forEach((img) => img.remove());
    return tempDiv.innerHTML;
  };

  useEffect(() => {
    if (!debouncedContent && !debouncedName && !debouncedColor) {
      return;
    }
    if (
      debouncedContent?.length >= 5 ||
      debouncedName?.length >= 5 ||
      debouncedColor?.length >= 1
    ) {
      const formValues = getValues();
      const cleanedContent = stripImagesFromContent(formValues.content);

      localStorage.setItem(
        "productDraft",
        JSON.stringify({
          ...formValues,
          content: cleanedContent,
        })
      );
    }
  }, [debouncedContent, debouncedName, debouncedColor]);

  useEffect(() => {
    const lastDraftId = localStorage.getItem("lastDraftId");
    const productDraftString = localStorage.getItem("productDraft");
    const productDraft = JSON.parse(productDraftString || "{}");
    setValue("name", productDraft?.name);
    setValue("desc", productDraft?.desc);
    setValue("content", productDraft?.content);
    setValue("colors", productDraft?.colors || []);
    setColors(productDraft?.colors || []);
    if (lastDraftId) {
      // Redirect to the same page with the draft ID
    }
  }, []);

  return (
    <div className="container max-w-5xl  xl:max-w-7xl min-h-screen mx-auto px-2 sm:px-5">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-7">
        <div className="flex justify-between  w-full sticky top-0 bg-white dark:bg-black z-[10] py-2 ">
          {!cancel ? (
            <>
              <Offcanvas
                title={"CREATE PRODUCT"}
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
                  <h1 className={" text-xl "}>Create Product</h1>

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
                    <p className="text-sm">Thumbnail preview</p>

                    <EmblaCarousel
                      options={{ loop: false, direction: "rtl" }}
                      dot={true}
                      autoScroll={false}
                    >
                      {productPictures?.map(({ url }, index) => (
                        <div
                          className="transform translate-x-0 translate-y-0 translate-z-0  flex-none basis-[100%] h-44 min-w-0 pl-2 "
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
                                e.stopPropagation();
                                handleRemoveImage(index, url);
                              }}
                              aria-label="remove image"
                              title="remove image"
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
                              arial-label="set image by url"
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
                        {fileError && <p className="text-red">{fileError}</p>}
                      </div>
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
                      placeholder={"Write Your Product Description ..."}
                      // name={"desc"}
                      // type={"text"}
                      label={false}
                      // ref={register}
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
                        <LoadingIcon color={"bg-white dark:bg-black"} />
                      ) : (
                        "CREATE PRODUCT"
                      )}
                    </button>
                  </div>
                </div>
              </Offcanvas>

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
                variant={"delete"}
                onClick={() => router.back()}
                type="button"
              >
                Cancle and delete All data
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

        <div className="space-y-4 py-10">
          {session && (
            <div className="flex gap-2">
              <div className="relative h-10 w-10">
                {session?.user?.image === null ? (
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-redorange to-yellow"></div>
                ) : (
                  <ImageCom
                    className="rounded-xl h-10 w-10 "
                    size={"h-10 w-10"}
                    src={session?.user?.image ?? ""}
                    alt={`${
                      session.user?.displayName || session?.user?.name
                    } avatar`}
                  />
                )}
              </div>
              <div className="flex flex-col ">
                <p className=" text-black dark:text-white text-sm">
                  {session?.user?.displayName || session?.user?.name}
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

          <div
            className={`text-red mt-2 text-[10px] md:text-sm transition-opacity duration-300  ${
              errors?.colors?.message ? "opacity-100" : "opacity-0"
            }`}
          >
            {errors?.colors?.message}
          </div>
        </div>
      </form>

      <div className="flex flex-wrap gap-2  items-center my-5">
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
                aria-label="remove color"
                title="remove color"
                className="bg-lbtn dark:bg-dbtn text-lfont text-[10px] p-1 rounded-lg"
                onClick={() => handleRemoveColor(index)}
              >
                <IoClose />
              </button>
              <button
                aria-label="edit color"
                title="edit color"
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

export default CreateProduct;
