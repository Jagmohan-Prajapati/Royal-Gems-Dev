import React from 'react';
import Navbar from '../components/Navbar.tsx';
import Footer from '../components/Footer.tsx';

export default function RefundPolicy() {
  return (
    <div className="bg-surface min-h-screen text-on-surface">
      <Navbar />
      <main className="pt-32 pb-section-padding max-w-4xl mx-auto px-6">
        <h1 className="font-headline-lg text-headline-lg text-primary mb-4 border-b border-border-sepia pb-4">
          Refund & Return Policy
        </h1>
        <p className="font-body-sm text-[12px] text-text-muted uppercase tracking-widest mb-8">
          EFFECTIVE DATE: JUNE 10, 2026
        </p>

        <div className="space-y-6 font-body-md text-on-surface-variant leading-relaxed">
          <p>
            At Royal Gems, every gemstone is individually sourced, graded, and authenticated before it reaches you. Due to the unique and irreplaceable nature of natural gemstones, our refund and return process follows a careful, structured protocol to ensure fairness and integrity for both parties.
          </p>

          <h2 className="font-headline-sm text-headline-sm text-primary pt-4">
            1. 7-Day Return Window
          </h2>
          <p>
            You may initiate a return request within 7 days of the confirmed delivery date. To be eligible, the item must be unused, unaltered, and returned in its original packaging with all accompanying documentation. Returns requested after 7 days from delivery will not be accepted.
          </p>

          <h2 className="font-headline-sm text-headline-sm text-primary pt-4">
            2. Eligibility Conditions
          </h2>
          <p>
            For a return to be accepted, all of the following conditions must be met:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>The gemstone must be in its original, unset, unmodified condition</li>
            <li>The original laboratory certificate (if provided) must be intact and submitted with the return</li>
            <li>The item must be in its original Royal Gems packaging with tamper-proof seals unbroken</li>
            <li>A valid order ID and registered email must be provided at the time of return request</li>
          </ul>

          <h2 className="font-headline-sm text-headline-sm text-primary pt-4">
            3. Non-Returnable Items
          </h2>
          <p>
            The following items are not eligible for return or refund:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Gemstones that have been set into jewellery or altered in any way after delivery</li>
            <li>Custom-cut or bespoke-designed stones ordered to specific client requirements</li>
            <li>Items returned without original packaging or certification</li>
            <li>Orders where the return request is raised after the 7-day window</li>
          </ul>

          <h2 className="font-headline-sm text-headline-sm text-primary pt-4">
            4. How to Initiate a Return
          </h2>
          <p>
            To begin the return process, please email us at royalgemskolkata@gmail.com with your order ID, the reason for return, and clear photographs of the item and its packaging. Our team will review your request within 2 business days and provide return shipping instructions.
          </p>

          <h2 className="font-headline-sm text-headline-sm text-primary pt-4">
            5. Return Shipping
          </h2>
          <p>
            The customer is responsible for the cost of return shipping unless the item received was incorrect or defective due to our error. We strongly recommend using an insured, tracked courier service for the return. Royal Gems is not responsible for items lost or damaged during return transit.
          </p>

          <h2 className="font-headline-sm text-headline-sm text-primary pt-4">
            6. Refund Processing
          </h2>
          <p>
            Once we receive and inspect the returned item and confirm it meets all eligibility criteria, the refund will be processed to your original payment method within 7-10 business days. You will receive an email confirmation once the refund has been initiated. Please note that your bank or payment provider may take additional time to reflect the credit in your account.
          </p>

          <h2 className="font-headline-sm text-headline-sm text-primary pt-4">
            7. Partial Refunds & Deductions
          </h2>
          <p>
            In cases where items are returned with minor damage, missing documentation, or incomplete packaging, Royal Gems reserves the right to apply a partial deduction from the refund amount at our sole discretion. You will be informed of any such deduction before the refund is processed.
          </p>

          <h2 className="font-headline-sm text-headline-sm text-primary pt-4">
            8. Exchanges
          </h2>
          <p>
            We do not offer direct exchanges at this time. If you wish to exchange an item, please initiate a return (subject to eligibility) and place a new order for the desired item.
          </p>

          <h2 className="font-headline-sm text-headline-sm text-primary pt-4">
            9. Contact Us
          </h2>
          <p>
            For any return or refund related queries, please contact us at:
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
