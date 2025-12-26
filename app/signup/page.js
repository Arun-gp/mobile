"use client";

import { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from 'next/link';
import { Eye, EyeOff, Lock, Mail, User, ArrowRight, Smartphone } from 'lucide-react';
import { useRouter } from "next/navigation";

export default function UserForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");
    const name = formData.get("name");

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, {
        displayName: name
      });

      await setDoc(doc(db, "users", user.uid), {
        name: name,
        email: email,
        role: "user",
        createdAt: new Date().toISOString()
      });

      toast.success("Account created successfully!");
      router.push("/products");

    } catch (error) {
      console.error("Signup error:", error);
      let errorMessage = "An error occurred during signup.";

      // Handle Firebase specific error codes
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = "This email is already registered.";
      } else if (error.code === 'auth/weak-password') {
        errorMessage = "Password should be at least 6 characters long.";
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = "Please enter a valid email address.";
      } else if (error.code === 'auth/operation-not-allowed') {
        errorMessage = "Email/Password registration is not enabled. Please contact support.";
      } else {
        errorMessage = error.message; // Show the raw error message if it's unknown
      }

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-[#0066cc] rounded-3xl flex items-center justify-center shadow-xl shadow-[#0066cc]/20">
            <Smartphone className="w-8 h-8 text-white" />
          </div>
        </div>
        <h2 className="text-center text-4xl font-black text-gray-900 uppercase tracking-tighter">
          Create Account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-400 font-bold uppercase tracking-widest">
          Join our Mobile Spare community
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-12 px-6 shadow-2xl rounded-[3rem] border border-gray-100 sm:px-12 mx-4 sm:mx-0">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-300" />
                <input
                  name="name"
                  type="text"
                  required
                  className="block w-full pl-12 pr-4 py-4 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-[#0066cc] font-bold"
                  placeholder="EX: ALEX JOHNSON"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-300" />
                <input
                  name="email"
                  type="email"
                  required
                  className="block w-full pl-12 pr-4 py-4 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-[#0066cc] font-bold"
                  placeholder="EX: ALEX@MAIL.COM"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                Create Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-300" />
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="block w-full pl-12 pr-12 py-4 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-[#0066cc] font-bold"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-tight leading-relaxed px-2">
              By creating an account, you agree to our
              <Link href="/termsandcondition" className="text-[#0066cc] mx-1">Terms of Service</Link>
              and
              <Link href="/privacyPolicy" className="text-[#0066cc] mx-1">Privacy Policy</Link>.
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-5 px-4 border border-transparent rounded-2xl shadow-xl text-sm font-black text-white bg-[#0066cc] hover:bg-[#0052a3] focus:outline-none transition-all transform hover:scale-[1.02] active:scale-100 uppercase tracking-widest disabled:opacity-50"
            >
              {loading ? "CREATING ACCOUNT..." : "START YOUR JOURNEY"}
              {!loading && <ArrowRight className="ml-3 h-5 w-5" />}
            </button>
          </form>

          <div className="mt-10 pt-10 border-t border-gray-100 text-center">
            <p className="text-sm font-bold text-gray-400 uppercase tracking-tight">
              Already have an account?{' '}
              <Link href="/login" className="text-[#0066cc] hover:underline">
                SIGN IN HERE
              </Link>
            </p>
          </div>
        </div>
      </div>
      <ToastContainer position="top-right" />
    </div>
  );
}
