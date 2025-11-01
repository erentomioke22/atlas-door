import React, { useState, useEffect } from "react";
import Offcanvas from "./ui/offcanvas";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import TextArea from "./ui/textarea";
import LoadingIcon from "./ui/loading/LoadingIcon";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { IoClose } from "react-icons/io5";
import Input from "./ui/input";
import { orderGatewayValidation } from "@/lib/validation";
import { FaCreditCard } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { useCart } from "@/hook/useCart";
import Button from "./ui/button";
import { Session } from "@/lib/auth";
interface PaymentPanelProps {
  status?: "pending" | "idle" | "success" | "error" | string;
  session: Session | null;
}

interface OrderFormValues {
  user: string;
  address: string;
  rule: "direct" | "gateway";
  phone: string;
  // paymentId?: number;
}

interface PaymentResponse {
  success: boolean;
  paymentUrl?: string;
}

const PaymentPanel: React.FC<PaymentPanelProps> = ({ status, session }) => {
  const [close, setClose] = useState(false);
  const { clearCart } = useCart();

  const paymentMutation = useMutation({
    mutationFn: async (values: OrderFormValues) => {
      const response = await axios.post<PaymentResponse>(
        "/api/payment",
        values
      );
      return response.data;
    },
    onSuccess: (data) => {
      if (data.success) {
        clearCart();
        toast.success(
          ".عملیات پردازش سفارش شما با موفقیت انجام شد . همکاران ما در اسرع وقت با شما تماس میگیرند"
        );
      } else {
        toast.error("مشکلی در فرایند پرداخت بوجود آمده است");
      }
    },
    onError: () => {
      toast.error("عملیات پرداخت ناموفق بود . دوباره امتحان کنید");
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
    setValue,
    getValues,
    watch,
  } = useForm<OrderFormValues>({
    defaultValues: { user: "", address: "", rule: "direct", phone: "" },
    resolver: zodResolver(orderGatewayValidation),
  });

  useEffect(() => {
    if (session) {
      setValue("user", session?.user?.name ?? "");
      setValue("address", session?.user?.address ?? "");
      setValue("phone", session?.user?.phone ?? "");
    }
  }, [session, setValue]);

  const onSubmit = async (values: OrderFormValues) => {
    try {
      paymentMutation.mutate(values);
    } catch (err: any) {
      toast.error(err?.message || "مشکلی در انجام عملیات وجود دارد");
    }
  };

  return (
    <Offcanvas
      title={"تکمیل سفارش"}
      btnStyle={
        "bg-black text-white dark:bg-white dark:text-black rounded-xl  p-2 text-sm sm:text-lg mx-auto w-full flex justify-center"
      }
      disabled={status === "pending"}
      position={"top-0 right-0"}
      size={
        "h-screen max-w-full w-96 border-l-2 border-l-lcard dark:border-l-dcard"
      }
      openTransition={"translate-x-0"}
      closeTransition={"translate-x-full"}
      onClose={close}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-7">
        <div className="flex justify-between mb-5">
          <h1 className={" text-xl "}>تکمیل سفارش</h1>
          <Button
            onClick={() => {
              setClose(!close);
            }}
            className="  text-lg bg-lcard dark:bg-dcard px-2 py-1  rounded-full border-2 text-lfont"
            type="button"
            variant="close"
          >
            <IoClose />
          </Button>
        </div>

        <div className="space-y-2">
          <p className="text-sm">مشخصات دریافت کننده</p>

          <div>
            <Input
              placeholder={"نام و نام خانوادگی"}
              // name={"user"}
              type={"text"}
              // ref={register}
              label={false}
              className={
                "resize-none  bg-lcard dark:bg-dcard rounded-lg placeholder:text-[#000000a4] dark:placeholder:text-lfont text-lg  p-2 focus:ring-2 focus:ring-black dark:focus:ring-white outline-none duration-200"
              }
              error={errors?.user?.message as string | undefined}
              {...register("user")}
            />
          </div>

          <div>
            <Input
              placeholder={"شماره تماس"}
              // name={"phone"}
              type={"tel"}
              // ref={register}
              label={false}
              className={
                "resize-none  bg-lcard dark:bg-dcard rounded-lg placeholder:text-[#000000a4] dark:placeholder:text-lfont text-lg  p-2 focus:ring-2 focus:ring-black dark:focus:ring-white outline-none duration-200"
              }
              error={errors?.phone?.message as string | undefined}
              {...register("phone")}
            />
          </div>

          <div>
            <TextArea
              placeholder={"آدرس"}
              // name={"address"}
              // type={"text"}
              // ref={register}
              label={false}
              className={
                "resize-none  bg-lcard dark:bg-dcard rounded-lg placeholder:text-[#000000a4] dark:placeholder:text-lfont text-lg  p-2 focus:ring-2 focus:ring-black dark:focus:ring-white outline-none duration-200"
              }
              error={errors?.address?.message as string | undefined}
              {...register("address")}
            />
          </div>

          <p>نحوه پرداخت</p>
          <div className="grid grid-cols-2 gap-2">
            <div key="gateway">
              <input
                className="hidden peer"
                type="radio"
                value="gateway"
                {...register("rule")}
                id="gateway"
                name="rule"
                disabled={true}
              />
              <label
                className="flex flex-col py-2 px-3 text-center text-lfont bg-lcard dark:bg-dcard  border-2  cursor-pointer rounded-xl duration-300"
                htmlFor="gateway"
              >
                <FaCreditCard className="mx-auto" />
                <p>درگاه پرداخت</p>
                <p className="text-[10px] ">پرداخت از طریق درگاه واسط </p>
                <p className="text-[10px] text-redorange">(غیرفعال)</p>
              </label>
            </div>

            <div key="direct">
              <input
                className="hidden peer"
                type="radio"
                value="direct"
                {...register("rule")}
                id="direct"
                name="rule"
              />
              <label
                className="flex flex-col py-2 px-3 text-center text-black dark:text-white border-2  cursor-pointer rounded-xl duration-300  peer-checked:bg-black peer-checked:text-white dark:peer-checked:bg-white dark:peer-checked:text-black"
                htmlFor="direct"
              >
                <FaLocationDot className="mx-auto" />
                <p>پرداخت در محل</p>
                <p className="text-[10px] ">
                  پرداخت حضوری در زمان دریافت محصول
                </p>
              </label>
            </div>
          </div>

          <div className=" w-full  ">
            <button
              type="submit"
              disabled={paymentMutation.isPending || status === "pending"}
              className={`px-6 py-2 rounded-lg  text-white dark:text-black w-full my-3 bg-black dark:bg-white disabled:cursor-not-allowed`}
            >
              {paymentMutation.isPending ? (
                <LoadingIcon color={"bg-white dark:bg-black"} />
              ) : (
                "انجام سفارش"
              )}
            </button>
          </div>
        </div>
      </form>
    </Offcanvas>
  );
};

export default PaymentPanel;
