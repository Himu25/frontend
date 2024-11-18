"use client";
import { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

const AuthForm = () => {
  const [isSignup, setIsSignup] = useState(true);
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleForm = () => {
    setIsSignup((prev) => !prev);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { name, email, password } = formData;

    try {
      let response;
      if (isSignup) {
        response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`,
          { name, email, password }
        );
        if (response.data.message === "User registered successfully") {
          alert("User registered successfully. You can now login.");
          toggleForm();
        }
      } else {
        response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
          { email, password }
        );
        if (response.data.token) {
          Cookies.set("token", response.data.token, { expires: 7 });
          router.push("/user/portfolio");
        }
      }
    } catch (error) {
      setError(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md mx-auto p-8 bg-white shadow-md rounded-lg">
        <h2 className="text-3xl font-semibold text-center mb-6 text-gray-800">
          {isSignup ? "Sign Up" : "Login"}
        </h2>
        {error && <div className="text-red-500 text-center mb-4">{error}</div>}
        <form onSubmit={handleSubmit}>
          {isSignup && (
            <div className="mb-4">
              <label
                className="block text-sm font-medium text-gray-700"
                htmlFor="name"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
          )}
          <div className="mb-4">
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="email"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="password"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full p-3 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            disabled={loading}
          >
            {loading ? "Submitting..." : isSignup ? "Sign Up" : "Login"}
          </button>
        </form>
        <div className="mt-4 text-center">
          <span className="text-sm text-gray-600">
            {isSignup ? "Already have an account?" : "Don’t have an account?"}
            <button
              onClick={toggleForm}
              className="text-green-600 ml-1 hover:underline"
            >
              {isSignup ? "Login" : "Sign Up"}
            </button>
          </span>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
