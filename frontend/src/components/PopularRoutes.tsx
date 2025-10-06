"use client";

import { motion } from "framer-motion";
import { Clock, MapPin, ArrowRight, Star, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import RouteDetailsModal from "./RouteDetailsModal";

interface Route {
  id: string;
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
  description?: string;
  distance?: string;
  amenities?: string[];
  isActive?: boolean;
}

interface PopularRoutesProps {
  onBookNow?: (route: Route) => void;
}

export default function PopularRoutes({ onBookNow }: PopularRoutesProps) {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3003/api/v1/routes');
      
      if (response.ok) {
        const data = await response.json();
        const formattedRoutes = data.map((route: {
          id: string;
          from: string;
          to: string;
          distance: number;
          duration: number;
          basePrice: number;
          description?: string;
          isActive: boolean;
          createdAt: string;
          trips?: Array<{
            departureTime: string;
            status: string;
          }>;
        }) => ({
          id: route.id,
          from: route.from,
          to: route.to,
          duration: `${Math.floor(route.duration / 60)}h ${route.duration % 60}m`,
          distance: `${route.distance} km`,
          price: `₦${route.basePrice.toLocaleString()}`,
          originalPrice: undefined,
          rating: 4.5 + Math.random() * 0.5,
          reviews: Math.floor(Math.random() * 2000) + 100,
          features: ["Wi-Fi", "Refreshments", "Comfortable Seats"],
          departures: route.trips?.map((trip: {
            departureTime: string;
            status: string;
          }) => new Date(trip.departureTime).toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false 
          })) || [
            "06:00", "12:00", "18:00"
          ],
          image: "/sienna.jpeg",
          description: route.description || `Experience a comfortable journey from ${route.from} to ${route.to} with our premium transport service.`,
          amenities: ["Air Conditioning", "Reclining Seats", "Free Wi-Fi", "Refreshments"],
          isActive: route.isActive
        }));
        setRoutes(formattedRoutes);
      } else {
        // Fallback to static data
        setRoutes(getStaticRoutes());
      }
    } catch (error) {
      console.error('Error fetching routes:', error);
      setError('Failed to load routes');
      setRoutes(getStaticRoutes());
    } finally {
      setLoading(false);
    }
  };

  const getStaticRoutes = (): Route[] => [
    {
      id: "static-1",
      from: "Lagos",
      to: "Abuja",
      duration: "8h 30m",
      price: "₦15,000",
      originalPrice: "₦18,000",
      rating: 4.8,
      reviews: 1240,
      features: ["Wi-Fi", "Refreshments", "Comfortable Seats"],
      departures: ["06:00", "12:00", "18:00"],
      image: "/sienna.jpeg",
    },
    {
      id: "static-2",
      from: "Lagos",
      to: "Port Harcourt",
      duration: "6h 0m",
      price: "₦12,500",
      originalPrice: "₦15,000",
      rating: 4.6,
      reviews: 980,
      features: ["Wi-Fi", "USB Charging"],
      departures: ["07:00", "13:00", "19:00"],
      image: "/sienna2.jpeg",
    },
    {
      id: "static-3",
      from: "Abuja",
      to: "Kaduna",
      duration: "2h 15m",
      price: "₦4,500",
      originalPrice: "₦5,500",
      rating: 4.9,
      reviews: 2100,
      features: ["Wi-Fi", "Refreshments", "Priority Boarding"],
      departures: ["06:30", "09:00", "12:30", "15:00", "18:30"],
      image: "/sienna3.jpeg",
    },
  ];

  const handleViewDetails = (route: Route) => {
    setSelectedRoute(route);
    setIsDetailsModalOpen(true);
  };
  return (
    <section 
      id="routes" 
      className="py-16 relative bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('/sienna2.jpeg')",
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

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-white" />
            <span className="ml-2 text-white">Loading routes...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="flex items-center justify-center py-12">
            <AlertCircle className="h-8 w-8 text-red-400" />
            <span className="ml-2 text-white">{error}</span>
          </div>
        )}

        {/* Routes Grid */}
        {!loading && !error && (
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
              <Card className="h-full hover:shadow-xl transition-all duration-300 border-0 shadow-lg overflow-hidden flex flex-col">
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

                <CardContent className="p-6 flex flex-col flex-1">
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

                  {/* Action Buttons - Aligned to bottom */}
                  <div className="flex gap-2 mt-auto">
                    <Button 
                      className="flex-1 bg-amber-600 hover:bg-amber-700 text-white"
                      onClick={() => onBookNow?.(route)}
                    >
                      Book Now
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleViewDetails(route)}
                    >
                      Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
          </div>
        )}

        {/* View All Routes CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Button 
            variant="outline" 
            size="lg" 
            className="border-white text-black hover:bg-white hover:text-[#5d4a15]"
            onClick={() => {
              // Navigate to routes page
              window.location.href = '/routes';
            }}
          >
            View All Routes
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </motion.div>
      </div>

      {/* Route Details Modal */}
      {selectedRoute && (
        <RouteDetailsModal
          route={selectedRoute}
          isOpen={isDetailsModalOpen}
          onClose={() => {
            setIsDetailsModalOpen(false);
            setSelectedRoute(null);
          }}
          onBookNow={(route) => {
            onBookNow?.(route);
            setIsDetailsModalOpen(false);
            setSelectedRoute(null);
          }}
        />
      )}
    </section>
  );
}
