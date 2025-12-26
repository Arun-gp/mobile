"use client";

import React, { useState, useEffect } from "react";
import SidebarWrapper from "@/components/SidebarWrapper";
import {
  Search,
  Users,
  ShieldCheck,
  UserCircle,
  Mail,
  UserPlus,
  UserMinus,
  TrendingUp
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchUsersData = async () => {
    try {
      const response = await fetch('/api/admin/users');
      if (!response.ok) throw new Error("Failed to fetch users");
      const data = await response.json();
      const usersArray = Array.isArray(data) ? data : [];
      setUsers(usersArray);
      setFilteredUsers(usersArray);
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]);
      setFilteredUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsersData();
  }, []);

  const handleRoleChange = async (userId, currentRole) => {
    if (!confirm(`Are you sure you want to change this user's role to ${currentRole === 'admin' ? 'user' : 'admin'}?`)) return;

    try {
      setLoading(true);
      const newRole = currentRole === 'admin' ? 'user' : 'admin';

      const response = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, role: newRole }),
      });

      const result = await response.json();

      if (result.success) {
        await fetchUsersData();
        toast.success(`User updated to ${newRole}`);
      } else {
        toast.error(result.message || "Failed to update user role");
      }
    } catch (error) {
      console.error("Error updating role:", error);
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    const filtered = users.filter(user =>
      user.name?.toLowerCase().includes(term.toLowerCase()) ||
      user.email?.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  if (loading && users.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-[#048567]"></div>
      </div>
    );
  }

  return (
    <SidebarWrapper>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase italic">
              User Directory
            </h1>
            <p className="text-gray-500 font-bold uppercase text-xs tracking-widest mt-2 flex items-center gap-2">
              <span className="w-8 h-[2px] bg-[#048567]"></span>
              Manage Access and Customer Profiles
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-xl shadow-gray-200/50 border border-gray-100 flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#048567]/10 flex items-center justify-center text-[#048567]">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Total Users</p>
                <p className="text-xl font-black text-gray-900 leading-none">{users.length}</p>
              </div>
            </div>
            <div className="h-10 w-px bg-gray-100"></div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Admins</p>
                <p className="text-xl font-black text-gray-900 leading-none">{users.filter(u => u.role === 'admin').length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-8 relative max-w-2xl">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
          <Input
            placeholder="Find a customer by name or email..."
            value={searchTerm}
            onChange={handleSearch}
            className="pl-16 py-7 bg-white shadow-xl shadow-gray-200/50 border-0 rounded-full font-bold text-sm focus:ring-2 focus:ring-[#048567]"
          />
        </div>

        {/* Users Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((user) => (
            <div key={user._id} className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-gray-200/50 border border-transparent hover:border-[#048567]/20 transition-all group overflow-hidden relative">
              {/* Background Graphic */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-gray-50 rounded-full group-hover:scale-150 transition-transform duration-700 opacity-50"></div>

              <div className="relative z-10">
                <div className="flex items-start justify-between mb-6">
                  <div className="w-16 h-16 rounded-3xl bg-gray-100 flex items-center justify-center text-gray-400 overflow-hidden border-2 border-white shadow-md">
                    {user.image ? (
                      <img src={user.image} className="w-full h-full object-cover" />
                    ) : (
                      <UserCircle className="w-10 h-10" />
                    )}
                  </div>
                  <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm ${user.role === 'admin'
                      ? 'bg-[#048567] text-white'
                      : 'bg-white text-gray-500 border border-gray-100'
                    }`}>
                    {user.role}
                  </span>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter truncate">{user.name || 'Anonymous'}</h3>
                    <div className="flex items-center gap-2 text-gray-400 mt-1">
                      <Mail className="w-3 h-3" />
                      <p className="text-xs font-bold truncate">{user.email}</p>
                    </div>
                  </div>

                  <div className="pt-6 flex gap-3">
                    {user.role !== "admin" ? (
                      <Button
                        onClick={() => handleRoleChange(user._id, user.role)}
                        className="flex-1 bg-gray-50 hover:bg-[#048567] text-gray-600 hover:text-white rounded-2xl py-6 font-black uppercase text-[10px] tracking-widest transition-all border border-gray-100 hover:border-transparent flex items-center justify-center gap-2"
                      >
                        <UserPlus className="w-4 h-4" />
                        Make Admin
                      </Button>
                    ) : (
                      <Button
                        onClick={() => handleRoleChange(user._id, user.role)}
                        className="flex-1 bg-gray-50 hover:bg-red-500 text-gray-600 hover:text-white rounded-2xl py-6 font-black uppercase text-[10px] tracking-widest transition-all border border-gray-100 hover:border-transparent flex items-center justify-center gap-2"
                      >
                        <UserMinus className="w-4 h-4" />
                        Revoke Admin
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {filteredUsers.length === 0 && (
            <div className="col-span-full py-20 text-center bg-white rounded-[3rem] shadow-xl border border-gray-50">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-200">
                <Users className="w-10 h-10" />
              </div>
              <p className="text-gray-400 font-black uppercase text-xs tracking-widest">No customers matching your search</p>
            </div>
          )}
        </div>
      </div>
    </SidebarWrapper>
  );
}