"use client";

import { motion } from "framer-motion";
import { 
  GraduationCap, 
  Clock, 
  Calendar, 
  Percent, 
  Gift, 
  ArrowRight,
  Star,
  Users,
  Clock3
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

const promotions = [
  {
    id: 1,
    title: "Student Discount",
    description: "Up to 30% off on student fares with valid ID.",
    discount: "30% OFF",
    badge: "Limited Time",
    icon: GraduationCap,
    color: "from-blue-500 to-blue-600",
    bgColor: "bg-blue-50",
    iconColor: "text-blue-600",
    validUntil: "2024-12-31",
    terms: "Valid student ID required",
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=400&q=60",
  },
  {
    id: 2,
    title: "Early Bird Special",
    description: "Book 14+ days early to save on all routes.",
    discount: "25% OFF",
    badge: "Popular",
    icon: Clock,
    color: "from-green-500 to-green-600",
    bgColor: "bg-green-50",
    iconColor: "text-green-600",
    validUntil: "2024-12-31",
    terms: "Minimum 14 days advance booking",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=400&q=60",
  },
  {
    id: 3,
    title: "Weekend Special",
    description: "Flat discounts on weekend trips across all routes.",
    discount: "20% OFF",
    badge: "Hot Deal",
    icon: Calendar,
    color: "from-purple-500 to-purple-600",
    bgColor: "bg-purple-50",
    iconColor: "text-purple-600",
    validUntil: "2024-12-31",
    terms: "Valid for Friday-Sunday travel",
    image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=400&q=60",
  },
  {
    id: 4,
    title: "Group Travel",
    description: "Special rates for groups of 10+ passengers.",
    discount: "15% OFF",
    badge: "Group Deal",
    icon: Users,
    color: "from-orange-500 to-orange-600",
    bgColor: "bg-orange-50",
    iconColor: "text-orange-600",
    validUntil: "2024-12-31",
    terms: "Minimum 10 passengers",
    image: "https://images.unsplash.com/photo-1570125909236-eb263c188f7e?auto=format&fit=crop&w=400&q=60",
  },
];

const loyaltyProgram = {
  title: "Engracedsmile Rewards",
  description: "Earn points on every trip and redeem for free rides",
  benefits: [
    "1 point per ₦100 spent",
    "Redeem points for free tickets",
    "Priority boarding",
    "Exclusive member offers",
  ],
  image: "/rent.jpg",
};

export default function Promotions() {
  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-amber-50">
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
            Promotions & Offers
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Save more on your travels with our exclusive deals and special offers.
          </p>
        </motion.div>

        {/* Promotions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {promotions.map((promo, index) => (
            <motion.div
              key={promo.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              <Card className="h-full hover:shadow-xl transition-all duration-300 border-0 shadow-lg overflow-hidden group">
                {/* Promotion Header */}
                <div className={`relative h-32 bg-gradient-to-r ${promo.color}`}>
                  <Image
                    src={promo.image}
                    alt={promo.title}
                    fill
                    className="object-cover opacity-30"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white">
                      <promo.icon className="h-8 w-8 mx-auto mb-2" />
                      <div className="text-2xl font-bold">{promo.discount}</div>
                    </div>
                  </div>
                  <Badge className="absolute top-2 right-2 bg-white text-gray-900 hover:bg-gray-100">
                    {promo.badge}
                  </Badge>
                </div>

                <CardContent className="p-6">
                  <h3 className="font-bold text-gray-900 mb-2">{promo.title}</h3>
                  <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                    {promo.description}
                  </p>

                  {/* Terms */}
                  <div className="mb-4">
                    <p className="text-xs text-gray-500 mb-1">Terms:</p>
                    <p className="text-xs text-gray-600">{promo.terms}</p>
                  </div>

                  {/* Valid Until */}
                  <div className="flex items-center gap-2 mb-4 text-xs text-gray-500">
                    <Clock3 className="h-3 w-3" />
                    <span>Valid until {new Date(promo.validUntil).toLocaleDateString()}</span>
                  </div>

                  {/* CTA Button */}
                  <Button className="w-full group-hover:shadow-lg transition-all duration-300">
                    Apply Offer
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Loyalty Program Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Content */}
            <div className="p-8 lg:p-12 flex flex-col justify-center">
              <div className="mb-6">
                <Badge className="bg-gradient-to-r from-[#5d4a15] to-[#6b5618] text-white mb-4">
                  <Star className="h-3 w-3 mr-1" />
                  Loyalty Program
                </Badge>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                  {loyaltyProgram.title}
                </h3>
                <p className="text-gray-600 mb-6">
                  {loyaltyProgram.description}
                </p>
              </div>

              {/* Benefits */}
              <div className="space-y-3 mb-8">
                {loyaltyProgram.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-[#5d4a15] rounded-full"></div>
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg">
                  Join Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button variant="outline" size="lg">
                  Learn More
                </Button>
              </div>
            </div>

            {/* Image */}
            <div className="relative h-64 lg:h-auto">
              <Image
                src={loyaltyProgram.image}
                alt="Loyalty Program"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <div className="absolute bottom-6 left-6 text-white">
                <div className="flex items-center gap-2">
                  <Percent className="h-6 w-6" />
                  <span className="text-lg font-semibold">Earn & Redeem Points</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Newsletter Signup */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-16 text-center bg-white rounded-2xl shadow-lg p-8"
        >
          <div className="max-w-2xl mx-auto">
            <Gift className="h-12 w-12 text-[#5d4a15] mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Stay Updated with Latest Offers
            </h3>
            <p className="text-gray-600 mb-6">
              Subscribe to our newsletter and be the first to know about exclusive deals and promotions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5d4a15]"
              />
              <Button className="px-8">
                Subscribe
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-4">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
