import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, MapPin, Shield, Star, ArrowRight } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) { setSubscribed(true); setEmail(''); }
  };

  return (
    <footer className="bg-dark-burgundy text-white mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

        {/* Brand */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="font-display text-[20px] tracking-[0.12em] text-white uppercase">
            Royal Gems
          </h3>
          <p className="font-body text-[13px] text-white/60 leading-relaxed">
            Custodians of ancestral brilliance, specialising in rare heritage stones and bespoke royal adornments.
          </p>
          <div className="space-y-2 pt-2">
            <a
              href="mailto:royalgemskolkata@gmail.com"
              className="flex items-center gap-2 font-body text-[13px] text-white/70 hover:text-white transition-colors break-all"
            >
              <Mail className="h-3.5 w-3.5 flex-shrink-0 text-secondary" />
              royalgemskolkata@gmail.com
            </a>
            <div className="flex items-start gap-2 font-body text-[13px] text-white/70">
              <MapPin className="h-3.5 w-3.5 flex-shrink-0 text-secondary mt-0.5" />
              <span>13/H/29, Mayur Bhanj Road,<br />Kolkata — 700023</span>
            </div>
          </div>
        </div>

        {/* Collections */}
        <div className="space-y-4">
          <h5 className="font-label-caps text-[10px] tracking-widest text-secondary uppercase font-bold">
            Collections
          </h5>
          <ul className="space-y-3">
            {[
              { label: 'Loose Stones', to: '/shop?category=Loose+Gemstones' },
              { label: 'Artisan Necklaces', to: '/shop?category=Artisan+Necklaces' },
              { label: 'Imperial Earrings', to: '/shop?category=Imperial+Earrings' },
              { label: 'Bespoke Designing', to: '/contact' },
            ].map(({ label, to }) => (
              <li key={label}>
                <Link to={to} className="font-body text-[13px] text-white/60 hover:text-white transition-colors flex items-center gap-1.5 group">
                  <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity text-secondary" />
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Information */}
        <div className="space-y-4">
          <h5 className="font-label-caps text-[10px] tracking-widest text-secondary uppercase font-bold">
            Information
          </h5>
          <ul className="space-y-3">
            {[
              { label: 'Our Legacy', to: '/about' },
              { label: 'Contact Us', to: '/contact' },
              { label: 'Shipping & Returns', to: '/shipping-policyt' },
              { label: 'Privacy Policy', to: '/privacy-policyt' },
          { label: 'Refund Policy', to: '/refund-policy' },
          { label: 'Terms & Conditions', to: '/terms-and-conditions' },
            ].map(({ label, to }) => (
              <li key={label}>
                <Link to={to} className="font-body text-[13px] text-white/60 hover:text-white transition-colors flex items-center gap-1.5 group">
                  <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity text-secondary" />
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Newsletter */}
        <div className="space-y-4">
          <h5 className="font-label-caps text-[10px] tracking-widest text-secondary uppercase font-bold">
            Inner Circle
          </h5>
          <p className="font-body text-[13px] text-white/60 leading-relaxed">
            Priority access to rare geological acquisitions and private viewings.
          </p>
          {subscribed ? (
            <p className="font-label-caps text-[11px] text-secondary tracking-wider">
              ✓ Subscribed to the Inner Circle
            </p>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
              <input
                type="email" required value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
                className="bg-white/10 border border-secondary/30 p-3 text-white placeholder:text-white/40 focus:outline-none focus:border-secondary transition-all font-body text-[13px]"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-secondary/20 border border-secondary text-secondary font-label-caps text-[10px] tracking-widest uppercase hover:bg-secondary hover:text-dark-burgundy transition-all"
              >
                Subscribe
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="font-body text-[12px] text-white/40">
            © {new Date().getFullYear()} Royal Gems, Kolkata. All Rights Reserved.
          </p>
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-1.5 text-white/40">
              <Shield className="h-3 w-3" />
              <span className="font-label-caps text-[9px] tracking-wider uppercase">SSL Secured</span>
            </div>
            <div className="flex items-center gap-1.5 text-white/40">
              <Star className="h-3 w-3" />
              <span className="font-label-caps text-[9px] tracking-wider uppercase">GIA Certified</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
