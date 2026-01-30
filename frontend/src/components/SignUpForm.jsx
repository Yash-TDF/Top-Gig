import React, { useState } from "react";
import { Link } from "react-router-dom";
import signupUser from "./signup";


function SignUpForm() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.username || !formData.email || !formData.password) {
      setError("Please fill all the fields.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setIsLoading(true);
    signupUser(formData);
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
          <h2 className="text-3xl font-extrabold text-gray-900">Sign Up</h2>
          <p className="text-sm text-gray-500 mt-2">Create your account to get started</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm text-center">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {/* Username */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Username</label>
            <input
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 focus:bg-white transition-all"
              placeholder="Enter username"
            />
          </div>
          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 focus:bg-white transition-all"
              placeholder="Enter email"
            />
          </div>

          {/* Password Fields */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                placeholder="Password"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3.5 text-xs font-bold text-blue-600">
                {showPassword ? "HIDE" : "SHOW"}
              </button>
            </div>
            <div className="relative">
              <input
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                placeholder="Confirm"
              />
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-3.5 text-xs font-bold text-blue-600">
                {showConfirmPassword ? "HIDE" : "SHOW"}
              </button>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full mt-6 text-white font-bold py-3 px-4 rounded-lg shadow-lg transition-all ${
            isLoading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700 active:scale-95'
          }`}
        >
          {isLoading ? "Creating Account..." : "Sign Up"}
        </button>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
          <div className="relative flex justify-center text-sm"><span className="bg-white px-2 text-gray-500">Or sign up with</span></div>
        </div>

        {/* Social Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <button
          type="button"
          onClick={handleGoogleLogin}
          className="flex items-center justify-center gap-2 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all active:scale-95 w-full"
          >
          <img src="https://www.svgrepo.com/show/355037/google.svg" className="w-5 h-5" alt="Google" />
          <span className="text-sm font-semibold text-gray-700">Continue with Google</span>
        </button>
         <button
          type="button"
          onClick={handleLinkedInLogin}
          className="flex items-center justify-center gap-2 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all active:scale-95"
        >
          <img src="https://www.svgrepo.com/show/448234/linkedin.svg" className="w-5 h-5" alt="LinkedIn" />
          <span className="text-sm font-semibold text-gray-700">LinkedIn</span>
        </button>
        </div>
        <p className="mt-8 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 font-bold hover:underline">Login</Link>
        </p>
      </form>
    </div>
  );
};
export default SignUpForm;