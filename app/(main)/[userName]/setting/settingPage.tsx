"use client";

import React, { useState, useEffect } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { useRouter } from "next/navigation";
import LoadingIcon from "@/components/ui/loading/LoadingIcon";
import { useForm, UseFormRegister } from "react-hook-form";
import {
  settingProfileValidation,
  settingPasswordValidation,
} from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaCaretLeft } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import Offcanvas from "@/components/ui/offcanvas";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useDeleteUserMutation } from "./mutation";
import Button from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { Session } from "@/lib/auth";
import { z } from "zod";
import { toast } from "sonner";

interface FormField {
  title: string;
  name: string;
  type: string;
  value: string;
  input: React.ComponentType<any>;
  error?: string;
  register: UseFormRegister<any>;
}

interface ButtonList {
  name: string;
  info: string;
  link: React.ReactNode;
  input: FormField[];
  submit: (e?: React.BaseSyntheticEvent) => Promise<void>;
}
type PasswordFormData = z.infer<typeof settingPasswordValidation>;
type ProfileFormData = z.infer<typeof settingProfileValidation>;

export default function SettingPage({ session }: { session: Session | null }) {
  const [showpass, setShowPsss] = useState<boolean>(false);
  const [onClose, setOnClose] = useState<boolean>(false);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [accounts, setAccounts] = useState<any[]>([]);
  const deleteUserMutation = useDeleteUserMutation();

  const {
    register: passwordRegister,
    handleSubmit: passwordHandleSubmit,
    formState: passwordFormState,
    reset: passwordReset,
    control: passwordControl,
    setValue: passwordSetValue,
    watch: passwordWatch,
    getValues: passwordGetValue,
  } = useForm<PasswordFormData>({
    resolver: zodResolver(settingPasswordValidation),
  });

  const {
    register,
    handleSubmit,
    formState: profileFormState,
    reset,
    control,
    setValue,
    watch,
    getValues,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(settingProfileValidation),
    defaultValues: {},
  });

  useEffect(() => {
    if (session) {
      setValue(
        "displayName",
        session?.user?.displayName ?? session?.user?.name
      );
      setValue("address", session?.user?.address ?? "");
      setValue("phone", session?.user?.phone ?? "");
    }
  }, [session, setValue]);

  useEffect(() => {
    const initializeData = async () => {
      try {
        const { data: accounts } = await authClient.listAccounts();
        setAccounts(accounts ?? []);
      } catch (error) {
        // console.error("Error fetching accounts:", error);
      }
    };

    initializeData();
  }, []);

  async function onSubmit(values: ProfileFormData) {
    setStatus(null);
    setError(null);

    const { error } = await authClient.updateUser(values);

    if (error) {
      setError(error.message || "به روز رسانی پروفایل با مشکل مواجه شد");
    } else {
      setStatus("Profile updated");
      toast.success("پروفایل با موفقیت به روز رسانی شد");
      router.refresh();
    }
  }

  async function onSubmitPassword({
    currentPassword,
    newPassword,
  }: PasswordFormData) {
    setStatus(null);
    setError(null);

    const { error } = await authClient.changePassword({
      currentPassword,
      newPassword,
      revokeOtherSessions: true,
    });

    if (error) {
      setError(error.message || "تغییر گذرواژه با مشکل مواجه شد");
    } else {
      setStatus("Password changed");
      toast.success("گذرواژه با موفقیت تغییر یافت");
      passwordReset();
    }
  }

  async function handleLogoutEverywhere() {
    setLoading(true);
    const { error } = await authClient.revokeSessions();
    setLoading(false);

    if (error) {
      toast.error(error.message || "خروج از حساب ها با مشکل مواجه شد");
    } else {
      toast.success("خروج از  حساب ها با موفقیت انجام شد");
      router.push("/");
    }
  }

  const PasswordLoading = passwordFormState.isSubmitting;
  const profileLoading = profileFormState.isSubmitting;

  const userForm: FormField[] = [
    {
      title: "نام كاربري",
      name: "displayName",
      type: "text",
      value: "",
      input: "input" as any,
      error: profileFormState.errors.displayName?.message,
      register: register,
    },
    {
      title: "شماره همراه",
      name: "phone",
      type: "number",
      input: "input" as any,
      value: "",
      error: profileFormState.errors.phone?.message,
      register: register,
    },
    {
      title: "آدرس",
      name: "address",
      type: "text",
      value: "",
      input: "textarea" as any,
      error: profileFormState.errors.address?.message,
      register: register,
    },
  ];

  const passwordForm: FormField[] = [
    {
      title: "گذرواژه قبلی",
      name: "currentPassword",
      type: showpass ? "text" : "password",
      value: "",
      input: "input" as any,
      error: passwordFormState.errors.currentPassword?.message,
      register: passwordRegister,
    },
    {
      title: "گذرواژه جدید",
      name: "newPassword",
      type: showpass ? "text" : "password",
      value: "",
      input: "input" as any,
      error: passwordFormState.errors.newPassword?.message,
      register: passwordRegister,
    },
    {
      title: "تکرار گذرواژه جدید",
      name: "confirmPassword",
      type: showpass ? "text" : "password",
      value: "",
      input: "input" as any,
      error: passwordFormState.errors.confirmPassword?.message,
      register: passwordRegister,
    },
  ];

  const btnLists: ButtonList[] = [
    {
      name: "اطلاعات پروفايل",
      info: "ويرايش اطلاعات مربوط به آدرس و تلفن و ...",
      link: <FaCaretLeft />,
      input: userForm,
      submit: handleSubmit(onSubmit),
    },
    ...(accounts.length > 0 && accounts[0]?.providerId === "credential"
      ? [
          {
            name: "گذرواژه",
            info: "گذرواژه خود را تغییر دهید",
            link: "********" as any,
            input: passwordForm,
            submit: passwordHandleSubmit(onSubmitPassword),
          },
        ]
      : []),
  ];

  return (
    <div className="px-5  container max-w-3xl lg:max-w-4xl space-y-10 mt-20 mx-auto ">
      <div className="flex justify-between text-lg ">
        <h1 className="text-2xl">تنظيمات</h1>
        <Button
          variant="back"
          onClick={() => router.back()}
          className="mb-6 text-sm flex"
        >
          بازگشت
          <FaArrowLeftLong className="ml-2 my-auto " />
        </Button>
      </div>

      <div className="space-y-10  rounded-2xl text-sm pt-10">
        {!session ? (
          Array(6)
            .fill({})
            .map((_, index: number) => {
              return (
                <div key={index} className="animate-pulse  py-2 px-3">
                  <div className="bg-lcard dark:bg-dcard rounded-lg h-10 w-full"></div>
                </div>
              );
            })
        ) : (
          <>
            <div className="flex justify-between w-full gap-1 duration-300 px-3">
              <div className="text-start">
                <p>آدرس ايميل</p>
              </div>
              <div className="text-neutral-500 dark:text-neutral-400 truncate">{session?.user?.email}</div>
            </div>

            <div className="flex justify-between w-full gap-1 duration-300 px-3">
              <div className="text-start">
                <p>نام كاربري</p>
              </div>
              <div className="text-neutral-500 dark:text-neutral-400 truncate">{session?.user?.name}</div>
            </div>

            {btnLists.map((btnList: ButtonList) => {
              return (
                <form onSubmit={btnList?.submit} key={btnList?.name}>
                  <Offcanvas
                    title={
                      <>
                        <div className="text-start">
                          <p>{btnList?.name}</p>
                          <p className="text-neutral-500 dark:text-neutral-400 text-[10px]">
                            {btnList?.info}
                          </p>
                        </div>
                        <div>{btnList?.link}</div>
                      </>
                    }
                    // header={btnList?.name}
                    btnStyle={
                      "py-2 w-full  px-3  rounded-lg   hover:bg-lcard dark:hover:bg-dcard flex justify-between w-full  duration-300"
                    }
                    // headerStyle={"capitalize text-2xl "}
                    position={"top-0 right-0"}
                    size={
                      "h-screen max-w-full w-80 border-l-2 border-l-lcard dark:border-l-dcard"
                    }
                    openTransition={"translate-x-0"}
                    closeTransition={"translate-x-full"}
                    onClose={onClose}
                  >
                    <div className="flex justify-between mb-5">
                      <h1 className={" text-xl "}>{btnList?.name}</h1>

                      <Button
                        onClick={() => {
                          setOnClose(!onClose);
                        }}
                        className="  text-lg bg-lcard dark:bg-dcard px-2 py-1  rounded-full border-2 text-neutral-500 dark:text-neutral-400"
                        type="button"
                        title="close button"
                      >
                        <IoClose />
                      </Button>
                    </div>
                    <div className="space-y-5">
                      <div className="flex flex-col space-y-3 w-full">
                        {btnList?.input?.map((value: FormField) => {
                          const InputComponent = value.input;
                          return (
                            <div
                              key={value.name}
                              className="relative capitalize space-y-1"
                            >
                              <label>{value.title}</label>
                              <InputComponent
                                title={value.title}
                                // name={value.name}
                                type={value.type}
                                error={value.error}
                                placeholder={value.title}
                                className={`${
                                  value.error
                                    ? "border-red  focus:ring-2 ring-red"
                                    : " focus:ring-2 ring-black dark:ring-white "
                                } resize-none w-full appearance-none  rounded-xl px-3 py-3 block  text-sm focus:outline-none dark:bg-dcard  bg-lcard  duration-200  `}
                                {...value?.register(value.name)}
                              />
                              <div
                                className={`text-red mt-2  text-[10px] md:text-sm transition-opacity duration-300 ${
                                  value.error ? "opacity-100" : "opacity-0"
                                }`}
                              >
                                {value.error}
                              </div>

                              {value.name === "confirmPassword" && (
                                <button
                                  className="bg-lcard dark:bg-dcard rounded-lg p-2 border-lbtn dark:border-dbtn border-2 flex justify-self-end"
                                  onClick={() => setShowPsss(!showpass)}
                                  type="button"
                                >
                                  {showpass ? <FaRegEye /> : <FaRegEyeSlash />}
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      <button
                        disabled={PasswordLoading || profileLoading}
                        type="submit"
                        className="bg-black my-3 rounded-lg text-white dark:bg-white dark:text-black w-full py-2 mx-auto disabled:brightness-90 disabled:cursor-not-allowed text-center flex justify-center"
                      >
                        {PasswordLoading || profileLoading ? (
                          <LoadingIcon color={"bg-white dark:bg-black"} />
                        ) : (
                          "ثبت تغييرات"
                        )}
                      </button>
                    </div>
                  </Offcanvas>
                </form>
              );
            })}

            <div>
              <div className="space-y-10">
                <div className="space-y-5">
                  <button
                    className="flex justify-between w-full hover:text-purple duration-300 px-3 disabled:cursor-not-allowed"
                    onClick={handleLogoutEverywhere}
                    type="button"
                    disabled={loading}
                  >
                    <div className="text-start">
                      <p className="text-redorange">خروج از تمامي حساب ها</p>
                      <p className="text-neutral-500 dark:text-neutral-400 text-[10px]">
                        خروج از دسترسي ها در دستگاه هاي ديگر
                      </p>
                    </div>
                    {loading ? (
                      <LoadingIcon color={"bg-redorange"} />
                    ) : (
                      <FaCaretLeft />
                    )}
                  </button>
                </div>

                <div className="space-y-5">
                  <button
                    onClick={() => {
                      deleteUserMutation.mutate(session?.user?.id);
                    }}
                    className="flex justify-between w-full  hover:text-purple duration-300  px-3 "
                    type="button"
                  >
                    <div className="text-start">
                      <p className="text-red">حذف حساب</p>
                      <p className="text-neutral-500 dark:text-neutral-400 text-[10px]">
                        با انتخاب اين گزينه تمام اطلاعات مربوط به شما حذف خواهد
                        شد
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
            </div>
          </>
        )}
      </div>
    </div>
  );
}
