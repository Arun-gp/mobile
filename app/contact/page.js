'use client';
import { useState } from "react";
import { sendEmail } from "../action/ContactAction";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Mail, MapPin, Phone, Send, Clock, MessageCircle, User, MessageSquare, ArrowRight, Smartphone } from 'lucide-react';

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.target);

    try {
      const result = await sendEmail(formData);
      if (result.success) {
        toast.success(result.message);
        e.target.reset();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 lg:py-24">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header Section */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-3 bg-[#0066cc]/5 text-[#0066cc] px-6 py-2.5 rounded-full text-xs font-black tracking-[0.2em] mb-8 uppercase border border-[#0066cc]/10">
            <Smartphone className="w-4 h-4" />
            Get In Touch
          </div>
          <h1 className="text-5xl lg:text-7xl font-black text-gray-900 mb-8 uppercase tracking-tighter italic">
            Let&apos;s <span className="text-[#0066cc]">Connect</span>
          </h1>

          <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed font-medium">
            Have questions about our spare parts? Need bulk pricing?
            Our team is here to assist you with all your mobile repair needs.
          </p>

        </div>

        <div className="grid lg:grid-cols-12 gap-12">
          {/* Contact Information - Left Side */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-white rounded-[2.5rem] p-10 shadow-xl border border-gray-100 h-full">
              <h3 className="text-2xl font-black text-gray-900 mb-12 uppercase tracking-tight flex items-center gap-4">
                <div className="w-1.5 h-8 bg-[#0066cc] rounded-full"></div>
                Information
              </h3>

              <div className="space-y-10">
                <div className="flex items-start gap-6 group">
                  <div className="flex-shrink-0 w-14 h-14 bg-[#0066cc]/5 rounded-2xl flex items-center justify-center group-hover:bg-[#0066cc] transition-all duration-500">
                    <MapPin className="text-[#0066cc] group-hover:text-white w-6 h-6 transition-colors" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5">Our Office</h4>
                    <p className="text-gray-900 font-bold leading-relaxed">Erode, Tamil Nadu, India</p>
                  </div>
                </div>

                <div className="flex items-start gap-6 group">
                  <div className="flex-shrink-0 w-14 h-14 bg-[#0066cc]/5 rounded-2xl flex items-center justify-center group-hover:bg-[#0066cc] transition-all duration-500">
                    <Mail className="text-[#0066cc] group-hover:text-white w-6 h-6 transition-colors" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5">Email Support</h4>
                    <a href="mailto:support@mobilespare.com" className="text-gray-900 font-bold hover:text-[#0066cc] transition-colors break-all">
                      support@mobilespare.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-6 group">
                  <div className="flex-shrink-0 w-14 h-14 bg-[#0066cc]/5 rounded-2xl flex items-center justify-center group-hover:bg-[#0066cc] transition-all duration-500">
                    <Phone className="text-[#0066cc] group-hover:text-white w-6 h-6 transition-colors" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1.5">Call Direct</h4>
                    <a href="tel:+918610201488" className="text-gray-900 font-bold hover:text-[#0066cc] transition-colors">
                      +91 86102 01488
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-6 bg-[#1a1a1a] p-8 rounded-[2rem] text-white">
                  <div className="flex-shrink-0 w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                    <Clock className="text-[#0066cc] w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Business Hours</h4>
                    <p className="text-sm font-medium text-gray-300 leading-relaxed uppercase tracking-tight">
                      Mon - Sat: 9am - 7pm<br />
                      Sunday: Closed
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form - Right Side */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-[3rem] p-10 lg:p-16 shadow-2xl border border-gray-100">
              <div className="flex items-center gap-6 mb-12">
                <div className="w-16 h-16 bg-[#0066cc] rounded-3xl flex items-center justify-center shadow-lg shadow-[#0066cc]/20">
                  <Send className="text-white w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">Send an Inquiry</h2>
                  <p className="text-gray-400 font-medium mt-1">Our team will respond within 24 hours.</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-10">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 w-5 h-5" />
                      <input
                        type="text"
                        name="name"
                        required
                        className="w-full pl-14 pr-6 py-5 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-[#0066cc] transition-all font-bold placeholder-gray-300"
                        placeholder="Your Name"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 w-5 h-5" />
                      <input
                        type="email"
                        name="email"
                        required
                        className="w-full pl-14 pr-6 py-5 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-[#0066cc] transition-all font-bold placeholder-gray-300"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    className="w-full px-8 py-5 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-[#0066cc] transition-all font-bold placeholder-gray-300"
                    placeholder="Bulk Order Inquiry / Part Availability / etc."
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">
                    Your Message
                  </label>
                  <textarea
                    name="message"
                    required
                    rows={6}
                    className="w-full px-8 py-6 bg-gray-50 border-0 rounded-3xl focus:ring-2 focus:ring-[#0066cc] transition-all font-bold placeholder-gray-300 resize-none leading-relaxed"
                    placeholder="Tell us about the parts you need, phone models, quantities, etc."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#0066cc] hover:bg-[#0052a3] text-white py-6 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-4 shadow-xl shadow-[#0066cc]/20 transition-all hover:scale-[1.01] active:scale-100 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    "SENDING INQUIRY..."
                  ) : (
                    <>
                      SEND MESSAGE
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={5000} />
    </div>
  );
}