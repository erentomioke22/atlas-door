"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import TextArea from "@components/ui/TextArea";
import Dropdown from "@components/ui/dropdown";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { postValidation } from "@lib/validation";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { IoClose } from "react-icons/io5";
import { useEditPostMutation } from "@components/posts/mutations";
import { useDeletePostMutation } from "@components/posts/mutations";
import LoadingIcon from "@components/ui/loading/LoadingIcon";
import BlockEditor from "@components/BlockEditor/BlockEditor-root";
import { useMemo } from "react";
import { Doc as YDoc } from "yjs";
import { useSearchParams } from "next/navigation";
import ImageInput from "@components/ui/imageInput";
import EditPostLoading from "@components/ui/loading/editPostLoading";
import usePreventNavigation from "@hook/usePreventNavigation";
import { FaQuestion } from "react-icons/fa";
import NotFound from "@app/(main)/not-found";
import { useUploadThing } from "@lib/uploadthing";
import EmblaCarousel from "@components/ui/carousel/carousel";
import { FaImage } from "react-icons/fa6";
import { FaCheck } from "react-icons/fa";
import ImageCom from "@components/ui/Image";
import Offcanvas from "@components/ui/offcanvas";
import Button from "@components/ui/button";
import Darkmode from "@components/ui/darkmode";
import Accordion from "@components/ui/Accordion";


const EditPostRoot = ({ title }) => {
  const { data: session } = useSession();
  const [dropTag, setDropTag] = useState([]);
  const router = useRouter();
  const mutation = useEditPostMutation();
  const deleteMutation = useDeletePostMutation();
  const [files, setFiles] = useState([]);
  const [deletedPostFiles, setDeletedPostFiles] = useState([]);
  const [deletedFiles, setDeletedFiles] = useState([]);
  const [onClose, setOnClose] = useState(false);
  const ydoc = useMemo(() => new YDoc(), []);
  const [preventNavigation, setPreventNavigation] = useState(false);
  const blobUrlToUploadedUrlMap = [];
  const [editorContent, setEditorContent] = useState();
  const [contentImages, setContentImage] = useState();
  const [thumnailIndex, setThumnailIndex] = useState();
  const [cancel, setCancel] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [answer, setAnswer] = useState("");
  const [question, setQuestion] = useState("");
  const [faqs, setFaqs] = useState([]);
  const [items, setItems] = useState([]);
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

  // console.log(files)
  // console.log(faqs);
  // console.log(deletedPostFiles);
  // console.log(deletedFiles);
  // console.log(dropTag);

  console.log(thumnailIndex);

  const {
    data: post,
    isPending,
    fetchNextPage,
    isFetching,
    isFetchingNextPage,
    status,
    error
  } = useQuery({
    queryKey: ["edit-post", title],
    queryFn: async () => {
      const response = await axios.get(`/api/posts/edit-post/${title}`);
      return response.data;
    },
  });

  console.log(post);

  if (status === "success" && post?.length <= 0) {
    return (
      <p className="text-center text-muted-foreground">
        No posts found. Start following people to see their posts here.
      </p>
    );
  }

  if (status === "error" || post?.error) {
    return (
      <p className="text-center text-destructive">
        An error occurred while loading posts.
      </p>
    );
  }

  if (error) {
    return (
      <p className="text-center text-destructive">
        An error occurred while loading posts.!!!
      </p>
    );
  }

//   useEffect(()=>{
//   if (!session || !post.id) {
//     NotFound();
//   }
// },[session,post?.id])

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
      postId: post?.id,
      title: "",
      desc: "",
      image: "",
      rmfiles: [],
      content: "",
      tags: [],
      files: [],
      faqs: [],
      // faqs:[],
      // tocs:[]
      // contentImages: [],
    },
    resolver: yupResolver(postValidation),
  });

  useEffect(() => {
    if (post?.id) {
      setValue("title", post?.title);
      setValue("desc", post?.desc);
      setValue("postId", post?.id);
      setValue("content", post?.content);
      setValue("image", post?.images[0]);
      setValue("tags",post?.tags.map((tag) => tag.name));
      setDropTag(post?.tags.map((tag) => tag.name));
      setThumnailIndex(post?.images[0]);
      setValue("files", post?.contentImages);
      setFaqs(post?.faqs);
      setValue("faqs", post?.faqs);
      // setContent(post?.content);
      // setValue("contentImages", post?.contentImages);
      // setImageUrl(post?.images[0]);
      // setSelectedImage(post?.images[0]);
      // setDeletedPostFiles((prevFiles) => [...prevFiles, post?.images[0]]);
      // setDeletedPostFiles([...deletedPostFiles, post?.images[0]]);
    }
  }, [
    post?.id,
    // setValue,
    //  deletedPostFiles
  ]);

  // console.log(getValues('tocs'))

  const { startUpload: postUpload, isUploading: postIsUploading } =
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
      setPreventNavigation(true);

      const removeKey = deletedFiles.map((deletedFile) => {
        if (typeof deletedFile === "string") {
          return deletedFile.split("/").pop();
        }
        return null;
      });

      setValue("rmFiles", removeKey.filter(Boolean));

      const filesData = files.map(({ file }) => {
        if (file && typeof file !== "string") {
          const extension = file.name.split(".").pop();
          return new File(
            [file],
            `post_${crypto.randomUUID()}.${extension}.webp`
          );
        }
      });
      if (filesData.length >= 1) {
        const uploadedData = await postUpload(filesData);
        uploadedData.forEach((data, index) => {
          const { url } = files[index];
          const uploadedUrl = data.url;
          blobUrlToUploadedUrlMap.push({ blobUrl: url, uploadedUrl });
        });
      }

      if (thumnailIndex && !thumnailIndex.startsWith("blob:")) {
        setValue("image", thumnailIndex);
      } else {
        const uploadedThumbnail = blobUrlToUploadedUrlMap.find(
          (item) => item.blobUrl === thumnailIndex
        );
        if (uploadedThumbnail) {
          setValue("image", uploadedThumbnail.uploadedUrl);
        }
        updateEditorContentWithUploadedUrls();
      }

      mutation.mutate(values, {
        onSuccess: () => {
          reset();
          setDropTag([]);
          setFiles([]);
          setDeletedFiles([]);
          setPreventNavigation(false);
          setEditorContent(null);
          router.back();
          // setSelectedInputImage(null);
          // setImageUrl("");
          // setSelectedImage(null);
          // setContent(null);
        },
      });
    } catch (err) {
      toast.error(err.message || "An error occurred");
      // console.log(err);
    }
  };

  function updateEditorContentWithUploadedUrls() {
    const editorContents = editorContent.getHTML();
    let updatedContent = editorContents;

    blobUrlToUploadedUrlMap.forEach(({ blobUrl, uploadedUrl }) => {
      updatedContent = updatedContent.replace(
        new RegExp(blobUrl, "g"),
        uploadedUrl
      );
    });

    editorContent.commands.setContent(updatedContent);
    console.log(updatedContent);
    setValue("content", updatedContent);
  }

  const handleAddTag = (newTag) => {
    if (newTag && !dropTag.includes(newTag) && dropTag.length < 4) {
      const addTags = [...dropTag, newTag].filter((tag) => tag);
      setDropTag(addTags);
      setValue("tags", addTags, { shouldValidate: true });
    }
  };

  const handleRemoveTag = (tag) => {
    const removetag = dropTag.filter((t) => t !== tag);
    setDropTag(removetag);
    setValue("tags", removetag);
  };

  function handleTag(name) {
    const existTag = dropTag.includes(name.name);

    if (existTag) {
      const updateTag = dropTag.filter((tag) => tag !== name.name);
      // console.log(updateTag);
      setDropTag(updateTag);
      setValue("tags", updateTag, { shouldValidate: true });
    } else if (dropTag.length < 4) {
      setDropTag([...dropTag, name.name]);
      setValue("tags", [...dropTag, name.name], { shouldValidate: true });
    }
  }

  const handleInputKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const newTag = e.currentTarget.value.trim();
      handleAddTag(newTag);
      e.currentTarget.value = "";
    }
  };



  console.log(contentImages);

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

  const tags = [
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

  return (
    <div className="mb-2 px-2 sm:px-5">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-7">
      
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
                    postIsUploading
                  }
                  variant="delete"
                  className="text-[10px] md:text-sm px-3  py-1"
                  onClick={() => {
                    const removeKey = deletedPostFiles.map((file) => {
                      if (typeof file === "string") {
                        return file.split("/").pop();
                      }
                      return null;
                    });
                    console.log(removeKey);
                    let id = post?.id;
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
                    "Delete Post"
                  )}
                </Button>
              </div>
              <div className="flex gap-1">
                <Offcanvas
                  title={"Edit Post"}
                  disabled={
                    isPending ||
                    deleteMutation.isPending ||
                    mutation.isPending ||
                    postIsUploading
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
                      {/* <ImageInput selectedImage={selectedImage}  setSelectedImage={setSelectedImage} selectedInputImage={selectedInputImage}  setSelectedInputImage={setSelectedInputImage} setValue={setValue} rmThumbnailFile={rmThumbnailFile} setRmThumbnailFile={setRmThumbnailFile}/> */}
                      {/* <div
                                         className={`text-red  text-[10px] md:text-sm transition-opacity duration-300  ${
                                           errors?.image?.message ? "opacity-100" : "opacity-0"
                                         }`}
                                       >
                                         {errors?.image?.message}
                                       </div> */}
                      {contentImages?.length > 0 ? (
                        <EmblaCarousel 
                        options={{ loop: false, direction: "rtl" }}
                        dot={true}
                        autoScroll={false}
                        >
                          {contentImages?.map((url, index) => (
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
                        name={"title"}
                        type={"text"}
                        ref={register}
                        // watch={watch('title')}
                        label={false}
                        className={
                          "resize-none  bg-lcard dark:bg-dcard rounded-lg placeholder:text-[#000000a4] dark:placeholder:text-lfont text-lg  p-2 focus:ring-2 focus:ring-black dark:focus:ring-white outline-none duration-200"
                        }
                        error={errors?.title?.message}
                        {...register("title")}
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
                      <Dropdown
                        title={
                          <div className="flex space-x-5 border-2 border-lbtn dark:border-dbtn p-2 rounded-lg w-full max-h-36 overflow-y-auto text-wrap">
                            <ul
                              className="flex flex-wrap gap-2 text-sm w-full"
                              disabled={dropTag.length === 4}
                            >
                              {dropTag.map((dropTag) => (
                                <li
                                  disabled={dropTag.length === 4}
                                  key={dropTag}
                                  className="bg-lcard px-2 py-1 rounded-lg dark:bg-dcard space-x-2 "
                                  onClick={() => handleRemoveTag(dropTag)}
                                >
                                  <span className="text-lfont">#</span>
                                  {dropTag}{" "}
                                  {/* <span  ><IoClose className="pt-1"/></span> */}
                                </li>
                              ))}
                              <li className="my-auto w-fit">
                                <input
                                  type="text"
                                  placeholder={
                                    dropTag.length < 4
                                      ? "Add up to 4 tags for post..."
                                      : `You can only enter max. of ${4} tags`
                                  }
                                  onKeyDown={handleInputKeyPress}
                                  disabled={dropTag.length === 4}
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
                                onClick={() => handleTag({ name: tag.name })}
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
                        disabled={
                          mutation.isPending ||
                          // isUploading ||
                          postIsUploading
                        }
                        type="submit"
                      >
                        {mutation.isPending || postIsUploading ? (
                          //  mutation.isPending || uploadMutation.isPending
                          <LoadingIcon color={"bg-white dark:bg-black"}/>
                        ) : (
                          "Edit Post"
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







        {isPending ? (
          <EditPostLoading />
        ) : (
            <div className="w-full md:w-2/3 mx-auto  space-y-3 ">
        
            {/* <div className="flex space-x-2">
                <div className="relative  w-9 h-9">
                  <ImageCom
                    src={
                      post?.user?.image && post?.user?.image 
                    }
                    className="h-9 w-9 rounded-lg"
                    alt=""
                  />
                </div>
                <div className="flex flex-col ">
                  <p className="text-sm ">
                    {post?.user.displayName
                      && post?.user.displayName}
                  </p>
                  <p className=" text-lfont text-[10px] text-start">
                    {new Date().toLocaleDateString()}
                  </p>
                </div>

              </div> */}
                      {session && (
            <div className="flex gap-2">
              {/* <div className="relative h-9 w-9">
                <ImageCom
                  src={session?.user.image}
                  className="h-9 w-9 rounded-lg"
                  size={"h-9 w-9"}
                  alt="user Avatar"
                />
              </div> */}
                        {session?.user?.image === null ?
                  <div className="h-9 w-9 rounded-lg bg-gradient-to-tr from-redorange to-yellow"></div>
                  :
                  <ImageCom
                  className="rounded-lg h-9 w-9 "
                  size={"h-9 w-9"}
                  src={
                    session.user?.image === null
                      ? `${process.env.NEXT_PUBLIC_BASE_URL}/images/logo/user-avatar-people-icon-solid-style-icon-design-element-icon-template-background-free-vector.jpg`
                      : `${process.env.NEXT_PUBLIC_BASE_URL}${session.user.image}`
                  }
                  alt={`${session.user?.name} avatar`}
                /> 
                  }
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


<div>
          <textarea
            placeholder={"Write Your Post Title ..."}
            name={"title"}
            type={"text"}
            {...register("title")}
            className={
              "resize-none  bg-transparent   text-2xl  focus:ring-none focus:outline-none ring-0 w-full  border-0 placeholder-black dark:placeholder-white px-2.5"
            }
            error={errors?.title?.message}
          />

            <div className={`text-red mt-2 text-[10px] md:text-sm transition-opacity duration-300 ${errors?.title?.message ? "opacity-100" : "opacity-0"}`}>
              {errors?.title?.message}
            </div>
        </div>

              <Controller
                name="content"
                control={control}
                render={({ field: { onChange, onBlur, value, name, ref } }) => (
                  <BlockEditor
                    initialContent={value}
                    onChange={onChange}
                    ref={ref}
                    setValue={setValue}
                    files={files}
                    setFiles={setFiles}
                    setEditorContent={setEditorContent}
                    setDeletedFiles={setDeletedFiles}
                    deletedFiles={deletedFiles}
                    setDeletedPostFiles={setDeletedPostFiles}
                    deletedPostFiles={deletedPostFiles}
                    ydoc={ydoc}
                    contentImages={contentImages}
                    setContentImage={setContentImage}
                    thumnailIndex={thumnailIndex}
                    setThumnailIndex={setThumnailIndex}
                    items={items}
                    setItems={setItems}
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
            <button className="text-red" type="button" onClick={() => handleRemoveFaq(index)}>
              delete
            </button>
            <button
              className="text-yellow" type="button"
              onClick={() => handleEditFaq(index)}
            >
              {" "}
              Edit{" "}
            </button>
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

export default EditPostRoot;
