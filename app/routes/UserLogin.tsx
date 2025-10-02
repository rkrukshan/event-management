import axios from "axios";
import React, { useState } from "react";
import { FaLock } from "react-icons/fa";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Bounce, toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router";

export default function UserLogin() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    setLoading(true);
    setError("");

    try {
      const res = await axios.post("http://localhost:5264/api/auth/login", {
        username: values.username,
        password: values.password,
      });
      console.log("Login Success", res.data);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      toast.success("Login Success", { transition: Bounce });
      navigate("/book");
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Login Failed";
      toast.error(errorMessage, { transition: Bounce });
      console.log("Login Failed", err);
      setError(errorMessage);
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  const validationSchema = Yup.object({
    username: Yup.string().required("Username is Required"),
    password: Yup.string()
      .min(4, "Password must be at least 4 characters")
      .required("Password is Required"),
  });

  return (
    <div className="container flex items-center justify-center min-h-screen bg-gray-100 max-w-screen">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-sm text-center">
        <div className="flex justify-center mb-5"></div>

        <h1 className="text-xl font-semibold text-gray-800 mb-2">
          Event Management User
        </h1>
        <p className="text-sm text-gray-500 mb-6">Secure login for Users.</p>

        <Formik
          initialValues={{ username: "", password: "" }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, errors, touched }) => (
            <Form className="space-y-16">
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

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
                disabled={loading || isSubmitting}
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </Form>
          )}
        </Formik>

        <div className="mt-6 text-sm">
          <p className="text-gray-600">
            Don't have an account?
            <a
              href="/userCreate"
              className="text-blue-500 hover:text-blue-500 font-medium"
            >
              Sign up
            </a>
          </p>
          <p className="text-gray-600 my-5">
            <a
              href="/adminlogin"
              className="text-blue-500 hover:text-blue-500 font-medium"
            >
              For Admin Access
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
