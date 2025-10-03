"use client";

import { motion } from "framer-motion";
import { 
  Clock, 
  Shield, 
  CreditCard, 
  Wifi, 
  Users, 
  Headphones,
  MapPin,
  Star
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const features = [
  {
    icon: Clock,
    title: "Daily Departures",
    description: "Multiple daily schedules connecting major cities with punctuality guarantees. Our fleet operates 365 days a year with over 50+ daily departures across Nigeria. Real-time tracking and SMS notifications keep you informed every step of the way.",
    color: "bg-blue-500",
    badge: "Reliable",
    image: "/depature.jpg",
  },
  {
    icon: Shield,
    title: "Comfort + Safety",
    description: "Well-maintained coaches, onboard Wi‑Fi and professional drivers. All vehicles undergo daily safety inspections and are equipped with GPS tracking, emergency exits, and first aid kits. Our drivers are professionally trained and certified.",
    color: "bg-green-500",
    badge: "Secure",
    image: "/comfort.jpg",
  },
  {
    icon: CreditCard,
    title: "Easy Payments",
    description: "Pay with card, bank transfer or mobile money. Secure and fast. We accept all major payment methods including Visa, Mastercard, Verve, and mobile money platforms. All transactions are encrypted and PCI compliant for maximum security.",
    color: "bg-purple-500",
    badge: "Fast",
    image: "/payment.jpg",
  },
  {
    icon: Wifi,
    title: "Free Wi-Fi",
    description: "Stay connected throughout your journey with complimentary internet access. High-speed 4G Wi-Fi available on all routes with unlimited data usage. Perfect for business travelers, students, and anyone who needs to stay connected on the go.",
    color: "bg-orange-500",
    badge: "Modern",
    image: "/wifi.jpg",
  },
  {
    icon: Users,
    title: "Group Bookings",
    description: "Special rates and dedicated support for corporate and group travel. We offer exclusive discounts for groups of 10+ passengers, corporate accounts, and educational institutions. Dedicated account managers and flexible payment terms available.",
    color: "bg-pink-500",
    badge: "Flexible",
    image: "/group.jpg",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Round-the-clock customer service for all your travel needs. Our multilingual support team is available 24/7 via phone, email, WhatsApp, and live chat. Get instant help with bookings, changes, cancellations, and travel information.",
    color: "bg-indigo-500",
    badge: "Always On",
    image: "/support.jpg",
  },
];

const stats = [
  { label: "Cities Connected", value: "50+", icon: MapPin },
  { label: "Happy Customers", value: "1M+", icon: Users },
  { label: "On-time Rate", value: "98%", icon: Star },
  { label: "Routes Available", value: "200+", icon: MapPin },
];

export default function Features() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Choose Engracedsmile?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Experience the difference with our modern fleet, professional service, and commitment to your comfort and safety.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              <Card className="h-full hover:shadow-lg transition-all duration-300 border-0 shadow-md overflow-hidden flex flex-col">
                {/* Image at the top */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20"></div>
                  <Badge className="absolute top-3 right-3 bg-white text-gray-900 hover:bg-gray-100">
                    {feature.badge}
                  </Badge>
                </div>
                
                <CardContent className="p-6 flex flex-col flex-1">
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`p-3 rounded-lg ${feature.color} text-white flex-shrink-0`}>
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                  
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-white rounded-2xl shadow-lg p-8 md:p-12"
        >
          <div className="text-center mb-8">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Trusted by Thousands
            </h3>
            <p className="text-gray-600">
              Numbers that speak for our commitment to excellence
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-amber-100 rounded-full mb-4">
                  <stat.icon className="h-6 w-6 text-amber-600" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
