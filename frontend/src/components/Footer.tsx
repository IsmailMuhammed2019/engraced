import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { name: "About Us", href: "/about" },
      { name: "Our Fleet", href: "/routes" },
      { name: "Careers", href: "#" },
      { name: "News & Updates", href: "#" },
    ],
    services: [
      { name: "City Routes", href: "/routes" },
      { name: "Group Bookings", href: "/contact" },
      { name: "Corporate Travel", href: "/logistics" },
      { name: "Logistics Services", href: "/logistics" },
    ],
    support: [
      { name: "Help Center", href: "#" },
      { name: "Contact Us", href: "/contact" },
      { name: "Track Booking", href: "/tracking" },
      { name: "FAQs", href: "/contact" },
    ],
    popular: [
      { name: "Lagos to Abuja", href: "/trips" },
      { name: "Lagos to Port Harcourt", href: "/trips" },
      { name: "Abuja to Kaduna", href: "/trips" },
      { name: "Kano to Lagos", href: "/trips" },
    ],
  };

  const socialLinks = [
    { name: "Facebook", icon: Facebook, href: "#", color: "hover:text-blue-400" },
    { name: "Twitter", icon: Twitter, href: "#", color: "hover:text-sky-400" },
    { name: "Instagram", icon: Instagram, href: "#", color: "hover:text-pink-400" },
    { name: "LinkedIn", icon: Linkedin, href: "#", color: "hover:text-blue-500" },
  ];

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10">
          {/* Company Info - Takes 2 columns on large screens */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-16 h-16 bg-[#5d4a15] rounded-lg flex items-center justify-center p-2">
                <Image
                  src="/logo.png"
                  alt="Engracedsmile Logo"
                  width={48}
                  height={48}
                  className="object-contain"
                />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">Engracedsmile</h3>
                <p className="text-sm text-[#d4af37]">Travel & Logistics</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Your trusted partner for comfortable and safe travel across Nigeria. 
              Experience modern vehicles, professional drivers, and exceptional service 
              on every journey.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              <div className="flex items-start space-x-3 text-sm">
                <Phone className="h-4 w-4 text-[#d4af37] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-300 font-medium">+234 807 111 6229</p>
                  <p className="text-gray-500 text-xs">Mon - Sat, 8AM - 6PM</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 text-sm">
                <Mail className="h-4 w-4 text-[#d4af37] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-300 font-medium">info@engracedsmile.com</p>
                  <p className="text-gray-500 text-xs">24/7 support available</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 text-sm">
                <MapPin className="h-4 w-4 text-[#d4af37] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-300 font-medium">38 Urubi Street</p>
                  <p className="text-gray-500 text-xs">Benin City, Edo State</p>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div>
              <p className="text-sm font-semibold text-gray-300 mb-3">Follow Us</p>
              <div className="flex space-x-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    className={`w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center transition-all duration-200 hover:bg-gray-700 ${social.color} hover:scale-110`}
                    aria-label={social.name}
                  >
                    <social.icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-[#d4af37] transition-colors inline-flex items-center group"
                  >
                    <span className="group-hover:translate-x-1 transition-transform duration-200">
                      {link.name}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Links */}
          <div>
            <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Services</h4>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-[#d4af37] transition-colors inline-flex items-center group"
                  >
                    <span className="group-hover:translate-x-1 transition-transform duration-200">
                      {link.name}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Support</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-[#d4af37] transition-colors inline-flex items-center group"
                  >
                    <span className="group-hover:translate-x-1 transition-transform duration-200">
                      {link.name}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Routes */}
          <div>
            <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Popular Routes</h4>
            <ul className="space-y-3">
              {footerLinks.popular.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-[#d4af37] transition-colors inline-flex items-center group"
                  >
                    <span className="group-hover:translate-x-1 transition-transform duration-200">
                      {link.name}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Subscription */}
        <div className="border-t border-gray-800 mt-12 pt-10">
          <div className="max-w-2xl mx-auto text-center">
            <h4 className="font-bold text-xl text-white mb-2">Stay Updated with Our Latest Offers</h4>
            <p className="text-sm text-gray-400 mb-6">
              Subscribe to our newsletter and never miss exclusive deals, route updates, and travel tips.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#d4af37] focus:border-transparent transition-all duration-200"
              />
              <Button 
                className="bg-[#5d4a15] hover:bg-[#6b5618] text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200 hover:scale-105"
              >
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 bg-black/50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-400 text-center md:text-left">
              © {currentYear} <span className="text-[#d4af37] font-semibold">Engracedsmile</span>. All rights reserved. | Built with ❤️ for safe travels
            </div>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400">
              <a href="#" className="hover:text-[#d4af37] transition-colors">
                Terms of Service
              </a>
              <span className="text-gray-700">•</span>
              <a href="#" className="hover:text-[#d4af37] transition-colors">
                Privacy Policy
              </a>
              <span className="text-gray-700">•</span>
              <a href="#" className="hover:text-[#d4af37] transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
