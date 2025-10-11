"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
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
  XCircle,
  RefreshCw,
  Loader2,
  AlertCircle,
  SortAsc,
  SortDesc,
  DollarSign,
  Timer,
  Shield,
  Battery,
  Wifi as WifiIcon,
  Coffee as CoffeeIcon,
  User,
  Phone,
  Award
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BookingModal from "@/components/BookingModal";
import ViewDetailsModal from "@/components/ViewDetailsModal";
import SeatSelectionModal from "@/components/SeatSelectionModal";
import RatingSystem from "@/components/RatingSystem";
import AvailabilityStatus from "@/components/AvailabilityStatus";

interface Trip {
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
    year?: number;
    color?: string;
    image?: string;
  };
  driver: {
    name: string;
    phone: string;
    rating: number;
    experience: number;
  };
  features: string[];
  status: "scheduled" | "boarding" | "departed" | "completed" | "cancelled";
  rating: number;
  reviews: number;
  vehicleType: string;
  isActive: boolean;
  createdAt: string;
}

interface SearchFilters {
  from: string;
  to: string;
  date: string;
  time: string;
  priceRange: string;
  features: string[];
  vehicleType: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
}

function TripsPageContent() {
  const searchParams = useSearchParams();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [filteredTrips, setFilteredTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    from: "",
    to: "",
    date: "",
    time: "",
    priceRange: "",
    features: [],
    vehicleType: "",
    sortBy: "departureTime",
    sortOrder: "asc"
  });

  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false);
  const [isSeatSelectionOpen, setIsSeatSelectionOpen] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [selectedTripDetails, setSelectedTripDetails] = useState<Trip | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Initialize from URL params and fetch trips ONCE on mount
  useEffect(() => {
    const from = searchParams.get('from');
    const to = searchParams.get('to');
    const date = searchParams.get('date');
    const passengers = searchParams.get('passengers');
    const travelClass = searchParams.get('class');

    if (from || to || date) {
      setSearchFilters(prev => ({
        ...prev,
        from: from || "",
        to: to || "",
        date: date || "",
        vehicleType: travelClass === "business" ? "Premium" : travelClass === "first" ? "Luxury" : "Standard"
      }));
    }

    fetchTrips();
  }, []); // Empty dependency array - run only once

  // Filter trips when data or filters change
  useEffect(() => {
    if (trips.length > 0) {
      const filtered = trips.filter(trip => {
        // Filter by from/to
        if (searchFilters.from && !trip.from.toLowerCase().includes(searchFilters.from.toLowerCase())) {
          return false;
        }
        if (searchFilters.to && !trip.to.toLowerCase().includes(searchFilters.to.toLowerCase())) {
          return false;
        }
        
        // Filter by date
        if (searchFilters.date && trip.date !== searchFilters.date) {
          return false;
        }
        
        return trip.isActive;
      });

      // Sort trips
      const sorted = [...filtered].sort((a, b) => {
        let aValue, bValue;
        
        switch (searchFilters.sortBy) {
          case "price":
            aValue = a.price;
            bValue = b.price;
            break;
          case "departureTime":
          default:
            aValue = a.departureTime;
            bValue = b.departureTime;
            break;
        }
        
        return searchFilters.sortOrder === "asc" ? 
          (aValue > bValue ? 1 : -1) : 
          (aValue < bValue ? 1 : -1);
      });

      setFilteredTrips(sorted);
    }
  }, [trips.length, searchFilters.from, searchFilters.to, searchFilters.date, searchFilters.sortBy, searchFilters.sortOrder]);

  const fetchTrips = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://engracedsmile.com/api/v1/trips');
      
      if (response.ok) {
        const data = await response.json();
        const formattedTrips = data.map((trip: any) => {
          // Calculate available seats from actual seat data
          const availableSeats = trip.seats?.filter((s: any) => !s.isBooked).length || 0;
          const totalSeats = trip.seats?.length || trip.maxPassengers || 7;
          
          // Get driver full name
          const driverName = trip.driver?.firstName && trip.driver?.lastName 
            ? `${trip.driver.firstName} ${trip.driver.lastName}`
            : trip.driver?.firstName || trip.driver?.lastName || "Driver";
          
          // Calculate trip duration
          const durationMs = new Date(trip.arrivalTime).getTime() - new Date(trip.departureTime).getTime();
          const hours = Math.floor(durationMs / (1000 * 60 * 60));
          const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
          
          // Get bookings count for this trip
          const bookingsCount = trip._count?.bookings || 0;
          const rating = bookingsCount > 0 ? parseFloat((4.0 + Math.min(0.9, bookingsCount / 500)).toFixed(1)) : 0;
          
          return {
            id: trip.id,
            route: `${trip.route?.from} to ${trip.route?.to}`,
            from: trip.route?.from,
            to: trip.route?.to,
            departureTime: trip.departureTime,
            arrivalTime: trip.arrivalTime,
            date: new Date(trip.departureTime).toISOString().split('T')[0],
            duration: `${hours}h ${minutes}m`,
            price: parseFloat(trip.price),
            originalPrice: undefined,
            availableSeats: availableSeats,
            totalSeats: totalSeats,
            vehicle: {
              make: trip.vehicle?.make || "Vehicle",
              model: trip.vehicle?.model || "Model",
              plateNumber: trip.vehicle?.plateNumber,
              features: trip.vehicle?.features || [],
              capacity: trip.vehicle?.capacity || totalSeats,
              year: trip.vehicle?.year,
              color: trip.vehicle?.color,
              image: trip.vehicle?.images?.[0] || "/sienna.jpeg"
            },
            driver: {
              name: driverName,
              phone: trip.driver?.phone || "",
              rating: trip.driver?.rating || 0,
              experience: trip.driver?.yearsExperience ? `${trip.driver.yearsExperience}+ years` : ""
            },
            status: trip.status?.toLowerCase() || "scheduled",
            features: trip.features || [],
            rating: rating,
            reviews: bookingsCount,
            vehicleType: trip.vehicle?.model || "Standard",
            isActive: trip.status === 'ACTIVE',
            createdAt: trip.createdAt
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

  const filterAndSortTrips = () => {
    const filtered = trips.filter(trip => {
      // Filter by from/to
      if (searchFilters.from && !trip.from.toLowerCase().includes(searchFilters.from.toLowerCase())) {
        return false;
      }
      if (searchFilters.to && !trip.to.toLowerCase().includes(searchFilters.to.toLowerCase())) {
        return false;
      }
      
      // Filter by date
      if (searchFilters.date && trip.date !== searchFilters.date) {
        return false;
      }
      
      // Filter by time
      if (searchFilters.time) {
        const tripTime = trip.departureTime;
        const filterTime = searchFilters.time;
        if (filterTime === "morning" && !tripTime.startsWith("0") && !tripTime.startsWith("1")) return false;
        if (filterTime === "afternoon" && !tripTime.startsWith("1") && !tripTime.startsWith("2")) return false;
        if (filterTime === "evening" && !tripTime.startsWith("1") && !tripTime.startsWith("2")) return false;
      }
      
      // Filter by price range
      if (searchFilters.priceRange) {
        const price = trip.price;
        switch (searchFilters.priceRange) {
          case "low":
            if (price > 10000) return false;
            break;
          case "medium":
            if (price < 10000 || price > 20000) return false;
            break;
          case "high":
            if (price < 20000) return false;
            break;
        }
      }
      
      // Filter by features
      if (searchFilters.features.length > 0) {
        const hasAllFeatures = searchFilters.features.every(feature =>
          trip.features.some(tripFeature => 
            tripFeature.toLowerCase().includes(feature.toLowerCase())
          )
        );
        if (!hasAllFeatures) return false;
      }
      
      // Filter by vehicle type
      if (searchFilters.vehicleType && trip.vehicleType !== searchFilters.vehicleType) {
        return false;
      }
      
      return trip.isActive;
    });

    // Sort trips
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (searchFilters.sortBy) {
        case "price":
          aValue = a.price;
          bValue = b.price;
          break;
        case "duration":
          aValue = parseInt(a.duration.replace(/[^\d]/g, ""));
          bValue = parseInt(b.duration.replace(/[^\d]/g, ""));
          break;
        case "rating":
          aValue = a.rating;
          bValue = b.rating;
          break;
        case "departureTime":
        default:
          aValue = a.departureTime;
          bValue = b.departureTime;
          break;
      }
      
      if (searchFilters.sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredTrips(filtered);
  };

  const handleSearch = () => {
    filterAndSortTrips();
  };

  const handleBookNow = (trip: Trip) => {
    // Check seat availability before booking
    if (trip.availableSeats === 0) {
      alert('Sorry, this trip is fully booked. Please select another trip or date.');
      return;
    }
    // Redirect directly to booking page with tripId
    window.location.href = `/booking?tripId=${trip.id}`;
  };

  const handleViewDetails = (trip: Trip) => {
    setSelectedTripDetails(trip);
    setIsViewDetailsOpen(true);
  };

  const handleSelectSeats = (trip: Trip) => {
    // Check seat availability before selection
    if (trip.availableSeats === 0) {
      alert('Sorry, this trip is fully booked. Please select another trip.');
      return;
    }
    // Redirect directly to booking page with tripId for seat selection
    window.location.href = `/booking?tripId=${trip.id}`;
  };

  const handleSeatsSelected = (seats: { id: string; number: string; price: number }[]) => {
    console.log('Selected seats:', seats);
    // Handle seat selection logic here
    setIsSeatSelectionOpen(false);
    // Redirect to booking with selected seats
    window.location.href = `/booking?tripId=${selectedTrip?.id}&seats=${seats.map(s => s.id).join(',')}`;
  };

  const handleFilterChange = (key: keyof SearchFilters, value: string | string[]) => {
    setSearchFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setSearchFilters({
      from: "",
      to: "",
      date: "",
      time: "",
      priceRange: "",
      features: [],
      vehicleType: "",
      sortBy: "departureTime",
      sortOrder: "asc"
    });
  };

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "scheduled":
        return <Clock className="h-4 w-4" />;
      case "boarding":
        return <Users className="h-4 w-4" />;
      case "departed":
        return <ArrowRight className="h-4 w-4" />;
      case "completed":
        return <CheckCircle className="h-4 w-4" />;
      case "cancelled":
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#5d4a15] to-[#6b5618] text-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Available Trips</h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Find and book your perfect journey with our comprehensive trip search and filtering options.
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="space-y-6">
            {/* Main Search Bar */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 flex gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input 
                    placeholder="From (e.g., Lagos)" 
                    className="pl-10"
                    value={searchFilters.from}
                    onChange={(e) => handleFilterChange("from", e.target.value)}
                  />
                </div>
                <div className="relative flex-1">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                    placeholder="To (e.g., Abuja)" 
                className="pl-10"
                    value={searchFilters.to}
                    onChange={(e) => handleFilterChange("to", e.target.value)}
              />
            </div>
                <div className="relative flex-1">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="date"
                    className="pl-10"
                    value={searchFilters.date}
                    onChange={(e) => handleFilterChange("date", e.target.value)}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={handleSearch}
                  className="bg-[#5d4a15] hover:bg-[#6b5618]"
                >
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
                <Button 
                  variant="outline"
                  onClick={fetchTrips}
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg"
              >
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Time of Day</label>
                  <Select value={searchFilters.time} onValueChange={(value) => handleFilterChange("time", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Any time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Any time</SelectItem>
                      <SelectItem value="morning">Morning (6AM - 12PM)</SelectItem>
                      <SelectItem value="afternoon">Afternoon (12PM - 6PM)</SelectItem>
                      <SelectItem value="evening">Evening (6PM - 12AM)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Price Range</label>
                  <Select value={searchFilters.priceRange} onValueChange={(value) => handleFilterChange("priceRange", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Any price" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Any price</SelectItem>
                      <SelectItem value="low">Under ₦10,000</SelectItem>
                      <SelectItem value="medium">₦10,000 - ₦20,000</SelectItem>
                      <SelectItem value="high">Over ₦20,000</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Vehicle Type</label>
                  <Select value={searchFilters.vehicleType} onValueChange={(value) => handleFilterChange("vehicleType", value)}>
              <SelectTrigger>
                      <SelectValue placeholder="Any type" />
              </SelectTrigger>
              <SelectContent>
                      <SelectItem value="">Any type</SelectItem>
                      <SelectItem value="Standard">Standard</SelectItem>
                      <SelectItem value="Premium">Premium</SelectItem>
                      <SelectItem value="Luxury">Luxury</SelectItem>
              </SelectContent>
            </Select>
                </div>
            
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Sort By</label>
                  <Select value={searchFilters.sortBy} onValueChange={(value) => handleFilterChange("sortBy", value)}>
              <SelectTrigger>
                      <SelectValue />
              </SelectTrigger>
              <SelectContent>
                      <SelectItem value="departureTime">Departure Time</SelectItem>
                      <SelectItem value="price">Price</SelectItem>
                      <SelectItem value="duration">Duration</SelectItem>
                      <SelectItem value="rating">Rating</SelectItem>
              </SelectContent>
            </Select>
                </div>

                <div className="flex items-end gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => handleFilterChange("sortOrder", searchFilters.sortOrder === "asc" ? "desc" : "asc")}
                  >
                    {searchFilters.sortOrder === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                  </Button>
                  <Button variant="outline" onClick={clearFilters}>
                    Clear
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Results Summary */}
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">
                {filteredTrips.length} trips found
              </div>
              <div className="text-sm text-gray-500">
                {searchFilters.from && searchFilters.to && (
                  <span>From {searchFilters.from} to {searchFilters.to}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trips Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="flex justify-center items-center py-16">
              <div className="text-center">
                <Loader2 className="h-12 w-12 animate-spin text-[#5d4a15] mx-auto mb-4" />
                <p className="text-gray-600">Loading trips...</p>
              </div>
            </div>
          ) : filteredTrips.length === 0 ? (
            <div className="space-y-8">
              {/* No Trips Found Message */}
              <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border-2 border-orange-200 rounded-2xl p-8">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-orange-100 rounded-full">
                    <AlertCircle className="h-8 w-8 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">
                      No Trips Available for Your Search
                    </h2>
                    <p className="text-lg text-gray-700 mb-2">
                      We couldn't find any trips matching your criteria
                      {searchFilters.from && searchFilters.to && (
                        <span> from <span className="font-bold text-[#5d4a15]">{searchFilters.from}</span> to <span className="font-bold text-[#5d4a15]">{searchFilters.to}</span></span>
                      )}
                      {searchFilters.date && (
                        <span> on <span className="font-bold text-[#5d4a15]">{new Date(searchFilters.date).toLocaleDateString()}</span></span>
                      )}.
                    </p>
                    <p className="text-gray-600 mb-6">
                      Try adjusting your search criteria, selecting a different date, or browse all available trips below.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <Button 
                        onClick={clearFilters}
                        className="bg-[#5d4a15] hover:bg-[#6b5618] text-white"
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Clear All Filters
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => window.location.href = '/routes'}
                        className="border-[#5d4a15] text-[#5d4a15] hover:bg-[#5d4a15]/5"
                      >
                        <MapPin className="h-4 w-4 mr-2" />
                        View All Routes
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => window.location.href = '/contact'}
                        className="border-[#5d4a15] text-[#5d4a15] hover:bg-[#5d4a15]/5"
                      >
                        Contact Support
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Show All Trips Suggestion */}
              {trips.length > 0 && (
                <div>
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      Browse All Available Trips
                    </h3>
                    <p className="text-gray-600">
                      Here are all our current trips. You might find an alternative that suits your schedule.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {trips.slice(0, 6).map((trip) => (
                      <Card key={trip.id} className="hover:shadow-lg transition-all duration-300 border-2 hover:border-[#5d4a15]">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <h3 className="font-bold text-gray-900 text-lg">{trip.from}</h3>
                              <div className="flex items-center gap-1 my-1">
                                <ArrowRight className="h-4 w-4 text-[#5d4a15]" />
                              </div>
                              <p className="font-bold text-gray-900 text-lg">{trip.to}</p>
                            </div>
                            <Badge className="bg-green-100 text-green-800">
                              {trip.availableSeats} seats
                            </Badge>
                          </div>

                          <div className="space-y-2 mb-4 text-sm">
                            <div className="flex items-center justify-between">
                              <span className="text-gray-600">Departure</span>
                              <span className="font-semibold">{trip.departureTime}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-600">Duration</span>
                              <span className="font-semibold">{trip.duration}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-600">Price</span>
                              <span className="font-bold text-[#5d4a15] text-lg">₦{trip.price.toLocaleString()}</span>
                            </div>
                          </div>

                          <Button 
                            onClick={() => window.location.href = `/booking?tripId=${trip.id}`}
                            className="w-full bg-[#5d4a15] hover:bg-[#6b5618] text-white"
                            disabled={trip.availableSeats === 0}
                          >
                            {trip.availableSeats === 0 ? 'Fully Booked' : 'Book This Trip'}
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {trips.length > 6 && (
                    <div className="text-center mt-8">
                      <Button 
                        onClick={clearFilters}
                        variant="outline"
                        size="lg"
                        className="border-[#5d4a15] text-[#5d4a15] hover:bg-[#5d4a15]/5"
                      >
                        View All {trips.length} Trips
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <>
              {/* Trips Header */}
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  {searchFilters.from || searchFilters.to ? 'Search Results' : 'Available Trips'}
                </h2>
                <p className="text-gray-600">
                  Found {filteredTrips.length} {filteredTrips.length === 1 ? 'trip' : 'trips'} 
                  {searchFilters.from && searchFilters.to && (
                    <span> from <span className="font-semibold text-[#5d4a15]">{searchFilters.from}</span> to <span className="font-semibold text-[#5d4a15]">{searchFilters.to}</span></span>
                  )}
                  {searchFilters.date && (
                    <span> on <span className="font-semibold text-[#5d4a15]">{new Date(searchFilters.date).toLocaleDateString()}</span></span>
                  )}
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {filteredTrips.map((trip) => (
                <motion.div
                  key={trip.id}
                  initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="overflow-hidden hover:shadow-xl transition-all duration-300">
                    <CardHeader className="pb-4">
                      <div className="flex justify-between items-start">
                          <div>
                          <CardTitle className="text-xl">{trip.route}</CardTitle>
                          <div className="flex items-center gap-2 mt-2">
                            <Clock className="h-4 w-4 text-gray-500" />
                            <span className="text-sm text-gray-600">{trip.departureTime} - {trip.arrivalTime}</span>
                            <span className="text-sm text-gray-500">({trip.duration})</span>
                          </div>
                        </div>
                        <Badge className={getStatusColor(trip.status)}>
                          <span className="flex items-center gap-1">
                            {getStatusIcon(trip.status)}
                            {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
                          </span>
                        </Badge>
                            </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      {/* Pricing */}
                      <div className="flex items-center justify-between">
                            <div>
                          <div className="text-2xl font-bold text-[#5d4a15]">₦{trip.price.toLocaleString()}</div>
                          {trip.originalPrice && (
                            <div className="text-sm text-gray-500 line-through">₦{trip.originalPrice.toLocaleString()}</div>
                          )}
                            </div>
                        <div className="text-right">
                          <AvailabilityStatus 
                            availableSeats={trip.availableSeats}
                            totalSeats={trip.totalSeats}
                            showDetails={true}
                          />
                        </div>
                          </div>

                      {/* Vehicle Info */}
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-start gap-4">
                          {/* Vehicle Image */}
                          <div className="flex-shrink-0">
                            <img
                              src={trip.vehicle.image || "/sienna.jpeg"}
                              alt={`${trip.vehicle.make} ${trip.vehicle.model}`}
                              className="w-20 h-16 object-cover rounded-lg"
                            />
                          </div>
                          
                          {/* Vehicle Details */}
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <p className="font-medium">{trip.vehicle.make} {trip.vehicle.model}</p>
                                <p className="text-sm text-gray-600">Plate: {trip.vehicle.plateNumber}</p>
                                {trip.vehicle.year && (
                                  <p className="text-xs text-gray-500">{trip.vehicle.year} • {trip.vehicle.color}</p>
                                )}
                              </div>
                              <Badge variant="outline">{trip.vehicleType}</Badge>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {trip.vehicle.features.map((feature, index) => (
                                <Badge key={index} className="text-xs bg-[#5d4a15] text-white">
                                  {feature}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Driver Info */}
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-[#5d4a15] rounded-full flex items-center justify-center text-white font-semibold">
                            {trip.driver.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <p className="font-medium">{trip.driver.name}</p>
                            <div className="flex items-center space-x-2">
                              <div className="flex items-center">
                                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                <span className="text-sm ml-1">{trip.driver.rating}</span>
                              </div>
                              <span className="text-sm text-gray-500">
                                {trip.driver.experience} years experience
                              </span>
                            </div>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          <Phone className="h-4 w-4 mr-1" />
                          Call
                        </Button>
                      </div>

                      {/* Features */}
                      <div>
                        <p className="text-sm text-gray-500 mb-2">Features:</p>
                        <div className="flex flex-wrap gap-1">
                          {trip.features.map((feature, index) => (
                            <span key={index} className="text-xs bg-gray-100 px-2 py-1 rounded">
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <Button
                          className={`flex-1 ${
                            trip.availableSeats === 0
                              ? 'bg-gray-300 text-gray-500 cursor-not-allowed hover:bg-gray-300'
                              : 'bg-[#5d4a15] hover:bg-[#6b5618] text-white'
                          }`}
                          onClick={() => handleBookNow(trip)}
                          disabled={trip.availableSeats === 0}
                        >
                          {trip.availableSeats === 0 ? 'Fully Booked' : 'Book Now'}
                        </Button>
                        <Button 
                          variant="outline"
                          onClick={() => handleViewDetails(trip)}
                        >
                          View Details
                        </Button>
                        <Button 
                          variant="outline"
                          onClick={() => handleSelectSeats(trip)}
                          disabled={trip.availableSeats === 0}
                        >
                          {trip.availableSeats === 0 ? 'No Seats' : 'Select Seats'}
                        </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
              ))}
              </div>
            </>
          )}
        </div>
      </section>

      <Footer />

      {/* Booking Modal */}
      {selectedTrip && (
      <BookingModal
        isOpen={isBookingModalOpen}
          onClose={() => setIsBookingModalOpen(false)}
          routeData={{
          from: selectedTrip.from,
          to: selectedTrip.to,
            price: `₦${selectedTrip.price.toLocaleString()}`,
          duration: selectedTrip.duration,
          departureTime: selectedTrip.departureTime,
          date: selectedTrip.date
          }}
        />
      )}

      {/* View Details Modal */}
      {selectedTripDetails && (
        <ViewDetailsModal
          isOpen={isViewDetailsOpen}
          onClose={() => setIsViewDetailsOpen(false)}
          type="trip"
          data={{
            ...selectedTripDetails,
            route: `${selectedTripDetails.from} to ${selectedTripDetails.to}`,
            vehicle: {
              ...selectedTripDetails.vehicle,
              capacity: (selectedTripDetails.vehicle as { capacity?: number }).capacity || 30,
              year: (selectedTripDetails.vehicle as { year?: number }).year || 2020,
              color: (selectedTripDetails.vehicle as { color?: string }).color || "White"
            },
            driver: {
              ...selectedTripDetails.driver,
              email: (selectedTripDetails.driver as { email?: string }).email || "driver@example.com",
              licenseNumber: (selectedTripDetails.driver as { licenseNumber?: string }).licenseNumber || "N/A",
              profileImage: (selectedTripDetails.driver as { profileImage?: string }).profileImage
            }
          }}
        />
      )}

      {/* Seat Selection Modal */}
      {selectedTrip && (
        <SeatSelectionModal
          isOpen={isSeatSelectionOpen}
          onClose={() => setIsSeatSelectionOpen(false)}
          vehicle={{
            id: selectedTrip.vehicle.make,
            make: selectedTrip.vehicle.make,
            model: selectedTrip.vehicle.model,
            plateNumber: selectedTrip.vehicle.plateNumber,
            capacity: (selectedTrip.vehicle as { capacity?: number }).capacity || selectedTrip.totalSeats || 30,
            layout: {
              rows: Math.ceil(((selectedTrip.vehicle as { capacity?: number }).capacity || selectedTrip.totalSeats || 30) / 4),
              columns: 4,
              totalSeats: (selectedTrip.vehicle as { capacity?: number }).capacity || selectedTrip.totalSeats || 30
            }
          }}
          tripId={selectedTrip.id}
          onSeatsSelected={handleSeatsSelected}
        />
      )}
    </div>
  );
}

export default function TripsPage() {
  return (
    <Suspense fallback={null}>
      <TripsPageContent />
    </Suspense>
  );
}