"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Users, MapPin, Search, ArrowRightLeft, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const cities = [
  "Lagos", "Abuja", "Port Harcourt", "Kano", "Ibadan", "Kaduna", "Enugu", 
  "Aba", "Jos", "Ilorin", "Oyo", "Abakaliki", "Abeokuta", "Sokoto", "Onitsha"
];

const travelClasses = [
  { value: "economy", label: "Economy" },
  { value: "business", label: "Business" },
  { value: "first", label: "First Class" },
];

export default function BookingForm() {
  const [isRoundTrip, setIsRoundTrip] = useState(false);
  const [formData, setFormData] = useState({
    from: "",
    to: "",
    departureDate: "",
    returnDate: "",
    passengers: "1",
    class: "economy",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Booking form submitted:", formData);
  };

  const swapLocations = () => {
    setFormData(prev => ({
      ...prev,
      from: prev.to,
      to: prev.from,
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-md"
    >
      <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Search className="h-5 w-5 text-[#5d4a15]" />
            Quick Booking
          </CardTitle>
          <p className="text-sm text-gray-600">
            Search routes, choose a date and secure your seat in minutes.
          </p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Trip Type Toggle */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                type="button"
                onClick={() => setIsRoundTrip(false)}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                  !isRoundTrip
                    ? "bg-white text-[#5d4a15] shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                One Way
              </button>
              <button
                type="button"
                onClick={() => setIsRoundTrip(true)}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                  isRoundTrip
                    ? "bg-white text-[#5d4a15] shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Round Trip
              </button>
            </div>

            {/* From and To */}
            <div className="space-y-3">
              <div className="relative">
                <Label htmlFor="from" className="text-sm font-medium">
                  From
                </Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Select value={formData.from} onValueChange={(value) => handleInputChange("from", value)}>
                    <SelectTrigger className="pl-10">
                      <SelectValue placeholder="Select departure city" />
                    </SelectTrigger>
                    <SelectContent>
                      {cities.map((city) => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Swap Button */}
              <button
                type="button"
                onClick={swapLocations}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowRightLeft className="h-4 w-4 text-gray-500" />
              </button>

              <div>
                <Label htmlFor="to" className="text-sm font-medium">
                  To
                </Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Select value={formData.to} onValueChange={(value) => handleInputChange("to", value)}>
                    <SelectTrigger className="pl-10">
                      <SelectValue placeholder="Select destination city" />
                    </SelectTrigger>
                    <SelectContent>
                      {cities.map((city) => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Date Selection */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="departureDate" className="text-sm font-medium">
                  Departure
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="departureDate"
                    type="date"
                    value={formData.departureDate}
                    onChange={(e) => handleInputChange("departureDate", e.target.value)}
                    className="pl-10"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>

              {isRoundTrip && (
                <div>
                  <Label htmlFor="returnDate" className="text-sm font-medium">
                    Return
                  </Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="returnDate"
                      type="date"
                      value={formData.returnDate}
                      onChange={(e) => handleInputChange("returnDate", e.target.value)}
                      className="pl-10"
                      min={formData.departureDate || new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Passengers and Class */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="passengers" className="text-sm font-medium">
                  Passengers
                </Label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Select value={formData.passengers} onValueChange={(value) => handleInputChange("passengers", value)}>
                    <SelectTrigger className="pl-10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num} {num === 1 ? "Passenger" : "Passengers"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="class" className="text-sm font-medium">
                  Class
                </Label>
                <Select value={formData.class} onValueChange={(value) => handleInputChange("class", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {travelClasses.map((travelClass) => (
                      <SelectItem key={travelClass.value} value={travelClass.value}>
                        {travelClass.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full py-3 text-base font-semibold"
            >
              <Search className="h-4 w-4 mr-2" />
              Search Trips
            </Button>

            {/* Additional Info */}
            <div className="flex items-center gap-2 text-xs text-gray-500 pt-2">
              <Clock className="h-3 w-3" />
              <span>Free cancellations up to 24 hours before departure</span>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
