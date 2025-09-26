import axios from "axios";
import React, { useState } from "react";
import { FaLock } from "react-icons/fa";
import { useNavigate } from "react-router";

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
      setError("Login Failed");
    } finally {
      setLoading(false);
      setUsername("");
      setPassword("");
      navigate("/");
    }
  };

  return (
    <div className="container flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-sm text-center">
        <div className="flex justify-center mb-5">
          <div className="bg-blue-100 p-9 rounded-full">
            <FaLock className="text-blue-600 text-2xl" />
          </div>
        </div>

        <h1 className="text-xl font-semibold text-gray-800">
          Tech Events Admin
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          Secure login for administrators.
        </p>

        <form onSubmit={handleSubmit} className="space-y-16">
          <input
            type="text"
            placeholder="Username"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 border-slate-200 text-black"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 border-slate-200 text-black"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            {loading ? "Logging in..." : "login"}
          </button>
        </form>
      </div>
    </div>
  );
}
