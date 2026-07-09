import React from 'react';
import Navbar from '../components/Navbar.tsx';
import Footer from '../components/Footer.tsx';

export default function TermsAndConditions() {
  return (
    <div className="bg-surface min-h-screen text-on-surface">
      <Navbar />
      <main className="pt-32 pb-section-padding max-w-4xl mx-auto px-6">
        <h1 className="font-headline-lg text-headline-lg text-primary mb-4 border-b border-border-sepia pb-4">
          Terms &amp; Conditions
        </h1>
        <p className="font-body-sm text-[12px] text-text-muted uppercase tracking-widest mb-8">
          EFFECTIVE DATE: JUNE 10, 2026
        </p>

        <div className="space-y-6 font-body-md text-on-surface-variant leading-relaxed">
          <p>
            Please read these Terms &amp; Conditions carefully before using the Royal Gems website or placing an order. By accessing our website or making a purchase, you agree to be bound by the terms set out below. If you do not agree to these terms, please do not use our services.
          </p>

          <h2 className="font-headline-sm text-headline-sm text-primary pt-4">
            1. About Royal Gems
          </h2>
          <p>
            Royal Gems is an online gemstone and jewellery retailer based in Kolkata, India. We specialise in the sale of natural, certified gemstones sourced ethically from recognised global origins. Our registered business address is 13/H/29, Mayur Bhanj Road, Kolkata - 700023.
          </p>

          <h2 className="font-headline-sm text-headline-sm text-primary pt-4">
            2. Eligibility
          </h2>
          <p>
            You must be at least 18 years of age to use our website and place an order. By using this website, you confirm that you are of legal age and have the legal capacity to enter into a binding agreement. Royal Gems reserves the right to refuse service to anyone at its sole discretion.
          </p>

          <h2 className="font-headline-sm text-headline-sm text-primary pt-4">
            3. Product Descriptions &amp; Accuracy
          </h2>
          <p>
            We make every effort to accurately describe our products, including weight in carats, origin, colour, and treatment status. However, as natural gemstones are unique, minor variations in colour and appearance between the product photographs and the actual stone may occur. All weights and measurements are approximate and may vary slightly.
          </p>

          <h2 className="font-headline-sm text-headline-sm text-primary pt-4">
            4. Pricing &amp; Payment
          </h2>
          <p>
            All prices displayed on our website are in Indian Rupees (INR) and are inclusive of applicable taxes unless otherwise stated. Prices are subject to change without notice. We accept payments via Razorpay, which supports UPI, credit/debit cards, and net banking. Your payment is processed securely and we do not store any payment card information.
          </p>

          <h2 className="font-headline-sm text-headline-sm text-primary pt-4">
            5. Order Acceptance &amp; Cancellation
          </h2>
          <p>
            Placing an order on our website constitutes an offer to purchase. Royal Gems reserves the right to accept or reject any order at its sole discretion. Orders may be cancelled before dispatch by contacting us at royalgemskolkata@gmail.com. Once dispatched, orders cannot be cancelled and the standard return process applies. In the event of a payment being collected for an order we are unable to fulfil, a full refund will be issued within 7 business days.
          </p>

          <h2 className="font-headline-sm text-headline-sm text-primary pt-4">
            6. Certification &amp; Authenticity
          </h2>
          <p>
            Certain gemstones in our collection are accompanied by certificates from recognised gemological laboratories. Laboratory certificates, where provided, will be clearly mentioned in the product listing. Royal Gems does not guarantee specific astrological outcomes or benefits for any gemstone. Astrological information provided is for reference purposes only.
          </p>

          <h2 className="font-headline-sm text-headline-sm text-primary pt-4">
            7. Intellectual Property
          </h2>
          <p>
            All content on this website, including product photographs, descriptions, logos, graphics, and text, is the intellectual property of Royal Gems or its content suppliers and is protected under applicable copyright law. You may not reproduce, distribute, or use any content from this website without prior written permission.
          </p>

          <h2 className="font-headline-sm text-headline-sm text-primary pt-4">
            8. Limitation of Liability
          </h2>
          <p>
            Royal Gems shall not be liable for any indirect, incidental, consequential, or punitive damages arising from your use of our website or products, including but not limited to loss of profits, data, or goodwill. Our total liability to you for any claim arising from a purchase shall not exceed the amount paid for the specific order in question.
          </p>

          <h2 className="font-headline-sm text-headline-sm text-primary pt-4">
            9. Governing Law
          </h2>
          <p>
            These Terms &amp; Conditions are governed by and construed in accordance with the laws of India. Any disputes arising out of or in connection with these terms shall be subject to the exclusive jurisdiction of the courts of Kolkata, West Bengal.
          </p>

          <h2 className="font-headline-sm text-headline-sm text-primary pt-4">
            10. Changes to Terms
          </h2>
          <p>
            Royal Gems reserves the right to update or modify these Terms &amp; Conditions at any time without prior notice. Changes will be effective immediately upon posting on the website. Your continued use of our services following any changes constitutes your acceptance of the revised terms. We recommend reviewing these terms periodically.
          </p>

          <h2 className="font-headline-sm text-headline-sm text-primary pt-4">
            11. Contact Us
          </h2>
          <p>
            If you have any questions about these Terms &amp; Conditions, please contact us at:
          </p>
          <ul className="list-none pl-0 space-y-1">
            <li><span className="text-primary font-medium">Email:</span> royalgemskolkata@gmail.com</li>
            <li><span className="text-primary font-medium">Address:</span> 13/H/29, Mayur Bhanj Road, Kolkata - 700023</li>
          </ul>
        </div>
      </main>
      <Footer />
    </div>
  );
}
