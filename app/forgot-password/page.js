"use client";

import { ForgotLink } from "../action/ForgotLink"; // Ensure ForgotLink is correctly implemented
import { toast, ToastContainer } from "react-toastify"; // Import Toastify for notifications
import "react-toastify/dist/ReactToastify.css"; // Import Toastify CSS
import { useState } from "react";

export default function ForgotPassword() {
  const [email, setEmail] = useState(""); // State to store email input

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent the default form submission behavior

    // Call the ForgotLink action with the email
    const result = await ForgotLink({ email });

    // Display the appropriate toast based on the result
    if (result.success) {
      toast.success("Password reset link sent to your email.");
    } else {
      toast.error(result.message || "An error occurred. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-center mb-6">Forgot Password</h2>

        {/* Forgot Password Form */}
        <form onSubmit={handleSubmit} className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg space-y-6">
          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email</label>
            <input
              className="w-full p-4 border-2 border-[#FF7F50] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF7F50]"
              type="email"
              id="email"
              name="email"
              value={email} // Bind the value to the state
              onChange={(e) => setEmail(e.target.value)} // Update state on change
              required
              placeholder="Enter your email"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-[#FF7F50] text-white rounded-lg hover:bg-[#FF7F50] focus:outline-none focus:ring-2 focus:ring-[#FF7F50] transition duration-200"
          >
            Send Reset Link
          </button>
        </form>
      </div>

      {/* Toastify Container for notifications */}
      <ToastContainer />
    </div>
  );
}
