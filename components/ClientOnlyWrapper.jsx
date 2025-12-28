"use client";

import dynamic from 'next/dynamic';
import React from 'react';

// Dynamically import the client layout with SSR disabled. This must run in a client component.
const DynamicClientLayout = dynamic(() => import('./ClientLayout'), { ssr: false });

export default function ClientOnlyWrapper({ children }) {
  return <DynamicClientLayout>{children}</DynamicClientLayout>;
}
