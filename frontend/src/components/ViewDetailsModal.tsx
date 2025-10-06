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
  amenities: string[];
  description: string;
  image: string;
  departures: Array<{
    time: string;
    type: string;
    available: boolean;
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
  amenities: string[];
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
                      className="w-full bg-[#5d4a15] hover:bg-[#6b5618]"
                      onClick={handleBookNow}
                    >
                      <BookOpen className="h-4 w-4 mr-2" />
                      Book Now
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
                  {["overview", "amenities", "schedule", "reviews"].map((tab) => (
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

                {activeTab === "amenities" && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Amenities & Features</CardTitle>
                      <CardDescription>What&apos;s included in your journey</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {data.amenities.map((amenity, index) => (
                          <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                            <div className="text-[#5d4a15]">
                              {getAmenityIcon(amenity)}
                            </div>
                            <span className="font-medium">{amenity}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {activeTab === "schedule" && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Schedule & Departures</CardTitle>
                      <CardDescription>Available departure times</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {type === "route" 
                          ? (data as RouteDetails).departures.map((departure, index) => (
                              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                                <div className="flex items-center space-x-3">
                                  <Clock className="h-4 w-4 text-gray-500" />
                                  <span className="font-medium">{departure.time}</span>
                                  <Badge variant="outline">{departure.type}</Badge>
                                </div>
                                <Badge className={departure.available ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                                  {departure.available ? "Available" : "Full"}
                                </Badge>
                              </div>
                            ))
                          : (
                              <div className="p-4 bg-gray-50 rounded-lg">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="font-medium">{(data as TripDetails).departureTime} - {(data as TripDetails).arrivalTime}</p>
                                    <p className="text-sm text-gray-600">{(data as TripDetails).date}</p>
                                  </div>
                                  <Badge className="bg-green-100 text-green-800">
                                    Available
                                  </Badge>
                                </div>
                              </div>
                            )
                        }
                      </div>
                    </CardContent>
                  </Card>
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
