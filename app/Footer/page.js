"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  Instagram,
  Facebook,
  Twitter,
  Youtube,
  ShieldCheck,
  Truck,
  CreditCard,
  Clock,
  ChevronUp,
  Smartphone
} from "lucide-react";
import Image from "next/image";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail("");
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  const menuItems = [
    { path: "products", display: "All Parts" },
    { path: "contact", display: "Contact Us" },
    { path: "aboutus", display: "About Us" },
    { path: "YourOrder", display: "Track Order" }
  ];

  const legalItems = [
    { path: "privacyPolicy", display: "Privacy Policy" },
    { path: "termsandcondition", display: "Terms & Conditions" },
    { path: "shippingpolicy", display: "Shipping Policy" },
    { path: "returnpolicy", display: "Return & Refund Policy" }
  ];

  const features = [
    { icon: Truck, title: "Fast Shipping", desc: "Same-day dispatch" },
    { icon: ShieldCheck, title: "Genuine Parts", desc: "Quality assured" },
    { icon: Clock, title: "Quick Delivery", desc: "2-4 Business Days" },
    { icon: CreditCard, title: "Easy Returns", desc: "7 Day Replacement" }
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#0066cc] text-white pt-16 pb-8">
      {/* Features Bar */}
      <div className="container mx-auto px-4 pb-16 border-b border-white/5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center gap-4 group">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white transition-colors duration-500">
                <feature.icon className="w-6 h-6 text-white group-hover:text-[#0066cc]" />
              </div>
              <div>
                <h4 className="font-bold text-sm tracking-wide text-white">{feature.title}</h4>
                <p className="text-white/70 text-xs mt-1">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand & About */}
          <div className="space-y-6">
            <Link href="/" className="inline-flex items-center gap-2">
              <Smartphone className="w-8 h-8 text-white" />
              <span className="text-xl font-black tracking-tight">MOBILE SPARE</span>
            </Link>
            <p className="text-gray-300 text-sm leading-relaxed max-w-xs">
              Mobile Spare is your trusted destination for genuine mobile spare parts. We provide quality components for all major phone brands with fast delivery and expert support.
            </p>
            <div className="flex gap-4">
              {[
                { icon: Instagram, href: "#" },
                { icon: Facebook, href: "#" },
                { icon: Twitter, href: "#" },
                { icon: Youtube, href: "#" }
              ].map((social, i) => (
                <a key={i} href={social.href} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white hover:text-[#0066cc] transition-all">
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="text-lg font-bold tracking-tight">QUICK LINKS</h4>
            <ul className="space-y-4">
              {menuItems.map((item, idx) => (
                <li key={idx}>
                  <Link href={`/${item.path}`} className="text-gray-300 hover:text-white hover:translate-x-1 inline-block transition-all text-sm font-medium">
                    {item.display}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Care */}
          <div className="space-y-6">
            <h4 className="text-lg font-bold tracking-tight">INFORMATION</h4>
            <ul className="space-y-4">
              {legalItems.map((item, idx) => (
                <li key={idx}>
                  <Link href={`/${item.path}`} className="text-gray-300 hover:text-white hover:translate-x-1 inline-block transition-all text-sm font-medium">
                    {item.display}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h4 className="text-lg font-bold tracking-tight">CONTACT US</h4>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <MapPin className="w-5 h-5 text-white mt-0.5" />
                <p className="text-white/80 text-sm leading-snug">
                  Erode, Tamil Nadu,<br />
                  India
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Phone className="w-5 h-5 text-white" />
                <p className="text-white/80 text-sm">+91 86102 01488</p>
              </div>
              <div className="flex items-center gap-4">
                <Mail className="w-5 h-5 text-white" />
                <p className="text-white/80 text-sm">support@mobilespare.com</p>
              </div>
            </div>

            <form onSubmit={handleSubscribe} className="mt-8">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Your Email"
                  className="w-full bg-white/10 border border-white/20 rounded-full py-3 px-6 text-sm focus:outline-none focus:border-white transition-colors placeholder:text-white/50"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button type="submit" className="absolute right-1 top-1 bg-white text-[#0066cc] hover:bg-gray-100 rounded-full p-2.5 transition-colors shadow-lg">
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              {isSubscribed && (
                <p className="text-green-300 text-xs mt-2 ml-4 animate-pulse">Thanks for subscribing!</p>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="container mx-auto px-4 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-white/60 text-xs">
          © {new Date().getFullYear()} Mobile Spare. All Rights Reserved.
        </p>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 text-gray-300 text-xs font-bold uppercase tracking-wider">
            <span>💳 Visa</span>
            <span>💳 Mastercard</span>
            <span>📱 UPI</span>
          </div>
        </div>
        <button
          onClick={scrollToTop}
          className="w-10 h-10 rounded-full bg-white/5 hover:bg-[#0052a3] transition-colors flex items-center justify-center group"
          aria-label="Scroll to top"
        >
          <ChevronUp className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
        </button>
      </div>
    </footer>
  );
}