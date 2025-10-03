"use client";

import { useState } from "react";
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

// Mock data - replace with real API calls
const mockTrips = [
  {
    id: "1",
    route: {
      from: "Lagos",
      to: "Abuja",
    },
    driver: {
      name: "John Doe",
      phone: "+2348071116229",
    },
    vehicle: {
      plateNumber: "ABC123XY",
      make: "Toyota",
      model: "Sienna",
    },
    departureTime: "2024-10-16T06:00:00Z",
    arrivalTime: "2024-10-16T14:30:00Z",
    price: 7500,
    status: "ACTIVE",
    availableSeats: 3,
    totalSeats: 7,
    bookingsCount: 4,
    features: ["Wi-Fi", "AC", "Refreshments"],
  },
  {
    id: "2",
    route: {
      from: "Abuja",
      to: "Kaduna",
    },
    driver: {
      name: "Jane Smith",
      phone: "+2348071116230",
    },
    vehicle: {
      plateNumber: "XYZ789AB",
      make: "Toyota",
      model: "Sienna",
    },
    departureTime: "2024-10-16T08:00:00Z",
    arrivalTime: "2024-10-16T10:15:00Z",
    price: 2000,
    status: "ACTIVE",
    availableSeats: 1,
    totalSeats: 7,
    bookingsCount: 6,
    features: ["Wi-Fi", "AC"],
  },
  {
    id: "3",
    route: {
      from: "Lagos",
      to: "Port Harcourt",
    },
    driver: {
      name: "Mike Johnson",
      phone: "+2348071116231",
    },
    vehicle: {
      plateNumber: "DEF456GH",
      make: "Toyota",
      model: "Sienna",
    },
    departureTime: "2024-10-17T07:30:00Z",
    arrivalTime: "2024-10-17T13:30:00Z",
    price: 6200,
    status: "CANCELLED",
    availableSeats: 0,
    totalSeats: 7,
    bookingsCount: 0,
    features: ["Wi-Fi", "AC", "Refreshments"],
  },
];

export default function TripsPage() {
  const [trips, setTrips] = useState(mockTrips);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);

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
                      <Button variant="outline" size="sm" className="flex-1">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
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
                      <select className="w-full p-2 border rounded-md">
                        <option>Select Route</option>
                        <option value="1">Lagos → Abuja</option>
                        <option value="2">Abuja → Kaduna</option>
                        <option value="3">Lagos → Port Harcourt</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Driver</label>
                      <select className="w-full p-2 border rounded-md">
                        <option>Select Driver</option>
                        <option value="1">John Doe</option>
                        <option value="2">Jane Smith</option>
                        <option value="3">Mike Johnson</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Vehicle</label>
                    <select className="w-full p-2 border rounded-md">
                      <option>Select Vehicle</option>
                      <option value="1">ABC123XY - Toyota Sienna</option>
                      <option value="2">XYZ789AB - Toyota Sienna</option>
                      <option value="3">DEF456GH - Toyota Sienna</option>
                    </select>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Departure Time</label>
                      <Input type="datetime-local" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Arrival Time</label>
                      <Input type="datetime-local" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Price (₦)</label>
                    <Input type="number" placeholder="7500" />
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
                    <Button className="flex-1">Schedule Trip</Button>
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
