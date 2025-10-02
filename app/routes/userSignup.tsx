import axios from "axios";
import React, { useState } from "react";
import { FaUserPlus } from "react-icons/fa";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Bounce, toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router";

export default function UserSignup() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    setLoading(true);
    setError("");

    try {
      const res = await axios.post("http://localhost:5264/api/auth/register", {
        username: values.username,
        password: values.password,
      });
      console.log("Signup Success", res.data);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      toast.success("Signup Success", { transition: Bounce });
      navigate("/dashboard");
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Signup Failed";
      toast.error(errorMessage, { transition: Bounce });
      console.log("Signup Failed", err);
      setError(errorMessage);
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  const validationSchema = Yup.object({
    username: Yup.string()
      .min(3, "Must be at least 3 characters")
      .required("Username is Required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is Required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Confirm Password is Required"),
  });

  return (
    <div className="container flex items-center justify-center min-h-screen bg-gray-100">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-sm text-center">
        <div className="flex justify-center mb-5">
          <div className="bg-blue-100 p-3 rounded-full">
            <FaUserPlus className="text-blue-600 text-2xl" />
          </div>
        </div>

        <h1 className="text-xl font-semibold text-gray-800 mb-2">
          Event Management User
        </h1>
        <p className="text-sm text-gray-500 mb-6">Create your account.</p>

        <Formik
          initialValues={{
            username: "",
            password: "",
            confirmPassword: "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, errors, touched }) => (
            <Form className="space-y-6">
              <div className="text-left">
                <Field
                  type="text"
                  name="username"
                  placeholder="Username"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black ${
                    errors.username && touched.username
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                <ErrorMessage
                  name="username"
                  component="p"
                  className="text-red-500 text-xs mt-1"
                />
              </div>

              <div className="text-left">
                <Field
                  type="password"
                  name="password"
                  placeholder="Password"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black ${
                    errors.password && touched.password
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                <ErrorMessage
                  name="password"
                  component="p"
                  className="text-red-500 text-xs mt-1"
                />
              </div>

              <div className="text-left">
                <Field
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black ${
                    errors.confirmPassword && touched.confirmPassword
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                <ErrorMessage
                  name="confirmPassword"
                  component="p"
                  className="text-red-500 text-xs mt-1"
                />
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
                disabled={loading || isSubmitting}
              >
                {loading ? "Signing up..." : "Sign Up"}
              </button>
            </Form>
          )}
        </Formik>

        <div className="mt-6 text-sm">
          <p className="text-gray-600">
            Already have an account?{" "}
            <a
              href="/userlogin" className="text-blue-500 hover:text-blue-600 font-medium" >
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
