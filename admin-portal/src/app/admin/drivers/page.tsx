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
  User,
  Phone,
  Mail,
  Star,
  MapPin,
  Calendar,
} from "lucide-react";

// Mock data - replace with real API calls
const mockDrivers = [
  {
    id: "1",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+2348071116229",
    licenseNumber: "DL123456789",
    licenseExpiry: "2025-12-31",
    address: "123 Main Street, Lagos",
    rating: 4.8,
    experience: 5,
    isActive: true,
    tripsCount: 45,
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@example.com",
    phone: "+2348071116230",
    licenseNumber: "DL987654321",
    licenseExpiry: "2024-08-15",
    address: "456 Oak Avenue, Abuja",
    rating: 4.6,
    experience: 3,
    isActive: true,
    tripsCount: 32,
    createdAt: "2024-02-01",
  },
  {
    id: "3",
    firstName: "Mike",
    lastName: "Johnson",
    email: "mike.johnson@example.com",
    phone: "+2348071116231",
    licenseNumber: "DL456789123",
    licenseExpiry: "2025-06-20",
    address: "789 Pine Road, Port Harcourt",
    rating: 4.9,
    experience: 7,
    isActive: false,
    tripsCount: 67,
    createdAt: "2024-01-10",
  },
];

export default function DriversPage() {
  const [drivers, setDrivers] = useState(mockDrivers);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newDriver, setNewDriver] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    licenseNumber: "",
    licenseExpiry: "",
    address: "",
    experience: "",
  });

  const filteredDrivers = drivers.filter(
    (driver) =>
      driver.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.licenseNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleDriverStatus = (id: string) => {
    setDrivers(
      drivers.map((driver) =>
        driver.id === id ? { ...driver, isActive: !driver.isActive } : driver
      )
    );
  };

  const handleInputChange = (field: string, value: string) => {
    setNewDriver(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCreateDriver = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!newDriver.firstName || !newDriver.lastName || !newDriver.email || !newDriver.phone || !newDriver.licenseNumber) {
      alert("Please fill in all required fields");
      return;
    }

    // Create new driver
    const driver = {
      id: (drivers.length + 1).toString(),
      ...newDriver,
      experience: parseInt(newDriver.experience) || 0,
      rating: 5.0,
      isActive: true,
      tripsCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
    };

    // Add to drivers list
    setDrivers([...drivers, driver]);

    // Reset form
    setNewDriver({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      licenseNumber: "",
      licenseExpiry: "",
      address: "",
      experience: "",
    });

    // Close form
    setShowCreateForm(false);
    
    // Show success message
    alert("Driver created successfully!");
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Search and Add Button */}
        <div className="flex justify-between items-center">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search drivers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-64"
          />
        </div>
        <Button onClick={() => setShowCreateForm(true)} className="btn-golden">
          <Plus className="h-4 w-4 mr-2" />
          Add Driver
        </Button>
      </div>

        {/* Drivers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDrivers.map((driver) => (
            <Card key={driver.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-12 w-12 rounded-full bg-[#5d4a15] flex items-center justify-center">
                      <User className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">
                        {driver.firstName} {driver.lastName}
                      </CardTitle>
                      <p className="text-sm text-gray-500">License: {driver.licenseNumber}</p>
                    </div>
                  </div>
                  <Badge
                    variant={driver.isActive ? "default" : "secondary"}
                    className={
                      driver.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }
                  >
                    {driver.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span>{driver.email}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span>{driver.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span className="truncate">{driver.address}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="font-semibold">{driver.rating}</span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {driver.experience} years exp
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Total Trips</p>
                      <p className="font-semibold">{driver.tripsCount}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">License Expires</p>
                      <p className="font-semibold">{driver.licenseExpiry}</p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleDriverStatus(driver.id)}
                      className={
                        driver.isActive
                          ? "text-red-600 hover:text-red-700"
                          : "text-green-600 hover:text-green-700"
                      }
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Create Driver Form Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Add New Driver</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateDriver} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">First Name</label>
                      <Input 
                        placeholder="John" 
                        value={newDriver.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Last Name</label>
                      <Input 
                        placeholder="Doe" 
                        value={newDriver.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <Input 
                      type="email" 
                      placeholder="john.doe@example.com" 
                      value={newDriver.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Phone</label>
                    <Input 
                      placeholder="+2348071116229" 
                      value={newDriver.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">License Number</label>
                    <Input 
                      placeholder="DL123456789" 
                      value={newDriver.licenseNumber}
                      onChange={(e) => handleInputChange('licenseNumber', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">License Expiry</label>
                    <Input 
                      type="date" 
                      value={newDriver.licenseExpiry}
                      onChange={(e) => handleInputChange('licenseExpiry', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Address</label>
                    <Input 
                      placeholder="123 Main Street, Lagos" 
                      value={newDriver.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Experience (years)</label>
                      <Input 
                        type="number" 
                        placeholder="5" 
                        value={newDriver.experience}
                        onChange={(e) => handleInputChange('experience', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Rating</label>
                      <Input type="number" step="0.1" placeholder="4.8" />
                    </div>
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
                    <Button type="submit" className="flex-1 btn-golden">Add Driver</Button>
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
