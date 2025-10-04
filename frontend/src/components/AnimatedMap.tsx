"use client";

import { motion } from "framer-motion";
import { MapPin, Truck, Package, Clock } from "lucide-react";
import { useState, useEffect } from "react";

const cities = [
  { name: "Lagos", x: 20, y: 70, isHub: true },
  { name: "Abuja", x: 50, y: 50, isHub: true },
  { name: "Port Harcourt", x: 30, y: 80, isHub: false },
  { name: "Kano", x: 60, y: 30, isHub: false },
  { name: "Ibadan", x: 15, y: 60, isHub: false },
  { name: "Enugu", x: 45, y: 75, isHub: false },
  { name: "Kaduna", x: 55, y: 40, isHub: false },
  { name: "Benin", x: 25, y: 65, isHub: false },
];

const routes = [
  { from: "Lagos", to: "Abuja", duration: "8h", type: "passenger" },
  { from: "Abuja", to: "Kano", duration: "6h", type: "cargo" },
  { from: "Lagos", to: "Port Harcourt", duration: "6h", type: "logistics" },
  { from: "Abuja", to: "Enugu", duration: "5h", type: "passenger" },
  { from: "Lagos", to: "Ibadan", duration: "2h", type: "logistics" },
  { from: "Benin", to: "Abuja", duration: "7h", type: "passenger" },
];

export default function AnimatedMap() {
  const [activeRoute, setActiveRoute] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setActiveRoute((prev) => (prev + 1) % routes.length);
      
      setTimeout(() => {
        setIsAnimating(false);
      }, 2000);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const getCityPosition = (cityName: string) => {
    const city = cities.find(c => c.name === cityName);
    return city ? { x: city.x, y: city.y } : { x: 0, y: 0 };
  };

  const getRouteColor = (type: string) => {
    switch (type) {
      case "passenger": return "#10B981"; // green
      case "cargo": return "#3B82F6"; // blue
      case "logistics": return "#8B5CF6"; // purple
      default: return "#6B7280"; // gray
    }
  };

  const getRouteIcon = (type: string) => {
    switch (type) {
      case "passenger": return "🚌";
      case "cargo": return "🚛";
      case "logistics": return "📦";
      default: return "🚗";
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Our Network Coverage
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Real-time tracking of our transportation network across Nigeria. 
            See how we connect cities with passenger travel and logistics services.
          </p>
        </motion.div>

        {/* Interactive Map */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 mb-16"
        >
          <div className="relative">
            {/* Map Container */}
            <div className="relative w-full h-96 bg-gradient-to-br from-green-50 to-blue-50 rounded-xl overflow-hidden">
              {/* Background Grid */}
              <div className="absolute inset-0 opacity-20">
                <svg width="100%" height="100%" className="w-full h-full">
                  <defs>
                    <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#94A3B8" strokeWidth="1"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
              </div>

              {/* Cities */}
              {cities.map((city, index) => (
                <motion.div
                  key={city.name}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${city.x}%`, top: `${city.y}%` }}
                >
                  <div className={`relative ${city.isHub ? 'z-20' : 'z-10'}`}>
                    <motion.div
                      animate={city.isHub ? { scale: [1, 1.2, 1] } : {}}
                      transition={{ duration: 2, repeat: Infinity }}
                      className={`w-4 h-4 rounded-full ${
                        city.isHub 
                          ? 'bg-[#5d4a15] shadow-lg shadow-[#5d4a15]/50' 
                          : 'bg-blue-500 shadow-md'
                      }`}
                    />
                    <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                      <span className="text-xs font-medium text-gray-700 bg-white px-2 py-1 rounded shadow-sm">
                        {city.name}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Animated Routes */}
              {routes.map((route, index) => {
                const fromPos = getCityPosition(route.from);
                const toPos = getCityPosition(route.to);
                const isActive = index === activeRoute;
                
                return (
                  <motion.div
                    key={`${route.from}-${route.to}-${index}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isActive ? 1 : 0.3 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0"
                  >
                    {/* Route Line */}
                    <svg className="w-full h-full absolute inset-0">
                      <motion.line
                        x1={`${fromPos.x}%`}
                        y1={`${fromPos.y}%`}
                        x2={`${toPos.x}%`}
                        y2={`${toPos.y}%`}
                        stroke={getRouteColor(route.type)}
                        strokeWidth={isActive ? "3" : "2"}
                        strokeDasharray={isActive ? "5,5" : "none"}
                        className="drop-shadow-sm"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: isActive ? 1 : 0.3 }}
                        transition={{ duration: 1, delay: 0.2 }}
                      />
                    </svg>

                    {/* Moving Vehicle */}
                    {isActive && (
                      <motion.div
                        className="absolute transform -translate-x-1/2 -translate-y-1/2"
                        animate={{
                          x: [`${fromPos.x}%`, `${toPos.x}%`],
                          y: [`${fromPos.y}%`, `${toPos.y}%`],
                        }}
                        transition={{
                          duration: 3,
                          ease: "easeInOut",
                          repeat: Infinity,
                          repeatDelay: 1,
                        }}
                      >
                        <div className="bg-white rounded-full p-2 shadow-lg border-2 border-[#5d4a15]">
                          <span className="text-lg">
                            {getRouteIcon(route.type)}
                          </span>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* Route Information */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              {routes.map((route, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                    index === activeRoute
                      ? 'border-[#5d4a15] bg-amber-50 shadow-md'
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{getRouteIcon(route.type)}</span>
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {route.from} → {route.to}
                      </h4>
                      <p className="text-sm text-gray-600 capitalize">
                        {route.type} Service
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock className="h-4 w-4" />
                    <span>{route.duration}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Network Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-4 gap-8"
        >
          {[
            { icon: MapPin, number: "50+", label: "Cities Connected" },
            { icon: Truck, number: "200+", label: "Active Routes" },
            { icon: Package, number: "24/7", label: "Logistics Support" },
            { icon: Clock, number: "99%", label: "On-Time Delivery" },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 bg-[#5d4a15] rounded-full mb-4">
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                {stat.number}
              </div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
