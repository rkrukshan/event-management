import React from "react";
import { FaLock } from "react-icons/fa";

export default function AdminLogin() {
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

        <form className="space-y-16">
          <input
            type="text"
            placeholder="Username"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 border-slate-200"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 border-slate-200"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
