"use client";

import React from "react";
import { useState,useEffect } from "react";
import TextArea from "@components/ui/TextArea";
import Dropdown from "@components/ui/dropdown";
import { toast } from "sonner";
import {
  useSubmitPostMutation,
  useSavePostMutation,
} from "@components/posts/mutations";
import LoadingIcon from "@components/ui/loading/LoadingIcon";
import { postValidation } from "@lib/validation";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import BlockEditor from "@components/BlockEditor/BlockEditor";
import { useMemo } from "react";
import { Doc as YDoc } from "yjs";
import usePreventNavigation from "@hook/usePreventNavigation";
import { useSession } from "next-auth/react";
import { savePostValidation } from "@lib/validation";
import { useUploadThing } from "@lib/uploadthing";
import NotFound from "@app/(main)/not-found";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
  useQuery,
} from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import axios from "axios";
import EmblaCarousel from "@components/ui/carousel/carousel";
import { FaImage } from "react-icons/fa6";
import { FaCheck } from "react-icons/fa";
import ImageCom from "@components/ui/Image";
import Offcanvas from "@components/ui/offcanvas";
import { FaCaretRight } from "react-icons/fa6";
import Darkmode from "@components/ui/darkmode";
import { IoClose } from "react-icons/io5";
import Button from "@components/ui/button";
// import ImageInput from "@components/ui/imageInput";
import { useDebounce } from "use-debounce";

const CreatePostRoot = () => {
  const { data: session } = useSession();
  const [dropTag, setDropTag] = useState([]);
  const router = useRouter();
  const [onClose, setOnClose] = useState(false);
  const [files, setFiles] = useState([]);
  const [editorContent, setEditorContent] = useState();
  const [deletedFiles, setDeletedFiles] = useState([]);
  const [deletedPostFiles, setDeletedPostFiles] = useState([]);
  const [preventNavigation, setPreventNavigation] = useState(false);
  const [thumnailIndex, setThumnailIndex] = useState(0);
  const [contentImages, setContentImage] = useState();
  const [cancel, setCancel] = useState(false);
  const [save, setSave] = useState(false);
  const ydoc = useMemo(() => new YDoc(), []);
  const blobUrlToUploadedUrlMap = [];
  const mutation = useSubmitPostMutation();
  const saveMutation = useSavePostMutation();
  usePreventNavigation(preventNavigation);
  const [selectedTeam, setSelectedTeam] = useState(null);

  // const [selectedImage, setSelectedImage] = useState();
  // const[rmThumbnailFile,setRmThumbnailFile]=useState([])
  // const [selectedInputImage, setSelectedInputImage] = useState();
  // const [editIndex, setEditIndex] = useState(null);
  // const [provider, setProvider] = useState(null)
  // const [imageUrl, setImageUrl] = useState();
  // const [collabToken, setCollabToken] = useState()
  // const searchParams = useSearchParams()
  // const hasCollab = parseInt(searchParams?.get('noCollab') ) !== 1 && collabToken !== null
  // const uploadMutation = useUploadMutation();
  // console.log(thumnailIndex)
  // console.log(files)
  // console.log(blobUrlToUploadedUrlMap)

  if (!session) {
    NotFound();
  }

  const queryClient = useQueryClient();
  const { data, isPending, status, error, isFetching } = useQuery({
    queryKey: ["team-author"],
    queryFn: async () => {
      const response = await axios.get(`/api/team`);
      return response.data;
    },
    staleTime: Infinity,
  });

  console.log(files);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
    setValue,
    getValues,
    watch
  } = useForm({
    defaultValues: {
      title: "",
      desc: "",
      image: "",
      content: "",
      tags: [],
      files:[],
      scheduledPublish: null,
      // teamId:''
      // contentImages: [],
    },
    resolver: yupResolver(postValidation),
    // resolver: yupResolver(save ? savePostValidation : postValidation),
  });

  const { startUpload: postUpload, isUploading: postIsUploading } =
    useUploadThing("post", {
      onClientUploadComplete: (data) => {
        toast.success("uploaded successfully!");
        console.log(data);
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
      console.log(values);
      setPreventNavigation(true);

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
        console.log(uploadedData.map(item => item.url))
        setValue("files", uploadedData.map(item => item.url));

      }

      // console.log(blobUrlToUploadedUrlMap);

      // Handle thumbnail URL
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

      console.log(values);
      mutation.mutate(values, {
        onSuccess: () => {
          localStorage.removeItem('postDraft');
          setPreventNavigation(false);
          reset();
          setDropTag([]);
          setFiles([]);
          router.back();
        },
      });
    } catch (err) {
      toast.error(err.message || "An error occurred");
      console.log(err.message);
    }
  };

  const onSaveDraft = async (values) => {
    try {
      setPreventNavigation(true);
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
        setValue("files", uploadedData.map(item => item.url));
      }

      // const uploadPostPromises = files.map(({ file, url }) => {
      //           if (file && typeof file !== "string") {
      //             const extension = file.name.split(".").pop();
      //             const formData = new File(
      //               [file],
      //               `post_${crypto.randomUUID()}.${extension}.webp`
      //             );
      //             return postUpload([formData]).then((uploadedData) => {
      //               if (uploadedData.length > 0) {
      //                 const uploadedUrl = uploadedData[0].url;
      //                 blobUrlToUploadedUrlMap.push({ blobUrl: url, uploadedUrl });
      //                 return uploadedUrl;
      //               }
      //             });
      //           }
      //         });

      //         const uploadedImages = await Promise.all(uploadPostPromises);

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

      console.log(values);
      saveMutation.mutate(values, {
        onSuccess: () => {
          localStorage.removeItem('postDraft');
          setPreventNavigation(false);
          reset();
          setDropTag([]);
          setFiles([]);
          router.back();
        },
      });
    } catch (err) {
      toast.error(err.message || "An error occurred");
      console.log(err.message);
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

  const handleTeamChange = (team) => {
    setSelectedTeam(team);
    setValue("teamId", team ? team.id : "");
  };

  const tags = [
    {
      id: "1",
      name: "crypto",
      info: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sed, rerum!",
    },
    {
      id: "2",
      name: "forex",
      info: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sed, rerum!",
    },
    {
      id: "3",
      name: "stocks",
      info: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sed, rerum!",
    },
    {
      id: "4",
      name: "futures",
      info: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sed, rerum!",
    },
    {
      id: "5",
      name: "airdrops",
      info: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sed, rerum!",
    },
    {
      id: "6",
      name: "latest",
      info: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sed, rerum!",
    },
    {
      id: "7",
      name: "news",
      info: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sed, rerum!",
    },
    {
      id: "8",
      name: "learning",
      info: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sed, rerum!",
    },
    {
      id: "9",
      name: "exchange",
      info: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sed, rerum!",
    },
    {
      id: "10",
      name: "trade",
      info: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sed, rerum!",
    },
    {
      id: "11",
      name: "begginers",
      info: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sed, rerum!",
    },
    {
      id: "12",
      name: "skills",
      info: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sed, rerum!",
    },
    {
      id: "12",
      name: "ai",
      info: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sed, rerum!",
    },
    {
      id: "12",
      name: "tuturial",
      info: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sed, rerum!",
    },
  ];


  const content = watch("content");
  const title = watch("title");

  const [debouncedContent] = useDebounce(content,5000)
  const [debouncedTitle] = useDebounce(title,5000)


  useEffect(() => {
    if (!debouncedContent && !debouncedTitle) {
      return;
    }
    if(debouncedContent.length >= 5 || debouncedTitle.length >= 5 ){
      const formValues = getValues();
      localStorage.setItem('postDraft', JSON.stringify(formValues));
    }
  }, [debouncedContent,debouncedTitle]);

  useEffect(() => {
    // if (!draftId) {
      const lastDraftId = localStorage.getItem('lastDraftId');
      const postDraftString = localStorage.getItem('postDraft');
      const postDraft = JSON.parse(postDraftString);
      console.log(lastDraftId,postDraft)
      setValue("title", postDraft?.title );
      setValue("desc", postDraft?.desc );
      setValue("content", postDraft?.content );
      if (lastDraftId) {
        // Redirect to the same page with the draft ID
        // const newParams = new URLSearchParams(searchParams.toString());
        // newParams.set("draft", lastDraftId);
        // router.replace(`${pathname}?${newParams.toString()}`);
      }
    // }
  }, []);

  return (
    <div className="mb-2 px-2 sm:px-5">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-7">
        {!cancel && (
          <div className="flex justify-between  w-full sticky top-0 bg-white dark:bg-black z-[10] py-2 ">
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

              <Offcanvas
                title={"CRAETE POST"}
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
                    {/* <ImageInput selectedImage={selectedImage}  setSelectedImage={setSelectedImage} selectedInputImage={selectedInputImage}  setSelectedInputImage={setSelectedInputImage} setValue={setValue} rmThumbnailFile={rmThumbnailFile} setRmThumbnailFile={setRmThumbnailFile}/> */}
                    {/* <div
                                         className={`text-red  text-[10px] md:text-sm transition-opacity duration-300  ${
                                           errors?.image?.message ? "opacity-100" : "opacity-0"
                                         }`}
                                       >
                                         {errors?.image?.message}
                                       </div> */}
                    {contentImages?.length > 0 ? (
                      <EmblaCarousel options={{ loop: false }}>
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
                                alt={"post thumnail"}
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
                      <div type="button" className="relative block w-full">
                        <div className="h-full bg-gradient-to-tr p-3 from-lbtn to-lcard dark:from-dbtn dark:to-dcard rounded-xl items-center align-middle justify-center flex flex-col space-y-1 text-lfont text-center">
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
                                className="bg-transparent ring-0 outline-none w-fit text-wrap disabled:cursor-not-allowed px-1 text-sm"
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



                  <div className="space-y-2">
  <p className="text-sm">Schedule Publication</p>
  <div className="flex flex-col space-y-2">
    <label htmlFor="scheduledPublish" className="text-sm">
      Set a date and time for your post to be published (optional)
    </label>
    <input 
      type="datetime-local" 
      id="scheduledPublish"
      className="resize-none bg-lcard dark:bg-dcard rounded-lg text-sm p-2 focus:ring-2 focus:ring-black dark:focus:ring-white outline-none duration-200"
      min={new Date().toISOString().slice(0, 16)}
      {...register("scheduledPublish")}
    />
    <p className="text-[10px] text-lfont">
      If not set, your post will be published immediately
    </p>
  </div>
</div>


                  {!save && (
                    <div className="grid grid-cols-2 w-full gap-2">
                      <Button
                        variant="menu"
                        className="rounded-lg w-full text-sm py-2"
                        type="button"
                        onClick={() => {
                          setSave(true);
                        }}
                        disabled={mutation.isPending || postIsUploading}
                      >
                        Save Draft
                      </Button>
                      <Button
                        variant="menuActive"
                        className="rounded-lg w-full text-sm py-2"
                        disabled={mutation.isPending || postIsUploading}
                        // isUploading ||
                        type="submit"
                      >
                        {mutation.isPending ||
                        //  isUploading ||
                        postIsUploading ? (
                          //  mutation.isPending || uploadMutation.isPending
                          <LoadingIcon color={"bg-white dark:bg-black"} />
                        ) : (
                          "CRAETE POST"
                        )}
                      </Button>
                    </div>
                  )}

                  {save && (
                    <div className="space-x-2 grid grid-cols-2 w-full">
                      <Button
                        className="rounded-lg text-sm py-2"
                        variant="close"
                        type="button"
                        disabled={saveMutation.isPending || postIsUploading}
                        onClick={() => {
                          setSave(false);
                        }}
                      >
                        Cancel
                      </Button>

                      <Button
                        disabled={saveMutation.isPending || postIsUploading}
                        className="rounded-lg text-sm py-2"
                        variant="menuActive"
                        type="button"
                        onClick={handleSubmit(onSaveDraft)}
                      >
                        {saveMutation.isPending || postIsUploading ? (
                          <LoadingIcon color={"bg-white dark:bg-black"} />
                        ) : (
                          "Save Draft"
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              </Offcanvas>

          </div>
        )}

        {cancel && (
          <div className="flex justify-between  py-2 w-full sticky top-0 z-[10]">
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
              variant={"delete"}
              onClick={() => router.back()}
              type="button"
            >
              Cancle and delete All data
            </Button>
          </div>
        )}

        <div className="w-full md:w-2/3 mx-auto  space-y-4 ">
          <Dropdown
            title={
              <div className="flex space-x-2">
                <div className="relative  w-9 h-9">
                  <ImageCom
                    src={
                      selectedTeam ? selectedTeam.image : session?.user.image
                    }
                    className="h-9 w-9 rounded-lg"
                    alt=""
                  />
                </div>
                <div className="flex flex-col ">
                  <p className="text-sm ">
                    {selectedTeam
                      ? selectedTeam.displayName
                      : session?.user.displayName}
                  </p>
                  <p className=" text-lfont text-[10px] text-start">
                    {new Date().toLocaleDateString()}
                  </p>
                </div>
                {data?.length >= 1 && (
                  <div className="my-auto">
                    <FaCaretRight />
                  </div>
                )}
              </div>
            }
            className={
              "left-0  w-60 px-3  border border-lbtn dark:border-dbtn "
            }
            btnStyle={
              "hover:bg-lcard dark:hover:bg-dcard p-2 rounded-xl duration-200"
            }
            disabled={isPending || data?.length < 1}
          >
            <div className="space-y-2">
              <div key="personal">
                <input
                  className="hidden peer"
                  type="radio"
                  value=""
                  {...register("teamId")}
                  id="personal"
                  name="teamId"
                  onChange={() => handleTeamChange(null)}
                />
                <label
                  className="flex flex-col py-2 px-3 hover:bg-lcard dark:hover:bg-dcard peer-checked:bg-lcard dark:peer-checked:bg-dcard dark:peer-checked:text-white peer-checked:text-black cursor-pointer rounded-lg duration-300"
                  htmlFor="personal"
                >
                  <div className="flex space-x-2 ">
                    <div className="relative  w-9 h-9">
                      <ImageCom
                        src={session?.user.image}
                        className="h-9 w-9 rounded-lg"
                        alt=""
                      />
                    </div>
                    <div className="flex flex-col">
                      <p className="text-sm ">{session?.user.displayName}</p>
                      <p className="text-[10px] text-lfont">Personal</p>
                    </div>
                  </div>
                </label>
              </div>
              {data?.map((team) => (
                <div key={team.displayName}>
                  <input
                    className="hidden peer"
                    type="radio"
                    value={team.id}
                    {...register("teamId")}
                    id={team.displayName}
                    name="teamId"
                    onChange={() => handleTeamChange(team)}
                  />
                  <label
                    className="flex flex-col py-2 px-3 hover:bg-lcard dark:hover:bg-dcard peer-checked:bg-lcard dark:peer-checked:bg-dcard dark:peer-checked:text-white peer-checked:text-black cursor-pointer rounded-lg duration-300"
                    htmlFor={team.displayName}
                  >
                    <div className="flex space-x-2">
                      <div className="relative w-9 h-9">
                        <ImageCom
                          src={team.image}
                          className="h-9 w-9 rounded-lg"
                          alt=""
                        />
                      </div>
                      <div className="flex flex-col">
                        <p className="text-sm">{team.displayName}</p>
                        <p className="text-[10px] text-redorange">Team</p>
                      </div>
                    </div>
                  </label>
                </div>
              ))}
              <div
                className={`text-red mt-1 text-[10px] md:text-sm transition-opacity duration-300 ${
                  errors?.teamId?.message ? "opacity-100" : "opacity-0"
                }`}
              >
                {errors?.teamId?.message}
              </div>
            </div>
          </Dropdown>

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
                ydoc={ydoc}
                files={files}
                setFiles={setFiles}
                setEditorContent={setEditorContent}
                setDeletedFiles={setDeletedFiles}
                deletedFiles={deletedFiles}
                setDeletedPostFiles={setDeletedPostFiles}
                deletedPostFiles={deletedPostFiles}
                setValue={setValue}
                contentImages={contentImages}
                setContentImage={setContentImage}
                thumnailIndex={thumnailIndex}
                setThumnailIndex={setThumnailIndex}
                //  hasCollab={hasCollab}
                //  provider={provider}
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

export default CreatePostRoot;
