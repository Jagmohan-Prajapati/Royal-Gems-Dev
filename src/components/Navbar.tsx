import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, ShoppingBag, Search, User, X } from 'lucide-react';
import { useCartStore } from '../store/cartStore.ts';
import { useAuth } from '../context/AuthContext.tsx';
import SearchModal from './SearchModal.tsx';

export default function Navbar() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { items } = useCartStore();
  const { user, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  const totalCartCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen);

  return (
    <>
      {/* ── Main Navbar Bar ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border-sepia/40 h-26">
        <div className="max-w-8xl mx-auto px-4 h-full flex items-center justify-between gap-4">

          {/* LEFT: Hamburger — mobile only */}
          <button
            onClick={toggleDrawer}
            className="md:hidden text-primary p-1 hover:scale-95 transition-transform flex-shrink-0"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* CENTER: Brand name — always centered on mobile, left-aligned on desktop */}
          <Link
            to="/"
            className="font-display text-[26px] tracking-[0.12em] text-primary uppercase
                       absolute left-1/2 -translate-x-1/2
                       md:static md:left-auto md:translate-x-0"
          >
            Royal Gems
          </Link>

          {/* CENTER: Desktop nav links */}
          <div className="hidden md:flex items-center gap-12 mx-auto">
            <Link to="/shop" className="font-label-caps text-[14px] tracking-widest uppercase text-on-surface-variant hover:text-primary transition-colors">
              Collection
            </Link>
            <Link to="/contact" className="font-label-caps text-[14px] tracking-widest uppercase text-on-surface-variant hover:text-primary transition-colors">
              Contact Us
            </Link>
            <Link to="/about" className="font-label-caps text-[14px] tracking-widest uppercase text-on-surface-variant hover:text-primary transition-colors">
              Legacy
            </Link>
          </div>

          {/* RIGHT: Icon actions */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {/* Search */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="text-primary hover:scale-95 p-1 transition-transform"
              title="Search Shop"
            >
              <Search className="h-5 w-5" />
            </button>

            {/* Account */}
            <Link
              to={isAuthenticated ? '/account' : '/login'}
              className="text-primary hover:scale-95 p-1 transition-transform"
              title={isAuthenticated ? 'My Account' : 'Sign In'}
            >
              <User className="h-5 w-5" />
            </Link>

            {/* Cart */}
            <Link to="/cart" className="relative text-primary hover:scale-95 p-1 transition-transform" title="Shopping Bag">
              <ShoppingBag className="h-5 w-5" />
              {totalCartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-on-primary text-[9px] font-bold w-4 h-4 flex items-center justify-center leading-none">
                  {totalCartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Drawer Backdrop ── */}
      {isDrawerOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={() => setIsDrawerOpen(false)}
        />
      )}

      {/* ── Side Drawer ── */}
      <aside
        className={`fixed top-0 left-0 h-full w-72 z-50 bg-background border-r border-border-sepia shadow-2xl transform transition-transform duration-300 ease-in-out
          ${isDrawerOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-border-sepia/40">
          <span className="font-display text-[18px] tracking-[0.12em] text-primary uppercase">Royal Gems</span>
          <button onClick={() => setIsDrawerOpen(false)} className="text-on-surface-variant hover:text-primary p-1">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex flex-col px-6 py-8 gap-6">
          <Link onClick={() => setIsDrawerOpen(false)} to="/shop" className="flex justify-between items-center font-display text-[16px] tracking-widest text-on-surface uppercase hover:text-primary transition-colors group">
            Heritage Collection
            <span className="font-label-caps text-[9px] text-secondary tracking-widest">DIAMOND</span>
          </Link>
          <Link onClick={() => setIsDrawerOpen(false)} to="/shop?category=Loose+Gemstones" className="flex justify-between items-center font-display text-[16px] tracking-widest text-on-surface uppercase hover:text-primary transition-colors">
            Loose Stones
            <span className="font-label-caps text-[9px] text-secondary tracking-widest">GEM</span>
          </Link>
          <Link onClick={() => setIsDrawerOpen(false)} to="/contact" className="flex justify-between items-center font-display text-[16px] tracking-widest text-on-surface uppercase hover:text-primary transition-colors">
            Bespoke Service
            <span className="font-label-caps text-[9px] text-secondary tracking-widest">DESIGN</span>
          </Link>
          <Link onClick={() => setIsDrawerOpen(false)} to="/about" className="flex justify-between items-center font-display text-[16px] tracking-widest text-on-surface uppercase hover:text-primary transition-colors">
            Our Legacy
            <span className="font-label-caps text-[9px] text-secondary tracking-widest">HISTORY</span>
          </Link>
          {isAdmin && (
            <Link onClick={() => setIsDrawerOpen(false)} to="/admin" className="flex justify-between items-center font-display text-[16px] tracking-widest text-primary uppercase hover:opacity-80 transition-colors">
              Admin Dashboard
              <span className="font-label-caps text-[9px] text-secondary tracking-widest">TERMINAL</span>
            </Link>
          )}
        </nav>

        <div className="absolute bottom-8 left-6 right-6">
          <Link
            to="/contact"
            onClick={() => setIsDrawerOpen(false)}
            className="block text-center px-6 py-3 border border-secondary text-secondary font-label-caps text-[11px] tracking-widest uppercase hover:bg-secondary hover:text-on-primary transition-all"
          >
            Book a Consultation
          </Link>
        </div>
      </aside>

      ── Spacer to offset fixed navbar ──
      {/* <div className="h-16" /> */}

      {/* ── Search Modal ── */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}