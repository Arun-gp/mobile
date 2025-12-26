import HeroSection from "@/components/HeroSection";
import CategoryNavigation from "@/components/CategoryNavigation";
import { ShieldCheck, Truck, Wrench, ArrowRight, Smartphone } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default async function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section Carousel */}
      <HeroSection />

      {/* Category Navigation Section */}
      <CategoryNavigation />

      {/* Why Shop With Us Section */}
      <section className="py-24 px-4 bg-gray-50 rounded-[4rem] mx-4 my-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-[#0066cc]/5 text-[#0066cc] px-6 py-2 rounded-full text-[10px] font-black tracking-[0.2em] mb-8 uppercase">
            The Mobile Spare Advantage
          </div>

          <h2 className="text-4xl lg:text-6xl font-black text-gray-900 mb-6 uppercase tracking-tighter italic">
            Why Shop With Us?
          </h2>

          <p className="text-gray-400 text-xl max-w-2xl mx-auto mb-20 font-medium">
            We provide genuine mobile spare parts with quality assurance,
            fast delivery, and expert support for all your repair needs.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {[
              {
                icon: ShieldCheck,
                title: "Genuine Parts",
                desc:
                  "100% authentic spare parts with quality certification and manufacturer warranty.",
                color: "text-[#0066cc]",
                bg: "bg-[#0066cc]/5",
              },
              {
                icon: Truck,
                title: "Fast Shipping",
                desc:
                  "Quick processing and secure delivery across India. Same-day dispatch available.",
                color: "text-[#ff6600]",
                bg: "bg-[#ff6600]/5",
              },
              {
                icon: Wrench,
                title: "Expert Support",
                desc:
                  "Technical guidance and compatibility checks by our experienced team.",
                color: "text-[#0066cc]",
                bg: "bg-[#0066cc]/5",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="group bg-white rounded-[2.5rem] p-12 shadow-sm border border-gray-100 hover:shadow-2xl hover:scale-[1.02] transition-all duration-500"
              >
                <div
                  className={`w-20 h-20 ${feature.bg} rounded-3xl flex items-center justify-center mx-auto mb-10 group-hover:scale-110 transition-transform`}
                >
                  <feature.icon
                    className={`w-10 h-10 ${feature.color}`}
                  />
                </div>

                <h3 className="text-2xl font-black text-gray-900 mb-4 uppercase tracking-tight">
                  {feature.title}
                </h3>

                <p className="text-gray-500 font-medium leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Banner / CTA */}
      <section className="py-24 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto bg-[#1a1a1a] rounded-[3.5rem] p-12 lg:p-24 relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Decorative background light */}
          <div className="absolute top-0 left-0 w-full h-full bg-[#0066cc]/5 pointer-events-none"></div>

          <div className="relative z-10 max-w-xl text-center lg:text-left">
            <span className="text-[#0066cc] font-black tracking-[0.3em] uppercase text-xs mb-6 block">
              Bulk Orders Welcome
            </span>

            <h2 className="text-4xl lg:text-6xl font-black text-white leading-tight uppercase tracking-tighter mb-8 italic">
              Premium Parts <br />
              <span className="text-[#0066cc]">For Every Phone</span>
            </h2>

            <p className="text-gray-400 text-lg mb-10 font-medium leading-relaxed">
              From screens to batteries, charging ports to cameras.
              Find all spare parts for iPhone, Samsung, Xiaomi, OnePlus & more.
            </p>

            <Link
              href="/products"
              className="bg-[#0066cc] hover:bg-[#0052a3] text-white px-10 py-5 rounded-full font-black uppercase tracking-widest transition-all shadow-xl shadow-[#0066cc]/20 inline-flex items-center gap-3 group"
            >
              BROWSE PARTS
              <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>

          <div className="relative z-10 w-full lg:w-1/2 aspect-square max-w-md">
            <div className="absolute inset-0 border-2 border-[#0066cc]/20 rounded-full animate-pulse"></div>
            <div className="absolute inset-4 border-2 border-[#0066cc]/10 rounded-full"></div>
            <div className="absolute inset-8 bg-gradient-to-br from-[#0066cc] to-black rounded-full flex items-center justify-center shadow-2xl overflow-hidden">
              <Smartphone className="w-32 h-32 text-white/30" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
