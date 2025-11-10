"use client";

import React from "react";
import { useState, useEffect } from "react";
import TextArea from "@/components/ui/TextArea";
import Dropdown from "@/components/ui/Dropdown";
import { toast } from "sonner";
import { useSubmitPostMutation } from "@/components/posts/mutations";
import LoadingIcon from "@/components/ui/loading/LoadingIcon";
import { postValidation } from "@/lib/validation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BlockEditor } from "@/components/BlockEditor";
import { useMemo } from "react";
import { Doc as YDoc } from "yjs";
import usePreventNavigation from "@/hook/usePreventNavigation";
import { useUploadThing } from "@/lib/uploadthing";
import { useRouter } from "next/navigation";
import EmblaCarousel from "@/components/ui/carousel/carousel";
import { FaImage } from "react-icons/fa6";
import { FaCheck } from "react-icons/fa";
import ImageCom from "@/components/ui/Image";
import Offcanvas from "@/components/ui/offcanvas";
import Darkmode from "@/components/ui/darkmode";
import { IoClose } from "react-icons/io5";
import Button from "@/components/ui/button";
import { useDebounce } from "use-debounce";
import type { Session } from "@/lib/auth";
import { z } from "zod";

interface Tag {
  id: string;
  name: string;
  info: string;
}

export interface FileItem {
  file?: File;
  url: string;
  blobUrl?: string;
}

type FormData = z.infer<typeof postValidation>;

const CreatePost = ({ session }: { session: Session | null }) => {
  const [dropTag, setDropTag] = useState<string[]>([]);
  const router = useRouter();
  const [deletedFiles, setDeletedFiles] = useState<string[]>([]);
  const [deletedPostFiles, setDeletedPostFiles] = useState<string[]>([]);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [editorContent, setEditorContent] = useState<any>();
  const [preventNavigation, setPreventNavigation] = useState<boolean>(false);
  const [thumnailIndex, setThumnailIndex] = useState<string | null>(null);
  const [cancel, setCancel] = useState<boolean>(false);
  const [onClose, setOnClose] = useState<boolean>(false);
  const ydoc = useMemo(() => new YDoc(), []);
  const mutation = useSubmitPostMutation();
  usePreventNavigation(preventNavigation);

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
      title: "",
      desc: "",
      images: [],
      content: "",
      tags: [],
      scheduledPublish: "",
    },
    resolver: zodResolver(postValidation),
  });

  const { startUpload: postUpload, isUploading: postIsUploading } =
    useUploadThing("post", {
      onClientUploadComplete: (data) => {
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
      setPreventNavigation(true);

      const filesData: File[] = files
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
        const newBlobUrlMap: FileItem[] = files.map((file) => {
          if (file.file) {
            return {
              blobUrl: file.url,
              url: uploadedData?.shift()?.url!,
            };
          } else {
            return {
              blobUrl: file.url,
              url: file.url,
            };
          }
        });
        setFiles(newBlobUrlMap);
        updateEditorContentWithUploadedUrls(newBlobUrlMap);
        if (thumnailIndex) {
          const allImages = newBlobUrlMap.map((item) => item.url);
          const thumbnailIndex = files.findIndex(
            (file) => file.url === thumnailIndex
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
        if (thumnailIndex) {
          const allImages = files.map((item) => item.url);
          const thumbnailIndex = files.findIndex(
            (file) => file.url === thumnailIndex
          );
          if (thumbnailIndex !== -1) {
            const thumbnailUrl = allImages[thumbnailIndex];
            allImages.splice(thumbnailIndex, 1);
            finalImages = [thumbnailUrl, ...allImages];
          } else {
            finalImages = allImages;
          }
        } else {
          finalImages = files.map((item) => item.url);
        }
      }

      const finalContent = editorContent?.getHTML() || values.content;

      mutation.mutate(
        {
          ...values,
          images: finalImages,
          content: finalContent,
        },
        {
          onSuccess: () => {
            localStorage.removeItem("postDraft");
            setPreventNavigation(false);
            reset();
            setDropTag([]);
            setFiles([]);
            router.back();
          },
        }
      );
    } catch (err: any) {
      toast.error(err.message || "An error occurred");
      setPreventNavigation(false);
    }
  };

  // function updateEditorContentWithUploadedUrls(newBlobUrlMap: any[]) {
  //   if (!editorContent) return;
  //   const editorContents = editorContent.getHTML();
  //   let updatedContent = editorContents;
  //   newBlobUrlMap.forEach(({ blobUrl, url }) => {
  //     updatedContent = updatedContent.replace(new RegExp(blobUrl, "g"), url);
  //   });

  //   editorContent.commands.setContent(updatedContent);
  //   return updatedContent;
  //   // setValue("content", updatedContent);
  // }
  function updateEditorContentWithUploadedUrls(newBlobUrlMap: any[]) {
    if (!editorContent) return;
    const editorContents = editorContent.getHTML();
    let updatedContent = editorContents;
    newBlobUrlMap.forEach(({ blobUrl, url }) => {
      updatedContent = updatedContent.split(blobUrl).join(url);
    });

    editorContent.commands.setContent(updatedContent);
    return updatedContent;
  }
  const handleAddTag = (newTag: string) => {
    if (newTag) {
      if (dropTag.includes(newTag)) {
        handleRemoveTag(newTag);
      } else {
        const addTags = [...dropTag, newTag].filter((tag) => tag);
        setDropTag(addTags);
        setValue("tags", addTags, { shouldValidate: true });
      }
    }
  };

  const handleRemoveTag = (tag: string) => {
    const removetag = dropTag.filter((t) => t !== tag);
    setDropTag(removetag);
    setValue("tags", removetag);
  };

  const handleInputKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const newTag = e.currentTarget.value.trim();
      handleAddTag(newTag);
      e.currentTarget.value = "";
    }
  };

  const tags: Tag[] = [
    {
      id: "1",
      name: "درب اتوماتیک",
      info: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sed, rerum!",
    },
    {
      id: "2",
      name: "کرکره برقی",
      info: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sed, rerum!",
    },
    {
      id: "3",
      name: "جک پارکیگ",
      info: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sed, rerum!",
    },
    {
      id: "4",
      name: "راهبند پارکینگ",
      info: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sed, rerum!",
    },
    {
      id: "5",
      name: "شیشه بالکنی",
      info: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sed, rerum!",
    },
    {
      id: "6",
      name: "پرده برقی",
      info: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sed, rerum!",
    },
    {
      id: "7",
      name: "سایبان برقی",
      info: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sed, rerum!",
    },
    {
      id: "8",
      name: "شیشه سکوریت",
      info: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sed, rerum!",
    },
    {
      id: "9",
      name: "جام بالکن",
      info: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sed, rerum!",
    },
    {
      id: "10",
      name: "لمینت",
      info: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sed, rerum!",
    },
    {
      id: "11",
      name: "آیینه",
      info: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sed, rerum!",
    },
    {
      id: "12",
      name: "upvc",
      info: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sed, rerum!",
    },
  ];

  const content = watch("content");
  const title = watch("title");
  const draftTags = watch("tags");

  const [debouncedContent] = useDebounce(content, 3500);
  const [debouncedTitle] = useDebounce(title, 3500);
  const [debouncedTags] = useDebounce(draftTags, 3500);

  const stripImagesFromContent = (html: string) => {
    if (!html) return "";
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    const images = tempDiv.querySelectorAll("figure");
    images.forEach((img) => img.remove());
    return tempDiv.innerHTML;
  };

  useEffect(() => {
    if (!debouncedContent && !debouncedTitle && !debouncedTags) {
      return;
    }
    if (
      debouncedContent?.length >= 5 ||
      debouncedTitle?.length >= 5 ||
      debouncedTags?.length >= 1
    ) {
      const formValues = getValues();
      const cleanedContent = stripImagesFromContent(formValues.content);

      localStorage.setItem(
        "postDraft",
        JSON.stringify({
          ...formValues,
          content: cleanedContent,
        })
      );
    }
  }, [debouncedContent, debouncedTitle, debouncedTags]);

  useEffect(() => {
    const lastDraftId = localStorage.getItem("lastDraftId");
    const postDraftString = localStorage.getItem("postDraft");
    const postDraft = JSON.parse(postDraftString || "{}");
    setValue("title", postDraft?.title);
    setValue("desc", postDraft?.desc);
    setValue("content", postDraft?.content);
    setValue("tags", postDraft?.tags || []);
    setDropTag(postDraft?.tags || []);
    if (lastDraftId) {
      // Redirect to the same page with the draft ID
    }
  }, []);

  return (
    <div className="container max-w-5xl  xl:max-w-7xl min-h-screen mx-auto px-2 sm:px-5">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-7">
        <div className="flex justify-between  w-full sticky top-0 bg-white dark:bg-black z-10 py-2 ">
          {!cancel ? (
            <>
              <Offcanvas
                title={"CREATE POST"}
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
                  <h1 className={" text-xl "}>Create Post</h1>

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

                    {files?.length > 0 ? (
                      <EmblaCarousel
                        options={{ loop: false, direction: "rtl" }}
                        dot={true}
                        autoScroll={false}
                      >
                        {files?.map(({ url }, index) => (
                          <div
                            className="transform translate-x-0 translate-y-0 translate-z-0  flex-none basis-full h-44 min-w-0  pl-2 "
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
                                className={`w-full h-full object-cover rounded-xl`}
                                src={`${url}`}
                                alt={"post thumnail"}
                              />
                              {url === thumnailIndex && (
                                <div className="absolute  inset-0 top-0 right-0  text-5xl text-white bg-black opacity-50  rounded-xl flex items-center justify-center">
                                  <h1>
                                    <FaCheck />
                                  </h1>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </EmblaCarousel>
                    ) : (
                      <div className="relative block w-full">
                        <div className="h-full bg-linear-to-tr p-3 from-lbtn to-lcard dark:from-dbtn dark:to-dcard rounded-xl items-center align-middle justify-center flex flex-col space-y-1 text-lfont text-center">
                          <div className=" text-lg p-3">
                            <FaImage />
                          </div>
                          <p className="text-sm text-black">
                            Add Image to Content and select one of thats Images
                            for your post Thumnail
                          </p>
                          <p className="text-[10px]">
                            Add thumnail is good for visit and craete a popular
                            post
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                  <p className="text-sm">Title , Tags & desc </p>
                  <div>
                    <TextArea
                      placeholder={"Write Your Post Title ..."}
                      {...register("title")}
                      label={false}
                      // title={"title"}
                      // type={"text"}
                      // ref={register}
                      className={
                        "resize-none  bg-lcard dark:bg-dcard rounded-lg placeholder:text-[#000000a4] dark:placeholder:text-lfont text-lg  p-2 focus:ring-2 focus:ring-black dark:focus:ring-white outline-none duration-200"
                      }
                      error={errors?.title?.message}
                    />
                  </div>

                  <div>
                    <TextArea
                      placeholder={"Write Your Post Description ..."}
                      label={false}
                      // name={"desc"}
                      // type={"text"}
                      // ref={register}
                      className={
                        "resize-none  bg-lcard dark:bg-dcard rounded-lg placeholder:text-[#000000a4] dark:placeholder:text-lfont text-sm  p-2 focus:ring-2 focus:ring-black dark:focus:ring-white outline-none duration-200"
                      }
                      error={errors?.desc?.message}
                      {...register("desc")}
                    />
                  </div>

                  <div>
                    <Dropdown
                      title={
                        <div className="flex space-x-5 border-2 border-lbtn dark:border-dbtn p-2 rounded-lg w-full max-h-36 overflow-y-auto text-wrap">
                          <ul
                            className="flex flex-wrap gap-2 text-sm w-full"
                            // disabled={dropTag.length === 4}
                          >
                            {dropTag.map((dropTag) => (
                              <li
                                // disabled={dropTag.length === 4}
                                key={dropTag}
                                className="bg-lcard px-2 py-1 rounded-lg dark:bg-dcard space-x-2 "
                                onClick={() => handleRemoveTag(dropTag)}
                              >
                                <span className="text-lfont">#</span>
                                {dropTag}{" "}
                              </li>
                            ))}
                            <li className="my-auto w-fit">
                              <input
                                type="text"
                                placeholder="Add up to 4 tags for post..."
                                onKeyDown={handleInputKeyPress}
                                className="bg-transparent ring-0 outline-none w-fit text-wrap disabled:cursor-not-allowed px-1 text-sm"
                              />
                            </li>
                          </ul>
                        </div>
                      }
                      btnStyle={"text-lg w-full"}
                      className={
                        "left-0 -top-44 z-55 h-44 overflow-auto w-62 rounded-lg bg-white border border-lbtn  dark:border-dbtn dark:bg-black"
                      }
                    >
                      <div className="  text-start px-2 text-sm space-y-2">
                        {tags.map((tag) => {
                          return (
                            <div
                              key={tag.name}
                              onClick={() => handleAddTag(tag.name)}
                              className={` ${
                                dropTag.includes(tag.name)
                                  ? "bg-black dark:bg-white text-white dark:text-black"
                                  : "hover:bg-lcard dark:hover:bg-dcard text-black dark:text-white"
                              }  uppercase rounded-lg duration-500 px-3 py-1 cursor-pointer`}
                            >
                              <p>{tag.name}</p>
                              <p
                                className={` 
                                                     text-lfont
                                                  text-[10px] line-clamp-2`}
                              >
                                {tag.info}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </Dropdown>

                    <div
                      className={`text-red  text-[10px] md:text-sm transition-opacity duration-300  ${
                        errors?.tags?.message ? "opacity-100" : "opacity-0"
                      }`}
                    >
                      {errors?.tags?.message}
                    </div>
                  </div>

                  <Button
                    variant="menuActive"
                    className="rounded-lg w-full text-sm py-2"
                    disabled={mutation.isPending || postIsUploading}
                    type="submit"
                  >
                    {mutation.isPending || postIsUploading ? (
                      <LoadingIcon color={"bg-white dark:bg-black"} />
                    ) : (
                      "CRAETE POST"
                    )}
                  </Button>
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

        <div className="  py-10 space-y-4 ">
          {session && (
            <div className="flex gap-2">
              {session?.user?.image === null ? (
                <div className="h-9 w-9 rounded-xl bg-linear-to-tr from-redorange to-yellow"></div>
              ) : (
                <div className="relative h-9 w-9">
                  <ImageCom
                    className="rounded-xl h-9 w-9 "
                    src={session?.user?.image ?? ""}
                    alt={`${
                      session.user?.displayName || session?.user?.name || ""
                    } avatar`}
                  />
                </div>
              )}
              <div className="flex flex-col ">
                <p className=" text-black dark:text-white text-sm">
                  {session?.user?.displayName || session?.user?.name || ""}
                </p>
                <p className=" text-lfont text-[10px]">
                  {new Date().toLocaleDateString("en-US")}
                </p>
              </div>
            </div>
          )}

          <div>
            <textarea
              placeholder={"Write Your Post Title ..."}
              name="title"
              className={
                "resize-none  bg-transparent   text-2xl  focus:ring-none focus:outline-none ring-0 w-full  border-0 placeholder-black dark:placeholder-white px-2.5"
              }
              onChange={(e) => {
                setValue("title", e.target.value);
              }}
              value={getValues("title")}
            />
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
                // setThumnailIndex={(url) => setThumnailIndex(url == null ? null : String(url))}
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
        </div>
      </form>
      <div className="fixed bottom-10 right-10">
        <div>
          <Darkmode name={false} />
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
