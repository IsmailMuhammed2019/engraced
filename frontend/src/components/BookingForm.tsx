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
    
    // Validate form data
    if (!formData.from || !formData.to || !formData.departureDate) {
      alert("Please fill in all required fields");
      return;
    }

    if (formData.from === formData.to) {
      alert("Departure and destination cannot be the same");
      return;
    }

    // Create search parameters
    const searchParams = new URLSearchParams({
      from: formData.from,
      to: formData.to,
      date: formData.departureDate,
      passengers: formData.passengers,
      class: formData.class
    });

    if (isRoundTrip && formData.returnDate) {
      searchParams.append('returnDate', formData.returnDate);
    }

    // Redirect to trips page with search parameters
    window.location.href = `/trips?${searchParams.toString()}`;
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
      <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm rounded-2xl overflow-hidden">
        <CardHeader className="pb-6 pt-12 px-6 py-6">
          <CardTitle className="flex items-center gap-2 text-xl font-bold text-gray-900 mb-3">
            <Search className="h-5 w-5 text-[#5d4a15]" />
            Quick Booking
          </CardTitle>
          <p className="text-sm text-gray-600 leading-relaxed">
            Search routes, choose a date and secure your seat in minutes.
          </p>
        </CardHeader>
        
        <CardContent className="px-6 pb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Trip Type Toggle */}
            <div className="flex bg-gray-100 rounded-xl p-1.5">
              <button
                type="button"
                onClick={() => setIsRoundTrip(false)}
                className={`flex-1 py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  !isRoundTrip
                    ? "bg-white text-[#5d4a15] shadow-md transform scale-[1.02]"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                One Way
              </button>
              <button
                type="button"
                onClick={() => setIsRoundTrip(true)}
                className={`flex-1 py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  isRoundTrip
                    ? "bg-white text-[#5d4a15] shadow-md transform scale-[1.02]"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                Round Trip
              </button>
            </div>

            {/* From and To */}
            <div className="space-y-4">
              <div className="relative">
                <Label htmlFor="from" className="text-sm font-semibold text-gray-700 mb-2 block">
                  From
                </Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Select value={formData.from} onValueChange={(value) => handleInputChange("from", value)}>
                    <SelectTrigger className="pl-10 h-12 rounded-xl border-gray-200 focus:border-[#5d4a15] focus:ring-[#5d4a15] transition-all duration-200">
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
                className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 p-2 hover:bg-gray-100 rounded-full transition-all duration-200 hover:scale-110"
              >
                <ArrowRightLeft className="h-4 w-4 text-gray-500" />
              </button>

              <div>
                <Label htmlFor="to" className="text-sm font-semibold text-gray-700 mb-2 block">
                  To
                </Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Select value={formData.to} onValueChange={(value) => handleInputChange("to", value)}>
                    <SelectTrigger className="pl-10 h-12 rounded-xl border-gray-200 focus:border-[#5d4a15] focus:ring-[#5d4a15] transition-all duration-200">
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
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="departureDate" className="text-sm font-semibold text-gray-700 mb-2 block">
                  Departure
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="departureDate"
                    type="date"
                    value={formData.departureDate}
                    onChange={(e) => handleInputChange("departureDate", e.target.value)}
                    className="pl-10 h-12 rounded-xl border-gray-200 focus:border-[#5d4a15] focus:ring-[#5d4a15] transition-all duration-200"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>

              {isRoundTrip && (
                <div>
                  <Label htmlFor="returnDate" className="text-sm font-semibold text-gray-700 mb-2 block">
                    Return
                  </Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="returnDate"
                      type="date"
                      value={formData.returnDate}
                      onChange={(e) => handleInputChange("returnDate", e.target.value)}
                      className="pl-10 h-12 rounded-xl border-gray-200 focus:border-[#5d4a15] focus:ring-[#5d4a15] transition-all duration-200"
                      min={formData.departureDate || new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Passengers and Class */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="passengers" className="text-sm font-semibold text-gray-700 mb-2 block">
                  Passengers
                </Label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Select value={formData.passengers} onValueChange={(value) => handleInputChange("passengers", value)}>
                    <SelectTrigger className="pl-10 h-12 rounded-xl border-gray-200 focus:border-[#5d4a15] focus:ring-[#5d4a15] transition-all duration-200">
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
                <Label htmlFor="class" className="text-sm font-semibold text-gray-700 mb-2 block">
                  Class
                </Label>
                <Select value={formData.class} onValueChange={(value) => handleInputChange("class", value)}>
                  <SelectTrigger className="h-12 rounded-xl border-gray-200 focus:border-[#5d4a15] focus:ring-[#5d4a15] transition-all duration-200">
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
              className="w-full py-4 text-base font-semibold bg-[#5d4a15] hover:bg-[#6b5618] pt-8 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200"
            >
              <Search className="h-4 w-4 mr-2" />
              Search Trips
            </Button>

            {/* Additional Info */}
            <div className="flex items-center gap-2 text-xs text-gray-500 pb-4bg-gray-50 rounded-lg p-4 mt-4">
              <Clock className="h-3 w-3 text-[#5d4a15]" />
              <span className="font-medium">Free cancellations up to 24 hours before departure</span>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
