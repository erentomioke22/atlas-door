import React, { useEffect, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { commentValidation } from "@lib/validation";
import { useSession } from "next-auth/react";
import { useForm, Controller } from "react-hook-form";
import { useSubmitCommentMutation } from "./mutations";
import LoadingIcon from "@components/ui/loading/LoadingIcon";
import { useEditCommentMutation } from "./mutations";
import CommentTextEditor from "@components/commentTextEditor";
import Dropdown from "@components/ui/dropdown";
import Button from "@components/ui/button";
import { IoSend } from "react-icons/io5";
import { FaCaretRight } from "react-icons/fa6";
import { FaCheck } from "react-icons/fa6";

const CommentInput = ({
  post,
  title,
  header,
  content,
  commentId,
  reply,
  edit,
  replyId,
  placeHolder,
  btnStyle,
  category,
  setCommentId,
  setReplyInfo,
setMessage
}) => {
  const { data: session } = useSession();
  const addMutation = useSubmitCommentMutation(post?.id,category);
  const editMutation = useEditCommentMutation(post?.id,category);

  const [onClose, setOnClose] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    resolver: yupResolver(commentValidation),
    defaultValues: {
      content: "",
      userId: session?.user?.id,
      parentId: commentId,
      name: session?.user?.name,
      email: session?.user?.email,
      userId: session?.user?.id,
      image: session?.user?.image,
    },
  });

  useEffect(() => {
    if (session) {
      setValue("name", session?.user.displayName);
      setValue("userId", session?.user.id);
      setValue("email", session?.user.email);
      setValue("image", session?.user.image);
    }
  }, [session, setValue]);

  useEffect(() => {
    setValue("content", content);
  }, [content]);

  const onSubmit = async (values) => {
    console.log(values);
    
    if (content) {
      // If edit is true, we're editing a comment
      editMutation.mutate(
        {
          post,
          content: values.content,
          userId: values.userId,
          commentId: replyId || commentId,
          name:values.name, 
          email:values.email, 
        },
        {
          onSuccess: () => {
            reset();
            setOnClose(true); // Close the dropdown after edit
            setCommentId(null)
            setMessage(null)
            setReplyInfo(null)
          },
        }
      );
    } else {
      // Otherwise we're adding a new comment or reply
      addMutation.mutate(
        {
          post,
          content: values.content,
          userId: values.userId,
          parentId: commentId,
          name:values.name, 
          email:values.email, 
        },
        {
          onSuccess: () => {
            reset();
            setOnClose(true); 
            setCommentId(null)
            setMessage(null)
            setReplyInfo(null)
            // Close the dropdown after submit
          },
        }
      );
    }
  };

  // const onSubmit = async (values) => {
  //   console.log(values);
  //   // if(!commentId && !content && !reply && !edit){
  //   // if(!content  && !edit){
  //   addMutation.mutate(
  //     {
  //       post,
  //       content: values.content,
  //       userId: values.userId,
  //       parentId: commentId,
  //     },
  //     {
  //       onSuccess: () => {
  //         reset();
  //       },
  //     }
  //   );
  //   // }

  //   // if(commentId && !reply && !edit){
  //   if (commentId && !reply && !edit) {
  //     editMutation.mutate(
  //       {
  //         post,
  //         content: values.content,
  //         userId: values.userId,
  //         commentId,
  //       },
  //       {
  //         onSuccess: () => {
  //           reset();
  //         },
  //       }
  //     );
  //   }

  //   //   if(commentId && reply && !edit){
  //   //   replyMutation.mutate({
  //   //   content:values.content,
  //   //   userId:values.userId,
  //   //   commentId
  //   //   },{
  //   //   onSuccess: () => {
  //   //     reset();
  //   //     },
  //   //   })
  //   // }

  //   //   if(replyId && reply && edit){
  //   //   editReplyMutation.mutate({
  //   //   content:values.content,
  //   //   userId:values.userId,
  //   //   replyId
  //   //   },{
  //   //   onSuccess: () => {
  //   //     reset();
  //   //     },
  //   //   })
  //   // }
  // };
  return (
    <div
    className="w-full"
      // title={title}
      // position={"bottom-0 left-0"}
      // size={"h-3/6 w-full"}
      // btnStyle={btnStyle}
      // onClose={onClose}
      // className={
      //   "right-0 bg-white dark:bg-black dark:border-dbtn border border-lbtn px-3 w-72  shadow-lg"
      // }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-5 gap-1">
        <div className="col-span-4 flex-1">
        {(session && session?.user.role === "admin") || (
          <>
            <input
              className="block  w-full p-2 text-sm bg-lcard dark:bg-dcard focus:outline-none focus:ring-2 rounded-lg duration-200 focus:ring-black dark:focus:ring-white text-right"
              type="text"
              placeholder="نام "
              {...register("name")}
              name="name"
            />
            <div
              className={`text-red mt-2  text-[10px] md:text-sm transition-opacity duration-300  ${
                errors?.name?.message ? "opacity-100" : "opacity-0"
              }`}
            >
              {errors?.name?.message}
            </div>
            <input
              className="block  w-full p-2 text-sm bg-lcard dark:bg-dcard focus:outline-none focus:ring-2 rounded-lg duration-200 focus:ring-black dark:focus:ring-white text-right"
              type="email"
              placeholder="ایمیل"
              {...register("email")}
              name="email"
            />
            <div
              className={`text-red mt-2  text-[10px] md:text-sm transition-opacity duration-300  ${
                errors?.email?.message ? "opacity-100" : "opacity-0"
              }`}
            >
              {errors?.email?.message}
            </div>
          </>
        )}
        <Controller
          name="content"
          control={control}
          render={({ field }) => (
            <CommentTextEditor
              content={field.value}
              onChange={field.onChange}
              ref={field.ref}
              title={`WRITE YOUR ${placeHolder} HERE ...`}
            />
          )}
        />
        <div
          className={`text-red mt-2 text-start text-[10px] md:text-sm transition-opacity duration-300  ${
            errors?.content?.message ? "opacity-100" : "opacity-0"
          }`}
        >
          {errors?.content?.message}
        </div>
        </div>

        <div className="col-span-1 mt-1">

          <Button
            variant="menuActive"
            className="rounded-full  text-lg py-1 px-3 "
            disabled={
              content
                ? editMutation.isPending
                : addMutation.isPending
            }
            type="submit"
          >
            {content ? (
              editMutation.isPending ? (
                <LoadingIcon color={"bg-white dark:bg-black my-1"}/>
              ) : (
                <FaCheck/>
              )
            ) 
            : 
            addMutation.isPending ? (
              <LoadingIcon color={"bg-white dark:bg-black my-1"}/>
            ) : (
              <IoSend/>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CommentInput;
