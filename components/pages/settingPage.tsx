// components/pages/settingPage.tsx
"use client";

import React, { useState, useEffect } from "react";
import { FaRegEye, FaRegEyeSlash, FaCaretLeft, FaArrowLeft } from "react-icons/fa";
import { useRouter } from "next/navigation";
import LoadingIcon from "@/components/ui/loading/LoadingIcon";
import { useForm, UseFormRegister } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { IoClose } from "react-icons/io5";
import Offcanvas from "@/components/ui/offcanvas";
import { useDeleteUserMutation } from "@/app/(main)/[userName]/setting/mutation";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import type { ServerSession } from "@/lib/get-session";
import type { z } from "zod";
import { toast } from "sonner";
import {
  settingProfileValidation,
  settingPasswordValidation,
} from "@/lib/validation";
import ImageCom from "../ui/Image";


type PasswordFormData = z.infer<typeof settingPasswordValidation>;
type ProfileFormData = z.infer<typeof settingProfileValidation>;

// ✅ به‌جای string، کامپوننت واقعی
interface FormField {
  title: string;
  name: keyof ProfileFormData | keyof PasswordFormData;
  type: string;
  input: "input" | "textarea";
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

export default function SettingPage({
  session,
}: {
  session: ServerSession | null;
}) {
  const [showpass, setShowPass] = useState(false);
  const [onClose, setOnClose] = useState(false);
  const [loading, setLoading] = useState(false);
  const [accounts, setAccounts] = useState<any[]>([]);
  const router = useRouter();
  const deleteUserMutation = useDeleteUserMutation();
  console.log(session)
  const {
    register: passwordRegister,
    handleSubmit: passwordHandleSubmit,
    formState: passwordFormState,
    reset: passwordReset,
  } = useForm<PasswordFormData>({
    resolver: zodResolver(settingPasswordValidation),
  });

  const {
    register,
    handleSubmit,
    formState: profileFormState,
    reset,
    setValue,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(settingProfileValidation),
    defaultValues: {},
  });

  useEffect(() => {
    if (session?.user) {
      setValue("displayName", session.user.displayName ?? session.user.name ?? "");
      setValue("address", (session.user as any).address ?? "");
      setValue("phone", (session.user as any).phone ?? "");
    }
  }, [session, setValue]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await authClient.listAccounts();
        if (!cancelled && Array.isArray(res?.data)) setAccounts(res.data);
      } catch {
        /* silent */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function onSubmit(values: ProfileFormData) {
    const { error } = await authClient.updateUser(values);
    if (error) {
      toast.error(error.message || "به روز رسانی پروفایل با مشکل مواجه شد");
    } else {
      toast.success("پروفایل با موفقیت به روز رسانی شد");
      router.refresh();
    }
  }

  async function onSubmitPassword({ currentPassword, newPassword }: PasswordFormData) {
    const { error } = await authClient.changePassword({
      currentPassword,
      newPassword,
      revokeOtherSessions: true,
    });
    if (error) {
      toast.error(error.message || "تغییر گذرواژه با مشکل مواجه شد");
    } else {
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
      toast.success("خروج از حساب ها با موفقیت انجام شد");
      router.push("/");
    }
  }

  const userForm: FormField[] = [
    {
      title: "نام نمایشی",
      name: "displayName",
      type: "text",
      input: "input",
      error: profileFormState.errors.displayName?.message,
      register,
    },
    {
      title: "شماره همراه",
      name: "phone",
      type: "tel", // ✅ بهتر از number
      input: "input",
      error: profileFormState.errors.phone?.message,
      register,
    },
    {
      title: "آدرس",
      name: "address",
      type: "text",
      input: "textarea", // ✅ textarea واقعی
      error: profileFormState.errors.address?.message,
      register,
    },
  ];

  const passwordForm: FormField[] = [
    {
      title: "گذرواژه قبلی",
      name: "currentPassword",
      type: showpass ? "text" : "password",
      input: "input",
      error: passwordFormState.errors.currentPassword?.message,
      register: passwordRegister,
    },
    {
      title: "گذرواژه جدید",
      name: "newPassword",
      type: showpass ? "text" : "password",
      input: "input",
      error: passwordFormState.errors.newPassword?.message,
      register: passwordRegister,
    },
    {
      title: "تکرار گذرواژه جدید",
      name: "confirmPassword",
      type: showpass ? "text" : "password",
      input: "input",
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
    ...(accounts[0]?.providerId === "credential"
      ? [
          {
            name: "گذرواژه",
            info: "گذرواژه خود را تغییر دهید",
            link: <span>********</span>,
            input: passwordForm,
            submit: passwordHandleSubmit(onSubmitPassword),
          },
        ]
      : []),
  ];

  const isPending = passwordFormState.isSubmitting || profileFormState.isSubmitting;

  return (
    <div className="space-y-10 rounded-2xl text-sm pt-10">
            <div className="space-y-3">
              <h2 className="text-xl">پروفایل شما</h2>
              <p className="text-xs text-lfont">نحوه نمایش اطلاعات کاربری شما در اطلس در - برای تغییر هر بخش کلیک کنید</p>
            </div>

      {!session ? (
        Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="animate-pulse py-2 px-3">
            <div className="bg-lcard dark:bg-dcard rounded-lg h-10 w-full" />
          </div>
        ))
      ) : (
        <>
          <div className="flex justify-between w-full gap-1 px-3">
            <p className="my-auto">تصویر پروفایل</p>
            {session?.user?.image === null
            ? <div className="h-10 w-10 rounded-xl bg-linear-to-tr from-redorange to-yellow"></div>
            : <ImageCom
                className="rounded-xl h-10 w-10 "
                src={session?.user?.image ?? ""}
                alt={`${session?.user?.name ?? "user"} avatar`}
              />
          }
          </div>

          <div className="flex justify-between w-full gap-1 px-3">
            <p>آدرس ايميل</p>
            <p className="text-neutral-500 dark:text-neutral-400 truncate">
              {session.user.email}
            </p>
          </div>

          <div className="flex justify-between w-full gap-1 px-3">
            <p>نام کاربری</p>
            <p className="text-neutral-500 dark:text-neutral-400 truncate">
              {session.user.name}
            </p>
          </div>


          {btnLists.map((btnList) => (
            <form onSubmit={btnList.submit} key={btnList.name}>
              <Offcanvas
                title={
                  <>
                    <div className="text-start">
                      <p>{btnList.name}</p>
                      <p className="text-neutral-500 dark:text-neutral-400 text-[10px]">
                        {btnList.info}
                      </p>
                    </div>
                    <div>{btnList.link}</div>
                  </>
                }
                btnStyle="py-2 w-full px-3 rounded-lg hover:bg-lcard dark:hover:bg-dcard flex justify-between duration-300"
                position="top-0 right-0"
                size="h-screen max-w-full w-80 border-l-2 border-l-lcard dark:border-l-dcard"
                openTransition="translate-x-0"
                closeTransition="translate-x-full"
                onClose={onClose}
              >
                <div className="flex justify-between mb-5">
                  <h1 className="text-xl">{btnList.name}</h1>
                  <Button
                    onClick={() => setOnClose(!onClose)}
                    variant="close"
                    type="button"
                    title="close button"
                  >
                    <IoClose />
                  </Button>
                </div>

                <div className="space-y-5">
                  <div className="flex flex-col space-y-3 w-full">
                    {btnList.input.map((field) => {
                      const InputComponent =
                        field.input === "textarea" ? "textarea" : "input";
                      return (
                        <div key={field.name} className="relative capitalize space-y-1">
                          <label>{field.title}</label>
                          <InputComponent
                            type={field.input === "input" ? field.type : undefined}
                            placeholder={field.title}
                            className={`${
                              field.error
                                ? "border-red focus:ring-2 ring-red"
                                : "focus:ring-2 ring-black dark:ring-white"
                            } resize-none w-full appearance-none rounded-xl px-3 py-3 block text-sm focus:outline-none dark:bg-dcard bg-lcard duration-200`}
                            {...field.register(field.name as string)}
                          />
                          <div
                            className={`text-red mt-2 text-[10px] md:text-sm transition-opacity duration-300 ${
                              field.error ? "opacity-100" : "opacity-0"
                            }`}
                          >
                            {field.error}
                          </div>

                          {field.name === "confirmPassword" && (
                            <button
                              className="bg-lcard dark:bg-dcard rounded-lg p-2 border-lbtn dark:border-dbtn border-2 flex justify-self-end"
                              onClick={() => setShowPass((s) => !s)}
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
                    disabled={isPending}
                    type="submit"
                    className="bg-black my-3 rounded-lg text-white dark:bg-white dark:text-black w-full py-2 mx-auto disabled:brightness-90 disabled:cursor-not-allowed flex justify-center"
                  >
                    {isPending ? (
                      <LoadingIcon color="bg-white dark:bg-black" />
                    ) : (
                      "ثبت تغييرات"
                    )}
                  </button>
                </div>
              </Offcanvas>
            </form>
          ))}

          <div className="space-y-10">
            <div>
              <h2 className="text-xl">مدریت حساب</h2>
            </div>

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
              {loading ? <LoadingIcon color="bg-redorange" /> : <FaCaretLeft />}
            </button>

            <button
              onClick={() => {
                if (!session?.user?.id) return toast.error("کاربر یافت نشد");
                deleteUserMutation.mutate(session.user.id);
              }}
              className="flex justify-between w-full hover:text-purple duration-300 px-3"
              type="button"
            >
              <div className="text-start">
                <p className="text-red">حذف حساب</p>
                <p className="text-neutral-500 dark:text-neutral-400 text-[10px]">
                  با انتخاب اين گزينه تمام اطلاعات مربوط به شما حذف خواهد شد
                </p>
              </div>
              {deleteUserMutation.isPending ? (
                <LoadingIcon color="bg-red" />
              ) : (
                <FaCaretLeft />
              )}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
