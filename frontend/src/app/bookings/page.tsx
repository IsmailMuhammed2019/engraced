import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import { 
  Calendar,
  Clock, 
  MapPin, 
  User,
  CreditCard,
  Download,
  Eye,
  Edit,
  Trash2,
  Search,
  Filter,
  Bus,
  Phone,
  Mail,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react";

const sampleBookings = [
  {
    id: "BK-001234",
    route: "Lagos → Abuja",
    date: "2024-10-15",
    time: "06:00",
    passengers: 2,
    totalAmount: "₦15,000",
    status: "confirmed",
    bookingDate: "2024-10-10",
    seats: ["A1", "A2"],
    paymentMethod: "Card",
    contactInfo: {
      name: "John Doe",
      email: "john@example.com",
      phone: "+234 800 000 0001"
    }
  },
  {
    id: "BK-001235",
    route: "Abuja → Kaduna",
    date: "2024-10-20",
    time: "12:30",
    passengers: 1,
    totalAmount: "₦2,000",
    status: "pending",
    bookingDate: "2024-10-12",
    seats: ["B3"],
    paymentMethod: "Bank Transfer",
    contactInfo: {
      name: "Jane Smith",
      email: "jane@example.com",
      phone: "+234 800 000 0002"
    }
  },
  {
    id: "BK-001236",
    route: "Lagos → Port Harcourt",
    date: "2024-10-18",
    time: "13:00",
    passengers: 3,
    totalAmount: "₦18,600",
    status: "cancelled",
    bookingDate: "2024-10-08",
    seats: ["C1", "C2", "C3"],
    paymentMethod: "Mobile Money",
    contactInfo: {
      name: "Mike Johnson",
      email: "mike@example.com",
      phone: "+234 800 000 0003"
    }
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'confirmed':
      return 'bg-green-100 text-green-800';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'confirmed':
      return <CheckCircle className="h-4 w-4" />;
    case 'pending':
      return <AlertCircle className="h-4 w-4" />;
    case 'cancelled':
      return <XCircle className="h-4 w-4" />;
    default:
      return <AlertCircle className="h-4 w-4" />;
  }
};

export default function BookingsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#5d4a15] to-[#6b5618] text-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">My Bookings</h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Manage your travel bookings, view booking details, and make changes to your reservations.
            </p>
          </div>
        </div>
      </section>

      {/* Quick Booking Section */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-[#5d4a15]" />
                Quick Booking
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="from">From</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select city" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lagos">Lagos</SelectItem>
                      <SelectItem value="abuja">Abuja</SelectItem>
                      <SelectItem value="port-harcourt">Port Harcourt</SelectItem>
                      <SelectItem value="kano">Kano</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="to">To</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select city" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lagos">Lagos</SelectItem>
                      <SelectItem value="abuja">Abuja</SelectItem>
                      <SelectItem value="port-harcourt">Port Harcourt</SelectItem>
                      <SelectItem value="kano">Kano</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="date">Travel Date</Label>
                  <Input type="date" id="date" />
                </div>
                <div className="flex items-end">
                  <Button className="w-full bg-[#5d4a15] hover:bg-[#6b5618] text-white">
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Bookings List */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Your Bookings</h2>
            <div className="flex gap-2">
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
          </div>

          <div className="space-y-6">
            {sampleBookings.map((booking) => (
              <Card key={booking.id} className="hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Booking Info */}
                    <div className="lg:col-span-2">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <Badge className={getStatusColor(booking.status)}>
                            {getStatusIcon(booking.status)}
                            <span className="ml-1 capitalize">{booking.status}</span>
                          </Badge>
                          <span className="text-sm font-mono text-gray-600">{booking.id}</span>
                        </div>
                        <span className="text-sm text-gray-500">
                          Booked: {new Date(booking.bookingDate).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-[#5d4a15]" />
                          <span className="font-semibold">{booking.route}</span>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(booking.date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{booking.time}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            <span>{booking.passengers} passenger{booking.passengers > 1 ? 's' : ''}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-gray-500">Seats:</span>
                          <div className="flex gap-1">
                            {booking.seats.map((seat, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {seat}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Contact Info */}
                    <div>
                      <h4 className="font-semibold mb-3 text-gray-900">Contact Information</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-500" />
                          <span>{booking.contactInfo.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-gray-500" />
                          <span>{booking.contactInfo.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-gray-500" />
                          <span>{booking.contactInfo.phone}</span>
                        </div>
                      </div>
                    </div>

                    {/* Payment & Actions */}
                    <div className="flex flex-col justify-between">
                      <div className="mb-4">
                        <h4 className="font-semibold mb-2 text-gray-900">Payment</h4>
                        <div className="space-y-1 text-sm">
                          <div className="flex items-center gap-2">
                            <CreditCard className="h-4 w-4 text-gray-500" />
                            <span>{booking.paymentMethod}</span>
                          </div>
                          <div className="text-lg font-bold text-[#5d4a15]">
                            {booking.totalAmount}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <Button size="sm" variant="outline" className="w-full">
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                        {booking.status === 'confirmed' && (
                          <>
                            <Button size="sm" variant="outline" className="w-full">
                              <Edit className="h-4 w-4 mr-2" />
                              Modify
                            </Button>
                            <Button size="sm" variant="outline" className="w-full text-red-600 hover:text-red-700">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Cancel
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* No Bookings State */}
          {sampleBookings.length === 0 && (
            <Card className="text-center py-12">
              <CardContent>
                <Bus className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-semibold mb-2">No Bookings Found</h3>
                <p className="text-gray-600 mb-6">
                  You haven&apos;t made any bookings yet. Start planning your journey today!
                </p>
                <Button className="bg-[#5d4a15] hover:bg-[#6b5618] text-white">
                  Book Your First Trip
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* Help Section */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Need Help with Your Booking?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our customer support team is here to help you with any questions or changes to your bookings.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardContent className="p-6">
                <Phone className="h-12 w-12 mx-auto mb-4 text-[#5d4a15]" />
                <h3 className="font-semibold mb-2">Call Us</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Speak directly with our support team
                </p>
                <p className="font-medium">+2348071116229</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <Mail className="h-12 w-12 mx-auto mb-4 text-[#5d4a15]" />
                <h3 className="font-semibold mb-2">Email Support</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Send us your questions via email
                </p>
                <p className="font-medium">info@engracedsmile.com</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <Clock className="h-12 w-12 mx-auto mb-4 text-[#5d4a15]" />
                <h3 className="font-semibold mb-2">Live Chat</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Chat with us in real-time
                </p>
                <Button variant="outline" className="w-full">
                  Start Chat
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
