"use client";

import { useState, useEffect } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTable } from "@/components/ui/data-table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { 
  Plus,
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  Gift,
  Percent,
  Calendar,
  Users,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  MoreHorizontal,
  Route,
  Car,
  Calendar as TripIcon,
  DollarSign,
  Target,
  AlertCircle
} from "lucide-react";

interface Promotion {
  id: string;
  name: string;
  type: "discount" | "fixed" | "free";
  value: string;
  description: string;
  status: "active" | "inactive" | "expired" | "scheduled";
  startDate: string;
  endDate: string;
  usage: number;
  maxUsage: number;
  applicableRoutes: string[];
  applicableTrips: string[];
  applicableVehicles: string[];
  conditions?: {
    minBookingDays?: number;
    userType?: "new" | "existing" | "all";
    timeRestriction?: string;
  };
  createdAt: string;
}

export default function PromotionsPage() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddPromotionModal, setShowAddPromotionModal] = useState(false);
  const [showEditPromotionModal, setShowEditPromotionModal] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState<Promotion | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [newPromotion, setNewPromotion] = useState({
    name: '',
    type: 'discount' as 'discount' | 'fixed' | 'free',
    value: '',
    description: '',
    startDate: '',
    endDate: '',
    maxUsage: 100,
    applicableRoutes: [] as string[],
    applicableTrips: [] as string[],
    applicableVehicles: [] as string[],
    conditions: {
      minBookingDays: 0,
      userType: 'all' as 'new' | 'existing' | 'all',
      timeRestriction: ''
    }
  });

  const mockPromotions: Promotion[] = [
    {
      id: "PROMO-001",
      name: "Early Bird Special",
      type: "discount",
      value: "15%",
      description: "Get 15% off on bookings made 7 days in advance",
      status: "active",
      startDate: "2024-01-01",
      endDate: "2024-03-31",
      usage: 45,
      maxUsage: 100,
      applicableRoutes: ["Lagos-Abuja", "Abuja-Kaduna"],
      applicableTrips: ["TRIP-001", "TRIP-002"],
      applicableVehicles: ["VEH-001"],
      conditions: {
        minBookingDays: 7,
        userType: "all",
        timeRestriction: "weekdays"
      },
      createdAt: "2024-01-01T00:00:00Z"
    },
    {
      id: "PROMO-002",
      name: "Weekend Warrior",
      type: "fixed",
      value: "₦1,000",
      description: "Fixed discount of ₦1,000 for weekend travels",
      status: "active",
      startDate: "2024-01-15",
      endDate: "2024-02-15",
      usage: 23,
      maxUsage: 50,
      applicableRoutes: ["All Routes"],
      applicableTrips: [],
      applicableVehicles: [],
      conditions: {
        minBookingDays: 0,
        userType: "all",
        timeRestriction: "weekends"
      },
      createdAt: "2024-01-15T00:00:00Z"
    },
    {
      id: "PROMO-003",
      name: "New User Welcome",
      type: "discount",
      value: "20%",
      description: "Welcome discount for new users",
      status: "expired",
      startDate: "2023-12-01",
      endDate: "2023-12-31",
      usage: 89,
      maxUsage: 100,
      applicableRoutes: ["All Routes"],
      applicableTrips: [],
      applicableVehicles: [],
      conditions: {
        minBookingDays: 0,
        userType: "new",
        timeRestriction: ""
      },
      createdAt: "2023-12-01T00:00:00Z"
    },
    {
      id: "PROMO-004",
      name: "Holiday Special",
      type: "discount",
      value: "25%",
      description: "Special holiday discount",
      status: "scheduled",
      startDate: "2024-02-01",
      endDate: "2024-02-29",
      usage: 0,
      maxUsage: 200,
      applicableRoutes: ["Lagos-Port Harcourt", "Enugu-Lagos"],
      applicableTrips: ["TRIP-003", "TRIP-004"],
      applicableVehicles: ["VEH-002", "VEH-003"],
      conditions: {
        minBookingDays: 0,
        userType: "all",
        timeRestriction: ""
      },
      createdAt: "2024-01-20T00:00:00Z"
    }
  ];

  // Fetch promotions data
  useEffect(() => {
    fetchPromotions();
  }, []);

  const fetchPromotions = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:3003/api/v1/promotions', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setPromotions(data);
      } else {
        // Use mock data for development
        setPromotions(mockPromotions);
      }
    } catch (error) {
      console.error('Error fetching promotions:', error);
      setPromotions(mockPromotions);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPromotion = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:3003/api/v1/promotions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newPromotion)
      });

      if (response.ok) {
        const data = await response.json();
        setPromotions(prev => [...prev, data]);
        setShowAddPromotionModal(false);
        resetNewPromotion();
        alert('Promotion added successfully!');
      } else {
        // Mock add for development
        const mockPromotion: Promotion = {
          id: `PROMO-${Date.now()}`,
          ...newPromotion,
          usage: 0,
          status: new Date(newPromotion.startDate) <= new Date() ? 'active' : 'scheduled',
          createdAt: new Date().toISOString()
        };
        setPromotions(prev => [...prev, mockPromotion]);
        setShowAddPromotionModal(false);
        resetNewPromotion();
        alert('Promotion added successfully! (Mock)');
      }
    } catch (error) {
      console.error('Error adding promotion:', error);
      alert('Failed to add promotion');
    }
  };

  const handleEditPromotion = async () => {
    if (!selectedPromotion) return;

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`http://localhost:3003/api/v1/promotions/${selectedPromotion.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newPromotion)
      });

      if (response.ok) {
        const data = await response.json();
        setPromotions(prev => prev.map(p => p.id === selectedPromotion.id ? data : p));
        setShowEditPromotionModal(false);
        setSelectedPromotion(null);
        resetNewPromotion();
        alert('Promotion updated successfully!');
      } else {
        // Mock update for development
        setPromotions(prev => prev.map(p => 
          p.id === selectedPromotion.id 
            ? { ...p, ...newPromotion }
            : p
        ));
        setShowEditPromotionModal(false);
        setSelectedPromotion(null);
        resetNewPromotion();
        alert('Promotion updated successfully! (Mock)');
      }
    } catch (error) {
      console.error('Error updating promotion:', error);
      alert('Failed to update promotion');
    }
  };

  const handleDeletePromotion = (promotion: Promotion) => {
    if (confirm(`Are you sure you want to delete "${promotion.name}"?`)) {
      setPromotions(prev => prev.filter(p => p.id !== promotion.id));
      alert('Promotion deleted successfully!');
    }
  };

  const handleViewPromotion = (promotion: Promotion) => {
    setSelectedPromotion(promotion);
    setNewPromotion({
      name: promotion.name,
      type: promotion.type,
      value: promotion.value,
      description: promotion.description,
      startDate: promotion.startDate,
      endDate: promotion.endDate,
      maxUsage: promotion.maxUsage,
      applicableRoutes: promotion.applicableRoutes,
      applicableTrips: promotion.applicableTrips,
      applicableVehicles: promotion.applicableVehicles,
      conditions: promotion.conditions || {
        minBookingDays: 0,
        userType: 'all',
        timeRestriction: ''
      }
    });
    setShowEditPromotionModal(true);
  };

  const resetNewPromotion = () => {
    setNewPromotion({
      name: '',
      type: 'discount',
      value: '',
      description: '',
      startDate: '',
      endDate: '',
      maxUsage: 100,
      applicableRoutes: [],
      applicableTrips: [],
      applicableVehicles: [],
      conditions: {
        minBookingDays: 0,
        userType: 'all',
        timeRestriction: ''
      }
    });
  };

  const promotionStats = {
    total: promotions.length,
    active: promotions.filter(p => p.status === "active").length,
    scheduled: promotions.filter(p => p.status === "scheduled").length,
    expired: promotions.filter(p => p.status === "expired").length,
    totalUsage: promotions.reduce((sum, p) => sum + p.usage, 0)
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Active</Badge>;
      case "scheduled":
        return <Badge className="bg-blue-100 text-blue-800"><Clock className="h-3 w-3 mr-1" />Scheduled</Badge>;
      case "expired":
        return <Badge className="bg-red-100 text-red-800"><XCircle className="h-3 w-3 mr-1" />Expired</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "discount":
        return <Percent className="h-5 w-5 text-purple-600" />;
      case "fixed":
        return <Gift className="h-5 w-5 text-orange-600" />;
      default:
        return <Gift className="h-5 w-5 text-gray-600" />;
    }
  };

  // Data table columns
  const columns = [
    {
      accessorKey: "promotion",
      header: "Promotion",
      cell: ({ row }: { row: any }) => {
        const promotion = row.original;
        return (
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              {getTypeIcon(promotion.type)}
              <span className="font-medium">{promotion.name}</span>
            </div>
            <p className="text-sm text-gray-600">{promotion.id}</p>
          </div>
        );
      },
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }: { row: any }) => {
        const promotion = row.original;
        return (
          <div className="flex items-center gap-2">
            <span className="font-medium">{promotion.value}</span>
            <Badge variant="outline">{promotion.type}</Badge>
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }: { row: any }) => {
        const promotion = row.original;
        return getStatusBadge(promotion.status);
      },
    },
    {
      accessorKey: "usage",
      header: "Usage",
      cell: ({ row }: { row: any }) => {
        const promotion = row.original;
        const percentage = (promotion.usage / promotion.maxUsage) * 100;
        return (
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>{promotion.usage}</span>
              <span className="text-gray-500">/{promotion.maxUsage}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full" 
                style={{ width: `${Math.min(percentage, 100)}%` }}
              ></div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "period",
      header: "Period",
      cell: ({ row }: { row: any }) => {
        const promotion = row.original;
        return (
          <div className="text-sm">
            <div>{promotion.startDate}</div>
            <div className="text-gray-500">to {promotion.endDate}</div>
          </div>
        );
      },
    },
    {
      accessorKey: "applicable",
      header: "Applicable To",
      cell: ({ row }: { row: any }) => {
        const promotion = row.original;
        const total = promotion.applicableRoutes.length + promotion.applicableTrips.length + promotion.applicableVehicles.length;
        return (
          <div className="text-sm">
            <div className="flex items-center gap-1">
              <Route className="h-3 w-3" />
              <span>{promotion.applicableRoutes.length} routes</span>
            </div>
            <div className="flex items-center gap-1">
              <TripIcon className="h-3 w-3" />
              <span>{promotion.applicableTrips.length} trips</span>
            </div>
            <div className="flex items-center gap-1">
              <Car className="h-3 w-3" />
              <span>{promotion.applicableVehicles.length} vehicles</span>
            </div>
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }: { row: any }) => {
        const promotion = row.original;
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
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(promotion.id)}>
                Copy promotion ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleViewPromotion(promotion)}>
                <Eye className="mr-2 h-4 w-4" />
                View details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleViewPromotion(promotion)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit promotion
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => handleDeletePromotion(promotion)}
                className="text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete promotion
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
            <h1 className="text-3xl font-bold text-gray-900">Promotions</h1>
            <p className="text-gray-600 mt-1">Manage promotional campaigns and discounts</p>
          </div>
          <Button className="btn-golden">
            <Plus className="h-4 w-4 mr-2" />
            Create Promotion
          </Button>
        </div>

        {/* Promotion Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Promotions</CardTitle>
              <Gift className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{promotionStats.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Active</CardTitle>
              <CheckCircle className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{promotionStats.active}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Scheduled</CardTitle>
              <Clock className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{promotionStats.scheduled}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Usage</CardTitle>
              <TrendingUp className="h-5 w-5 text-[#5d4a15]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{promotionStats.totalUsage}</div>
            </CardContent>
          </Card>
        </div>

        {/* Promotions Table */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Promotional Campaigns</CardTitle>
                <CardDescription>Manage all promotional offers and discounts</CardDescription>
              </div>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search promotions..."
                    className="pl-10 w-64"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button 
                  className="btn-golden"
                  onClick={() => setShowAddPromotionModal(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Promotion
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Loading promotions...</div>
            ) : (
              <DataTable 
                columns={columns} 
                data={promotions.filter(p => 
                  p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  p.id.toLowerCase().includes(searchTerm.toLowerCase())
                )} 
                searchKey="name"
                searchPlaceholder="Search by promotion name..."
              />
            )}
          </CardContent>
        </Card>

        {/* Add Promotion Modal */}
        {showAddPromotionModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
              <h3 className="text-lg font-semibold mb-4">Create New Promotion</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Promotion Name</Label>
                    <Input
                      id="name"
                      value={newPromotion.name}
                      onChange={(e) => setNewPromotion(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter promotion name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="type">Promotion Type</Label>
                    <Select 
                      value={newPromotion.type} 
                      onValueChange={(value: 'discount' | 'fixed' | 'free') => 
                        setNewPromotion(prev => ({ ...prev, type: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="discount">Percentage Discount</SelectItem>
                        <SelectItem value="fixed">Fixed Amount</SelectItem>
                        <SelectItem value="free">Free Service</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="value">Discount Value</Label>
                    <Input
                      id="value"
                      value={newPromotion.value}
                      onChange={(e) => setNewPromotion(prev => ({ ...prev, value: e.target.value }))}
                      placeholder={newPromotion.type === 'discount' ? '15%' : '₦1,000'}
                    />
                  </div>
                  <div>
                    <Label htmlFor="maxUsage">Maximum Usage</Label>
                    <Input
                      id="maxUsage"
                      type="number"
                      value={newPromotion.maxUsage}
                      onChange={(e) => setNewPromotion(prev => ({ ...prev, maxUsage: parseInt(e.target.value) || 0 }))}
                      placeholder="100"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newPromotion.description}
                    onChange={(e) => setNewPromotion(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Enter promotion description"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={newPromotion.startDate}
                      onChange={(e) => setNewPromotion(prev => ({ ...prev, startDate: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={newPromotion.endDate}
                      onChange={(e) => setNewPromotion(prev => ({ ...prev, endDate: e.target.value }))}
                    />
                  </div>
                </div>

                {/* Applicable To Section */}
                <div className="space-y-4">
                  <h4 className="font-medium">Applicable To</h4>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label>Routes</Label>
                      <div className="space-y-2 mt-2">
                        {['Lagos-Abuja', 'Abuja-Kaduna', 'Lagos-Port Harcourt', 'Enugu-Lagos'].map(route => (
                          <div key={route} className="flex items-center space-x-2">
                            <Checkbox
                              id={`route-${route}`}
                              checked={newPromotion.applicableRoutes.includes(route)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setNewPromotion(prev => ({
                                    ...prev,
                                    applicableRoutes: [...prev.applicableRoutes, route]
                                  }));
                                } else {
                                  setNewPromotion(prev => ({
                                    ...prev,
                                    applicableRoutes: prev.applicableRoutes.filter(r => r !== route)
                                  }));
                                }
                              }}
                            />
                            <Label htmlFor={`route-${route}`} className="text-sm">{route}</Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label>Trips</Label>
                      <div className="space-y-2 mt-2">
                        {['TRIP-001', 'TRIP-002', 'TRIP-003', 'TRIP-004'].map(trip => (
                          <div key={trip} className="flex items-center space-x-2">
                            <Checkbox
                              id={`trip-${trip}`}
                              checked={newPromotion.applicableTrips.includes(trip)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setNewPromotion(prev => ({
                                    ...prev,
                                    applicableTrips: [...prev.applicableTrips, trip]
                                  }));
                                } else {
                                  setNewPromotion(prev => ({
                                    ...prev,
                                    applicableTrips: prev.applicableTrips.filter(t => t !== trip)
                                  }));
                                }
                              }}
                            />
                            <Label htmlFor={`trip-${trip}`} className="text-sm">{trip}</Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label>Vehicles</Label>
                      <div className="space-y-2 mt-2">
                        {['VEH-001', 'VEH-002', 'VEH-003', 'VEH-004'].map(vehicle => (
                          <div key={vehicle} className="flex items-center space-x-2">
                            <Checkbox
                              id={`vehicle-${vehicle}`}
                              checked={newPromotion.applicableVehicles.includes(vehicle)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setNewPromotion(prev => ({
                                    ...prev,
                                    applicableVehicles: [...prev.applicableVehicles, vehicle]
                                  }));
                                } else {
                                  setNewPromotion(prev => ({
                                    ...prev,
                                    applicableVehicles: prev.applicableVehicles.filter(v => v !== vehicle)
                                  }));
                                }
                              }}
                            />
                            <Label htmlFor={`vehicle-${vehicle}`} className="text-sm">{vehicle}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Conditions Section */}
                <div className="space-y-4">
                  <h4 className="font-medium">Conditions</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="minBookingDays">Min Booking Days</Label>
                      <Input
                        id="minBookingDays"
                        type="number"
                        value={newPromotion.conditions.minBookingDays}
                        onChange={(e) => setNewPromotion(prev => ({
                          ...prev,
                          conditions: { ...prev.conditions, minBookingDays: parseInt(e.target.value) || 0 }
                        }))}
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <Label htmlFor="userType">User Type</Label>
                      <Select 
                        value={newPromotion.conditions.userType} 
                        onValueChange={(value: 'new' | 'existing' | 'all') => 
                          setNewPromotion(prev => ({
                            ...prev,
                            conditions: { ...prev.conditions, userType: value }
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Users</SelectItem>
                          <SelectItem value="new">New Users Only</SelectItem>
                          <SelectItem value="existing">Existing Users Only</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="timeRestriction">Time Restriction</Label>
                      <Select 
                        value={newPromotion.conditions.timeRestriction} 
                        onValueChange={(value) => 
                          setNewPromotion(prev => ({
                            ...prev,
                            conditions: { ...prev.conditions, timeRestriction: value }
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">No Restriction</SelectItem>
                          <SelectItem value="weekdays">Weekdays Only</SelectItem>
                          <SelectItem value="weekends">Weekends Only</SelectItem>
                          <SelectItem value="morning">Morning Only</SelectItem>
                          <SelectItem value="evening">Evening Only</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end space-x-2 mt-6">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowAddPromotionModal(false);
                    resetNewPromotion();
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddPromotion}
                  className="bg-[#5d4a15] hover:bg-[#6b5618]"
                >
                  Create Promotion
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Promotion Modal */}
        {showEditPromotionModal && selectedPromotion && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
              <h3 className="text-lg font-semibold mb-4">Edit Promotion</h3>
              <div className="space-y-4">
                {/* Same form fields as Add Promotion Modal */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-name">Promotion Name</Label>
                    <Input
                      id="edit-name"
                      value={newPromotion.name}
                      onChange={(e) => setNewPromotion(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter promotion name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-type">Promotion Type</Label>
                    <Select 
                      value={newPromotion.type} 
                      onValueChange={(value: 'discount' | 'fixed' | 'free') => 
                        setNewPromotion(prev => ({ ...prev, type: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="discount">Percentage Discount</SelectItem>
                        <SelectItem value="fixed">Fixed Amount</SelectItem>
                        <SelectItem value="free">Free Service</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-value">Discount Value</Label>
                    <Input
                      id="edit-value"
                      value={newPromotion.value}
                      onChange={(e) => setNewPromotion(prev => ({ ...prev, value: e.target.value }))}
                      placeholder={newPromotion.type === 'discount' ? '15%' : '₦1,000'}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-maxUsage">Maximum Usage</Label>
                    <Input
                      id="edit-maxUsage"
                      type="number"
                      value={newPromotion.maxUsage}
                      onChange={(e) => setNewPromotion(prev => ({ ...prev, maxUsage: parseInt(e.target.value) || 0 }))}
                      placeholder="100"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="edit-description">Description</Label>
                  <Textarea
                    id="edit-description"
                    value={newPromotion.description}
                    onChange={(e) => setNewPromotion(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Enter promotion description"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-startDate">Start Date</Label>
                    <Input
                      id="edit-startDate"
                      type="date"
                      value={newPromotion.startDate}
                      onChange={(e) => setNewPromotion(prev => ({ ...prev, startDate: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-endDate">End Date</Label>
                    <Input
                      id="edit-endDate"
                      type="date"
                      value={newPromotion.endDate}
                      onChange={(e) => setNewPromotion(prev => ({ ...prev, endDate: e.target.value }))}
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end space-x-2 mt-6">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowEditPromotionModal(false);
                    setSelectedPromotion(null);
                    resetNewPromotion();
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleEditPromotion}
                  className="bg-[#5d4a15] hover:bg-[#6b5618]"
                >
                  Update Promotion
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
