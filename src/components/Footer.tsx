import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Globe, Shield, Star, ArrowRight } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-dark-burgundy text-white relative border-t-2 border-double border-secondary/40 mt-20">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter px-6 md:px-12 py-16 max-w-container-max mx-auto">
        <div className="space-y-6">
          <h2 className="font-headline-sm text-headline-sm text-secondary uppercase tracking-widest">
            Royal Gems Heritage
          </h2>
          <p className="font-body-sm text-body-sm text-white/80 leading-relaxed">
            Custodians of ancestral brilliance, specializing in rare heritage stones and bespoke royal adornments since 1924.
          </p>
          <div className="flex gap-4">
            <a href="#" className="text-secondary hover:text-white transition-colors">
              <Star className="h-5 w-5" />
            </a>
            <a href="#" className="text-secondary hover:text-white transition-colors">
              <Globe className="h-5 w-5" />
            </a>
            <a href="#" className="text-secondary hover:text-white transition-colors">
              <Mail className="h-5 w-5" />
            </a>
          </div>
        </div>

        <div>
          <h5 className="font-label-caps text-label-caps text-secondary mb-6 uppercase tracking-wider">
            Collections
          </h5>
          <ul className="space-y-4 font-body-sm text-body-sm text-white/70">
            <li>
              <Link to="/shop?category=Loose+Gemstones" className="hover:text-secondary transition-colors">
                Loose Stones
              </Link>
            </li>
            <li>
              <Link to="/shop?category=Artisan+Necklaces" className="hover:text-secondary transition-colors">
                Emerald Gardens
              </Link>
            </li>
            <li>
              <Link to="/shop" className="hover:text-secondary transition-colors">
                Kashmir Collection
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-secondary transition-colors">
                Bespoke Designing
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h5 className="font-label-caps text-label-caps text-secondary mb-6 uppercase tracking-wider">
            Information
          </h5>
          <ul className="space-y-4 font-body-sm text-body-sm text-white/70">
            <li>
              <Link to="/about" className="hover:text-secondary transition-colors">
                Our Legacy
              </Link>
            </li>
            <li>
              <Link to="/shipping-policy" className="hover:text-secondary transition-colors">
                Shipping & Returns
              </Link>
            </li>
            <li>
              <Link to="/privacy-policy" className="hover:text-secondary transition-colors">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/refund-policy" className="hover:text-secondary transition-colors">
                Refund Policy
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h5 className="font-label-caps text-label-caps text-secondary mb-6 uppercase tracking-wider">
            Newsletter
          </h5>
          <p className="font-body-sm text-body-sm text-white/80 mb-4">
            Join our inner circle for priority access to rare geological acquisitions.
          </p>
          {subscribed ? (
            <p className="text-secondary font-label-caps text-[11px] uppercase tracking-widest animate-pulse">
              ✓ Subscribed to the Inner Circle
            </p>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
                className="bg-white/10 border border-secondary/30 p-3 text-white placeholder:text-white/40 focus:outline-none focus:border-secondary transition-all font-body-sm"
              />
              <button
                type="submit"
                className="bg-secondary text-white p-3 font-label-caps text-label-caps hover:bg-secondary/90 transition-all flex items-center justify-center gap-2"
              >
                Subscribe <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          )}
        </div>
      </div>

      <div className="border-t border-secondary/10 py-8 text-center bg-dark-burgundy/80">
        <p className="font-body-sm text-body-sm text-white/60">
          © {new Date().getFullYear()} Royal Gems Heritage. All Rights Reserved. Co-curated in high fidelity.
        </p>
      </div>
    </footer>
  );
}
