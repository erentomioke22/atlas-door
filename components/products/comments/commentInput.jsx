import React, { useEffect, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { commentValidation } from "@lib/validation";
import { useSession } from "next-auth/react";
import { useForm, Controller } from "react-hook-form";
import { useSubmitCommentMutation } from "./mutations";
import LoadingIcon from "@components/ui/loading/LoadingIcon";
import { useEditCommentMutation } from "./mutations";
import CommentTextEditor from "@components/commentTextEditor";
import Button from "@components/ui/button";
import { FaCaretLeft } from "react-icons/fa6";
import { FaCheck } from "react-icons/fa6";
// import Dropdown from "@components/ui/dropdown";
// import { IoSend } from "react-icons/io5";

const CommentInput = ({
  product,
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
  replyInfo,
setMessage
}) => {
  const { data: session } = useSession();
  const addMutation = useSubmitCommentMutation(product?.id,category);
  const editMutation = useEditCommentMutation(product?.id,category);

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
    },
  });

  useEffect(() => {
    setValue("content", content);
  }, [content]);

  const onSubmit = async (values) => {
    
    if (content) {
      // If edit is true, we're editing a comment
      editMutation.mutate(
        {
          product,
          content: values.content,
          userId: values.userId,
          commentId: replyId || commentId, // Use the appropriate ID
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
          product,
          content: values.content,
          userId: values.userId,
          parentId: commentId, 
          userReplyId : replyInfo?.user.id
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

  return (
    <div
    className="w-full"

    >
      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-5 gap-1">
        <div className="col-span-4 flex-1">
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
                <LoadingIcon color={"bg-white dark:bg-black"}/>
              ) : (
                <FaCheck/>
              )
            ) 
            : 
            addMutation.isPending ? (
              <LoadingIcon color={"bg-white dark:bg-black"}/>
            ) : (
              <FaCaretLeft/>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CommentInput;