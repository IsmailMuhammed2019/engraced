"use client";

import { motion } from "framer-motion";
import { X, Clock, MapPin, Star, Users, Wifi, Coffee, Car, ArrowRight, Calendar, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";

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

interface Trip {
  id: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
  availableSeats: number;
  totalSeats: number;
  vehicle: {
    make: string;
    model: string;
    plateNumber: string;
    features: string[];
    capacity: number;
    year: number;
    color: string;
    image?: string;
  };
  driver: {
    name: string;
    phone: string;
    rating: number;
    experience: string;
  };
  status: string;
}

interface RouteDetailsModalProps {
  route: Route;
  isOpen: boolean;
  onClose: () => void;
  onBookNow: (route: Route) => void;
}

export default function RouteDetailsModal({ route, isOpen, onClose, onBookNow }: RouteDetailsModalProps) {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchTrips();
    }
  }, [isOpen, route.id]);

  const fetchTrips = async () => {
    try {
      setLoading(true);
      const response = await fetch(`https://engracedsmile.com/api/v1/trips?routeId=${route.id}`);
      
      if (response.ok) {
        const data = await response.json();
        const formattedTrips = data.map((trip: any) => {
          // Calculate available seats from real seat data
          const availableSeats = trip.seats?.filter((s: any) => !s.isBooked).length || 0;
          const totalSeats = trip.seats?.length || trip.maxPassengers || 7;
          
          // Get driver full name
          const driverName = trip.driver?.firstName && trip.driver?.lastName 
            ? `${trip.driver.firstName} ${trip.driver.lastName}`
            : "Driver";
          
          return {
            id: trip.id,
            departureTime: trip.departureTime,
            arrivalTime: trip.arrivalTime,
            price: parseFloat(trip.price),
            availableSeats: availableSeats,
            totalSeats: totalSeats,
            vehicle: {
              make: trip.vehicle?.make,
              model: trip.vehicle?.model,
              plateNumber: trip.vehicle?.plateNumber,
              features: trip.vehicle?.features || [],
              capacity: trip.vehicle?.capacity || totalSeats,
              year: trip.vehicle?.year,
              color: trip.vehicle?.color,
              image: trip.vehicle?.images?.[0] || "/sienna.jpeg"
            },
            driver: {
              name: driverName,
              phone: trip.driver?.phone,
              rating: trip.driver?.rating || 0,
              experience: trip.driver?.yearsExperience ? `${trip.driver.yearsExperience}+ years` : ""
            },
            status: trip.status
          };
        });
        setTrips(formattedTrips);
      } else {
        console.error('Failed to fetch trips');
        setTrips([]);
      }
    } catch (error) {
      console.error('Error fetching trips:', error);
      setTrips([]);
    } finally {
      setLoading(false);
    }
  };

  const getMockTrips = (): Trip[] => [
    {
      id: "mock-1",
      departureTime: "2024-01-15T06:00:00Z",
      arrivalTime: "2024-01-15T14:30:00Z",
      price: 15000,
      availableSeats: 15,
      totalSeats: 30,
      vehicle: {
        make: "Toyota",
        model: "Sienna",
        plateNumber: "ABC123XY",
        features: ["AC", "WiFi", "USB Charging", "Reclining Seats"],
        capacity: 30,
        year: 2020,
        color: "White",
        image: "/sienna.jpeg"
      },
      driver: {
        name: "John Doe",
        phone: "+2348012345678",
        rating: 4.8,
        experience: "5+ years"
      },
      status: "ACTIVE"
    },
    {
      id: "mock-2",
      departureTime: "2024-01-15T12:00:00Z",
      arrivalTime: "2024-01-15T20:30:00Z",
      price: 15000,
      availableSeats: 8,
      totalSeats: 30,
      vehicle: {
        make: "Toyota",
        model: "Hiace",
        plateNumber: "DEF456YZ",
        features: ["AC", "WiFi", "USB Charging"],
        capacity: 30,
        year: 2021,
        color: "Blue",
        image: "/sienna2.jpeg"
      },
      driver: {
        name: "Jane Smith",
        phone: "+2348012345679",
        rating: 4.6,
        experience: "3+ years"
      },
      status: "ACTIVE"
    }
  ];

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#5d4a15] to-[#6b5618] text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">
                {route.from} → {route.to}
              </h2>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{route.duration}</span>
                </div>
                {route.distance && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{route.distance}</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span>{route.rating} ({route.reviews} reviews)</span>
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white/20"
            >
              <X className="h-6 w-6" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[calc(90vh-120px)] overflow-y-auto">
          {/* Route Description */}
          {route.description && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">About This Route</h3>
              <p className="text-gray-600">{route.description}</p>
            </div>
          )}

          {/* Features & Amenities */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Features</h3>
              <div className="flex flex-wrap gap-2">
                {route.features.map((feature, index) => (
                  <Badge key={index} variant="outline" className="text-sm">
                    {feature}
                  </Badge>
                ))}
              </div>
            </div>
            {route.amenities && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Amenities</h3>
                <div className="flex flex-wrap gap-2">
                  {route.amenities.map((amenity, index) => (
                    <Badge key={index} variant="outline" className="text-sm">
                      {amenity}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Available Trips */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Available Trips</h3>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5d4a15]"></div>
                <span className="ml-2">Loading trips...</span>
              </div>
            ) : (
              <div className="space-y-4">
                {trips.map((trip) => (
                  <Card key={trip.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-4">
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        {/* Trip Info */}
                        <div className="lg:col-span-2">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-4">
                              <div className="text-center">
                                <div className="text-sm text-gray-500">Departure</div>
                                <div className="font-semibold">{formatTime(trip.departureTime)}</div>
                                <div className="text-xs text-gray-500">{formatDate(trip.departureTime)}</div>
                              </div>
                              <ArrowRight className="h-4 w-4 text-gray-400" />
                              <div className="text-center">
                                <div className="text-sm text-gray-500">Arrival</div>
                                <div className="font-semibold">{formatTime(trip.arrivalTime)}</div>
                                <div className="text-xs text-gray-500">{formatDate(trip.arrivalTime)}</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-[#5d4a15]">
                                ₦{trip.price.toLocaleString()}
                              </div>
                              <div className="text-sm text-gray-500">per person</div>
                            </div>
                          </div>

                          {/* Vehicle Info */}
                          <div className="flex items-center gap-4 mb-3">
                            <img
                              src={trip.vehicle.image}
                              alt={`${trip.vehicle.make} ${trip.vehicle.model}`}
                              className="w-16 h-12 object-cover rounded"
                            />
                            <div>
                              <div className="font-semibold">
                                {trip.vehicle.make} {trip.vehicle.model}
                              </div>
                              <div className="text-sm text-gray-500">
                                {trip.vehicle.year} • {trip.vehicle.color} • {trip.vehicle.plateNumber}
                              </div>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {trip.vehicle.features.map((feature, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {feature}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Driver Info */}
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-[#5d4a15] rounded-full flex items-center justify-center text-white text-sm font-semibold">
                              {trip.driver.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <div className="font-semibold">{trip.driver.name}</div>
                              <div className="text-sm text-gray-500">
                                {trip.driver.experience} • ⭐ {trip.driver.rating}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Booking Section */}
                        <div className="lg:col-span-1">
                          <div className="bg-gray-50 rounded-lg p-4">
                            <div className="text-center mb-4">
                              <div className="text-sm text-gray-500 mb-1">Available Seats</div>
                              <div className="text-2xl font-bold text-[#5d4a15]">
                                {trip.availableSeats}/{trip.totalSeats}
                              </div>
                              <div className="text-xs text-gray-500">
                                {trip.availableSeats > 10 ? 'Many seats available' : 
                                 trip.availableSeats > 5 ? 'Limited seats' : 
                                 trip.availableSeats > 0 ? 'Few seats left' : 'Fully booked'}
                              </div>
                            </div>
                            
                            <Button
                              className="w-full bg-[#5d4a15] hover:bg-[#6b5618] text-white"
                              onClick={() => onBookNow(route)}
                              disabled={trip.availableSeats === 0}
                            >
                              {trip.availableSeats === 0 ? 'Fully Booked' : 'Book This Trip'}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
