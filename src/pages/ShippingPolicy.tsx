import React from 'react';
import Navbar from '../components/Navbar.tsx';
import Footer from '../components/Footer.tsx';

export default function ShippingPolicy() {
  return (
    <div className="bg-surface min-h-screen text-on-surface">
      <Navbar />
      <main className="pt-32 pb-section-padding max-w-4xl mx-auto px-6">
        <h1 className="font-headline-lg text-headline-lg text-primary mb-4 border-b border-border-sepia pb-4">
          Shipping Policy
        </h1>
        <p className="font-body-sm text-[12px] text-text-muted uppercase tracking-widest mb-8">
          EFFECTIVE DATE: JUNE 10, 2026
        </p>

        <div className="space-y-6 font-body-md text-on-surface-variant leading-relaxed">
          <p>
            At Royal Gems, we take full responsibility for the safe and timely delivery of every order. Each shipment is handled with the utmost care to ensure your gemstone arrives in perfect condition, securely packaged and fully insured.
          </p>

          <h2 className="font-headline-sm text-headline-sm text-primary pt-4">
            1. Shipping Charges
          </h2>
          <p>
            We offer free standard shipping on all orders above &#8377;4,000 within India. For orders below &#8377;4,000, a flat shipping fee of &#8377;299 applies. International shipping charges are calculated at checkout based on destination and order weight.
          </p>

          <h2 className="font-headline-sm text-headline-sm text-primary pt-4">
            2. Order Processing Time
          </h2>
          <p>
            All orders are processed within 1-2 business days of payment confirmation. Orders placed on weekends or public holidays will be processed on the next working business day. You will receive an email confirmation with your order details once processing is complete.
          </p>

          <h2 className="font-headline-sm text-headline-sm text-primary pt-4">
            3. Estimated Delivery Times
          </h2>
          <p>
            Estimated delivery timelines within India are as follows:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><span className="font-medium text-on-surface">Metro cities</span> (Delhi, Mumbai, Bengaluru, Chennai, Kolkata, Hyderabad): 2-4 business days</li>
            <li><span className="font-medium text-on-surface">Tier 2 &amp; Tier 3 cities:</span> 4-7 business days</li>
            <li><span className="font-medium text-on-surface">Remote or rural areas:</span> 7-10 business days</li>
            <li><span className="font-medium text-on-surface">International orders:</span> 10-15 business days (subject to customs clearance)</li>
          </ul>
          <p>
            These are estimates only and may vary due to courier delays, public holidays, or unforeseen circumstances beyond our control.
          </p>

          <h2 className="font-headline-sm text-headline-sm text-primary pt-4">
            4. Packaging
          </h2>
          <p>
            Every order is packed in Royal Gems branded tamper-evident packaging designed to protect the gemstone during transit. Loose stones are individually wrapped and cushioned. Jewellery pieces are placed in protective jewellery boxes before being sealed in the outer shipping package.
          </p>

          <h2 className="font-headline-sm text-headline-sm text-primary pt-4">
            5. Shipment Tracking
          </h2>
          <p>
            Once your order has been dispatched, you will receive an email containing your tracking number and a link to track your shipment in real time. If you do not receive a tracking update within 3 business days of your order confirmation, please contact us at royalgemskolkata@gmail.com.
          </p>

          <h2 className="font-headline-sm text-headline-sm text-primary pt-4">
            6. Shipping Insurance
          </h2>
          <p>
            All shipments are insured for the full declared value of the order. In the unlikely event that a shipment is lost or damaged in transit, Royal Gems will initiate a full investigation with the courier and process a replacement or refund upon claim resolution. Please report any delivery damage within 24 hours of receipt with supporting photographs.
          </p>

          <h2 className="font-headline-sm text-headline-sm text-primary pt-4">
            7. Incorrect Delivery Address
          </h2>
          <p>
            Please ensure that the delivery address provided at checkout is accurate and complete. Royal Gems is not responsible for delays or failed deliveries resulting from an incorrect or incomplete address. Address corrections after dispatch may not be possible and may incur additional charges.
          </p>

          <h2 className="font-headline-sm text-headline-sm text-primary pt-4">
            8. International Shipping &amp; Customs
          </h2>
          <p>
            International orders may be subject to import duties, customs fees, and taxes levied by the destination country. These charges are the sole responsibility of the customer and are not included in the order total or shipping charges. Royal Gems is not responsible for delays caused by customs clearance procedures.
          </p>

          <h2 className="font-headline-sm text-headline-sm text-primary pt-4">
            9. Contact Us
          </h2>
          <p>
            For any shipping related queries, please contact us at:
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
