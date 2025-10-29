import { z } from "zod";

const strongRegex = /(?=.*[0-9])/;
const uppercaseRegex = /^(?=.*[A-Z])/;
const symboleRegex = /(?=.*[!@#\$%\^&\*;'"])/;
const abusiveWords = ["fuck","fucking","fucked","fuck off","shut the fuck off","shit","sex","anal","pussy","dick","bitch"];

// Custom refinement for abusive words
const noAbusiveWords = (value: string) => {
  const words = value.split(" ");
  for (let word of words) {
    if (abusiveWords.includes(word.toLowerCase())) return false;
  }
  return true;
};

// Custom refinement for file validation
const validateFile = (file: File) => {
  const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  if (file.size > 5000000) return false;
  if (!validTypes.includes(file.type)) return false;
  return true;
};

export const signupValidation = z.object({
  name: z.string()
    .trim()
    .min(1, "نام کاربری نباید خالی باشد")
    .min(4, "نام کاربری باید بیشتر از ۴ حرف باشد")
    .max(16, "نام کاربری باید کمتر از ۱۶ حرف باشد"),
  email: z.string()
    .trim()
    .min(1, "فیلد ایمیل نباید خالی باشد")
    .email("ایمیل اشتباه است"),
  password: z.string()
    .trim()
    .min(1, "گذرواژه نباید خالی باشد")
    .min(8, "گذرواژه نباید کمتر از ۸ کاراکتر باشد")
    .max(16, "گذرواژه نباید بیشتر از ۱۶ کاراکتر باشد")
    .regex(symboleRegex, "گذرواژه باید دارای این سمبل ها باشد $&+,:;=?@#")
    .regex(strongRegex, "گذرواژه باید دارای عدد باشد")
    .regex(uppercaseRegex, "گذرواژه باید شامل یک حرف بزرگ باشد"),
  confirmPassword: z.string()
    .min(1, "تکرار گذرواژه نباید خالی باشد")
}).refine((data) => data.password === data.confirmPassword, {
  message: "تکرار گذرواژه اشتباه است",
  path: ["confirmPassword"],
});

export const loginValidation = z.object({
  email: z.string()
    .email("ایمیل اشتباه است")
    .min(1, "فیلد ایمیل نباید خالی باشد"),
  password: z.string()
    .min(1, "گذرواژه نباید خالی باشد")
    .min(8, "گذرواژه نباید کمتر از ۸ کاراکتر باشد"),
  rememberMe: z.boolean().optional(),
});

export const postValidation = z.object({
  postId: z.string().optional(),
  title: z.string()
  .trim()
  .min(1, "Title field must not be empty")
  .min(5, "Title must be at least 5 character")
  .max(100, "Title cannot exceed 100 characters"),
  desc: z.string()
  .trim()
  .min(1, "desc field must not be empty")
  .min(5, "desc must be at least 5 character")
  .max(512, "desc cannot exceed 512 characters"),
  images: z.array(z.string()).optional(),
  rmFiles: z.array(z.string()).optional(),
  content: z.string()
    .trim()
    .min(1, "content field must not be empty")
    .min(10, "content must be at least 10 character"),
  tags: z.array(z.string())
    .min(1, "tag must be at least 1 character")
    .min(1, "tag field must not be empty"),
  scheduledPublish: z.string().optional(), 
});

export const productValidation = z.object({
  productId: z.string().optional(),
  name: z.string()
    .trim()
    .min(1, "Title field must not be empty")
    .min(5, "Title must be at least 5 character")
    .max(512, "Title cannot exceed 512 characters"),
  desc: z.string()
    .trim()
    .min(1, "desc field must not be empty")
    .min(5, "desc must be at least 5 character")
    .max(512, "desc cannot exceed 512 characters"),
  content: z.string()
    .trim()
    .min(1, "content field must not be empty")
    .min(10, "content must be at least 10 character"),
  images: z.array(z.any()).optional(),
  rmFiles: z.array(z.string()).optional(),
  colors: z.array(
    z.object({
      name: z.string().min(1, "Color name is required"),
      hexCode: z.string().min(1, "Color hex code is required"),
      price: z.number()
        .min(0.01, "Price must be greater than 0")
        .min(1, "Color price is required"),
      discount: z.number()
        .min(0, "Discount can't be negative")
        .max(100, "Discount can't be more than 100%"),
      stocks: z.number().min(0, "Color stocks is required"),
    })
  ).min(1, "At least one color is required"),
});

export const orderGatewayValidation = z.object({
  user: z.string()
    .trim()
    .min(1, "Title field must not be empty")
    .min(8, "نام و نام خانوادگی نباید کمتر از ۸ حرف باشد")
    .max(30, "نام و نام خانوادگی نباید بیشتر از ۳۰ حرف باشد"),
  phone: z.string()
    .min(1, "فیلد شماره تماس نباید خالی باشد")
    .regex(/^[0-9]+$/, "فقط باید حاوی اعداد باشد")
    .min(10, "شماره تماس حداقل باید ۱۰ عدد باشد")
    .max(15, "شماره تماس نباید بیشتر از ۱۵ عدد باشد"),
  address: z.string()
    .trim()
    .min(1, "فیلد آدرس نباید خالی باشد")
    .min(10, "آدرس نباید کمتر از ۱۰ کاراکتر باشد")
    .max(512, "آدرس نباید بیشتر از ۵۱۲ کاراکتر باشد"),
  rule: z.enum(["direct", "gateway"], 
  //   {
  //   errorMap: () => ({ message: "نوع پرداخت معتبر نیست" })
  // }
),
});

export const orderDirectValidation = z.object({
  user: z.string()
    .trim()
    .min(1, "Title field must not be empty")
    .min(8, "نام و نام خانوادگی نباید کمتر از ۸ حرف باشد")
    .max(30, "نام و نام خانوادگی نباید بیشتر از ۳۰ حرف باشد"),
  phone: z.string()
    .min(1, "فیلد شماره تماس نباید خالی باشد")
    .regex(/^[0-9]+$/, "فقط باید حاوی اعداد باشد")
    .min(10, "شماره تماس حداقل باید ۱۰ عدد باشد")
    .max(15, "شماره تماس نباید بیشتر از ۱۵ عدد باشد"),
  paymentId: z.number()
    .min(1, "desc field must not be empty")
    .min(5, "desc must be at least 5 character")
    .max(512, "desc cannot exceed 512 characters"),
  address: z.string()
    .trim()
    .min(1, "فیلد آدرس نباید خالی باشد")
    .min(10, "آدرس نباید کمتر از ۱۰ کاراکتر باشد")
    .max(512, "آدرس نباید بیشتر از ۵۱۲ کاراکتر باشد"),
  rule: z.string()
    .trim()
    .min(1, "Title field must not be empty")
    .min(5, "Title must be at least 5 character")
    .max(512, "Title cannot exceed 512 characters"),
});

export const imageFileValidation = z.object({
  image: z.instanceof(File)
    .refine(validateFile, {
      message: "Unsupported file type or file too large"
    }),
});

export const imageUrlValidation = z.object({
  image: z.string()
    .min(1, "Image field must not be empty")
    .min(10, 'URL must be at least 10 characters'),
});

export const savePostValidation = z.object({
  title: z.string()
    .trim()
    .min(1, "Title field must not be empty")
    .min(5, "Title must be at least 5 character")
    .max(512, "Title cannot exceed 512 characters"),
  image: z.string()
    .trim()
    .min(1, "image field must not be empty")
    .min(1, "image must be at least 1 character"),
});

export const commentValidation = z.object({
  content: z.string()
    .min(1, "این فیلد نباید خالی باشد")
    .min(10, "تعداد حروف بازخورد شما نباید کمتر از ده حرف باشد")
    .max(1000, "بازخورد شما نباید بیشتر از هزار حرف باشد")
    .refine(noAbusiveWords, "بازخورد شما حاوی الفاظ رکیک میباشد"),
});

export const reportValidation = z.object({
  reason: z.string().min(1, "reason field must not be empty"),
  message: z.string()
    .min(1, "message field must not be empty")
    .min(5, "message must be at least 5 character")
    .max(150, "message must not be more than 150 character"),
  type: z.enum(["USER", "REPLY", "COMMENT", "POST"]),
  url: z.string()
    .min(1, "url field must not be empty")
    .min(10, "url must be at least 10 character"),
});

export const settingProfileValidation = z.object({
  displayName: z.string()
    .min(1, "نام کاربری نباید خالی باشد")
    .min(4, "نام کاربری باید بیشتر از ۴ حرف باشد")
    .max(16, "نام کاربری باید کمتر از ۱۶ حرف باشد"),
  phone: z.string()
    .regex(/^[0-9]{11}$/, "شماره تلفن باید دقیقاً ۱۱ رقم باشد")
    .optional(),
  address: z.string()
    .max(200, "آدرس نباید بیشتر از ۲۰۰ کاراکتر باشد")
    .optional(),
});

export const settingPasswordValidation = z.object({
  currentPassword: z.string().min(1, "فیلد گذرواژه نباید خالی باشد"),
  newPassword: z.string()
    .trim()
    .min(1, "گذرواژه نباید خالی باشد")
    .min(8, "گذرواژه نباید کمتر از ۸ کاراکتر باشد")
    .max(16, "گذرواژه نباید بیشتر از ۱۶ کاراکتر باشد")
    .regex(symboleRegex, "گذرواژه باید دارای این سمبل ها باشد $&+,:;=?@#")
    .regex(strongRegex, "گذرواژه باید دارای عدد باشد")
    .regex(uppercaseRegex, "گذرواژه باید شامل یک حرف بزرگ باشد"),
  confirmPassword: z.string().min(1, "فیلد گذرواژه نباید خالی باشد"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "تکرار گذرواژه اشتباه است",
  path: ["confirmPassword"],
});

export const passwordSchema = z.string()
  .trim()
  .min(1, "گذرواژه نباید خالی باشد")
  .min(8, "گذرواژه نباید کمتر از ۸ کاراکتر باشد")
  .max(16, "گذرواژه نباید بیشتر از ۱۶ کاراکتر باشد")
  .regex(symboleRegex, "گذرواژه باید دارای این سمبل ها باشد $&+,:;=?@#")
  .regex(strongRegex, "گذرواژه باید دارای عدد باشد")
  .regex(uppercaseRegex, "گذرواژه باید شامل یک حرف بزرگ باشد");

// Export types for TypeScript
export type SignupValidation = z.infer<typeof signupValidation>;
export type LoginValidation = z.infer<typeof loginValidation>;
export type PostValidation = z.infer<typeof postValidation>;
export type ProductValidation = z.infer<typeof productValidation>;
export type OrderGatewayValidation = z.infer<typeof orderGatewayValidation>;
export type OrderDirectValidation = z.infer<typeof orderDirectValidation>;
export type CommentValidation = z.infer<typeof commentValidation>;
export type ReportValidation = z.infer<typeof reportValidation>;
export type SettingProfileValidation = z.infer<typeof settingProfileValidation>;
export type SettingPasswordValidation = z.infer<typeof settingPasswordValidation>;