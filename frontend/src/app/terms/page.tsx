import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center">Terms and Conditions</CardTitle>
            <p className="text-center text-gray-600 mt-2">Last updated: {new Date().toLocaleDateString()}</p>
          </CardHeader>
          <CardContent className="prose max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
              <p className="text-gray-700 mb-4">
                Welcome to Engraced Smile Transport Services. These terms and conditions outline the rules and 
                regulations for the use of our transport booking services.
              </p>
              <p className="text-gray-700">
                By accessing and using our services, you accept and agree to be bound by the terms and 
                provisions of this agreement. If you do not agree to abide by these terms, please do not 
                use our services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">2. Booking and Payment</h2>
              <p className="text-gray-700 mb-4">
                <strong>2.1 Booking Confirmation:</strong> All bookings are subject to availability and confirmation. 
                You will receive a booking confirmation via email once your payment is processed successfully.
              </p>
              <p className="text-gray-700 mb-4">
                <strong>2.2 Payment:</strong> Payment must be made in full at the time of booking. We accept 
                payments through Paystack, including card payments, bank transfers, and mobile money.
              </p>
              <p className="text-gray-700">
                <strong>2.3 Pricing:</strong> All prices are displayed in Nigerian Naira (₦). Prices may be subject 
                to change, but once your booking is confirmed, the price is guaranteed.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">3. Cancellation and Refund Policy</h2>
              <p className="text-gray-700 mb-4">
                <strong>3.1 Cancellation by Customer:</strong>
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>Cancellations made 24 hours or more before departure: Full refund minus 10% processing fee</li>
                <li>Cancellations made 12-24 hours before departure: 50% refund</li>
                <li>Cancellations made less than 12 hours before departure: No refund</li>
              </ul>
              <p className="text-gray-700">
                <strong>3.2 Cancellation by Company:</strong> If we cancel your trip due to unforeseen circumstances, 
                you will receive a full refund or be offered an alternative trip at no extra cost.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">4. Travel Requirements</h2>
              <p className="text-gray-700 mb-4">
                <strong>4.1 Passenger Responsibilities:</strong>
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>Arrive at the departure point at least 15 minutes before scheduled departure time</li>
                <li>Carry valid identification documents</li>
                <li>Ensure all personal belongings are secured</li>
                <li>Follow driver and staff instructions at all times</li>
              </ul>
              <p className="text-gray-700">
                <strong>4.2 Luggage:</strong> Each passenger is entitled to one piece of checked luggage (max 20kg) 
                and one carry-on bag. Excess luggage may incur additional charges.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">5. Liability and Insurance</h2>
              <p className="text-gray-700 mb-4">
                <strong>5.1 Passenger Safety:</strong> We maintain comprehensive insurance coverage for all our 
                vehicles and passengers. However, passengers are advised to maintain their own travel insurance.
              </p>
              <p className="text-gray-700">
                <strong>5.2 Personal Belongings:</strong> While we take reasonable care, we are not liable for 
                loss or damage to personal belongings unless caused by our negligence.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">6. Prohibited Items and Conduct</h2>
              <p className="text-gray-700 mb-4">
                <strong>6.1 Prohibited Items:</strong> The following items are not allowed on our vehicles:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>Illegal drugs or substances</li>
                <li>Weapons of any kind</li>
                <li>Flammable or hazardous materials</li>
                <li>Live animals (except service animals with prior notice)</li>
              </ul>
              <p className="text-gray-700">
                <strong>6.2 Passenger Conduct:</strong> Passengers must behave respectfully towards other 
                passengers, drivers, and staff. Disruptive behavior may result in removal from the vehicle 
                without refund.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">7. Delays and Schedule Changes</h2>
              <p className="text-gray-700">
                While we strive to maintain our schedules, delays may occur due to traffic, weather, or 
                unforeseen circumstances. We are not liable for any consequential losses resulting from delays. 
                Passengers will be notified of significant delays as soon as possible.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">8. Data Protection and Privacy</h2>
              <p className="text-gray-700">
                We are committed to protecting your personal data. Please refer to our Privacy Policy for 
                detailed information on how we collect, use, and protect your information.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">9. Modifications to Terms</h2>
              <p className="text-gray-700">
                We reserve the right to modify these terms and conditions at any time. Changes will be 
                effective immediately upon posting to our website. Continued use of our services after 
                changes constitutes acceptance of the modified terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">10. Contact Information</h2>
              <p className="text-gray-700">
                For questions or concerns regarding these terms and conditions, please contact us at:
              </p>
              <ul className="list-none mt-4 text-gray-700">
                <li><strong>Email:</strong> support@engracedsmile.com</li>
                <li><strong>Phone:</strong> +234 XXX XXX XXXX</li>
                <li><strong>Address:</strong> Lagos, Nigeria</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">11. Governing Law</h2>
              <p className="text-gray-700">
                These terms and conditions are governed by and construed in accordance with the laws of 
                the Federal Republic of Nigeria. Any disputes arising from these terms shall be subject 
                to the exclusive jurisdiction of Nigerian courts.
              </p>
            </section>

            <div className="bg-[#5d4a15]/10 p-6 rounded-lg mt-8">
              <p className="text-sm text-gray-700">
                By using our services, you acknowledge that you have read, understood, and agree to be 
                bound by these Terms and Conditions.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
}

