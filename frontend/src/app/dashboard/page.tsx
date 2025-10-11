"use client";

import { useState, useEffect } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import CustomerDashboardLayout from "@/components/CustomerDashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar,
  CreditCard,
  TrendingUp,
  Award,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Package,
  Users,
  DollarSign,
  Activity,
  Star
} from "lucide-react";
import Link from "next/link";

interface Booking {
  id: string;
  bookingNumber: string;
  route: {
    from: string;
    to: string;
  };
  trip: {
    departureTime: string;
    arrivalTime: string;
  };
  status: string;
  totalAmount: number;
  passengerCount: number;
  seatNumbers: string[];
  createdAt: string;
}

interface Payment {
  id: string;
  amount: number;
  paymentStatus: string;
  paymentDate: string;
  booking: {
    route: {
      from: string;
      to: string;
    };
  };
}

interface UserStats {
  totalBookings: number;
  totalSpent: number;
  upcomingTrips: number;
  completedTrips: number;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [userStats, setUserStats] = useState<UserStats>({
    totalBookings: 0,
    totalSpent: 0,
    upcomingTrips: 0,
    completedTrips: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      
      if (!token) {
        console.error('No access token found');
        setLoading(false);
        return;
      }

      // Fetch bookings
      const bookingsResponse = await fetch('https://engracedsmile.com/api/v1/bookings/my-bookings', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (bookingsResponse.ok) {
        const bookingsData = await bookingsResponse.json();
        setBookings(bookingsData);
        calculateStats(bookingsData);
      } else {
        console.error('Failed to fetch bookings:', await bookingsResponse.text());
        setBookings([]);
      }

      // Fetch payments
      const paymentsResponse = await fetch('https://engracedsmile.com/api/v1/payments/my-payments', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (paymentsResponse.ok) {
        const paymentsData = await paymentsResponse.json();
        setPayments(paymentsData);
      } else {
        console.error('Failed to fetch payments:', await paymentsResponse.text());
        setPayments([]);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setBookings([]);
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (bookingsData: Booking[]) => {
    const totalBookings = bookingsData.length;
    const totalSpent = bookingsData.reduce((sum, booking) => sum + Number(booking.totalAmount || 0), 0);
    const now = new Date();
    const upcomingTrips = bookingsData.filter(b => 
      b.status === 'CONFIRMED' && new Date(b.trip.departureTime) > now
    ).length;
    const completedTrips = bookingsData.filter(b => b.status === 'COMPLETED').length;

    setUserStats({
      totalBookings,
      totalSpent,
      upcomingTrips,
      completedTrips
    });
  };

  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case "CONFIRMED":
        return "bg-green-100 text-green-800 border-green-200";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "COMPLETED":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "CANCELLED":
        return "bg-red-100 text-red-800 border-red-200";
      case "PAID":
        return "bg-green-100 text-green-800 border-green-200";
      case "FAILED":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toUpperCase()) {
      case "CONFIRMED":
      case "PAID":
      case "COMPLETED":
        return <CheckCircle className="h-4 w-4" />;
      case "PENDING":
        return <Clock className="h-4 w-4" />;
      case "CANCELLED":
      case "FAILED":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <CustomerDashboardLayout>
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5d4a15] mx-auto mb-4"></div>
              <p className="text-gray-600">Loading your dashboard...</p>
            </div>
          </div>
        </CustomerDashboardLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <CustomerDashboardLayout>
        <div className="space-y-6">
          {/* Welcome Banner */}
          <div className="bg-gradient-to-r from-[#5d4a15] to-[#6b5618] rounded-xl p-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  Welcome back, {user?.firstName}! 👋
                </h1>
                <p className="text-white/90">
                  Manage your bookings, view trip history, and track your travel rewards
                </p>
              </div>
              <div className="hidden lg:block">
                <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
                  <Users className="h-12 w-12 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-l-4 border-l-[#5d4a15]">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{userStats.totalBookings}</p>
                    <p className="text-xs text-green-600 mt-1 flex items-center">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      All time
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-[#5d4a15]/10 rounded-lg flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-[#5d4a15]" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-green-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Spent</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">₦{userStats.totalSpent.toLocaleString()}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Across all bookings
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                    <DollarSign className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-blue-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Upcoming Trips</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{userStats.upcomingTrips}</p>
                    <p className="text-xs text-blue-600 mt-1 flex items-center">
                      <Activity className="h-3 w-3 mr-1" />
                      Ready to travel
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                    <MapPin className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-purple-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Loyalty Points</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{Math.floor(userStats.totalSpent / 1000) * 10}</p>
                    <p className="text-xs text-purple-600 mt-1 flex items-center">
                      <Award className="h-3 w-3 mr-1" />
                      Earn more points
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                    <Star className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Start a new booking or manage your account</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Link href="/trips">
                  <Button className="w-full h-24 bg-gradient-to-r from-[#5d4a15] to-[#6b5618] hover:from-[#6b5618] hover:to-[#7a6619]">
                    <div className="flex flex-col items-center">
                      <Calendar className="h-6 w-6 mb-2" />
                      <span>Book New Trip</span>
                    </div>
                  </Button>
                </Link>
                <Link href="/dashboard/payments">
                  <Button variant="outline" className="w-full h-24 border-2">
                    <div className="flex flex-col items-center">
                      <CreditCard className="h-6 w-6 mb-2" />
                      <span>View Payments</span>
                    </div>
                  </Button>
                </Link>
                <Link href="/logistics">
                  <Button variant="outline" className="w-full h-24 border-2">
                    <div className="flex flex-col items-center">
                      <Package className="h-6 w-6 mb-2" />
                      <span>Send Package</span>
                    </div>
                  </Button>
                </Link>
                <Link href="/dashboard/loyalty">
                  <Button variant="outline" className="w-full h-24 border-2">
                    <div className="flex flex-col items-center">
                      <Award className="h-6 w-6 mb-2" />
                      <span>Rewards</span>
                    </div>
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Bookings */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-[#5d4a15]" />
                      Recent Bookings
                    </CardTitle>
                    <CardDescription>Your latest travel bookings</CardDescription>
                  </div>
                  <Link href="/dashboard/bookings">
                    <Button variant="ghost" size="sm">
                      View All
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {bookings.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p className="text-sm">No bookings yet</p>
                    <Link href="/trips">
                      <Button variant="link" className="mt-2 text-[#5d4a15]">
                        Book your first trip →
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bookings.slice(0, 3).map((booking) => (
                      <div key={booking.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            <p className="font-semibold text-gray-900">
                              {booking.route.from} → {booking.route.to}
                            </p>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {new Date(booking.trip.departureTime).toLocaleDateString()}
                            </span>
                            <span>Seats: {booking.seatNumbers.join(', ')}</span>
                          </div>
                        </div>
                        <Badge className={getStatusColor(booking.status)}>
                          {booking.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Payments */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-green-600" />
                      Recent Payments
                    </CardTitle>
                    <CardDescription>Your payment history</CardDescription>
                  </div>
                  <Link href="/dashboard/payments">
                    <Button variant="ghost" size="sm">
                      View All
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {payments.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <CreditCard className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p className="text-sm">No payments yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {payments.slice(0, 3).map((payment) => (
                      <div key={payment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">
                            ₦{Number(payment.amount).toLocaleString()}
                          </p>
                          <p className="text-sm text-gray-600">
                            {payment.booking?.route?.from} → {payment.booking?.route?.to}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {payment.paymentDate ? new Date(payment.paymentDate).toLocaleDateString() : 'Pending'}
                          </p>
                        </div>
                        <Badge className={getStatusColor(payment.paymentStatus)}>
                          <span className="flex items-center gap-1">
                            {getStatusIcon(payment.paymentStatus)}
                            {payment.paymentStatus}
                          </span>
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </CustomerDashboardLayout>
    </ProtectedRoute>
  );
}
