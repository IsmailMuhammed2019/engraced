"use client";

import { useState, useEffect } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search,
  Filter,
  Download,
  Eye,
  Navigation,
  Clock,
  CheckCircle,
  AlertCircle,
  Truck,
  Calendar,
  MapPin,
  User,
  Phone,
  Mail,
  CreditCard,
  Star,
  RefreshCw,
  Bell,
  BellRing,
  ArrowLeft,
  ArrowRight,
  Plus,
  Edit,
  Trash2,
  Share2,
  QrCode,
  Timer,
  Shield,
  Award
} from "lucide-react";

interface Booking {
  id: string;
  route: string;
  from: string;
  to: string;
  date: string;
  time: string;
  status: "confirmed" | "pending" | "completed" | "cancelled" | "in-progress";
  price: string;
  seat: string;
  driver?: {
    name: string;
    phone: string;
    rating: number;
    experience: number;
  };
  vehicle?: {
    make: string;
    model: string;
    plateNumber: string;
    features: string[];
  };
  trackingNumber?: string;
  estimatedArrival?: string;
  actualDeparture?: string;
  actualArrival?: string;
  createdAt: string;
  paymentStatus: "paid" | "pending" | "failed";
  paymentMethod?: string;
  specialRequests?: string;
  emergencyContact?: {
    name: string;
    phone: string;
  };
}

interface TripStatus {
  status: string;
  location: string;
  timestamp: string;
  description: string;
  icon: string;
}

export default function BookingsPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [tripStatus, setTripStatus] = useState<TripStatus[]>([]);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('https://engracedsmile.com/api/v1/bookings/user', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setBookings(data);
      } else {
        console.error('Failed to fetch bookings');
        setBookings([]);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "in-progress":
        return "bg-blue-100 text-blue-800 border-blue-200";
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
      case "confirmed":
        return <CheckCircle className="h-4 w-4" />;
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "in-progress":
        return <Truck className="h-4 w-4" />;
      case "completed":
        return <CheckCircle className="h-4 w-4" />;
      case "cancelled":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.route.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || booking.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleViewDetails = (booking: Booking) => {
    setSelectedBooking(booking);
    setTripStatus([]);
  };

  const handleTrackTrip = (booking: Booking) => {
    setSelectedBooking(booking);
    setTripStatus([]);
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5d4a15] mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your bookings...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
                <p className="text-gray-600 mt-1">Manage and track your travel bookings</p>
              </div>
              <Button className="bg-[#5d4a15] hover:bg-[#6b5618]">
                <Plus className="h-4 w-4 mr-2" />
                New Booking
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Filters and Search */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search bookings by route or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#5d4a15] focus:border-[#5d4a15]"
            >
              <option value="all">All Status</option>
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Bookings</p>
                    <p className="text-2xl font-bold">{bookings.length}</p>
                  </div>
                  <Calendar className="h-8 w-8 text-[#5d4a15]" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Active Trips</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {bookings.filter(b => b.status === "in-progress").length}
                    </p>
                  </div>
                  <Truck className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Completed</p>
                    <p className="text-2xl font-bold text-green-600">
                      {bookings.filter(b => b.status === "completed").length}
                    </p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Spent</p>
                    <p className="text-2xl font-bold text-[#5d4a15]">
                      ₦{bookings.reduce((sum, b) => sum + parseInt(b.price.replace(/[₦,]/g, "")), 0).toLocaleString()}
                    </p>
                  </div>
                  <CreditCard className="h-8 w-8 text-[#5d4a15]" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Bookings List */}
          <div className="space-y-6">
            {filteredBookings.map((booking) => (
              <Card key={booking.id} className="hover:shadow-lg transition-all duration-200">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">{booking.route}</h3>
                      <p className="text-sm text-gray-600">Booking ID: {booking.id}</p>
                      {booking.trackingNumber && (
                        <p className="text-sm text-gray-600">Tracking: {booking.trackingNumber}</p>
                      )}
                    </div>
                    <Badge className={getStatusColor(booking.status)}>
                      <span className="flex items-center gap-1">
                        {getStatusIcon(booking.status)}
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm mb-4">
                    <div>
                      <p className="text-gray-500">Date & Time</p>
                      <p className="font-medium">{booking.date} at {booking.time}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Seat</p>
                      <p className="font-medium">{booking.seat}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Price</p>
                      <p className="font-medium text-[#5d4a15]">{booking.price}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Driver</p>
                      <p className="font-medium">{booking.driver?.name || "TBD"}</p>
                    </div>
                  </div>

                  {booking.driver && (
                    <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-[#5d4a15] rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <p className="font-medium">{booking.driver.name}</p>
                            <div className="flex items-center space-x-2">
                              <div className="flex items-center">
                                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                <span className="text-sm ml-1">{booking.driver.rating}</span>
                              </div>
                              <span className="text-sm text-gray-500">
                                {booking.driver.experience} years experience
                              </span>
                            </div>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          <Phone className="h-4 w-4 mr-1" />
                          Call Driver
                        </Button>
                      </div>
                    </div>
                  )}

                  {booking.vehicle && (
                    <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{booking.vehicle.make} {booking.vehicle.model}</p>
                          <p className="text-sm text-gray-600">Plate: {booking.vehicle.plateNumber}</p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {booking.vehicle.features.map((feature, index) => (
                              <span key={index} className="text-xs bg-[#5d4a15] text-white px-2 py-1 rounded">
                                {feature}
                              </span>
                            ))}
                          </div>
                        </div>
                        <Truck className="h-8 w-8 text-gray-400" />
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleViewDetails(booking)}>
                      <Eye className="h-4 w-4 mr-1" />
                      View Details
                    </Button>
                    {booking.status === "in-progress" && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="bg-blue-50 text-blue-700 border-blue-200"
                        onClick={() => handleTrackTrip(booking)}
                      >
                        <Navigation className="h-4 w-4 mr-1" />
                        Track Trip
                      </Button>
                    )}
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-1" />
                      Download Ticket
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share2 className="h-4 w-4 mr-1" />
                      Share
                    </Button>
                    {booking.status === "confirmed" && (
                      <Button variant="outline" size="sm" className="text-red-600 border-red-600 hover:bg-red-50">
                        <Trash2 className="h-4 w-4 mr-1" />
                        Cancel
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredBookings.length === 0 && (
            <Card className="text-center py-12">
              <CardContent>
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
                <p className="text-gray-500 mb-4">
                  {searchTerm ? "Try adjusting your search terms" : "You haven't made any bookings yet"}
                </p>
                <Button className="bg-[#5d4a15] hover:bg-[#6b5618]">
                  <Plus className="h-4 w-4 mr-2" />
                  Make Your First Booking
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Booking Details Modal */}
        {selectedBooking && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Booking Details - {selectedBooking.id}</CardTitle>
                  <Button variant="ghost" onClick={() => setSelectedBooking(null)}>
                    ×
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Trip Information */}
                <div>
                  <h3 className="font-semibold mb-3">Trip Information</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Route</p>
                      <p className="font-medium">{selectedBooking.route}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Date & Time</p>
                      <p className="font-medium">{selectedBooking.date} at {selectedBooking.time}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Seat</p>
                      <p className="font-medium">{selectedBooking.seat}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Price</p>
                      <p className="font-medium text-[#5d4a15]">{selectedBooking.price}</p>
                    </div>
                  </div>
                </div>

                {/* Trip Status Timeline */}
                {tripStatus.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-3">Trip Status</h3>
                    <div className="space-y-4">
                      {tripStatus.map((status, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <div className="flex-shrink-0 w-8 h-8 bg-[#5d4a15] rounded-full flex items-center justify-center">
                            {status.icon === "truck" && <Truck className="h-4 w-4 text-white" />}
                            {status.icon === "navigation" && <Navigation className="h-4 w-4 text-white" />}
                            {status.icon === "check-circle" && <CheckCircle className="h-4 w-4 text-white" />}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{status.description}</p>
                            <p className="text-sm text-gray-600">{status.location}</p>
                            <p className="text-xs text-gray-500">{status.timestamp}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Emergency Contact */}
                {selectedBooking.emergencyContact && (
                  <div>
                    <h3 className="font-semibold mb-3">Emergency Contact</h3>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="font-medium">{selectedBooking.emergencyContact.name}</p>
                      <p className="text-sm text-gray-600">{selectedBooking.emergencyContact.phone}</p>
                    </div>
                  </div>
                )}

                {/* Special Requests */}
                {selectedBooking.specialRequests && (
                  <div>
                    <h3 className="font-semibold mb-3">Special Requests</h3>
                    <p className="text-sm text-gray-600">{selectedBooking.specialRequests}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}