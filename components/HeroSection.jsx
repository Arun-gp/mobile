"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { ArrowRight, Sparkles, ShoppingBag, Smartphone, Cpu, Battery, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";

// Hero Section Component
const HeroSection = () => {
    const router = useRouter();

    const carouselItems = [
        {
            desktopSrc: "https://res.cloudinary.com/dry3pzan6/image/upload/v1766837370/reaut0zpbe5xzdcyk8oj.jpg",
            mobileSrc: "https://res.cloudinary.com/dry3pzan6/image/upload/v1766837370/reaut0zpbe5xzdcyk8oj.jpg",
            alt: "Premium Mobile Parts",
            title: "Quality Parts, Reliable Repairs",
            subtitle: "PREMIUM SPARE PARTS",
            description: "Discover our extensive collection of genuine mobile spare parts for all major brands.",
            accent: "from-[#0066cc]/60 to-black/80",
        },
        {
            desktopSrc: "https://res.cloudinary.com/dry3pzan6/image/upload/v1766838377/tsqppnj1byhja2p275r1.jpg",
            mobileSrc: "https://res.cloudinary.com/dry3pzan6/image/upload/v1766838377/tsqppnj1byhja2p275r1.jpg",
            alt: "New Stock Arrivals",
            title: "Fresh Stock Arrived",
            subtitle: "NEW ARRIVALS",
            description: "Latest mobile spare parts with manufacturer warranty and quality assurance.",
            accent: "from-[#ff6600]/60 to-black/80",
        },
        {
            desktopSrc: "https://res.cloudinary.com/dry3pzan6/image/upload/v1766838873/uvbypxvxycl0uaxk0af9.jpg",
            mobileSrc: "https://res.cloudinary.com/dry3pzan6/image/upload/v1766838873/uvbypxvxycl0uaxk0af9.jpg",
            alt: "Screen Replacements",
            title: "Display Solutions",
            subtitle: "SCREENS & DISPLAYS",
            description: "Original quality LCD and AMOLED screens for iPhone, Samsung, Xiaomi & more.",
            accent: "from-[#0066cc]/60 to-black/80",
        },
        {
            desktopSrc: "https://res.cloudinary.com/dry3pzan6/image/upload/v1766839099/kmas8b8s21snss8gf2tk.jpg",
            mobileSrc: "https://res.cloudinary.com/dry3pzan6/image/upload/v1766839099/kmas8b8s21snss8gf2tk.jpg",
            alt: "Battery Replacements",
            title: "Power Up Your Device",
            subtitle: "BATTERIES & POWER",
            description: "High-capacity batteries with extended life and optimal performance.",
            accent: "from-[#1a1a1a]/80 to-black/90",
        },
    ];

    const [currentSlide, setCurrentSlide] = useState(0);
    const totalSlides = carouselItems.length;

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % totalSlides);
        }, 6000);
        return () => clearInterval(timer);
    }, [totalSlides]);

    const goToSlide = (index) => setCurrentSlide(index);
    const goToPrevSlide = () =>
        setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
    const goToNextSlide = () =>
        setCurrentSlide((prev) => (prev + 1) % totalSlides);

    return (
        <section className="relative overflow-hidden">
            {/* Main Carousel */}
            <div className="relative w-full h-[80vh] min-h-[600px] max-h-[900px]">
                {carouselItems.map((item, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 transition-all duration-1000 ease-out ${currentSlide === index
                            ? "opacity-100 z-10 scale-100"
                            : "opacity-0 z-0 scale-105"
                            }`}
                    >
                        {/* Background Image */}
                        <Image
                            src={item.desktopSrc}
                            alt={item.alt}
                            fill
                            className="object-cover"
                            priority={index === 0}
                        />

                        {/* Gradient Overlay */}
                        <div className={`absolute inset-0 bg-gradient-to-r ${item.accent} mix-blend-multiply`} />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                        {/* Content */}
                        <div className="absolute inset-0 flex items-center">
                            <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full">
                                <div className="max-w-2xl">
                                    {/* Subtitle Badge */}
                                    <div
                                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-medium mb-6 transform transition-all duration-700 delay-100 ${currentSlide === index ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                                            }`}
                                    >
                                        <Smartphone className="w-4 h-4" />
                                        {item.subtitle}
                                    </div>

                                    {/* Title */}
                                    <h1
                                        className={`text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6 transform transition-all duration-700 delay-200 ${currentSlide === index ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                                            }`}
                                    >
                                        {item.title}
                                    </h1>

                                    {/* Description */}
                                    <p
                                        className={`text-lg md:text-xl text-white/90 max-w-lg mb-8 transform transition-all duration-700 delay-300 ${currentSlide === index ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                                            }`}
                                    >
                                        {item.description}
                                    </p>

                                    {/* CTA Buttons */}
                                    <div
                                        className={`flex flex-col sm:flex-row gap-4 transform transition-all duration-700 delay-400 ${currentSlide === index ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                                            }`}
                                    >
                                        <Button
                                            onClick={() => router.push("/products")}
                                            size="lg"
                                            className="bg-[#0066cc] text-white hover:bg-[#0052a3] font-bold px-10 py-7 rounded-full shadow-2xl transition-all duration-500 transform hover:scale-105 group border-0"
                                        >
                                            <ShoppingBag className="w-5 h-5 mr-3" />
                                            SHOP NOW
                                            <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-2 transition-transform" />
                                        </Button>
                                        <Button
                                            onClick={() => router.push("/products")}
                                            variant="outline"
                                            size="lg"
                                            className="bg-[#0066cc] text-white hover:bg-[#0052a3] hover:text-[#ffffff] font-bold px-10 py-7 rounded-full backdrop-blur-md transition-all duration-500 transform hover:scale-105"
                                        >
                                            VIEW ALL PARTS
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Slide Indicators */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3">
                {carouselItems.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`relative h-3 rounded-full transition-all duration-500 overflow-hidden ${currentSlide === index ? "w-12 bg-white" : "w-3 bg-white/40 hover:bg-white/60"
                            }`}
                    >
                        {currentSlide === index && (
                            <span
                                className="absolute inset-0 bg-white/50 animate-pulse"
                                style={{ animationDuration: '6s' }}
                            />
                        )}
                    </button>
                ))}
            </div>

            {/* Navigation Arrows */}
            <button
                className="absolute top-1/2 left-6 z-30 -translate-y-1/2 w-14 h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300 hover:scale-110 focus:outline-none"
                onClick={goToPrevSlide}
            >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
            </button>

            <button
                className="absolute top-1/2 right-6 z-30 -translate-y-1/2 w-14 h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300 hover:scale-110 focus:outline-none"
                onClick={goToNextSlide}
            >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </button>

            {/* Slide Counter */}
            <div className="absolute bottom-8 right-8 z-30 text-white/80 text-sm font-medium">
                <span className="text-2xl font-bold text-white">{currentSlide + 1}</span>
                <span className="mx-1">/</span>
                <span>{totalSlides}</span>
            </div>
        </section>
    );
};

export default HeroSection;