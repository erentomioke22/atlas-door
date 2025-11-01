import React from "react";
import axios from "axios";
import { toast } from "sonner";
import LoadingIcon from "./ui/loading/LoadingIcon";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { reportValidation } from "@/lib/validation";
import TextArea from "./ui/textArea";
import { useMutation } from "@tanstack/react-query";
import { usePathname } from "next/navigation";

type ReportType = "USER" | "REPLY" | "COMMENT" | "POST";

interface ReportProps {
  type: ReportType;
}

interface ReportFormValues {
  reason: string;
  message: string;
  type: ReportType;
  url: string;
}

function Report({ type }: ReportProps) {
  const currentUrl = usePathname();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<ReportFormValues>({
    defaultValues: {
      reason: "محتوای نامربوط",
      type,
      url: `/${currentUrl}`,
    },
    resolver: zodResolver(reportValidation),
  });

  const mutate = useMutation({
    mutationFn: (values: ReportFormValues) => axios.post("/api/report", values),
    onSuccess: () => {
      toast.success("Your feedback was successfully sent");
      reset();
    },
    onError: () => {
      toast.error("Something went wrong. Please try again.");
    },
  });

  const onSubmit = (values: ReportFormValues) => {
    mutate.mutate(values, {
      onSuccess: () => {
        reset();
      },
    });
  };

  const reportReasons = [
    { name: "محتوای نامربوط" },
    { name: "استفاده از الفاظ رکیک" },
    { name: "کلاه برداری یا کپی رایت" },
    { name: "مشکل سیستمی یا باگ" },
    { name: "موارد دیگر" },
  ];

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 text-right">
        <div className="space-y-3">
          {reportReasons.map((reason) => {
            return (
              <div key={reason.name}>
                <input
                  className="hidden peer"
                  type="radio"
                  value={reason.name}
                  {...register("reason")}
                  id={reason.name}
                  name="reason"
                />
                <label
                  className="flex flex-col py-2 px-3  text-black dark:text-white border-2  cursor-pointer rounded-lg duration-300  peer-checked:bg-black peer-checked:text-white dark:peer-checked:bg-white dark:peer-checked:text-black"
                  htmlFor={reason.name}
                >
                  {reason.name}
                </label>
              </div>
            );
          })}
          <div
            className={`text-red mt-1 text-[10px] md:text-sm transition-opacity duration-300  ${
              errors?.reason?.message ? "opacity-100" : "opacity-0"
            }`}
          >
            {errors?.reason?.message}
          </div>
        </div>

        <div>
          <TextArea
            placeholder={"پیام خود را بنویسید..."}
            title={"...پیام خود را بنویسید"}
            // name={"message"}
            // type={"text"}
            // ref={register}
            className={
              "resize-none block text-right w-full p-2 text-sm bg-lcard dark:bg-dcard focus:outline-none focus:ring-2 rounded-lg duration-200 focus:ring-black dark:focus:ring-white "
            }
            error={errors?.message?.message as string | undefined}
            {...register("message")}
          />
        </div>

        <div className="flex flex-wrap space-x-3 justify-end mt-7">
          <button
            className=" bg-black rounded-lg text-lcard dark:bg-white dark:text-black w-full py-2 mx-auto disabled:brightness-90 disabled:cursor-not-allowed text-center flex justify-center text-sm"
            disabled={mutate.isPending}
            type="submit"
          >
            {mutate.isPending ? (
              <LoadingIcon color={"bg-white dark:bg-black"} />
            ) : (
              "ارسال نظر"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Report;
