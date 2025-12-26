"use client";

import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Lock, Mail, ArrowRight, Smartphone } from 'lucide-react'
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from '@/lib/firebase';
import { doc, getDoc } from "firebase/firestore";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Link from 'next/link';
import { useState } from "react";
import Image from "next/image";

export default function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const token = await user.getIdToken();
      localStorage.setItem('token', token);
      localStorage.setItem('userId', user.uid);

      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        localStorage.setItem('userRole', userData.role || 'user');
        localStorage.setItem('userName', userData.name || userData.displayName || user.displayName || 'User');
        localStorage.setItem('profilePicture', userData.profilePicture || userData.photoURL || user.photoURL || '/default-avatar.png');
        localStorage.setItem('userEmail', user.email);
      } else {
        localStorage.setItem('userRole', 'user');
        localStorage.setItem('userName', user.displayName || 'User');
        localStorage.setItem('profilePicture', user.photoURL || '/default-avatar.png');
        localStorage.setItem('userEmail', user.email);
      }

      toast.success("Login successful!");
      router.push("/products");
    } catch (error) {
      console.error("Login error:", error);
      let errorMessage = "Invalid email or password.";

      if (error.code === 'auth/user-not-found') {
        errorMessage = "No account found with this email.";
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = "Incorrect password.";
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = "Too many failed attempts. Please try again later.";
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
          Welcome Back
        </h2>
        <p className="mt-2 text-center text-sm text-gray-400 font-bold uppercase tracking-widest">
          Sign in to your Mobile Spare account
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-12 px-6 shadow-2xl rounded-[3rem] border border-gray-100 sm:px-12 mx-4 sm:mx-0">
          <form onSubmit={handleSubmit} className="space-y-8">
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
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-300" />
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="block w-full pl-12 pr-12 py-4 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-[#0066cc] font-bold"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#0066cc]"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between px-1">
              <div className="flex items-center">
                <input type="checkbox" className="h-4 w-4 text-[#0066cc] focus:ring-[#0066cc] border-gray-300 rounded" />
                <label className="ml-2 block text-xs font-bold text-gray-600 uppercase">Remember me</label>
              </div>
              <Link href="/forgot-password" size="sm" className="text-xs font-bold text-[#0066cc] hover:underline uppercase">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-5 px-4 border border-transparent rounded-2xl shadow-xl text-sm font-black text-white bg-[#0066cc] hover:bg-[#0052a3] focus:outline-none transition-all transform hover:scale-[1.02] active:scale-100 uppercase tracking-widest disabled:opacity-50"
            >
              {loading ? "AUTHENTICATING..." : "SIGN IN NOW"}
              {!loading && <ArrowRight className="ml-3 h-5 w-5" />}
            </button>
          </form>

          <div className="mt-10 pt-10 border-t border-gray-100 text-center">
            <p className="text-sm font-bold text-gray-400 uppercase tracking-tight">
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="text-[#0066cc] hover:underline">
                CREATE ONE FOR FREE
              </Link>
            </p>
          </div>
        </div>
      </div>
      <ToastContainer position="top-right" />
    </div>
  );
}
