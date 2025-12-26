"use client";

import { useState } from "react";
import Sidebar from "@/components/SideBar";

export default function SidebarWrapper({ children }) {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <div className="flex min-h-screen bg-gray-50/50">
            <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
            <main className="flex-1 p-8 md:p-12 transition-all duration-500">
                {children}
            </main>
        </div>
    );
}
