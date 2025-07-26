import React, { useEffect, useState, useTransition } from "react";
import axios from "axios";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import LoadingIcon from "@components/ui/loading/LoadingIcon";
import { yupResolver } from "@hookform/resolvers/yup";
import Input from "@components/ui/input";

export function CountdownTimer({ initialTime, onTimeEnd }) {
  const [time, setTime] = useState(initialTime);

  useEffect(() => {
    if (time > 0) {
      const timerId = setTimeout(() => setTime(time - 1), 1000);
      return () => clearTimeout(timerId);
    } else {
      onTimeEnd();
    }
  }, [time, onTimeEnd]);

  return <div className="h6 mt-1">Time remaining: {time} seconds</div>;
}

const RecoveryPass = ({ setShow }) => {
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleTimeEnd = () => {
    setIsTimerRunning(false);
  };

  const recoveryValidation = yup.object().shape({
    email: yup
      .string()
      .email("email is invalid")
      .required("email field must not be empty"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm({
    resolver: yupResolver(recoveryValidation),
  });

  const onSubmit = async (values) => {
    startTransition(async () => {
      try {
        const response = await axios.post(
          "http://localhost:3000/api/auth/forgotpass",
          values
        );
        if (response.data.message) {
          toast.success(response.data.message);
          setIsTimerRunning(true);
        } else if (response.data.error) {
          toast.error(response.data.error);
        }
      } catch (error) {
        console.log("Error:", error);
      }
    });
  };

  return (
    <div className="col-span-2 space-y-5">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="w-full mx-auto">
          <Input
            title={"email"}
            name={"email"}
            type={"text"}
            error={errors?.email?.message}
            {...register("email")}
          />
        </div>

        <button
          className="bg-black rounded-lg text-lcard dark:bg-white dark:text-black w-full py-2 mx-auto disabled:brightness-90 disabled:cursor-not-allowed text-center flex justify-center my-3"
          disabled={isPending}
          type="submit"
        >
          {isPending ? (
            <LoadingIcon color={"bg-white dark:bg-black"}/>
          ) : (
            <>
              {isTimerRunning ? (
                <CountdownTimer initialTime={45} onTimeEnd={handleTimeEnd} />
              ) : (
                "SEND PASSWORD TO YOUR EMAIL"
              )}
            </>
          )}
        </button>
      </form>

      <p className="text-[10px] text-center">
        <span className="text-red">NOTE:</span> FOR SECURITY NOTE PLEASE AFTER
        LOGIN CHANGE YOUR PASSWORD{" "}
      </p>

      <div className="text-center">
        <button
          className="text-purple underline text-sm"
          onClick={() => {
            setShow("login");
          }}
        >
          BACK TO LOGIN PAGE
        </button>
      </div>
    </div>
  );
};

export default RecoveryPass;
