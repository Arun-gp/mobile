import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Smartphone, ShieldCheck, Truck, Users, ArrowRight, Star, Wrench, Cpu } from 'lucide-react';

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-[#0066cc] text-white py-24 lg:py-32 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-black/10 -skew-x-12 transform translate-x-1/4"></div>
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-xs font-black tracking-[0.2em] mb-8 uppercase">
              Established 2020
            </div>
            <h1 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter uppercase italic">
              Your Trusted <span className="text-white/40">Parts</span>,<br />
              Partner in <span className="text-white/40">Repairs</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/80 leading-relaxed font-medium">
              Providing genuine mobile spare parts for technicians and repair shops
              across India with quality assurance and fast delivery.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24 lg:py-32 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="relative group">
              <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl bg-gradient-to-br from-[#0066cc] to-[#003d7a] flex items-center justify-center">
                <Smartphone className="w-48 h-48 text-white/20" />
              </div>
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-[#0066cc]/10 rounded-full blur-3xl group-hover:bg-[#0066cc]/20 transition-all"></div>
            </div>

            <div className="space-y-12">
              <div>
                <span className="text-[#0066cc] font-black tracking-[0.3em] uppercase text-xs mb-4 block">
                  Our Philosophy
                </span>
                <h2 className="text-4xl lg:text-5xl font-black text-gray-900 leading-tight uppercase tracking-tighter">
                  Quality Parts,<br />
                  <span className="text-gray-300">Reliable Service</span>
                </h2>
              </div>

              <div className="space-y-10">
                <div className="flex gap-6">
                  <div className="flex-shrink-0 w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100 group-hover:border-[#0066cc]/30 transition-all">
                    <Wrench className="w-6 h-6 text-[#0066cc]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-gray-900 mb-3 uppercase tracking-tight">Our Mission</h3>
                    <p className="text-gray-500 leading-relaxed font-medium">
                      To empower mobile repair technicians and shops with genuine, high-quality
                      spare parts at competitive prices. We believe every device deserves
                      authentic components for optimal performance.
                    </p>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="flex-shrink-0 w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100">
                    <Star className="w-6 h-6 text-[#0066cc]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-gray-900 mb-3 uppercase tracking-tight">Our Vision</h3>
                    <p className="text-gray-500 leading-relaxed font-medium">
                      To become India&apos;s most trusted mobile spare parts supplier,
                      setting new standards for quality, authenticity, and customer service
                      in the mobile repair industry.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-gray-50 rounded-[4rem] mx-4">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <span className="text-[#0066cc] font-black tracking-[0.3em] uppercase text-xs">
              Our Principles
            </span>
            <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mt-4 uppercase tracking-tighter">
              Values That Define Us
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                title: "Genuine Parts",
                desc: "100% authentic components sourced directly from trusted manufacturers with quality certification.",
                icon: ShieldCheck
              },
              {
                title: "Fast Delivery",
                desc: "Same-day dispatch and quick delivery across India. We understand time is money in repairs.",
                icon: Truck
              },
              {
                title: "Expert Support",
                desc: "Technical guidance and compatibility checks by our experienced team of mobile experts.",
                icon: Users
              }
            ].map((value, index) => (
              <div
                key={index}
                className="group bg-white rounded-[2.5rem] p-10 shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100"
              >
                <div className="w-16 h-16 bg-[#0066cc]/5 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-[#0066cc] group-hover:scale-110 transition-all duration-500">
                  <value.icon className="w-8 h-8 text-[#0066cc] group-hover:text-white" />
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-4 uppercase tracking-tight">{value.title}</h3>
                <p className="text-gray-500 leading-relaxed font-medium">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 max-w-5xl mx-auto">
            {[
              { val: "10K+", label: "Happy Customers" },
              { val: "500+", label: "Products Available" },
              { val: "5+", label: "Years Experience" },
              { val: "50K+", label: "Orders Delivered" }
            ].map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="text-5xl lg:text-6xl font-black text-[#0066cc] mb-4 group-hover:scale-110 transition-transform duration-500 tracking-tighter">
                  {stat.val}
                </div>
                <div className="text-gray-400 font-black uppercase text-xs tracking-widest">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#1a1a1a] text-white py-24 rounded-[4rem] mx-4 mb-12 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10 text-center max-w-3xl">
          <h2 className="text-4xl lg:text-6xl font-black mb-8 uppercase tracking-tighter italic">
            Start Ordering Today
          </h2>
          <p className="text-xl text-gray-500 mb-12 leading-relaxed">
            Join thousands of repair technicians and shops who trust Mobile Spare
            for quality parts, competitive prices, and reliable delivery.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              href="/products"
              className="bg-[#0066cc] text-white px-10 py-5 rounded-full font-black uppercase tracking-widest hover:bg-[#0052a3] transition-all flex items-center justify-center gap-3 group"
            >
              BROWSE PARTS
              <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </Link>
            <Link
              href="/contact"
              className="border-2 border-white/10 text-white px-10 py-5 rounded-full font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all"
            >
              CONTACT US
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;