"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, User, Mail, Phone, MapPin, Calendar, Clock, CreditCard, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  routeData?: {
    from: string;
    to: string;
    price: string;
    duration: string;
    departureTime: string;
    date: string;
  };
}

interface BookingFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  origin: string;
  destination: string;
  departureDate: string;
  departureTime: string;
  pricePerSeat: string;
  totalAmount: string;
}

export default function BookingModal({ isOpen, onClose, routeData }: BookingModalProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState<BookingFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    origin: routeData?.from || "",
    destination: routeData?.to || "",
    departureDate: routeData?.date || "",
    departureTime: routeData?.departureTime || "",
    pricePerSeat: routeData?.price || "50000",
    totalAmount: routeData?.price || "50000"
  });

  useEffect(() => {
    if (routeData) {
      setFormData(prev => ({
        ...prev,
        origin: routeData.from,
        destination: routeData.to,
        departureDate: routeData.date,
        departureTime: routeData.departureTime,
        pricePerSeat: routeData.price,
        totalAmount: routeData.price
      }));
    }
  }, [routeData]);

  const handleInputChange = (field: keyof BookingFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    
    try {
      // Initialize Paystack payment
      const paystackHandler = (window as unknown as { PaystackPop: { setup: (config: Record<string, unknown>) => { openIframe: () => void } } }).PaystackPop.setup({
        key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || 'pk_live_21180b30a2350563c22488227cf98e2bd7b6db2e',
        email: formData.email,
        amount: parseInt(formData.totalAmount.replace(/[₦,]/g, '')) * 100, // Convert to kobo
        currency: 'NGN',
        ref: `ENG_${Date.now()}`,
        callback: function(response: { reference: string; status: string }) {
          // Handle successful payment
          console.log('Payment successful:', response);
          
          // Store booking data in session storage for success page
          const bookingData = {
            bookingId: response.reference,
            route: `${formData.origin} → ${formData.destination}`,
            from: formData.origin,
            to: formData.destination,
            date: formData.departureDate,
            time: formData.departureTime,
            amount: formData.totalAmount,
            passengerName: `${formData.firstName} ${formData.lastName}`,
            email: formData.email,
            phone: formData.phone
          };
          
          sessionStorage.setItem('bookingData', JSON.stringify(bookingData));
          
          // Redirect to success page with URL parameters
          const params = new URLSearchParams({
            reference: response.reference,
            amount: formData.totalAmount.replace(/[₦,]/g, ''),
            route: `${formData.origin} → ${formData.destination}`,
            from: formData.origin,
            to: formData.destination,
            date: formData.departureDate,
            time: formData.departureTime,
            passengerName: `${formData.firstName} ${formData.lastName}`,
            email: formData.email,
            phone: formData.phone
          });
          
          router.push(`/booking/success?${params.toString()}`);
        },
        onClose: function() {
          // Handle payment cancellation
          console.log('Payment cancelled');
          // Redirect to failure page
          router.push('/booking/failure');
        }
      });
      
      paystackHandler.openIframe();
    } catch (error) {
      console.error('Payment error:', error);
      // Redirect to failure page
      router.push('/booking/failure');
    } finally {
      setIsProcessing(false);
    }
  };

  const formatCurrency = (amount: string) => {
    const num = parseInt(amount.replace(/[₦,]/g, ''));
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(num);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-[#5d4a15] to-[#6b5618] text-white">
            <div>
              <h2 className="text-2xl font-bold">Book Your Journey</h2>
              <p className="text-white/90">Experience seamless travel with secure payments</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white/20"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Progress Steps */}
          <div className="px-6 py-4 border-b">
            <div className="flex items-center justify-between">
              {[1, 2, 3, 4, 5].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step <= currentStep 
                      ? 'bg-[#5d4a15] text-white' 
                      : 'bg-gray-200 text-gray-500'
                  }`}>
                    {step < currentStep ? <CheckCircle className="h-4 w-4" /> : step}
                  </div>
                  {step < 5 && (
                    <div className={`w-12 h-1 mx-2 ${
                      step < currentStep ? 'bg-[#5d4a15]' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>Details</span>
              <span>Payment</span>
              <span>Confirm</span>
              <span>Success</span>
              <span>Failed</span>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 max-h-96 overflow-y-auto">
            {currentStep === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-xl font-semibold mb-4">Book Your Trip</h3>
                  <p className="text-gray-600 mb-6">Fill in your trip details and passenger information to proceed with payment</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName" className="text-sm font-medium">
                      First Name
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="firstName"
                        placeholder="Enter your first name"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="lastName" className="text-sm font-medium">
                      Last Name
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="lastName"
                        placeholder="Enter your last name"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="phone" className="text-sm font-medium">
                    Phone Number
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="phone"
                      placeholder="Enter your phone number"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="origin" className="text-sm font-medium">
                      Origin
                    </Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="origin"
                        placeholder="e.g., Abuja"
                        value={formData.origin}
                        onChange={(e) => handleInputChange("origin", e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="destination" className="text-sm font-medium">
                      Destination
                    </Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="destination"
                        placeholder="e.g., Lagos"
                        value={formData.destination}
                        onChange={(e) => handleInputChange("destination", e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="departureDate" className="text-sm font-medium">
                      Departure Date
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

                  <div>
                    <Label htmlFor="departureTime" className="text-sm font-medium">
                      Departure Time
                    </Label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="departureTime"
                        type="time"
                        value={formData.departureTime}
                        onChange={(e) => handleInputChange("departureTime", e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="pricePerSeat" className="text-sm font-medium">
                      Price per Seat (₦)
                    </Label>
                    <Input
                      id="pricePerSeat"
                      placeholder="e.g., 50000"
                      value={formData.pricePerSeat}
                      onChange={(e) => handleInputChange("pricePerSeat", e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="totalAmount" className="text-sm font-medium">
                      Total Amount (₦)
                    </Label>
                    <Input
                      id="totalAmount"
                      placeholder="Total amount to pay"
                      value={formData.totalAmount}
                      onChange={(e) => handleInputChange("totalAmount", e.target.value)}
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-xl font-semibold mb-4">Payment Details</h3>
                  <p className="text-gray-600 mb-6">Review your booking and proceed to secure payment</p>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      Booking Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Route:</span>
                      <span className="font-medium">{formData.origin} → {formData.destination}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date & Time:</span>
                      <span className="font-medium">{formData.departureDate} at {formData.departureTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Passenger:</span>
                      <span className="font-medium">{formData.firstName} {formData.lastName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email:</span>
                      <span className="font-medium">{formData.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Phone:</span>
                      <span className="font-medium">{formData.phone}</span>
                    </div>
                    <div className="border-t pt-4">
                      <div className="flex justify-between text-lg font-semibold">
                        <span>Total Amount:</span>
                        <span className="text-[#5d4a15]">{formatCurrency(formData.totalAmount)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Secure Payment:</strong> Your payment is processed securely through Paystack. 
                    We accept all major cards and bank transfers.
                  </p>
                </div>
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-center space-y-6"
              >
                <div className="w-16 h-16 bg-[#5d4a15] rounded-full flex items-center justify-center mx-auto">
                  <CreditCard className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Processing Payment</h3>
                  <p className="text-gray-600">Please wait while we process your payment securely...</p>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-[#5d4a15] h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                </div>
              </motion.div>
            )}

            {currentStep === 4 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-6"
              >
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="h-10 w-10 text-green-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-green-600 mb-2">Payment Successful!</h3>
                  <p className="text-gray-600 mb-4">Your booking has been confirmed and payment processed successfully.</p>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    Booking Reference: ENG_{Date.now()}
                  </Badge>
                </div>
                <div className="bg-green-50 p-4 rounded-lg text-left">
                  <h4 className="font-semibold text-green-800 mb-2">What&apos;s Next?</h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• You&apos;ll receive a confirmation email shortly</li>
                    <li>• Arrive at the terminal 30 minutes before departure</li>
                    <li>• Bring a valid ID for boarding</li>
                    <li>• Contact us if you need any assistance</li>
                  </ul>
                </div>
              </motion.div>
            )}

            {currentStep === 5 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-6"
              >
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                  <X className="h-10 w-10 text-red-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-red-600 mb-2">Payment Failed</h3>
                  <p className="text-gray-600 mb-4">We encountered an issue processing your payment. Please try again.</p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg text-left">
                  <h4 className="font-semibold text-red-800 mb-2">Possible Reasons:</h4>
                  <ul className="text-sm text-red-700 space-y-1">
                    <li>• Insufficient funds in your account</li>
                    <li>• Card details entered incorrectly</li>
                    <li>• Network connectivity issues</li>
                    <li>• Bank security restrictions</li>
                  </ul>
                </div>
              </motion.div>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-between p-6 border-t bg-gray-50">
            {currentStep > 1 && currentStep < 4 && (
              <Button variant="outline" onClick={handleBack}>
                Back
              </Button>
            )}
            
            <div className="flex-1" />
            
            {currentStep === 1 && (
              <Button onClick={handleNext} className="bg-[#5d4a15] hover:bg-[#6b5618]">
                Continue to Payment
              </Button>
            )}
            
            {currentStep === 2 && (
              <Button 
                onClick={handlePayment} 
                disabled={isProcessing}
                className="bg-[#5d4a15] hover:bg-[#6b5618]"
              >
                {isProcessing ? "Processing..." : "Proceed to Payment"}
              </Button>
            )}
            
            {currentStep === 4 && (
              <Button onClick={onClose} className="bg-green-600 hover:bg-green-700">
                Close
              </Button>
            )}
            
            {currentStep === 5 && (
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleBack}>
                  Try Again
                </Button>
                <Button onClick={onClose} variant="outline">
                  Close
                </Button>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
