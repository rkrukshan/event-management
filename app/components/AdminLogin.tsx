import axios from "axios";
import React, { useState } from "react";
import { FaLock } from "react-icons/fa";
import { useNavigate } from "react-router";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.post("ergerg", {
        username,
        password,
      });
      console.log("Login Success", res.data);

      localStorage.setItem("token", res.data.token);
      alert("Login Success");
    } catch (err) {
      console.log("Login Failed", err);
      setError("Try Again");
    } finally {
      setLoading(false);
      setUsername("");
      setPassword("");
      navigate("/");
    }
  };

  const validationSchema = Yup.object({
    username: Yup.string().required("Username is Required"),
    password: Yup.string()
      .min(4, "Password must be at least 4 characters")
      .required("Password is Required"),
  });

  return (
    <div className="container flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-sm text-center">
        <div className="flex justify-center mb-5">
          <div className="bg-blue-100 p-9 rounded-full">
            <FaLock className="text-blue-600 text-2xl" />
          </div>
        </div>

        <h1 className="text-xl font-semibold text-gray-800">
          Event Management Admin
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          Secure login for administrators.
        </p>

        <form onSubmit={handleSubmit} className="space-y-16">
          <input
            type="text"
            placeholder="Username"
            className="inputbox"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="inputbox"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p className="errmsg">{error}</p>}

          <button type="submit" className="loginbtn">
            {loading ? "Logging in..." : "login"}
          </button>
        </form>
      </div>
    </div>
  );
}
