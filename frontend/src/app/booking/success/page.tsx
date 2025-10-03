import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CheckCircle, Mail, Phone, Calendar, MapPin, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function BookingSuccessPage() {
  // In a real app, you'd get this data from URL params or API
  const bookingData = {
    bookingReference: "ENG_1703123456789",
    passengerName: "John Doe",
    email: "john.doe@example.com",
    phone: "+234 801 234 5678",
    route: "Lagos → Abuja",
    date: "2024-01-15",
    time: "06:00",
    price: "₦7,500",
    seatNumber: "A3",
    terminal: "Lagos Central Terminal"
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Success Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-green-700 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Booking Confirmed!</h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Your journey has been successfully booked. You'll receive a confirmation email shortly.
            </p>
          </div>
        </div>
      </section>

      {/* Booking Details */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Booking Card */}
              <div className="lg:col-span-2">
                <Card className="shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-[#5d4a15] to-[#6b5618] text-white">
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5" />
                      Booking Confirmation
                    </CardTitle>
                    <p className="text-white/90">Reference: {bookingData.bookingReference}</p>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      {/* Route Information */}
                      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                        <div className="w-12 h-12 bg-[#5d4a15] rounded-full flex items-center justify-center">
                          <MapPin className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{bookingData.route}</h3>
                          <p className="text-gray-600">Direct route with premium service</p>
                        </div>
                      </div>

                      {/* Travel Details */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3">
                          <Calendar className="h-5 w-5 text-gray-500" />
                          <div>
                            <p className="text-sm text-gray-500">Departure Date</p>
                            <p className="font-medium">{bookingData.date}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Clock className="h-5 w-5 text-gray-500" />
                          <div>
                            <p className="text-sm text-gray-500">Departure Time</p>
                            <p className="font-medium">{bookingData.time}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <MapPin className="h-5 w-5 text-gray-500" />
                          <div>
                            <p className="text-sm text-gray-500">Terminal</p>
                            <p className="font-medium">{bookingData.terminal}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-5 h-5 bg-[#5d4a15] rounded flex items-center justify-center">
                            <span className="text-white text-xs font-bold">S</span>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Seat Number</p>
                            <p className="font-medium">{bookingData.seatNumber}</p>
                          </div>
                        </div>
                      </div>

                      {/* Passenger Information */}
                      <div className="border-t pt-6">
                        <h4 className="font-semibold mb-4">Passenger Information</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-500">Passenger Name</p>
                            <p className="font-medium">{bookingData.passengerName}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Email</p>
                            <p className="font-medium">{bookingData.email}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Phone</p>
                            <p className="font-medium">{bookingData.phone}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Status</p>
                            <Badge className="bg-green-100 text-green-800">Confirmed</Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Price Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle>Price Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Base Fare</span>
                        <span className="font-medium">{bookingData.price}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Service Fee</span>
                        <span className="font-medium">₦0</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Insurance</span>
                        <span className="font-medium">₦0</span>
                      </div>
                      <div className="border-t pt-3">
                        <div className="flex justify-between text-lg font-bold">
                          <span>Total Paid</span>
                          <span className="text-[#5d4a15]">{bookingData.price}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Important Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Important Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Clock className="h-5 w-5 text-blue-500 mt-0.5" />
                      <div>
                        <p className="font-medium text-sm">Arrival Time</p>
                        <p className="text-gray-600 text-sm">Arrive 30 minutes before departure</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Mail className="h-5 w-5 text-blue-500 mt-0.5" />
                      <div>
                        <p className="font-medium text-sm">Confirmation Email</p>
                        <p className="text-gray-600 text-sm">Sent to {bookingData.email}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Phone className="h-5 w-5 text-blue-500 mt-0.5" />
                      <div>
                        <p className="font-medium text-sm">Support</p>
                        <p className="text-gray-600 text-sm">+234 800 ENGRAED</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button asChild className="w-full bg-[#5d4a15] hover:bg-[#6b5618]">
                    <Link href="/routes">
                      Book Another Trip
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/">
                      Back to Home
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Next Steps */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">What's Next?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">Check Your Email</h3>
                <p className="text-gray-600 text-sm">We've sent you a detailed confirmation with your ticket details.</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="font-semibold mb-2">Arrive Early</h3>
                <p className="text-gray-600 text-sm">Please arrive at the terminal 30 minutes before departure time.</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-2">Need Help?</h3>
                <p className="text-gray-600 text-sm">Contact our support team if you have any questions.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
