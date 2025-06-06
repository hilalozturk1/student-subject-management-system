"use client";

import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import CustomInput from "@/components/CustomInput";
import CustomButton from "@/components/CustomButton";
import api from "@/lib/api";

const validationSchema = Yup.object().shape({
  username: Yup.string().required("User name required."),
  email: Yup.string().email("Email failed.").required("Email required"),
  password: Yup.string()
    .min(6, "Your password must be 6 characters at least.")
    .required("Password required."),
});

export default function RegisterPage() {
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await api.post("/api/auth/users/", values);
        toast.success("Register successfull, please login.");
        router.push("/login");
      } catch (error: any) {
        toast.error(error.response?.data?.username?.[0] || error.response?.data?.email?.[0] || "Register failed.");
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center mb-6">Register</h2>
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div>
            <CustomInput
              id="username"
              name="username"
              label="User Name"
              type="text"
              value={formik.values.username}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              errorValue={formik.touched.username && formik.errors.username ? formik.errors.username : ""}
            />
          </div>
          <div>
            <CustomInput
              id="email"
              name="email"
              label="E-mail"
              type="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              errorValue={formik.touched.email && formik.errors.email ? formik.errors.email : ""}
            />
          </div>
          <div>
            <CustomInput
              id="password"
              name="password"
              label="Password"
              type="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              errorValue={formik.touched.password && formik.errors.password ? formik.errors.password : ""}
            />
          </div>
          <CustomButton
            type="submit"
            loading={formik.isSubmitting}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md"
          >
            Register
          </CustomButton>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Do you already have an account?{" "}
          <a href="/login" className="text-blue-500 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}