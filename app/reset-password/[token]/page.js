'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation'; // Import the useParams hook
import { resetPassword } from '@/app/action/ResetAction';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [toastMessage, setToastMessage] = useState(''); // For the toast
  const [toastType, setToastType] = useState(''); // 'success' or 'error'
  const router = useRouter();

  // Access token from the URL using useParams() hook
  const { token } = useParams();  // This will extract the token from the URL path

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate that passwords match
    if (password !== confirmPassword) {
      setToastMessage('Passwords do not match.');
      setToastType('error');
      return;
    }

    setError(''); // Clear any previous error messages

    // Call the server action to reset the password
    try {
      console.log(token);  // You can use the token here

      const res = await resetPassword({ password, token });

      if (res.success) {
        setToastMessage('Password has been reset successfully');
        setToastType('success');
        router.push('/login'); // Redirect to login page after reset
      } else {
        setToastMessage('Error resetting password');
        setToastType('error');
      }
    } catch (error) {
      setToastMessage('Something went wrong');
      setToastType('error');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full sm:w-96">
        <h2 className="text-2xl font-semibold mb-6 text-center">Reset Password</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="password"
              value={password}
              className="w-full p-3 border-2 border-[#FF7F50] rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF7F50]"
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
              required
            />
          </div>
          <div>
            <input
              type="password"
              value={confirmPassword}
              className="w-full p-3 border-2 border-[#FF7F50] rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF7F50]"
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              required
            />
          </div>
          <button 
            type="submit" 
            className="w-full py-3 bg-[#FF7F50] text-white font-semibold rounded-md hover:bg-[#FF7F50] focus:outline-none focus:ring-2 focus:ring-[#FF7F50]"
          >
            Reset Password
          </button>
        </form>
      </div>

      {/* Inline Toast message */}
      {toastMessage && (
        <div 
          className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
            toastType === 'success' ? 'bg-green-500' : 'bg-red-500'
          } text-white`}
        >
          {toastMessage}
        </div>
      )}
    </div>
  );
};
