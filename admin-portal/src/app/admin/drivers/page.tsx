"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/ui/data-table";
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
  ArrowUpDown,
  MoreHorizontal,
  Car,
  Award,
  Clock,
  Image as ImageIcon
} from "lucide-react";
import ImageViewer from "@/components/ImageViewer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";

interface Driver {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  licenseNumber: string;
  licenseExpiry: string;
  address: string;
  rating: number;
  experience: number;
  isActive: boolean;
  tripsCount: number;
  profileImage?: string;
  createdAt: string;
}

export default function DriversPage() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddDriverModal, setShowAddDriverModal] = useState(false);
  const [newDriver, setNewDriver] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    licenseNumber: '',
    licenseExpiry: '',
    address: ''
  });
  const [driverImage, setDriverImage] = useState<File | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [showImageViewer, setShowImageViewer] = useState(false);
  const [viewerImages, setViewerImages] = useState<string[]>([]);
  const [viewerIndex, setViewerIndex] = useState(0);

  // Fetch drivers data
  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:3003/api/v1/drivers', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setDrivers(data);
      } else {
        console.error('Failed to fetch drivers');
        // Fallback to mock data for development
        setDrivers(getMockDrivers());
      }
    } catch (error) {
      console.error('Error fetching drivers:', error);
      // Fallback to mock data for development
      setDrivers(getMockDrivers());
    } finally {
      setLoading(false);
    }
  };

  const handleAddDriver = async () => {
    try {
      setIsUploadingImage(true);
      
      // Upload driver image first if provided
      let profileImageUrl = '';
      if (driverImage) {
        const formData = new FormData();
        formData.append('image', driverImage);
        formData.append('type', 'driver');
        
        const uploadResponse = await fetch('http://localhost:3003/api/v1/upload/driver', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
          },
          body: formData
        });
        
        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json();
          profileImageUrl = uploadData.url;
        }
      }

      const token = localStorage.getItem('adminToken');
      const driverData = {
        ...newDriver,
        profileImage: profileImageUrl
      };
      
      const response = await fetch('http://localhost:3003/api/v1/drivers', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(driverData)
      });

      if (response.ok) {
        const data = await response.json();
        setDrivers(prev => [...prev, data]);
        setShowAddDriverModal(false);
        setNewDriver({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          licenseNumber: '',
          licenseExpiry: '',
          address: ''
        });
        setDriverImage(null);
        alert('Driver added successfully!');
      } else {
        // Mock add for development
        const mockDriver: Driver = {
          id: Date.now().toString(),
          ...newDriver,
          profileImage: profileImageUrl,
          rating: 4.5,
          experience: 2,
          isActive: true,
          tripsCount: 0,
          createdAt: new Date().toISOString()
        };
        setDrivers(prev => [...prev, mockDriver]);
        setShowAddDriverModal(false);
        setNewDriver({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          licenseNumber: '',
          licenseExpiry: '',
          address: ''
        });
        setDriverImage(null);
        alert('Driver added successfully! (Mock)');
      }
    } catch (error) {
      console.error('Error adding driver:', error);
      alert('Failed to add driver');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleViewDriver = (driver: Driver) => {
    alert(`Viewing driver: ${driver.firstName} ${driver.lastName}`);
  };

  const handleEditDriver = (driver: Driver) => {
    alert(`Editing driver: ${driver.firstName} ${driver.lastName}`);
  };

  const handleDeleteDriver = (driver: Driver) => {
    if (confirm(`Are you sure you want to delete ${driver.firstName} ${driver.lastName}?`)) {
      setDrivers(prev => prev.filter(d => d.id !== driver.id));
      alert('Driver deleted successfully!');
    }
  };

  const handleViewDriverImage = (driver: Driver) => {
    if (driver.profileImage) {
      setViewerImages([driver.profileImage]);
      setViewerIndex(0);
      setShowImageViewer(true);
    } else {
      alert('No profile image available for this driver');
    }
  };

  // Mock data for development
  const getMockDrivers = (): Driver[] => [
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
      createdAt: "2024-01-10",
  },
  {
    id: "3",
    firstName: "Mike",
    lastName: "Johnson",
    email: "mike.johnson@example.com",
    phone: "+2348071116231",
    licenseNumber: "DL456789123",
      licenseExpiry: "2024-06-20",
    address: "789 Pine Road, Port Harcourt",
    rating: 4.9,
    experience: 7,
      isActive: true,
    tripsCount: 67,
      createdAt: "2024-01-05",
    },
    {
      id: "4",
      firstName: "Sarah",
      lastName: "Wilson",
      email: "sarah.wilson@example.com",
      phone: "+2348071116232",
      licenseNumber: "DL789123456",
      licenseExpiry: "2024-03-10",
      address: "321 Elm Street, Kano",
      rating: 4.3,
      experience: 2,
      isActive: false,
      tripsCount: 18,
      createdAt: "2024-01-20",
    }
  ];

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <Badge variant="default"><Clock className="h-3 w-3 mr-1" />Active</Badge>
    ) : (
      <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Inactive</Badge>
    );
  };

  const getRatingStars = (rating: number) => {
    return (
      <div className="flex items-center space-x-1">
        <Star className="h-4 w-4 text-yellow-400 fill-current" />
        <span className="font-medium">{rating}</span>
      </div>
    );
  };

  const columns: ColumnDef<Driver>[] = [
    {
      accessorKey: "driver",
      header: "Driver",
      cell: ({ row }) => {
        const driver = row.original;
        return (
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[#5d4a15] rounded-full flex items-center justify-center text-white font-semibold">
              {driver.firstName[0]}{driver.lastName[0]}
            </div>
            <div className="space-y-1">
              <div className="font-medium">{driver.firstName} {driver.lastName}</div>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Mail className="h-3 w-3" />
                <span>{driver.email}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Phone className="h-3 w-3" />
                <span>{driver.phone}</span>
              </div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "licenseNumber",
      header: "License",
      cell: ({ row }) => (
        <div className="space-y-1">
          <div className="font-medium">{row.getValue("licenseNumber")}</div>
          <div className="text-sm text-gray-500">
            Expires: {row.original.licenseExpiry}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "rating",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Rating
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => getRatingStars(row.getValue("rating")),
    },
    {
      accessorKey: "experience",
      header: "Experience",
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <Award className="h-4 w-4 text-gray-400" />
          <span>{row.getValue("experience")} years</span>
        </div>
      ),
    },
    {
      accessorKey: "tripsCount",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Trips
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <Car className="h-4 w-4 text-gray-400" />
          <span className="font-medium">{row.getValue("tripsCount")}</span>
        </div>
      ),
    },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ row }) => getStatusBadge(row.getValue("isActive")),
    },
    {
      accessorKey: "address",
      header: "Location",
      cell: ({ row }) => (
        <div className="flex items-center space-x-2 max-w-[200px]">
          <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0" />
          <span className="text-sm truncate">{row.getValue("address")}</span>
        </div>
      ),
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const driver = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(driver.id)}
              >
                Copy driver ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleViewDriver(row.original)}>
                <Eye className="mr-2 h-4 w-4" />
                View profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleViewDriverImage(row.original)}>
                <ImageIcon className="mr-2 h-4 w-4" />
                View profile image
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleEditDriver(row.original)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit driver
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleViewDriver(row.original)}>
                <Calendar className="mr-2 h-4 w-4" />
                View schedule
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="text-red-600"
                onClick={() => handleDeleteDriver(row.original)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Remove driver
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Drivers Management</h1>
            <p className="text-gray-600 mt-1">Manage and monitor your driver team</p>
        </div>
          <Button 
            className="btn-golden"
            onClick={() => setShowAddDriverModal(true)}
          >
          <Plus className="h-4 w-4 mr-2" />
            Add New Driver
        </Button>
      </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Drivers</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
              <div className="text-2xl font-bold">{drivers.length}</div>
              <p className="text-xs text-muted-foreground">+2 this month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Drivers</CardTitle>
              <Clock className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {drivers.filter(driver => driver.isActive).length}
                    </div>
              <p className="text-xs text-muted-foreground">
                {drivers.length > 0 ? Math.round((drivers.filter(driver => driver.isActive).length / drivers.length) * 100) : 0}% active rate
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Rating</CardTitle>
              <Star className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {drivers.length > 0 ? (drivers.reduce((sum, driver) => sum + driver.rating, 0) / drivers.length).toFixed(1) : "0.0"}
                    </div>
              <p className="text-xs text-muted-foreground">Out of 5.0</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Trips</CardTitle>
              <Car className="h-4 w-4 text-[#5d4a15]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {drivers.reduce((sum, driver) => sum + driver.tripsCount, 0)}
                  </div>
              <p className="text-xs text-muted-foreground">Completed trips</p>
              </CardContent>
            </Card>
        </div>

        {/* Drivers Data Table */}
        <Card>
              <CardHeader>
            <CardTitle>Drivers</CardTitle>
            <CardDescription>
              A comprehensive list of all drivers with their performance metrics and contact information.
            </CardDescription>
              </CardHeader>
              <CardContent>
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5d4a15]"></div>
                <span className="ml-2">Loading drivers...</span>
                    </div>
            ) : (
              <DataTable 
                columns={columns} 
                data={drivers} 
                searchKey="firstName"
                searchPlaceholder="Search by driver name..."
              />
            )}
              </CardContent>
            </Card>

            {/* Add Driver Modal */}
            {showAddDriverModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                  <h3 className="text-lg font-semibold mb-4">Add New Driver</h3>
                  <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">First Name</label>
                        <input
                          type="text"
                        value={newDriver.firstName}
                          onChange={(e) => setNewDriver(prev => ({ ...prev, firstName: e.target.value }))}
                          className="w-full p-2 border rounded-md"
                          placeholder="Enter first name"
                      />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Last Name</label>
                        <input
                          type="text"
                        value={newDriver.lastName}
                          onChange={(e) => setNewDriver(prev => ({ ...prev, lastName: e.target.value }))}
                          className="w-full p-2 border rounded-md"
                          placeholder="Enter last name"
                      />
                    </div>
                  </div>
                  <div>
                      <label className="block text-sm font-medium mb-1">Email</label>
                      <input
                      type="email" 
                      value={newDriver.email}
                        onChange={(e) => setNewDriver(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full p-2 border rounded-md"
                        placeholder="Enter email"
                    />
                  </div>
                  <div>
                      <label className="block text-sm font-medium mb-1">Phone</label>
                      <input
                        type="tel"
                      value={newDriver.phone}
                        onChange={(e) => setNewDriver(prev => ({ ...prev, phone: e.target.value }))}
                        className="w-full p-2 border rounded-md"
                        placeholder="Enter phone number"
                    />
                  </div>
                  <div>
                      <label className="block text-sm font-medium mb-1">License Number</label>
                      <input
                        type="text"
                      value={newDriver.licenseNumber}
                        onChange={(e) => setNewDriver(prev => ({ ...prev, licenseNumber: e.target.value }))}
                        className="w-full p-2 border rounded-md"
                        placeholder="Enter license number"
                    />
                  </div>
                  <div>
                      <label className="block text-sm font-medium mb-1">License Expiry</label>
                      <input
                      type="date" 
                      value={newDriver.licenseExpiry}
                        onChange={(e) => setNewDriver(prev => ({ ...prev, licenseExpiry: e.target.value }))}
                        className="w-full p-2 border rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Address</label>
                      <textarea
                        value={newDriver.address}
                        onChange={(e) => setNewDriver(prev => ({ ...prev, address: e.target.value }))}
                        className="w-full p-2 border rounded-md"
                        placeholder="Enter address"
                        rows={3}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Profile Image</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setDriverImage(e.target.files?.[0] || null)}
                        className="w-full p-2 border rounded-md"
                      />
                      {driverImage && (
                        <div className="mt-2">
                          <img
                            src={URL.createObjectURL(driverImage)}
                            alt="Preview"
                            className="w-20 h-20 object-cover rounded-md"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2 mt-6">
                    <Button
                      variant="outline"
                      onClick={() => setShowAddDriverModal(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleAddDriver}
                      disabled={isUploadingImage}
                      className="bg-[#5d4a15] hover:bg-[#6b5618]"
                    >
                      {isUploadingImage ? 'Uploading...' : 'Add Driver'}
                    </Button>
                  </div>
                </div>
          </div>
            )}

            {/* Image Viewer */}
            <ImageViewer
              isOpen={showImageViewer}
              onClose={() => setShowImageViewer(false)}
              images={viewerImages}
              currentIndex={viewerIndex}
              title="Driver Profile Image"
            />
      </div>
    </AdminLayout>
  );
}