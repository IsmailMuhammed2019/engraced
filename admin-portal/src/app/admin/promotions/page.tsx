"use client";

import AdminLayout from "@/components/layout/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
  XCircle
} from "lucide-react";

export default function PromotionsPage() {
  const promotions = [
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
      applicableRoutes: ["Lagos-Abuja", "Abuja-Kaduna"]
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
      applicableRoutes: ["All Routes"]
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
      applicableRoutes: ["All Routes"]
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
      applicableRoutes: ["Lagos-Port Harcourt", "Enugu-Lagos"]
    }
  ];

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

        {/* Search and Filters */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Promotional Campaigns</CardTitle>
                <CardDescription>Manage all promotional offers and discounts</CardDescription>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search promotions..."
                  className="pl-10 w-64"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {promotions.map((promotion) => (
                <div key={promotion.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        {getTypeIcon(promotion.type)}
                        <div>
                          <p className="font-medium text-gray-900">{promotion.name}</p>
                          <p className="text-sm text-gray-600">{promotion.id}</p>
                        </div>
                      </div>
                      {getStatusBadge(promotion.status)}
                    </div>
                    
                    <p className="text-sm text-gray-700 mb-3">{promotion.description}</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Value:</span> {promotion.value}
                      </div>
                      <div>
                        <span className="font-medium">Period:</span> {promotion.startDate} to {promotion.endDate}
                      </div>
                      <div>
                        <span className="font-medium">Usage:</span> {promotion.usage}/{promotion.maxUsage}
                      </div>
                      <div>
                        <span className="font-medium">Routes:</span> {promotion.applicableRoutes.join(", ")}
                      </div>
                    </div>
                    
                    {/* Usage Progress Bar */}
                    <div className="mt-3">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Usage Progress</span>
                        <span>{Math.round((promotion.usage / promotion.maxUsage) * 100)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-[#5d4a15] h-2 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min((promotion.usage / promotion.maxUsage) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2 ml-6">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
