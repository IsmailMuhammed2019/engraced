"use client";

import { X, MapPin, Clock, DollarSign, Users, Calendar, TrendingUp, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface Route {
  id: string;
  from: string;
  to: string;
  distance: string;
  duration: string;
  price: string;
  status: "active" | "inactive";
  bookings: number;
  lastTrip: string;
}

interface RouteDetailsModalProps {
  route: Route | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function RouteDetailsModal({ route, isOpen, onClose }: RouteDetailsModalProps) {
  if (!isOpen || !route) return null;

  const getStatusColor = (status: string) => {
    return status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800";
  };

  const getStatusIcon = (status: string) => {
    return status === "active" ? "🟢" : "⚫";
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#5d4a15] to-[#6b5618] text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">
                {route.from} → {route.to}
              </h2>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{route.distance}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{route.duration}</span>
                </div>
                <div className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4" />
                  <span>{route.price}</span>
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white/20"
            >
              <X className="h-6 w-6" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[calc(90vh-120px)] overflow-y-auto">
          {/* Route Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Route Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">From</span>
                  <span className="font-medium">{route.from}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">To</span>
                  <span className="font-medium">{route.to}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Distance</span>
                  <span className="font-medium">{route.distance}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Duration</span>
                  <span className="font-medium">{route.duration}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Price</span>
                  <span className="font-medium text-[#5d4a15]">{route.price}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Status & Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Status</span>
                  <Badge className={getStatusColor(route.status)}>
                    {getStatusIcon(route.status)} {route.status.charAt(0).toUpperCase() + route.status.slice(1)}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Bookings</span>
                  <span className="font-medium text-[#5d4a15]">{route.bookings}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Last Trip</span>
                  <span className="font-medium">{route.lastTrip}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Route ID</span>
                  <span className="font-mono text-xs text-gray-500">{route.id}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full" variant="outline">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  View Analytics
                </Button>
                <Button className="w-full" variant="outline">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  View Bookings
                </Button>
                <Button className="w-full" variant="outline">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Trips
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Route Statistics */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Route Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{route.bookings}</div>
                  <div className="text-sm text-gray-600">Total Bookings</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{route.price}</div>
                  <div className="text-sm text-gray-600">Base Price</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{route.distance}</div>
                  <div className="text-sm text-gray-600">Distance</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">{route.duration}</div>
                  <div className="text-sm text-gray-600">Duration</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Route Details */}
          <Card>
            <CardHeader>
              <CardTitle>Route Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2">Route Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Origin:</span>
                        <span className="font-medium">{route.from}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Destination:</span>
                        <span className="font-medium">{route.to}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Distance:</span>
                        <span className="font-medium">{route.distance}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Duration:</span>
                        <span className="font-medium">{route.duration}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Pricing & Status</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Price:</span>
                        <span className="font-medium text-[#5d4a15]">{route.price}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <Badge className={getStatusColor(route.status)}>
                          {getStatusIcon(route.status)} {route.status.charAt(0).toUpperCase() + route.status.slice(1)}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Bookings:</span>
                        <span className="font-medium">{route.bookings}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Last Trip:</span>
                        <span className="font-medium">{route.lastTrip}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="border-t p-6 bg-gray-50">
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button className="bg-[#5d4a15] hover:bg-[#6b5618]">
              Edit Route
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
