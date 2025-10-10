import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center">Privacy Policy</CardTitle>
            <p className="text-center text-gray-600 mt-2">Last updated: {new Date().toLocaleDateString()}</p>
          </CardHeader>
          <CardContent className="prose max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
              <p className="text-gray-700 mb-4">
                At Engraced Smile Transport Services, we are committed to protecting your privacy and ensuring 
                the security of your personal information. This Privacy Policy explains how we collect, use, 
                disclose, and safeguard your information when you use our services.
              </p>
              <p className="text-gray-700">
                Please read this privacy policy carefully. If you do not agree with the terms of this privacy 
                policy, please do not access or use our services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
              
              <h3 className="text-xl font-semibold mb-3 mt-4">2.1 Personal Information</h3>
              <p className="text-gray-700 mb-4">
                We collect personal information that you voluntarily provide to us when you:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>Register for an account</li>
                <li>Make a booking or purchase</li>
                <li>Contact our customer support</li>
                <li>Subscribe to our newsletter or marketing communications</li>
                <li>Participate in surveys or promotions</li>
              </ul>
              <p className="text-gray-700 mb-4">
                The personal information we collect may include:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>Full name</li>
                <li>Email address</li>
                <li>Phone number</li>
                <li>Postal address</li>
                <li>Payment information (processed securely through Paystack)</li>
                <li>Date of birth (if required)</li>
                <li>Emergency contact information</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 mt-6">2.2 Automatically Collected Information</h3>
              <p className="text-gray-700 mb-4">
                When you visit our website or use our services, we automatically collect certain information:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>IP address and browser type</li>
                <li>Operating system and device information</li>
                <li>Pages visited and time spent on pages</li>
                <li>Referring website addresses</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 mt-6">2.3 Location Information</h3>
              <p className="text-gray-700">
                With your permission, we may collect location data to provide route information, pickup 
                locations, and improve our services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
              <p className="text-gray-700 mb-4">
                We use the information we collect for various purposes:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li><strong>Service Delivery:</strong> Process bookings, payments, and provide transport services</li>
                <li><strong>Communication:</strong> Send booking confirmations, updates, and customer support responses</li>
                <li><strong>Account Management:</strong> Create and manage your account, including login authentication</li>
                <li><strong>Safety and Security:</strong> Verify identity, prevent fraud, and ensure passenger safety</li>
                <li><strong>Service Improvement:</strong> Analyze usage patterns to improve our services and user experience</li>
                <li><strong>Marketing:</strong> Send promotional offers, newsletters, and updates (with your consent)</li>
                <li><strong>Legal Compliance:</strong> Comply with legal obligations and respond to legal requests</li>
                <li><strong>Analytics:</strong> Monitor and analyze trends, usage, and activities</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">4. How We Share Your Information</h2>
              <p className="text-gray-700 mb-4">
                We may share your information in the following circumstances:
              </p>
              
              <h3 className="text-xl font-semibold mb-3 mt-4">4.1 Service Providers</h3>
              <p className="text-gray-700 mb-4">
                We share information with third-party service providers who perform services on our behalf:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>Payment processors (Paystack)</li>
                <li>Cloud hosting services</li>
                <li>Email and SMS service providers</li>
                <li>Analytics providers</li>
                <li>Customer support platforms</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 mt-6">4.2 Drivers and Vehicle Operators</h3>
              <p className="text-gray-700 mb-4">
                We share necessary booking information with assigned drivers, including your name, phone number, 
                and pickup/drop-off locations.
              </p>

              <h3 className="text-xl font-semibold mb-3 mt-6">4.3 Legal Requirements</h3>
              <p className="text-gray-700 mb-4">
                We may disclose your information if required by law, court order, or government regulation, 
                or to protect the rights, property, or safety of our company, users, or others.
              </p>

              <h3 className="text-xl font-semibold mb-3 mt-6">4.4 Business Transfers</h3>
              <p className="text-gray-700">
                In the event of a merger, acquisition, or sale of assets, your information may be transferred 
                to the acquiring entity.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">5. Data Security</h2>
              <p className="text-gray-700 mb-4">
                We implement appropriate technical and organizational security measures to protect your 
                personal information:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>Encryption of data in transit and at rest</li>
                <li>Secure HTTPS connections</li>
                <li>Regular security audits and updates</li>
                <li>Access controls and authentication</li>
                <li>Employee training on data protection</li>
              </ul>
              <p className="text-gray-700">
                However, no method of transmission over the Internet or electronic storage is 100% secure. 
                While we strive to protect your personal information, we cannot guarantee absolute security.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">6. Your Privacy Rights</h2>
              <p className="text-gray-700 mb-4">
                You have the following rights regarding your personal information:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li><strong>Access:</strong> Request a copy of the personal information we hold about you</li>
                <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
                <li><strong>Deletion:</strong> Request deletion of your personal information (subject to legal requirements)</li>
                <li><strong>Objection:</strong> Object to processing of your personal information</li>
                <li><strong>Portability:</strong> Request transfer of your data to another service provider</li>
                <li><strong>Withdraw Consent:</strong> Withdraw consent for processing where we rely on consent</li>
                <li><strong>Opt-Out:</strong> Unsubscribe from marketing communications at any time</li>
              </ul>
              <p className="text-gray-700">
                To exercise these rights, please contact us at privacy@engracedsmile.com.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">7. Cookies and Tracking Technologies</h2>
              <p className="text-gray-700 mb-4">
                We use cookies and similar tracking technologies to:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>Remember your preferences and settings</li>
                <li>Analyze site traffic and usage patterns</li>
                <li>Personalize content and advertisements</li>
                <li>Improve site performance and functionality</li>
              </ul>
              <p className="text-gray-700">
                You can control cookies through your browser settings. However, disabling cookies may affect 
                the functionality of our services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">8. Data Retention</h2>
              <p className="text-gray-700">
                We retain your personal information for as long as necessary to fulfill the purposes outlined 
                in this privacy policy, unless a longer retention period is required by law. When we no longer 
                need your information, we will securely delete or anonymize it.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">9. Children's Privacy</h2>
              <p className="text-gray-700">
                Our services are not intended for individuals under the age of 18. We do not knowingly collect 
                personal information from children. If you believe we have collected information from a child, 
                please contact us immediately.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">10. International Data Transfers</h2>
              <p className="text-gray-700">
                Your information may be transferred to and processed in countries other than Nigeria. We ensure 
                appropriate safeguards are in place to protect your information in accordance with this privacy 
                policy and applicable data protection laws.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">11. Changes to This Privacy Policy</h2>
              <p className="text-gray-700">
                We may update this privacy policy from time to time. We will notify you of any material changes 
                by posting the new privacy policy on this page and updating the "Last Updated" date. Your 
                continued use of our services after changes constitutes acceptance of the updated policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">12. Contact Us</h2>
              <p className="text-gray-700 mb-4">
                If you have questions, concerns, or requests regarding this privacy policy or our data practices, 
                please contact us:
              </p>
              <ul className="list-none mt-4 text-gray-700">
                <li><strong>Email:</strong> privacy@engracedsmile.com</li>
                <li><strong>Support Email:</strong> support@engracedsmile.com</li>
                <li><strong>Phone:</strong> +234 XXX XXX XXXX</li>
                <li><strong>Address:</strong> Lagos, Nigeria</li>
              </ul>
            </section>

            <div className="bg-[#5d4a15]/10 p-6 rounded-lg mt-8">
              <p className="text-sm text-gray-700">
                By using Engraced Smile Transport Services, you acknowledge that you have read and understood 
                this Privacy Policy and consent to the collection, use, and disclosure of your information as 
                described herein.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
}

