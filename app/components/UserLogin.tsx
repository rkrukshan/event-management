import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router";

export default function UserLogin() {
  const [userName, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.post("ergergerg", {
        userName,
        password,
      });
      console.log("Login Success", res.data);

      localStorage.setItem("token", res.data.token);
      alert("Login Successfull");
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

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-sm text-center">
        <div className="flex justify-center mb-4"></div>

        <h1 className="text-xl font-semibold text-gray-800">
          Tech Events User
        </h1>
        <p className="text-sm text-gray-500 mb-6">Secure login for Users.</p>

        <form onSubmit={handleSubmit} className="space-y-16">
          <input
            type="text"
            placeholder="Username"
            className="inputbox"
            value={userName}
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
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
