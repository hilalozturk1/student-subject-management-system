"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import CustomInput from "@/components/CustomInput";
import CustomButton from "@/components/CustomButton";
import api from "@/lib/api";
import useAuthStore from "@/store/authStore";

const validationSchema = Yup.object().shape({
  username: Yup.string().required("User name required"),
  password: Yup.string().required("Password required"),
});

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await login(values.username, values.password);
        toast.success("Login successfull!");
        router.push("/dashboard/students");
      } catch (error: any) {
        toast.error(error.response?.data?.detail || "Login failed.");
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
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
          <div className="relative">
            <CustomInput
              id="password"
              name="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              errorValue={formik.touched.password && formik.errors.password ? formik.errors.password : ""}
              suffix={
                <CustomButton
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-500"
                >
                  {showPassword ? "hİDE" : "Show"}
                </CustomButton>
              }
            />
          </div>
          <CustomButton
            type="submit"
            loading={formik.isSubmitting}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md"
          >
            Giriş Yap
          </CustomButton>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Don't you have an account?{" "}
          <a href="/register" className="text-blue-500 hover:underline">
            Register
          </a>
        </p>
      </div>
    </div>
  );
}