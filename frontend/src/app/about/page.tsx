import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Bus,
  Shield,
  Award,
  Users,
  Clock,
  MapPin,
  Heart,
  Target,
  Lightbulb,
  Handshake,
  Globe,
  Star,
  CheckCircle,
  Phone,
  Mail,
  MapPin as LocationIcon
} from "lucide-react";

const stats = [
  { label: "Years in Service", value: "15+", icon: Award },
  { label: "Happy Customers", value: "1M+", icon: Users },
  { label: "Cities Connected", value: "50+", icon: MapPin },
  { label: "On-time Rate", value: "98%", icon: Clock },
  { label: "Routes Available", value: "200+", icon: Globe },
  { label: "Safety Rating", value: "5★", icon: Shield }
];

const values = [
  {
    icon: Shield,
    title: "Safety First",
    description: "Your safety is our top priority. All our vehicles undergo regular maintenance and our drivers are professionally trained and certified."
  },
  {
    icon: Heart,
    title: "Customer Care",
    description: "We believe in providing exceptional customer service. Our team is dedicated to making your journey comfortable and memorable."
  },
  {
    icon: Target,
    title: "Reliability",
    description: "Count on us for punctual departures and arrivals. We understand the importance of being on time for your business and personal commitments."
  },
  {
    icon: Lightbulb,
    title: "Innovation",
    description: "We continuously invest in modern technology and comfortable vehicles to enhance your travel experience."
  },
  {
    icon: Handshake,
    title: "Trust",
    description: "Building lasting relationships with our customers through transparent pricing, honest service, and consistent quality."
  },
  {
    icon: Globe,
    title: "Connectivity",
    description: "Connecting communities across Nigeria, making travel accessible and affordable for everyone."
  }
];

const team = [
  {
    name: "Chief Executive Officer",
    role: "Leadership & Strategy",
    description: "Leading the company's vision and strategic direction for over 10 years."
  },
  {
    name: "Operations Director",
    role: "Fleet Management",
    description: "Ensuring our fleet operates at peak efficiency and safety standards."
  },
  {
    name: "Customer Experience Manager",
    role: "Service Excellence",
    description: "Dedicated to providing exceptional customer service and support."
  },
  {
    name: "Safety Coordinator",
    role: "Safety & Compliance",
    description: "Maintaining the highest safety standards across all operations."
  }
];

const achievements = [
  {
    year: "2009",
    title: "Company Founded",
    description: "Started with a vision to connect Nigeria through reliable transport services."
  },
  {
    year: "2012",
    title: "Fleet Expansion",
    description: "Grew our fleet to 50 modern coaches serving major cities."
  },
  {
    year: "2015",
    title: "Digital Innovation",
    description: "Launched online booking platform revolutionizing travel convenience."
  },
  {
    year: "2018",
    title: "National Recognition",
    description: "Awarded 'Best Transport Service' by Nigerian Travel Association."
  },
  {
    year: "2021",
    title: "Sustainability Initiative",
    description: "Introduced eco-friendly vehicles and carbon-neutral travel options."
  },
  {
    year: "2024",
    title: "Mobile App Launch",
    description: "Launched mobile app with real-time tracking and booking features."
  }
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#5d4a15] to-[#6b5618] text-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">About InterState Transport</h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Connecting Nigeria through reliable, comfortable, and safe intercity transportation services for over 15 years.
            </p>
          </div>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Founded in 2009, InterState Transport began with a simple mission: to make intercity travel in Nigeria safe, comfortable, and accessible to everyone. What started as a small fleet of buses serving Lagos and Abuja has grown into one of Nigeria&apos;s most trusted transportation companies.
                </p>
                <p>
                  Our journey has been marked by continuous innovation, from introducing the first online booking platform in Nigeria to launching our mobile app with real-time tracking. Today, we serve over 50 cities across Nigeria with a fleet of modern, well-maintained coaches.
                </p>
                <p>
                  We believe that travel should be more than just getting from point A to point B. It should be an experience that connects you to new opportunities, reunites you with loved ones, and opens doors to new adventures. That&apos;s why we&apos;ve built our company around the values of safety, comfort, reliability, and exceptional customer service.
                </p>
              </div>
              <div className="mt-8">
                <Button className="bg-[#5d4a15] hover:bg-[#6b5618] text-white">
                  Our Mission
                </Button>
              </div>
            </div>
            <div className="relative">
              <img
                src="./cars.jpg"
                alt="InterState Transport Fleet"
                className="rounded-lg shadow-xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-[#5d4a15] text-white p-4 rounded-lg shadow-lg">
                <div className="flex items-center gap-2">
                  <Award className="h-6 w-6" />
                  <div>
                    <div className="font-bold">15+ Years</div>
                    <div className="text-sm">of Excellence</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">By the Numbers</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our commitment to excellence is reflected in our impressive track record and customer satisfaction.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-[#5d4a15] rounded-full mb-4">
                  <stat.icon className="h-8 w-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              These core values guide everything we do and shape the experience we provide to our customers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-all duration-300">
                <CardContent className="p-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-[#5d4a15] rounded-full mb-6">
                    <value.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Leadership Team</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Meet the dedicated professionals who lead our company and ensure we deliver exceptional service every day.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="w-24 h-24 bg-[#5d4a15] rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Users className="h-12 w-12 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{member.name}</h3>
                  <p className="text-sm text-[#5d4a15] font-medium mb-3">{member.role}</p>
                  <p className="text-xs text-gray-600">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Journey</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Key milestones in our company&apos;s growth and evolution over the years.
                </p>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-[#5d4a15]"></div>
            
            <div className="space-y-12">
              {achievements.map((achievement, index) => (
                <div key={index} className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                  <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                    <Card className="hover:shadow-lg transition-all duration-300">
                      <CardContent className="p-6">
                        <div className={`inline-flex items-center gap-2 mb-2 ${index % 2 === 0 ? 'ml-auto' : 'mr-auto'}`}>
                          <Badge className="bg-[#5d4a15] text-white">{achievement.year}</Badge>
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2">{achievement.title}</h3>
                        <p className="text-gray-600 text-sm">{achievement.description}</p>
                      </CardContent>
                    </Card>
                  </div>
                  <div className="w-8 h-8 bg-[#5d4a15] rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                    <Star className="h-4 w-4 text-white" />
                  </div>
                  <div className="w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[#5d4a15] text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Travel with Us?</h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Experience the difference of traveling with Nigeria&apos;s most trusted intercity transport service.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" className="border-white text-black hover:bg-white hover:text-[#5d4a15]">
              Book Your Journey
            </Button>
            <Button variant="outline" className="border-white text-black hover:bg-white hover:text-[#5d4a15]">
              Contact Us
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
