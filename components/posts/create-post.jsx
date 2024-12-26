"use client";

import React from "react";
import { useState } from "react";
import TextArea from "@components/ui/TextArea";
import Dropdown from "@components/ui/dropdown";
import { toast } from 'sonner'
import Offcanvas from "@components/ui/offcanvas";
import { IoClose } from "react-icons/io5";
import { useSubmitPostMutation } from "./mutations";
import LoadingSpinner from "@components/ui/loading/loadingSpinner";
import { postValidation } from "@lib/validation";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { IoPencil } from "react-icons/io5";
import { FaQuestion } from "react-icons/fa";
import BlockEditor from "@components/BlockEditor/BlockEditor";
import {  useMemo,  } from 'react'
import { Doc as YDoc } from 'yjs'
import { useSearchParams } from 'next/navigation'
import Accordion from "@components/ui/Accordion";
import ImageInput from "@components/ui/imageInput";
import usePreventNavigation from "@hook/usePreventNavigation";




const CreatePost = () => {
  // const { data: session } = useSession();

  const [close, setClose] = useState(false);
  const [dropTag, setDropTag] = useState([]);
  const mutation = useSubmitPostMutation();
  const[question,setQuestion]=useState('')
  const[answer,setAnswer]=useState('')
  const[faqs,setFaqs]=useState([])
  const[files,setFiles]=useState([])
  const[rmThumbnailFile,setRmThumbnailFile]=useState([])
  const [editorContent,setEditorContent]=useState()
  const[deletedFiles,setDeletedFiles]=useState([])
  const [selectedImage, setSelectedImage] = useState();
  const [selectedInputImage, setSelectedInputImage] = useState();
  const [editIndex, setEditIndex] = useState(null);
  const[deletedPostFiles,setDeletedPostFiles]=useState([])
  const [preventNavigation, setPreventNavigation] = useState(false); 
  const [items, setItems] = useState([])
  // const [provider, setProvider] = useState(null)
  // const [collabToken, setCollabToken] = useState()
  // const searchParams = useSearchParams()
  // const hasCollab = parseInt(searchParams?.get('noCollab') ) !== 1 && collabToken !== null
  const ydoc = useMemo(() => new YDoc(), [])
  // const blobUrlToUploadedUrlMap = new Map();
  // console.log(files)
  // console.log(blobUrlToUploadedUrlMap)
  // const uploadMutation = useUploadMutation();

  usePreventNavigation(preventNavigation);


  

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
      title: '',
      desc:"",
      image: '',
      contentImages: [],
      content: '',
      tags: [],
      faqs:[],
      tocs:[]
    },
    // resolver: yupResolver(postValidation),
  });


  


  // const {startUpload,isUploading} = useUploadThing("thumbnail", {
  //   onClientUploadComplete: (data) => {
  //     toast.success("uploaded successfully!");
  //     console.log(data)
  //     setValue('image',data[0].url)
  //   },
  //   onUploadError: () => {
  //     throw new Error('error occurred while uploading')
  //   },
  //   onUploadBegin: ({ file }) => {
  //     console.log("upload has begun for", file);
  //   },
  // });

  // const {startUpload:postUpload,isUploading:postIsUploading} = useUploadThing("post", {
  //   onClientUploadComplete: (data) => {
  //     toast.success("uploaded successfully!");
  //     console.log(data)
  //     return data[0].url
       
  //   },
  //   onUploadError: () => {
  //     throw new Error('error occurred while uploading')
  //   },
  //   onUploadBegin: ({ file }) => {
  //     console.log("upload has begun for", file);
  //   },
  // });



  const onSubmit = async (values) => {
    try{
      console.log(values)
      setPreventNavigation(true);
      
      // if (values.image && typeof values.image !== "string") {
      //   const uploadPromises = await startUpload([values.image]);
      //   console.log(uploadPromises);
      // }
         
      //    const uploadPostPromises = files.map(({ file, url }) => {
      //     if (file && typeof file !== "string") {
      //       const extension = file.name.split(".").pop();
      //       const formData = new File(
      //         [file],
      //         `post_${crypto.randomUUID()}.${extension}.webp`
      //       );
      //       return postUpload([formData]).then((uploadedData) => {
      //         if (uploadedData.length > 0) {
      //           const uploadedUrl = uploadedData[0].url;
      //           blobUrlToUploadedUrlMap.set(url, uploadedUrl);
      //           return uploadedUrl;
      //         }
      //       });
      //     }
      //   });
  
      //   const uploadedImages = await Promise.all(uploadPostPromises);
      //   console.log(uploadedImages);
      //   if (uploadedImages.length > 0) updateEditorContentWithUploadedUrls();
      //    console.log(values)
        //  mutation.mutate(values,{
        //    onSuccess: () => {
        //      reset();
        //      setDropTag([]);
        //      setFiles([])
        //      setFaqs([])
        //      setItems([])
        //      setSelectedImage(null)
        //      setSelectedInputImage(null)
        //      setPreventNavigation(false);
        //    },
        //  });
    }
    catch(err){
      toast.error(err.message || 'An error occurred');
      console.log(err.message)
    }
  };


  // function updateEditorContentWithUploadedUrls() {
  //   const editorContents = editorContent.getHTML();
  //   let updatedContent = editorContents;
  
  //   blobUrlToUploadedUrlMap.forEach((uploadedUrl, blobUrl) => {
  //     updatedContent = updatedContent.replace(new RegExp(blobUrl, 'g'), `${uploadedUrl}`);
  //   });
  
  //   editorContent.commands.setContent(updatedContent);
  //   console.log(updatedContent)
  //   setValue('content',updatedContent)
  //   editorContent.commands.focus();
  // }


  // const handleImageUpload = (file) => {
  //   // return new Promise((resolve, reject) => {
  //     const formData = new FormData();
  //     formData.append('file', file);
  
  //     uploadMutation.mutate(formData, {
  //       onSuccess: (data) => {
  //         console.log('File uploaded:', data.imageUrl);
  //         toast.success('File uploaded');
  //         if (data.imageUrl) {
  //           // resolve(data.imageUrl);
  //         } else {
  //           // reject('No image URL returned');
  //         }
  //       },
  //       onError: (error) => {
  //         console.error('Upload failed:', error.message);
  //         toast.error('Failed to upload file. Please try again.');
  //         // reject(error);
  //       },
  //     });
  //   // });
  // };
  




  
  




  // const onSubmit = async (values) => {
  //   try {
  //     const tocs = items.map(({ dom, editor, node, isActive, isScrolledOver, pos, ...cleanedItem }) => cleanedItem);
  //     setValue('tocs', tocs);
  //     console.log(values);
  //     setPreventNavigation(true);
  
  //     // Upload the values.image if it's a file
  //     if (values.image && typeof values.image !== 'string') {
  //       const imageUrl = await handleImageUpload(values.image);
  //       console.log(imageUrl)
  //       values.image = imageUrl;
  //       setValue('image', imageUrl);
  //     }
  
  //     // Upload images in the text editor content
  //     const uploadPostPromises = files.map(({ file, url }) => {
  //       if (file && typeof file !== 'string') {
  //         return handleImageUpload(file).then((uploadedUrl) => {
  //           blobUrlToUploadedUrlMap.set(url, uploadedUrl);
  //           console.log(uploadedUrl)
  //           return uploadedUrl;
  //         });
  //       }
  //       return url;
  //     });
  
  //     const uploadedImages = await Promise.all(uploadPostPromises);
  //     console.log('Uploaded images:', uploadedImages);
  
  //     if (uploadedImages.length > 0) {
  //       updateEditorContentWithUploadedUrls(uploadedImages);
  //     }
  //     console.log('Final form values:', values);
  
  //     // Proceed with submitting the form
  //     mutation.mutate(values, {
  //       onSuccess: () => {
  //         reset();
  //         setDropTag([]);
  //         setFiles([]);
  //         setFaqs([]);
  //         setItems([]);
  //         setSelectedImage(null);
  //         setSelectedInputImage(null);
  //         setPreventNavigation(false);
  //         toast.success('Post created successfully');
  //       },
  //       onError: (error) => {
  //         toast.error('Failed to create post. Please try again.');
  //         console.error('Post creation failed:', error);
  //       },
  //     });
  //   } catch (err) {
  //     toast.error(err.message || 'An error occurred');
  //     console.log('Submission error:', err.message);
  //   }
  // };
  
  // function updateEditorContentWithUploadedUrls(uploadedImages) {
  //   const editorContents = editorContent.getHTML();
  //   let updatedContent = editorContents;
  
  //   uploadedImages.forEach((uploadedUrl, index) => {
  //     const blobUrl = blobUrlToUploadedUrlMap.get(index); // Ensure the correct mapping
  //     updatedContent = updatedContent.replace(new RegExp(blobUrl, 'g'), uploadedUrl);
  //   });
  
  //   editorContent.commands.setContent(updatedContent);
  //   console.log('Updated editor content:', updatedContent);
  //   setValue('content', updatedContent);
  //   editorContent.commands.focus();
  // }
  
  


// console.log(getValues('content'))

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
    <Offcanvas
      title={
        <>
          <IoPencil className="text-lg" /> <span>Create Post</span>
        </>
      }
      btnStyle={"py-2 w-full text-start px-3 flex justify-between rounded-lg  hover:text-purple hover:bg-lbtn dark:hover:bg-dbtn text-lfont duration-500"}
      position={"top-0 left-0"}
      size={"h-screen w-full py-0"}
      openTransition={"translate-y-0"}
      closeTransition={"-translate-y-full "}
      onClose={close}
    >

      <div className="mb-2">
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-7">
       
       
              <div className="flex justify-between w-full sticky top-0 bg-white dark:bg-black z-[10] py-2">
                <div >
                      <div className="flex gap-2 ">

                      <Dropdown 
                          title={"CRAETE POST"}
                          btnStyle={"bg-black text-white border-2 border-black dark:border-white dark:bg-white dark:text-black rounded-full px-3 py-1 text-sm duration-300  disabled:cursor-not-allowed   "}
                          className={"-right-2 md:right-0  z-50 h-fit w-72 px-3 bg-white border border-lbtn  dark:border-dbtn dark:bg-black"}>
                             <div className="space-y-2">
                                 <div className="space-y-2">
                                 <p className="text-sm">Thumbnail preview</p>
                                  <ImageInput selectedImage={selectedImage}  setSelectedImage={setSelectedImage} selectedInputImage={selectedInputImage}  setSelectedInputImage={setSelectedInputImage} setValue={setValue} rmThumbnailFile={rmThumbnailFile} setRmThumbnailFile={setRmThumbnailFile}/>
                                      <div
                                         className={`text-red  text-[10px] md:text-sm transition-opacity duration-300  ${
                                           errors?.image?.message ? "opacity-100" : "opacity-0"
                                         }`}
                                       >
                                         {errors?.image?.message}
                                       </div>

                                 </div>
                                 <p className="text-sm">Title , Tags & desc </p>
                                 <div>
                                  <TextArea
                                    title={"Write Your Post Title ..."}
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
                                    <div className="flex space-x-5 border-2 border-black dark:border-white p-2 rounded-lg w-full max-h-36 overflow-y-auto text-wrap">
                                    <ul className="flex flex-wrap gap-2 text-sm w-full" disabled={dropTag.length === 4}>
                                      {dropTag.map((dropTag) => (
                                        <li disabled={dropTag.length === 4} key={dropTag} 
                                            className="bg-lcard px-2 py-1 rounded-lg dark:bg-dcard space-x-2 "
                                            onClick={() => handleRemoveTag(dropTag)}>
                                          <span className="text-lfont">#</span>
                                             {dropTag}{' '}
                                          {/* <span  ><IoClose className="pt-1"/></span> */}
                                        </li>
                                      ))}
                                      <li className="my-auto w-fit">
                                       <input
                                         type="text"
                                         placeholder={
                                          //  dropTag.length < 4
                                          //    ? 
                                             "Add up to 4 tags for post..."
                                            //  : `You can only enter max. of ${4} tags`
                                         }
                                         onKeyDown={handleInputKeyPress}
                                        //  disabled={dropTag.length === 4}
                                         className="bg-transparent ring-0 outline-none w-fit text-wrap disabled:cursor-not-allowed px-1 "
                                       />
                                      </li>
                                    </ul>
                                  </div>
                                      } 
                                         close={close}
                                         btnStyle={"text-lg w-full"}
                                         className={"left-0 -top-44 z-[55] h-44 overflow-auto w-62 rounded-lg bg-white border border-lbtn  dark:border-dbtn dark:bg-black" }
                                       >
                                         <div className="  text-start px-2 text-sm space-y-2">
                                           {tags.map((tag)=>{
                                             return(
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
                                                <p className={` 
                                                     text-lfont
                                                  text-[10px] line-clamp-2`} >{tag.info}</p>
                                              </div>
                                             )
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
           disabled={mutation.isPending}
             type="submit"
           >
             {
             mutation.isPending 
            //  mutation.isPending || uploadMutation.isPending
             ? <LoadingSpinner color={"text-black dark:text-white dark:fill-black fill-white mx-auto"}/>  : "CRAETE POST"}
           </button>     

          
        </div>


                          </div>
                                    
                       </Dropdown>                      


                      </div>
                </div>
                
               <div>
                <button
                    className={"bg-lcard text-lfont dark:bg-dcard rounded-full px-3 py-2 text-[10px] md:text-sm"}
                    onClick={() => setClose(!close)}
                    type="button"
                          >
                        cancel
                </button>
               </div>
      
              </div>


            <div className="w-full md:w-2/3 mx-auto  space-y-3 " >
              <Controller
                  name='content'
                  control={control}
                  render={({ field :{ onChange, onBlur, value, name, ref } }) => (
                    // <TextEditor content={value} onChange={onChange} ref={ref} provider={provider} />
                    <BlockEditor
                     content={value} 
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
                     items={items}
                     setItems={setItems}
                     setValue={setValue} 
                     //  hasCollab={hasCollab}  
                    //  provider={provider} 
                     />
                    
                  )}
               />

                    {/* <BlockEditor
                    //  name={"content"}
                     error={errors?.content?.message}
                       {...register("content")} 
                     ydoc={ydoc} 
                     files={files} 
                     setFiles={setFiles} 
                     setEditorContent={setEditorContent} 
                     setDeletedFiles={setDeletedFiles} 
                     deletedFiles={deletedFiles} 
                     setDeletedPostFiles={setDeletedPostFiles} 
                     deletedPostFiles={deletedPostFiles} 
                     items={items}
                     setItems={setItems}
                     setValue={setValue} 
                     //  hasCollab={hasCollab}  
                    //  provider={provider} 
                     /> */}
                    


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


          </form>
          <div>
            {faqs?.map((faq,index)=>(
              <div key={index} className="flex space-x-2">
                 <Accordion title={faq.question}> <p>{faq.answer}</p> </Accordion>
                 <button className="text-red" onClick={()=>handleRemoveFaq(index)}>delete</button>
                 <button className="text-yellow" onClick={() => handleEditFaq(index)} > Edit </button>
              </div>
            ))}
          </div>

        </div>

         


    </Offcanvas>
  );
};

export default CreatePost;






{/* <div>
<Dropdown
  title={"Cover Image"}
  btnStyle={"w-full md:w-1/3 py-2  bg-purple text-lcard"}
  className={"left-0 md:left-0 z-50 overflow-auto w-48"}
>
  <div className=" px-3 text-sm space-y-2">
    <button
      type="button"
      onClick={() => {
        setModal(true);
      }}
      className="flex justify-between text-lfont text-[10px] px-2 bg-lbtn py-2 dark:bg-dbtn   hover:text-purple  w-full rounded-lg duration-300"
    >
      <FaImage className="text-sm"/>
      Image Url
    </button>

    <UploadButton
      appearance={{
        button:
          "after:cursor-not-allowed w-full after:bg-lcard after:text-lfont text-[10px]  ut-ready:bg-lcard  rounded-r-none  rounded-lg  hover:text-purple  bg-lbtn     text-lfont dark:bg-dbtn duration-500 ",
        allowedContent:
          "text-lfont h-8  justify-center px-2 ",
      }}
      endpoint="imageUploader"
      onClientUploadComplete={(res) => {
        console.log("Files: ", res[0].url);
        setValue("image", res[0].url, {
          shouldValidate: true,
        });
      }}
      onUploadError={(error) => {
        console.log(error.message);
      }}
    />
  </div>
</Dropdown>
<div className="w-full md:w-4/5 mx-auto h-full">
<div className=" bg-gradient-to-tr h-40 md:h-60  p-3 from-lbtn to-lcard dark:from-dbtn to dcard rounded-xl items-center align-middle justify-center flex flex-col space-y-2 text-lfont">
   <div className="bg-lbtn dark:bg-dbtn rounded-2xl text-lg md:text-4xl p-3">
     <FiUpload />
   </div>
   <p className="text-sm md:text-xl">Drop your image or browse</p>
   <p className="">upload file up to 2mb</p>
</div>
<div
  className={`text-red mt-1 text-[10px] md:text-sm transition-opacity duration-300  ${
    errors?.image?.message ? "opacity-100" : "opacity-0"
  }`}
>
  {errors?.image?.message}
</div>

<div className="text-center space-y-5">
{imageUrl && (
<div className="flex justify-center">
<img
src={imageUrl}
className="rounded-2xl  w-[360px] h-[180px] md:w-[720px] md:h-[360px] mx-auto"
alt=""
/>
</div>
)}
</div>
<Dropdown title={                      
  <button 
  type='button' 
  className='max-md:h-12 max-md:w-12 md:h-16  md:w-16 duration-500 border-2 text-2xl rounded-xl border-dashed border-lfont flex flex-col items-center justify-center align-middle text-lfont bg-transparent hover:bg-lcard dark:hover:bg-dcard'
  >
   <HiPlus/>
</button>}  className={"left-0 w-72 z-50  overflow-auto bg-lcard border border-lbtn  dark:border-dbtn dark:bg-dcard"}>
<div className=" px-3 text-sm space-y-2" > 
<button 
type='button' 
onClick={addImage}
className='hover:bg-lbtn dark:hover:bg-dbtn p-1 border border-lbtn dark:border dark:border-dfont  flex justify-center hover:text-purple py-2 w-full rounded-lg duration-300'>
<FaImage />
</button> 


<div className="w-full  mx-auto h-full bg-gradient-to-tr p-3 from-lbtn to-lcard dark:from-dbtn to dcard rounded-xl items-center align-middle justify-center flex flex-col space-y-1 text-lfont">
   <div className="bg-lbtn dark:bg-dbtn rounded-2xl text-sm p-3">
     <FiUpload />
   </div>
   <p className="text-sm ">Drop your image or browse</p>
   <p className="text-[10px]">upload file up to 2mb</p>
</div>
<div className='relative space-y-2'>
<label htmlFor="">Image Alt</label>
<input 
type="text" 
placeholder='image Alt'
className="resize-none block bg-white dark:bg-black px-2 py-2 rounded-lg focus:outline-none  w-full focus:ring-2 focus:ring-purple   duration-200 " />
</div>

<Button type='button' className={"rounded-lg w-full"}>Submit</Button>
</div>
</Dropdown>

</div>
</div> */}


{/* <div className="md:space-x-5 my-5 max-md:flex-col max-md:space-y-2 md:flex ">
<Controller
 control={control}
 name="pinned"
 render={({
   field: { onChange, onBlur, value, name, ref },
   fieldState: { invalid, isTouched, isDirty, error },
   formState,
 }) => (
   <Toggle
     onBlur={onBlur}
     onChange={onChange} 
     checked={value}
     ref={ref}
     title={"Pin Post"}
   />
 )}
/>

<Controller
 control={control}
 name="archived"
 render={({
   field: { onChange, onBlur, value, name, ref },
   fieldState: { invalid, isTouched, isDirty, error },
   formState,
 }) => (
   <Toggle
     onBlur={onBlur}
     onChange={onChange} 
     checked={value}
     ref={ref}
     title={"Archive Post"}
   />
 )}
/>

<Controller
 control={control}
 name="discussions"
 render={({
   field: { onChange, onBlur, value, name, ref },
   fieldState: { invalid, isTouched, isDirty, error },
   formState,
 }) => (
   <Toggle
     onBlur={onBlur}
     onChange={onChange} 
     checked={value}
     ref={ref}
     title={"Lock Discussions"}
   />
 )}
/> 
</div> */}


                   {/* <EmblaCarousel 
                  //  options={{ dragFree: true, loop: true }}
                   >
                 {images.map((src, index) => (
                              <div className="embla__slide" key={index}>
                              <div className="embla__parallax">
                                <div className="embla__parallax__layer">
                                  <img
                                    className="embla__slide__img embla__parallax__img"
                                    src={src}
                                    alt={`Slide ${index + 1}`}
                                    key={index}
                                  />
                                </div>
                              </div>
                            </div>
                       ))}
                   </EmblaCarousel> */}




                                                                   {/* <div className= "h-full bg-gradient-to-tr p-3 from-lbtn to-lcard dark:from-dbtn dark:to-dcard rounded-xl items-center align-middle justify-center flex flex-col space-y-1 text-lfont">
                                                       <div className="bg-lcard dark:bg-dcard rounded-2xl text-sm p-3">
                                                         <FiUpload />
                                                       </div>
                                                       <p className="text-sm ">Drop your image or browse</p>
                                                       <p className="text-[10px]">upload file up to 2mb</p>
                                                    </div> */}
                                                    {/* <ImageInput   */}
                                                    {/* // src={ */}
              // croppedAvatar
            //     && URL.createObjectURL(croppedAvatar)
            //     // : user.avatarUrl || avatarPlaceholder
            {/* // } */}
            {/* // onImageSelected={setCroppedAvatar}/> */}



                                             {/* <UploadButton
                                    appearance={{
                                    button:"after:cursor-not-allowed w-[200px] after:bg-lcard after:text-lfont  ut-ready:bg-lcard  rounded-r-none bg-lcard rounded-lg border border-lbtn dark:border dark:border-dfont hover:text-purple  hover:bg-lbtn dark:hover:bg-dbtn dark:hover:bg-dfont  py-1  text-lfont dark:bg-dbtn duration-500 ",
                                    allowedContent:"text-lfont h-8  justify-center px-2 ",
                                    }}
                                    endpoint="imageUploader"
                                    onClientUploadComplete={(res) => {
                                    console.log("Files: ", res[0].url);
                                    editor.chain().focus().setImage({ src:res[0].url}).run()
                                    }}
                                    onUploadError={(error) => {
                                    console.log(error.message);
                                    }}
                               /> */}




                              //  const newAvatarFile = croppedAvatar
                              //  ? new File([croppedAvatar], `post.webp`)
                              //  : undefined;
                              //  console.log(values);
                              // const imageUrl = uploadMutation.mutate(newAvatarFile, {
                              //    onSuccess: () => {
                              //      setCroppedAvatar("");
                              //    },
                              //  });
                              //  console.log(imageUrl)







                              

                              
 {/* {imageUrl 
                                    ? 
                                    <>
                                      <img
                                         src={imageUrl}
                                         alt='avatar preview'
                                         width={150}
                                         height={150}
                                         className='size-32 w-full flex-none rounded-2xl object-cover'/>
                                          <button type="button" onClick={()=>{
                                            // const FilterValue = files.filter(file => imageUrl !== file.url) ;  setFiles(FilterValue);setValue('files',FilterValue) ; 
                                            setImageUrl(null) ;setThumbnailFile(null)
                                            }  } 
                                            className="text-black border-2 rounded-lg px-3 py-1 w-full text-center text-sm dark:border-white etxt-black dark:text-white disabled:cursor-not-allowed">
                                              Change Thumbnail
                                          </button>
                                    </>
                                    :
                                    <> */}
                                    {/* <UploadButton
                                    appearance={{
                                      button:
                                        "w-full text-[10px] rounded-r-none rounded-lg  bg-black text-white dark:bg-white dark:text-black ut-uploading:bg-transparent border-2 border-black dark:border-white ut-uploading:text-black ut-uploading:border-black duration-500",
                                      allowedContent:
                                        " h-5  justify-center px-2 ",
                                    }}
                                    endpoint="imageUploader"
                                    onClientUploadComplete={(res) => {
                                      console.log("Files: ", res[0].url);
                                      setValue("image", res[0].url, {
                                        shouldValidate: true,
                                      });
                                      // setFiles((prevFiles) => {
                                        const key = res[0].key
                                        const url = res[0].url
                                        const updatedFiles = [{ url, key }];
                                      //   setValue('files', updatedFiles, {
                                      //     shouldValidate: true,
                                      //   });
                                      //   return updatedFiles; });
                                      setThumbnailFile(updatedFiles)
                                     setImageUrl(res[0].url)
                                     ArchiveMutation.mutate(res[0].key)
                                    }}
                                    onUploadError={(error) => {
                                      console.log(error.message);
                                    }}
                                  />
                                   <input type="text" className="bg-lcard py-2 px-3 rounded-lg dark:bg-dcard" placeholder="imgae Url"   value={imageInput} onChange={(e)=>{setImageInput(e.target.value)}}/>
                                   <button className="bg-black text-white rounded-lg w-full py-2 px-3 text-sm dark:bg-white dark:text-black" onClick={()=>{setImageUrl(imageInput)}}> 
                                       Add Image Url
                                   </button> */}
                                                                       {/* </>
                                    } */}









