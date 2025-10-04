"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Truck, 
  Package, 
  MapPin, 
  Clock, 
  Phone, 
  Mail, 
  Search,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Shield,
  Zap,
  Globe,
  Users,
  Star,
  Calendar,
  Weight,
  Route,
  FileText,
  Download,
  Navigation,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AnimatedMap from "@/components/AnimatedMap";

// Sample tracking data
const trackingData = [
  {
    id: "TRK001",
    status: "In Transit",
    from: "Lagos",
    to: "Abuja",
    currentLocation: "Ibadan",
    estimatedDelivery: "2024-01-16 14:00",
    progress: 60,
    updates: [
      { time: "2024-01-15 08:00", status: "Package picked up", location: "Lagos" },
      { time: "2024-01-15 10:30", status: "In transit", location: "Lagos" },
      { time: "2024-01-15 14:00", status: "Arrived at sorting facility", location: "Ibadan" },
      { time: "2024-01-15 16:30", status: "Out for delivery", location: "Ibadan" }
    ]
  }
];

const logisticsServices = [
  {
    icon: Package,
    title: "Package Delivery",
    description: "Fast and secure package delivery across Nigeria with real-time tracking and insurance coverage.",
    features: ["Same-day delivery", "Real-time tracking", "Insurance coverage", "Proof of delivery"],
    price: "From ₦2,500",
    image: "/delivery.jpg"
  },
  {
    icon: Truck,
    title: "Freight Services",
    description: "Heavy cargo transportation for businesses with specialized vehicles and experienced drivers.",
    features: ["Heavy cargo handling", "Specialized vehicles", "Experienced drivers", "Route optimization"],
    price: "From ₦15,000",
    image: "/Freight.jpg"
  },
  {
    icon: Globe,
    title: "International Shipping",
    description: "Global logistics solutions connecting Nigeria to the world with customs clearance support.",
    features: ["Global reach", "Customs clearance", "Documentation support", "Air & sea freight"],
    price: "From ₦50,000",
    image: "/International.jpeg"
  },
  {
    icon: Users,
    title: "Corporate Logistics",
    description: "Tailored logistics solutions for businesses with dedicated account management and reporting.",
    features: ["Dedicated account manager", "Custom solutions", "Detailed reporting", "Volume discounts"],
    price: "Custom pricing",
    image: "/Corporate.png"
  }
];

const trackingStatus = {
  "Picked Up": { color: "bg-blue-100 text-blue-800", icon: Package },
  "In Transit": { color: "bg-yellow-100 text-yellow-800", icon: Truck },
  "Out for Delivery": { color: "bg-orange-100 text-orange-800", icon: Route },
  "Delivered": { color: "bg-green-100 text-green-800", icon: CheckCircle },
  "Delayed": { color: "bg-red-100 text-red-800", icon: AlertCircle }
};

export default function LogisticsPage() {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [trackingResult, setTrackingResult] = useState<typeof trackingData[0] | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleTrackingSearch = () => {
    if (!trackingNumber.trim()) return;
    
    setIsSearching(true);
    // Simulate API call
    setTimeout(() => {
      setTrackingResult(trackingData[0]);
      setIsSearching(false);
    }, 1500);
  };

  const handleQuoteRequest = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle quote request
    console.log("Quote request submitted");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#5d4a15] to-[#6b5618] text-white py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Logistics & Cargo Services
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8">
              Reliable logistics solutions for all your shipping needs. From small packages to heavy cargo, 
              we deliver with precision and care across Nigeria and beyond.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-[#5d4a15] hover:bg-gray-100">
                Get Quote
              </Button>
              <Button variant="outline" size="lg" className="border-white text-black hover:bg-white hover:text-[#5d4a15]">
                Track Package
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Tracking Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Track Your Shipment
              </h2>
              <p className="text-lg text-gray-600">
                Enter your tracking number to get real-time updates on your package location
              </p>
            </motion.div>

            <Card className="mb-8">
              <CardContent className="p-8">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <Input
                      placeholder="Enter tracking number (e.g., TRK001)"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      className="h-12"
                    />
                  </div>
                  <Button 
                    onClick={handleTrackingSearch}
                    disabled={isSearching || !trackingNumber.trim()}
                    className="h-12 px-8 bg-[#5d4a15] hover:bg-[#6b5618]"
                  >
                    {isSearching ? "Searching..." : "Track Package"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Tracking Results */}
            {trackingResult && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-xl">Tracking: {trackingResult.id}</CardTitle>
                        <p className="text-gray-600">{trackingResult.from} → {trackingResult.to}</p>
                      </div>
                      <Badge className={trackingStatus[trackingResult.status as keyof typeof trackingStatus]?.color}>
                        {trackingResult.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                      <div className="flex items-center gap-3">
                        <MapPin className="h-5 w-5 text-[#5d4a15]" />
                        <div>
                          <p className="text-sm text-gray-600">Current Location</p>
                          <p className="font-semibold">{trackingResult.currentLocation}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Clock className="h-5 w-5 text-[#5d4a15]" />
                        <div>
                          <p className="text-sm text-gray-600">Estimated Delivery</p>
                          <p className="font-semibold">{trackingResult.estimatedDelivery}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Route className="h-5 w-5 text-[#5d4a15]" />
                        <div>
                          <p className="text-sm text-gray-600">Progress</p>
                          <p className="font-semibold">{trackingResult.progress}% Complete</p>
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-6">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-[#5d4a15] h-2 rounded-full transition-all duration-500"
                          style={{ width: `${trackingResult.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Timeline */}
                    <div>
                      <h4 className="font-semibold mb-4">Tracking Updates</h4>
                      <div className="space-y-4">
                        {trackingResult.updates.map((update, index) => (
                          <div key={index} className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-3 h-3 bg-[#5d4a15] rounded-full mt-2"></div>
                            <div className="flex-1">
                              <p className="font-medium">{update.status}</p>
                              <p className="text-sm text-gray-600">{update.location}</p>
                              <p className="text-xs text-gray-500">{update.time}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Interactive Map Section */}
      <AnimatedMap />

      {/* Why Choose Us Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Engracedsmile Logistics?
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              We combine technology, experience, and commitment to deliver exceptional logistics solutions.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "Secure & Insured",
                description: "All shipments are fully insured with comprehensive coverage for your peace of mind.",
                features: ["Full insurance coverage", "Secure handling", "Damage protection"]
              },
              {
                icon: Zap,
                title: "Fast Delivery",
                description: "Express delivery options with real-time tracking and guaranteed delivery times.",
                features: ["Same-day delivery", "Express options", "Guaranteed timing"]
              },
              {
                icon: Globe,
                title: "Global Reach",
                description: "International shipping capabilities with customs clearance and documentation support.",
                features: ["International shipping", "Customs clearance", "Documentation support"]
              },
              {
                icon: Users,
                title: "Expert Team",
                description: "Experienced logistics professionals dedicated to handling your shipments with care.",
                features: ["Expert handlers", "Professional service", "Personal attention"]
              },
              {
                icon: Clock,
                title: "24/7 Support",
                description: "Round-the-clock customer support and tracking for all your logistics needs.",
                features: ["24/7 availability", "Real-time support", "Quick response"]
              },
              {
                icon: Star,
                title: "Proven Track Record",
                description: "Years of experience with thousands of satisfied customers and successful deliveries.",
                features: ["99.5% success rate", "Customer satisfaction", "Reliable service"]
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-[#5d4a15] rounded-lg flex items-center justify-center">
                    <item.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{item.title}</h3>
                </div>
                <p className="text-gray-600 mb-4">{item.description}</p>
                <ul className="space-y-2">
                  {item.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Logistics Services
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Comprehensive logistics solutions tailored to meet your business and personal shipping needs
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {logisticsServices.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300 flex flex-col">
                  {/* Image at the top */}
                  <div className="relative h-48 overflow-hidden rounded-t-lg">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20"></div>
                    <div className="absolute top-4 right-4">
                      <div className="inline-flex items-center justify-center w-12 h-12 bg-[#5d4a15] text-white rounded-full">
                        <service.icon className="h-6 w-6" />
                      </div>
                    </div>
                  </div>
                  
                  <CardContent className="p-6 flex flex-col flex-1">
                    <div className="text-center mb-4">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{service.title}</h3>
                      <p className="text-gray-600 text-sm mb-4">{service.description}</p>
                    </div>
                    
                    <div className="space-y-2 mb-6 flex-1">
                      {service.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="text-center mt-auto">
                      <p className="text-lg font-bold text-[#5d4a15] mb-4">{service.price}</p>
                      <Button className="w-full bg-[#5d4a15] hover:bg-[#6b5618] text-white">
                        Learn More
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote Request Form */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Get a Quote
              </h2>
              <p className="text-lg text-gray-600">
                Tell us about your shipping needs and we&apos;ll provide a competitive quote
              </p>
            </motion.div>

            <Card>
              <CardContent className="p-8">
                <form onSubmit={handleQuoteRequest} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <Input placeholder="Enter your full name" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <Input type="email" placeholder="Enter your email" required />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <Input placeholder="Enter your phone number" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Service Type
                      </label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select service type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="package">Package Delivery</SelectItem>
                          <SelectItem value="freight">Freight Services</SelectItem>
                          <SelectItem value="international">International Shipping</SelectItem>
                          <SelectItem value="corporate">Corporate Logistics</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Pickup Location
                      </label>
                      <Input placeholder="Enter pickup address" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Delivery Location
                      </label>
                      <Input placeholder="Enter delivery address" required />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Package Weight (kg)
                      </label>
                      <Input type="number" placeholder="Enter weight" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Package Dimensions
                      </label>
                      <Input placeholder="L x W x H (cm)" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Delivery Date
                      </label>
                      <Input type="date" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Additional Information
                    </label>
                    <Textarea 
                      placeholder="Any special requirements or additional information..."
                      rows={4}
                    />
                  </div>

                  <div className="text-center">
                    <Button type="submit" size="lg" className="bg-[#5d4a15] hover:bg-[#6b5618] text-white px-8">
                      Get Quote
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Engracedsmile Logistics?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We combine technology, experience, and dedication to deliver exceptional logistics services
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-[#5d4a15] text-white rounded-full mb-4">
                <Shield className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Secure & Insured</h3>
              <p className="text-gray-600">All shipments are fully insured and tracked with advanced security measures</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-[#5d4a15] text-white rounded-full mb-4">
                <Zap className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Fast Delivery</h3>
              <p className="text-gray-600">Optimized routes and efficient processes ensure timely delivery</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-[#5d4a15] text-white rounded-full mb-4">
                <Star className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Reliable Service</h3>
              <p className="text-gray-600">99% on-time delivery rate with professional customer support</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[#5d4a15] text-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Ship?</h2>
            <p className="text-xl text-white/90 mb-8">
              Get started with our logistics services today. Fast, secure, and reliable shipping solutions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-[#5d4a15] hover:bg-gray-100">
                Start Shipping
              </Button>
              <Button variant="outline" size="lg" className="border-white text-black hover:bg-white hover:text-[#5d4a15]">
                Contact Sales
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
