"use client";

import { useState, useEffect } from "react";
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
  amenities: string[];
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
  amenities: string[];
  vehicleType: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
}

export default function TripsPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [filteredTrips, setFilteredTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    from: "",
    to: "",
    date: "",
    time: "",
    priceRange: "",
    amenities: [],
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

  useEffect(() => {
    // Check for URL parameters from booking form
    const urlParams = new URLSearchParams(window.location.search);
    const from = urlParams.get('from');
    const to = urlParams.get('to');
    const date = urlParams.get('date');
    const passengers = urlParams.get('passengers');
    const travelClass = urlParams.get('class');

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
  }, []);

  useEffect(() => {
    filterAndSortTrips();
  }, [trips, searchFilters]);

  const fetchTrips = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3003/api/v1/trips');
      
      if (response.ok) {
        const data = await response.json();
        const formattedTrips = data.map((trip: { 
          id: string; 
          route: { from: string; to: string }; 
          driver: { name: string; phone?: string; rating?: number; experience?: string }; 
          vehicle: { 
            plateNumber: string; 
            make?: string; 
            model?: string; 
            features?: string[]; 
            capacity?: number; 
            year?: number; 
            color?: string;
            image?: string;
          }; 
          departureTime: string; 
          arrivalTime?: string;
          price: number; 
          availableSeats: number; 
          totalSeats: number;
          status?: string;
          features?: string[];
          amenities?: string[];
        }) => ({
          id: trip.id,
          route: `${trip.route.from} to ${trip.route.to}`,
          from: trip.route.from,
          to: trip.route.to,
          departureTime: trip.departureTime,
          arrivalTime: trip.arrivalTime || new Date(new Date(trip.departureTime).getTime() + 4 * 60 * 60 * 1000).toISOString(),
          date: new Date(trip.departureTime).toISOString().split('T')[0],
          duration: trip.arrivalTime ? 
            `${Math.floor((new Date(trip.arrivalTime).getTime() - new Date(trip.departureTime).getTime()) / (1000 * 60 * 60))}h ${Math.floor(((new Date(trip.arrivalTime).getTime() - new Date(trip.departureTime).getTime()) % (1000 * 60 * 60)) / (1000 * 60))}m` :
            "4 hours",
          price: trip.price,
          originalPrice: trip.price * 1.2,
          availableSeats: trip.availableSeats || Math.floor(Math.random() * 20) + 1,
          totalSeats: trip.totalSeats || 30,
          vehicle: {
            make: trip.vehicle?.make || "Toyota",
            model: trip.vehicle?.model || "Sienna",
            plateNumber: trip.vehicle?.plateNumber || "ABC123XY",
            features: trip.vehicle?.features || ["AC", "WiFi", "USB Charging"],
            capacity: trip.vehicle?.capacity || 30,
            year: trip.vehicle?.year || 2020,
            color: trip.vehicle?.color || "White",
            image: trip.vehicle?.image || "/sienna.jpeg"
          },
          driver: {
            name: trip.driver?.name || "John Doe",
            phone: trip.driver?.phone || "+2348012345678",
            rating: trip.driver?.rating || 4.5,
            experience: trip.driver?.experience || "5+ years"
          },
          status: trip.status || "ACTIVE",
          features: trip.features || ["Wi-Fi", "Refreshments", "Comfortable Seats"],
          amenities: trip.amenities || ["Air Conditioning", "Reclining Seats", "Free Wi-Fi"],
          rating: 4.5 + Math.random() * 0.5,
          reviews: Math.floor(Math.random() * 2000) + 100,
          vehicleType: "Standard",
          isActive: true,
          createdAt: new Date().toISOString()
        }));
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
      
      // Filter by amenities
      if (searchFilters.amenities.length > 0) {
        const hasAllAmenities = searchFilters.amenities.every(amenity =>
          trip.amenities.some(tripAmenity => 
            tripAmenity.toLowerCase().includes(amenity.toLowerCase())
          )
        );
        if (!hasAllAmenities) return false;
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
    setSelectedTrip(trip);
    setIsBookingModalOpen(true);
  };

  const handleViewDetails = (trip: Trip) => {
    setSelectedTripDetails(trip);
    setIsViewDetailsOpen(true);
  };

  const handleSelectSeats = (trip: Trip) => {
    setSelectedTrip(trip);
    setIsSeatSelectionOpen(true);
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
      amenities: [],
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
            <div className="text-center py-16">
              <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No trips found</h3>
              <p className="text-gray-500 mb-4">
                Try adjusting your search criteria or check back later for new trips.
              </p>
              <Button variant="outline" onClick={clearFilters}>
                Clear Filters
              </Button>
          </div>
          ) : (
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

                      {/* Amenities */}
                      <div>
                        <p className="text-sm text-gray-500 mb-2">Amenities:</p>
                        <div className="flex flex-wrap gap-1">
                          {trip.amenities.map((amenity, index) => (
                            <span key={index} className="text-xs bg-gray-100 px-2 py-1 rounded">
                              {amenity}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <Button
                          className="flex-1 bg-[#5d4a15] hover:bg-[#6b5618]"
                          onClick={() => handleBookNow(trip)}
                        >
                          Book Now
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
                          Select Seats
                        </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
            </div>
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