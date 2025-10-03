"use client";

import { motion } from "framer-motion";
import { Clock, MapPin, ArrowRight, Star, Users, Wifi, Coffee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const routes = [
  {
    from: "Lagos",
    to: "Abuja",
    duration: "8h 30m",
    price: "₦15,000",
    originalPrice: "₦18,000",
    rating: 4.8,
    reviews: 1240,
    features: ["Wi-Fi", "Refreshments", "Comfortable Seats"],
    departures: ["06:00", "12:00", "18:00"],
    image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=400&q=60",
  },
  {
    from: "Lagos",
    to: "Port Harcourt",
    duration: "6h 0m",
    price: "₦12,500",
    originalPrice: "₦15,000",
    rating: 4.6,
    reviews: 980,
    features: ["Wi-Fi", "USB Charging"],
    departures: ["07:00", "13:00", "19:00"],
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=400&q=60",
  },
  {
    from: "Abuja",
    to: "Kaduna",
    duration: "2h 15m",
    price: "₦4,500",
    originalPrice: "₦5,500",
    rating: 4.9,
    reviews: 2100,
    features: ["Wi-Fi", "Refreshments", "Priority Boarding"],
    departures: ["06:30", "09:00", "12:30", "15:00", "18:30"],
    image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?auto=format&fit=crop&w=400&q=60",
  },
  {
    from: "Kano",
    to: "Lagos",
    duration: "12h 0m",
    price: "₦25,000",
    originalPrice: "₦30,000",
    rating: 4.7,
    reviews: 850,
    features: ["Wi-Fi", "Meals", "Entertainment", "Sleeper Seats"],
    departures: ["17:00", "20:00"],
    image: "https://images.unsplash.com/photo-1570125909236-eb263c188f7e?auto=format&fit=crop&w=400&q=60",
  },
  {
    from: "Ibadan",
    to: "Abuja",
    duration: "7h 45m",
    price: "₦14,000",
    originalPrice: "₦16,500",
    rating: 4.5,
    reviews: 650,
    features: ["Wi-Fi", "Refreshments"],
    departures: ["08:00", "14:00"],
    image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=400&q=60",
  },
  {
    from: "Enugu",
    to: "Lagos",
    duration: "9h 30m",
    price: "₦18,000",
    originalPrice: "₦22,000",
    rating: 4.6,
    reviews: 720,
    features: ["Wi-Fi", "Refreshments", "Comfortable Seats"],
    departures: ["06:30", "13:30"],
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=400&q=60",
  },
];

interface Route {
  from: string;
  to: string;
  price: string;
  duration: string;
  departures: Array<{ time: string; type: string; available: boolean }>;
}

interface PopularRoutesProps {
  onBookNow?: (route: Route) => void;
}

export default function PopularRoutes({ onBookNow }: PopularRoutesProps) {
  return (
    <section 
      id="routes" 
      className="py-16 relative bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('/sienna2.jpg')",
      }}
    >
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-black/50"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Popular Routes
          </h2>
          <p className="text-lg text-white/90 max-w-2xl mx-auto">
            Discover our most traveled routes with competitive prices and excellent service ratings.
          </p>
        </motion.div>

        {/* Routes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {routes.map((route, index) => (
            <motion.div
              key={`${route.from}-${route.to}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              <Card className="h-full hover:shadow-xl transition-all duration-300 border-0 shadow-lg overflow-hidden">
                {/* Route Image */}
                <div className="relative h-32 bg-gradient-to-r from-amber-400 to-amber-600">
                  <img
                    src={route.image}
                    alt={`${route.from} to ${route.to}`}
                    className="w-full h-full object-cover opacity-20"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white">
                      <div className="flex items-center gap-2 text-lg font-semibold">
                        <MapPin className="h-4 w-4" />
                        <span>{route.from}</span>
                        <ArrowRight className="h-4 w-4" />
                        <span>{route.to}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <CardContent className="p-6">
                  {/* Route Info */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">{route.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{route.rating}</span>
                      <span className="text-xs text-gray-500">({route.reviews})</span>
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-2xl font-bold text-gray-900">{route.price}</div>
                      {route.originalPrice && (
                        <div className="text-sm text-gray-500 line-through">{route.originalPrice}</div>
                      )}
                    </div>
                    <Badge variant="destructive" className="bg-green-500 hover:bg-green-600">
                      Save {route.originalPrice ? `₦${parseInt(route.originalPrice.replace(/[₦,]/g, '')) - parseInt(route.price.replace(/[₦,]/g, ''))}` : '20%'}
                    </Badge>
                  </div>

                  {/* Features */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {route.features.map((feature, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>

                  {/* Departure Times */}
                  <div className="mb-4">
                    <p className="text-xs text-gray-500 mb-2">Available Departures:</p>
                    <div className="flex flex-wrap gap-1">
                      {route.departures.slice(0, 3).map((time, idx) => (
                        <span key={idx} className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {time}
                        </span>
                      ))}
                      {route.departures.length > 3 && (
                        <span className="text-xs text-gray-500">
                          +{route.departures.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button 
                      className="flex-1 bg-amber-600 hover:bg-amber-700 text-white"
                      onClick={() => onBookNow?.(route)}
                    >
                      Book Now
                    </Button>
                    <Button variant="outline" size="sm">
                      Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* View All Routes CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-[#5d4a15]">
            View All Routes
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
