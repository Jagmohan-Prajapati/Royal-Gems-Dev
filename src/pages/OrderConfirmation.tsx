import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar.tsx';
import Footer from '../components/Footer.tsx';
import { Award, CheckCircle2, Loader2, ArrowRight } from 'lucide-react';
import { formatPrice } from '../lib/utils.ts';

export default function OrderConfirmation() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const res = await fetch(`/api/orders/${id}`);
        if (res.ok) {
          const data = await res.json();
          setOrder(data.order);
        }
      } catch (err) {
        console.error('Failed to load order details:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchOrderDetails();
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface flex flex-col justify-center items-center gap-3">
        <Loader2 className="h-10 w-10 text-primary animate-spin" />
        <p className="font-label-caps text-label-caps text-text-muted opacity-80 uppercase tracking-widest animate-pulse">
          Securing Registry Information...
        </p>
      </div>
    );
  }

  return (
    <div className="bg-surface min-h-screen text-on-surface select-none pb-0">
      <Navbar />

      <main className="pt-32 pb-20 px-4 md:px-gutter max-w-2xl mx-auto text-center select-text">
        <div className="bg-surface-parchment p-8 md:p-12 border border-border-sepia relative shadow-lg">
          {/* Top award symbol overlay */}
          <div className="absolute top-0 right-0 p-2 opacity-5 pointer-events-none">
            <Award className="h-24 w-24 text-primary" />
          </div>

          <CheckCircle2 className="h-16 w-16 text-success-forest mx-auto mb-6 animate-pulse" />
          
          <h1 className="font-headline-lg text-[32px] md:text-headline-lg text-primary mb-3 uppercase">
            Acquisition Secured
          </h1>
          <p className="font-label-caps text-[11px] text-secondary font-bold tracking-widest mb-6">
            ORDER ID: {id}
          </p>

          <p className="font-body-md text-on-surface-variant max-w-md mx-auto mb-8 leading-relaxed italic">
            Thank you for your patronage. We are currently preparing your handcrafted mahogany presentation cabinet for secure courier handover.
          </p>

          {/* Sourcing credentials block */}
          <div className="text-left bg-white p-6 border border-border-sepia/30 space-y-4 mb-8">
            <h3 className="font-label-caps text-[11px] text-primary uppercase font-bold tracking-wider border-b border-border-sepia/20 pb-2">
              Shipment Details
            </h3>
            <div className="space-y-2 text-[13px] font-body-sm">
              <div className="flex justify-between">
                <span className="text-text-muted">Total Security Value:</span>
                <span className="font-semibold text-secondary font-mono">{order ? formatPrice(order.amount) : '₹ 12,45,000'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Payment status:</span>
                <span className="text-success-forest font-semibold uppercase font-mono">PAID via Paytm</span>
              </div>
              {order?.address && (
                <div className="pt-2 border-t border-border-sepia/10">
                  <span className="text-text-muted block font-semibold text-[11px] uppercase mb-1">Delivering to:</span>
                  <p className="font-semibold text-on-surface">{order.address.name}</p>
                  <p className="text-text-muted leading-relaxed">
                    {order.address.street}, {order.address.city}, {order.address.pincode}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center select-none">
            <Link
              to="/shop"
              className="bg-primary text-on-primary py-4 px-8 font-label-caps text-[11px] tracking-widest hover:bg-primary-container transition-all uppercase inline-block border border-primary font-semibold"
            >
              Continue Exploring
            </Link>
            <Link
              to="/account"
              className="border border-primary text-primary py-4 px-8 font-label-caps text-[11px] tracking-widest hover:bg-surface-parchment transition-all uppercase inline-block font-semibold"
            >
              Go to Account
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
