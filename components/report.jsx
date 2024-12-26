import React, { useState } from "react";
import axios from "axios";
import { toast } from 'sonner'
import LoadingSpinner from "@components/ui/loading/loadingSpinner";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { reportValidation } from "@lib/validation";
import TextArea from "./ui/TextArea";
import {useMutation,} from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import Dropdown from "./ui/dropdown";


const Report = ({type}) => {

    const [onClose,setOnClose]=useState(false);
    const currentUrl = usePathname();

  // console.log(currentUrl)
    const {
      register,
      handleSubmit,
      formState: { errors },
      reset,
      control,
    } = useForm({
      defaultValues:{
        reason:"محتوای نامربوط",
        type,
        url:`http:localhost:3000${currentUrl}`
      },
      resolver: yupResolver(reportValidation),
    });
  
    const mutate = useMutation({
      mutationFn: (values) => axios.post('/api/report', values),
      onSuccess: () => {
        toast.success('Your feedback was successfully sent');
        reset();
      },
      onError: (error) => {
        // console.error('Failed to send feedback', error);
        toast.error('Something went wrong. Please try again.');
      },
    });
  
    const onSubmit = (values) => {
      // console.log(values);
      mutate.mutate(values,{
           onSuccess: () => {
            reset();
          },
        });
    };

    const reportReasons =[
      {name:"محتوای نامربوط"},
      {name:"استفاده از الفاظ رکیک"},
      {name:"کلاه برداری یا کپی رایت"},
      {name:"مشکل سیستمی یا باگ"},
      {name:"موارد دیگر"},
    ]

  return (
    <Dropdown 
    title={`گزارش مشکل`}   
    header={"Report"}
    headerStyle={"capitalize text-xl"} 
    btnStyle={"hover:bg-lcard  duration-300 dark:hover:bg-dcard px-2 py-1 text-start w-full rounded-lg "}
    className={"-right-5 sm:right-0 bg-white dark:bg-black dark:border-dbtn border border-lbtn px-3 w-60 sm:w-72  shadow-lg"}
    onClose={onClose}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 text-right"> 
        <div className="space-y-3">
        {reportReasons.map((reason)=>{
          return(
          <div key={reason.name}>
          <input className="hidden peer" type="radio" value={reason.name} {...register("reason")} id={reason.name} name="reason"/>
          <label className="flex flex-col py-2 px-3  text-black dark:text-white border-2  cursor-pointer rounded-lg duration-300  peer-checked:bg-black peer-checked:text-white dark:peer-checked:bg-white dark:peer-checked:text-black" htmlFor={reason.name}>
             {reason.name}
          </label>
        </div>
          )
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
                    title={"...پیام خود را بنویسید"}
                  name={"message"}
                  type={"text"}
                  // label={true}
                  className={ "resize-none block text-right w-full p-2 text-sm bg-lcard dark:bg-dcard focus:outline-none focus:ring-2 rounded-lg duration-200 focus:ring-black dark:focus:ring-white "
                  }
                  error={errors?.message?.message}
                    {...register("message")}
                  />
                </div>

                <div className='flex flex-wrap space-x-3 justify-end mt-7'>   
                   {/* <button type='button' className='text-lfont bg-lcard dark:bg-dcard rounded-lg py-2 md:text-lg text-sm px-3' onClick={()=>{setOnClose(!onClose)}}>CLOSE</button> */}
                   
                   
                    <button
                      className=" bg-black rounded-lg text-lcard dark:bg-white dark:text-black w-full py-2 mx-auto disabled:brightness-90 disabled:cursor-not-allowed text-center flex justify-center text-sm"
                      disabled={mutate.isPending}
                      type="submit"
                    >
                    {mutate.isPending ? <LoadingSpinner color={"text-black dark:text-white dark:fill-black fill-white mx-auto"}/>  : "ارسال نظر"}
                    </button>
                </div>
    </form>
    </Dropdown>
  )
}

export default Report