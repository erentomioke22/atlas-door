import React, { useState, useEffect } from "react";
import Offcanvas from './ui/offcanvas'
import { useInfiniteQuery, useQuery,useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import TextArea from "@components/ui/TextArea";
import LoadingIcon from "@components/ui/loading/loadingIcon";
import { useForm, useFieldArray, Controller } from 'react-hook-form'
import { yupResolver } from "@hookform/resolvers/yup";
import ImageCom from "@components/ui/Image";
import { IoClose } from "react-icons/io5";
import Input from "@components/ui/input";
import {
orderGatewayValidation,
orderDirectValidation
} from "@lib/validation";
import { FaCreditCard ,FaArrowUp  } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";

const PaymentPanel = ({status}) => {
    const router = useRouter();
    const { data: session } = useSession();
    const [close, setClose] = useState(false);
    
    const paymentMutation = useMutation({
        mutationFn: async (values) => {
          console.log(values)
          const response = await axios.post('/api/payment',values);
          return response.data;
        },
        onSuccess: (data) => {
          if (data.success) {
            window.location.href = data.paymentUrl;
          } else {
            toast.error('Failed to initialize payment');
          }
        },
        onError: (error) => {
          toast.error('Payment failed. Please try again.');
        }
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
      } = useForm({
        defaultValues: {
          user: "",
          address: "",
          rule:"gateway",
          phone: '',
          // paymentId:""
        },
        // resolver: yupResolver(watch("rule") === "direct" ? orderDirectValidation : orderGatewayValidation),
        resolver: yupResolver(orderGatewayValidation),
      });

    //  const ruleValue = watch("rule")
      const onSubmit = async (values) => {
        try {
          // if (values.rule === "direct" && !values.paymentId) {
          //   toast.error("لطفا شناسه پرداخت را وارد کنید");
          //   return;
          // }
          console.log(values)
           paymentMutation.mutate(values);
        } catch (err) {
          toast.error(err.message || "An error occurred");
          // console.log(err.message)
        }
      };
// console.log(getValues("rule"))

  return (
    <Offcanvas     
    title={"تکمیل سفارش"}
    btnStyle={'bg-lcard dark:bg-dcard rounded-full p-2 text-sm sm:text-lg'}
    disabled={status === "pending"}
    position={"top-0 right-0"} size={"h-screen max-w-full w-96 border-l-2 border-l-lcard dark:border-l-dcard"} openTransition={"translate-x-0"} closeTransition={"translate-x-full"} onClose={close}>
    
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-7">

                <div className="flex justify-between mb-5">
                  <h1 className={" text-xl "}>تکمیل سفارش</h1>

                  <button
                    onClick={() => {
                      setClose(!close);
                    }}
                    className="  text-lg bg-lcard dark:bg-dcard px-2 py-1  rounded-full border-2 text-lfont"
                    type="button"
                  >
                    <IoClose />
                  </button>
                </div>

                <div className="space-y-2">
                    <p className="text-sm">مشخصات دریافت کننده</p>


                  <div>
                    <Input
                      placeholder={"نام و نام خانوادگی"}
                      name={"user"}
                      type={"text"}
                      ref={register}
                      // watch={watch('title')}
                      label={false}
                      className={
                        "resize-none  bg-lcard dark:bg-dcard rounded-lg placeholder:text-[#000000a4] dark:placeholder:text-lfont text-lg  p-2 focus:ring-2 focus:ring-black dark:focus:ring-white outline-none duration-200"
                      }
                      error={errors?.user?.message}
                      {...register("user")}
                    />
                  </div>

                  <div>
                    <Input
                      placeholder={"شماره تماس"}
                      name={"phone"}
                      type={"tel"}
                      ref={register}
                      // watch={watch('title')}
                      label={false}
                      className={
                        "resize-none  bg-lcard dark:bg-dcard rounded-lg placeholder:text-[#000000a4] dark:placeholder:text-lfont text-lg  p-2 focus:ring-2 focus:ring-black dark:focus:ring-white outline-none duration-200"
                      }
                      error={errors?.phone?.message}
                      {...register("phone")}
                    />
                  </div>

                  <div>
                    <TextArea
                      placeholder={"آدرس"}
                      name={"address"}
                      type={"text"}
                      ref={register}
                      // watch={watch('title')}
                      label={false}
                      className={
                        "resize-none  bg-lcard dark:bg-dcard rounded-lg placeholder:text-[#000000a4] dark:placeholder:text-lfont text-lg  p-2 focus:ring-2 focus:ring-black dark:focus:ring-white outline-none duration-200"
                      }
                      error={errors?.address?.message}
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
                />
                <label
                  className="flex flex-col py-2 px-3 text-center text-black dark:text-white border-2  cursor-pointer rounded-xl duration-300  peer-checked:bg-black peer-checked:text-white dark:peer-checked:bg-white dark:peer-checked:text-black"
                  htmlFor="gateway"
                >

                 <FaCreditCard className="mx-auto"/>
                  <p>درگاه پرداخت</p> 
                  <p className="text-[10px] ">پرداخت از طریق درگاه واسط </p>
                  <p className="text-[10px] text-redorange">(پیشنهادی)</p>
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
                  <FaLocationDot className="mx-auto"/>
                  <p>پرداخت در محل</p> 
                  <p className="text-[10px] ">پرداخت حضوری در زمان دریافت محصول</p>
                </label>
              </div>

              {/* <div key="direct">
                <input
                  className="hidden peer"
                  type="radio"
                  value="direct"
                  {...register("rule")}
                  id="direct"
                  name="rule"
                />
                <label
                  className="flex flex-col py-2 px-3 text-center text-black dark:text-white border-2  cursor-pointer rounded-lg duration-300  peer-checked:bg-black peer-checked:text-white dark:peer-checked:bg-white dark:peer-checked:text-black"
                  htmlFor="direct"
                >
                  <FaArrowUp className="mx-auto"/>
                  <p>درگاه مستقیم</p> 
                  <p className="text-[10px] ">پرداخت کارت به کارت و وارد کردن شناسه پرداخت</p>
                </label>
              </div> */}

           </div>
           

           {/* {ruleValue === "direct" &&
                 <div>
                    <Input
                      placeholder={"شناسه پرداخت"}
                      name={"paymentId"}
                      type={"number"}
                      ref={register}
                      // watch={watch('title')}
                      label={false}
                      className={
                        "resize-none  bg-lcard dark:bg-dcard rounded-lg placeholder:text-[#000000a4] dark:placeholder:text-lfont text-lg  p-2 focus:ring-2 focus:ring-black dark:focus:ring-white outline-none duration-200"
                      }
                      error={errors?.paymentId?.message}
                      {...register("paymentId", {
                        required: ruleValue === "direct" ? "شناسه پرداخت الزامی است" : false
                      })}
                    />
                  </div>
                  } */}


                  <div className=" w-full  ">
                  <button
          // onClick={()=>{paymentMutation.mutate()}}
          type="submit"
          disabled={paymentMutation.isPending || status === "pending"}
          className={`px-6 py-2 rounded-lg transition-colors text-white dark:text-black w-full my-3 ${
            paymentMutation.isPending || status === "pending"
              ? 'bg-black/55 dark:bg-white/55 cursor-not-allowed'
              : 'bg-black dark:bg-white'
          }`}
        >
          {paymentMutation.isPending ? <LoadingIcon color={"bg-white dark:bg-black"}/> : 'پرداخت'}
        </button>
                  </div>

                </div>







      </form>
     
    </Offcanvas>
  )
}

export default PaymentPanel;