"use client";

import { useState, useEffect } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import CustomerDashboardLayout from "@/components/CustomerDashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { History, MapPin, Calendar, Clock } from "lucide-react";

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

export default function HistoryPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('https://engracedsmile.com/api/v1/bookings/my-bookings', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        // Sort by date, most recent first
        setBookings(data.sort((a: Booking, b: Booking) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ));
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

  return (
    <ProtectedRoute>
      <CustomerDashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Trip History</h1>
            <p className="text-gray-600">View all your past and upcoming trips</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                All Trips ({bookings.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5d4a15] mx-auto"></div>
                </div>
              ) : bookings.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <History className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <p>No trip history yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {bookings.map((booking) => (
                    <div key={booking.id} className="border rounded-lg p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-[#5d4a15]/10 rounded-lg flex items-center justify-center">
                            <MapPin className="h-6 w-6 text-[#5d4a15]" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">
                              {booking.route.from} → {booking.route.to}
                            </h3>
                            <p className="text-sm text-gray-600">#{booking.bookingNumber}</p>
                          </div>
                        </div>
                        <Badge className={getStatusColor(booking.status)}>
                          {booking.status}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500 flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            Departure
                          </p>
                          <p className="font-medium mt-1">
                            {new Date(booking.trip.departureTime).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500 flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            Time
                          </p>
                          <p className="font-medium mt-1">
                            {new Date(booking.trip.departureTime).toLocaleTimeString('en-US', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500">Seats</p>
                          <p className="font-medium mt-1">{booking.seatNumbers.join(', ')}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Amount</p>
                          <p className="font-medium text-green-600 mt-1">
                            ₦{Number(booking.totalAmount).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
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

