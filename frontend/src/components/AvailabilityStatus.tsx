"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Users, 
  Bus,
  TrendingUp,
  TrendingDown,
  Zap,
  Shield,
  Star
} from "lucide-react";

interface AvailabilityStatusProps {
  availableSeats: number;
  totalSeats: number;
  showDetails?: boolean;
  className?: string;
}

export default function AvailabilityStatus({ 
  availableSeats, 
  totalSeats, 
  showDetails = false,
  className = "" 
}: AvailabilityStatusProps) {
  const [status, setStatus] = useState<{
    type: "available" | "almost-full" | "fully-booked" | "limited";
    label: string;
    color: string;
    bgColor: string;
    icon: React.ComponentType<{ className?: string }>;
    percentage: number;
  }>({
    type: "available",
    label: "Available",
    color: "text-green-600",
    bgColor: "bg-green-100",
    icon: CheckCircle,
    percentage: 100
  });

  useEffect(() => {
    const percentage = (availableSeats / totalSeats) * 100;
    
    if (availableSeats === 0) {
      setStatus({
        type: "fully-booked",
        label: "Fully Booked",
        color: "text-red-600",
        bgColor: "bg-red-100",
        icon: AlertCircle,
        percentage: 0
      });
    } else if (percentage <= 10) {
      setStatus({
        type: "almost-full",
        label: "Almost Full",
        color: "text-orange-600",
        bgColor: "bg-orange-100",
        icon: Clock,
        percentage
      });
    } else if (percentage <= 25) {
      setStatus({
        type: "limited",
        label: "Limited Seats",
        color: "text-yellow-600",
        bgColor: "bg-yellow-100",
        icon: Users,
        percentage
      });
    } else {
      setStatus({
        type: "available",
        label: "Available",
        color: "text-green-600",
        bgColor: "bg-green-100",
        icon: CheckCircle,
        percentage
      });
    }
  }, [availableSeats, totalSeats]);

  const getStatusIcon = () => {
    const Icon = status.icon;
    return <Icon className="h-4 w-4" />;
  };

  const getProgressBarColor = () => {
    switch (status.type) {
      case "fully-booked":
        return "bg-red-500";
      case "almost-full":
        return "bg-orange-500";
      case "limited":
        return "bg-yellow-500";
      case "available":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center gap-2">
        <Badge className={`${status.bgColor} ${status.color} border-0`}>
          {getStatusIcon()}
          <span className="ml-1">{status.label}</span>
        </Badge>
        <span className="text-sm text-gray-600">
          {availableSeats} of {totalSeats} seats
        </span>
      </div>
      
      {showDetails && (
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-gray-600">
            <span>Availability</span>
            <span>{status.percentage.toFixed(0)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${getProgressBarColor()}`}
              style={{ width: `${status.percentage}%` }}
            />
          </div>
          
          {status.type === "almost-full" && (
            <div className="flex items-center gap-1 text-xs text-orange-600">
              <Zap className="h-3 w-3" />
              <span>Book quickly - only {availableSeats} seats left!</span>
            </div>
          )}
          
          {status.type === "fully-booked" && (
            <div className="flex items-center gap-1 text-xs text-red-600">
              <AlertCircle className="h-3 w-3" />
              <span>This trip is fully booked</span>
            </div>
          )}
          
          {status.type === "limited" && (
            <div className="flex items-center gap-1 text-xs text-yellow-600">
              <Shield className="h-3 w-3" />
              <span>Limited availability - book soon!</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
