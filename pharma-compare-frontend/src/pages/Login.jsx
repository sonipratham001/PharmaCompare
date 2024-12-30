import React, { useState } from "react";
import axios from "axios"; // Import axios

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/users/login`, {
        email,
        password,
      });
      // Save token to localStorage
      localStorage.setItem("token", response.data.token);

      // Wait until the token is set in localStorage
      setTimeout(() => {
        window.location.href = "/dashboard"; // Redirect to dashboard
      }, 100); // Add a small delay
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      alert("Invalid credentials");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-blue-100 via-white to-purple-100">
      {/* Company Name */}
      <h1 className="text-4xl font-bold text-gray-800 mb-8">PharmaCompare</h1>
      <div className="w-full max-w-sm bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Login</h2>
        <form onSubmit={handleLogin}>
          <div className="form-control w-full mb-4">
            <label className="label">
              <span className="label-text text-gray-700 font-semibold">Email</span>
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              className="input input-bordered w-full bg-gray-50 text-gray-900 placeholder-gray-400 focus:ring focus:ring-blue-300 focus:border-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-control w-full mb-6">
            <label className="label">
              <span className="label-text text-gray-700 font-semibold">Password</span>
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              className="input input-bordered w-full bg-gray-50 text-gray-900 placeholder-gray-400 focus:ring focus:ring-blue-300 focus:border-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="btn bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-gray-900 font-bold py-2 px-4 rounded w-full transition-all duration-300"
          >
            Login
          </button>
        </form>
        <p className="text-center mt-6 text-gray-500">
          Don’t have an account?{" "}
          <a href="/signup" className="text-blue-500 hover:underline font-semibold">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login; 