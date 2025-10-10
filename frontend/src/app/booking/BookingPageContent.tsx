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

interface Promotion {
  id: string;
  title: string;
  description: string;
  type: string;
  value: number;
  code?: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  usedCount: number;
  usageLimit?: number;
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
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [selectedPromotion, setSelectedPromotion] = useState<Promotion | null>(null);
  const [promotionCode, setPromotionCode] = useState("");
  const [isSeatSelectionOpen, setIsSeatSelectionOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBookingData = async () => {
      // Get trip details from URL parameters
      const tripId = searchParams.get("tripId");
      const from = searchParams.get("from");
      const to = searchParams.get("to");
      const date = searchParams.get("date");
      const seats = searchParams.get("seats");

      if (tripId) {
        await fetchTripDetails(tripId);
        
        if (seats) {
          // Parse selected seats from URL
          const seatIds = seats.split(',');
          await fetchSeatDetails(tripId, seatIds);
        }
      }

      // Fetch promotions
      await fetchPromotions();

      // Check for selected promotion from localStorage
      const storedPromotion = localStorage.getItem('selectedPromotion');
      if (storedPromotion) {
        setSelectedPromotion(JSON.parse(storedPromotion));
        setPromotionCode(JSON.parse(storedPromotion).code);
        localStorage.removeItem('selectedPromotion');
      }

      setLoading(false);
    };

    loadBookingData();
  }, [searchParams]);

  const fetchTripDetails = async (tripId: string) => {
    try {
      const response = await fetch(`https://engracedsmile.com/api/v1/trips/${tripId}`);
      if (response.ok) {
        const trip = await response.json();
        
        // Calculate available seats from trip data
        const bookedSeats = trip.seats?.filter((s: any) => s.isBooked).length || 0;
        const totalSeats = trip.maxPassengers || 7;
        const availableSeats = totalSeats - bookedSeats;
        
        // Transform trip data to match TripDetails interface
        setTripDetails({
          id: trip.id,
          from: trip.route.from,
          to: trip.route.to,
          departureTime: new Date(trip.departureTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
          arrivalTime: new Date(trip.arrivalTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
          date: new Date(trip.departureTime).toISOString().split('T')[0],
          duration: `${Math.floor((new Date(trip.arrivalTime).getTime() - new Date(trip.departureTime).getTime()) / (1000 * 60 * 60))}h`,
          price: trip.price,
          originalPrice: undefined,
          availableSeats: availableSeats,
          totalSeats: totalSeats,
          vehicle: {
            make: trip.vehicle?.make || 'Toyota',
            model: trip.vehicle?.model || 'Sienna',
            plateNumber: trip.vehicle?.plateNumber || 'N/A',
            capacity: trip.vehicle?.capacity || 7,
            features: trip.vehicle?.features || []
          },
          driver: {
            name: trip.driver ? `${trip.driver.firstName} ${trip.driver.lastName}` : 'N/A',
            phone: trip.driver?.phone || 'N/A',
            rating: trip.driver?.rating || 5.0,
            experience: trip.driver?.experience || 0
          },
          amenities: trip.amenities || [],
          status: trip.status,
          rating: trip.driver?.rating || 5.0,
          reviews: trip._count?.bookings || 0,
          vehicleType: "Standard",
          isActive: trip.status === 'ACTIVE',
          createdAt: trip.createdAt
        });
      } else {
        console.error('Failed to fetch trip details');
      }
    } catch (error) {
      console.error('Error fetching trip details:', error);
    }
  };

  const fetchSeatDetails = async (tripId: string, seatIds: string[]) => {
    try {
      const response = await fetch(`https://engracedsmile.com/api/v1/trips/${tripId}/seats`);
      if (response.ok) {
        const allSeats = await response.json();
        const selected = allSeats.filter((seat: any) => seatIds.includes(seat.id));
        setSelectedSeats(selected.map((seat: any) => ({
          id: seat.id,
          number: seat.seatNumber,
          type: "window" as const,
          price: tripDetails?.price || 0
        })));
      }
    } catch (error) {
      console.error('Error fetching seat details:', error);
    }
  };

  const fetchPromotions = async () => {
    try {
      const response = await fetch('https://engracedsmile.com/api/v1/promotions/active');
      if (response.ok) {
        const data = await response.json();
        setPromotions(data);
      }
    } catch (error) {
      console.error('Error fetching promotions:', error);
      setPromotions([]);
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
    // Automatically move to passenger info step after seat selection
    setCurrentStep(2);
  };

  const handlePassengerInfoChange = (field: string, value: string) => {
    setPassengerInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePromotionCodeChange = (code: string) => {
    setPromotionCode(code);
    const promotion = promotions.find(p => p.code === code);
    setSelectedPromotion(promotion || null);
  };

  const calculateTotalAmount = () => {
    if (!tripDetails) return 0;
    
    const baseAmount = tripDetails.price * selectedSeats.length;
    
    if (selectedPromotion) {
      let discountAmount = 0;
      switch (selectedPromotion.type) {
        case 'PERCENTAGE':
          discountAmount = (baseAmount * selectedPromotion.value) / 100;
          break;
        case 'FIXED_AMOUNT':
          discountAmount = selectedPromotion.value;
          break;
        case 'FREE_RIDE':
          discountAmount = baseAmount;
          break;
      }
      return Math.max(0, baseAmount - discountAmount);
    }
    
    return baseAmount;
  };

  const getDiscountAmount = () => {
    if (!tripDetails || !selectedPromotion) return 0;
    
    const baseAmount = tripDetails.price * selectedSeats.length;
    let discountAmount = 0;
    
    switch (selectedPromotion.type) {
      case 'PERCENTAGE':
        discountAmount = (baseAmount * selectedPromotion.value) / 100;
        break;
      case 'FIXED_AMOUNT':
        discountAmount = selectedPromotion.value;
        break;
      case 'FREE_RIDE':
        discountAmount = baseAmount;
        break;
    }
    
    return discountAmount;
  };

  const handleBooking = async () => {
    if (!tripDetails || selectedSeats.length === 0) {
      alert('Please select seats before proceeding');
      return;
    }

    // Validate passenger information
    if (!passengerInfo.firstName || !passengerInfo.lastName || !passengerInfo.email || !passengerInfo.phone) {
      alert('Please fill in all passenger information fields');
      setCurrentStep(2); // Go back to passenger info step
      return;
    }

    try {
      // Calculate total amount
      const totalAmount = calculateTotalAmount();
      
      if (totalAmount <= 0) {
        alert('Invalid booking amount. Please try again.');
        return;
      }
      
      // Generate unique reference
      const reference = `BOOK_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Initialize payment with Paystack
      console.log('Initializing payment with amount:', totalAmount);
      console.log('Passenger info:', passengerInfo);
      
      const response = await fetch('/api/payments/initialize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: totalAmount,
          email: passengerInfo.email,
          firstName: passengerInfo.firstName,
          lastName: passengerInfo.lastName,
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
            phone: passengerInfo.phone,
            promotionCode: selectedPromotion?.code || null,
            promotionId: selectedPromotion?.id || null,
            discountAmount: selectedPromotion ? getDiscountAmount() : 0
          }
        }),
      });

      const data = await response.json();
      console.log('Payment initialization response:', data);

      if (response.ok && data.success) {
        // Redirect to Paystack payment page
        window.location.href = data.data.authorization_url;
      } else {
        console.error('Payment initialization failed:', data);
        alert(`Failed to initialize payment: ${data.error || data.message || 'Please try again.'}`);
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
                  {selectedSeats.length === 0 ? (
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
                  ) : (
                    <div className="space-y-4">
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          <span className="font-medium text-green-800">
                            {selectedSeats.length} Seat{selectedSeats.length > 1 ? 's' : ''} Selected
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {selectedSeats.map(seat => (
                            <Badge key={seat.id} className="bg-[#5d4a15] text-white px-3 py-1">
                              Seat {seat.number}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <Button 
                        onClick={() => setIsSeatSelectionOpen(true)}
                        variant="outline"
                        className="w-full"
                      >
                        <Users className="h-4 w-4 mr-2" />
                        Change Seats
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {currentStep === 2 && (
              <>
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

                {/* Promotion Selection */}
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Gift className="h-5 w-5" />
                      Promotions & Discounts
                    </CardTitle>
                    <CardDescription>
                      Apply a promotion code to save on your booking
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Promotion Code Input */}
                      <div>
                        <Label htmlFor="promotionCode">Promotion Code</Label>
                        <div className="flex gap-2">
                          <Input
                            id="promotionCode"
                            value={promotionCode}
                            onChange={(e) => handlePromotionCodeChange(e.target.value)}
                            placeholder="Enter promotion code"
                            className="flex-1"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              setPromotionCode("");
                              setSelectedPromotion(null);
                            }}
                          >
                            Clear
                          </Button>
                        </div>
                      </div>

                      {/* Available Promotions */}
                      {promotions && promotions.length > 0 && (
                        <div>
                          <Label className="text-sm font-medium">Available Promotions</Label>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                            {promotions.map((promo) => (
                              <div
                                key={promo.id}
                                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                                  selectedPromotion?.id === promo.id
                                    ? 'border-[#5d4a15] bg-[#5d4a15]/5'
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}
                                onClick={() => {
                                  setPromotionCode(promo.code || '');
                                  setSelectedPromotion(promo);
                                }}
                              >
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h4 className="font-medium text-sm">{promo.title}</h4>
                                    <p className="text-xs text-gray-600 mt-1">{promo.description}</p>
                                    {promo.code && (
                                      <p className="text-xs text-[#5d4a15] font-mono mt-1">
                                        Code: {promo.code}
                                      </p>
                                    )}
                                  </div>
                                  <Badge variant="outline" className="text-xs">
                                    {promo.type === 'PERCENTAGE' 
                                      ? `${promo.value}% OFF`
                                      : promo.type === 'FIXED_AMOUNT'
                                      ? `₦${promo.value} OFF`
                                      : 'FREE RIDE'
                                    }
                                  </Badge>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Selected Promotion Display */}
                      {selectedPromotion && (
                        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="font-medium text-green-800">Promotion Applied</span>
                          </div>
                          <p className="text-sm text-green-700">
                            {selectedPromotion.title} - {selectedPromotion.description}
                          </p>
                          <p className="text-sm text-green-600 mt-1">
                            Discount: {selectedPromotion.type === 'PERCENTAGE' 
                              ? `${selectedPromotion.value}% off`
                              : selectedPromotion.type === 'FIXED_AMOUNT'
                              ? `₦${selectedPromotion.value} off`
                              : 'Free ride'
                            }
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </>
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
                        
                        {/* Promotion Discount */}
                        {selectedPromotion && (
                          <>
                            <div className="flex justify-between text-green-600">
                              <span>Discount ({selectedPromotion.title})</span>
                              <span>-₦{getDiscountAmount().toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-600">
                              <span>Applied Code: {selectedPromotion.code}</span>
                              <span>{selectedPromotion.type === 'PERCENTAGE' 
                                ? `${selectedPromotion.value}% off`
                                : selectedPromotion.type === 'FIXED_AMOUNT'
                                ? `₦${selectedPromotion.value} off`
                                : 'Free ride'
                              }</span>
                            </div>
                          </>
                        )}
                        
                        <div className="border-t pt-2">
                          <div className="flex justify-between font-semibold">
                            <span>Total Amount</span>
                            <span>₦{calculateTotalAmount().toLocaleString()}</span>
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
                  {/* Trip Route */}
                  <div className="pb-3 border-b">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="h-4 w-4 text-[#5d4a15]" />
                      <span className="font-medium">{tripDetails.from} → {tripDetails.to}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="h-3 w-3" />
                      <span>{tripDetails.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                      <Clock className="h-3 w-3" />
                      <span>{tripDetails.departureTime} - {tripDetails.arrivalTime}</span>
                    </div>
                  </div>

                  {/* Selected Seats */}
                  {selectedSeats.length > 0 && (
                    <div className="pb-3 border-b">
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="h-4 w-4 text-[#5d4a15]" />
                        <span className="font-medium">Selected Seats</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {selectedSeats.map(seat => (
                          <span key={seat.id} className="text-xs bg-[#5d4a15]/10 text-[#5d4a15] px-2 py-1 rounded">
                            {seat.number}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Price Breakdown */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Price per seat</span>
                    <span>₦{tripDetails.price.toLocaleString()}</span>
                  </div>
                  {selectedSeats.length > 0 && (
                      <div className="flex justify-between text-sm">
                        <span>Number of seats</span>
                        <span>× {selectedSeats.length}</span>
                    </div>
                  )}
                    <div className="flex justify-between font-medium">
                      <span>Subtotal</span>
                      <span>₦{(tripDetails.price * Math.max(1, selectedSeats.length)).toLocaleString()}</span>
                    </div>
                    
                    {/* Promotion Discount */}
                    {selectedPromotion && selectedSeats.length > 0 && (
                      <div className="flex justify-between text-green-600 text-sm">
                        <span>Discount ({selectedPromotion.code})</span>
                        <span>-₦{getDiscountAmount().toLocaleString()}</span>
                  </div>
                    )}
                  </div>

                  {/* Total */}
                  <div className="border-t pt-3">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total Amount</span>
                      <span className="text-[#5d4a15]">
                        ₦{selectedSeats.length > 0 ? calculateTotalAmount().toLocaleString() : tripDetails.price.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Passenger Info */}
                  {currentStep >= 2 && passengerInfo.firstName && (
                    <div className="pt-3 border-t">
                      <div className="flex items-center gap-2 mb-2">
                        <User className="h-4 w-4 text-[#5d4a15]" />
                        <span className="font-medium">Passenger</span>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>{passengerInfo.firstName} {passengerInfo.lastName}</p>
                        <p>{passengerInfo.email}</p>
                        <p>{passengerInfo.phone}</p>
                      </div>
                    </div>
                  )}
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
          
          {currentStep === 1 && (
          <Button
              onClick={() => {
                if (selectedSeats.length === 0) {
                  alert('Please select at least one seat before continuing');
                  return;
                }
                setCurrentStep(2);
              }}
            className="bg-[#5d4a15] hover:bg-[#6b5618]"
          >
              Continue to Passenger Info
            <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
          </Button>
          )}
          
          {currentStep === 2 && (
            <Button
              onClick={() => {
                // Validate passenger information
                if (!passengerInfo.firstName.trim()) {
                  alert('Please enter your first name');
                  return;
                }
                if (!passengerInfo.lastName.trim()) {
                  alert('Please enter your last name');
                  return;
                }
                if (!passengerInfo.email.trim()) {
                  alert('Please enter your email address');
                  return;
                }
                // Basic email validation
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(passengerInfo.email)) {
                  alert('Please enter a valid email address');
                  return;
                }
                if (!passengerInfo.phone.trim()) {
                  alert('Please enter your phone number');
                  return;
                }
                // Phone validation (Nigerian numbers)
                const phoneRegex = /^(\+?234|0)[789]\d{9}$/;
                if (!phoneRegex.test(passengerInfo.phone.replace(/\s/g, ''))) {
                  alert('Please enter a valid Nigerian phone number (e.g., 08012345678 or +2348012345678)');
                  return;
                }
                setCurrentStep(3);
              }}
              className="bg-[#5d4a15] hover:bg-[#6b5618]"
            >
              Continue to Payment
              <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
            </Button>
          )}
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