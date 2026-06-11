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
            At Royal Gems Heritage, we hold your personal privacy with the same uncompromising standard that guides our selection of the earth's rarest treasures. This Privacy Policy details how we collect, safeguard, and honor the identity of our discerning patrons.
          </p>

          <h2 className="font-headline-sm text-headline-sm text-primary pt-4">
            1. Information We Collect
          </h2>
          <p>
            We collect only the essential details required to deliver customized bespoke consultations, authentications, and luxury procurement logs. This includes your name, verified email for OTP registrations, physical shipping addresses, contact numbers, and voluntary consultation forms.
          </p>

          <h2 className="font-headline-sm text-headline-sm text-primary pt-4">
            2. Secure Payment Architecture
          </h2>
          <p>
            Your payment transactions are processed entirely through highly secure, fully integrated payment gateways (such as Paytm / Razorpay) using 256-bit secure encryption protocols. Royal Gems does not capture or store your bank accounts and credit cards directly in our database.
          </p>

          <h2 className="font-headline-sm text-headline-sm text-primary pt-4">
            3. patronic Discretion & Authentication
          </h2>
          <p>
            Your personal digital details are kept sacred. We do not sell, rent, or lease patron registries to third-party marketing entities. Information is shared strictly when coordinating high-value insured global courier services (such as specialized secure shipping couriers).
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
