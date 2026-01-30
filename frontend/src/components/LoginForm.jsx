import React, { useState } from "react";
import { Link } from "react-router-dom";
import loginUser from "./login";

function LoginForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(""); // Clear error when user starts typing again
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      setError("Please fill all the fields");
      return;
    }
    setIsLoading(true);
    loginUser(formData);
    setIsLoading(false);
  };

   const handleGoogleLogin = () => {
    window.location.href = "http://localhost:8000/auth/google";
    };

    const handleLinkedInLogin = () => {
    window.location.href = "http://localhost:8000/auth/linkedin";
    };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100 p-4">
      <form
        className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-gray-100"
        onSubmit={handleSubmit}
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900">Login</h2>
          <p className="text-sm text-gray-500 mt-2">Sign in to your account to continue</p>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm text-center">
            {error}
          </div>
        )}

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
            <input
              name="email"
              type="text"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 focus:bg-white"
              placeholder="Enter email"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-4 pr-12 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 focus:bg-white"
                placeholder="Enter password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>
        </div>
        {/* Divider */}
    <div className="relative my-6">
    <div className="absolute inset-0 flex items-center">
    <div className="w-full border-t border-gray-200"></div>
    </div>
    <div className="relative flex justify-center text-sm">
    <span className="bg-white px-2 text-gray-500">Or continue with</span>
    </div>
    </div>

    {/* Social Login Buttons */}
    <div className="grid grid-cols-2 gap-4">
    <button
    type="button"
    onClick={handleGoogleLogin}
    className="flex items-center justify-center gap-2 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all"
  >
    <img
      src="https://www.svgrepo.com/show/355037/google.svg"
      className="w-5 h-5"
      alt="Google"
    />
    <span className="text-sm font-semibold text-gray-700">
      Google
    </span>
  </button>

  <button
    type="button"
    onClick={handleLinkedInLogin}
    className="flex items-center justify-center gap-2 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all"
  >
    <img
      src="https://www.svgrepo.com/show/448234/linkedin.svg"
      className="w-5 h-5"
      alt="LinkedIn"
    />
    <span className="text-sm font-semibold text-gray-700">
      LinkedIn
    </span>
  </button>
    </div>

        <div className="mt-8 flex flex-col gap-3">
          <Link 
            to="/"
            className="block w-full text-center bg-white text-blue-600 font-bold py-3 px-4 rounded-lg border border-blue-600 hover:bg-blue-50"
          >
            Create an Account
          </Link>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full text-white font-bold py-3 px-4 rounded-lg shadow-lg transform transition-all duration-200 
              ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 hover:-translate-y-0.5'}`}
          >
            {isLoading ? "Signing In..." : "Login"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default LoginForm;