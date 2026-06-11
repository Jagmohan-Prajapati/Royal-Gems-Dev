import React from 'react';
import Navbar from '../components/Navbar.tsx';
import Footer from '../components/Footer.tsx';

export default function RefundPolicy() {
  return (
    <div className="bg-surface min-h-screen text-on-surface">
      <Navbar />
      <main className="pt-32 pb-section-padding max-w-4xl mx-auto px-6">
        <h1 className="font-headline-lg text-headline-lg text-primary mb-4 border-b border-border-sepia pb-4">
          Refund & Valuation Policy
        </h1>
        <p className="font-body-sm text-[12px] text-text-muted uppercase tracking-widest mb-8">
          REVISED: JUNE 10, 2026
        </p>

        <div className="space-y-6 font-body-md text-on-surface-variant leading-relaxed">
          <p>
            Due to the exceptional nature and exquisite rarity of the masterfully carved gemstones inside the Royal Gems collection, our returns are handled through a dedicated inspection process.
          </p>

          <h2 className="font-headline-sm text-headline-sm text-primary pt-4">
            1. 14-Day Private Inspection
          </h2>
          <p>
            Patrons enjoy a 14-day inspection period from the date of secure delivery. Within this window, you may request a return or a substitution for another stone of equal legacy.
          </p>

          <h2 className="font-headline-sm text-headline-sm text-primary pt-4">
            2. Laboratory Seals & Digital Fingerprints
          </h2>
          <p>
            For a return to be validated:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>The original international laboratory certificate (GIA, IGI, or GRS) must remain fully intact.</li>
            <li>The protective security seals must be unbroken.</li>
            <li>The stone must perfectly match the unique microscopic digital fingerprint stored in our archives during procurement.</li>
          </ul>

          <h2 className="font-headline-sm text-headline-sm text-primary pt-4">
            3. Process of Refund
          </h2>
          <p>
            Once our internal master jewelers verify the authenticity and unaltered state of the returned item, a credit refund will be initiated to the original payment source within 7-10 business days.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
