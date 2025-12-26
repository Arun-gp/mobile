"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  ShoppingBag,
  Boxes,
  ListPlus,
  Users,
  Settings,
  LogOut,
  ChevronRight,
  ChevronDown,
  LayoutDashboard,
  PlusCircle
} from 'lucide-react'
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const mainNavItems = [
  { name: "Dashboard", href: "/admin/total", icon: LayoutDashboard },
  { name: "All Products", href: "/admin/allProducts", icon: Boxes },
  { name: "Add Product", href: "/admin/products", icon: PlusCircle },
  {
    name: "Orders",
    icon: ShoppingBag,
    subItems: [
      { name: "All Orders", href: "/admin/allorder" },
      { name: "Order By Date", href: "/admin/OrderByDate" },
    ],
  },
];

const secondaryNavItems = [
  { name: "Customers", href: "/admin/user", icon: Users },
]

export default function Sidebar({ isOpen, setIsOpen }) {
  const pathname = usePathname();

  return (
    <div className={`flex flex-col bg-[#048567] text-white transition-all duration-500 shadow-2xl z-40 ${isOpen ? 'w-72' : 'w-24'} min-h-screen sticky top-0`}>
      {/* Sidebar Header */}
      <div className="p-6 flex justify-between items-center border-b border-white/10">
        <h1 className={`text-xl font-black tracking-tighter italic ${isOpen ? 'block' : 'hidden'}`}>
          KRISH ADMIN
        </h1>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 hover:bg-white/10 rounded-xl transition-colors"
        >
          <ChevronRight className={`h-5 w-5 transition-transform duration-500 ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-6 px-4">
        <ul className="space-y-2">
          {mainNavItems.map((item) => (
            <li key={item.name}>
              {item.subItems ? (
                <Collapsible>
                  <CollapsibleTrigger className="flex items-center w-full px-4 py-3 text-sm font-bold uppercase tracking-wider hover:bg-white/10 rounded-xl transition-all group">
                    <item.icon className="mr-4 h-5 w-5 opacity-80 group-hover:opacity-100" />
                    {isOpen && (
                      <>
                        <span className="flex-1 text-left">{item.name}</span>
                        <ChevronDown className="h-4 w-4 opacity-50 transition-transform ui-open:rotate-180" />
                      </>
                    )}
                  </CollapsibleTrigger>
                  <CollapsibleContent className="animate-in slide-in-from-top-2 duration-300">
                    <ul className={`${isOpen ? 'ml-12' : 'ml-0'} mt-2 space-y-1`}>
                      {item.subItems.map((subItem) => (
                        <li key={subItem.name}>
                          <Link
                            href={subItem.href}
                            className={`flex items-center px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-lg transition-all ${pathname === subItem.href
                                ? "bg-white text-[#048567] shadow-lg"
                                : "text-white/70 hover:text-white hover:bg-white/5"
                              }`}
                          >
                            {isOpen ? subItem.name : subItem.name.charAt(0)}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </CollapsibleContent>
                </Collapsible>
              ) : (
                <Link
                  href={item.href}
                  className={`flex items-center px-4 py-3 text-sm font-bold uppercase tracking-wider rounded-xl transition-all group ${pathname === item.href
                      ? "bg-white text-[#048567] shadow-xl"
                      : "text-white/80 hover:text-white hover:bg-white/10"
                    }`}
                >
                  <item.icon className="mr-4 h-5 w-5" />
                  {isOpen && <span>{item.name}</span>}
                </Link>
              )}
            </li>
          ))}
        </ul>

        {/* Secondary Nav */}
        <div className="mt-8 pt-8 border-t border-white/10">
          <ul className="space-y-2">
            {secondaryNavItems.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center px-4 py-3 text-sm font-bold uppercase tracking-wider rounded-xl transition-all group ${pathname === item.href
                      ? "bg-white text-[#048567]"
                      : "text-white/80 hover:text-white hover:bg-white/10"
                    }`}
                >
                  <item.icon className="mr-4 h-5 w-5" />
                  {isOpen && <span>{item.name}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* User Footer */}
      <div className="p-6 border-t border-white/10 bg-black/10">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 border-2 border-white/20">
            <AvatarImage src="/placeholder-user.jpg" />
            <AvatarFallback className="bg-white/10 text-white font-bold">KC</AvatarFallback>
          </Avatar>
          {isOpen && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-black truncate uppercase tracking-tighter">Admin</p>
              <p className="text-[10px] text-white/60 font-bold truncate">@KRISHCOLLECTIONS</p>
            </div>
          )}
          {isOpen && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-1 hover:bg-white/10 rounded-lg transition-colors">
                  <Settings className="h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 rounded-xl p-2 border-0 shadow-2xl">
                <DropdownMenuItem className="rounded-lg font-bold text-xs uppercase tracking-widest cursor-pointer p-3">
                  <LogOut className="mr-3 h-4 w-4 text-red-500" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </div>
  )
}
