"use client";

import Header from "@/components/Header";
import Hero from "@/components/Hero";
import BookingForm from "@/components/BookingForm";
import BookingModal from "@/components/BookingModal";
import Features from "@/components/Features";
import PopularRoutes from "@/components/PopularRoutes";
import Promotions from "@/components/Promotions";
import LogisticsSection from "@/components/LogisticsSection";
import AnimatedMap from "@/components/AnimatedMap";
import Footer from "@/components/Footer";
import { useState } from "react";

export default function Home() {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<{
    from: string;
    to: string;
    price: string;
    duration: string;
    departureTime: string;
    date: string;
  } | null>(null);

  const handleBookNow = (route: {
    from: string;
    to: string;
    price: string;
    duration: string;
    originalPrice?: string;
    rating: number;
    reviews: number;
    features: string[];
    departures: string[];
    image: string;
  }) => {
    setSelectedRoute({
      from: route.from,
      to: route.to,
      price: route.price,
      duration: route.duration,
      departureTime: route.departures[0] || "06:00",
      date: new Date().toISOString().split('T')[0]
    });
    setIsBookingModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section with Overlay Booking Form */}
      <section className="relative">
        <Hero />
        
        {/* Booking Form Overlay */}
        <div className="absolute right-20 top-1/2 -translate-y-1/2 z-40 hidden lg:block">
          <BookingForm />
        </div>
      </section>

      {/* Mobile Booking Form */}
      <section className="lg:hidden py-8 bg-white">
        <div className="container mx-auto px-4">
          <BookingForm />
        </div>
      </section>

      <Features />
      <AnimatedMap />
      <PopularRoutes onBookNow={handleBookNow} />
      <Promotions />
      <LogisticsSection />
      
      {/* Group Travel CTA */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-amber-50 to-white rounded-2xl p-8 md:p-12 shadow-lg">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                  Need Group Travel?
                </h3>
                <p className="text-gray-600 text-lg">
                  We handle group bookings for corporate, school trips and events — 
                  tailored routes and flexible payments.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="rounded-lg bg-[#5d4a15] hover:bg-[#6b5618] px-6 py-3 text-black font-semibold transition-colors cursor-pointer">
                  Contact Sales
                </button>
                <button className="rounded-lg border border-gray-300 hover:bg-gray-50 px-6 py-3 font-semibold transition-colors cursor-pointer">
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        routeData={selectedRoute || undefined}
      />
    </div>
  );
}