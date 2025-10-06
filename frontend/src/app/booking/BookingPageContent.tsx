"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  Users, 
  CreditCard, 
  Shield, 
  CheckCircle, 
  AlertCircle,
  User,
  Phone,
  Mail,
  Calendar,
  Bus,
  Star,
  Wifi,
  Coffee,
  Battery,
  Navigation,
  Timer,
  DollarSign,
  Eye,
  EyeOff,
  Lock,
  Key,
  Gift,
  Award,
  Heart,
  MessageCircle,
  HelpCircle,
  RefreshCw,
  Loader2,
  X,
  Plus,
  Minus,
  ShoppingCart,
  BookOpen
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SeatSelectionModal from "@/components/SeatSelectionModal";

interface TripDetails {
  id: string;
  from: string;
  to: string;
  departureTime: string;
  arrivalTime: string;
  date: string;
  duration: string;
  price: number;
  originalPrice?: number;
  availableSeats: number;
  totalSeats: number;
  vehicle: {
    make: string;
    model: string;
    plateNumber: string;
    capacity: number;
    features: string[];
  };
  driver: {
    name: string;
    phone: string;
    rating: number;
    experience: number;
  };
  amenities: string[];
  status: "scheduled" | "boarding" | "departed" | "completed" | "cancelled";
  rating: number;
  reviews: number;
  vehicleType: string;
  isActive: boolean;
  createdAt: string;
}

interface SelectedSeat {
  id: string;
  number: string;
  type: "window" | "middle" | "aisle";
  price: number;
}

interface PassengerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  emergencyContact: string;
  emergencyPhone: string;
  specialRequests?: string;
}

export default function BookingPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [tripDetails, setTripDetails] = useState<TripDetails | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<SelectedSeat[]>([]);
  const [passengerInfo, setPassengerInfo] = useState<PassengerInfo>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    emergencyContact: "",
    emergencyPhone: "",
    specialRequests: ""
  });
  const [isSeatSelectionOpen, setIsSeatSelectionOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get trip details from URL parameters
    const tripId = searchParams.get("tripId");
    const from = searchParams.get("from");
    const to = searchParams.get("to");
    const date = searchParams.get("date");
    const seats = searchParams.get("seats");

    if (tripId) {
      fetchTripDetails(tripId);
    } else {
      // Mock trip details for demonstration
      setTripDetails({
        id: "1",
        from: from || "Lagos",
        to: to || "Abuja",
        departureTime: "08:00",
        arrivalTime: "16:30",
        date: date || new Date().toISOString().split('T')[0],
        duration: "8h 30m",
        price: 15000,
        originalPrice: 18000,
        availableSeats: 12,
        totalSeats: 30,
        vehicle: {
          make: "Toyota",
          model: "Sienna",
          plateNumber: "ABC123XY",
          capacity: 30,
          features: ["AC", "WiFi", "USB Charging", "Reclining Seats"]
        },
        driver: {
          name: "John Doe",
          phone: "+2348071116229",
          rating: 4.8,
          experience: 5
        },
        amenities: ["Wi-Fi", "Refreshments", "Comfortable Seats", "USB Charging"],
        status: "scheduled",
        rating: 4.8,
        reviews: 1240,
        vehicleType: "Premium",
        isActive: true,
        createdAt: new Date().toISOString()
      });
    }

    if (seats) {
      // Parse selected seats from URL
      const seatIds = seats.split(',');
      // Mock selected seats
      setSelectedSeats(seatIds.map((id, index) => ({
        id,
        number: `A${index + 1}`,
        type: "window" as const,
        price: 15000
      })));
    }

    setLoading(false);
  }, [searchParams]);

  const fetchTripDetails = async (tripId: string) => {
    try {
      const response = await fetch(`http://localhost:3003/api/v1/trips/${tripId}`);
      if (response.ok) {
        const data = await response.json();
        setTripDetails(data);
      }
    } catch (error) {
      console.error('Error fetching trip details:', error);
    }
  };

  const handleSeatSelection = (seats: { id: string; number: string; price: number }[]) => {
    const selectedSeats: SelectedSeat[] = seats.map(seat => ({
      id: seat.id,
      number: seat.number,
      type: "window" as const,
      price: seat.price
    }));
    setSelectedSeats(selectedSeats);
    setIsSeatSelectionOpen(false);
  };

  const handlePassengerInfoChange = (field: string, value: string) => {
    setPassengerInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleBooking = async () => {
    if (!tripDetails || selectedSeats.length === 0) {
      alert('Please select seats and fill in passenger information');
      return;
    }

    try {
      // Calculate total amount
      const totalAmount = tripDetails.price + selectedSeats.reduce((sum, seat) => sum + seat.price, 0);
      
      // Generate unique reference
      const reference = `BOOK_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Initialize payment with Paystack
      const response = await fetch('/api/payments/initialize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: totalAmount,
          email: passengerInfo.email,
          reference,
          callback_url: `${window.location.origin}/booking/success`,
          metadata: {
            tripId: tripDetails.id,
            from: tripDetails.from,
            to: tripDetails.to,
            date: tripDetails.date,
            time: tripDetails.departureTime,
            seats: selectedSeats.map(seat => seat.number),
            passengerName: `${passengerInfo.firstName} ${passengerInfo.lastName}`,
            phone: passengerInfo.phone
          }
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Redirect to Paystack payment page
        window.location.href = data.data.authorization_url;
      } else {
        alert('Failed to initialize payment. Please try again.');
      }
    } catch (error) {
      console.error('Payment initialization error:', error);
      alert('An error occurred. Please try again.');
    }
  };

  if (loading) {
  return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#5d4a15]"></div>
          <p className="mt-4 text-gray-600">Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (!tripDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Trip Not Found</h2>
          <p className="text-gray-600 mb-4">The requested trip could not be found.</p>
          <Button onClick={() => router.push('/trips')} className="bg-[#5d4a15] hover:bg-[#6b5618]">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Trips
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep >= 1 ? 'bg-[#5d4a15] text-white' : 'bg-gray-300 text-gray-600'}`}>
                {currentStep > 1 ? <CheckCircle className="h-5 w-5" /> : '1'}
              </div>
              <span className={`text-sm font-medium ${currentStep >= 1 ? 'text-[#5d4a15]' : 'text-gray-500'}`}>
                Select Seats
              </span>
            </div>
            
            <div className="flex-1 h-0.5 bg-gray-300 mx-4"></div>
            
            <div className="flex items-center space-x-4">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep >= 2 ? 'bg-[#5d4a15] text-white' : 'bg-gray-300 text-gray-600'}`}>
                {currentStep > 2 ? <CheckCircle className="h-5 w-5" /> : '2'}
              </div>
              <span className={`text-sm font-medium ${currentStep >= 2 ? 'text-[#5d4a15]' : 'text-gray-500'}`}>
                Passenger Info
              </span>
            </div>
            
            <div className="flex-1 h-0.5 bg-gray-300 mx-4"></div>
            
            <div className="flex items-center space-x-4">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep >= 3 ? 'bg-[#5d4a15] text-white' : 'bg-gray-300 text-gray-600'}`}>
                3
              </div>
              <span className={`text-sm font-medium ${currentStep >= 3 ? 'text-[#5d4a15]' : 'text-gray-500'}`}>
                Payment
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Trip Details */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-[#5d4a15]" />
                  Trip Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">{tripDetails.from} to {tripDetails.to}</h3>
                      <p className="text-gray-600">{tripDetails.date} • {tripDetails.departureTime} - {tripDetails.arrivalTime}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-[#5d4a15]">₦{tripDetails.price.toLocaleString()}</p>
                      {tripDetails.originalPrice && (
                        <p className="text-sm text-gray-500 line-through">₦{tripDetails.originalPrice.toLocaleString()}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Bus className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{tripDetails.vehicle.make} {tripDetails.vehicle.model}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{tripDetails.driver.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{tripDetails.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{tripDetails.availableSeats} seats available</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Step Content */}
            {currentStep === 1 && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Select Your Seats</CardTitle>
                  <CardDescription>
                    Choose your preferred seats for this journey
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Bus className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Seat Selection</h3>
                    <p className="text-gray-600 mb-4">Click the button below to open the seat selection interface</p>
                    <Button 
                      onClick={() => setIsSeatSelectionOpen(true)}
                      className="bg-[#5d4a15] hover:bg-[#6b5618]"
                    >
                      <Users className="h-4 w-4 mr-2" />
                      Select Seats
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {currentStep === 2 && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Passenger Information</CardTitle>
                  <CardDescription>
                    Please provide your contact details
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={passengerInfo.firstName}
                        onChange={(e) => handlePassengerInfoChange('firstName', e.target.value)}
                        placeholder="Enter your first name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={passengerInfo.lastName}
                        onChange={(e) => handlePassengerInfoChange('lastName', e.target.value)}
                        placeholder="Enter your last name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={passengerInfo.email}
                        onChange={(e) => handlePassengerInfoChange('email', e.target.value)}
                        placeholder="Enter your email"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={passengerInfo.phone}
                        onChange={(e) => handlePassengerInfoChange('phone', e.target.value)}
                        placeholder="Enter your phone number"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {currentStep === 3 && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Payment</CardTitle>
                  <CardDescription>
                    Complete your booking with secure Paystack payment
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Payment Summary */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-3">Payment Summary</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Base Price</span>
                          <span>₦{tripDetails?.price.toLocaleString()}</span>
                        </div>
                        {selectedSeats.length > 0 && (
                          <div className="flex justify-between">
                            <span>Selected Seats ({selectedSeats.length})</span>
                            <span>₦{selectedSeats.reduce((sum, seat) => sum + seat.price, 0).toLocaleString()}</span>
                          </div>
                        )}
                        <div className="border-t pt-2">
                          <div className="flex justify-between font-semibold">
                            <span>Total Amount</span>
                            <span>₦{((tripDetails?.price || 0) + selectedSeats.reduce((sum, seat) => sum + seat.price, 0)).toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Payment Methods */}
                    <div>
                      <h4 className="font-semibold mb-3">Payment Method</h4>
                      <div className="flex items-center space-x-4 p-4 border rounded-lg bg-green-50 border-green-200">
                        <div className="w-12 h-8 bg-green-600 rounded flex items-center justify-center">
                          <span className="text-white font-bold text-sm">PS</span>
                        </div>
                        <div>
                          <p className="font-medium">Paystack</p>
                          <p className="text-sm text-gray-600">Secure payment with cards, bank transfer, and mobile money</p>
                        </div>
                      </div>
                    </div>

                    {/* Security Notice */}
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="flex items-start space-x-3">
                        <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-blue-900">Secure Payment</p>
                          <p className="text-sm text-blue-700">
                            Your payment is processed securely by Paystack. We don't store your card details.
                          </p>
                        </div>
                      </div>
                    </div>

                    <Button 
                      onClick={handleBooking}
                      className="w-full bg-[#5d4a15] hover:bg-[#6b5618]"
                      size="lg"
                    >
                      <CreditCard className="h-5 w-5 mr-2" />
                      Pay with Paystack
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Base Price</span>
                    <span>₦{tripDetails.price.toLocaleString()}</span>
                  </div>
                  {selectedSeats.length > 0 && (
                    <div className="flex justify-between">
                      <span>Selected Seats ({selectedSeats.length})</span>
                      <span>₦{(selectedSeats.reduce((sum, seat) => sum + seat.price, 0)).toLocaleString()}</span>
                    </div>
                  )}
                  <div className="border-t pt-4">
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span>₦{(tripDetails.price + selectedSeats.reduce((sum, seat) => sum + seat.price, 0)).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          
          <Button
            onClick={() => setCurrentStep(Math.min(3, currentStep + 1))}
            disabled={currentStep === 3}
            className="bg-[#5d4a15] hover:bg-[#6b5618]"
          >
            Next
            <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
          </Button>
        </div>
      </div>

      {/* Seat Selection Modal */}
      {tripDetails && (
        <SeatSelectionModal
          isOpen={isSeatSelectionOpen}
          onClose={() => setIsSeatSelectionOpen(false)}
          vehicle={{
            id: tripDetails.vehicle.make,
            make: tripDetails.vehicle.make,
            model: tripDetails.vehicle.model,
            plateNumber: tripDetails.vehicle.plateNumber,
            capacity: tripDetails.vehicle.capacity,
            layout: {
              rows: Math.ceil(tripDetails.vehicle.capacity / 4),
              columns: 4,
              totalSeats: tripDetails.vehicle.capacity
            }
          }}
          tripId={tripDetails.id}
          onSeatsSelected={handleSeatSelection}
        />
      )}

      <Footer />
    </div>
  );
}