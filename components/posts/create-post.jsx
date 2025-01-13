"use client";

import React from "react";
import { useState} from "react";
import TextArea from "@components/ui/TextArea";
import Dropdown from "@components/ui/dropdown";
import { toast } from 'sonner'
import { useSubmitPostMutation } from "./mutations";
import LoadingSpinner from "@components/ui/loading/loadingSpinner";
import { postValidation } from "@lib/validation";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import BlockEditor from "@components/BlockEditor/BlockEditor";
import {  useMemo,  } from 'react'
import { Doc as YDoc } from 'yjs'
import usePreventNavigation from "@hook/usePreventNavigation";
import { useSession } from "next-auth/react";
import { savePostValidation } from "@lib/validation";
import { useUploadThing } from "@lib/uploadthing";
import NotFound from "@app/(main)/not-found";
import {useInfiniteQuery,useMutation,useQueryClient,useQuery} from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import axios from "axios";
import EmblaCarousel from "@components/ui/carousel/carousel";
import { FaImage } from "react-icons/fa6";
import { FaCheck,FaQuestion } from "react-icons/fa";
// import ImageInput from "@components/ui/imageInput";
// import { FaSort } from "react-icons/fa6";
import Accordion from "@components/ui/Accordion";
import ImageCom from "@components/ui/Image";


const CreatePost = () => {
  // const { data: session } = useSession();
  // const [dropTag, setDropTag] = useState([]);
  // const router = useRouter();
  // const[files,setFiles]=useState([])
  // const [editorContent,setEditorContent]=useState()
  // const[deletedFiles,setDeletedFiles]=useState([])
  // const[deletedPostFiles,setDeletedPostFiles]=useState([])
  // const [preventNavigation, setPreventNavigation] = useState(false); 
  // const [thumnailIndex, setThumnailIndex] = useState(0)
  // const [contentImages, setContentImage] = useState();
  // const [cancel, setCancel] = useState(false);
  // const [editIndex, setEditIndex] = useState(null);
  // const [answer, setAnswer] = useState('');
  // const [question, setQuestion] = useState('');
  // const [faqs, setFaqs] = useState([]);
  // const ydoc = useMemo(() => new YDoc(), [])
  // const blobUrlToUploadedUrlMap = [];
  // const mutation = useSubmitPostMutation();
  // usePreventNavigation(preventNavigation);
  // // const [selectedImage, setSelectedImage] = useState();
  // // const[rmThumbnailFile,setRmThumbnailFile]=useState([])
  // // const [selectedInputImage, setSelectedInputImage] = useState();
  // // const [editIndex, setEditIndex] = useState(null);
  // // const [provider, setProvider] = useState(null)
  // // const [imageUrl, setImageUrl] = useState();
  // // const [collabToken, setCollabToken] = useState()
  // // const [selectedTeam, setSelectedTeam] = useState(null);
  // // const searchParams = useSearchParams()
  // // const hasCollab = parseInt(searchParams?.get('noCollab') ) !== 1 && collabToken !== null
  // // const uploadMutation = useUploadMutation();
  // // console.log(thumnailIndex,contentImages)
  // // console.log(files)
  // // console.log(blobUrlToUploadedUrlMap)
  // const baseUrl = `${process.env.NEXT_PUBLIC_BASE_URL}`;

  
  
  
  // if(!session){
  //   NotFound()
  // }


  
  // // const queryClient = useQueryClient();
  // // const { data,status,error,isFetching } = useQuery({
  // //   queryKey:["team-author"],
  // //   queryFn: async () => {const response = await axios.get(`/api/team`);
  // //     return response.data;
  // //   },
  // //     staleTime: Infinity,
  // //   });



  // const {
  //   register,
  //   handleSubmit,
  //   formState: { errors },
  //   reset,
  //   control,
  //   setValue,
  //   getValues
  // } = useForm({
  //   defaultValues: {
  //     title: '',
  //     desc:'',
  //     image: '',
  //     content: '',
  //     tags: [],
  //     contentImages: [],
  //     // teamId:''
  //   },
  //   resolver: yupResolver(postValidation),
  //   // resolver: yupResolver(save ? savePostValidation : postValidation),
  // });








  // const onSubmit = async (values) => {
  //   try{
  //     // console.log(values)
  //     setPreventNavigation(true);   

  //       if (thumnailIndex && !thumnailIndex.startsWith('blob:')) {
  //         setValue('image', thumnailIndex);
  //       } 
  //       //  console.log(values)
  //        mutation.mutate(values,{
  //          onSuccess: () => {
  //            setPreventNavigation(false);
  //            reset();
  //            setDropTag([]);
  //            setFiles([])
  //            router.back()
  //          },
  //        });
  //   }
  //   catch(err){
  //     toast.error(err.message || 'An error occurred');
  //     // console.log(err.message)
  //   }
  // };




  // const handleAddTag = (newTag) => {
  //   if (newTag && !dropTag.includes(newTag) 
  //     // && dropTag.length < 4
  //   ) {
  //     const addTags = [...dropTag, newTag].filter(tag =>tag)
  //     setDropTag(addTags);
  //     setValue("tags",addTags, { shouldValidate: true });
  //   }
  // };

  // const handleRemoveTag = (tag) => {
  //   const removetag = dropTag.filter((t) => t !== tag)
  //   setDropTag(removetag);
  //   setValue("tags", removetag);
  // };


  // function handleTag(name) {
  //   const existTag = dropTag.includes(name.name);

  //   if (existTag) {
  //     const updateTag = dropTag.filter((tag) => tag !== name.name);
  //     // console.log(updateTag);
  //     setDropTag(updateTag);
  //     setValue("tags", updateTag, { shouldValidate: true });
  //   } 
  //   else 
  //   // if(dropTag.length < 4) 
  //   {
  //     setDropTag([...dropTag, name.name]);
  //     setValue("tags", [...dropTag, name.name], { shouldValidate: true });
  //   }
  // }

  // const handleInputKeyPress = (e) => {
  //   if (e.key === 'Enter') {
  //     e.preventDefault();
  //     const newTag = e.currentTarget.value.trim();
  //     handleAddTag(newTag);
  //     e.currentTarget.value = '';
  //   }
  // };






  // const handleAddFaq = () => { 
  //   if (editIndex !== null) { 
  //     const updatedFaqs = faqs.map((faq, index) => index === editIndex ? { question, answer } : faq ); 
  //     setFaqs(updatedFaqs); 
  //     setValue("faqs", updatedFaqs, { shouldValidate: true });
  //     setEditIndex(null); 
  //   } else { 
  //     setFaqs([...faqs, { question, answer }]); 
  //     setValue("faqs", [...faqs, { question, answer }], { shouldValidate: true });
  //   } 
  //    setAnswer('');
  //    setQuestion(''); 
  //   };

  // const handleRemoveFaq = (index) => {
  //   const removeFaq = faqs.filter((_,i) => i !== index)
  //   setFaqs(removeFaq);
  //   setValue("faqs", removeFaq);
  // };

  // const handleEditFaq = (index) => { 
  //   const faq = faqs[index]; 
  //   setQuestion(faq.question); 
  //   setAnswer(faq.answer); 
  //   setEditIndex(index); 
  // };



  // // console.log(files)


  
  // const tags = [
  //   { id: "1",  name: "درب اتوماتیک", info: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sed, rerum!" },
  //   { id: "2",  name: "کرکره برقی", info: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sed, rerum!" },
  //   { id: "3",  name: "جک پارکیگ", info: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sed, rerum!" },
  //   { id: "4",  name: "راهبند پارکینگ", info: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sed, rerum!" },
  //   { id: "5",  name: "شیشه بالکنی", info: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sed, rerum!" },
  //   { id: "6",  name: "پرده برقی", info: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sed, rerum!" },
  //   { id: "7",  name: "سایبان برقی", info: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sed, rerum!" },
  //   { id: "8",  name: "شیشه سکوریت", info: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sed, rerum!" },
  //   { id: "9",  name: "جام بالکن", info: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sed, rerum!" },
  //   { id: "10",  name: "لمینت", info: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sed, rerum!" },
  //   { id: "11",  name: "آیینه", info: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sed, rerum!" },
  //   { id: "12",  name: "upvc", info: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sed, rerum!" },
  // ];


  return (
<></>

//       <div className="mb-2">
        
//     <form onSubmit={handleSubmit(onSubmit)} className="space-y-7">
       
       

//                     { !cancel &&
//               <div className="flex justify-between  w-full sticky top-0 bg-white dark:bg-black z-[10] py-2 px-2 sm:px-5">
//                     <div className="">

                   
//                       <Dropdown 
//                           title={"CRAETE POST"}
//                           btnStyle={"bg-black text-white  border-black dark:border-white dark:bg-white dark:text-black rounded-full border-2 text-[10px] md:text-sm px-3  py-1  md:text-sm duration-300  disabled:cursor-not-allowed   "}
//                           className={"right-0  z-50 h-fit w-72 px-3 bg-white border border-lbtn  dark:border-dbtn dark:bg-black"}>
//                              <div className="space-y-2">
//                                  <div className="space-y-2">
//                                  <p className="text-sm">Thumbnail preview</p>
//                                   {/* <ImageInput selectedImage={selectedImage}  setSelectedImage={setSelectedImage} selectedInputImage={selectedInputImage}  setSelectedInputImage={setSelectedInputImage} setValue={setValue} rmThumbnailFile={rmThumbnailFile} setRmThumbnailFile={setRmThumbnailFile}/> */}
//                                       {/* <div
//                                          className={`text-red  text-[10px] md:text-sm transition-opacity duration-300  ${
//                                            errors?.image?.message ? "opacity-100" : "opacity-0"
//                                          }`}
//                                        >
//                                          {errors?.image?.message}
//                                        </div> */} 
//                                        {contentImages?.length > 0 ? 
//                                         <EmblaCarousel options={{ loop: false,direction:'rtl' }} dot={true} autoScroll={false}>
//                                                  {contentImages?.map((url,index) => (
//                                                   <div className="transform translate-x-0 translate-y-0 translate-z-0  flex-none basis-[100%] h-44 min-w-0 pl-4 " onClick={()=>{setThumnailIndex(url.replace(baseUrl, ''))}} key={index}>
//                                                      <div className={`${url.replace(baseUrl, '') === thumnailIndex && 'border-dashed border-4 border-black dark:border-white '} rounded-xl w-full h-44 relative cursor-pointer`}>
//                                                         <ImageCom className={`  w-full h-full object-cover rounded-xl`} size={'w-full h-full object-cover rounded-xl'} src={`${url.replace(baseUrl, '')}`} alt="thumnail" />
//                                                         {url.replace(baseUrl, '') === thumnailIndex &&
//                                                           <div className="absolute  inset-0 top-0 right-0  text-5xl text-white bg-black bg-opacity-50  rounded-xl flex items-center justify-center">
//                                                            <h1><FaCheck /></h1>
//                                                          </div>}
//                                                     </div>
//                                                      </div>
//                                                  ))}
//                                         </EmblaCarousel> 
//                                         :
//                                             <div 
//                                             type='button'
//                                             className='relative block w-full'
//                                             >
//                                              <div className= "h-full bg-gradient-to-tr p-3 from-lbtn to-lcard dark:from-dbtn dark:to-dcard rounded-xl items-center align-middle justify-center flex flex-col space-y-1 text-lfont text-center">
//                                                  <div className=" text-lg p-3">
//                                                    <FaImage />
//                                                  </div>
//                                                  <p className="text-sm text-black">Add Image to Content and select one of thats Images for your post Thumnail</p>
//                                                  <p className="text-[10px]">Add thumnail is good for visit and craete a popular post</p>
//                                               </div>
//                                             </div>
//                                         }

//                                  </div>
//                                  <p className="text-sm">Title , Tags & desc </p>
//                                  <div>
//                                   <TextArea
//                                   placeholder={"Write Your Post Title ..."}
//                                   name={"title"}
//                                   type={"text"}
//                                   ref={register} 
//                                   // watch={watch('title')}
//                                   label={false}
//                                   className={
//                                     "resize-none  bg-lcard dark:bg-dcard rounded-lg placeholder:text-[#000000a4] dark:placeholder:text-lfont text-lg  p-2 focus:ring-2 focus:ring-black dark:focus:ring-white outline-none duration-200"
//                                   }
//                                   error={errors?.title?.message}
//                                     {...register("title")}
//                                   />
//                                  </div>

//                                  <div>
//                                   <TextArea
//                                   placeholder={"Write Your Post Description ..."}
//                                   name={"desc"}
//                                   type={"text"}
//                                   label={false}
//                                   ref={register}
//                                   className={
//                                     "resize-none  bg-lcard dark:bg-dcard rounded-lg placeholder:text-[#000000a4] dark:placeholder:text-lfont text-sm  p-2 focus:ring-2 focus:ring-black dark:focus:ring-white outline-none duration-200"
//                                   }
//                                   error={errors?.desc?.message}
//                                     {...register("desc")}
//                                   />
//                                  </div>
                                 
//                                  <div>
//                                  <Dropdown
//                                    title={
//                                     <div className="flex space-x-5 border-2 border-black dark:border-white p-2 rounded-lg w-full max-h-36 overflow-y-auto text-wrap">
//                                     <ul className="flex flex-wrap gap-2 text-sm w-full" disabled={dropTag.length === 4}>
//                                       {dropTag.map((dropTag) => (
//                                         <li  disabled={dropTag.length === 4} key={dropTag} 
//                                             className="bg-lcard px-2 py-1 rounded-lg dark:bg-dcard space-x-2 "
//                                             onClick={() => handleRemoveTag(dropTag)}>
//                                           <span className="text-lfont">#</span>
//                                              {dropTag}{' '}
//                                           {/* <span  ><IoClose className="pt-1"/></span> */}
//                                         </li>
//                                       ))}
//                                       <li className="my-auto w-fit">
//                                        <input
//                                          type="text"
//                                          placeholder={
//                                           //  dropTag.length < 4
//                                           //    ? 
//                                              "Add up to 4 tags for post..."
//                                             //  : `You can only enter max. of ${4} tags`
//                                          }
//                                          onKeyDown={handleInputKeyPress}
//                                         //  disabled={dropTag.length === 4}
//                                          className="bg-transparent ring-0 outline-none w-fit text-wrap disabled:cursor-not-allowed px-1 "
//                                        />
//                                       </li>
//                                     </ul>
//                                   </div>
//                                       } 
//                                          btnStyle={"text-lg w-full"}
//                                          className={"left-0 -top-44 z-[55] h-44 overflow-auto w-62 rounded-lg bg-white border border-lbtn  dark:border-dbtn dark:bg-black" }
//                                        >
//                                          <div className="  text-start px-2 text-sm space-y-2">
//                                            {tags.map((tag)=>{
//                                              return(
//                                               <div
//                                                 key={tag.name}
//                                                 onClick={() => handleTag({ name: tag.name })}
//                                                 className={` ${
//                                                   dropTag.includes(tag.name)
//                                                     ? "bg-black dark:bg-white text-white dark:text-black"
//                                                     : "hover:bg-lcard dark:hover:bg-dcard text-black dark:text-white"
//                                                 }  uppercase rounded-lg duration-500 px-3 py-1 cursor-pointer`}
//                                               >
//                                                 <p>{tag.name}</p>
//                                                 <p className={` 
//                                                      text-lfont
//                                                   text-[10px] line-clamp-2`} >{tag.info}</p>
//                                               </div>
//                                              )
//                                            })}
//                                          </div>
//                                  </Dropdown>


//  <div
//    className={`text-red  text-[10px] md:text-sm transition-opacity duration-300  ${
//      errors?.tags?.message ? "opacity-100" : "opacity-0"
//    }`}
//  >
//    {errors?.tags?.message}
//  </div>

// </div>



//      <div className=" w-full ">

//            <button
//            className="bg-black rounded-lg text-white dark:bg-white dark:text-black w-full text-sm py-2 disabled:brightness-90 disabled:cursor-not-allowed "
//            disabled={mutation.isPending}
//              type="submit"
//            >
//              {
//              mutation.isPending
//              ? <LoadingSpinner color={"text-black dark:text-white dark:fill-black fill-white mx-auto"}/>  : "CRAETE POST"}
//            </button>     

          
//         </div>




//                           </div>
                                    
//                        </Dropdown>   



//                     </div>
                    
//                         <div>
//                           <button
//                               className={"bg-lcard text-lfont dark:bg-dcard rounded-full text-[10px] md:text-sm px-3 w-full py-1 border-2 "}
//                               onClick={() => setCancel(true)}
//                               type="button"
//                                     >
//                                   cancel
//                           </button>
//                         </div>


//               </div>
//                       }
//               <div className="flex  px-2 sm:px-5 py-2 w-full sticky top-0 z-[10]">

                   


//               { cancel && 
//                 <div className="flex gap-2">
//                          <button
//                          className={"bg-transparent text-redorange text-[10px] md:text-sm px-3  py-1  border-2 rounded-full  "}
//                          onClick={() => router.back()}
//                          type="button"
//                                >
//                              Cancle and delete All data
//                          </button>

//                           <button
//                             className={"bg-lcard text-lfont dark:bg-dcard border-2 rounded-full px-3 py-1 text-[10px] md:text-sm"}
//                             onClick={() => setCancel(false)}
//                             type="button"
//                             >
//                              Continue
//                           </button>
//                   </div>
//                  }

//               </div>
      


//             <div className="w-full md:w-2/3 mx-auto  space-y-3 px-3" >
//          {session && 
//                      <div className="flex gap-2">
//                       <div className="relative h-9 w-9">
//                        <ImageCom src={session?.user.image} className="h-9 w-9 rounded-lg" size={'h-9 w-9'} alt="user Avatar" />
//                       </div>
//                        <div className="flex flex-col ">
//                          <p className=" text-black dark:text-white text-sm">{session?.user.displayName}</p>
//                          <p className=" text-lfont text-[10px]">{new Date().toLocaleDateString()}</p>
//                        </div>
//                      </div>
//          }



//               <Controller
//                   name='content'
//                   control={control}
//                   render={({ field :{ onChange, onBlur, value, name, ref } }) => (
//                     <BlockEditor
//                      content={value} 
//                      onChange={onChange} 
//                      ref={ref} 
//                      ydoc={ydoc} 
//                      files={files} 
//                      setFiles={setFiles} 
//                      setEditorContent={setEditorContent} 
//                      setDeletedFiles={setDeletedFiles} 
//                      deletedFiles={deletedFiles} 
//                      setDeletedPostFiles={setDeletedPostFiles} 
//                      deletedPostFiles={deletedPostFiles} 
//                      setValue={setValue} 
//                      contentImages={contentImages} setContentImage={setContentImage}
//                      thumnailIndex={thumnailIndex} setThumnailIndex={setThumnailIndex}
//                      //  hasCollab={hasCollab}  
//                     //  provider={provider} 
//                      />
                    
//                   )}
//                />
//               <div
//                 className={`text-red mt-2 text-[10px] md:text-sm transition-opacity duration-300  ${
//                   errors?.content?.message ? "opacity-100" : "opacity-0"
//                 }`}
//               >
//                 {errors?.content?.message}
//               </div>

//               <div
//                 className={`text-red mt-2 text-[10px] md:text-sm transition-opacity duration-300  ${
//                   errors?.content?.message ? "opacity-100" : "opacity-0"
//                 }`}
//               >
//                 {errors?.content?.message}
//               </div>
//          <Dropdown className={'right-0 bg-white px-2 dark:bg-black border border-lbtn  dark:border-dbtn'} title={<FaQuestion/>} btnStyle={'bg-black text-white dark:bg-white dark:text-black rounded-full px-3 py-2'}>
//           <div className="flex flex-col space-y-1">
//             <input type="text" className="resize-none block bg-lcard dark:bg-dcard px-2 py-2 rounded-lg focus:outline-none  w-full focus:ring-2 focus:ring-black dark:ring-white   duration-200 " placeholder="question" value={question} onChange={(e)=>{setQuestion(e.target.value)}}/>
//             <textarea type="text" className="resize-none block bg-lcard dark:bg-dcard px-2 py-2 rounded-lg focus:outline-none  w-full focus:ring-2 focus:ring-black dark:ring-white   duration-200 " placeholder="answer"   value={answer} onChange={(e)=>{setAnswer(e.target.value)}}/>
//             <button type="button" className="bg-black text-white rounded-lg w-full py-2 px-3 text-sm dark:bg-white dark:text-black" onClick={handleAddFaq}> 
//             {editIndex !== null ? 'Update FAQ' : 'Add FAQ'}
//             </button>
//           </div>
//          </Dropdown>


//             </div>


//           </form>

//           <div>
//             {faqs?.map((faq,index)=>(
//               <div key={index} className="flex space-x-2">
//                  <Accordion title={faq.question}> <p>{faq.answer}</p> </Accordion>
//                  <button className="text-red" onClick={()=>handleRemoveFaq(index)}>delete</button>
//                  <button className="text-yellow" onClick={() => handleEditFaq(index)} > Edit </button>
//               </div>
//             ))}
//           </div>

//         </div>

  );
};

export default CreatePost;














