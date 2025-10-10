"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Modal, AlertModal } from "@/components/ui/modal";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Image from "next/image";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Calendar,
  Clock,
  User,
  Car,
  MapPin,
  DollarSign,
  TrendingUp,
  Users,
  CheckCircle,
  XCircle,
  MoreHorizontal,
  BarChart3,
  PieChart as PieChartIcon,
  Star,
  Award,
  Image as ImageIcon,
} from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface Trip {
  id: string;
    route: {
    from: string;
    to: string;
    basePrice?: number;
  };
  driver?: {
    firstName: string;
    lastName: string;
    phone: string;
    rating?: number;
    profileImage?: string;
    experience?: number;
    licenseNumber?: string;
  } | null;
  vehicle?: {
    plateNumber: string;
    make: string;
    model: string;
    capacity?: number;
    images?: string[];
    features?: string[];
    year?: number;
    mileage?: number;
  } | null;
  departureTime: string;
  arrivalTime: string;
  price: number;
  maxPassengers: number;
  status: string;
  features: string[];
  amenities?: string[];
  _count?: {
    bookings: number;
    seats: number;
  };
  seats?: {
    id: string;
    seatNumber: string;
    isBooked: boolean;
  }[];
}

export default function TripsPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showSeatMap, setShowSeatMap] = useState(false);
  const [showTripDetails, setShowTripDetails] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [alertModal, setAlertModal] = useState<{show: boolean; title: string; message: string; type: 'success' | 'error' | 'info'}>({
    show: false,
    title: '',
    message: '',
    type: 'info'
  });
  
  // Data for form dropdowns
  const [routes, setRoutes] = useState<any[]>([]);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [promotions, setPromotions] = useState<any[]>([]);
  
  const [newTrip, setNewTrip] = useState({
    routeId: '',
    driverId: '',
    vehicleId: '',
    departureTime: '',
    arrivalTime: '',
    price: '',
    maxPassengers: '',
    promotionId: ''
  });

  // Fetch trips data
  useEffect(() => {
    fetchTrips();
    fetchFormData();
  }, []);

  const fetchFormData = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      
      // Fetch all data in parallel
      const [routesRes, driversRes, vehiclesRes, promotionsRes] = await Promise.all([
        fetch('http://localhost:3003/api/v1/routes', {
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
        }),
        fetch('http://localhost:3003/api/v1/drivers', {
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
        }),
        fetch('http://localhost:3003/api/v1/vehicles', {
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
        }),
        fetch('http://localhost:3003/api/v1/promotions', {
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
        })
      ]);

      if (routesRes.ok) setRoutes(await routesRes.json());
      if (driversRes.ok) setDrivers(await driversRes.json());
      if (vehiclesRes.ok) setVehicles(await vehiclesRes.json());
      if (promotionsRes.ok) setPromotions(await promotionsRes.json());
    } catch (error) {
      console.error('Error fetching form data:', error);
    }
  };

  const fetchTrips = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:3003/api/v1/trips', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setTrips(data);
      } else {
        setTrips([]);
      }
    } catch (error) {
      console.error('Error fetching trips:', error);
      setTrips([]);
    } finally {
      setLoading(false);
    }
  };

  const handleScheduleTrip = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      // Always set maxPassengers to 7 for Sienna vehicles
      const tripData = {
        ...newTrip,
        maxPassengers: 7
      };
      const response = await fetch('http://localhost:3003/api/v1/trips', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(tripData)
      });
      
      if (response.ok) {
        const addedTrip = await response.json();
        setTrips(prev => [...prev, addedTrip]);
        setShowCreateForm(false);
        setNewTrip({
          routeId: '',
          driverId: '',
          vehicleId: '',
          departureTime: '',
          arrivalTime: '',
          price: '',
          maxPassengers: '',
          promotionId: ''
        });
        showAlert('Success', 'Trip created successfully!', 'success');
      } else {
        const errorData = await response.json();
        showAlert('Error', `Failed to create trip: ${errorData.message || 'Unknown error'}`, 'error');
      }
    } catch (error) {
      console.error('Error scheduling trip:', error);
      showAlert('Error', 'Failed to schedule trip', 'error');
    }
  };

  const handleDeleteTrip = async (tripId: string) => {
    if (confirm('Are you sure you want to delete this trip?')) {
      try {
        const token = localStorage.getItem('adminToken');
        const response = await fetch(`http://localhost:3003/api/v1/trips/${tripId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          setTrips(prev => prev.filter(t => t.id !== tripId));
          showAlert('Success', 'Trip deleted successfully!', 'success');
        } else {
          showAlert('Error', 'Failed to delete trip', 'error');
        }
      } catch (error) {
        console.error('Error deleting trip:', error);
        showAlert('Error', 'Failed to delete trip', 'error');
      }
    }
  };

  const showAlert = (title: string, message: string, type: 'success' | 'error' | 'info') => {
    setAlertModal({ show: true, title, message, type });
  };

  const filteredTrips = trips.filter(
    (trip) =>
      trip.route.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trip.route.to.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (trip.driver && `${trip.driver.firstName} ${trip.driver.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (trip.vehicle && trip.vehicle.plateNumber.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  };

  const getStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
      case "ACTIVE":
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Active</Badge>;
      case "COMPLETED":
        return <Badge className="bg-blue-100 text-blue-800"><CheckCircle className="h-3 w-3 mr-1" />Completed</Badge>;
      case "CANCELLED":
        return <Badge className="bg-red-100 text-red-800"><XCircle className="h-3 w-3 mr-1" />Cancelled</Badge>;
      case "INACTIVE":
        return <Badge className="bg-gray-100 text-gray-800"><XCircle className="h-3 w-3 mr-1" />Inactive</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // Helper function to get available seats
  const getAvailableSeats = (trip: Trip) => {
    if (!trip.seats) return trip.maxPassengers || 0;
    return trip.seats.filter(s => !s.isBooked).length;
  };

  const getBookedSeats = (trip: Trip) => {
    if (!trip.seats) return 0;
    return trip.seats.filter(s => s.isBooked).length;
  };

  // Calculate stats for cards
  const stats = {
    total: trips.length,
    active: trips.filter(t => t.status === 'ACTIVE').length,
    completed: trips.filter(t => t.status === 'COMPLETED').length,
    totalRevenue: trips.reduce((sum, t) => sum + ((t.price || 0) * (t._count?.bookings || 0)), 0),
    totalBookings: trips.reduce((sum, t) => sum + (t._count?.bookings || 0), 0),
    avgOccupancy: trips.length > 0 
      ? trips.reduce((sum, t) => {
          const totalSeats = t.maxPassengers || 1;
          const bookedSeats = getBookedSeats(t);
          return sum + ((bookedSeats / totalSeats) * 100);
        }, 0) / trips.length
      : 0
  };

  // Chart data - Trips by Route
  const routeData = trips.reduce((acc: any[], trip) => {
    const routeName = `${trip.route.from} → ${trip.route.to}`;
    const existing = acc.find(item => item.route === routeName);
    if (existing) {
      existing.count += 1;
      existing.bookings += (trip._count?.bookings || 0);
    } else {
      acc.push({ route: routeName, count: 1, bookings: (trip._count?.bookings || 0) });
    }
    return acc;
  }, []).slice(0, 5); // Top 5 routes

  // Chart data - Trips by Status
  const statusData = [
    { name: 'Active', value: stats.active, color: '#22c55e' },
    { name: 'Completed', value: stats.completed, color: '#3b82f6' },
    { name: 'Cancelled', value: trips.filter(t => t.status === 'CANCELLED').length, color: '#ef4444' },
    { name: 'Inactive', value: trips.filter(t => t.status === 'INACTIVE').length, color: '#6b7280' },
  ].filter(item => item.value > 0);

  // Chart data - Daily trips (last 7 days)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date.toISOString().split('T')[0];
  });

  const dailyTripsData = last7Days.map(date => {
    const dayTrips = trips.filter(t => t.departureTime && t.departureTime.startsWith(date));
    return {
      date: new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
      trips: dayTrips.length,
      bookings: dayTrips.reduce((sum, t) => sum + (t._count?.bookings || 0), 0)
    };
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex justify-end items-center">
          <Button 
            onClick={() => setShowCreateForm(true)}
            className="bg-[#5d4a15] hover:bg-[#6b5618]"
          >
          <Plus className="h-4 w-4 mr-2" />
            Schedule New Trip
        </Button>
      </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Trips</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <Calendar className="h-8 w-8 text-[#5d4a15]" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active</p>
                  <p className="text-2xl font-bold text-green-600">{stats.active}</p>
                    </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.completed}</p>
                        </div>
                <CheckCircle className="h-8 w-8 text-blue-600" />
                      </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Bookings</p>
                  <p className="text-2xl font-bold text-purple-600">{stats.totalBookings}</p>
                        </div>
                <Users className="h-8 w-8 text-purple-600" />
                      </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Revenue</p>
                  <p className="text-2xl font-bold text-[#5d4a15]">₦{stats.totalRevenue.toLocaleString()}</p>
                    </div>
                <DollarSign className="h-8 w-8 text-[#5d4a15]" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Avg Occupancy</p>
                  <p className="text-2xl font-bold text-orange-600">{stats.avgOccupancy.toFixed(1)}%</p>
                      </div>
                <TrendingUp className="h-8 w-8 text-orange-600" />
                      </div>
            </CardContent>
          </Card>
                    </div>
                    
        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Daily Trips Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Daily Trips & Bookings (Last 7 Days)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={dailyTripsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="trips" fill="#5d4a15" name="Trips" />
                  <Bar dataKey="bookings" fill="#f59e0b" name="Bookings" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Status Distribution Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChartIcon className="h-5 w-5" />
                Trip Status Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Top Routes Chart */}
        {routeData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Top Routes by Bookings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={routeData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="route" type="category" width={150} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="bookings" fill="#5d4a15" name="Bookings" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Trips Table */}
        <Card>
          <CardHeader>
                    <div className="flex items-center justify-between">
              <CardTitle>All Trips</CardTitle>
              <div className="flex items-center space-x-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search trips..."
                    className="pl-10 w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
                      </div>
                      </div>
                    </div>
                </CardHeader>
                <CardContent>
            {loading ? (
              <div className="text-center py-8">Loading trips...</div>
            ) : filteredTrips.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No trips found. Schedule your first trip to get started!
                        </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Route</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Driver</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Vehicle</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Departure</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Seats</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Price</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Bookings</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredTrips.map((trip) => {
                      const departure = formatDateTime(trip.departureTime);
                      const totalSeats = trip.maxPassengers || 0;
                      const availableSeats = getAvailableSeats(trip);
                      const bookedSeats = getBookedSeats(trip);
                      const occupancyRate = totalSeats > 0 
                        ? ((bookedSeats / totalSeats * 100).toFixed(0))
                        : '0';
                      
                      return (
                        <tr key={trip.id} className="hover:bg-gray-50">
                          <td className="px-4 py-4">
                      <div className="flex items-center space-x-2">
                              <MapPin className="h-4 w-4 text-gray-400" />
                    <div>
                                <p className="font-medium text-gray-900">{trip.route.from}</p>
                                <p className="text-sm text-gray-500">→ {trip.route.to}</p>
                      </div>
                    </div>
                          </td>
                          <td className="px-4 py-4">
                            {trip.driver ? (
                              <div>
                                <p className="text-sm font-medium text-gray-900">
                                  {trip.driver.firstName} {trip.driver.lastName}
                                </p>
                                <p className="text-xs text-gray-500">{trip.driver.phone}</p>
                      </div>
                            ) : (
                              <span className="text-sm text-gray-400">Not assigned</span>
                            )}
                          </td>
                          <td className="px-4 py-4">
                            {trip.vehicle ? (
                              <div>
                                <p className="text-sm font-medium text-gray-900">{trip.vehicle.plateNumber}</p>
                                <p className="text-xs text-gray-500">{trip.vehicle.make} {trip.vehicle.model}</p>
                    </div>
                            ) : (
                              <span className="text-sm text-gray-400">Not assigned</span>
                            )}
                          </td>
                          <td className="px-4 py-4">
                    <div>
                              <p className="text-sm font-medium text-gray-900">{departure.date}</p>
                              <p className="text-xs text-gray-500">{departure.time}</p>
                      </div>
                          </td>
                          <td className="px-4 py-4">
                            {getStatusBadge(trip.status)}
                          </td>
                          <td className="px-4 py-4">
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {availableSeats}/{totalSeats}
                              </p>
                              <p className="text-xs text-gray-500">{occupancyRate}% occupied</p>
                    </div>
                          </td>
                          <td className="px-4 py-4">
                            <p className="text-sm font-medium text-gray-900">₦{(trip.price || 0).toLocaleString()}</p>
                          </td>
                          <td className="px-4 py-4">
                            <p className="text-sm font-medium text-gray-900">{trip._count?.bookings || 0}</p>
                          </td>
                          <td className="px-4 py-4 text-right">
                            <div className="flex justify-end space-x-2">
                      <Button 
                                variant="ghost"
                        size="sm" 
                                onClick={() => {
                                  setSelectedTrip(trip);
                                  setShowTripDetails(true);
                                }}
                                title="View Trip Details"
                              >
                                <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                                variant="ghost"
                        size="sm" 
                                onClick={() => {
                                  setSelectedTrip(trip);
                                  setShowSeatMap(true);
                                }}
                                title="View Seat Map"
                              >
                                <Users className="h-4 w-4" />
                      </Button>
                      <Button 
                                variant="ghost"
                        size="sm" 
                        onClick={() => handleDeleteTrip(trip.id)}
                      >
                                <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                          </td>
                        </tr>
            );
          })}
                  </tbody>
                </table>
        </div>
            )}
                </CardContent>
              </Card>

        {/* Create Trip Modal */}
        <Modal
          isOpen={showCreateForm}
          onClose={() => {
            setShowCreateForm(false);
            setNewTrip({
              routeId: '',
              driverId: '',
              vehicleId: '',
              departureTime: '',
              arrivalTime: '',
              price: '',
              maxPassengers: '',
              promotionId: ''
            });
          }}
          title="Schedule New Trip"
          size="lg"
        >
          <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                <Label htmlFor="routeId">Select Route *</Label>
                <Select 
                        value={newTrip.routeId}
                  onValueChange={(value) => {
                    setNewTrip(prev => ({ ...prev, routeId: value }));
                    // Auto-fill price from route if available
                    const selectedRoute = routes.find(r => r.id === value);
                    if (selectedRoute && selectedRoute.basePrice) {
                      setNewTrip(prev => ({ ...prev, price: selectedRoute.basePrice.toString() }));
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a route" />
                  </SelectTrigger>
                  <SelectContent>
                    {routes.filter(r => r.isActive).map((route) => (
                      <SelectItem key={route.id} value={route.id}>
                        {route.from} → {route.to} (₦{route.basePrice})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                    </div>
                    <div>
                <Label htmlFor="price">Price (₦) *</Label>
                <Input
                  id="price"
                  type="number"
                  value={newTrip.price}
                  onChange={(e) => setNewTrip(prev => ({ ...prev, price: e.target.value }))}
                  placeholder="e.g., 5000"
                />
                    </div>
                  </div>
                  
            <div className="grid grid-cols-2 gap-4">
                  <div>
                <Label htmlFor="driverId">Select Driver *</Label>
                <Select 
                  value={newTrip.driverId}
                  onValueChange={(value) => setNewTrip(prev => ({ ...prev, driverId: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a driver" />
                  </SelectTrigger>
                  <SelectContent>
                    {drivers.filter(d => d.isActive).map((driver) => (
                      <SelectItem key={driver.id} value={driver.id}>
                        {driver.firstName} {driver.lastName} - {driver.phone}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
                  <div>
                <Label htmlFor="vehicleId">Select Vehicle *</Label>
                <Select 
                      value={newTrip.vehicleId}
                  onValueChange={(value) => {
                    setNewTrip(prev => ({ ...prev, vehicleId: value }));
                    // All Sienna vehicles have fixed 7 seats
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a vehicle" />
                  </SelectTrigger>
                  <SelectContent>
                    {vehicles.filter(v => v.isActive).map((vehicle) => (
                      <SelectItem key={vehicle.id} value={vehicle.id}>
                        {vehicle.plateNumber} - {vehicle.make} {vehicle.model} ({vehicle.capacity} seats)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                <Label htmlFor="departureTime">Departure Time *</Label>
                      <Input 
                  id="departureTime"
                        type="datetime-local" 
                        value={newTrip.departureTime}
                  onChange={(e) => setNewTrip(prev => ({ ...prev, departureTime: e.target.value }))}
                      />
                    </div>
                    <div>
                <Label htmlFor="arrivalTime">Arrival Time *</Label>
                      <Input 
                  id="arrivalTime"
                        type="datetime-local" 
                        value={newTrip.arrivalTime}
                  onChange={(e) => setNewTrip(prev => ({ ...prev, arrivalTime: e.target.value }))}
                      />
                    </div>
                  </div>
                  
            <div className="grid grid-cols-2 gap-4">
                  <div>
                <Label htmlFor="maxPassengers">Max Passengers (Sienna Capacity)</Label>
                    <Input 
                  id="maxPassengers"
                      type="number" 
                  value="7"
                  readOnly
                  disabled
                  className="bg-gray-100"
                  placeholder="Fixed at 7 seats for Sienna"
                />
              </div>
              <div>
                <Label htmlFor="promotionId">Apply Promotion (Optional)</Label>
                <Select 
                  value={newTrip.promotionId || 'none'}
                  onValueChange={(value) => setNewTrip(prev => ({ ...prev, promotionId: value === 'none' ? '' : value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="No promotion" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No promotion</SelectItem>
                    {promotions.filter(p => p.isActive && new Date(p.endDate) >= new Date()).map((promo) => (
                      <SelectItem key={promo.id} value={promo.id}>
                        {promo.title} {promo.code ? `(${promo.code})` : ''} - {promo.type === 'PERCENTAGE' ? `${promo.value}%` : `₦${promo.value}`} off
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
                  </div>
                  
            <div className="flex justify-end space-x-2 pt-4">
                    <Button
                      variant="outline"
                onClick={() => {
                  setShowCreateForm(false);
                  setNewTrip({
                    routeId: '',
                    driverId: '',
                    vehicleId: '',
                    departureTime: '',
                    arrivalTime: '',
                    price: '',
                    maxPassengers: '',
                    promotionId: ''
                  });
                }}
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleScheduleTrip}
                className="bg-[#5d4a15] hover:bg-[#6b5618]"
                    >
                      Schedule Trip
                    </Button>
                  </div>
          </div>
        </Modal>

        {/* Trip Details Modal */}
        <Modal
          isOpen={showTripDetails}
          onClose={() => {
            setShowTripDetails(false);
            setSelectedTrip(null);
          }}
          title={selectedTrip ? `Trip Details - ${selectedTrip.route.from} → ${selectedTrip.route.to}` : "Trip Details"}
          size="xl"
        >
          {selectedTrip && (
            <div className="space-y-6">
              {/* Route & Schedule Info */}
              <div className="grid grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Route Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">From:</span>
                      <span className="font-medium">{selectedTrip.route.from}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">To:</span>
                      <span className="font-medium">{selectedTrip.route.to}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Price:</span>
                      <span className="font-medium">₦{(selectedTrip.price || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      {getStatusBadge(selectedTrip.status)}
                    </div>
              </CardContent>
            </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Schedule</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Departure:</span>
                      <span className="font-medium">{formatDateTime(selectedTrip.departureTime).date}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Time:</span>
                      <span className="font-medium">{formatDateTime(selectedTrip.departureTime).time}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Arrival:</span>
                      <span className="font-medium">{formatDateTime(selectedTrip.arrivalTime).time}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Bookings:</span>
                      <span className="font-medium">{selectedTrip._count?.bookings || 0}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Driver Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Driver Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedTrip.driver ? (
                    <div className="flex gap-6">
                      {/* Driver Image */}
                      <div className="flex-shrink-0">
                        {selectedTrip.driver.profileImage ? (
                          <div className="relative w-32 h-32 rounded-lg overflow-hidden border-2 border-gray-200">
                            <Image
                              src={selectedTrip.driver.profileImage}
                              alt={`${selectedTrip.driver.firstName} ${selectedTrip.driver.lastName}`}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-32 h-32 bg-[#5d4a15] rounded-lg flex items-center justify-center">
                            <span className="text-4xl font-bold text-white">
                              {selectedTrip.driver.firstName.charAt(0)}{selectedTrip.driver.lastName.charAt(0)}
                            </span>
          </div>
        )}
                      </div>

                      {/* Driver Details */}
                      <div className="flex-1 space-y-3">
                        <div>
                          <h3 className="text-lg font-semibold">
                            {selectedTrip.driver.firstName} {selectedTrip.driver.lastName}
                          </h3>
                          {selectedTrip.driver.rating && (
                            <div className="flex items-center gap-1 mt-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm font-medium">{selectedTrip.driver.rating.toFixed(1)}</span>
                            </div>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">Phone:</p>
                            <p className="font-medium">{selectedTrip.driver.phone}</p>
                          </div>
                          {selectedTrip.driver.licenseNumber && (
                            <div>
                              <p className="text-gray-600">License:</p>
                              <p className="font-medium">{selectedTrip.driver.licenseNumber}</p>
                            </div>
                          )}
                          {selectedTrip.driver.experience && (
                            <div>
                              <p className="text-gray-600">Experience:</p>
                              <p className="font-medium">{selectedTrip.driver.experience} years</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-4">No driver assigned</p>
                  )}
                </CardContent>
              </Card>

              {/* Vehicle Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Car className="h-5 w-5" />
                    Vehicle Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedTrip.vehicle ? (
                    <div className="space-y-4">
                      {/* Vehicle Images */}
                      {selectedTrip.vehicle.images && selectedTrip.vehicle.images.length > 0 ? (
                        <div className="grid grid-cols-4 gap-2">
                          {selectedTrip.vehicle.images.slice(0, 4).map((image, index) => (
                            <div key={index} className="relative h-24 rounded-lg overflow-hidden border-2 border-gray-200">
                              <Image
                                src={image}
                                alt={`${selectedTrip.vehicle?.make} ${selectedTrip.vehicle?.model} - Image ${index + 1}`}
                                fill
                                className="object-cover"
                              />
                            </div>
                          ))}
                          {selectedTrip.vehicle.images.length > 4 && (
                            <div className="relative h-24 rounded-lg overflow-hidden border-2 border-gray-200 bg-gray-100 flex items-center justify-center">
                              <span className="text-sm font-medium text-gray-600">
                                +{selectedTrip.vehicle.images.length - 4} more
                              </span>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                          <div className="text-center text-gray-400">
                            <ImageIcon className="h-12 w-12 mx-auto mb-2" />
                            <p className="text-sm">No vehicle images</p>
                          </div>
                        </div>
                      )}

                      {/* Vehicle Details */}
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Plate Number:</p>
                          <p className="font-medium text-lg">{selectedTrip.vehicle.plateNumber}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Vehicle:</p>
                          <p className="font-medium">{selectedTrip.vehicle.make} {selectedTrip.vehicle.model}</p>
                        </div>
                        {selectedTrip.vehicle.year && (
                          <div>
                            <p className="text-gray-600">Year:</p>
                            <p className="font-medium">{selectedTrip.vehicle.year}</p>
                          </div>
                        )}
                        <div>
                          <p className="text-gray-600">Capacity:</p>
                          <p className="font-medium">{selectedTrip.vehicle.capacity} seats</p>
                        </div>
                        {selectedTrip.vehicle.mileage && (
                          <div>
                            <p className="text-gray-600">Mileage:</p>
                            <p className="font-medium">{selectedTrip.vehicle.mileage.toLocaleString()} km</p>
                          </div>
                        )}
                        <div>
                          <p className="text-gray-600">Available Seats:</p>
                          <p className="font-medium text-green-600">{getAvailableSeats(selectedTrip)} of {selectedTrip.maxPassengers}</p>
                        </div>
                      </div>

                      {/* Vehicle Features */}
                      {selectedTrip.vehicle.features && selectedTrip.vehicle.features.length > 0 && (
                        <div>
                          <p className="text-sm text-gray-600 mb-2">Features:</p>
                          <div className="flex flex-wrap gap-2">
                            {selectedTrip.vehicle.features.map((feature, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {feature}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-4">No vehicle assigned</p>
                  )}
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <div className="flex justify-center gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowTripDetails(false);
                    setShowSeatMap(true);
                  }}
                >
                  <Users className="h-4 w-4 mr-2" />
                  View Seat Map
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowTripDetails(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </Modal>

        {/* Seat Map Modal */}
        <Modal
          isOpen={showSeatMap}
          onClose={() => {
            setShowSeatMap(false);
            setSelectedTrip(null);
          }}
          title={selectedTrip ? `Seat Map - ${selectedTrip.route.from} → ${selectedTrip.route.to}` : "Seat Map"}
          size="lg"
        >
          {selectedTrip && (
            <div className="space-y-6">
              {/* Trip Info */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Departure</p>
                    <p className="font-medium">{formatDateTime(selectedTrip.departureTime).date} at {formatDateTime(selectedTrip.departureTime).time}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Driver</p>
                    <p className="font-medium">
                      {selectedTrip.driver ? `${selectedTrip.driver.firstName} ${selectedTrip.driver.lastName}` : 'Not assigned'}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Vehicle</p>
                    <p className="font-medium">
                      {selectedTrip.vehicle ? `${selectedTrip.vehicle.plateNumber} - ${selectedTrip.vehicle.make} ${selectedTrip.vehicle.model}` : 'Not assigned'}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Available Seats</p>
                    <p className="font-medium text-green-600">{getAvailableSeats(selectedTrip)} of {selectedTrip.maxPassengers}</p>
                  </div>
                </div>
              </div>

              {/* Seat Map Legend */}
              <div className="flex items-center justify-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-100 border-2 border-green-500 rounded"></div>
                  <span>Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-red-100 border-2 border-red-500 rounded"></div>
                  <span>Booked</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gray-200 border-2 border-gray-400 rounded"></div>
                  <span>Driver</span>
                </div>
              </div>

              {/* Seat Map */}
              <div className="bg-white border-2 border-gray-300 rounded-lg p-6">
                <div className="max-w-md mx-auto">
                  {/* Front Section */}
                  <div className="mb-8">
                    <p className="text-center text-sm text-gray-500 mb-2">Front</p>
                    <div className="grid grid-cols-2 gap-2">
                      <div></div>
                      {selectedTrip.seats?.filter(s => s.seatNumber === 'A1').map((seat) => (
                        <div
                          key={seat.id}
                          className={`
                            w-12 h-12 rounded border-2 flex items-center justify-center font-medium text-xs
                            bg-gray-200 border-gray-400 cursor-not-allowed
                          `}
                          title="Driver Seat"
                        >
                          {seat.seatNumber}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Passenger Section */}
                  <div>
                    <p className="text-center text-sm text-gray-500 mb-2">Passenger Seats</p>
                    <div className="grid grid-cols-4 gap-2">
                      {selectedTrip.seats
                        ?.filter(s => s.seatNumber !== 'A1')
                        .sort((a, b) => a.seatNumber.localeCompare(b.seatNumber))
                        .map((seat) => (
                          <div
                            key={seat.id}
                            className={`
                              w-12 h-12 rounded border-2 flex items-center justify-center font-medium text-xs
                              ${seat.isBooked 
                                ? 'bg-red-100 border-red-500 cursor-not-allowed' 
                                : 'bg-green-100 border-green-500 hover:bg-green-200 cursor-pointer'}
                            `}
                            title={seat.isBooked ? 'Booked' : 'Available'}
                          >
                            {seat.seatNumber}
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="mt-6 pt-4 border-t">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Total Seats:</span>
                      <span className="font-medium">{selectedTrip.maxPassengers}</span>
                    </div>
                    <div className="flex justify-between text-sm mt-2">
                      <span className="text-gray-600">Booked:</span>
                      <span className="font-medium text-red-600">{getBookedSeats(selectedTrip)}</span>
                    </div>
                    <div className="flex justify-between text-sm mt-2">
                      <span className="text-gray-600">Available:</span>
                      <span className="font-medium text-green-600">{getAvailableSeats(selectedTrip)}</span>
                    </div>
                  </div>
                </div>
              </div>
          </div>
        )}
        </Modal>

        {/* Alert Modal */}
        <AlertModal
          isOpen={alertModal.show}
          onClose={() => setAlertModal({...alertModal, show: false})}
          title={alertModal.title}
          message={alertModal.message}
          type={alertModal.type}
        />
      </div>
    </AdminLayout>
  );
}

