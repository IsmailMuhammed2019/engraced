import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BookingModal from "@/components/BookingModal";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Clock, 
  MapPin, 
  Star, 
  ArrowRight,
  Search,
  Filter,
  Bus
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const routes = [
  {
    id: 1,
    from: "Lagos",
    to: "Abuja",
    duration: "8h 30m",
    distance: "720 km",
    price: "₦7,500",
    originalPrice: "₦9,000",
    rating: 4.8,
    reviews: 1240,
    features: ["Wi-Fi", "Refreshments", "Comfortable Seats", "USB Charging"],
    departures: [
      { time: "06:00", type: "Express", available: true },
      { time: "12:00", type: "Standard", available: true },
      { time: "18:00", type: "Express", available: false }
    ],
    image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=60",
    description: "Our flagship route connecting Nigeria's commercial capital with the federal capital. Features premium coaches with onboard entertainment.",
    amenities: ["Air Conditioning", "Reclining Seats", "Onboard Toilet", "Refreshments", "Free Wi-Fi"]
  },
  {
    id: 2,
    from: "Lagos",
    to: "Port Harcourt",
    duration: "6h 0m",
    distance: "540 km",
    price: "₦6,200",
    originalPrice: "₦7,500",
    rating: 4.6,
    reviews: 980,
    features: ["Wi-Fi", "USB Charging", "Comfortable Seats"],
    departures: [
      { time: "07:00", type: "Express", available: true },
      { time: "13:00", type: "Standard", available: true },
      { time: "19:00", type: "Express", available: true }
    ],
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=600&q=60",
    description: "Connect to the oil-rich Niger Delta region with our comfortable and reliable service.",
    amenities: ["Air Conditioning", "Reclining Seats", "Free Wi-Fi", "USB Charging"]
  },
  {
    id: 3,
    from: "Abuja",
    to: "Kaduna",
    duration: "2h 15m",
    distance: "200 km",
    price: "₦2,000",
    originalPrice: "₦2,500",
    rating: 4.9,
    reviews: 2100,
    features: ["Wi-Fi", "Refreshments", "Priority Boarding"],
    departures: [
      { time: "06:30", type: "Express", available: true },
      { time: "09:00", type: "Standard", available: true },
      { time: "12:30", type: "Express", available: true },
      { time: "15:00", type: "Standard", available: true },
      { time: "18:30", type: "Express", available: true }
    ],
    image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?auto=format&fit=crop&w=600&q=60",
    description: "Quick and convenient connection between the capital and northern Nigeria's commercial hub.",
    amenities: ["Air Conditioning", "Priority Boarding", "Free Wi-Fi", "Refreshments"]
  },
  {
    id: 4,
    from: "Kano",
    to: "Lagos",
    duration: "12h 0m",
    distance: "1000 km",
    price: "₦12,000",
    originalPrice: "₦15,000",
    rating: 4.7,
    reviews: 850,
    features: ["Wi-Fi", "Meals", "Entertainment", "Sleeper Seats"],
    departures: [
      { time: "17:00", type: "Overnight", available: true },
      { time: "20:00", type: "Overnight", available: true }
    ],
    image: "https://images.unsplash.com/photo-1570125909236-eb263c188f7e?auto=format&fit=crop&w=600&q=60",
    description: "Our premium overnight service connecting northern and southern Nigeria with sleeper seats and full amenities.",
    amenities: ["Sleeper Seats", "Full Meals", "Entertainment", "Free Wi-Fi", "Blankets", "Pillows"]
  },
  {
    id: 5,
    from: "Ibadan",
    to: "Abuja",
    duration: "7h 45m",
    distance: "650 km",
    price: "₦6,800",
    originalPrice: "₦8,000",
    rating: 4.5,
    reviews: 650,
    features: ["Wi-Fi", "Refreshments", "Comfortable Seats"],
    departures: [
      { time: "08:00", type: "Standard", available: true },
      { time: "14:00", type: "Express", available: true }
    ],
    image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=60",
    description: "Connect the ancient city of Ibadan with the modern capital through comfortable and reliable service.",
    amenities: ["Air Conditioning", "Reclining Seats", "Free Wi-Fi", "Refreshments"]
  },
  {
    id: 6,
    from: "Enugu",
    to: "Lagos",
    duration: "9h 30m",
    distance: "750 km",
    price: "₦8,500",
    originalPrice: "₦10,000",
    rating: 4.6,
    reviews: 720,
    features: ["Wi-Fi", "Refreshments", "Comfortable Seats"],
    departures: [
      { time: "06:30", type: "Express", available: true },
      { time: "13:30", type: "Standard", available: true }
    ],
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=600&q=60",
    description: "Eastern Nigeria to Lagos connection with modern coaches and excellent service.",
    amenities: ["Air Conditioning", "Reclining Seats", "Free Wi-Fi", "Refreshments", "USB Charging"]
  }
];

export default function RoutesPage() {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<{
    from: string;
    to: string;
    price: string;
    duration: string;
    departureTime: string;
    date: string;
  } | null>(null);

  const handleBookNow = (route: {
    from: string;
    to: string;
    price: string;
    duration: string;
    departures: Array<{ time: string; type: string; available: boolean }>;
  }) => {
    setSelectedRoute({
      from: route.from,
      to: route.to,
      price: route.price,
      duration: route.duration,
      departureTime: route.departures[0]?.time || "06:00",
      date: new Date().toISOString().split('T')[0]
    });
    setIsBookingModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#5d4a15] to-[#6b5618] text-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Routes</h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Discover our comprehensive network of routes connecting major cities across Nigeria with comfort and reliability.
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex-1 flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input 
                  placeholder="Search routes..." 
                  className="pl-10"
                />
              </div>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
            </div>
            <div className="text-sm text-gray-600">
              {routes.length} routes available
            </div>
          </div>
        </div>
      </section>

      {/* Routes Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {routes.map((route) => (
              <Card key={route.id} className="overflow-hidden hover:shadow-xl transition-all duration-300">
                {/* Route Image */}
                <div className="relative h-48 bg-gradient-to-r from-[#5d4a15] to-[#6b5618]">
                  <img
                    src={route.image}
                    alt={`${route.from} to ${route.to}`}
                    className="w-full h-full object-cover opacity-30"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white">
                      <div className="flex items-center gap-2 text-xl font-semibold mb-2">
                        <MapPin className="h-5 w-5" />
                        <span>{route.from}</span>
                        <ArrowRight className="h-5 w-5" />
                        <span>{route.to}</span>
                      </div>
                      <div className="text-sm opacity-90">{route.distance} • {route.duration}</div>
                    </div>
                  </div>
                </div>

                <CardContent className="p-6">
                  {/* Route Info */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">{route.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{route.rating}</span>
                      <span className="text-xs text-gray-500">({route.reviews})</span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                    {route.description}
                  </p>

                  {/* Pricing */}
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-2xl font-bold text-[#5d4a15]">{route.price}</div>
                      {route.originalPrice && (
                        <div className="text-sm text-gray-500 line-through">{route.originalPrice}</div>
                      )}
                    </div>
                    <Badge variant="destructive" className="bg-green-500 hover:bg-green-600">
                      Save {route.originalPrice ? `₦${parseInt(route.originalPrice.replace(/[₦,]/g, '')) - parseInt(route.price.replace(/[₦,]/g, ''))}` : '20%'}
                    </Badge>
                  </div>

                  {/* Features */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {route.features.map((feature, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>

                  {/* Departure Times */}
                  <div className="mb-4">
                    <p className="text-xs text-gray-500 mb-2">Available Departures:</p>
                    <div className="flex flex-wrap gap-1">
                      {route.departures.slice(0, 3).map((departure, idx) => (
                        <span 
                          key={idx} 
                          className={`text-xs px-2 py-1 rounded ${
                            departure.available 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-500'
                          }`}
                        >
                          {departure.time} ({departure.type})
                        </span>
                      ))}
                      {route.departures.length > 3 && (
                        <span className="text-xs text-gray-500">
                          +{route.departures.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Amenities */}
                  <div className="mb-4">
                    <p className="text-xs text-gray-500 mb-2">Amenities:</p>
                    <div className="flex flex-wrap gap-1">
                      {route.amenities.slice(0, 4).map((amenity, idx) => (
                        <span key={idx} className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {amenity}
                        </span>
                      ))}
                      {route.amenities.length > 4 && (
                        <span className="text-xs text-gray-500">
                          +{route.amenities.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button 
                      className="flex-1 bg-[#5d4a15] hover:bg-[#6b5618] text-white"
                      onClick={() => handleBookNow(route)}
                    >
                      Book Now
                    </Button>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[#5d4a15] text-white">
        <div className="container mx-auto px-4 text-center">
          <Bus className="h-16 w-16 mx-auto mb-4 text-white/80" />
          <h2 className="text-3xl font-bold mb-4">Can&apos;t Find Your Route?</h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              We&apos;re constantly expanding our network. Contact us to request a new route or get information about upcoming destinations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" className="border-white text-black hover:bg-white hover:text-[#5d4a15]">
              Request New Route
            </Button>
            <Button variant="outline" className="border-white text-black hover:bg-white hover:text-[#5d4a15]">
              Contact Support
            </Button>
          </div>
        </div>
      </section>

      <Footer />

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        routeData={selectedRoute || undefined}
      />
    </div>
  );
}
