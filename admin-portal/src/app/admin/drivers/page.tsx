"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/ui/data-table";
import { Modal, AlertModal } from "@/components/ui/modal";
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
    address: '',
    experience: 0
  });
  const [driverImage, setDriverImage] = useState<File | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [showImageViewer, setShowImageViewer] = useState(false);
  const [viewerImages, setViewerImages] = useState<string[]>([]);
  const [viewerIndex, setViewerIndex] = useState(0);
  
  // Modal states
  const [alertModal, setAlertModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'info' as 'success' | 'error' | 'warning' | 'info',
    onConfirm: () => {}
  });
  const [showDriverDetailsModal, setShowDriverDetailsModal] = useState(false);
  const [showEditDriverModal, setShowEditDriverModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [showDeactivateConfirmModal, setShowDeactivateConfirmModal] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);

  // Fetch drivers data
  useEffect(() => {
    fetchDrivers();
  }, []);

  const showAlert = (title: string, message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info', onConfirm?: () => void) => {
    setAlertModal({
      isOpen: true,
      title,
      message,
      type,
      onConfirm: onConfirm || (() => {})
    });
  };

  const fetchDrivers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/v1/drivers', {
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
        setDrivers([]);
      }
    } catch (error) {
      console.error('Error fetching drivers:', error);
      setDrivers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddDriver = async () => {
    try {
      setIsUploadingImage(true);
      
      const token = localStorage.getItem('adminToken');
      
      // First, create the driver without profile image
      const response = await fetch('/api/v1/drivers', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newDriver)
      });

      if (response.ok) {
        const data = await response.json();
        
        // If driver image was provided, upload it and update the driver
      if (driverImage) {
        const formData = new FormData();
        formData.append('image', driverImage);
        formData.append('type', 'driver');
        
        const uploadResponse = await fetch('http://localhost:3003/api/v1/upload/driver', {
          method: 'POST',
          headers: {
              'Authorization': `Bearer ${token}`
          },
          body: formData
        });
        
        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json();
          console.log('Upload response:', uploadData);
          console.log('Image URL from upload:', uploadData.data?.url);
          
          // Update driver with profile image
          const updateResponse = await fetch(`/api/v1/drivers/${data.id}/profile-image`, {
            method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
            body: JSON.stringify({ profileImage: uploadData.data.url })
          });
          
          console.log('Update response status:', updateResponse.status);
          
          if (updateResponse.ok) {
            const updatedDriver = await updateResponse.json();
            console.log('Updated driver with image:', updatedDriver);
            console.log('Driver profile image URL:', updatedDriver.profileImage);
            setDrivers(prev => [...prev, updatedDriver]);
          } else {
            const errorData = await updateResponse.json();
            console.error('Failed to update driver with profile image:', errorData);
            // If profile image update fails, still add the driver without image
            setDrivers(prev => [...prev, data]);
          }
          } else {
            // If image upload fails, still add the driver without image
            setDrivers(prev => [...prev, data]);
          }
        } else {
          // If no image provided, add the driver without image
        setDrivers(prev => [...prev, data]);
        }
        setShowAddDriverModal(false);
        setNewDriver({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          licenseNumber: '',
          licenseExpiry: '',
          address: '',
          experience: 0
        });
        setDriverImage(null);
        showAlert('Success', 'Driver added successfully!', 'success');
      } else {
        const errorData = await response.json();
        console.error('Failed to add driver:', errorData);
        showAlert('Error', `Failed to add driver: ${errorData.message || 'Unknown error'}`, 'error');
      }
    } catch (error) {
      console.error('Error adding driver:', error);
      showAlert('Error', 'Failed to add driver', 'error');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleViewDriver = (driver: Driver) => {
    setSelectedDriver(driver);
    setShowDriverDetailsModal(true);
  };

  const handleEditDriver = (driver: Driver) => {
    setSelectedDriver(driver);
    setNewDriver({
      firstName: driver.firstName,
      lastName: driver.lastName,
      email: driver.email,
      phone: driver.phone,
      licenseNumber: driver.licenseNumber,
      licenseExpiry: driver.licenseExpiry,
      address: driver.address,
      experience: driver.experience || 0
    });
    setShowEditDriverModal(true);
  };

  const handleDeleteDriver = (driver: Driver) => {
    setSelectedDriver(driver);
    setShowDeleteConfirmModal(true);
  };

  const handleDeactivateDriver = (driver: Driver) => {
    setSelectedDriver(driver);
    setShowDeactivateConfirmModal(true);
  };

  const confirmDeleteDriver = async () => {
    if (!selectedDriver) return;
    
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/v1/drivers/${selectedDriver.id}/delete`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        // Remove driver from list completely
        setDrivers(prev => prev.filter(d => d.id !== selectedDriver.id));
        showAlert('Success', 'Driver deleted successfully!', 'success');
      } else {
        const errorData = await response.json();
        showAlert('Error', `Failed to delete driver: ${errorData.message || 'Unknown error'}`, 'error');
      }
    } catch (error) {
      console.error('Error deleting driver:', error);
      showAlert('Error', 'Failed to delete driver', 'error');
    } finally {
      setShowDeleteConfirmModal(false);
      setSelectedDriver(null);
    }
  };

  const confirmDeactivateDriver = async () => {
    if (!selectedDriver) return;
    
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/v1/drivers/${selectedDriver.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        // Update the driver's status to inactive instead of removing from list
        setDrivers(prev => prev.map(d => 
          d.id === selectedDriver.id ? { ...d, isActive: false } : d
        ));
        showAlert('Success', 'Driver deactivated successfully!', 'success');
      } else {
        const errorData = await response.json();
        showAlert('Error', `Failed to deactivate driver: ${errorData.message || 'Unknown error'}`, 'error');
      }
    } catch (error) {
      console.error('Error deactivating driver:', error);
      showAlert('Error', 'Failed to deactivate driver', 'error');
    } finally {
      setShowDeactivateConfirmModal(false);
      setSelectedDriver(null);
    }
  };

  const handleViewDriverImage = (driver: Driver) => {
    console.log('Viewing driver image for:', driver.firstName, driver.lastName);
    console.log('Driver profile image URL:', driver.profileImage);
    if (driver.profileImage) {
      setViewerImages([driver.profileImage]);
      setViewerIndex(0);
      setShowImageViewer(true);
    } else {
      showAlert('Info', 'No profile image available for this driver', 'info');
    }
  };


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
        console.log('Rendering driver row for:', driver.firstName, driver.lastName, 'Profile image:', driver.profileImage);
        return (
          <div className="flex items-center space-x-3">
            {driver.profileImage ? (
              <img
                src={driver.profileImage}
                alt={`${driver.firstName} ${driver.lastName}`}
                className="w-10 h-10 rounded-full object-cover border border-[#5d4a15]"
                onError={(e) => {
                  console.error('Image failed to load:', driver.profileImage);
                  // Fallback to initials if image fails to load
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
                onLoad={() => {
                  console.log('Image loaded successfully:', driver.profileImage);
                }}
              />
            ) : null}
            <div className={`w-10 h-10 bg-[#5d4a15] rounded-full flex items-center justify-center text-white font-semibold ${driver.profileImage ? 'hidden' : ''}`}>
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
                className="text-orange-600"
                onClick={() => handleDeactivateDriver(row.original)}
              >
                <Clock className="mr-2 h-4 w-4" />
                Deactivate driver
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-red-600"
                onClick={() => handleDeleteDriver(row.original)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete driver
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
                <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
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
                      <label className="block text-sm font-medium mb-1">Experience (Years)</label>
                      <input
                        type="number"
                        min="0"
                        max="50"
                        value={newDriver.experience}
                        onChange={(e) => setNewDriver(prev => ({ ...prev, experience: parseInt(e.target.value) || 0 }))}
                        className="w-full p-2 border rounded-md"
                        placeholder="Enter years of experience"
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

            {/* Driver Details Modal */}
            {showDriverDetailsModal && selectedDriver && (
              <Modal
                isOpen={showDriverDetailsModal}
                onClose={() => {
                  setShowDriverDetailsModal(false);
                  setSelectedDriver(null);
                }}
                title="Driver Details"
                size="lg"
              >
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    {selectedDriver.profileImage ? (
                      <img
                        src={selectedDriver.profileImage}
                        alt={`${selectedDriver.firstName} ${selectedDriver.lastName}`}
                        className="w-20 h-20 rounded-full object-cover border-2 border-[#5d4a15]"
                        onError={(e) => {
                          console.error('Profile modal image failed to load:', selectedDriver.profileImage);
                          // Fallback to initials if image fails to load
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling?.classList.remove('hidden');
                        }}
                        onLoad={() => {
                          console.log('Profile modal image loaded successfully:', selectedDriver.profileImage);
                        }}
                      />
                    ) : null}
                    <div className={`w-20 h-20 bg-[#5d4a15] rounded-full flex items-center justify-center text-white font-semibold text-2xl ${selectedDriver.profileImage ? 'hidden' : ''}`}>
                      {selectedDriver.firstName[0]}{selectedDriver.lastName[0]}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">{selectedDriver.firstName} {selectedDriver.lastName}</h3>
                      <p className="text-gray-600">{selectedDriver.email}</p>
                      <p className="text-gray-600">{selectedDriver.phone}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-2">License Information</h4>
                      <p><strong>License Number:</strong> {selectedDriver.licenseNumber}</p>
                      <p><strong>Expiry Date:</strong> {selectedDriver.licenseExpiry}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Performance</h4>
                      <p><strong>Rating:</strong> {selectedDriver.rating}/5</p>
                      <p><strong>Experience:</strong> {selectedDriver.experience} years</p>
                      <p><strong>Total Trips:</strong> {selectedDriver.tripsCount}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Address</h4>
                    <p className="text-gray-600">{selectedDriver.address}</p>
                  </div>
                  
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowDriverDetailsModal(false);
                        setSelectedDriver(null);
                      }}
                    >
                      Close
                    </Button>
                    <Button
                      onClick={() => {
                        setShowDriverDetailsModal(false);
                        handleEditDriver(selectedDriver);
                      }}
                      className="bg-[#5d4a15] hover:bg-[#6b5618]"
                    >
                      Edit Driver
                    </Button>
                  </div>
                </div>
              </Modal>
            )}

            {/* Edit Driver Modal */}
            {showEditDriverModal && selectedDriver && (
              <Modal
                isOpen={showEditDriverModal}
                onClose={() => {
                  setShowEditDriverModal(false);
                  setSelectedDriver(null);
                  setNewDriver({
                    firstName: '',
                    lastName: '',
                    email: '',
                    phone: '',
                    licenseNumber: '',
                    licenseExpiry: '',
                    address: '',
                    experience: 0
                  });
                }}
                title="Edit Driver"
                size="lg"
              >
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
                    <label className="block text-sm font-medium mb-1">Experience (Years)</label>
                    <input
                      type="number"
                      min="0"
                      max="50"
                      value={newDriver.experience}
                      onChange={(e) => setNewDriver(prev => ({ ...prev, experience: parseInt(e.target.value) || 0 }))}
                      className="w-full p-2 border rounded-md"
                      placeholder="Enter years of experience"
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowEditDriverModal(false);
                        setSelectedDriver(null);
                        setNewDriver({
                          firstName: '',
                          lastName: '',
                          email: '',
                          phone: '',
                          licenseNumber: '',
                          licenseExpiry: '',
                          address: '',
                          experience: 0
                        });
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={async () => {
                        // Update driver logic here
                        setShowEditDriverModal(false);
                        setSelectedDriver(null);
                        showAlert('Success', 'Driver updated successfully!', 'success');
                      }}
                      className="bg-[#5d4a15] hover:bg-[#6b5618]"
                    >
                      Update Driver
                    </Button>
                  </div>
                </div>
              </Modal>
            )}

            {/* Delete Confirmation Modal */}
            <AlertModal
              isOpen={showDeleteConfirmModal}
              onClose={() => {
                setShowDeleteConfirmModal(false);
                setSelectedDriver(null);
              }}
              title="Delete Driver"
              message={`Are you sure you want to permanently delete ${selectedDriver?.firstName} ${selectedDriver?.lastName}? This action cannot be undone and will remove all driver data.`}
              type="error"
              onConfirm={confirmDeleteDriver}
              confirmText="Delete"
              cancelText="Cancel"
              showCancel={true}
            />

            {/* Deactivate Confirmation Modal */}
            <AlertModal
              isOpen={showDeactivateConfirmModal}
              onClose={() => {
                setShowDeactivateConfirmModal(false);
                setSelectedDriver(null);
              }}
              title="Deactivate Driver"
              message={`Are you sure you want to deactivate ${selectedDriver?.firstName} ${selectedDriver?.lastName}? They will no longer be available for new trips but their data will be preserved.`}
              type="warning"
              onConfirm={confirmDeactivateDriver}
              confirmText="Deactivate"
              cancelText="Cancel"
              showCancel={true}
            />

            {/* Alert Modal */}
            <AlertModal
              isOpen={alertModal.isOpen}
              onClose={() => setAlertModal({...alertModal, isOpen: false})}
              title={alertModal.title}
              message={alertModal.message}
              type={alertModal.type}
              onConfirm={alertModal.onConfirm}
              showCancel={alertModal.type === 'warning'}
              confirmText={alertModal.type === 'warning' ? 'Delete' : 'OK'}
            />
      </div>
    </AdminLayout>
  );
}