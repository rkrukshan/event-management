import axios from "axios";
import React, { useState } from "react";
import { FaUserShield } from "react-icons/fa";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Bounce, toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router";

export default function AdminLogin() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    setLoading(true);
    setError("");

    try {
      const res = await axios.post(
        "http://localhost:5297/api/Auth/admin/login",
        {
          username: values.username,
          password: values.password,
        }
      );
      console.log("Admin Login Success", res.data);

      if (res.data.success) {
        localStorage.setItem(
          "user",
          JSON.stringify({
            username: res.data.username,
            role: res.data.role,
            userId: res.data.userId,
            isAdmin: true,
          })
        );

        toast.success(res.data.message || "Admin Login Success", {
          transition: Bounce,
        });
        navigate("/manage");
      } else {
        toast.error(res.data.message || "Admin Login Failed", {
          transition: Bounce,
        });
        setError(res.data.message);
      }
    } catch (err: any) {
      let errorMessage = "Admin Login Failed";

      if (err.response) {
        errorMessage =
          err.response.data?.message ||
          err.response.data ||
          "Admin Login Failed";
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
    username: Yup.string().required("Admin Username is Required"),
    password: Yup.string().required("Admin Password is Required"),
  });

  return (
    <div className="container flex items-center justify-center min-h-screen bg-gray-100">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="bg-blue-950/85 rounded-xl shadow-lg p-8 w-full max-w-sm text-center">
        <div className="flex justify-center mb-5">
          <div className="bg-blue-100 p-3 rounded-full">
            <FaUserShield className="text-blue-600 text-2xl" />
          </div>
        </div>

        <h1 className="text-xl font-semibold text-white mb-2">Admin Portal</h1>
        <p className="text-sm text-white mb-6">Administrator Access Only</p>

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
                  placeholder="Admin Username"
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
                  placeholder="Admin Password"
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

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <button
                type="submit"
                className="bg-gradient-to-r from-slate-450 to-gray-950 hover:border-2 border-slate-200  text-white font-semibold py-2 px-4 rounded hover:opacity-60 cursor-pointer transition duration-300"
                disabled={loading || isSubmitting}
              >
                {loading ? "Signing in..." : "Admin Login"}
              </button>
            </Form>
          )}
        </Formik>

        <div className="mt-6 text-sm">
          <p className="text-white">
            Not an admin?{" "}
            <a
              href="/userlogin"
              className="text-white font-medium"
            >
              User Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
