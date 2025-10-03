import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { XCircle, RefreshCw, CreditCard, Phone, Mail, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function BookingFailurePage() {
  // In a real app, you'd get this data from URL params or API
  const failureData = {
    bookingReference: "ENG_1703123456789",
    errorCode: "PAYMENT_FAILED",
    errorMessage: "Payment could not be processed",
    route: "Lagos → Abuja",
    date: "2024-01-15",
    time: "06:00",
    price: "₦7,500"
  };

  const possibleReasons = [
    "Insufficient funds in your account",
    "Card details entered incorrectly",
    "Network connectivity issues",
    "Bank security restrictions",
    "Card expired or blocked",
    "Daily transaction limit exceeded"
  ];

  const solutions = [
    {
      icon: <CreditCard className="h-5 w-5" />,
      title: "Try Different Payment Method",
      description: "Use a different card or bank account"
    },
    {
      icon: <RefreshCw className="h-5 w-5" />,
      title: "Retry Payment",
      description: "Sometimes network issues are temporary"
    },
    {
      icon: <Phone className="h-5 w-5" />,
      title: "Contact Your Bank",
      description: "Check if your bank has blocked the transaction"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Failure Hero Section */}
      <section className="bg-gradient-to-r from-red-600 to-red-700 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircle className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Payment Failed</h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              We encountered an issue processing your payment. Don't worry, your booking details are saved.
            </p>
          </div>
        </div>
      </section>

      {/* Failure Details */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Failure Card */}
              <div className="lg:col-span-2">
                <Card className="shadow-lg border-red-200">
                  <CardHeader className="bg-gradient-to-r from-red-600 to-red-700 text-white">
                    <CardTitle className="flex items-center gap-2">
                      <XCircle className="h-5 w-5" />
                      Payment Failed
                    </CardTitle>
                    <p className="text-white/90">Reference: {failureData.bookingReference}</p>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      {/* Error Information */}
                      <div className="flex items-center gap-4 p-4 bg-red-50 rounded-lg border border-red-200">
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                          <AlertTriangle className="h-6 w-6 text-red-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg text-red-800">Payment Error</h3>
                          <p className="text-red-600">{failureData.errorMessage}</p>
                          <Badge variant="destructive" className="mt-2">Error Code: {failureData.errorCode}</Badge>
                        </div>
                      </div>

                      {/* Booking Details */}
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-semibold mb-3">Your Booking Details</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-500">Route</p>
                            <p className="font-medium">{failureData.route}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Date & Time</p>
                            <p className="font-medium">{failureData.date} at {failureData.time}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Amount</p>
                            <p className="font-medium">{failureData.price}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Status</p>
                            <Badge variant="destructive">Payment Failed</Badge>
                          </div>
                        </div>
                      </div>

                      {/* Possible Reasons */}
                      <div>
                        <h4 className="font-semibold mb-3">Possible Reasons</h4>
                        <ul className="space-y-2">
                          {possibleReasons.map((reason, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                              <span className="text-gray-600">{reason}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Solutions */}
                <Card>
                  <CardHeader>
                    <CardTitle>What You Can Do</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {solutions.map((solution, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="text-[#5d4a15] mt-0.5">
                          {solution.icon}
                        </div>
                        <div>
                          <h4 className="font-medium text-sm">{solution.title}</h4>
                          <p className="text-gray-600 text-xs">{solution.description}</p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Support Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Need Help?</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="font-medium text-sm">Call Support</p>
                        <p className="text-gray-600 text-sm">+234 800 ENGRAED</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="font-medium text-sm">Email Support</p>
                        <p className="text-gray-600 text-sm">support@engracedsmile.com</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button asChild className="w-full bg-[#5d4a15] hover:bg-[#6b5618]">
                    <Link href="/routes">
                      Try Booking Again
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/contact">
                      Contact Support
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

      {/* Help Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8">Don't Worry, We're Here to Help</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <RefreshCw className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">Quick Retry</h3>
                <p className="text-gray-600 text-sm">Most payment issues are temporary. Try booking again in a few minutes.</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CreditCard className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="font-semibold mb-2">Different Payment</h3>
                <p className="text-gray-600 text-sm">Try using a different card or payment method for your booking.</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-2">Expert Support</h3>
                <p className="text-gray-600 text-sm">Our support team is available 24/7 to help resolve any issues.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
