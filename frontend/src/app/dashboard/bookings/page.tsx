"use client";

import { useState, useEffect } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import CustomerDashboardLayout from "@/components/CustomerDashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Calendar, MapPin, Clock, CheckCircle, AlertCircle, Search, Download, Eye, Filter
} from "lucide-react";

interface Booking {
  id: string;
  bookingNumber: string;
  route: { from: string; to: string; };
  trip: { departureTime: string; arrivalTime: string; };
  status: string;
  totalAmount: number;
  seatNumbers: string[];
  createdAt: string;
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('https://engracedsmile.com/api/v1/bookings/my-bookings', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        setBookings(await response.json());
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case "CONFIRMED": return "bg-green-100 text-green-800";
      case "PENDING": return "bg-yellow-100 text-yellow-800";
      case "COMPLETED": return "bg-blue-100 text-blue-800";
      case "CANCELLED": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const filtered = bookings.filter(b =>
    b.route.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.route.to.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.bookingNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ProtectedRoute>
      <CustomerDashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
              <p className="text-gray-600">View and manage all your travel bookings</p>
            </div>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>All Bookings ({bookings.length})</CardTitle>
                <div className="flex gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search bookings..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5d4a15] mx-auto"></div>
                </div>
              ) : filtered.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Calendar className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <p>No bookings found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filtered.map((booking) => (
                    <Card key={booking.id} className="border-l-4 border-l-[#5d4a15]">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="font-semibold text-lg flex items-center gap-2">
                              <MapPin className="h-5 w-5 text-[#5d4a15]" />
                              {booking.route.from} → {booking.route.to}
                            </h3>
                            <p className="text-sm text-gray-600">Booking #{booking.bookingNumber}</p>
                          </div>
                          <Badge className={getStatusColor(booking.status)}>
                            {booking.status}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                          <div>
                            <p className="text-gray-500">Departure</p>
                            <p className="font-medium">{new Date(booking.trip.departureTime).toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Seats</p>
                            <p className="font-medium">{booking.seatNumbers.join(', ')}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Amount</p>
                            <p className="font-medium text-green-600">₦{Number(booking.totalAmount).toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Booked On</p>
                            <p className="font-medium">{new Date(booking.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            View Details
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-1" />
                            Download Ticket
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </CustomerDashboardLayout>
    </ProtectedRoute>
  );
}

