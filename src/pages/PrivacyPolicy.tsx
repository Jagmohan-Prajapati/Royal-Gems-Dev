import React from 'react';
import Navbar from '../components/Navbar.tsx';
import Footer from '../components/Footer.tsx';

export default function PrivacyPolicy() {
  return (
    <div className="bg-surface min-h-screen text-on-surface">
      <Navbar />
      <main className="pt-32 pb-section-padding max-w-4xl mx-auto px-6">
        <h1 className="font-headline-lg text-headline-lg text-primary mb-4 border-b border-border-sepia pb-4">
          Privacy Policy
        </h1>
        <p className="font-body-sm text-[12px] text-text-muted uppercase tracking-widest mb-8">
          EFFECTIVE DATE: JUNE 10, 2026
        </p>

        <div className="space-y-6 font-body-md text-on-surface-variant leading-relaxed">
          <p>
            At Royal Gems, we hold your personal privacy with the same uncompromising standard that guides our selection of the earth's rarest treasures. This Privacy Policy explains how we collect, use, store, and protect your personal information when you visit our website or make a purchase.
          </p>

          <h2 className="font-headline-sm text-headline-sm text-primary pt-4">
            1. Information We Collect
          </h2>
          <p>
            We collect only the information necessary to provide you with a seamless and secure shopping experience. This includes:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Full name and contact details (email address, phone number)</li>
            <li>Billing and shipping address</li>
            <li>Account credentials (email used for OTP-based login)</li>
            <li>Order history and transaction records</li>
            <li>Device and browser information for security and analytics purposes</li>
          </ul>

          <h2 className="font-headline-sm text-headline-sm text-primary pt-4">
            2. How We Use Your Information
          </h2>
          <p>
            The information we collect is used solely to:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Process and fulfil your orders accurately and securely</li>
            <li>Send order confirmations, shipping updates, and delivery notifications</li>
            <li>Provide customer support and respond to your enquiries</li>
            <li>Maintain secure account authentication via OTP</li>
            <li>Comply with applicable legal and regulatory obligations</li>
            <li>Improve our website experience based on anonymised usage data</li>
          </ul>

          <h2 className="font-headline-sm text-headline-sm text-primary pt-4">
            3. Secure Payment Processing
          </h2>
          <p>
            All payment transactions on Royal Gems are processed through PCI-DSS compliant payment gateways (Razorpay / Paytm) using 256-bit SSL encryption. We do not store, access, or retain your credit card numbers, bank account details, or CVV information on our servers at any point.
          </p>

          <h2 className="font-headline-sm text-headline-sm text-primary pt-4">
            4. Data Sharing & Third Parties
          </h2>
          <p>
            Royal Gems does not sell, rent, or trade your personal information to any third party for marketing purposes. Your data may be shared only in the following limited circumstances:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>With secure courier and logistics partners solely to fulfil your order delivery</li>
            <li>With our payment gateway providers to process transactions</li>
            <li>When required by law, court order, or government authority</li>
          </ul>

          <h2 className="font-headline-sm text-headline-sm text-primary pt-4">
            5. Cookies & Tracking
          </h2>
          <p>
            Our website uses cookies to enhance your browsing experience, remember your session, and analyse site traffic. You may disable cookies through your browser settings; however, certain features of the website may not function correctly without them. We do not use third-party advertising cookies.
          </p>

          <h2 className="font-headline-sm text-headline-sm text-primary pt-4">
            6. Data Retention
          </h2>
          <p>
            We retain your personal data for as long as your account remains active or as required to fulfil our legal and business obligations. Order records are retained for a minimum of 5 years as required under Indian accounting and tax regulations. You may request deletion of your account and associated data at any time by contacting us at royalgemskolkata@gmail.com.
          </p>

          <h2 className="font-headline-sm text-headline-sm text-primary pt-4">
            7. Your Rights
          </h2>
          <p>
            You have the right to access, correct, or request deletion of your personal information held by us. To exercise any of these rights, please contact us at royalgemskolkata@gmail.com. We will respond to all verified requests within 30 days.
          </p>

          <h2 className="font-headline-sm text-headline-sm text-primary pt-4">
            8. Children's Privacy
          </h2>
          <p>
            Royal Gems is not intended for use by individuals under the age of 18. We do not knowingly collect personal information from minors. If you believe a minor has provided us with personal data, please contact us immediately and we will delete such information promptly.
          </p>

          <h2 className="font-headline-sm text-headline-sm text-primary pt-4">
            9. Changes to This Policy
          </h2>
          <p>
            We may update this Privacy Policy from time to time to reflect changes in our practices or applicable law. Any significant changes will be communicated via email or a prominent notice on our website. Continued use of our services following any changes constitutes your acceptance of the revised policy.
          </p>

          <h2 className="font-headline-sm text-headline-sm text-primary pt-4">
            10. Contact Us
          </h2>
          <p>
            If you have any questions, concerns, or requests regarding this Privacy Policy, please reach out to us at:
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
