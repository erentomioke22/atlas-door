"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import TextArea from "@components/ui/TextArea";
import Dropdown from "@components/ui/dropdown";
import {toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { postValidation } from "@lib/validation";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { IoClose } from "react-icons/io5";
import { useEditPostMutation } from "@components/posts/mutations";
import { useDeletePostMutation } from "@components/posts/mutations";
import LoadingSpinner from "@components/ui/loading/loadingSpinner";
import BlockEditor from "@components/BlockEditor/BlockEditor";
import {useMemo } from "react";
import { Doc as YDoc } from "yjs";
import { useSearchParams } from "next/navigation";
import Accordion from "@components/ui/Accordion";
import ImageInput from "@components/ui/imageInput";
import EditPostLoading from "@components/ui/loading/editPostLoading";
import usePreventNavigation from "@hook/usePreventNavigation";
import { FaQuestion } from "react-icons/fa";
import NotFound from "@app/(main)/not-found";


const EditPost = ({ params }) => {
  const { data: session } = useSession();
  const [dropTag, setDropTag] = useState([]);
  const [imageUrl, setImageUrl] = useState();
  const router = useRouter();
  const mutation = useEditPostMutation();
  const deleteMutation = useDeletePostMutation();
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [faqs, setFaqs] = useState([]);
  const [files, setFiles] = useState([]);
  const [deletedPostFiles, setDeletedPostFiles] = useState([]);
  const [rmThumbnailFile, setRmThumbnailFile] = useState([]);
  const [deletedFiles, setDeletedFiles] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [selectedImage, setSelectedImage] = useState();
  const [selectedInputImage, setSelectedInputImage] = useState();
  // const [provider, setProvider] = useState(null);
  // const [collabToken, setCollabToken] = useState();
  // const hasCollab =parseInt(searchParams?.get("noCollab")) !== 1 && collabToken !== null;
  // const searchParams = useSearchParams();
  const ydoc = useMemo(() => new YDoc(), []);
  const [preventNavigation, setPreventNavigation] = useState(false); 
  const [items, setItems] = useState([])
  // const blobUrlToUploadedUrlMap = new Map();
  // const [content, setContent] = useState();
  // const [imageInput, setImageInput] = useState();
  // const [modal, setModal] = useState(false);
  // const [ThumbnailFile, setThumbnailFile] = useState([]);
  const [editorContent, setEditorContent] = useState();
  // const ArchiveMutation = useCreateArchiveMutation();
  // console.log(items)
  usePreventNavigation(preventNavigation);
  // console.log(files)
  // console.log(faqs);
  // console.log(deletedPostFiles);
  // console.log(deletedFiles);
  // console.log(dropTag);




  const {
    data: post,
    isPending,
    fetchNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useQuery({
    queryKey: ["edit-post", params.title],
    queryFn: async () => {
      const response = await axios.get(`/api/posts/edit-post/${params.title}`);
      return response.data;
    },
  });

  // console.log(post);

  if (status === "success" && post?.length < 0) {
    return (
      <p className="text-center text-muted-foreground">
        No posts found. Start following people to see their posts here.
      </p>
    );
  }

  if (status === "error") {
    return (
      <p className="text-center text-destructive">
        An error occurred while loading posts.
      </p>
    );
  }

  if(!session || !post){
    NotFound()
  }


  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
    setValue,
    getValues
  } = useForm({
    defaultValues: {
      postId: post?.id,
      title: '',
      desc:"",
      image:'',
      contentImages: [],
      content: '',
      tags: [],
      faqs:[],
      tocs:[]
    },
    resolver: yupResolver(postValidation),
  });


// console.log(getValues('tocs'))



  // const { startUpload, isUploading } = useUploadThing("thumbnail", {
  //   onClientUploadComplete: (data) => {
  //     toast.success("uploaded successfully!");
  //     console.log(data);
  //     setValue("image", data[0].url);
  //   },
  //   onUploadError: () => {
  //     throw new Error("error occurred while uploading")
  //   },
  //   onUploadBegin: ({ file }) => {
  //     console.log("upload has begun for", file);
  //   },
  // });

  // const { startUpload: postUpload, isUploading: postIsUploading } =
  //   useUploadThing("post", {
  //     onClientUploadComplete: (data) => {
  //       toast.success("uploaded successfully!");
  //       console.log(data);
  //       return data[0].url;
  //     },
  //     onUploadError: () => {
  //       throw new Error("error occurred while uploading")
  //     },
  //     onUploadBegin: ({ file }) => {
  //       console.log("upload has begun for", file);
  //     },
  //   });

    
  const onSubmit = async (values) => {
    try {
      // console.log(values)
      setPreventNavigation(true);
      // const mixRemoves = [...deletedFiles, rmThumbnailFile];
      // const removeKey = mixRemoves.map((mixRemove) => {
      //   if (typeof mixRemove === "string") {
      //     return mixRemove.split("/").pop();
      //   }
      //   return null;
      // });
      // setValue("rmFiles", removeKey.filter(Boolean));
      // console.log(values, mixRemoves, removeKey);

      // if (values.image && typeof values.image !== "string") {
      //   const uploadPromises = await startUpload([values.image]);
      //   console.log(uploadPromises);
      // }

      // const uploadPostPromises = files.map(({ file, url }) => {
      //   if (file && typeof file !== "string") {
      //     const extension = file.name.split(".").pop();
      //     const formData = new File(
      //       [file],
      //       `post_${crypto.randomUUID()}.${extension}`
      //     );
      //     return postUpload([formData]).then((uploadedData) => {
      //       if (uploadedData.length > 0) {
      //         const uploadedUrl = uploadedData[0].url;
      //         blobUrlToUploadedUrlMap.set(url, uploadedUrl);
      //         return uploadedUrl;
      //       }
      //     });
      //   }
      // });

      // const uploadedImages = await Promise.all(uploadPostPromises);
      // console.log(uploadedImages);
      // if (uploadedImages.length > 0) updateEditorContentWithUploadedUrls();

      mutation.mutate(values, {
        onSuccess: () => {
          reset();
          setImageUrl("");
          setDropTag([]);
          setFiles([]);
          setFaqs([]);
          setItems([]);
          setDeletedFiles([]);
          setSelectedImage(null);
          setSelectedInputImage(null);
          setPreventNavigation(false);
          // setContent(null)
          setEditorContent(null)
          router.back();
        },
      });
    } catch (err) {
      toast.error(err.message || 'An error occurred');
      // console.log(err);
    }
  };
  // function updateEditorContentWithUploadedUrls() {
  //   const editorContents = editorContent.getHTML();
  //   let updatedContent = editorContents;

  //   blobUrlToUploadedUrlMap.forEach((uploadedUrl, blobUrl) => {
  //     updatedContent = updatedContent.replace(
  //       new RegExp(blobUrl, "g"),
  //       uploadedUrl
  //     );
  //   });

  //   editorContent.commands.setContent(updatedContent);
  //   console.log(updatedContent);
  //   setValue("content", updatedContent);
  // }

  const handleAddTag = (newTag) => {
    if (newTag && !dropTag.includes(newTag) 
      // && dropTag.length < 4
    ) {
      const addTags = [...dropTag, newTag].filter(tag =>tag)
      setDropTag(addTags);
      setValue("tags",addTags, { shouldValidate: true });
    }
  };

  const handleRemoveTag = (tag) => {
    const removetag = dropTag.filter((t) => t !== tag)
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
    } 
    else 
    // if(dropTag.length < 4) 
    {
      setDropTag([...dropTag, name.name]);
      setValue("tags", [...dropTag, name.name], { shouldValidate: true });
    }
  }

  const handleInputKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const newTag = e.currentTarget.value.trim();
      handleAddTag(newTag);
      e.currentTarget.value = '';
    }
  };


  const handleAddFaq = () => { 
    if (editIndex !== null) { 
      const updatedFaqs = faqs.map((faq, index) => index === editIndex ? { question, answer } : faq ); 
      setFaqs(updatedFaqs); 
      setValue("faqs", updatedFaqs, { shouldValidate: true });
      setEditIndex(null); 
    } else { 
      setFaqs([...faqs, { question, answer }]); 
      setValue("faqs", [...faqs, { question, answer }], { shouldValidate: true });
    } 
     setAnswer('');
     setQuestion(''); 
    };

  const handleRemoveFaq = (index) => {
    const removeFaq = faqs.filter((_,i) => i !== index)
    setFaqs(removeFaq);
    setValue("faqs", removeFaq);
  };

  const handleEditFaq = (index) => { 
    const faq = faqs[index]; 
    setQuestion(faq.question); 
    setAnswer(faq.answer); 
    setEditIndex(index); 
  };

  useEffect(() => {
    if (post) {
      setValue("title", post?.title);
      setValue("desc", post?.desc);
      setValue("postId", post?.id);
      setValue("content", post?.content);
      setValue("faqs", post?.faqs);
      setValue("image", post?.images[0]);
      setValue("contentImages", post?.contentImages);
      setValue('tocs',post?.tocs.map(toc => toc));
      setValue("tags",post?.tags.map((tag) => tag.name));
      setImageUrl(post?.images[0]);
      setItems(post?.tocs)
      setFaqs(post?.faqs)
      setDropTag(post?.tags.map((tag) => tag.name));
      // setContent(post?.content);
      setSelectedImage(post?.images[0]);
      setDeletedPostFiles([...deletedPostFiles, post?.images[0]]);
    }
  }, [post]);

  const tags = [
    { id: "1",  name: "درب اتوماتیک", info: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sed, rerum!" },
    { id: "2",  name: "کرکره برقی", info: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sed, rerum!" },
    { id: "3",  name: "جک پارکیگ", info: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sed, rerum!" },
    { id: "4",  name: "راهبند پارکینگ", info: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sed, rerum!" },
    { id: "5",  name: "شیشه بالکنی", info: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sed, rerum!" },
    { id: "6",  name: "پرده برقی", info: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sed, rerum!" },
    { id: "7",  name: "سایبان برقی", info: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sed, rerum!" },
    { id: "8",  name: "شیشه سکوریت", info: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sed, rerum!" },
    { id: "9",  name: "جام بالکن", info: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sed, rerum!" },
    { id: "10",  name: "لمینت", info: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sed, rerum!" },
    { id: "11",  name: "آیینه", info: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sed, rerum!" },
    { id: "12",  name: "upvc", info: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sed, rerum!" },
  ];

  return (
    <div className="mb-20 px-3 md:px-5">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-7">
        <div className="flex justify-between w-full sticky top-0 bg-white dark:bg-black z-[10] py-2">
          <div>
            <div className="flex gap-2 ">
              <Dropdown
                title={"Edit Post"}
                disabled={
                  isPending || deleteMutation.isPending || mutation.isPending
                }
                btnStyle={
                  "bg-black text-white border-2 border-black dark:border-white dark:bg-white dark:text-black rounded-full px-3 py-1 text-sm duration-300  disabled:cursor-not-allowed   "
                }
                className={
                  "right-0  z-50 h-fit  w-72 px-3 bg-white border border-lbtn  dark:border-dbtn dark:bg-black"
                }
              >
                <div className="space-y-2">
                  <div className="space-y-2">
                    <p className="text-sm">Thumbnail preview</p>
                    <ImageInput
                      selectedImage={selectedImage}
                      setSelectedImage={setSelectedImage}
                      selectedInputImage={selectedInputImage}
                      setSelectedInputImage={setSelectedInputImage}
                      setValue={setValue}
                      rmThumbnailFile={rmThumbnailFile}
                      setRmThumbnailFile={setRmThumbnailFile}
                    />
                    <div
                      className={`text-red  text-[10px] md:text-sm transition-opacity duration-300  ${
                        errors?.image?.message ? "opacity-100" : "opacity-0"
                      }`}
                    >
                      {errors?.image?.message}
                    </div>
                  </div>
                  <p className="text-sm">Title & Tags </p>
                  <div>
                    <TextArea
                      title={"WRITE YOUR POST TITLE ..."}
                      name={"title"}
                      type={"text"}
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
                        title={"Write Your Post Description ..."}
                      name={"desc"}
                      type={"text"}
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
                        <div className="flex space-x-5 border-2 border-black dark:border-white p-2 rounded-lg w-full max-h-36 overflow-y-auto">
                          <ul
                            className="flex flex-wrap gap-2 text-sm w-full"
                            disabled={dropTag.length === 4}
                          >
                            {dropTag.map((dropTag) => (
                              <li
                                disabled={dropTag.length === 4}
                                onClick={() => handleRemoveTag(dropTag)}
                                key={dropTag}
                                className="bg-lcard px-2 py-1 rounded-lg dark:bg-dcard space-x-2 "
                              >
                                <span className="text-lfont">#</span>
                                {dropTag}{" "}
                              </li>
                            ))}
                            <li className="my-auto w-fit">
                              <input
                                type="text"
                                placeholder={
                                  // dropTag.length < 4
                                  //   ? 
                                    "Add up to 4 tags for post..."
                                    // : `You can only enter max. of ${4} tags`
                                }
                                onKeyDown={handleInputKeyPress}
                                // disabled={dropTag.length === 4}
                                className="bg-transparent ring-0 outline-none w-fit text-wrap disabled:cursor-not-allowed px-1 "
                              />
                            </li>
                          </ul>
                        </div>
                      }
                      btnStyle={"text-lg w-full"}
                      className={
                        "left-0 -top-44  z-[55] h-44 overflow-auto w-62 rounded-lg bg-white border border-lbtn  dark:border-dbtn dark:bg-black"
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
                    <button
                      className="bg-black rounded-lg text-lcard dark:bg-white dark:text-black w-full py-2 mx-auto disabled:brightness-90 disabled:cursor-not-allowed text-center flex justify-center"
                      disabled={
                        mutation.isPending 
                      }
                      type="submit"
                    >
                      {mutation.isPending ? (
                        <LoadingSpinner
                          color={
                            "text-black dark:text-white dark:fill-black fill-white mx-auto"
                          }
                        />
                      ) : (
                        "Edit Post"
                      )}
                    </button>
                  </div>
                </div>
              </Dropdown>
             
              <button
                type="button"
                disabled={
                  isPending || deleteMutation.isPending || mutation.isPending
                }
                className="bg-transparent border-2 text-sm text-redorange border-redorange rounded-full px-3 py-1 disabled:cursor-not-allowed"
                onClick={() => {
                  const removeKey = deletedPostFiles.map((file) => {
                    if (typeof file === "string") {
                      return file.split("/").pop();
                    }
                    return null;
                  });
                  // console.log(removeKey);
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
                  <LoadingSpinner
                    color={"text-transparent  fill-redorange mx-auto"}
                  />
                ) : (
                  "Delete Post"
                )}
              </button>
            </div>
          </div>

          <div>
            <button
              className={
                "bg-lcard text-lfont dark:bg-dcard rounded-full px-3 py-2 text-[10px] md:text-sm"
              }
              onClick={() => router.back()}
              type="button"
            >
              cancel
            </button>
          </div>

        </div>

        {isPending ? (
          <EditPostLoading />
        ) : (
          <>
            <div className="w-full md:w-2/3 mx-auto  space-y-3 ">
              <Controller
                name="content"
                control={control}
                render={({ field: { onChange, onBlur, value, name, ref } }) => (
                  // <TextEditor content={value} onChange={onChange} ref={ref} provider={provider} />
                  <BlockEditor
                    content={value}
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
                    items={items}
                    setItems={setItems}
                    ydoc={ydoc}
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
                       <Dropdown className={'right-0 bg-white px-2 dark:bg-black border border-lbtn  dark:border-dbtn'} title={<FaQuestion/>} btnStyle={'bg-black text-white dark:bg-white dark:text-black rounded-full px-3 py-2'}>
          <div className="flex flex-col space-y-1">
            <input type="text" className="resize-none block bg-lcard dark:bg-dcard px-2 py-2 rounded-lg focus:outline-none  w-full focus:ring-2 focus:ring-black dark:ring-white   duration-200 " placeholder="question" value={question} onChange={(e)=>{setQuestion(e.target.value)}}/>
            <textarea type="text" className="resize-none block bg-lcard dark:bg-dcard px-2 py-2 rounded-lg focus:outline-none  w-full focus:ring-2 focus:ring-black dark:ring-white   duration-200 " placeholder="answer"   value={answer} onChange={(e)=>{setAnswer(e.target.value)}}/>
            <button type="button" className="bg-black text-white rounded-lg w-full py-2 px-3 text-sm dark:bg-white dark:text-black" onClick={handleAddFaq}> 
            {editIndex !== null ? 'Update FAQ' : 'Add FAQ'}
            </button>
          </div>
         </Dropdown>
            </div>




          </>
        )}
      </form>
      <div>
              {faqs?.map((faq,index) => (
                <div key={index} className="flex space-x-2">
                  <Accordion title={faq.question}>
                    {" "}
                    <p>{faq.answer}</p>{" "}
                  </Accordion>
                  <button
                    className="text-red"
                    onClick={() => handleRemoveFaq(index)}
                  >
                    delete
                  </button>
                  <button
                    className="text-yellow"
                    onClick={() => handleEditFaq(index)}
                  >
                    {" "}
                    Edit{" "}
                  </button>
                </div>
              ))}
            </div>
    </div>
  );
};

export default EditPost;
