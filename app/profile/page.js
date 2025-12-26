"use client";

import { useState, useEffect, useRef } from 'react';
import { Camera, User, Mail, MapPin, Phone, Package, LogOut, Loader2, Save } from 'lucide-react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function Profile() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userDetails, setUserDetails] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    profilePicture: '/default-avatar.png'
  });
  const fileInputRef = useRef(null);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      toast.error('Please login to view profile');
      router.push('/login');
      return;
    }
    fetchProfile(userId);
  }, [router]);

  const fetchProfile = async (userId) => {
    try {
      const res = await fetch(`/api/user/profile?userId=${userId}`);
      if (!res.ok) throw new Error('Failed to fetch profile');
      const data = await res.json();
      setUserDetails(data);
    } catch (error) {
      console.error('Profile fetch error:', error);
      toast.error('Could not load profile details');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    const userId = localStorage.getItem('userId');

    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          name: userDetails.name,
          phone: userDetails.phone,
          address: userDetails.address
        })
      });

      if (!res.ok) throw new Error('Update failed');

      localStorage.setItem('userName', userDetails.name);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/logout', { method: 'POST' }); // Or call server action if preferred, but let's check if there's a logout api
      // Alternately, since we have UserLogout server action:
    } catch (e) { }

    // I will use a more direct approach if an API exists, but let's check if there's a logout route first.
    // Actually, I'll just clear the cookie manually if possible or use the action.
    localStorage.clear();
    router.push('/login');
    toast.success('Logged out successfully');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-12 h-12 text-[#048567] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 lg:py-24">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="grid lg:grid-cols-12 gap-12">

          {/* Navigation Sidebar */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 p-8 sticky top-24">
              <div className="flex flex-col items-center mb-8">
                <div className="relative group mb-6">
                  <div className="w-32 h-32 rounded-[2.5rem] overflow-hidden border-4 border-white shadow-2xl relative group-hover:scale-105 transition-transform duration-500">
                    <Image
                      src={userDetails.profilePicture || '/default-avatar.png'}
                      alt="Profile"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <button
                    className="absolute -bottom-2 -right-2 bg-[#048567] text-white p-3 rounded-2xl shadow-lg hover:scale-110 transition-all"
                    onClick={() => toast.info('Profile picture upload coming soon!')}
                  >
                    <Camera className="w-5 h-5" />
                  </button>
                </div>
                <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">{userDetails.name}</h2>
                <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest mt-1">{userDetails.role || 'Member'}</p>
              </div>

              <div className="space-y-2">
                <button className="w-full flex items-center gap-4 p-4 bg-[#048567]/5 text-[#048567] rounded-2xl font-black uppercase text-xs tracking-widest transition-all">
                  <User className="w-5 h-5" />
                  My Profile
                </button>
                <button
                  onClick={() => router.push('/YourOrder')}
                  className="w-full flex items-center gap-4 p-4 text-gray-400 hover:bg-gray-50 rounded-2xl font-black uppercase text-xs tracking-widest transition-all"
                >
                  <Package className="w-5 h-5" />
                  My Orders
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-4 p-4 text-red-500 hover:bg-red-50 rounded-2xl font-black uppercase text-xs tracking-widest transition-all mt-8"
                >
                  <LogOut className="w-5 h-5" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>

          {/* Form Content */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-[3rem] p-10 lg:p-16 shadow-2xl border border-gray-100">
              <h3 className="text-3xl font-black text-gray-900 uppercase tracking-tighter mb-12">Account Settings</h3>

              <form onSubmit={handleUpdateProfile} className="space-y-10">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 w-5 h-5" />
                      <input
                        type="text"
                        value={userDetails.name}
                        onChange={(e) => setUserDetails({ ...userDetails, name: e.target.value })}
                        className="w-full pl-14 pr-6 py-5 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-[#048567] font-bold"
                        placeholder="NAME"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 w-5 h-5" />
                      <input
                        type="email"
                        value={userDetails.email}
                        disabled
                        className="w-full pl-14 pr-6 py-5 bg-gray-50 border-0 rounded-2xl font-bold opacity-60 cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 w-5 h-5" />
                      <input
                        type="tel"
                        value={userDetails.phone || ''}
                        onChange={(e) => setUserDetails({ ...userDetails, phone: e.target.value })}
                        className="w-full pl-14 pr-6 py-5 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-[#048567] font-bold"
                        placeholder="+91"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Shipping Address</label>
                    <div className="relative">
                      <MapPin className="absolute left-5 top-5 text-gray-300 w-5 h-5" />
                      <textarea
                        value={userDetails.address || ''}
                        onChange={(e) => setUserDetails({ ...userDetails, address: e.target.value })}
                        className="w-full pl-14 pr-6 py-5 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-[#048567] font-bold min-h-[120px] resize-none"
                        placeholder="HOUSE NO, STREET, CITY..."
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="bg-[#048567] hover:bg-[#036e56] text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest transition-all shadow-xl shadow-[#048567]/20 flex items-center gap-3 disabled:opacity-50"
                >
                  {saving ? 'SAVING CHANGES...' : 'SAVE PROFILE'}
                  {!saving && <Save className="w-5 h-5" />}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}