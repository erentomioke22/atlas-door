"use client";

import React, { useState, useEffect } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {  toast } from 'sonner'
import LoadingIcon from "@components/ui/loading/LoadingIcon";
import { useForm } from "react-hook-form";
import { settingProfileValidation } from "@lib/validation";
import { yupResolver } from "@hookform/resolvers/yup";
import { useUpdateProfileMutation } from "./mutation";
import { FaCaretLeft } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import {useQueryClient,useQuery } from "@tanstack/react-query";
import Dropdown from "@components/ui/dropdown";
import AvatarInput from './avatarInput'
import { useUploadThing } from "@lib/uploadthing";
import ImageCom from "@components/ui/Image";
import Offcanvas from "@components/ui/offcanvas";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaArrowLeftLong } from "react-icons/fa6";
import axios from "axios";
import { useDeleteUserMutation } from "./mutation";
import { useDeleteAccountMutation } from "./mutation";
import { FcGoogle } from "react-icons/fc";
import { BsTwitterX } from "react-icons/bs";
import { FaGithub } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa6";
import { useDeleteSessionMutation } from "./mutation";




const Page = () => {
  const { data: session, update } = useSession();
  const [showpass, setShowPsss] = useState(false);
  const [onClose,setOnClose]=useState(false);
  const mutation = useUpdateProfileMutation();
  const [skills, setSkills] = useState([]);
  const[removedAvatar,setRemovedAvatar]=useState('')
  const [selectedImage, setSelectedImage] = useState();
  const [selectedInputImage, setSelectedInputImage] = useState();
  const path = usePathname();
  const router = useRouter();
  const deleteUserMutation = useDeleteUserMutation();
  const deleteSessionMutation = useDeleteSessionMutation();
  // const deleteAccountMutation = useDeleteAccountMutation();

  // const {
  //   register:passwordRegister,
  //   handleSubmit:passwordHandleSubmit,
  //   formState: { passwordErrors },
  //   reset:passwordReset,
  //   control:passwordControl,
  //   setValue:passwordSetValue,
  //   watch:passwordWatch,
  //   getValues:passwordGetValue
  // } = useForm({
  //   resolver: yupResolver(settingPasswordValidation),
  // });

  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
    setValue,
    watch,
    getValues
  } = useForm({
    resolver: yupResolver(settingProfileValidation),
    defaultValues:{
    }
  });




  useEffect(() => {
    if (session) {
     setValue("name", session?.user.name ?? "");
      setValue("displayName", session?.user.displayName ?? "");
      setValue("address", session?.user.address ?? "");
      setValue("phone", session?.user.phone);
      setSkills(session?.user.skills)
      setValue("image", session?.user.image ?? "");
      setSelectedImage(session?.user.image);
    }
  }, [session]);

  const {startUpload,isUploading} = useUploadThing("avatar", {
    onClientUploadComplete: (data) => {
      toast.success("uploaded successfully!");
      // console.log(data)
      setValue('image',data[0].url)
    },
    onUploadError: () => {
      throw new Error('error occurred while uploading')
    },
    onUploadBegin: ({ file }) => {
      // console.log("upload has begun for", file);
    },
  });


  const onSubmit = async (values) => {
    try{
      // console.log(values,removedAvatar);
      if (values.image && typeof values.image !== "string") {
        const uploadPromises = await startUpload([values.image]);
        // console.log(uploadPromises);
      }
      mutation.mutate({values,removedAvatar},{
          onSuccess:()=> {
            // console.log(values)
            queryClient.invalidateQueries(["user", session?.user.name]);
          },
        }
      );
      update(values)
    }
    catch(e){
      console.error(e)
    }
  };

  const userForm = [
    {
      title: "نام كاربري",
      name: "displayName",
      type: "text",
      value: "",
      input:"input",
      error: errors.displayName?.message,
      register:register

    },
    {
      title: "شماره همراه",
      name: "phone",
      type: "text",
      input:"textarea",
      value: "",
      error: errors.phone?.message,
    register:register

    },
    {
      title: "آدرس",
      name: "address",
      type: "text",
      value: "",
      input:"input",
      error: errors.address?.message,
      register:register
      
    },

  ];



const btnLists =[
  {
    name:"اطلاعات پروفايل",
    info:"ويرايش اطلاعات مربوط به آدرس و تلفن و ...",
    // link:                
    //  <div className="flex space-x-2 mt-1">
    //                         <div className="relative h-10 w-10 ">
    //                               {session?.user?.image === null ?
    //               <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-redorange to-yellow"></div>
    //               :
    //               <ImageCom
    //               className="rounded-xl h-10 w-10 "
    //               src={session?.user.image}
    //               alt={session?.user?.displayName}

    //             /> 
    //               }
    //                     </div>
    //    <p >{session?.user.displayName}</p>
    //  </div>,
    link:                
     <FaCaretLeft/>,
    input:userForm,
    submit:handleSubmit(onSubmit),
  },
  // {
  //   name:"Profile design",
  //   info:"change your profile background color",
  //   link:<div className=" p-5 rounded-xl" style={rootGradientStyle}></div>,
  //   input:brandForm,
  //   submit:handleSubmit(onSubmit),
  // },
  // session?.user.emailVerified ? 
  // {
  //   name:"Password",
  //   info:"change your account current password ",
  //   link:"********",
  //   input:passwordForm,
  //   submit:passwordHandleSubmit(onSubmit),
  // }
  // :
  // undefined
].filter(Boolean)





// const { data, status } = useQuery({
//   queryKey: ["account-info"],
//   queryFn: async () => {
//     const response = await axios.get(
//       `/api/users/${session?.user.id}/accounts`
//     );
//     return response.data;
//   },
//   // staleTime: Infinity,
// });

// // console.log(data)



// const providers = [
//   {
//     name: "google",
//     icon: <FcGoogle />,
//   },
//   {
//     name: "github",
//     icon: <FaGithub className="text-lfont" />,
//   },
//   {
//     name: "twitter",
//     icon: <BsTwitterX />,
//   },
//   {
//     name: "linkedin",
//     icon: <FaLinkedin className="text-blue" />,
//   },
// ];

  return (
        <div className="px-3  md:px-20 lg:px-52 xl:px-96 space-y-10 ">
              
              
              
              <div className="flex justify-between text-lg">
      <h1>تنظيمات</h1>
                     <button
                         className={"text-sm px-3  py-1    flex"}
                         onClick={() => router.back()}
                         type="button"
                               >
                                بازگشت
                                <FaArrowLeftLong className="my-auto "/>
                         </button>
    </div>


            <div  className="space-y-10  rounded-2xl text-sm ">

            {!session ? (
            Array(6)
              .fill({})
              .map((_,index) => {
                return (
                  <div key={index} className="animate-pulse  py-2 px-3">
                      <div className="bg-lcard dark:bg-dcard rounded-lg h-10 w-full"></div>
                  </div>
                );
              })
          ) : (
            <>
              <div  className="flex justify-between w-full  duration-300 px-3">
                  <div className="text-start">
                   <p>آدرس ايميل</p>
                  </div>
                  <div className="text-lfont">
                    {session?.user.email}
                  </div>
                </div>

              <div  className="flex justify-between w-full  duration-300 px-3">
                  <div className="text-start">
                   <p>نام كاربري</p>
                  </div>
                  <div className="text-lfont">
                    {session?.user.name}
                  </div>
                </div>

            {btnLists.map((btnList)=>{
             return(
             <form onSubmit={btnList?.submit} key={btnList?.name}>
              <Offcanvas 
                title={                  
<>
                  <div className="text-start">
                   <p>{btnList?.name}</p>
                   <p className="text-lfont text-[10px]">{btnList?.info}</p>
                  </div>
                  <div> 
                    {btnList?.link}
                  </div>
                  </>   
                  }
                header={btnList?.name}
                btnStyle={"py-2 w-full  px-3  rounded-lg   hover:bg-lcard dark:hover:bg-dcard flex justify-between w-full  duration-300"}
                headerStyle={"capitalize text-2xl "}
                // className={"right-0  dark:border-dbtn border border-lbtn px-3 w-full sm:w-72  shadow-lg"}
                      position={"top-0 right-0"} size={"h-screen max-w-full w-80 border-l-2 border-l-lcard dark:border-l-dcard"} openTransition={"translate-x-0"} closeTransition={"translate-x-full"} onClose={onClose}
                >

       <div className="flex justify-between mb-5">
          <h1 className={" text-xl "}>
          {btnList?.name}
          </h1>

          <button
            onClick={() => {setOnClose(!onClose)
            }}
            className="  text-lg bg-lcard dark:bg-dcard px-2 py-1  rounded-full border-2 text-lfont"
            type="button"
          >
            <IoClose/>
          </button>
        </div>
                 <div className="space-y-5">
                   
                    {/* {
                      btnList?.input === userForm &&  
                       <div className="">
                        <div className="flex space-x-2">
                                <AvatarInput selectedImage={selectedImage}  avatar={session?.user?.image} setSelectedImage={setSelectedImage} selectedInputImage={selectedInputImage}  setSelectedInputImage={setSelectedInputImage} setValue={setValue}  removedAvatar={removedAvatar} setRemovedAvatar={setRemovedAvatar}/>
                              <p className="text center my-auto text-lfont">For change Profile Avatar click on Image</p>
                        </div>
                                      <div
                                         className={`text-red  text-[10px] md:text-sm transition-opacity duration-300  ${
                                           errors?.image?.message ? "opacity-100" : "opacity-0"
                                         }`}
                                       >
                                         {errors?.image?.message}
                                       </div>

                       </div>   
                    } */}

                    {/* {
                      btnList?.input === brandForm && 
                       <div style={gradientStyle} className={` w-full h-28 rounded-2xl   `}></div>
                    } */}

                      <div className="flex flex-col space-y-3 w-full">
                         {btnList?.input?.map((value) => {
                           return (
                             <div key={value.name} className="relative capitalize space-y-1">
                             <label>{value.title}</label>
                             <value.input
                               title={value.title}
                              //  onInput={value.onInput}
                               name={value.name}
                               type={value.type}
                               error={value.error}
                               placeholder={value.title}
                              //  label={true}
                              className={`${value.error  ? "border-red  focus:ring-2 ring-red" : " focus:ring-2 ring-black dark:ring-white "} resize-none w-full appearance-none  rounded-xl px-3 py-3 block  text-sm focus:outline-none dark:bg-dcard  bg-lcard  duration-200  `}
                               {...value?.register(value.name)}
                             />                
                             <div className={`text-red mt-2  text-[10px] md:text-sm transition-opacity duration-300 ${value.error ? "opacity-100" : "opacity-0"}`}>{value.error}</div>
                             
                             
                             
                             {/* {value.name === "confirmPassword" && (
                                 <button
                                    className="bg-black rounded-full text-lcard dark:bg-white dark:text-black   px-3  mt-1 flex ml-auto text-end"
                                   onClick={() => setShowPsss(!showpass)}
                                   type="button"
                                 >
                                   {showpass ? <FaRegEye /> : <FaRegEyeSlash />}
                                 </button>
                               )} */}

                           </div>
                           );
                         })}
           
                       </div>
           
      

                         <button
                           disabled={mutation.isPending || isUploading}
                           type="submit"
                           className="bg-black my-3 rounded-lg text-white dark:bg-white dark:text-black w-full py-2 mx-auto disabled:brightness-90 disabled:cursor-not-allowed text-center flex justify-center"
                         >
                           {mutation.isPending || isUploading ? <LoadingIcon color={"text-black dark:text-white dark:fill-black fill-white mx-auto"}/> : "ثبت تغييرات"}
                         </button>


                 </div> 
          
          

             </Offcanvas>        
             </form>
             )
            })}



<div>
            {/* {status === "pending" ? (
    <div className="space-y-5">
      {Array(6)
        .fill({})
        .map((_, index) => {
          return (
            <div key={index} className="animate-pulse  py-2 px-3">
              <div className="bg-lcard dark:bg-dcard rounded-lg h-10 w-full"></div>
            </div>
          );
        })}
    </div>
  ) : ( */}
    <div className="space-y-10">
       
        {/* {status === "success" && post?.length <= 0  &&
      <p className="text-center text-muted-foreground">
        هيچ اطلاعاتي يافت نشد
      </p>
  }
  {status === "error" || post?.error &&

      <p className="text-center text-destructive">
        مشكلي در برقراري ارتباط وجود دارد
      </p>

  } */}
      <div className="space-y-5">
        <button
          className="flex justify-between w-full hover:text-purple duration-300 px-3"
          onClick={() => {
            deleteSessionMutation.mutate(session?.user.id);
          }}
          type="button"
        >
          <div className="text-start">
            <p className="text-redorange">خروج از تمامي حساب ها</p>
            <p className="text-lfont text-[10px]">
             خروج از دسترسي ها در دستگاه هاي ديگر
            </p>
          </div>
          {deleteSessionMutation.isPending ? (
            <LoadingIcon color={"bg-redorange"} />
          ) : (
            <FaCaretLeft />
          )}
        </button>

      </div>


      {/* <div className="space-y-5 rounded-2xl">
        {providers.map((provider, index) => {
          const isConnected = data?.some(
            (account) => account.provider === provider.name
          );
          return (
            <div key={provider.name}>
              {!isConnected && (
                <button
                  type="button"
                  onClick={() => {
                    signIn(provider.name);
                  }}
                  className="w-full flex gap-3 py-1 px-3 text-sm hover:text-purple duration-300"
                >
                  <p className="text-2xl my-auto">{provider.icon}</p>
                  <div className="text-start">
                    <p>متصل به حساب {provider.name}</p>
                    <p className="text-[10px] text-lfont">
                      نزد ما محفوظ ميباشد. {provider.name} طبق قوانين ما تمامي اطلاعات مربوط به حساب
                    </p>
                  </div>
                </button>
              )}
              {data
                ?.filter((account) => account.provider === provider.name)
                .map((account) => (
                  <button
                    key={account.providerAccountId}
                    type="button"
                    disabled={data?.length <= 1}
                    onClick={() => {
                      deleteAccountMutation.mutate({
                        provider: provider.name,
                        providerAccountId: account.providerAccountId,
                      });
                    }}
                    className="w-full flex gap-3 py-1 px-3 text-sm hover:text-purple duration-300 disabled:cursor-not-allowed"
                  >
                    <p className="text-2xl my-auto">{provider.icon}</p>
                    <div className="text-start">
                      <p className="text-redorange">
                        غير فعال {provider.name}
                      </p>
                      <p className="">{account.email}</p>
                      <p className="text-[10px] text-lfont">
                          شما براي غير فعال كردن اكانت ابتدا بايد يك حساب فعال ديگر داشته باشيد
                      </p>
                    </div>
                  </button>
                ))}
            </div>
          );
        })}
      </div> */}

      <div className="space-y-5">
        <button
          onClick={() => {
            deleteUserMutation.mutate();
          }}
          className="flex justify-between w-full  hover:text-purple duration-300  px-3 "
          type="button"
        >
          <div className="text-start">
            <p className="text-red">حذف حساب</p>
            <p className="text-lfont text-[10px]">
              با انتخاب اين گزينه تمام اطلاعات مربوط به شما حذف خواهد شد
            </p>
          </div>
          {deleteUserMutation.isPending ? (
            <LoadingIcon color={"bg-red"} />
          ) : (
            <FaCaretLeft />
          )}
        </button>
      </div>
    </div>
  {/* // )} */}
</div>

            </>
              )}


                 

            </div>



        </div>

  );
};

export default Page;

