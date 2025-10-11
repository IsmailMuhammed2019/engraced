"use client";
/* eslint-disable @typescript-eslint/no-unused-vars */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  X, 
  Clock, 
  MapPin, 
  Star, 
  Users, 
  Wifi, 
  Coffee, 
  Shield, 
  Battery, 
  Phone, 
  Mail, 
  Calendar,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Truck,
  User,
  Award,
  Timer,
  Heart,
  Share2,
  BookOpen,
  Route,
  Bus,
} from "lucide-react";
import RatingSystem from "./RatingSystem";

interface RouteDetails {
  id: string;
  from: string;
  to: string;
  duration: string;
  distance: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  features: string[];
  description: string;
  image: string;
  departures: Array<{
    time: string;
    type: string;
    available: boolean;
    tripId?: string;
    availableSeats?: number;
    vehicle?: string;
    driver?: string;
  }>;
  isActive: boolean;
  createdAt: string;
}

interface TripDetails {
  id: string;
  route: string;
  from: string;
  to: string;
  departureTime: string;
  arrivalTime: string;
  date: string;
  duration: string;
  price: number;
  originalPrice?: number;
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
  };
  driver: {
    name: string;
    phone: string;
    email: string;
    rating: number;
    experience: number;
    licenseNumber: string;
    profileImage?: string;
  };
  features: string[];
  status: string;
  rating: number;
  reviews: number;
  isActive: boolean;
  createdAt: string;
}

interface ViewDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "route" | "trip";
  data: RouteDetails | TripDetails | null;
}

export default function ViewDetailsModal({ isOpen, onClose, type, data }: ViewDetailsModalProps) {
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (isOpen) {
      setActiveTab("overview");
    }
  }, [isOpen]);

  if (!data) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "boarding":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "departed":
        return "bg-green-100 text-green-800 border-green-200";
      case "completed":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case "wi-fi":
      case "wifi":
        return <Wifi className="h-4 w-4" />;
      case "refreshments":
      case "coffee":
        return <Coffee className="h-4 w-4" />;
      case "air conditioning":
      case "ac":
        return <Shield className="h-4 w-4" />;
      case "usb charging":
        return <Battery className="h-4 w-4" />;
      case "reclining seats":
        return <Users className="h-4 w-4" />;
      default:
        return <CheckCircle className="h-4 w-4" />;
    }
  };

  const handleBookNow = () => {
    // Close modal and redirect to booking
    onClose();
    if (type === "route") {
      window.location.href = `/trips?from=${data.from}&to=${data.to}`;
    } else {
      window.location.href = `/booking?tripId=${data.id}`;
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${type === "route" ? "Route" : "Trip"}: ${data.from} to ${data.to}`,
        text: `Check out this ${type === "route" ? "route" : "trip"} from ${data.from} to ${data.to}`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow-xl"
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {type === "route" ? "Route Details" : "Trip Details"}
                </h2>
                <p className="text-gray-600">
                  {data.from} → {data.to}
                </p>
              </div>
              <Button variant="ghost" onClick={onClose} className="p-2">
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Image and Basic Info */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="lg:col-span-2">
                  <div className="relative h-64 bg-gradient-to-r from-[#5d4a15] to-[#6b5618] rounded-lg overflow-hidden">
                    <Image
                      src={(data as { image?: string }).image || "/images/default-route.jpg"}
                      alt={`${data.from} to ${data.to}`}
                      fill
                      className="object-cover opacity-30"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center text-white">
                        <div className="flex items-center gap-2 text-2xl font-bold mb-2">
                          <MapPin className="h-6 w-6" />
                          <span>{data.from}</span>
                          <ArrowRight className="h-6 w-6" />
                          <span>{data.to}</span>
                        </div>
                        <div className="flex items-center justify-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{type === "trip" ? (data as TripDetails).duration : (data as RouteDetails).duration}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-current" />
                            <span>{data.rating} ({data.reviews} reviews)</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Pricing */}
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-[#5d4a15]">
                          ₦{data.price.toLocaleString()}
                        </div>
                        {data.originalPrice && (
                          <div className="text-sm text-gray-500 line-through">
                            ₦{data.originalPrice.toLocaleString()}
                          </div>
                        )}
                        <div className="text-sm text-gray-600 mt-2">
                          {type === "trip" && `Available: ${(data as TripDetails).availableSeats}/${(data as TripDetails).totalSeats} seats`}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Quick Actions */}
                  <div className="space-y-2">
                    <Button 
                      className={`w-full ${
                        (type === "trip" && (data as TripDetails).availableSeats === 0) ||
                        (type === "route" && (data as RouteDetails).departures.filter(d => d.available && (d.availableSeats === undefined || d.availableSeats > 0)).length === 0)
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed hover:bg-gray-300'
                          : 'bg-[#5d4a15] hover:bg-[#6b5618] text-white'
                      }`}
                      onClick={handleBookNow}
                      disabled={
                        (type === "trip" && (data as TripDetails).availableSeats === 0) ||
                        (type === "route" && (data as RouteDetails).departures.filter(d => d.available && (d.availableSeats === undefined || d.availableSeats > 0)).length === 0)
                      }
                    >
                      <BookOpen className="h-4 w-4 mr-2" />
                      {(type === "trip" && (data as TripDetails).availableSeats === 0) ||
                       (type === "route" && (data as RouteDetails).departures.filter(d => d.available && (d.availableSeats === undefined || d.availableSeats > 0)).length === 0)
                        ? 'Fully Booked'
                        : 'Book Now'
                      }
                    </Button>
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" onClick={handleShare}>
                        <Share2 className="h-4 w-4 mr-1" />
                        Share
                      </Button>
                      <Button variant="outline">
                        <Heart className="h-4 w-4 mr-1" />
                        Save
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="border-b mb-6">
                <nav className="flex space-x-8">
                  {["overview", "features", "schedule", "reviews"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`py-2 px-1 border-b-2 font-medium text-sm ${
                        activeTab === tab
                          ? "border-[#5d4a15] text-[#5d4a15]"
                          : "border-transparent text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tab Content */}
              <div className="space-y-6">
                {activeTab === "overview" && (
                  <div className="space-y-6">
                    {/* Description */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Description</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600 leading-relaxed">
                          {(data as { description?: string }).description || "No description available."}
                        </p>
                      </CardContent>
                    </Card>

                    {/* Key Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Route className="h-5 w-5" />
                            Route Information
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Distance:</span>
                            <span className="font-medium">
                              {type === "route" ? (data as RouteDetails).distance : "N/A"}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Duration:</span>
                            <span className="font-medium">
                              {type === "trip" ? (data as TripDetails).duration : (data as RouteDetails).duration}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Status:</span>
                            <Badge className={getStatusColor(type === "trip" ? (data as TripDetails).status : "active")}>
                              {type === "trip" ? (data as TripDetails).status : "Active"}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>

                      {type === "trip" && (
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <Bus className="h-5 w-5" />
                              Vehicle Information
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Vehicle:</span>
                              <span className="font-medium">
                                {(data as TripDetails).vehicle.make} {(data as TripDetails).vehicle.model}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Plate Number:</span>
                              <span className="font-medium">
                                {(data as TripDetails).vehicle.plateNumber}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Capacity:</span>
                              <span className="font-medium">
                                {(data as TripDetails).vehicle.capacity} seats
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Year:</span>
                              <span className="font-medium">
                                {(data as TripDetails).vehicle.year}
                              </span>
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </div>

                    {/* Driver Information (for trips) */}
                    {type === "trip" && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <User className="h-5 w-5" />
                            Driver Information
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 bg-[#5d4a15] rounded-full flex items-center justify-center text-white text-xl font-bold">
                              {(data as TripDetails).driver.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg">{(data as TripDetails).driver.name}</h3>
                              <div className="flex items-center space-x-4 mt-2">
                                <div className="flex items-center">
                                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                  <span className="ml-1 font-medium">{(data as TripDetails).driver.rating}</span>
                                </div>
                                <span className="text-sm text-gray-600">
                                  {(data as TripDetails).driver.experience} years experience
                                </span>
                              </div>
                              <div className="flex items-center space-x-4 mt-2">
                                <Button variant="outline" size="sm">
                                  <Phone className="h-4 w-4 mr-1" />
                                  Call Driver
                                </Button>
                                <Button variant="outline" size="sm">
                                  <Mail className="h-4 w-4 mr-1" />
                                  Email
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                )}

                {activeTab === "features" && (
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Shield className="h-5 w-5" />
                          Features & Amenities
                        </CardTitle>
                        <CardDescription>Everything you need for a comfortable journey</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {data.features && data.features.length > 0 ? (
                            data.features.map((feature, index) => (
                              <div key={index} className="flex items-center space-x-3 p-4 bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-lg hover:border-[#5d4a15] transition-all">
                                <div className="w-10 h-10 bg-[#5d4a15]/10 rounded-lg flex items-center justify-center text-[#5d4a15]">
                                  {getAmenityIcon(feature)}
                                </div>
                                <span className="font-medium text-gray-900">{feature}</span>
                              </div>
                            ))
                          ) : (
                            <div className="col-span-2 text-center py-8 text-gray-500">
                              <Shield className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                              <p>Standard features included</p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Additional Vehicle Features (for trips) */}
                    {type === "trip" && (data as TripDetails).vehicle.features && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Bus className="h-5 w-5" />
                            Vehicle Features
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {(data as TripDetails).vehicle.features.map((feature, index) => (
                              <div key={index} className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                <CheckCircle className="h-4 w-4 text-blue-600" />
                                <span className="text-sm font-medium text-gray-900">{feature}</span>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Why Choose This Route */}
                    <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Award className="h-5 w-5 text-green-600" />
                          Why Choose This Route
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                              <CheckCircle className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900">Professional Drivers</div>
                              <div className="text-sm text-gray-600">Experienced and certified drivers</div>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                              <Shield className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900">Safety First</div>
                              <div className="text-sm text-gray-600">Regular vehicle maintenance and safety checks</div>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                              <Timer className="h-5 w-5 text-purple-600" />
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900">On-Time Guarantee</div>
                              <div className="text-sm text-gray-600">98% on-time departure rate</div>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                              <Heart className="h-5 w-5 text-orange-600" />
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900">Customer Satisfaction</div>
                              <div className="text-sm text-gray-600">{data.rating}/5.0 average rating</div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {activeTab === "schedule" && (
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Calendar className="h-5 w-5" />
                          Schedule & Departures
                        </CardTitle>
                        <CardDescription>
                          {type === "route" 
                            ? `${(data as RouteDetails).departures.length} available departure times` 
                            : "Trip schedule and timing"}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {type === "route" 
                            ? (data as RouteDetails).departures.length > 0 
                              ? (data as RouteDetails).departures.map((departure, index) => (
                                  <div key={index} className="bg-gradient-to-r from-white to-gray-50 border-2 border-gray-200 rounded-xl p-4 hover:border-[#5d4a15] transition-all">
                                    <div className="flex items-center justify-between mb-3">
                                      <div className="flex items-center space-x-3">
                                        <div className="w-12 h-12 bg-[#5d4a15]/10 rounded-lg flex items-center justify-center">
                                          <Clock className="h-6 w-6 text-[#5d4a15]" />
                                        </div>
                                        <div>
                                          <div className="font-bold text-lg text-gray-900">{departure.time}</div>
                                          <div className="text-sm text-gray-600">{departure.type} Service</div>
                                        </div>
                                      </div>
                                      <div className="text-right">
                                        <Badge className={departure.available ? "bg-green-100 text-green-800 border-green-300" : "bg-red-100 text-red-800 border-red-300"}>
                                          {departure.available ? (
                                            <><CheckCircle className="h-3 w-3 mr-1 inline" />Available</>
                                          ) : (
                                            <><AlertCircle className="h-3 w-3 mr-1 inline" />Fully Booked</>
                                          )}
                                        </Badge>
                                      </div>
                                    </div>
                                    
                                    {departure.availableSeats !== undefined && (
                                      <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                                        <div className="flex items-center gap-4 text-sm">
                                          <div className="flex items-center gap-1">
                                            <Users className="h-4 w-4 text-gray-500" />
                                            <span className="text-gray-700">
                                              <span className="font-semibold text-green-600">{departure.availableSeats}</span> seats available
                                            </span>
                                          </div>
                                          {departure.vehicle && (
                                            <div className="flex items-center gap-1">
                                              <Bus className="h-4 w-4 text-gray-500" />
                                              <span className="text-gray-700">{departure.vehicle}</span>
                                            </div>
                                          )}
                                        </div>
                                        {departure.tripId && (
                                          <Button
                                            size="sm"
                                            className={
                                              departure.available && (departure.availableSeats === undefined || departure.availableSeats > 0)
                                                ? 'bg-[#5d4a15] hover:bg-[#6b5618] text-white'
                                                : 'bg-gray-300 text-gray-500 cursor-not-allowed hover:bg-gray-300'
                                            }
                                            onClick={() => {
                                              if (departure.available && (departure.availableSeats === undefined || departure.availableSeats > 0)) {
                                                window.location.href = `/booking?tripId=${departure.tripId}`;
                                              }
                                            }}
                                            disabled={!departure.available || departure.availableSeats === 0}
                                          >
                                            {departure.availableSeats === 0 ? 'Full' : 'Book Now'}
                                          </Button>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                ))
                              : (
                                <div className="text-center py-8 text-gray-500">
                                  <Calendar className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                                  <p>No scheduled trips available for this route</p>
                                  <Button 
                                    variant="outline" 
                                    className="mt-4"
                                    onClick={() => window.location.href = '/contact'}
                                  >
                                    Contact us to schedule
                                  </Button>
                                </div>
                              )
                            : (
                                <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-xl p-6">
                                  <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div className="text-center p-4 bg-white rounded-lg">
                                      <Calendar className="h-6 w-6 mx-auto mb-2 text-[#5d4a15]" />
                                      <div className="text-sm text-gray-600">Date</div>
                                      <div className="font-semibold">{(data as TripDetails).date}</div>
                                    </div>
                                    <div className="text-center p-4 bg-white rounded-lg">
                                      <Clock className="h-6 w-6 mx-auto mb-2 text-[#5d4a15]" />
                                      <div className="text-sm text-gray-600">Duration</div>
                                      <div className="font-semibold">{(data as TripDetails).duration}</div>
                                    </div>
                                  </div>
                                  <div className="flex items-center justify-between p-4 bg-white rounded-lg">
                                    <div>
                                      <div className="text-sm text-gray-600">Departure</div>
                                      <div className="font-bold text-lg">{(data as TripDetails).departureTime}</div>
                                    </div>
                                    <ArrowRight className="h-6 w-6 text-gray-400" />
                                    <div className="text-right">
                                      <div className="text-sm text-gray-600">Arrival</div>
                                      <div className="font-bold text-lg">{(data as TripDetails).arrivalTime}</div>
                                    </div>
                                  </div>
                                  <div className="mt-4 p-4 bg-white rounded-lg">
                                    <div className="flex items-center justify-between">
                                      <span className="text-gray-700">Available Seats:</span>
                                      <Badge className="bg-green-100 text-green-800 text-lg px-4 py-2">
                                        {(data as TripDetails).availableSeats}/{(data as TripDetails).totalSeats}
                                      </Badge>
                                    </div>
                                  </div>
                                </div>
                              )
                        }
                      </div>
                    </CardContent>
                  </Card>

                  {/* Route Statistics (for routes) */}
                  {type === "route" && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Award className="h-5 w-5" />
                          Route Statistics
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="text-center p-4 bg-gray-50 rounded-lg">
                            <div className="text-2xl font-bold text-[#5d4a15]">{(data as RouteDetails).departures.length}</div>
                            <div className="text-sm text-gray-600">Daily Trips</div>
                          </div>
                          <div className="text-center p-4 bg-gray-50 rounded-lg">
                            <div className="text-2xl font-bold text-yellow-500">{(data as RouteDetails).rating}</div>
                            <div className="text-sm text-gray-600">Rating</div>
                          </div>
                          <div className="text-center p-4 bg-gray-50 rounded-lg">
                            <div className="text-2xl font-bold text-blue-500">{(data as RouteDetails).reviews}</div>
                            <div className="text-sm text-gray-600">Bookings</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
                )}

                {activeTab === "reviews" && (
                  <RatingSystem
                    targetId={data.id}
                    targetType={type}
                    targetName={`${data.from} to ${data.to}`}
                    showForm={true}
                    showReviews={true}
                  />
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
