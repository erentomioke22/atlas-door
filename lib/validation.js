import * as yup from "yup";



const strongRegex = /(?=.*[0-9])/;
const uppercaseRegex = /^(?=.*[A-Z])/;
const symboleRegex = /(?=.*[!@#\$%\^&\*;'"])/;
const abusiveWords = ["fuck","fucking","fucked","fuck off","shut the fuck off","shit","sex","anal","pussy","dick","bitch",];



export const signupValidation = yup.object().shape({
    name: yup.string().trim().strict(true).required("نام کاربری نباید خالی باشد").min(4, "نام کاربری باید بیشتر از ۸ حرف باشد").max(16,"نام کاربری باید کمتر از ۱۶ حرف باشد"),
    email: yup
      .string().trim().strict(true)
      .email("ایمیل اشتباه است")
      .required("فیلد ایمیل نباید خالی باشد"),
    password: yup
      .string().trim().strict(true)
      .matches(symboleRegex, "گذرواژه باید دارای این سمبل ها باشد $&+,:;=?@#")
      .matches(strongRegex, "گذرواژه باید دارای عدد باشد")
      .matches(uppercaseRegex, "گذرواژه باید شامل یک حرف بزرگ باشد")
      .min(8, "گذرواژه نباید کمتر از ۸ کاراکتر باشد")
      .max(16,"گذرواژه نباید بیشتر از ۱۶ کاراکتر باشد")
      .required("گذرواژه نباید خالی باشد"),
    confirmPassword: yup
      .string()
      .label("confirm password")
      .required()
      .oneOf([yup.ref("password"), null], "تکرار گذرواژه اشتباه است"),
});


export const loginValidation = yup.object().shape({
    email: yup
      .string()
      .email("ایمیل اشتباه است")
      .required("فیلد ایمیل نباید خالی باشد"),
    password: yup
      .string()
      .min(8, "گذرواژه نباید کمتر از ۸ کاراکتر باشد")
      .required("گذرواژه نباید خالی باشد"),
});

 
export const postValidation =  yup.object().shape({
    title: yup.string().trim().strict(true).min(5, "Title must be at least 5 character").max(512, "Title cannot exceed 512 characters").required("Title field must not be empty"),
    desc: yup.string().trim().strict(true).min(5, "desc must be at least 5 character").max(512, "desc cannot exceed 512 characters").required("desc field must not be empty"),
    images: yup.array().required("Image field must not be empty"),
    content: yup.string().trim().strict(true).min(10, "content must be at least 5 character").required("content field must not be empty"),
    faqs:yup.array().strict(true).max(10, "tag cannot be more than 4 tag"),
    tags: yup.array().strict(true).min(1, "tag must be at least 1 character")
    // .max(4, "tag cannot be more than 4 tag")
    .required("tag field must not be empty"),
    // image: yup.mixed().required("Image field must not be empty").test('is-valid-type', 'Image must be a string or a file', value => { return typeof value === 'string' || (value && typeof value === 'object'); }),
    // contentImages: yup.array().strict(true),
});

export const productValidation =  yup.object().shape({
    name: yup.string().trim().strict(true).min(5, "Title must be at least 5 character").max(512, "Title cannot exceed 512 characters").required("Title field must not be empty"),
    desc: yup.string().trim().strict(true).min(5, "desc must be at least 5 character").max(512, "desc cannot exceed 512 characters").required("desc field must not be empty"),
    content: yup.string().trim().strict(true).min(10, "content must be at least 5 character").required("content field must not be empty"),
    faqs:yup.array().strict(true).max(10, "tag cannot be more than 4 tag"),
    // images: yup.array().min(1, "At least one image is required"),
    colors: yup
    .array()
    .of(
      yup.object().shape({
        name: yup.string().required("Color name is required"),
        hexCode: yup.string().required("Color hex code is required"),
        price: yup.number()
          .required("Color price is required")
          .moreThan(0, "Price must be greater than 0"),
        discount: yup.number()
          .required("Color discount is required")
          .min(0, "Discount can't be negative")
          .max(100, "Discount can't be more than 100%"),
        stocks: yup.number()
          .required("Color stocks is required")
          .min(1, "Stocks must be at least 1"),
      })
    )
    .min(1, "At least one color is required")
    .required("Colors are required"),
});

export const orderGatewayValidation =  yup.object().shape({
    user: yup.string().trim().strict(true).min(5, "Title must be at least 5 character").max(512, "Title cannot exceed 512 characters").required("Title field must not be empty"),
    // phone: yup.number().strict(true).min(5, "desc must be at least 5 character").max(512, "desc cannot exceed 512 characters").required("desc field must not be empty"),
    phone: yup.string()
    .matches(/^[0-9]+$/, "Must be only digits")
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number cannot exceed 15 digits")
    .required("Phone number is required"),
    address: yup.string().trim().strict(true).min(5, "Title must be at least 5 character").max(512, "Title cannot exceed 512 characters").required("Title field must not be empty"),
    rule: yup.string().trim().strict(true).min(5, "Title must be at least 5 character").max(512, "Title cannot exceed 512 characters").required("Title field must not be empty"),
});

export const orderDirectValidation =  yup.object().shape({
    user: yup.string().trim().strict(true).min(5, "Title must be at least 5 character").max(512, "Title cannot exceed 512 characters").required("Title field must not be empty"),
    phone: yup.string()
        .matches(/^[0-9]+$/, "Must be only digits")
        .min(10, "Phone number must be at least 10 digits")
        .max(15, "Phone number cannot exceed 15 digits")
        .required("Phone number is required"),
    // phone: yup.number().strict(true).min(5, "desc must be at least 5 character").max(512, "desc cannot exceed 512 characters").required("desc field must not be empty"),
    paymentId: yup.number().strict(true).min(5, "desc must be at least 5 character").max(512, "desc cannot exceed 512 characters").required("desc field must not be empty"),
    address: yup.string().trim().strict(true).min(5, "Title must be at least 5 character").max(512, "Title cannot exceed 512 characters").required("Title field must not be empty"),
    rule: yup.string().trim().strict(true).min(5, "Title must be at least 5 character").max(512, "Title cannot exceed 512 characters").required("Title field must not be empty"),
});

export const imageFileValidation =  yup.object().shape({
    image: yup.mixed().required("Image field must not be empty").test("fileSize", "The file is too large", value => value && value.size < 2000000).test("fileType", "Unsupported file type", value =>  value && ["image/jpeg","image/jpg", "image/png", "image/webp"].includes(value.type)),
});

export const imageUrlValidation =  yup.object().shape({
    // image: yup.string().required("Image field must not be empty").min(10,'must be amounter 10 character')
    image: yup.string().required("Image field must not be empty")
        .min(10, 'URL must be at least 10 characters')
        // .test('is-url', 'Must be a valid URL', value => {
        //     try {
        //         new URL(value);
        //         return true;
        //     } catch (err) {
        //         return false;
        //     }  
        // })
        // .test('is-image-url', 'URL must point to an image', value => {
        //     return /\.(jpeg|jpg|png|webp)$/i.test(value);
        // }),
});



export const savePostValidation =  yup.object().shape({
    title: yup.string().trim().strict(true).min(5, "Title must be at least 5 character").max(512, "Title cannot exceed 512 characters").required("Title field must not be empty"),
    image: yup.string().trim().strict(true).min(1, "image must be at least 1 character").required("image field must not be empty"),
});

export const commentValidation = yup.object().shape({
  // name: yup.string().trim().strict(true).required("فیلد نام نباید خالی باشد").min(4, "فیلد نام باید بیشتر از چهار حرف باشد").max(16,"فیلد نام نمیتاند بیشتر از شانزده حرف باشد"),
  // email: yup
  //   .string().trim().strict(true)
  //   .email("ایمیل معتبر نمیباشد")
  //   .required("فیلد ایمیل نباید خالی باشد"),
  content: yup.string().required("این فیلد نباید خالی باشد").min(10, "تعداد حروف بازخورد شما نباید کمتر از ده حرف باشد").max(1000, "بازخورد شما نباید بیشتر از هزار حرف باشد")
               .test("no-abusive-words","بازخورد شما حاوی الفاظ رکیک میباشد", (value) => {if (!value) return true; const words = value.split(" "); for (let word of words) {if(abusiveWords.includes(word.toLowerCase())) return false;} return true;})
              //  .test(  "no-word-greater-than-10",  "A word in the text is longer than 10 letters", 
              //   (value) => {if (!value) return true; const words = value.split(" "); for (let word of words) {if (word.length > 15) return false;} return true;})
})

export const reportValidation =  yup.object().shape({
  reason: yup.string().required("reason field must not be empty"),
  message: yup.string().min(5, "message must be at least 5 character").max(150, "message must not be more than 1 character").required("message field must not be empty"),
  type: yup.string().required("type field must not be empty"),
  url: yup.string().strict(true).min(10, "url must be at least 1 character").required("url field must not be empty"),
});



export const settingProfileValidation =yup.object().shape({
    displayName: yup.string().required("نام کاربری نباید خالی باشد").min(4, "نام کاربری باید بیشتر از ۸ حرف باشد").max(16,"نام کاربری باید کمتر از ۱۶ حرف باشد"),
    phone: yup.string().matches(/^[0-9]{11}$/, "شماره تلفن باید دقیقاً ۱۱ رقم باشد"),
    location: yup.string().max(200,"آدرس نباید بیشتر از ۲۰۰ کاراکتر باشد"),
    // image: yup.string(),
    image: yup.mixed().required("تصویر نباید خالی باشد"),
  })


export const settingPasswordValidation =yup.object().shape({
  lastPassword: yup.string().required("فیلد گذرواژه نباید خالی باشد"),
  password: yup
  .string().trim().strict(true)
  .matches(symboleRegex, "گذرواژه باید دارای این سمبل ها باشد $&+,:;=?@#")
  .matches(strongRegex, "گذرواژه باید دارای عدد باشد")
  .matches(uppercaseRegex, "گذرواژه باید شامل یک حرف بزرگ باشد")
  .min(8, "گذرواژه نباید کمتر از ۸ کاراکتر باشد")
  .max(16,"گذرواژه نباید بیشتر از ۱۶ کاراکتر باشد")
  .required("گذرواژه نباید خالی باشد"),
confirmPassword: yup
  .string()
  .label("confirm password")
  .required("فیلد گذرواژه نباید خالی باشد")
  .oneOf([yup.ref("password"), null], "تکرار گذرواژه اشتباه است"),
})

