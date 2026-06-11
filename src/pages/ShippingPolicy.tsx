import React from 'react';
import Navbar from '../components/Navbar.tsx';
import Footer from '../components/Footer.tsx';

export default function ShippingPolicy() {
  return (
    <div className="bg-surface min-h-screen text-on-surface">
      <Navbar />
      <main className="pt-32 pb-section-padding max-w-4xl mx-auto px-6">
        <h1 className="font-headline-lg text-headline-lg text-primary mb-4 border-b border-border-sepia pb-4">
          Insured Shipping Policy
        </h1>
        <p className="font-body-sm text-[12px] text-text-muted uppercase tracking-widest mb-8">
          EFFECTIVE DATE: JUNE 10, 2026
        </p>

        <div className="space-y-6 font-body-md text-on-surface-variant leading-relaxed">
          <p>
            Royal Gems takes ultimate responsibility for the safe, secure, and fully insured transportation of our treasures. We ensure that every piece reaches your hands in pristine condition.
          </p>

          <h2 className="font-headline-sm text-headline-sm text-primary pt-4">
            1. Complimentary Secured Shipping
          </h2>
          <p>
            To honor your patronage, we offer complimentary high-value secured shipping within India for all orders over ₹4,000. Orders under ₹4,000 carry a standard insured courier fee of ₹299.
          </p>

          <h2 className="font-headline-sm text-headline-sm text-primary pt-4">
            2. High-Value Couriers & Mahogany Packaging
          </h2>
          <p>
            Each geological masterpiece is housed inside an airtight, moisture-controlled mahogany presentation cabinet with dual serial-coded seals. Handover is coordinated exclusively via specialized high-value courier guards directly requiring matching physical government-issued ID checks and signature.
          </p>

          <h2 className="font-headline-sm text-headline-sm text-primary pt-4">
            3. International Delivery Options
          </h2>
          <p>
            We accommodate global delivery requests with customized tariffs depending on international customs validation and logistics. All global parcels are backed by Lloyds coverage.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
