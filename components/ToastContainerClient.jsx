"use client";

import dynamic from "next/dynamic";
import React from "react";

// load CSS only on client
import 'react-toastify/dist/ReactToastify.css';

const ToastContainer = dynamic(() => import('react-toastify').then(mod => mod.ToastContainer), { ssr: false });

export default function ToastContainerClient(props) {
  return <ToastContainer {...props} />;
}
