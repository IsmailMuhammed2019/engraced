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
  Loader2,
  Info,
  Users,
  Calendar,
  CheckCircle
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

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
    tripId?: string;
    availableSeats?: number;
  }>;
  image: string;
  description: string;
  isActive: boolean;
  createdAt: string;
}

export default function RoutesPageContent() {
  const searchParams = useSearchParams();
  const [routes, setRoutes] = useState<Route[]>([]);
  const [filteredRoutes, setFilteredRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [urlSearchApplied, setUrlSearchApplied] = useState(false);
  const [noMatchFound, setNoMatchFound] = useState(false);
  const [searchedRoute, setSearchedRoute] = useState<{from: string, to: string} | null>(null);
  const [popularRoutes, setPopularRoutes] = useState<Route[]>([]);
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

  // Handle URL search parameters on initial load
  useEffect(() => {
    if (routes.length > 0 && !urlSearchApplied) {
      const from = searchParams.get('from');
      const to = searchParams.get('to');
      
      if (from && to) {
        setSearchedRoute({ from, to });
        
        // Try to find exact match
        const exactMatch = routes.filter(route =>
          route.from.toLowerCase() === from.toLowerCase() &&
          route.to.toLowerCase() === to.toLowerCase()
        );
        
        if (exactMatch.length > 0) {
          setFilteredRoutes(exactMatch);
          setNoMatchFound(false);
        } else {
          // No exact match found, show all routes
          setFilteredRoutes(routes);
          setNoMatchFound(true);
        }
        setUrlSearchApplied(true);
      } else {
        setFilteredRoutes(routes);
      }
    }
  }, [routes, searchParams, urlSearchApplied]);

  // Filter routes whenever searchTerm changes (manual search)
  useEffect(() => {
    if (urlSearchApplied) {
      // Manual search overrides URL search
      if (!searchTerm.trim()) {
        // If clearing search and we had a URL search with no match, show all routes
        setFilteredRoutes(routes);
      } else {
        const filtered = routes.filter(route =>
          route.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
          route.to.toLowerCase().includes(searchTerm.toLowerCase()) ||
          route.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredRoutes(filtered);
        setNoMatchFound(filtered.length === 0);
      }
    }
  }, [searchTerm, routes, urlSearchApplied]);

  const fetchRoutes = async () => {
    try {
      setLoading(true);
      
      // Fetch routes with trips included
      const [routesResponse, tripsResponse] = await Promise.all([
        fetch('https://engracedsmile.com/api/v1/routes'),
        fetch('https://engracedsmile.com/api/v1/trips')
      ]);
      
      if (routesResponse.ok) {
        const routesData = await routesResponse.json();
        const tripsData = tripsResponse.ok ? await tripsResponse.json() : [];
        
        const formattedRoutes = routesData.map((route: {
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
          // Get all trips for this route
          const routeTrips = tripsData.filter((trip: any) => trip.routeId === route.id);
          
          // Get active trips with available seats
          const activeTrips = routeTrips.filter((trip: any) => 
            trip.status === 'ACTIVE' && 
            new Date(trip.departureTime) > new Date()
          );
          
          // Calculate rating from actual bookings (0 if no bookings yet)
          const totalBookings = route._count?.bookings || 0;
          const rating = totalBookings > 0 ? parseFloat((4.0 + Math.min(0.9, totalBookings / 1000)).toFixed(1)) : 0;
          
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
            features: activeTrips[0]?.features || [],
            departures: activeTrips.map((trip: any) => ({
              time: new Date(trip.departureTime).toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit',
                hour12: false 
              }),
              type: "Standard",
              available: trip.status === 'ACTIVE',
              tripId: trip.id,
              availableSeats: trip.seats?.filter((s: any) => !s.isBooked).length || 0
            })),
            image: activeTrips[0]?.vehicle?.images?.[0] || "/cars.jpg",
            description: route.description || `Travel from ${route.from} to ${route.to}`,
            isActive: route.isActive,
            createdAt: route.createdAt
          };
        });
        
        setRoutes(formattedRoutes);
        
        // Set popular routes (routes with most bookings)
        const sortedByPopularity = [...formattedRoutes].sort((a, b) => b.reviews - a.reviews);
        setPopularRoutes(sortedByPopularity.slice(0, 6));
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

  const handleBookNow = (route: Route) => {
    // Get the first available trip/departure with seats
    const firstAvailableDeparture = route.departures?.find(dep => 
      dep.available && (dep.availableSeats === undefined || dep.availableSeats > 0)
    );
    
    if (firstAvailableDeparture && firstAvailableDeparture.tripId) {
      // Check if departure has available seats
      if (firstAvailableDeparture.availableSeats === 0) {
        alert('Sorry, this departure is fully booked. Please view route details to select another time.');
        handleViewDetails(route);
        return;
      }
      // Redirect to booking page with tripId
      window.location.href = `/booking?tripId=${firstAvailableDeparture.tripId}`;
    } else if (route.departures && route.departures.length > 0) {
      // Has departures but none available - show details to see all options
      alert('All departures for this route are currently full. Please view details to check other times or dates.');
      handleViewDetails(route);
    } else {
      // No departures at all
      alert('No trips currently scheduled for this route. Please contact us for availability.');
    }
  };

  const handleViewDetails = (route: Route) => {
    // Convert the route to match RouteDetails interface with enhanced data
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
      description: route.description,
      image: route.image,
      departures: route.departures?.map(dep => ({
        time: dep.time,
        type: dep.type,
        available: dep.available,
        tripId: dep.tripId,
        availableSeats: dep.availableSeats,
        vehicle: 'Toyota Sienna', // Can be enhanced from trip data
        driver: undefined // Can be enhanced from trip data
      })) || [],
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
          {/* Enhanced No Match Found Section */}
          {noMatchFound && searchedRoute && (
            <div className="space-y-8 mb-12">
              {/* No Route Found Message */}
              <div className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 rounded-2xl p-8">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-red-100 rounded-full">
                    <AlertCircle className="h-8 w-8 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">
                      No Direct Route Found
                    </h2>
                    <p className="text-lg text-gray-700 mb-2">
                      We don't currently have a direct route from <span className="font-bold text-[#5d4a15]">{searchedRoute.from}</span> to <span className="font-bold text-[#5d4a15]">{searchedRoute.to}</span>.
                    </p>
                    <p className="text-gray-600 mb-6">
                      But don't worry! Check out our available routes below. You might find a connecting route or an alternative destination.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <Button 
                        onClick={() => {
                          setNoMatchFound(false);
                          setSearchedRoute(null);
                          setUrlSearchApplied(false);
                          window.history.pushState({}, '', '/routes');
                        }}
                        className="bg-[#5d4a15] hover:bg-[#6b5618] text-white"
                      >
                        <Search className="h-4 w-4 mr-2" />
                        Browse All Routes
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => window.location.href = '/contact'}
                        className="border-[#5d4a15] text-[#5d4a15] hover:bg-[#5d4a15]/5"
                      >
                        <MapPin className="h-4 w-4 mr-2" />
                        Request This Route
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Popular Routes Section */}
              {popularRoutes.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Star className="h-6 w-6 text-yellow-500 fill-yellow-500" />
                        Popular Routes
                      </h2>
                      <p className="text-gray-600 mt-1">Most booked routes by our customers</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {popularRoutes.map((route) => (
                      <Card key={route.id} className="hover:shadow-lg transition-all duration-300 border-2 hover:border-[#5d4a15]">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                              <div className="w-10 h-10 bg-[#5d4a15]/10 rounded-lg flex items-center justify-center">
                                <Bus className="h-5 w-5 text-[#5d4a15]" />
                              </div>
                              <div>
                                <h3 className="font-bold text-gray-900">{route.from}</h3>
                                <ArrowRight className="h-4 w-4 text-gray-400 my-1" />
                                <p className="font-bold text-gray-900">{route.to}</p>
                              </div>
                            </div>
                            <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
                              <Star className="h-3 w-3 mr-1 fill-yellow-500" />
                              {route.rating}
                            </Badge>
                          </div>
                          <div className="space-y-2 mb-4">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">Duration</span>
                              <span className="font-semibold text-gray-900">{route.duration}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">Price</span>
                              <span className="font-bold text-[#5d4a15] text-lg">{route.price}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">Bookings</span>
                              <span className="font-semibold text-gray-900">{route.reviews}</span>
                            </div>
                          </div>
                          <Button 
                            onClick={() => handleBookNow(route)}
                            className={`w-full ${
                              route.departures.length === 0 || route.departures.filter(d => d.available && (d.availableSeats === undefined || d.availableSeats > 0)).length === 0
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed hover:bg-gray-300'
                                : 'bg-[#5d4a15] hover:bg-[#6b5618] text-white'
                            }`}
                            disabled={route.departures.length === 0 || route.departures.filter(d => d.available && (d.availableSeats === undefined || d.availableSeats > 0)).length === 0}
                          >
                            {route.departures.length === 0 
                              ? 'No Trips' 
                              : route.departures.filter(d => d.available && (d.availableSeats === undefined || d.availableSeats > 0)).length === 0
                              ? 'Fully Booked'
                              : 'Book Now'
                            }
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Divider */}
              <div className="border-t-2 border-dashed border-gray-300 my-8"></div>
            </div>
          )}
          
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
              <h3 className="text-lg font-medium text-gray-900 mb-2">No routes available</h3>
              <p className="text-gray-500 mb-4">
                There are currently no routes available. Please check back later or contact us for assistance.
              </p>
              <Button 
                variant="outline" 
                onClick={() => window.location.href = '/contact'}
              >
                Contact Support
              </Button>
            </div>
          ) : (
          <>
            {/* Section Header */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {noMatchFound ? 'All Available Routes' : searchTerm ? 'Search Results' : 'All Routes'}
              </h2>
              <p className="text-gray-600">
                {noMatchFound 
                  ? `Showing ${filteredRoutes.length} available routes. Select a route to view departure times and book your trip.`
                  : `Browse our ${filteredRoutes.length} available routes and book your next journey.`
                }
              </p>
            </div>

            {/* Routes Grid */}
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
                      <p className="text-sm opacity-90">{route.distance}</p>
                    </div>
                  </div>
                </div>

                <CardContent className="p-6">
                  {/* Header with Route and Price */}
                  <div className="flex justify-between items-start mb-4 pb-4 border-b border-gray-200">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {route.from} → {route.to}
                      </h3>
                      <p className="text-sm text-gray-600 leading-relaxed">{route.description}</p>
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-sm text-gray-500 mb-1">Starting from</div>
                      <div className="text-3xl font-bold text-[#5d4a15]">{route.price}</div>
                      {route.originalPrice && (
                        <div className="text-sm text-gray-400 line-through">{route.originalPrice}</div>
                      )}
                    </div>
                  </div>

                  {/* Route Stats */}
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <Clock className="h-5 w-5 mx-auto mb-1 text-blue-600" />
                      <div className="text-xs text-gray-600">Duration</div>
                      <div className="font-bold text-sm text-gray-900">{route.duration}</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <Bus className="h-5 w-5 mx-auto mb-1 text-green-600" />
                      <div className="text-xs text-gray-600">Departures</div>
                      <div className="font-bold text-sm text-gray-900">{route.departures.length} trips</div>
                    </div>
                    {route.rating > 0 && (
                      <div className="text-center p-3 bg-yellow-50 rounded-lg">
                        <Star className="h-5 w-5 mx-auto mb-1 text-yellow-500 fill-yellow-500" />
                        <div className="text-xs text-gray-600">Rating</div>
                        <div className="font-bold text-sm text-gray-900">{route.rating}/5.0</div>
                      </div>
                    )}
                  </div>

                  {/* Available Seat Summary */}
                  {route.departures.length > 0 && (
                    <div className="mb-4 p-3 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-medium text-gray-700">
                            {route.departures.reduce((sum, dep) => sum + (dep.availableSeats || 0), 0)} seats available today
                          </span>
                        </div>
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          {route.departures.filter(d => d.available).length} active trips
                        </Badge>
                      </div>
                    </div>
                  )}

                  {/* Features */}
                  {route.features && route.features.length > 0 && (
                    <div className="mb-4">
                      <div className="text-xs text-gray-600 mb-2 font-semibold">Included Features:</div>
                      <div className="flex flex-wrap gap-2">
                        {route.features.slice(0, 4).map((feature, index) => (
                          <Badge key={index} variant="outline" className="text-xs bg-white">
                            <CheckCircle className="h-3 w-3 mr-1 inline text-green-600" />
                            {feature}
                          </Badge>
                        ))}
                        {route.features.length > 4 && (
                          <Badge variant="outline" className="text-xs bg-white">
                            +{route.features.length - 4} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Popular Departures */}
                  {route.departures.length > 0 && (
                    <div className="mb-4">
                      <div className="text-xs text-gray-600 mb-2 font-semibold">Popular Departures:</div>
                      <div className="flex flex-wrap gap-2">
                        {route.departures.slice(0, 4).map((departure, idx) => (
                          <div 
                            key={idx} 
                            className={`text-xs px-3 py-2 rounded-lg font-medium ${
                              departure.available 
                                ? 'bg-green-100 text-green-800 border border-green-300' 
                                : 'bg-gray-100 text-gray-500 border border-gray-300'
                            }`}
                          >
                            <Clock className="h-3 w-3 inline mr-1" />
                            {departure.time}
                            {departure.availableSeats !== undefined && departure.available && (
                              <span className="ml-1">({departure.availableSeats} seats)</span>
                            )}
                          </div>
                        ))}
                        {route.departures.length > 4 && (
                          <span className="text-xs text-gray-500 px-2 py-2">
                            +{route.departures.length - 4} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-3">
                    <Button 
                      onClick={() => handleViewDetails(route)}
                      variant="outline" 
                      className="flex-1 border-[#5d4a15] text-[#5d4a15] hover:bg-[#5d4a15]/5"
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      View Schedule
                    </Button>
                    <Button 
                      onClick={() => handleBookNow(route)}
                      className={`flex-1 shadow-lg ${
                        route.departures.length === 0 || route.departures.filter(d => d.available && (d.availableSeats === undefined || d.availableSeats > 0)).length === 0
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed hover:bg-gray-300'
                          : 'bg-[#5d4a15] hover:bg-[#6b5618] text-white'
                      }`}
                      disabled={route.departures.length === 0 || route.departures.filter(d => d.available && (d.availableSeats === undefined || d.availableSeats > 0)).length === 0}
                    >
                      {route.departures.length === 0 ? (
                        'No Trips'
                      ) : route.departures.filter(d => d.available && (d.availableSeats === undefined || d.availableSeats > 0)).length === 0 ? (
                        'Fully Booked'
                      ) : (
                        <>
                          <Bus className="h-4 w-4 mr-2" />
                          Book Now
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            </div>
          </>
          )}
        </div>
      </section>

      {/* Popular Routes Section (shown when not searching) */}
      {!noMatchFound && !searchTerm && popularRoutes.length > 0 && (
        <section className="py-16 bg-gradient-to-br from-[#5d4a15]/5 to-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-4">
                <Star className="h-8 w-8 text-yellow-500 fill-yellow-500" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                Most Popular Routes
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Join thousands of satisfied travelers on our most loved routes. These destinations are booked frequently for their reliability and comfort.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {popularRoutes.map((route, index) => (
                <Card key={route.id} className="hover:shadow-xl transition-all duration-300 border-2 hover:border-[#5d4a15] relative overflow-hidden">
                  {/* Popularity Badge */}
                  {index < 3 && (
                    <div className="absolute top-4 right-4 z-10">
                      <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0 shadow-lg">
                        #{index + 1} Popular
                      </Badge>
                    </div>
                  )}
                  
                  {/* Route Image */}
                  <div className="relative h-32 bg-gradient-to-r from-[#5d4a15] to-[#6b5618]">
                    <img
                      src={route.image}
                      alt={`${route.from} to ${route.to}`}
                      className="w-full h-full object-cover opacity-40"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center text-white">
                        <div className="flex items-center gap-2 text-lg font-bold">
                          <span>{route.from}</span>
                          <ArrowRight className="h-5 w-5" />
                          <span>{route.to}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <CardContent className="p-6">
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock className="h-4 w-4" />
                          <span>{route.duration}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-semibold text-gray-900">{route.rating}</span>
                          <span className="text-xs text-gray-500">({route.reviews} reviews)</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between py-3 border-t border-b border-gray-100">
                        <span className="text-sm text-gray-600">Starting from</span>
                        <span className="text-2xl font-bold text-[#5d4a15]">{route.price}</span>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Available Departures</span>
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          {route.departures.length} trips
                        </Badge>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        onClick={() => handleViewDetails(route)}
                        variant="outline"
                        className="flex-1"
                      >
                        Details
                      </Button>
                      <Button 
                        onClick={() => handleBookNow(route)}
                        className={`flex-1 ${
                          route.departures.length === 0 || route.departures.filter(d => d.available && (d.availableSeats === undefined || d.availableSeats > 0)).length === 0
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed hover:bg-gray-300'
                            : 'bg-[#5d4a15] hover:bg-[#6b5618] text-white'
                        }`}
                        disabled={route.departures.length === 0 || route.departures.filter(d => d.available && (d.availableSeats === undefined || d.availableSeats > 0)).length === 0}
                      >
                        {route.departures.length === 0
                          ? 'No Trips'
                          : route.departures.filter(d => d.available && (d.availableSeats === undefined || d.availableSeats > 0)).length === 0
                          ? 'Fully Booked'
                          : 'Book Now'
                        }
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mt-12">
              <Button 
                variant="outline"
                size="lg"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="border-[#5d4a15] text-[#5d4a15] hover:bg-[#5d4a15]/5"
              >
                View All {routes.length} Routes
              </Button>
            </div>
          </div>
        </section>
      )}

      <Footer />

      {/* Modals */}
      <BookingModal 
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        routeData={selectedRoute || undefined}
      />

      {selectedRouteDetails && (
        <ViewDetailsModal
          isOpen={isViewDetailsOpen}
          onClose={() => setIsViewDetailsOpen(false)}
          type="route"
          data={selectedRouteDetails}
        />
      )}
    </div>
  );
}

