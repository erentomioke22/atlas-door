"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import TextArea from "@/components/ui/textArea";
import Dropdown from "@/components/ui/Dropdown";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { postValidation } from "@/lib/validation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { IoClose } from "react-icons/io5";
import { useEditPostMutation } from "@/components/posts/mutations";
import { useDeletePostMutation } from "@/components/posts/mutations";
import LoadingIcon from "@/components/ui/loading/LoadingIcon";
import { BlockEditor } from "@/components/BlockEditor";
import { useMemo } from "react";
import { Doc as YDoc } from "yjs";
import EditPostLoading from "@/components/ui/loading/editPostLoading";
import usePreventNavigation from "@/hook/usePreventNavigation";
import { useUploadThing } from "@/lib/uploadthing";
import EmblaCarousel from "@/components/ui/carousel/carousel";
import { FaImage } from "react-icons/fa6";
import { FaCheck } from "react-icons/fa";
import ImageCom from "@/components/ui/Image";
import Offcanvas from "@/components/ui/offcanvas";
import Button from "@/components/ui/button";
import Darkmode from "@/components/ui/darkmode";
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

interface EditPostRootProps {
  title: string;
  session: Session | null;
}

type FormData = z.infer<typeof postValidation>;

const EditPost: React.FC<EditPostRootProps> = ({ title, session }) => {
  const [dropTag, setDropTag] = useState<string[]>([]);
  const router = useRouter();
  const mutation = useEditPostMutation();
  const deleteMutation = useDeletePostMutation();
  const [files, setFiles] = useState<FileItem[]>([]);
  const [deletedPostFiles, setDeletedPostFiles] = useState<string[]>([]);
  const [deletedFiles, setDeletedFiles] = useState<string[]>([]);
  const [onClose, setOnClose] = useState<boolean>(false);
  const ydoc = useMemo(() => new YDoc(), []);
  const [preventNavigation, setPreventNavigation] = useState<boolean>(false);
  const [editorContent, setEditorContent] = useState<any>();
  const [thumnailIndex, setThumnailIndex] = useState<string | null>(null);
  const [cancel, setCancel] = useState<boolean>(false);

  const setValueForEditor = (name: string, value: unknown) => {
    setValue(name as any, value as any);
  };

  usePreventNavigation(preventNavigation);

  const {
    data: post,
    isPending,
    status,
    error,
  } = useQuery({
    queryKey: ["edit-post", title],
    queryFn: async () => {
      const response = await axios.get(`/api/posts/edit-post/${title}`);
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
      postId: post?.id,
      title: "",
      desc: "",
      images: [],
      rmFiles: [],
      content: "",
      tags: [],
    },
    resolver: zodResolver(postValidation),
  });

  useEffect(() => {
    if (post?.id) {
      setValue("title", post?.title);
      setValue("desc", post?.desc);
      setValue("postId", post?.id);
      setValue("content", post?.content);
      setValue("images", post?.images);
      setValue(
        "tags",
        post?.tags.map((tag: any) => tag.name)
      );
      setThumnailIndex(post?.images[0]);
      setFiles(post.images.map((image: string) => ({ url: image })));
      setDropTag(post?.tags.map((tag: any) => tag.name));
    }
  }, [post?.id]);

  const { startUpload: postUpload, isUploading: postIsUploading } =
    useUploadThing("post", {
      onClientUploadComplete: (data) => {
        toast.success("uploaded successfully!");
      },
      onUploadError: () => {
        throw new Error("error occurred while uploading");
      },
      onUploadBegin: ({}) => {},
    });

  const onSubmit = async (values: FormData) => {
    try {
      setPreventNavigation(true);

      const removeKey = deletedFiles.map((deletedFile: string) => {
        if (typeof deletedFile === "string") {
          return deletedFile.split("/").pop();
        }
        return null;
      });

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
          postId: post?.id ?? "",
          rmFiles: removeKey.filter(Boolean) as string[],
          images: finalImages,
          content: finalContent,
        },
        {
          onSuccess: () => {
            reset();
            setDropTag([]);
            setFiles([]);
            setDeletedFiles([]);
            setPreventNavigation(false);
            setEditorContent(null);
            router.back();
          },
        }
      );
    } catch (err: any) {
      toast.error(err.message || "An error occurred");
    }
  };

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

  if (status === "success" && post?.length <= 0) {
    return (
      <p className="text-center text-destructive h-52 flex flex-col justify-center items-center">
        No posts found. Start following people to see their posts here.
      </p>
    );
  }

  if (status === "error" || post?.error || error) {
    return (
      <p className="text-center text-destructive h-52 flex flex-col justify-center items-center">
        An error occurred while loading posts.!!!
      </p>
    );
  }

  return (
    <div className="container max-w-5xl  xl:max-w-7xl min-h-screen mx-auto px-2 sm:px-5">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-7">
        <div className="flex justify-between  w-full sticky top-0 bg-white dark:bg-black z-[10] py-2 ">
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
                      postIsUploading
                    }
                    variant="delete"
                    className="text-[10px] md:text-sm px-3  py-1"
                    onClick={() => {
                      // const removeKey = deletedPostFiles.map((file: string) => {
                      //   if (typeof file === "string") {
                      //     return file.split("/").pop();
                      //   }
                      //   return null;
                      // });
                      // let id = post?.id;
                      deleteMutation.mutate(
                        {
                          id: post?.id ?? "",
                          removeKey: deletedPostFiles
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
                      "DELETE POST"
                    )}
                  </Button>
                </div>
                <div className="flex gap-1">
                  <Offcanvas
                    title={"EDIT POST"}
                    disabled={
                      isPending ||
                      deleteMutation.isPending ||
                      mutation.isPending ||
                      postIsUploading
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
                      <h1 className={" text-xl "}>Edit Post</h1>

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
                                className="transform translate-x-0 translate-y-0 translate-z-0  flex-none basis-[100%] h-44 min-w-0  pl-2 "
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
                                    alt={" post thumnail"}
                                  />
                                  {url === thumnailIndex && (
                                    <div className="absolute  inset-0 top-0 right-0  text-5xl text-white bg-black bg-opacity-50  rounded-xl flex items-center justify-center">
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
                            <div className="h-full bg-gradient-to-tr p-3 from-lbtn to-lcard dark:from-dbtn dark:to-dcard rounded-xl items-center align-middle justify-center flex flex-col space-y-1 text-lfont text-center">
                              <div className=" text-lg p-3">
                                <FaImage />
                              </div>
                              <p className="text-sm text-black">
                                Add Image to Content and select one of thats
                                Images for your post Thumnail
                              </p>
                              <p className="text-[10px]">
                                Add thumnail is good for visit and craete a
                                popular post
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                      <p className="text-sm">Title , Tags & desc </p>
                      <div>
                        <TextArea
                          placeholder={"Write Your Post Title ..."}
                          // name={"title"}
                          // type={"text"}
                          // ref={register}
                          {...register("title")}
                          label={false}
                          className={
                            "resize-none  bg-lcard dark:bg-dcard rounded-lg placeholder:text-[#000000a4] dark:placeholder:text-lfont text-lg  p-2 focus:ring-2 focus:ring-black dark:focus:ring-white outline-none duration-200"
                          }
                          error={errors?.title?.message}
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
                                    className="bg-transparent ring-0 outline-none w-fit text-wrap disabled:cursor-not-allowed px-1 "
                                  />
                                </li>
                              </ul>
                            </div>
                          }
                          btnStyle={"text-lg w-full"}
                          className={
                            "left-0 -top-44 z-[55] h-44 overflow-auto w-62 rounded-lg bg-white border border-lbtn  dark:border-dbtn dark:bg-black"
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

                      <div>
                        <Button
                          className="rounded-lg  w-full py-2"
                          variant="menuActive"
                          disabled={mutation.isPending || postIsUploading}
                          type="submit"
                        >
                          {mutation.isPending || postIsUploading ? (
                            <LoadingIcon color={"bg-white dark:bg-black"} />
                          ) : (
                            "EDIT POST"
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
          <div className="space-y-4 py-10 ">
            {session && (
              <div className="flex gap-2">
                {post?.user?.image === null ? (
                  <div className="h-9 w-9 rounded-lg bg-gradient-to-tr from-redorange to-yellow"></div>
                ) : (
                  <div className="relative w-9 h-9">
                    <ImageCom
                      className="rounded-lg h-9 w-9 "
                      size={"h-9 w-9"}
                      src={post?.user.image}
                      alt={`${post?.user?.name} avatar`}
                    />
                  </div>
                )}
                <div className="flex flex-col ">
                  <p className=" text-black dark:text-white text-sm">
                    {session?.user?.name}
                  </p>
                  <p className=" text-lfont text-[10px]">
                    {new Date().toLocaleDateString()}
                  </p>
                </div>
              </div>
            )}

            <div>
              <textarea
                placeholder={"Write Your Post Title ..."}
                name="title"
                // type="text"
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
                  setValue={setValueForEditor}
                  files={files}
                  setFiles={setFiles}
                  setEditorContent={setEditorContent}
                  setDeletedFiles={setDeletedFiles}
                  setDeletedPostFiles={setDeletedPostFiles}
                  ydoc={ydoc}
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
          </div>
        )}
      </form>

      <div className="fixed bottom-10 right-10">
        <div>
          <Darkmode name={false} />
        </div>
      </div>
    </div>
  );
};

export default EditPost;
