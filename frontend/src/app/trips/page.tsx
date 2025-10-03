"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Clock, 
  MapPin, 
  Users, 
  Star, 
  Filter, 
  Search,
  Calendar,
  Bus,
  Wifi,
  Coffee,
  ArrowRight,
  CheckCircle,
  XCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Sample trips data
const trips = [
  {
    id: 1,
    route: "Lagos to Abuja",
    from: "Lagos",
    to: "Abuja",
    departureTime: "06:00",
    arrivalTime: "14:30",
    date: "2024-01-15",
    duration: "8h 30m",
    price: "₦15,000",
    originalPrice: "₦18,000",
    availableSeats: 12,
    totalSeats: 50,
    vehicle: "Luxury Coach A",
    amenities: ["Wi-Fi", "Refreshments", "USB Charging", "Reclining Seats"],
    status: "Available",
    rating: 4.8,
    reviews: 1240,
    driver: "John Adebayo",
    vehicleType: "Luxury Coach"
  },
  {
    id: 2,
    route: "Lagos to Abuja",
    from: "Lagos",
    to: "Abuja",
    departureTime: "12:00",
    arrivalTime: "20:30",
    date: "2024-01-15",
    duration: "8h 30m",
    price: "₦15,000",
    originalPrice: "₦18,000",
    availableSeats: 3,
    totalSeats: 50,
    vehicle: "Luxury Coach B",
    amenities: ["Wi-Fi", "Refreshments", "USB Charging", "Reclining Seats"],
    status: "Almost Full",
    rating: 4.8,
    reviews: 1240,
    driver: "Mary Johnson",
    vehicleType: "Luxury Coach"
  },
  {
    id: 3,
    route: "Lagos to Abuja",
    from: "Lagos",
    to: "Abuja",
    departureTime: "18:00",
    arrivalTime: "02:30",
    date: "2024-01-15",
    duration: "8h 30m",
    price: "₦15,000",
    originalPrice: "₦18,000",
    availableSeats: 0,
    totalSeats: 50,
    vehicle: "Luxury Coach C",
    amenities: ["Wi-Fi", "Refreshments", "USB Charging", "Reclining Seats"],
    status: "Fully Booked",
    rating: 4.8,
    reviews: 1240,
    driver: "David Okonkwo",
    vehicleType: "Luxury Coach"
  },
  {
    id: 4,
    route: "Lagos to Port Harcourt",
    from: "Lagos",
    to: "Port Harcourt",
    departureTime: "07:00",
    arrivalTime: "13:00",
    date: "2024-01-15",
    duration: "6h 0m",
    price: "₦12,500",
    originalPrice: "₦15,000",
    availableSeats: 25,
    totalSeats: 45,
    vehicle: "Standard Coach D",
    amenities: ["Wi-Fi", "USB Charging"],
    status: "Available",
    rating: 4.6,
    reviews: 980,
    driver: "Sarah Williams",
    vehicleType: "Standard Coach"
  },
  {
    id: 5,
    route: "Abuja to Kaduna",
    from: "Abuja",
    to: "Kaduna",
    departureTime: "09:00",
    arrivalTime: "11:15",
    date: "2024-01-15",
    duration: "2h 15m",
    price: "₦4,500",
    originalPrice: "₦5,500",
    availableSeats: 8,
    totalSeats: 30,
    vehicle: "Mini Bus E",
    amenities: ["Wi-Fi", "Refreshments", "Priority Boarding"],
    status: "Available",
    rating: 4.9,
    reviews: 2100,
    driver: "Ahmed Hassan",
    vehicleType: "Mini Bus"
  }
];

const statusColors = {
  "Available": "bg-green-100 text-green-800",
  "Almost Full": "bg-yellow-100 text-yellow-800",
  "Fully Booked": "bg-red-100 text-red-800"
};

export default function TripsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedRoute, setSelectedRoute] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  const filteredTrips = trips.filter(trip => {
    const matchesSearch = trip.route.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         trip.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         trip.to.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = !selectedDate || trip.date === selectedDate;
    const matchesRoute = !selectedRoute || trip.route === selectedRoute;
    const matchesStatus = !selectedStatus || trip.status === selectedStatus;
    
    return matchesSearch && matchesDate && matchesRoute && matchesStatus;
  });

  const handleBookTrip = (trip: any) => {
    // Handle trip booking logic here
    console.log("Booking trip:", trip);
    // You can redirect to booking page or open booking modal
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#5d4a15] to-[#6b5618] text-white py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Available Trips</h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Find and book your next journey with our scheduled trips across Nigeria
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search routes, cities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Input
              type="date"
              placeholder="Select date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
            
            <Select value={selectedRoute} onValueChange={setSelectedRoute}>
              <SelectTrigger>
                <SelectValue placeholder="All Routes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Routes</SelectItem>
                <SelectItem value="Lagos to Abuja">Lagos to Abuja</SelectItem>
                <SelectItem value="Lagos to Port Harcourt">Lagos to Port Harcourt</SelectItem>
                <SelectItem value="Abuja to Kaduna">Abuja to Kaduna</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger>
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Status</SelectItem>
                <SelectItem value="Available">Available</SelectItem>
                <SelectItem value="Almost Full">Almost Full</SelectItem>
                <SelectItem value="Fully Booked">Fully Booked</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Trips List */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              {filteredTrips.length} Trip{filteredTrips.length !== 1 ? 's' : ''} Found
            </h2>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-500">Filters Applied</span>
            </div>
          </div>

          <div className="space-y-6">
            {filteredTrips.map((trip, index) => (
              <motion.div
                key={trip.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                      {/* Trip Info */}
                      <div className="lg:col-span-2">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900">{trip.route}</h3>
                            <p className="text-sm text-gray-600">{trip.vehicle} • {trip.driver}</p>
                          </div>
                          <Badge className={statusColors[trip.status as keyof typeof statusColors]}>
                            {trip.status}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-gray-500" />
                            <div>
                              <p className="text-sm text-gray-600">Departure</p>
                              <p className="font-semibold">{trip.departureTime}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-gray-500" />
                            <div>
                              <p className="text-sm text-gray-600">Arrival</p>
                              <p className="font-semibold">{trip.arrivalTime}</p>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 mb-4">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium">{trip.rating}</span>
                            <span className="text-xs text-gray-500">({trip.reviews})</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4 text-gray-500" />
                            <span className="text-sm text-gray-600">
                              {trip.availableSeats} of {trip.totalSeats} seats available
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {trip.amenities.map((amenity, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {amenity}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Pricing */}
                      <div className="flex flex-col justify-center">
                        <div className="text-center mb-4">
                          <div className="text-3xl font-bold text-gray-900">{trip.price}</div>
                          {trip.originalPrice && (
                            <div className="text-sm text-gray-500 line-through">{trip.originalPrice}</div>
                          )}
                          <div className="text-sm text-gray-600">{trip.duration}</div>
                        </div>
                      </div>

                      {/* Action */}
                      <div className="flex flex-col justify-center">
                        <Button
                          className="w-full bg-[#5d4a15] hover:bg-[#6b5618] text-white mb-2"
                          onClick={() => handleBookTrip(trip)}
                          disabled={trip.status === "Fully Booked"}
                        >
                          {trip.status === "Fully Booked" ? "Fully Booked" : "Book Now"}
                        </Button>
                        <Button variant="outline" size="sm" className="w-full">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {filteredTrips.length === 0 && (
            <div className="text-center py-12">
              <Bus className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No trips found</h3>
              <p className="text-gray-600">Try adjusting your search criteria</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[#5d4a15] text-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Need Help Finding a Trip?</h2>
            <p className="text-xl text-white/90 mb-8">
              Our customer service team is here to help you find the perfect journey
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-[#5d4a15]">
                Contact Support
              </Button>
              <Button size="lg" className="bg-white text-[#5d4a15] hover:bg-gray-100">
                Call +234 807 111 6229
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
