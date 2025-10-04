import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
  Send,
  Bus,
  Headphones,
  User,
  MessageSquare,
  CheckCircle,
  AlertCircle,
  Star,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Navigation
} from "lucide-react";

const contactMethods = [
  {
    icon: Phone,
    title: "Call Us",
    description: "Speak directly with our customer service team",
    contact: "+2348071116229",
    availability: "24/7 Customer Support",
    action: "Call Now"
  },
  {
    icon: Mail,
    title: "Email Support",
    description: "Send us your questions and we'll respond promptly",
    contact: "info@engracedsmile.com",
    availability: "Response within 2 hours",
    action: "Send Email"
  },
  {
    icon: MessageCircle,
    title: "Live Chat",
    description: "Chat with us in real-time for immediate assistance",
    contact: "Available on website",
    availability: "Mon-Fri: 8AM-8PM",
    action: "Start Chat"
  },
  {
    icon: MessageSquare,
    title: "WhatsApp",
    description: "Message us on WhatsApp for quick responses",
    contact: "+2348071116229",
    availability: "24/7 Available",
    action: "WhatsApp"
  }
];

const offices = [
  {
    city: "Benin City",
    address: "38 Urubi Street, Benin City",
    phone: "+2348071116229",
    email: "info@engracedsmile.com",
    hours: "Mon-Sun: 6AM-10PM",
    isHeadquarters: true
  },
  {
    city: "Abuja",
    address: "456 Central Business District, Abuja",
    phone: "+234 9 876 5432",
    email: "abuja@interstate.example",
    hours: "Mon-Sun: 6AM-10PM",
    isHeadquarters: false
  },
  {
    city: "Port Harcourt",
    address: "789 GRA Phase 2, Port Harcourt",
    phone: "+234 84 123 4567",
    email: "portharcourt@interstate.example",
    hours: "Mon-Sun: 6AM-10PM",
    isHeadquarters: false
  },
  {
    city: "Kano",
    address: "321 Sabon Gari, Kano State",
    phone: "+234 64 987 6543",
    email: "kano@interstate.example",
    hours: "Mon-Sun: 6AM-10PM",
    isHeadquarters: false
  }
];

const faqs = [
  {
    question: "How do I book a ticket?",
    answer: "You can book tickets online through our website, mobile app, or by calling our customer service line. Simply select your route, date, and number of passengers."
  },
  {
    question: "Can I cancel or modify my booking?",
    answer: "Yes, you can cancel or modify your booking up to 24 hours before departure. Cancellation fees may apply depending on the fare type."
  },
  {
    question: "What amenities are available on your buses?",
    answer: "Our buses feature air conditioning, comfortable reclining seats, free Wi-Fi, USB charging ports, onboard toilets, and refreshments on select routes."
  },
  {
    question: "Do you offer group discounts?",
    answer: "Yes, we offer special rates for groups of 10 or more passengers. Contact our group booking department for customized quotes."
  },
  {
    question: "How early should I arrive at the terminal?",
    answer: "We recommend arriving at least 30 minutes before your scheduled departure time to ensure a smooth boarding process."
  },
  {
    question: "What safety measures do you have in place?",
    answer: "All our vehicles undergo regular safety inspections, our drivers are professionally trained and certified, and we maintain comprehensive insurance coverage."
  }
];

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#5d4a15] to-[#6b5618] text-black py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              We&apos;re here to help! Get in touch with our friendly customer service team for any questions or assistance.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Get in Touch</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Choose your preferred way to contact us. Our team is ready to assist you with any questions or concerns.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactMethods.map((method, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-[#5d4a15] rounded-full mb-4">
                    <method.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{method.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{method.description}</p>
                  <p className="font-medium text-[#5d4a15] mb-2">{method.contact}</p>
                  <p className="text-xs text-gray-500 mb-4">{method.availability}</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full border-[#5d4a15] text-[#5d4a15] hover:bg-[#5d4a15] hover:text-white"
                  >
                    {method.action}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="h-5 w-5 text-[#5d4a15]" />
                  Send us a Message
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" placeholder="John" />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" placeholder="Doe" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="john@example.com" />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input id="phone" placeholder="+2348071116229" />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="subject">Subject</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a subject" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="booking">Booking Inquiry</SelectItem>
                        <SelectItem value="cancellation">Cancellation Request</SelectItem>
                        <SelectItem value="complaint">Complaint</SelectItem>
                        <SelectItem value="feedback">Feedback</SelectItem>
                        <SelectItem value="group">Group Booking</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="message">Message</Label>
                    <textarea
                      id="message"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5d4a15] focus:border-transparent"
                      rows={5}
                      placeholder="Please describe your inquiry in detail..."
                    />
                  </div>

                  <Button type="submit" className="w-full bg-[#5d4a15] hover:bg-[#6b5618] text-white">
                    <Send className="h-4 w-4 mr-2" />
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Office Locations */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Our Offices</h3>
              <div className="space-y-4">
                {offices.map((office, index) => (
                  <Card key={index} className="hover:shadow-md transition-all duration-300">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0">
                          <MapPin className="h-5 w-5 text-[#5d4a15] mt-1" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold text-gray-900">{office.city}</h4>
                            {office.isHeadquarters && (
                              <span className="text-xs bg-[#5d4a15] text-white px-2 py-1 rounded">
                                Headquarters
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{office.address}</p>
                          <div className="space-y-1 text-sm">
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-gray-500" />
                              <span>{office.phone}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4 text-gray-500" />
                              <span>{office.email}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-gray-500" />
                              <span>{office.hours}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Find quick answers to common questions about our services, booking process, and policies.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {faqs.map((faq, index) => (
              <Card key={index} className="hover:shadow-md transition-all duration-300">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <MessageCircle className="h-4 w-4 text-[#5d4a15]" />
                    {faq.question}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Find Us</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Visit any of our conveniently located terminals across Nigeria.
            </p>
          </div>

          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="h-96 bg-gradient-to-r from-[#5d4a15] to-[#6b5618] flex items-center justify-center">
                <div className="text-center text-white">
                  <Navigation className="h-16 w-16 mx-auto mb-4 opacity-80" />
                  <h3 className="text-xl font-semibold mb-2">Interactive Map</h3>
                  <p className="text-white/90">
                    Map integration would be implemented here
                  </p>
                  <Button 
                    variant="outline" 
                    className="mt-4 border-white text-white hover:bg-white hover:text-[#5d4a15]"
                  >
                    Open in Google Maps
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Social Media & Newsletter */}
      <section className="py-16 bg-[#5d4a15] text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">Stay Connected</h2>
              <p className="text-white/90 mb-6">
                Follow us on social media for the latest updates, travel tips, and special offers.
              </p>
              <div className="flex gap-4">
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-[#5d4a15]">
                  <Facebook className="h-4 w-4 mr-2" />
                  Facebook
                </Button>
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-[#5d4a15]">
                  <Twitter className="h-4 w-4 mr-2" />
                  Twitter
                </Button>
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-[#5d4a15]">
                  <Instagram className="h-4 w-4 mr-2" />
                  Instagram
                </Button>
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-[#5d4a15]">
                  <Linkedin className="h-4 w-4 mr-2" />
                  LinkedIn
                </Button>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-4">Newsletter Signup</h3>
              <p className="text-white/90 mb-6">
                Subscribe to our newsletter for travel updates, exclusive deals, and route announcements.
              </p>
              <div className="flex gap-2">
                <Input 
                  placeholder="Enter your email" 
                  className="flex-1 bg-white/10 border-white/30 text-white placeholder:text-white/70"
                />
                <Button className="bg-white text-[#5d4a15] hover:bg-white/90">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
