import React, { useState } from "react";
import axiosInstance from "../services/axiosInstance";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const response = await axiosInstance.post("/users/signup", {
        username,
        email,
        password,
      });
      alert("Signup successful! Please login.");
      window.location.href = "/"; // Redirect to login page
    } catch (err) {
      console.error("Signup error:", err);
      alert("Failed to create an account.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-green-100 via-white to-blue-100">
      {/* Company Name */}
      <h1 className="text-4xl font-bold text-gray-800 mb-8">PharmaCompare</h1>
      <div className="w-full max-w-sm bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Sign Up</h2>
        <form onSubmit={handleSignup}>
          <div className="form-control w-full mb-4">
            <label className="label">
              <span className="label-text text-gray-700 font-semibold">Username</span>
            </label>
            <input
              type="text"
              placeholder="Enter your username"
              className="input input-bordered w-full bg-gray-50 text-gray-900 placeholder-gray-400 focus:ring focus:ring-green-300 focus:border-green-500"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-control w-full mb-4">
            <label className="label">
              <span className="label-text text-gray-700 font-semibold">Email</span>
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              className="input input-bordered w-full bg-gray-50 text-gray-900 placeholder-gray-400 focus:ring focus:ring-green-300 focus:border-green-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-control w-full mb-4">
            <label className="label">
              <span className="label-text text-gray-700 font-semibold">Password</span>
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              className="input input-bordered w-full bg-gray-50 text-gray-900 placeholder-gray-400 focus:ring focus:ring-green-300 focus:border-green-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-control w-full mb-6">
            <label className="label">
              <span className="label-text text-gray-700 font-semibold">
                Confirm Password
              </span>
            </label>
            <input
              type="password"
              placeholder="Confirm your password"
              className="input input-bordered w-full bg-gray-50 text-gray-900 placeholder-gray-400 focus:ring focus:ring-green-300 focus:border-green-500"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="btn bg-green-600 hover:bg-green-700 text-gray-900 font-bold py-2 px-4 rounded w-full transition-all duration-300"
          >
            Sign Up
          </button>
        </form>
        <p className="text-center mt-6 text-gray-500">
          Already have an account?{" "}
          <a href="/" className="text-green-500 hover:underline font-semibold">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Signup;