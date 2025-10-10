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
  features?: string[];
  departures: string[];
  tripIds?: string[]; // Store trip IDs for booking
  image: string;
  description?: string;
  distance?: string;
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
      
      // Fetch routes and trips together
      const [routesResponse, tripsResponse] = await Promise.all([
        fetch('https://engracedsmile.com/api/v1/routes'),
        fetch('https://engracedsmile.com/api/v1/trips')
      ]);
      
      if (routesResponse.ok) {
        const routesData = await routesResponse.json();
        const tripsData = tripsResponse.ok ? await tripsResponse.json() : [];
        
        const formattedRoutes = routesData
          .filter((route: any) => route.isActive)
          .slice(0, 6) // Show top 6 popular routes
          .map((route: {
            id: string;
            from: string;
            to: string;
            distance: number;
            duration: number;
            basePrice: number;
            description?: string;
            isActive: boolean;
            createdAt: string;
            _count?: { trips: number; bookings: number };
          }) => {
            // Get trips for this route
            const routeTrips = tripsData.filter((trip: any) => 
              trip.routeId === route.id &&
              trip.status === 'ACTIVE' &&
              new Date(trip.departureTime) > new Date()
            );
            
            // Calculate rating from actual bookings (0 if no bookings yet)
            const totalBookings = route._count?.bookings || 0;
            const rating = totalBookings > 0 ? parseFloat((4.0 + Math.min(0.9, totalBookings / 1000)).toFixed(1)) : 0;
            
            // Get features from actual trips
            const features = routeTrips[0]?.features || [];
            
            return {
              id: route.id,
              from: route.from,
              to: route.to,
              duration: `${Math.floor(route.duration / 60)}h ${route.duration % 60}m`,
              distance: `${route.distance} km`,
              price: `₦${route.basePrice.toLocaleString()}`,
              originalPrice: undefined,
              rating: rating,
              reviews: totalBookings,
              features: features,
              departures: routeTrips.map((trip: any) => 
                new Date(trip.departureTime).toLocaleTimeString('en-US', { 
                  hour: '2-digit', 
                  minute: '2-digit',
                  hour12: false 
                })
              ),
              tripIds: routeTrips.map((trip: any) => trip.id), // Store trip IDs
              image: routeTrips[0]?.vehicle?.images?.[0] || "/sienna.jpeg",
              description: route.description || `Travel from ${route.from} to ${route.to}`,
              isActive: route.isActive
            };
          })
          .filter((route: Route) => route.departures.length > 0); // Only show routes with scheduled trips
        
        setRoutes(formattedRoutes);
      } else {
        console.error('Failed to fetch routes');
        setError('Failed to load routes');
        setRoutes([]);
      }
    } catch (error) {
      console.error('Error fetching routes:', error);
      setError('Failed to load routes');
      setRoutes([]);
    } finally {
      setLoading(false);
    }
  };

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
                    {route.features?.map((feature, idx) => (
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
