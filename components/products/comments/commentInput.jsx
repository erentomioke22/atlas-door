import React, { useEffect, useState } from "react";
import Offcanvas from "@components/ui/offcanvas";
import { yupResolver } from "@hookform/resolvers/yup";
import { commentValidation } from "@lib/validation";
import { useSession } from "next-auth/react";
import { useForm, Controller } from "react-hook-form";
import TextArea from "@components/ui/TextArea";
import { useSubmitCommentMutation } from "./mutations";
import LoadingIcon from "@components/ui/loading/loadingIcon";
import { useEditCommentMutation } from "./mutations";
import { useSubmitReplyMutation } from "./mutations";
import { useEditReplyMutation } from "./mutations";
import CommentTextEditor from "@components/commentTextEditor";
import { IoClose } from "react-icons/io5";
import Button from "@components/ui/button";
import Dropdown from "@components/ui/dropdown";

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
}) => {
  const { data: session } = useSession();
  const addMutation = useSubmitCommentMutation(post?.id);
  const editMutation = useEditCommentMutation(post?.id);
  // const replyMutation = useSubmitReplyMutation(post?.id)
  // const editReplyMutation = useEditReplyMutation(post?.id)
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
      name: session?.user?.name,
      email: session?.user?.email,
      content: "",
      userId: session?.user?.id,
      image: session?.user?.image,
    },
  });

  useEffect(() => {
    setValue("content", content);
  }, [content]);

  useEffect(() => {
    if (session) {
      setValue("name", session?.user.displayName);
      setValue("userId", session?.user.id);
      setValue("email", session?.user.email);
      setValue("image", session?.user.image);
    }
  }, [session, setValue]);

  const onSubmit = async (values) => {
    //  console.log(values)
    // if(!commentId && !content && !reply && !edit){
    // if(!content  && !edit){
    addMutation.mutate(
      {
        post,
        content: values.content,
        email: values.email,
        name: values.name,
        userId: values.userId,
        image: values.image,
        parentId: commentId,
      },
      {
        onSuccess: () => {
          if (session) {
            reset({
              name: session?.user?.name,
              email: session?.user?.email,
              userId: session?.user?.id,
              image: session?.user?.image,
            });
          } else {
            reset();
          }
        },
      }
    );
    // }

    // if(commentId && !reply && !edit){
    if (commentId && !reply && !edit) {
      editMutation.mutate(
        {
          post,
          content: values.content,
          userId: values.userId,
          commentId,
        },
        {
          onSuccess: () => {
            if (session) {
              reset({
                name: session?.user?.name,
                email: session?.user?.email,
                userId: session?.user?.id,
                image: session?.user?.image,
              });
            } else {
              reset();
            }
          },
        }
      );
    }

    //   if(commentId && reply && !edit){
    //   replyMutation.mutate({
    //   content:values.content,
    //   userId:values.userId,
    //   commentId
    //   },{
    //   onSuccess: () => {
    //     reset();
    //     },
    //   })
    // }

    //   if(replyId && reply && edit){
    //   editReplyMutation.mutate({
    //   content:values.content,
    //   userId:values.userId,
    //   replyId
    //   },{
    //   onSuccess: () => {
    //     reset();
    //     },
    //   })
    // }
  };
  return (
    <Dropdown
      title={title}
      position={"bottom-0 left-0"}
      size={"h-3/6 w-full"}
      btnStyle={btnStyle}
      onClose={onClose}
      className={
        "right-0 bg-white dark:bg-black dark:border-dbtn border border-lbtn px-3 w-72  shadow-lg"
      }
    >
      <form onSubmit={handleSubmit(onSubmit)}>
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

        <div className="mt-5">
          {/* <button type='button' className='text-lfont bg-lbtn rounded-lg py-2 md:text-lg text-sm w-1/3 md:w-1/6' onClick={()=>{setOnClose(!onClose)}}>CLOSE</button> */}

          <button
            className="bg-black rounded-lg text-lcard dark:bg-white dark:text-black w-full py-2 mx-auto disabled:brightness-90 disabled:cursor-not-allowed text-center flex justify-center text-sm"
            disabled={
              // replyId && edit && reply
              // ? editReplyMutation.isPending
              // :
              // commentId && reply && !edit
              // ? replyMutation.isPending
              // :
              commentId && !reply
                ? editMutation.isPending
                : addMutation.isPending
            }
            type="submit"
          >
            {/* {replyId && edit && reply
                     ? editReplyMutation.isPending ? <LoadingIcon color={"text-black dark:text-white dark:fill-black fill-white mx-auto"}/>  : "EDIT REPLY" 
                     : 
                     commentId && reply && !edit 
                     ? replyMutation.isPending ? <LoadingIcon color={"text-black dark:text-white dark:fill-black fill-white mx-auto"}/>  : "REPLY" 
                     :*/}
            {commentId && !reply ? (
              editMutation.isPending ? (
                <LoadingIcon
                  color={
                    "text-black dark:text-white dark:fill-black fill-white mx-auto"
                  }
                />
              ) : (
                "EDIT"
              )
            ) : addMutation.isPending ? (
              <LoadingIcon
                color={
                  "text-black dark:text-white dark:fill-black fill-white mx-auto"
                }
              />
            ) : (
              "ثبت بازخورد"
            )}
          </button>
        </div>
      </form>
    </Dropdown>
  );
};

export default CommentInput;
