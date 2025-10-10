"use client";

import { useState, useEffect } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { 
  User, 
  Package, 
  MapPin, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Truck, 
  Calendar,
  Phone,
  Mail,
  LogOut,
  Plus,
  Search,
  Filter,
  Star,
  TrendingUp,
  CreditCard,
  Bell,
  Settings,
  Download,
  Eye,
  Edit,
  Trash2,
  RefreshCw,
  Award,
  Gift,
  HelpCircle,
  MessageCircle,
  BellRing,
  Navigation,
  Timer,
  Shield,
  Heart
} from "lucide-react";
// Removed admin components - customer dashboard should be customer-focused

interface Booking {
  id: string;
  route: string;
  date: string;
  time: string;
  status: "confirmed" | "pending" | "completed" | "cancelled";
  price: string;
  seat: string;
  driver?: string;
  vehicle?: string;
  trackingNumber?: string;
  createdAt: string;
}

interface Shipment {
  id: string;
  description: string;
  from: string;
  to: string;
  status: "processing" | "in-transit" | "delivered" | "cancelled";
  estimatedDelivery: string;
  trackingNumber: string;
  weight?: string;
  dimensions?: string;
  value?: string;
  createdAt: string;
}

interface UserStats {
  totalBookings: number;
  totalSpent: number;
  loyaltyPoints: number;
  upcomingTrips: number;
  completedTrips: number;
  averageRating: number;
}

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [userStats, setUserStats] = useState<UserStats>({
    totalBookings: 0,
    totalSpent: 0,
    loyaltyPoints: 0,
    upcomingTrips: 0,
    completedTrips: 0,
    averageRating: 0
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  // Removed admin-specific state

  // Fetch user data
  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // Fetch bookings
      const bookingsResponse = await fetch('https://engracedsmile.com/api/v1/bookings/user', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (bookingsResponse.ok) {
        const bookingsData = await bookingsResponse.json();
        setBookings(bookingsData);
      } else {
        console.error('Failed to fetch bookings');
        setBookings([]);
      }

      // Fetch shipments
      const shipmentsResponse = await fetch('https://engracedsmile.com/api/v1/shipments/user', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (shipmentsResponse.ok) {
        const shipmentsData = await shipmentsResponse.json();
        setShipments(shipmentsData);
      } else {
        console.error('Failed to fetch shipments');
        setShipments([]);
      }

      // Calculate stats
      calculateUserStats();
    } catch (error) {
      console.error('Error fetching user data:', error);
      setBookings([]);
      setShipments([]);
      calculateUserStats();
    } finally {
      setLoading(false);
    }
  };

  const calculateUserStats = () => {
    const totalBookings = bookings.length;
    const totalSpent = bookings.reduce((sum, booking) => 
      sum + parseInt(booking.price.replace(/[₦,]/g, "")), 0
    );
    const loyaltyPoints = Math.floor(totalSpent / 1000) * 10; // 10 points per ₦1000
    const upcomingTrips = bookings.filter(b => 
      b.status === "confirmed" || b.status === "pending"
    ).length;
    const completedTrips = bookings.filter(b => b.status === "completed").length;
    const averageRating = 4.8; // Mock rating

    setUserStats({
      totalBookings,
      totalSpent,
      loyaltyPoints,
      upcomingTrips,
      completedTrips,
      averageRating
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
      case "processing":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "in-transit":
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
      case "delivered":
        return <CheckCircle className="h-4 w-4" />;
      case "pending":
      case "processing":
        return <Clock className="h-4 w-4" />;
      case "in-transit":
        return <Truck className="h-4 w-4" />;
      case "completed":
        return <CheckCircle className="h-4 w-4" />;
      case "cancelled":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const filteredBookings = bookings.filter(booking =>
    booking.route.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredShipments = shipments.filter(shipment =>
    shipment.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shipment.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5d4a15] mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your dashboard...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Enhanced Header */}
        <div className="bg-white shadow-sm border-b sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-[#5d4a15] to-[#6b5618] rounded-full flex items-center justify-center shadow-lg">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">
                    Welcome back, {user?.firstName} {user?.lastName}
                  </h1>
                  <p className="text-sm text-gray-600">Manage your travel and logistics</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="relative"
                  onClick={() => {/* Contact support functionality */}}
                >
                  <MessageCircle className="h-5 w-5" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="relative"
                  onClick={() => setIsNotificationOpen(true)}
                >
                  <Bell className="h-5 w-5" />
                  {0 > 0 && (
                    <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
                  )}
                </Button>
                <Button variant="ghost" size="sm">
                  <Settings className="h-5 w-5" />
                </Button>
                <Button 
                  variant="outline" 
                  className="text-red-600 border-red-600 hover:bg-red-50"
                  onClick={logout}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-to-r from-[#5d4a15] to-[#6b5618] text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-90">Total Bookings</p>
                    <p className="text-2xl font-bold">{userStats.totalBookings}</p>
                  </div>
                  <Calendar className="h-8 w-8 opacity-80" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Spent</p>
                    <p className="text-2xl font-bold text-[#5d4a15]">
                      ₦{userStats.totalSpent.toLocaleString()}
                    </p>
                  </div>
                  <CreditCard className="h-8 w-8 text-gray-400" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Loyalty Points</p>
                    <p className="text-2xl font-bold text-[#5d4a15]">{userStats.loyaltyPoints}</p>
                  </div>
                  <Award className="h-8 w-8 text-gray-400" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Upcoming Trips</p>
                    <p className="text-2xl font-bold text-[#5d4a15]">{userStats.upcomingTrips}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-gray-400" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button className="h-20 flex flex-col items-center justify-center space-y-2 bg-[#5d4a15] hover:bg-[#6b5618]">
                  <Calendar className="h-6 w-6" />
                  <span>Book Trip</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                  <Package className="h-6 w-6" />
                  <span>Send Package</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                  <Navigation className="h-6 w-6" />
                  <span>Track Trip</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                  <HelpCircle className="h-6 w-6" />
                  <span>Get Help</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Main Content */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="bookings" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                My Bookings
              </TabsTrigger>
              <TabsTrigger value="shipments" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                My Shipments
              </TabsTrigger>
              <TabsTrigger value="loyalty" className="flex items-center gap-2">
                <Award className="h-4 w-4" />
                Loyalty
              </TabsTrigger>
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Profile
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Bookings */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Recent Bookings
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {bookings.slice(0, 3).map((booking) => (
                        <div key={booking.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium">{booking.route}</p>
                            <p className="text-sm text-gray-600">{booking.date} at {booking.time}</p>
                          </div>
                          <Badge className={getStatusColor(booking.status)}>
                            {booking.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                    <Button variant="outline" className="w-full mt-4">
                      View All Bookings
                    </Button>
                  </CardContent>
                </Card>

                {/* Recent Shipments */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="h-5 w-5" />
                      Recent Shipments
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {shipments.slice(0, 3).map((shipment) => (
                        <div key={shipment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium">{shipment.description}</p>
                            <p className="text-sm text-gray-600">{shipment.from} → {shipment.to}</p>
                          </div>
                          <Badge className={getStatusColor(shipment.status)}>
                            {shipment.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                    <Button variant="outline" className="w-full mt-4">
                      View All Shipments
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Bookings Tab */}
            <TabsContent value="bookings" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">My Bookings</h2>
                <div className="flex gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search bookings..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                  <Button className="bg-[#5d4a15] hover:bg-[#6b5618]">
                    <Plus className="h-4 w-4 mr-2" />
                    New Booking
                  </Button>
                </div>
              </div>

              <div className="grid gap-6">
                {filteredBookings.map((booking) => (
                  <Card key={booking.id} className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-[#5d4a15]">
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
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
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
                          <p className="font-medium">{booking.driver || "TBD"}</p>
                        </div>
                      </div>

                      {booking.vehicle && (
                        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-600">Vehicle: {booking.vehicle}</p>
                        </div>
                      )}

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          View Details
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-1" />
                          Download Ticket
                        </Button>
                        {booking.status === "confirmed" && (
                          <Button variant="outline" size="sm" className="text-red-600 border-red-600 hover:bg-red-50">
                            <Trash2 className="h-4 w-4 mr-1" />
                            Cancel Booking
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Shipments Tab */}
            <TabsContent value="shipments" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">My Shipments</h2>
                <div className="flex gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search shipments..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                  <Button className="bg-[#5d4a15] hover:bg-[#6b5618]">
                    <Plus className="h-4 w-4 mr-2" />
                    New Shipment
                  </Button>
                </div>
              </div>

              <div className="grid gap-6">
                {filteredShipments.map((shipment) => (
                  <Card key={shipment.id} className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-blue-500">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-semibold text-lg">{shipment.description}</h3>
                          <p className="text-sm text-gray-600">Tracking: {shipment.trackingNumber}</p>
                        </div>
                        <Badge className={getStatusColor(shipment.status)}>
                          <span className="flex items-center gap-1">
                            {getStatusIcon(shipment.status)}
                            {shipment.status.charAt(0).toUpperCase() + shipment.status.slice(1)}
                          </span>
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-4">
                        <div>
                          <p className="text-gray-500">Route</p>
                          <p className="font-medium">{shipment.from} → {shipment.to}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Estimated Delivery</p>
                          <p className="font-medium">{shipment.estimatedDelivery}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Value</p>
                          <p className="font-medium">{shipment.value}</p>
                        </div>
                      </div>

                      {(shipment.weight || shipment.dimensions) && (
                        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            {shipment.weight && (
                              <div>
                                <p className="text-gray-600">Weight: {shipment.weight}</p>
                              </div>
                            )}
                            {shipment.dimensions && (
                              <div>
                                <p className="text-gray-600">Dimensions: {shipment.dimensions}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Navigation className="h-4 w-4 mr-1" />
                          Track Package
                        </Button>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          View Details
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-1" />
                          Download Receipt
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Profile Information
                  </CardTitle>
                  <CardDescription>Manage your personal information and preferences</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Mail className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">{user?.email}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">{user?.phone || 'Not provided'}</span>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">{user?.address || 'Not provided'}</span>
                      </div>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Profile
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Loyalty & Rewards */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Loyalty & Rewards
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-gradient-to-r from-[#5d4a15] to-[#6b5618] text-white rounded-lg">
                      <Award className="h-8 w-8 mx-auto mb-2" />
                      <p className="text-2xl font-bold">{userStats.loyaltyPoints}</p>
                      <p className="text-sm opacity-90">Loyalty Points</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <Gift className="h-8 w-8 mx-auto mb-2 text-[#5d4a15]" />
                      <p className="text-2xl font-bold text-[#5d4a15]">2</p>
                      <p className="text-sm text-gray-600">Available Rewards</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <Star className="h-8 w-8 mx-auto mb-2 text-[#5d4a15]" />
                      <p className="text-2xl font-bold text-[#5d4a15]">{userStats.averageRating}</p>
                      <p className="text-sm text-gray-600">Average Rating</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Customer dashboard - no admin components */}
    </ProtectedRoute>
  );
}