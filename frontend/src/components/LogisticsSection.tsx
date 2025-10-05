"use client";

import { motion } from "framer-motion";
import { Truck, Package, MapPin, Clock, Shield, Zap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const logisticsServices = [
  {
    icon: Package,
    title: "Parcel Delivery",
    description: "Fast and secure delivery of small to medium-sized packages nationwide with real-time tracking.",
    features: ["Same-day delivery", "Real-time tracking", "Insurance coverage", "Signature confirmation"],
    color: "from-blue-500 to-blue-600",
    bgColor: "bg-blue-50",
    iconColor: "text-blue-600",
    image: "/parcel.jpg",
  },
  {
    icon: Truck,
    title: "Cargo & Freight",
    description: "Reliable transportation for large goods and commercial cargo with flexible scheduling options.",
    features: ["Heavy cargo handling", "Flexible scheduling", "Dedicated drivers", "Route optimization"],
    color: "from-green-500 to-green-600",
    bgColor: "bg-green-50",
    iconColor: "text-green-600",
    image: "/cargo.jpg",
  },
  {
    icon: MapPin,
    title: "Last-Mile Delivery",
    description: "Efficient and timely delivery from our hubs directly to your customer's doorstep.",
    features: ["Door-to-door service", "Flexible timing", "Package protection", "Delivery confirmation"],
    color: "from-purple-500 to-purple-600",
    bgColor: "bg-purple-50",
    iconColor: "text-purple-600",
    image: "/lastmile.png",
  },
];

const stats = [
  { number: "50+", label: "Cities Covered", icon: MapPin },
  { number: "99.5%", label: "On-Time Delivery", icon: Clock },
  { number: "24/7", label: "Customer Support", icon: Shield },
  { number: "2M+", label: "Packages Delivered", icon: Package },
];

export default function LogisticsSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-amber-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Logistics Solutions
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From small parcels to large cargo, we ensure safe, timely, and efficient delivery across Nigeria.
            Your logistics partner for all shipping needs.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {logisticsServices.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              <Card className="h-full hover:shadow-xl transition-all duration-300 border-0 shadow-lg overflow-hidden group">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white">
                      <service.icon className="h-16 w-16 mx-auto mb-4" />
                      <h3 className="text-2xl font-bold">{service.title}</h3>
                    </div>
                  </div>
                </div>

                <CardContent className="p-6 flex flex-col flex-1">
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {service.description}
                  </p>

                  {/* Features */}
                  <div className="space-y-3 mb-6">
                    {service.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${service.bgColor.replace('bg-', 'bg-').replace('-50', '-200')}`}></div>
                        <span className="text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <Button className="w-full group-hover:shadow-lg transition-all duration-300 mt-auto">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
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
          className="bg-white rounded-2xl shadow-xl p-8 md:p-12"
        >
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Trusted Logistics Partner
            </h3>
            <p className="text-lg text-gray-600">
              Numbers that speak for our commitment to excellence in logistics
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
                <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-full mb-4">
                  <stat.icon className="h-8 w-8 text-amber-600" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  {stat.number}
                </div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="bg-gradient-to-r from-[#5d4a15] to-[#6b5618] rounded-2xl p-8 md:p-12 text-black">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Ready to Ship Your Package?
            </h3>
            <p className="text-lg mb-8 opacity-90">
              Get a quote for your logistics needs and experience reliable delivery across Nigeria.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-[#5d4a15] hover:bg-gray-100"
                onClick={() => {
                  window.location.href = '/logistics';
                }}
              >
                Get Quote
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-[#5d4a15] text-[#5d4a15] hover:bg-[#5d4a15] hover:text-white"
                onClick={() => {
                  window.location.href = '/logistics';
                }}
              >
                Track Package
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
