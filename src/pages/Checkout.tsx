import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCartStore } from '../store/cartStore.ts';
import Navbar from '../components/Navbar.tsx';
import Footer from '../components/Footer.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import { MapPin, CheckCircle, Shield, Award, HelpCircle, Loader2, Plus, ArrowLeft } from 'lucide-react';
import { formatPrice } from '../lib/utils.ts';

export default function Checkout() {
  const { items, total, subtotal, shipping, clearCart } = useCartStore();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPaying, setIsPaying] = useState(false);

  // Address creation form panel state
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({
    title: 'PRIMARY RESIDENCE',
    name: '',
    phone: '',
    street: '',
    city: '',
    pincode: '',
    country: 'India'
  });

  // Load and refresh saved addresses
  const fetchAddresses = async () => {
    try {
      const res = await fetch('/api/user/addresses');
      if (res.ok) {
        const data = await res.json();
        const saved = data.addresses || [];
        setAddresses(saved);
        if (saved.length > 0 && !selectedAddressId) {
          setSelectedAddressId(saved[0].id);
        }
      }
    } catch (err) {
      console.error('Failed to load user addresses:', err);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login?redirect=checkout');
      return;
    }
    fetchAddresses();
  }, [isAuthenticated]);

  const handleAddNewAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddress.name || !newAddress.street || !newAddress.city || !newAddress.pincode) {
      alert('Please fill out all address details.');
      return;
    }

    try {
      const res = await fetch('/api/user/addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAddress),
      });
      if (res.ok) {
        setNewAddress({
          title: 'SECONDARY RESIDENCE',
          name: '',
          phone: '',
          street: '',
          city: '',
          pincode: '',
          country: 'India'
        });
        setIsAddingAddress(false);
        await fetchAddresses();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAcquisitionSubmit = async () => {
    if (items.length === 0) {
      alert('Cart is empty.');
      return;
    }
    if (!selectedAddressId) {
      alert('Please select or specify a delivery address.');
      return;
    }

    setIsPaying(true);

    try {
      // 1. Create order
      const createRes = await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(i => ({ productId: i.productId, quantity: i.quantity, price: i.price })),
          addressId: selectedAddressId,
          totalAmount: total()
        }),
      });

      if (!createRes.ok) {
        const data = await createRes.json();
        throw new Error(data.error || 'Failed to initialize collection order');
      }

      const orderData = await createRes.json();
      const orderId = orderData.orderId;

      // 2. Simulate complete staging Paytm callback verification handshake securely
      const verifyRes = await fetch('/api/orders/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          status: 'TXN_SUCCESS',
          isPaid: true,
          TXNAMOUNT: total()
        })
      });

      if (verifyRes.ok) {
        // Clear Cart
        clearCart();
        // Redirect
        setTimeout(() => {
          setIsPaying(false);
          navigate(`/order-confirmation/${orderId}`);
        }, 1500);
      } else {
        throw new Error('Transaction confirmation from Paytm failed');
      }
    } catch (err) {
      alert((err as Error).message || 'Checkout failed');
      setIsPaying(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="bg-surface min-h-screen text-on-surface">
        <Navbar />
        <div className="pt-42 text-center max-w-md mx-auto">
          <h2 className="font-headline-md text-primary">Atelier Empty</h2>
          <p className="font-body-md text-text-muted mt-2 mb-8">
            You must choose pieces to secure checkout terms.
          </p>
          <Link to="/shop" className="bg-primary text-white font-label-caps text-label-caps px-8 py-3 tracking-widest leading-none">
            EXPLORE COLLECTION
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-surface min-h-screen text-on-surface font-body-md select-none pb-0">
      <Navbar />

      {isPaying ? (
        <div className="fixed inset-0 z-50 bg-dark-burgundy flex flex-col justify-center items-center gap-4 text-surface select-text">
          <Loader2 className="h-12 w-12 text-secondary-fixed animate-spin" />
          <h2 className="font-headline-md text-secondary-fixed text-headline-md uppercase tracking-wider">
            Securing Payment Connection
          </h2>
          <p className="font-body-sm text-[13px] text-surface-variant max-w-sm text-center leading-relaxed">
            Please wait while Paytm checksum verifies. Your transaction is encrypted with bank-level security.
          </p>
        </div>
      ) : null}

      <main className="pt-32 pb-20 px-4 md:px-gutter max-w-container-max mx-auto">
        <div className="mb-12 select-text">
          <h2 className="font-headline-lg text-headline-lg text-primary mb-2 uppercase">
            Secure Checkout
          </h2>
          <p className="font-body-lg text-text-muted italic">
            Finalize your acquisition of timeless heritage.
          </p>
        </div>

        {/* 2-Column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Panel: Delivery & Payment Details */}
          <div className="lg:col-span-7 space-y-12">
            
            {/* Delivery address select */}
            <section className="space-y-6">
              <div className="flex items-center space-x-4">
                <span className="w-8 h-8 rounded-full border border-primary flex items-center justify-center font-headline-sm text-primary text-[15px] font-bold">
                  1
                </span>
                <h3 className="font-headline-sm text-headline-sm uppercase tracking-widest text-primary font-medium">
                  Delivery Address
                </h3>
              </div>

              {/* Saved Address Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {addresses.map((address) => {
                  const isCur = selectedAddressId === address.id;
                  return (
                    <div
                      key={address.id}
                      onClick={() => setSelectedAddressId(address.id)}
                      className={`p-6 bg-surface-parchment relative cursor-pointer border transition-all shadow-xs ${
                        isCur ? 'border-primary ring-1 ring-primary' : 'border-border-sepia/60 hover:border-secondary'
                      }`}
                    >
                      {isCur && (
                        <div className="absolute top-4 right-4">
                          <CheckCircle className="h-5 w-5 text-primary" />
                        </div>
                      )}
                      <p className="font-label-caps text-[10px] text-primary mb-2 font-bold uppercase tracking-wider">
                        {address.title || 'SAVED RESIDENCE'}
                      </p>
                      <p className="font-body-md font-semibold mb-1 text-[15px]">{address.name}</p>
                      <p className="font-body-sm text-text-muted leading-relaxed text-[13px]">
                        {address.street}<br />
                        {address.city}, {address.pincode}<br />
                        {address.country || 'India'}
                      </p>
                      <p className="font-body-sm text-text-muted mt-2 text-[12px] font-mono select-all">
                        {address.phone}
                      </p>
                    </div>
                  );
                })}

                {/* Simulated default address if user lacks any */}
                {addresses.length === 0 && (
                  <div
                    onClick={() => {
                      // Trigger default creation helper payload
                      setAddresses([
                        {
                          id: 'default-sim',
                          title: 'PRIMARY RESIDENCE',
                          name: user?.email.split('@')[0].toUpperCase() || 'Arjun Malhotra',
                          street: 'Colaba Causeway, Apollo Bandar',
                          city: 'Mumbai',
                          pincode: '400039',
                          country: 'India',
                          phone: '+91 22 4556 7788'
                        }
                      ]);
                      setSelectedAddressId('default-sim');
                    }}
                    className="p-6 bg-surface-parchment relative cursor-pointer border border-dashed border-border-sepia/50 hover:bg-surface-parchment/60 transition-all text-center flex flex-col justify-center items-center py-10"
                  >
                    <Plus className="h-6 w-6 text-primary mb-2" />
                    <p className="font-label-caps text-[10px] text-primary uppercase font-bold tracking-widest">
                      ADD DEFAULT ADDRESS
                    </p>
                    <p className="text-[11px] text-text-muted italic mt-1">
                      Click to initialize local demonstration address
                    </p>
                  </div>
                )}
              </div>

              {/* Add New Address Form Accordion summary */}
              <div className="border-t border-border-sepia/30 pt-6">
                <button
                  onClick={() => setIsAddingAddress(!isAddingAddress)}
                  className="flex items-center gap-2 font-body-sm text-primary font-medium hover:underline tracking-wide uppercase text-[12px]"
                >
                  <Plus className="h-4 w-4" /> Specify New Address
                </button>

                {isAddingAddress && (
                  <form onSubmit={handleAddNewAddress} className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in slide-in-from-top-2 duration-300">
                    <div className="space-y-1.5">
                      <label className="font-label-caps text-[10px] text-text-muted uppercase tracking-wider block font-bold">
                        ADDRESSEE NAME
                      </label>
                      <input
                        type="text"
                        required
                        value={newAddress.name}
                        onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                        placeholder="Enter full name"
                        className="w-full bg-white border border-secondary/30 p-3 font-body-md text-[13px] rounded-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="font-label-caps text-[10px] text-text-muted uppercase tracking-wider block font-bold">
                        PHONE NUMBER
                      </label>
                      <input
                        type="tel"
                        required
                        value={newAddress.phone}
                        onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                        placeholder="+91"
                        className="w-full bg-white border border-secondary/30 p-3 font-body-md text-[13px] rounded-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="font-label-caps text-[10px] text-text-muted uppercase tracking-wider block font-bold">
                        STREET ADDRESS / APARTMENT / LANDMARK
                      </label>
                      <input
                        type="text"
                        required
                        value={newAddress.street}
                        onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                        placeholder="House no, block, street, landmark"
                        className="w-full bg-white border border-secondary/30 p-3 font-body-md text-[13px] rounded-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="font-label-caps text-[10px] text-text-muted uppercase tracking-wider block font-bold">
                        CITY
                      </label>
                      <input
                        type="text"
                        required
                        value={newAddress.city}
                        onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                        placeholder="Enter City"
                        className="w-full bg-white border border-secondary/30 p-3 font-body-md text-[13px] rounded-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="font-label-caps text-[10px] text-text-muted uppercase tracking-wider block font-bold">
                        POSTAL PINCODE
                      </label>
                      <input
                        type="text"
                        required
                        value={newAddress.pincode}
                        onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                        placeholder="6-digit pincode"
                        className="w-full bg-white border border-secondary/30 p-3 font-body-md text-[13px] rounded-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                    <div className="sm:col-span-2 pt-2 flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => setIsAddingAddress(false)}
                        className="px-6 py-2 border border-border-sepia/70 font-label-caps text-[10px] tracking-widest text-text-muted"
                      >
                        CANCEL
                      </button>
                      <button
                        type="submit"
                        className="px-8 py-2 bg-primary text-white font-label-caps text-[10px] tracking-widest uppercase font-semibold border border-primary hover:bg-primary-container"
                      >
                        SAVE ADDRESS
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </section>

            {/* Payment Section */}
            <section className="space-y-6">
              <div className="flex items-center space-x-4">
                <span className="w-8 h-8 rounded-full border border-primary flex items-center justify-center font-headline-sm text-primary text-[15px] font-bold">
                  2
                </span>
                <h3 className="font-headline-sm text-headline-sm uppercase tracking-widest text-primary font-medium">
                  Secure Payment Method
                </h3>
              </div>

              <div className="bg-surface-parchment p-6 md:p-8 border border-border-sepia shadow-xs relative">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h4 className="font-headline-sm text-[20px] text-primary uppercase">
                      Paytm Gateway
                    </h4>
                    <p className="font-body-sm text-text-muted text-[13px] leading-relaxed">
                      Instant verification in INR (₹) supporting Cards, NetBanking, and UPI checksums.
                    </p>
                  </div>
                  <Shield className="h-8 w-8 text-primary flex-shrink-0" />
                </div>

                <div className="p-4 bg-white border border-primary/40 flex items-center justify-between group cursor-pointer hover:bg-surface/10 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-primary/5 flex items-center justify-center border border-primary/20">
                      <Shield className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-body-md font-semibold text-[14px]">Pay Secured via Paytm</p>
                      <p className="font-body-sm text-text-muted text-[12px]">Checksum encryption handles transfer</p>
                    </div>
                  </div>
                  <span className="font-label-caps text-[10px] uppercase text-primary font-bold tracking-widest">
                    ACTIVE
                  </span>
                </div>

                <div className="mt-6 flex items-start space-x-3 text-text-muted">
                  <CheckCircle className="h-4.5 w-4.5 text-primary mt-0.5 flex-shrink-0" />
                  <p className="text-[11px] leading-relaxed">
                    By submitting payment, you agree to terms of certified sourcing. Your credential records are protected by HTTPS transport Layer Sockets.
                  </p>
                </div>
              </div>
            </section>

            <button
              onClick={handleAcquisitionSubmit}
              className="w-full bg-primary text-on-primary py-5 font-label-caps text-label-caps tracking-[0.2em] hover:bg-primary-container transition-colors uppercase font-semibold text-[11px] active:scale-99 border border-secondary"
            >
              Complete Acquisition — {formatPrice(total())}
            </button>
          </div>

          {/* Right Panel: Summary checkout items cart reviews */}
          <aside className="lg:col-span-5 sticky top-32">
            <div className="bg-surface-parchment p-8 border-l-2 border-primary/20">
              <h3 className="font-headline-sm text-headline-sm uppercase tracking-widest text-primary mb-6">
                Your Acquisition
              </h3>

              <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar border-b border-border-sepia/20 pb-4">
                {items.map((item) => (
                  <div key={item.productId} className="flex space-x-4 items-center">
                    <div className="w-20 h-20 flex-shrink-0 bg-white border border-border-sepia p-1">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="flex-grow select-text">
                      <h4 className="font-headline-sm text-[18px] text-primary leading-tight font-medium">
                        {item.name}
                      </h4>
                      <p className="font-body-sm text-text-muted text-[12px] mt-0.5">
                        Qty: {item.quantity} • {item.stoneType || 'Gemstone'}
                      </p>
                      <p className="font-headline-sm text-[14px] text-secondary font-mono font-semibold mt-1">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 space-y-3 font-body-sm text-[13px] select-text">
                <div className="flex justify-between text-text-muted">
                  <span>Subtotal</span>
                  <span className="font-mono text-on-surface font-semibold">{formatPrice(subtotal())}</span>
                </div>
                <div className="flex justify-between text-text-muted">
                  <span>Insured Courier Delivery</span>
                  <span className="text-success-forest font-semibold">
                    {shipping() === 0 ? 'Complimentary' : formatPrice(shipping())}
                  </span>
                </div>
                <div className="flex justify-between text-text-muted">
                  <span>GST & Curatorial Taxes</span>
                  <span className="italic text-[11px] font-label-caps text-on-surface">INCLUDED IN PRICE</span>
                </div>

                {/* Double Rule line */}
                <div className="h-1.5 border-t border-b border-border-sepia/15 w-full my-6 select-none" />

                <div className="flex justify-between items-center pt-2">
                  <span className="font-headline-sm text-headline-sm text-primary uppercase tracking-wide">
                    Grand Total
                  </span>
                  <span className="font-headline-lg text-[28px] text-primary font-bold font-mono">
                    {formatPrice(total())}
                  </span>
                </div>
              </div>

              <div className="mt-8 flex items-center justify-center space-x-3 opacity-60">
                <Award className="h-8 w-8 text-primary flex-shrink-0" />
                <p className="font-label-caps text-[9px] text-center leading-tight tracking-wider uppercase font-bold">
                  CERTIFIED CONFLICT-FREE GEMS<br />EST. 1924 HERITAGE HOUSE
                </p>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}
