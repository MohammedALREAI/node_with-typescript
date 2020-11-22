import yup from "yup";
export const validation = {
  loginValidation: yup.shape.object({
    email: yup
      .string()
      .email("it should be enter email")
      .required("Email is Required"),
    password: yup
      .string()
      .min(6, "it should be more than 6 character")
      .required("password is requires"),
  }),

  registerValidation: yup.shape.object({
    email: yup
      .string()
      .email("it should be enter email")
      .required("Email is Required"),
    username: yup
      .string()
      .min(3, "it should be more than 6 character")
      .required("password is Required"),

    password: yup
      .string()
      .min(6, "it should be more than 6 charachter")
      .required("password is Required"),
  }),
};
