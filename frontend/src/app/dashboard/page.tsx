"use client";

import { useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Filter
} from "lucide-react";

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("bookings");

  // Mock bookings data
  const bookings = [
    {
      id: "BK001",
      route: "Lagos to Abuja",
      date: "2024-01-15",
      time: "08:00 AM",
      status: "confirmed",
      price: "₦15,000",
      seat: "A12"
    },
    {
      id: "BK002", 
      route: "Lagos to Port Harcourt",
      date: "2024-01-20",
      time: "02:00 PM",
      status: "pending",
      price: "₦12,500",
      seat: "B05"
    },
    {
      id: "BK003",
      route: "Abuja to Kano",
      date: "2024-01-25",
      time: "10:00 AM",
      status: "completed",
      price: "₦8,500",
      seat: "C08"
    }
  ];

  // Mock shipments data
  const shipments = [
    {
      id: "SH001",
      description: "Electronics Package",
      from: "Lagos",
      to: "Abuja",
      status: "in-transit",
      estimatedDelivery: "2024-01-18",
      trackingNumber: "TRK123456789"
    },
    {
      id: "SH002",
      description: "Documents",
      from: "Abuja", 
      to: "Kano",
      status: "delivered",
      estimatedDelivery: "2024-01-12",
      trackingNumber: "TRK987654321"
    },
    {
      id: "SH003",
      description: "Clothing Items",
      from: "Lagos",
      to: "Port Harcourt", 
      status: "processing",
      estimatedDelivery: "2024-01-22",
      trackingNumber: "TRK456789123"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
      case "delivered":
        return "bg-green-100 text-green-800";
      case "pending":
      case "processing":
        return "bg-yellow-100 text-yellow-800";
      case "in-transit":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
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
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-[#5d4a15] rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Welcome, {user?.firstName} {user?.lastName}</h1>
                <p className="text-sm text-gray-600">Manage your bookings and shipments</p>
              </div>
            </div>
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile Information
            </CardTitle>
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
                  Edit Profile
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="bookings" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              My Bookings
            </TabsTrigger>
            <TabsTrigger value="shipments" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              My Shipments
            </TabsTrigger>
          </TabsList>

          {/* Bookings Tab */}
          <TabsContent value="bookings" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">My Bookings</h2>
              <Button className="bg-[#5d4a15] hover:bg-[#6b5618]">
                <Plus className="h-4 w-4 mr-2" />
                New Booking
              </Button>
            </div>

            <div className="grid gap-6">
              {bookings.map((booking) => (
                <Card key={booking.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold text-lg">{booking.route}</h3>
                        <p className="text-sm text-gray-600">Booking ID: {booking.id}</p>
                      </div>
                      <Badge className={getStatusColor(booking.status)}>
                        <span className="flex items-center gap-1">
                          {getStatusIcon(booking.status)}
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Date</p>
                        <p className="font-medium">{booking.date}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Time</p>
                        <p className="font-medium">{booking.time}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Seat</p>
                        <p className="font-medium">{booking.seat}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Price</p>
                        <p className="font-medium text-[#5d4a15]">{booking.price}</p>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                      {booking.status === "confirmed" && (
                        <Button variant="outline" size="sm" className="text-red-600 border-red-600 hover:bg-red-50">
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
              <Button className="bg-[#5d4a15] hover:bg-[#6b5618]">
                <Plus className="h-4 w-4 mr-2" />
                New Shipment
              </Button>
            </div>

            <div className="grid gap-6">
              {shipments.map((shipment) => (
                <Card key={shipment.id} className="hover:shadow-lg transition-shadow">
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
                        <p className="text-gray-500">From</p>
                        <p className="font-medium">{shipment.from}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">To</p>
                        <p className="font-medium">{shipment.to}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Estimated Delivery</p>
                        <p className="font-medium">{shipment.estimatedDelivery}</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Track Package
                      </Button>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
    </ProtectedRoute>
  );
}
