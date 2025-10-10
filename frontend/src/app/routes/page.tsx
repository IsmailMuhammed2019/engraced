"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BookingModal from "@/components/BookingModal";
import ViewDetailsModal from "@/components/ViewDetailsModal";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Clock, 
  MapPin, 
  Star, 
  ArrowRight,
  Search,
  Filter,
  Bus,
  RefreshCw,
  AlertCircle,
  Loader2
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";

interface Route {
  id: string;
  from: string;
  to: string;
  duration: string;
  distance: string;
  price: string;
  originalPrice?: string;
  rating: number;
  reviews: number;
  features: string[];
  departures: Array<{
    time: string;
    type: string;
    available: boolean;
  }>;
  image: string;
  description: string;
  amenities: string[];
  isActive: boolean;
  createdAt: string;
}

export default function RoutesPage() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [filteredRoutes, setFilteredRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<{
    from: string;
    to: string;
    price: string;
    duration: string;
    departureTime: string;
    date: string;
  } | null>(null);
  const [selectedRouteDetails, setSelectedRouteDetails] = useState<{
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
  } | null>(null);

  useEffect(() => {
    fetchRoutes();
  }, []);

  useEffect(() => {
    filterRoutes();
  }, [routes, searchTerm]);

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
          duration: `${Math.floor(route.duration / 60)}h ${route.duration % 60}m`, // Convert minutes to hours and minutes
          distance: `${route.distance} km`,
          price: `₦${route.basePrice.toLocaleString()}`,
          originalPrice: undefined,
          rating: 4.5 + Math.random() * 0.5, // Mock rating (backend doesn't have ratings yet)
          reviews: Math.floor(Math.random() * 2000) + 100, // Mock reviews
          features: ["Wi-Fi", "Refreshments", "Comfortable Seats"], // Default features
          departures: route.trips?.map((trip: {
            departureTime: string;
            status: string;
          }) => ({
            time: new Date(trip.departureTime).toLocaleTimeString('en-US', { 
              hour: '2-digit', 
              minute: '2-digit',
              hour12: false 
            }),
            type: "Standard",
            available: trip.status === 'ACTIVE'
          })) || [
            { time: "06:00", type: "Express", available: true },
            { time: "12:00", type: "Standard", available: true },
            { time: "18:00", type: "Express", available: false }
          ],
          image: "/cars.jpg",
          description: route.description || `Experience a comfortable journey from ${route.from} to ${route.to} with our premium transport service.`,
          amenities: ["Air Conditioning", "Reclining Seats", "Free Wi-Fi", "Refreshments"],
          isActive: route.isActive,
          createdAt: route.createdAt
        }));
        setRoutes(formattedRoutes);
      } else {
        console.error('Failed to fetch routes');
        setRoutes([]);
      }
    } catch (error) {
      console.error('Error fetching routes:', error);
      setRoutes([]);
    } finally {
      setLoading(false);
    }
  };

  const filterRoutes = () => {
    if (!searchTerm.trim()) {
      setFilteredRoutes(routes);
      return;
    }

    const filtered = routes.filter(route =>
      route.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
      route.to.toLowerCase().includes(searchTerm.toLowerCase()) ||
      route.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredRoutes(filtered);
  };

  const handleBookNow = (route: {
    from: string;
    to: string;
    price: string;
    duration: string;
    departures: Array<{ time: string; type: string; available: boolean }>;
  }) => {
    setSelectedRoute({
      from: route.from,
      to: route.to,
      price: route.price,
      duration: route.duration,
      departureTime: route.departures[0]?.time || "06:00",
      date: new Date().toISOString().split('T')[0]
    });
    setIsBookingModalOpen(true);
  };

  const handleViewDetails = (route: Route) => {
    // Convert the route to match RouteDetails interface
    const routeDetails = {
      id: route.id,
      from: route.from,
      to: route.to,
      duration: route.duration,
      distance: route.distance,
      price: parseFloat(route.price.replace(/[^\d.]/g, '')), // Convert string price to number
      originalPrice: route.originalPrice ? parseFloat(route.originalPrice.replace(/[^\d.]/g, '')) : undefined,
      rating: route.rating,
      reviews: route.reviews,
      features: route.features,
      amenities: route.amenities,
      description: route.description,
      image: route.image,
      departures: route.departures?.map(dep => ({
        time: dep.time,
        type: dep.type,
        available: dep.available
      })) || [
        { time: '06:00', type: 'Express', available: true },
        { time: '10:00', type: 'Standard', available: true },
        { time: '14:00', type: 'Express', available: false },
        { time: '18:00', type: 'Standard', available: true }
      ],
      isActive: route.isActive,
      createdAt: route.createdAt
    };
    setSelectedRouteDetails(routeDetails);
    setIsViewDetailsOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#5d4a15] to-[#6b5618] text-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Routes</h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Discover our comprehensive network of routes connecting major cities across Nigeria with comfort and reliability.
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex-1 flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input 
                  placeholder="Search routes..." 
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
            </div>
            <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600">
                {filteredRoutes.length} routes available
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={fetchRoutes}
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
        </div>
      </section>

      {/* Routes Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="flex justify-center items-center py-16">
              <div className="text-center">
                <Loader2 className="h-12 w-12 animate-spin text-[#5d4a15] mx-auto mb-4" />
                <p className="text-gray-600">Loading routes...</p>
              </div>
            </div>
          ) : filteredRoutes.length === 0 ? (
            <div className="text-center py-16">
              <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No routes found</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm ? "Try adjusting your search terms" : "No routes available at the moment"}
              </p>
              {searchTerm && (
                <Button 
                  variant="outline" 
                  onClick={() => setSearchTerm("")}
                >
                  Clear Search
                </Button>
              )}
            </div>
          ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {filteredRoutes.map((route) => (
              <Card key={route.id} className="overflow-hidden hover:shadow-xl transition-all duration-300">
                {/* Route Image */}
                <div className="relative h-48 bg-gradient-to-r from-[#5d4a15] to-[#6b5618]">
                  <img
                    src={route.image}
                    alt={`${route.from} to ${route.to}`}
                    className="w-full h-full object-cover opacity-30"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white">
                      <div className="flex items-center gap-2 text-xl font-semibold mb-2">
                        <MapPin className="h-5 w-5" />
                        <span>{route.from}</span>
                        <ArrowRight className="h-5 w-5" />
                        <span>{route.to}</span>
                      </div>
                      <div className="text-sm opacity-90">{route.distance} • {route.duration}</div>
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

                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                    {route.description}
                  </p>

                  {/* Pricing */}
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-2xl font-bold text-[#5d4a15]">{route.price}</div>
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
                      {route.departures.slice(0, 3).map((departure, idx) => (
                        <span 
                          key={idx} 
                          className={`text-xs px-2 py-1 rounded ${
                            departure.available 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-500'
                          }`}
                        >
                          {departure.time} ({departure.type})
                        </span>
                      ))}
                      {route.departures.length > 3 && (
                        <span className="text-xs text-gray-500">
                          +{route.departures.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Amenities */}
                  <div className="mb-4">
                    <p className="text-xs text-gray-500 mb-2">Amenities:</p>
                    <div className="flex flex-wrap gap-1">
                      {route.amenities.slice(0, 4).map((amenity, idx) => (
                        <span key={idx} className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {amenity}
                        </span>
                      ))}
                      {route.amenities.length > 4 && (
                        <span className="text-xs text-gray-500">
                          +{route.amenities.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button 
                      className="flex-1 bg-[#5d4a15] hover:bg-[#6b5618] text-white"
                      onClick={() => handleBookNow(route)}
                    >
                      Book Now
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleViewDetails(route)}
                    >
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[#5d4a15] text-white">
        <div className="container mx-auto px-4 text-center">
          <Bus className="h-16 w-16 mx-auto mb-4 text-white/80" />
          <h2 className="text-3xl font-bold mb-4">Can&apos;t Find Your Route?</h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              We&apos;re constantly expanding our network. Contact us to request a new route or get information about upcoming destinations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" className="border-white text-black hover:bg-white hover:text-[#5d4a15]">
              Request New Route
            </Button>
            <Button variant="outline" className="border-white text-black hover:bg-white hover:text-[#5d4a15]">
              Contact Support
            </Button>
          </div>
        </div>
      </section>

      <Footer />

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        routeData={selectedRoute || undefined}
      />

      {/* View Details Modal */}
      <ViewDetailsModal
        isOpen={isViewDetailsOpen}
        onClose={() => setIsViewDetailsOpen(false)}
        type="route"
        data={selectedRouteDetails}
      />
    </div>
  );
}
