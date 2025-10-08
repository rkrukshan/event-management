import axios from "axios";
import React, { useState } from "react";
import { FaSignInAlt } from "react-icons/fa";
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
      const res = await axios.post("http://localhost:5297/api/Auth/login", {
        username: values.username,
        password: values.password,
      });
      console.log("Login Success", res.data);

      if (res.data.success) {
        localStorage.setItem(
          "user",
          JSON.stringify({
            username: res.data.username,
            role: res.data.role,
            userId: res.data.userId,
            isAdmin: false, 
          })
        );

        toast.success(res.data.message || "Login Success", {
          transition: Bounce,
        });
        navigate("/book");
      } else {
        //  Check if it's an admin restriction error
        if (
          res.data.message?.includes("admin") ||
          res.data.message?.includes("Administrators")
        ) {
          toast.error(res.data.message, { transition: Bounce });
          setError(`${res.data.message} Please use the admin login portal.`);
        } else {
          toast.error(res.data.message || "Login Failed", {
            transition: Bounce,
          });
          setError(res.data.message);
        }
      }
    } catch (err: any) {
      let errorMessage = "Login Failed";

      if (err.response) {
        errorMessage =
          err.response.data?.message || err.response.data || "Login Failed";

        if (
          errorMessage.includes("admin") ||
          errorMessage.includes("Administrators")
        ) {
          errorMessage += " Please use the admin login portal.";
        }
      } else if (err.request) {
        errorMessage = "Network error - please check if server is running";
      } else {
        errorMessage = err.message;
      }

      toast.error(errorMessage, { transition: Bounce });
      setError(errorMessage);
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  const validationSchema = Yup.object({
    username: Yup.string().required("Username is Required"),
    password: Yup.string().required("Password is Required"),
  });

  return (
    <div className="container flex items-center justify-center min-h-screen bg-gray-100">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-sm text-center">
        <div className="flex justify-center mb-5">
          <div className="bg-blue-100 p-3 rounded-full">
            <FaSignInAlt className="text-blue-600 text-2xl" />
          </div>
        </div>

        <h1 className="text-xl font-semibold text-gray-800 mb-2">
          Event Management User
        </h1>
        <p className="text-sm text-gray-500 mb-6">Login to your account</p>

        <Formik
          initialValues={{
            username: "",
            password: "",
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

              {error && (
                <div className="text-red-500 text-sm bg-red-50 p-2 rounded">
                  {error.includes("admin") && (
                    <div className="mt-2">
                      <a
                        href="/usercreate"
                        className="text-blue-500 hover:text-blue-700 font-medium"
                      >
                        Create an Account
                      </a>
                    </div>
                  )}
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
                disabled={loading || isSubmitting}
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </Form>
          )}
        </Formik>

        <div className="mt-6 text-sm">
          <p className="text-gray-600">
            Don't have an account?{" "}
            <a
              href="/usercreate"
              className="text-blue-500 hover:text-blue-600 font-medium"
            >
              Sign Up
            </a>
          </p>
          <p className="text-gray-600 mt-2">
            <a
              href="/admin/login"
              className="text-blue-500 hover:text-blue-600 font-medium"
            >
              For Admin Access
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}