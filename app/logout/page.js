"use client"
import React from 'react'

import { useRouter } from 'next/navigation';
import { UserLogout } from '../action/loginAction';

export default function Page() {
  const router = useRouter();
  const logout =async()=>{
    const result = await UserLogout();
    if (result.success) {
      router.push("/login")
    } 
  }
  
  return (
  <>
    
    <form action={logout}>
    <button >
    LOGOUT
  </button></form></>
    
  );
  
}
