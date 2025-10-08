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
      const res = await axios.post("http://localhost:5297/api/auth/register", {
        username: values.username,
        password: values.password,
      });
      console.log("Signup Success", res.data);

      // Store the token and user data
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
      }
      if (res.data.userId) {
        localStorage.setItem("userId", res.data.userId.toString());
      }
      if (res.data.username) {
        localStorage.setItem("username", res.data.username);
      }
      if (res.data.role) {
        localStorage.setItem("role", res.data.role);
      }

      toast.success("Signup Success", { transition: Bounce });

      // Navigate to book page after successful signup
      setTimeout(() => {
        navigate("/book");
      }, 1000);
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

      <div className="bg-blue-950/85 rounded-xl shadow-lg p-8 w-full max-w-sm text-center">
        <div className="flex justify-center mb-5">
          <div className="bg-blue-100 p-3 rounded-full">
            <FaUserPlus className="text-blue-600 text-2xl" />
          </div>
        </div>

        <h1 className="text-xl font-semibold text-white mb-2">
          Event Management User
        </h1>
        <p className="text-sm text-white mb-6">Create your account.</p>

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
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white ${
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
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white ${
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
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white ${
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
                className="bg-gradient-to-r from-slate-450 to-gray-950 hover:border-2 border-slate-200  text-white font-semibold py-2 px-4 rounded hover:opacity-60 cursor-pointer transition duration-300"
                disabled={loading || isSubmitting}
              >
                {loading ? "Signing up..." : "Sign Up"}
              </button>
            </Form>
          )}
        </Formik>

        <div className="mt-6 text-sm">
          <p className="text-white font-medium">
            Already have an account?{" "}
            <a href="/userlogin" className="text-white font-medium">
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
