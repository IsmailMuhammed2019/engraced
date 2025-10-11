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
  // Major Cities
  "Lagos", "Abuja", "Port Harcourt", "Kano", "Ibadan", "Kaduna", "Enugu", 
  "Aba", "Jos", "Ilorin", "Oyo", "Abakaliki", "Abeokuta", "Sokoto", "Onitsha",
  // State Capitals
  "Uyo", "Yenagoa", "Maiduguri", "Calabar", "Asaba", "Benin City", "Abakaliki",
  "Bauchi", "Yola", "Gombe", "Owerri", "Dutse", "Lokoja", "Lafia", "Minna",
  "Akure", "Osogbo", "Ikeja", "Ado Ekiti", "Gusau", "Jalingo", "Damaturu",
  "Birnin Kebbi", "Katsina", "Keffi", "Markurdi", "Ekiti", "Umuahia"
].sort();

export default function BookingForm() {
  const [isRoundTrip, setIsRoundTrip] = useState(false);
  const [formData, setFormData] = useState({
    from: "",
    to: "",
    departureDate: "",
    returnDate: "",
    passengers: "1",
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
    });

    if (isRoundTrip && formData.returnDate) {
      searchParams.append('returnDate', formData.returnDate);
    }

    // Redirect to routes page with search parameters
    window.location.href = `/routes?${searchParams.toString()}`;
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
      id="booking-form"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-md"
    >
      <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm rounded-2xl overflow-hidden">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-xl font-bold text-gray-900">
            <Search className="h-5 w-5 text-[#5d4a15]" />
            Quick Booking
          </CardTitle>
          <p className="text-sm text-gray-600 leading-relaxed mt-2">
            Search routes, choose a date and secure your seat in minutes.
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
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

            {/* From and To - Full Width */}
            <div className="space-y-3">
              <div className="w-full">
                <Label htmlFor="from" className="text-sm font-semibold text-gray-700 mb-2 block">
                  From
                </Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                  <Select value={formData.from} onValueChange={(value) => handleInputChange("from", value)}>
                    <SelectTrigger className="w-full pl-10 h-12 rounded-xl border-gray-200 focus:border-[#5d4a15] focus:ring-[#5d4a15] transition-all duration-200">
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

              {/* Swap Button - Positioned between the two fields */}
              <div className="flex justify-center -my-1">
                <button
                  type="button"
                  onClick={swapLocations}
                  className="p-2 hover:bg-gray-100 rounded-full transition-all duration-200 hover:scale-110 bg-white border border-gray-200 shadow-sm"
                  title="Swap locations"
                >
                  <ArrowRightLeft className="h-4 w-4 text-[#5d4a15]" />
                </button>
              </div>

              <div className="w-full">
                <Label htmlFor="to" className="text-sm font-semibold text-gray-700 mb-2 block">
                  To
                </Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                  <Select value={formData.to} onValueChange={(value) => handleInputChange("to", value)}>
                    <SelectTrigger className="w-full pl-10 h-12 rounded-xl border-gray-200 focus:border-[#5d4a15] focus:ring-[#5d4a15] transition-all duration-200">
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
            <div className={`grid ${isRoundTrip ? 'grid-cols-2' : 'grid-cols-1'} gap-4`}>
              <div>
                <Label htmlFor="departureDate" className="text-sm font-semibold text-gray-700 mb-2 block">
                  Departure Date
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
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
                    Return Date
                  </Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
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

            {/* Passengers */}
            <div>
              <Label htmlFor="passengers" className="text-sm font-semibold text-gray-700 mb-2 block">
                Number of Passengers
              </Label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                <Select value={formData.passengers} onValueChange={(value) => handleInputChange("passengers", value)}>
                  <SelectTrigger className="pl-10 h-12 rounded-xl border-gray-200 focus:border-[#5d4a15] focus:ring-[#5d4a15] transition-all duration-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num} {num === 1 ? "Passenger" : "Passengers"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-12 text-base font-semibold bg-[#5d4a15] hover:bg-[#6b5618] text-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center"
            >
              <Search className="h-4 w-4 mr-2" />
              Search Trips
            </Button>

            {/* Additional Info */}
            <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 rounded-lg p-4">
              <Clock className="h-3 w-3 text-[#5d4a15] flex-shrink-0" />
              <span className="font-medium">Free cancellations up to 24 hours before departure</span>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
