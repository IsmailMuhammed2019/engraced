"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

const sliderImages = [
  {
    id: 1,
    title: "Travel & Logistics Excellence",
    subtitle: "Modern vehicles, experienced drivers — travel and ship with confidence.",
    image: "https://images.unsplash.com/photo-1504215680853-026ed2a45def?auto=format&fit=crop&w=1600&q=60",
  },
  {
    id: 2,
    title: "Explore New Destinations",
    subtitle: "Daily departures between major cities with flexible fares and cargo services.",
    image: "/Worlds.jpeg",
  },
  {
    id: 3,
    title: "Book Quickly, Travel & Ship Easily",
    subtitle: "Fast checkout, instant confirmations, and digital tickets for all services.",
    image: "/cars.jpg",
  },
  {
    id: 4,
    title: "Premium Travel & Logistics",
    subtitle: "Luxury seating, secure cargo handling, and exceptional service.",
    image: "/carslon.jpg",
  },
];

export default function Hero() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  // Auto slide functionality
  useEffect(() => {
    if (!isPlaying) return;
    
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % sliderImages.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [isPlaying]);

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % sliderImages.length);
  };

  const prevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + sliderImages.length) % sliderImages.length);
  };

  const goToSlide = (index: number) => {
    setActiveIndex(index);
  };

  return (
    <section className="relative h-screen max-h-[900px] overflow-hidden">
      {/* Slider */}
      <div className="relative w-full h-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "-100%" }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-0"
            style={{
              backgroundImage: `url('${sliderImages[activeIndex].image}')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/50"></div>
            
            {/* Content */}
            <div className="relative z-10 flex h-full items-center">
              <div className="container mx-auto px-4">
                <div className="max-w-2xl">
                  <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                    className="text-4xl md:text-6xl font-bold text-white leading-tight mb-6"
                  >
                    {sliderImages[activeIndex].title}
                  </motion.h1>
                  
                  <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                    className="text-lg md:text-xl text-white/90 mb-8 max-w-lg"
                  >
                    {sliderImages[activeIndex].subtitle}
                  </motion.p>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                    className="flex flex-col sm:flex-row gap-4"
                  >
                    <Button
                      size="lg"
                      className="px-8 py-3 text-lg"
                      onClick={() => {
                        // Scroll to booking form or open booking modal
                        const bookingForm = document.querySelector('#booking-form');
                        if (bookingForm) {
                          bookingForm.scrollIntoView({ behavior: 'smooth' });
                        }
                      }}
                    >
                      Book Now
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      className="border-white text-black hover:bg-white hover:text-[#5d4a15] px-8 py-3 text-lg"
                      onClick={() => {
                        // Navigate to routes page
                        window.location.href = '/routes';
                      }}
                    >
                      View Routes
                    </Button>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Controls */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-black/30 hover:bg-black/50 text-white rounded-full transition-all duration-300 backdrop-blur-sm"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-black/30 hover:bg-black/50 text-white rounded-full transition-all duration-300 backdrop-blur-sm"
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6" />
      </button>


      {/* Dots Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
        {sliderImages.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === activeIndex
                ? "bg-white scale-125"
                : "bg-white/50 hover:bg-white/75"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-black/20">
        <motion.div
          className="h-full bg-[#5d4a15]"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 5, ease: "linear" }}
          key={activeIndex}
        />
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 right-6 z-20 animate-bounce">
        <div className="flex flex-col items-center text-white/70">
          <span className="text-xs mb-2">Scroll</span>
          <div className="w-px h-8 bg-white/50"></div>
        </div>
      </div>
    </section>
  );
}
