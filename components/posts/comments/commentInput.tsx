import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { commentValidation } from "@/lib/validation";
import { useForm, Controller } from "react-hook-form";
import { useSubmitCommentMutation } from "./mutations";
import LoadingIcon from "@/components/ui/loading/LoadingIcon";
import { useEditCommentMutation } from "./mutations";
import CommentTextEditor from "@/components/commentTextEditor";
import Button from "@/components/ui/button";
import { FaCaretLeft } from "react-icons/fa6";
import { FaCheck } from "react-icons/fa6";
import { Session } from "@/lib/auth";

type SortCategory = "latest" | "oldest" | "top";

type PostLite = {
  id: string;
  userId: string;
  user?: { id: string };
};

interface CommentInputProps {
  post: PostLite;
  title?: string;
  header?: string;
  content: string | null;
  commentId: string | null;
  reply?: boolean;
  edit?: boolean;
  replyId?: string | null;
  placeHolder?: string;
  btnStyle?: string;
  category: SortCategory;
  setCommentId: (id: string | null) => void;
  setReplyInfo: (
    info: {
      user: { id: string; displayName?: string | null; image?: string | null };
      content: string;
    } | null
  ) => void;
  replyInfo?: {
    user: { id: string; displayName?: string | null; image?: string | null };
    content: string;
  } | null;
  setMessage: (v: string | null) => void;
  session: Session | null;
}

type FormValues = {
  content: string;
  userId?: string;
  parentId?: string | null;
};

const CommentInput: React.FC<CommentInputProps> = ({
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
  replyInfo,
  setMessage,
  session,
}) => {
  const addMutation = useSubmitCommentMutation(post?.id, category);
  const editMutation = useEditCommentMutation(post?.id, category);

  const [onClose, setOnClose] = useState(false);

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setValue,
  } = useForm<FormValues>({
    resolver: zodResolver(commentValidation) as any,
    defaultValues: {
      content: "",
      userId: session?.user?.id,
      parentId: commentId,
    },
  });

  useEffect(() => {
    if (content !== null) {
      setValue("content", content);
    }
  }, [content, setValue]);

  const onSubmit = async (values: FormValues) => {
    if (content) {
      editMutation.mutate(
        {
          post,
          content: values.content,
          userId: session?.user?.id,
          commentId: replyId || commentId,
        } as any,
        {
          onSuccess: () => {
            reset();
            setOnClose(true);
            setCommentId(null);
            setMessage(null);
            setReplyInfo(null);
          },
        }
      );
    } else {
      addMutation.mutate(
        {
          post,
          content: values.content,
          userId: session?.user?.id,
          parentId: commentId,
          userReplyId: replyInfo?.user.id,
        } as any,
        {
          onSuccess: () => {
            reset();
            setOnClose(true);
            setCommentId(null);
            setMessage(null);
            setReplyInfo(null);
          },
        }
      );
    }
  };

  return (
    <div className="w-full">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-5 gap-1"
      >
        <div className="col-span-4 flex-1">
          <Controller
            name="content"
            control={control}
            render={({ field }) => (
              <CommentTextEditor
                content={field.value}
                onChange={field.onChange}
                ref={field.ref as any}
                title={`WRITE YOUR ${placeHolder} HERE ...`}
              />
            )}
          />
          <div
            className={`text-red mt-2 text-start text-[10px] md:text-sm transition-opacity duration-300  ${
              errors?.content?.message ? "opacity-100" : "opacity-0"
            }`}
          >
            {errors?.content?.message as string}
          </div>
        </div>

        <div className="col-span-1 mt-1">
          <Button
            variant="menuActive"
            className="rounded-full  text-lg py-1 px-3 "
            disabled={content ? editMutation.isPending : addMutation.isPending}
            type="submit"
          >
            {content ? (
              editMutation.isPending ? (
                <LoadingIcon color={"bg-white dark:bg-black "} />
              ) : (
                <FaCheck />
              )
            ) : addMutation.isPending ? (
              <LoadingIcon color={"bg-white dark:bg-black"} />
            ) : (
              <FaCaretLeft />
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CommentInput;
