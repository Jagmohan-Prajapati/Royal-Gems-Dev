import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar.tsx';
import Footer from '../components/Footer.tsx';
import { Award, CheckCircle2, Loader2, Mail, MapPin, Clock } from 'lucide-react';
import { formatPrice } from '../lib/utils.ts';

export default function OrderConfirmation() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const res = await fetch(`/api/orders/${id}`);
        if (res.ok) {
          const data = await res.json();
          // Server returns the order object directly, not wrapped in { order }
          setOrder(data);
        } else {
          setError('We could not locate this order. Please check your account for details.');
        }
      } catch (err) {
        console.error('Failed to load order details:', err);
        setError('We could not load your order details right now.');
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

  const isPaid = order?.isPaid === true;

  return (
    <div className="bg-surface min-h-screen text-on-surface select-none pb-0">
      <Navbar />

      <main className="pt-32 pb-20 px-4 md:px-gutter max-w-2xl mx-auto text-center select-text">
        <div className="bg-surface-parchment p-8 md:p-12 border border-border-sepia relative shadow-lg">
          {/* Top award symbol overlay */}
          <div className="absolute top-0 right-0 p-2 opacity-5 pointer-events-none">
            <Award className="h-24 w-24 text-primary" />
          </div>

          <CheckCircle2 className="h-16 w-16 text-success-forest mx-auto mb-6" />

          <h1 className="font-headline-lg text-[32px] md:text-headline-lg text-primary mb-3 uppercase">
            Order Recorded
          </h1>
          <p className="font-label-caps text-[11px] text-secondary font-bold tracking-widest mb-6">
            ORDER ID: {id}
          </p>

          {error ? (
            <p className="font-body-md text-error max-w-md mx-auto mb-8 leading-relaxed">
              {error}
            </p>
          ) : (
            <p className="font-body-md text-on-surface-variant max-w-md mx-auto mb-8 leading-relaxed italic">
              Thank you for your patronage. Your selection has been reserved and our curators are
              preparing your handcrafted presentation.
            </p>
          )}

          {/* Payment status notice — offline payment flow */}
          {!isPaid && !error && (
            <div className="text-left bg-white border border-secondary/40 p-6 mb-8 flex gap-4 items-start">
              <Clock className="h-6 w-6 text-secondary flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-label-caps text-[11px] text-primary uppercase font-bold tracking-wider mb-1">
                  Payment Pending — Concierge Follow-up
                </h3>
                <p className="font-body-sm text-[13px] text-on-surface-variant leading-relaxed">
                  Online payment is currently being activated. A Royal Gems curator will contact
                  you shortly to complete payment securely and confirm your delivery timeline.
                </p>
                <div className="mt-3 space-y-1">
                  <a
                    href="mailto:royalgemskolkata@gmail.com"
                    className="flex items-center gap-2 font-body-sm text-[12px] text-primary hover:underline w-fit"
                  >
                    <Mail className="h-3.5 w-3.5" />
                    royalgemskolkata@gmail.com
                  </a>
                  <p className="flex items-start gap-2 font-body-sm text-[12px] text-on-surface-variant">
                    <MapPin className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" />
                    13/H/29, Mayur Bhanj Road, Kolkata — 700023
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Order details block */}
          {order && (
            <div className="text-left bg-white p-6 border border-border-sepia/30 space-y-4 mb-8">
              <h3 className="font-label-caps text-[11px] text-primary uppercase font-bold tracking-wider border-b border-border-sepia/20 pb-2">
                Order Details
              </h3>
              <div className="space-y-2 text-[13px] font-body-sm">
                <div className="flex justify-between">
                  <span className="text-text-muted">Total Value:</span>
                  <span className="font-semibold text-secondary font-mono">
                    {formatPrice(order.amount)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Payment status:</span>
                  <span
                    className={`font-semibold uppercase font-mono ${isPaid ? 'text-success-forest' : 'text-secondary'
                      }`}
                  >
                    {isPaid ? 'PAID' : 'PENDING'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Order status:</span>
                  <span className="font-semibold uppercase font-mono text-on-surface">
                    {order.status || 'PENDING'}
                  </span>
                </div>
                {order?.address && (
                  <div className="pt-2 border-t border-border-sepia/10">
                    <span className="text-text-muted block font-semibold text-[11px] uppercase mb-1">
                      Delivering to:
                    </span>
                    <p className="font-semibold text-on-surface">
                      {order.address.fullName}
                    </p>
                    <p className="text-text-muted leading-relaxed">
                      {order.address.line1}
                      {order.address.line2 ? `, ${order.address.line2}` : ''},{' '}
                      {order.address.city}, {order.address.pinCode}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

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
