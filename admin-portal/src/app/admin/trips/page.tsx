"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
} from "lucide-react";


interface Trip {
  id: string;
  route: {
    from: string;
    to: string;
  };
  driver: {
    name: string;
    phone: string;
  };
  vehicle: {
    plateNumber: string;
    make: string;
    model: string;
  };
  departureTime: string;
  arrivalTime: string;
  price: number;
  status: string;
  availableSeats: number;
  totalSeats: number;
  bookingsCount: number;
  features: string[];
}

export default function TripsPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newTrip, setNewTrip] = useState({
    routeId: '',
    driverId: '',
    vehicleId: '',
    departureTime: '',
    arrivalTime: '',
    price: ''
  });

  // Fetch trips data
  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/v1/trips', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setTrips(data);
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

  const filteredTrips = trips.filter(
    (trip) =>
      trip.route.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trip.route.to.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trip.driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trip.vehicle.plateNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      case "COMPLETED":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleScheduleTrip = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:3003/api/v1/trips', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newTrip)
      });
      
      if (response.ok) {
        const addedTrip = await response.json();
        setTrips([...trips, addedTrip]);
        setShowCreateForm(false);
        setNewTrip({
          routeId: '',
          driverId: '',
          vehicleId: '',
          departureTime: '',
          arrivalTime: '',
          price: ''
        });
      } else {
        // Fallback: add to local state for development
        const mockTrip = {
          id: (trips.length + 1).toString(),
          route: {
            from: "New Route",
            to: "Destination"
          },
          driver: {
            name: "New Driver",
            phone: "+2348071116232"
          },
          vehicle: {
            plateNumber: "NEW123XY",
            make: "Toyota",
            model: "Sienna"
          },
          departureTime: newTrip.departureTime,
          arrivalTime: newTrip.arrivalTime,
          price: parseInt(newTrip.price) || 0,
          status: "ACTIVE",
          availableSeats: 7,
          totalSeats: 7,
          bookingsCount: 0,
          features: ["Wi-Fi", "AC"]
        };
        setTrips([...trips, mockTrip]);
        setShowCreateForm(false);
        setNewTrip({
          routeId: '',
          driverId: '',
          vehicleId: '',
          departureTime: '',
          arrivalTime: '',
          price: ''
        });
      }
    } catch (error) {
      console.error('Error scheduling trip:', error);
      // Fallback: add to local state for development
      const mockTrip = {
        id: (trips.length + 1).toString(),
        route: {
          from: "New Route",
          to: "Destination"
        },
        driver: {
          name: "New Driver",
          phone: "+2348071116232"
        },
        vehicle: {
          plateNumber: "NEW123XY",
          make: "Toyota",
          model: "Sienna"
        },
        departureTime: newTrip.departureTime,
        arrivalTime: newTrip.arrivalTime,
        price: parseInt(newTrip.price) || 0,
        status: "ACTIVE",
        availableSeats: 7,
        totalSeats: 7,
        bookingsCount: 0,
        features: ["Wi-Fi", "AC"]
      };
      setTrips([...trips, mockTrip]);
      setShowCreateForm(false);
      setNewTrip({
        routeId: '',
        driverId: '',
        vehicleId: '',
        departureTime: '',
        arrivalTime: '',
        price: ''
      });
    }
  };

  const handleViewTrip = (tripId: string) => {
    const trip = trips.find(t => t.id === tripId);
    if (trip) {
      alert(`Viewing trip: ${trip.route.from} → ${trip.route.to}\nDriver: ${trip.driver.name}\nVehicle: ${trip.vehicle.plateNumber}\nPrice: ₦${trip.price}`);
    }
  };

  const handleEditTrip = (tripId: string) => {
    const trip = trips.find(t => t.id === tripId);
    if (trip) {
      setNewTrip({
        routeId: trip.route.from,
        driverId: trip.driver.name,
        vehicleId: trip.vehicle.plateNumber,
        departureTime: trip.departureTime,
        arrivalTime: trip.arrivalTime,
        price: trip.price.toString()
      });
      setShowCreateForm(true);
    }
  };

  const handleDeleteTrip = (tripId: string) => {
    if (confirm('Are you sure you want to delete this trip?')) {
      setTrips(trips.filter(t => t.id !== tripId));
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Search and Add Button */}
        <div className="flex justify-between items-center">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search trips..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-64"
          />
        </div>
        <Button onClick={() => setShowCreateForm(true)} className="btn-golden">
          <Plus className="h-4 w-4 mr-2" />
          Schedule Trip
        </Button>
      </div>

        {/* Trips Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredTrips.map((trip) => {
            const departure = formatDateTime(trip.departureTime);
            const arrival = formatDateTime(trip.arrivalTime);
            
            return (
              <Card key={trip.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-5 w-5 text-[#5d4a15]" />
                      <CardTitle className="text-lg">
                        {trip.route.from} → {trip.route.to}
                      </CardTitle>
                    </div>
                    <Badge className={getStatusColor(trip.status)}>
                      {trip.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Schedule */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span className="text-sm font-medium">Departure</span>
                        </div>
                        <span className="text-sm">{departure.date}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span className="text-sm font-medium">Time</span>
                        </div>
                        <span className="text-sm">{departure.time}</span>
                      </div>
                    </div>
                    
                    {/* Driver & Vehicle */}
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">{trip.driver.name}</span>
                        <span className="text-xs text-gray-500">({trip.driver.phone})</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Car className="h-4 w-4 text-gray-500" />
                        <span className="text-sm">
                          {trip.vehicle.plateNumber} - {trip.vehicle.make} {trip.vehicle.model}
                        </span>
                      </div>
                    </div>
                    
                    {/* Pricing & Seats */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        <DollarSign className="h-4 w-4 text-green-600" />
                        <span className="font-semibold">₦{trip.price.toLocaleString()}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          {trip.availableSeats}/{trip.totalSeats} seats
                        </p>
                        <p className="text-xs text-gray-500">{trip.bookingsCount} bookings</p>
                      </div>
                    </div>
                    
                    {/* Features */}
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Features</p>
                      <div className="flex flex-wrap gap-1">
                        {trip.features.map((feature, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex space-x-2 pt-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleViewTrip(trip.id)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleEditTrip(trip.id)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleDeleteTrip(trip.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Create Trip Form Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="w-full max-w-2xl">
              <CardHeader>
                <CardTitle>Schedule New Trip</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Route</label>
                      <select 
                        className="w-full p-2 border rounded-md"
                        value={newTrip.routeId}
                        onChange={(e) => setNewTrip({...newTrip, routeId: e.target.value})}
                      >
                        <option value="">Select Route</option>
                        <option value="1">Lagos → Abuja</option>
                        <option value="2">Abuja → Kaduna</option>
                        <option value="3">Lagos → Port Harcourt</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Driver</label>
                      <select 
                        className="w-full p-2 border rounded-md"
                        value={newTrip.driverId}
                        onChange={(e) => setNewTrip({...newTrip, driverId: e.target.value})}
                      >
                        <option value="">Select Driver</option>
                        <option value="1">John Doe</option>
                        <option value="2">Jane Smith</option>
                        <option value="3">Mike Johnson</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Vehicle</label>
                    <select 
                      className="w-full p-2 border rounded-md"
                      value={newTrip.vehicleId}
                      onChange={(e) => setNewTrip({...newTrip, vehicleId: e.target.value})}
                    >
                      <option value="">Select Vehicle</option>
                      <option value="1">ABC123XY - Toyota Sienna</option>
                      <option value="2">XYZ789AB - Toyota Sienna</option>
                      <option value="3">DEF456GH - Toyota Sienna</option>
                    </select>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Departure Time</label>
                      <Input 
                        type="datetime-local" 
                        value={newTrip.departureTime}
                        onChange={(e) => setNewTrip({...newTrip, departureTime: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Arrival Time</label>
                      <Input 
                        type="datetime-local" 
                        value={newTrip.arrivalTime}
                        onChange={(e) => setNewTrip({...newTrip, arrivalTime: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Price (₦)</label>
                    <Input 
                      type="number" 
                      placeholder="7500" 
                      value={newTrip.price}
                      onChange={(e) => setNewTrip({...newTrip, price: e.target.value})}
                    />
                  </div>
                  
                  <div className="flex space-x-2 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowCreateForm(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="button"
                      onClick={handleScheduleTrip}
                      className="flex-1"
                    >
                      Schedule Trip
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
