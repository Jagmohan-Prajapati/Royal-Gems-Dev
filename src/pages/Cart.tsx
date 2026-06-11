import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore.ts';
import Navbar from '../components/Navbar.tsx';
import Footer from '../components/Footer.tsx';
import { Trash2, ShieldCheck, Heart, Award, ArrowLeft, ArrowRight, Minus, Plus } from 'lucide-react';
import { formatPrice } from '../lib/utils.ts';

export default function Cart() {
  const { items, removeItem, updateQuantity, subtotal, shipping, total } = useCartStore();
  const navigate = useNavigate();

  const handleCheckout = () => {
    navigate('/checkout');
  };

  return (
    <div className="bg-surface min-h-screen text-on-surface select-none pb-0">
      <Navbar />

      <main className="pt-32 pb-20 max-w-container-max mx-auto px-4 md:px-gutter">
        {/* Page Header */}
        <div className="mb-10 text-center select-text">
          <h2 className="font-headline-md text-headline-lg text-primary mb-2">Heritage Cart</h2>
          <p className="font-body-md text-text-muted">Review your selection of rare acquisitions.</p>
        </div>

        {items.length === 0 ? (
          <div className="py-20 text-center max-w-md mx-auto">
            <ShoppingBagFallback />
            <h3 className="font-headline-sm text-headline-sm text-primary mb-2">Your Cart is Empty</h3>
            <p className="font-body-md text-text-muted mb-8 leading-relaxed">
              Before you can secure custom certificates, you must select items from our heritage collections.
            </p>
            <Link
              to="/shop"
              className="bg-primary hover:bg-primary-container text-white px-10 py-4 font-label-caps text-label-caps tracking-widest text-[11px] font-semibold border border-secondary transition-all inline-block uppercase"
            >
              Explore Collection
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
            
            {/* Left: Cart Items list */}
            <div className="lg:col-span-8 space-y-6">
              <div className="border-b border-outline-variant/35 pb-2 flex items-center justify-between font-label-caps text-[11px] text-text-muted uppercase tracking-widest">
                <span>Product Details</span>
                <span className="hidden md:block">Price</span>
              </div>

              {items.map((item) => (
                <div
                  key={item.productId}
                  className="flex flex-col sm:flex-row gap-6 py-6 border-b border-outline-variant/20 group"
                >
                  <div className="w-full sm:w-40 aspect-square overflow-hidden bg-surface-dim relative border border-outline-variant/10 flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between select-text">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-label-caps text-[9px] text-primary mb-1 block uppercase tracking-widest font-semibold">
                          {item.category || 'Atelier Selection'}
                        </span>
                        <h3 className="font-headline-sm text-[20px] text-on-surface mb-2 font-medium">
                          {item.name}
                        </h3>
                        <p className="font-body-sm text-text-muted max-w-md text-[13px] leading-relaxed">
                          Includes international laboratory certification and moisture-controlled packaging.
                        </p>
                      </div>
                      <button
                        onClick={() => removeItem(item.productId)}
                        className="text-outline hover:text-primary transition-colors p-2 rounded-full cursor-pointer hover:bg-red-50"
                        title="Remove Item"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>

                    <div className="flex justify-between items-center mt-6 select-none">
                      <div className="flex items-center border border-border-sepia bg-white">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="p-2 hover:bg-surface-parchment/60 transition-colors"
                        >
                          <Minus className="h-4 w-4 text-primary" />
                        </button>
                        <span className="px-4 font-headline-sm text-[16px] text-primary font-semibold font-mono">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="p-2 hover:bg-surface-parchment/60 transition-colors"
                        >
                          <Plus className="h-4 w-4 text-primary" />
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="font-headline-sm text-headline-sm text-secondary font-semibold font-mono">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <Link
                to="/shop"
                className="inline-flex items-center gap-2 text-primary font-label-caps text-label-caps hover:gap-4 transition-all mt-8 font-semibold text-[11px] tracking-widest uppercase"
              >
                <ArrowLeft className="h-4 w-4" /> CONTINUE SHOPPING
              </Link>
            </div>

            {/* Right: Summary panel */}
            <aside className="lg:col-span-4 sticky top-32">
              <div className="bg-surface-parchment p-8 border border-outline-variant/30 relative select-text">
                <div className="absolute top-0 right-0 p-2 opacity-5 pointer-events-none">
                  <Award className="h-20 w-20 text-primary" />
                </div>

                <h3 className="font-headline-sm text-headline-sm text-primary mb-6 border-b border-outline-variant/20 pb-4 uppercase tracking-widest">
                  Acquisition Summary
                </h3>

                <div className="space-y-4 mb-8">
                  <div className="flex justify-between items-center">
                    <span className="font-body-md text-text-muted">Subtotal</span>
                    <span className="font-body-lg text-on-surface font-semibold font-mono">
                      {formatPrice(subtotal())}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-body-md text-text-muted">Secured Courier Delivery</span>
                    <span className="font-body-lg text-on-surface font-semibold font-mono">
                      {shipping() === 0 ? 'Complimentary' : formatPrice(shipping())}
                    </span>
                  </div>
                </div>

                {/* Double Rule line */}
                <div className="h-1.5 border-t border-b border-border-sepia/30 w-full my-6 select-none" />

                <div className="flex justify-between items-center mb-8">
                  <span className="font-headline-sm text-headline-sm text-primary uppercase tracking-wide">
                    Total
                  </span>
                  <span className="font-headline-sm text-[26px] text-secondary font-bold font-mono">
                    {formatPrice(total())}
                  </span>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full bg-primary text-on-primary py-5 font-label-caps text-label-caps tracking-[0.2em] border border-primary hover:bg-primary-container transition-all duration-300 shadow-lg active:scale-98 font-semibold text-[11px] select-none uppercase"
                >
                  PROCEED TO SECURE CHECKOUT
                </button>

                <div className="space-y-4 pt-6 border-t border-outline-variant/20 mt-6 select-none">
                  <div className="flex items-center gap-3 text-text-muted text-[11px]">
                    <ShieldCheck className="h-5 w-5 text-secondary flex-shrink-0" />
                    <span className="font-label-caps uppercase tracking-wider">
                      GIA Certified Authenticity Guaranteed
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-text-muted text-[11px]">
                    <ShieldCheck className="h-5 w-5 text-secondary flex-shrink-0" />
                    <span className="font-label-caps uppercase tracking-wider">
                      256-bit Secure Encryption Process
                    </span>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

function ShoppingBagFallback() {
  return (
    <div className="mb-6 inline-block p-6 bg-surface-parchment rounded-full border border-border-sepia/10">
      <Award className="h-12 w-12 text-primary animate-pulse" />
    </div>
  );
}
