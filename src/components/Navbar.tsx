import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, ShoppingBag, Search, User, X, LayoutDashboard } from 'lucide-react';
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
      <header className="fixed top-0 w-full z-50 bg-surface/90 backdrop-blur-md border-b border-outline-variant/30 shadow-sm transition-all duration-300">
        <div className="flex items-center px-gutter py-stack-md max-w-container-max mx-auto h-20 relative">

          {/* LEFT: Hamburger — mobile only */}
          <button
            onClick={toggleDrawer}
            className="md:hidden text-primary hover:text-primary-container p-2 active:scale-95 transition-all flex-shrink-0"
            aria-label="Toggle Navigation Menu"
          >
            <Menu className="h-7 w-7" />
          </button>

          {/* BRAND: centered on mobile, left on desktop */}
          <Link
            to="/"
            className="font-headline-lg text-headline-lg tracking-widest text-primary uppercase select-none transition-transform
                       absolute left-1/2 -translate-x-1/2
                       md:static md:left-auto md:translate-x-0 md:mr-auto"
          >
            Royal Gems
          </Link>

          {/* CENTER: Desktop nav links */}
          <nav className="hidden md:flex gap-8 items-center absolute left-1/2 -translate-x-1/2">
            <Link
              to="/shop"
              className="font-label-caps text-label-caps text-primary border-primary hover:border-b-2 py-1 transition-all"
            >
              Collection
            </Link>
            <Link
              to="/contact"
              className="font-label-caps text-label-caps text-on-surface-variant hover:text-primary-container transition-colors"
            >
              Bespoke
            </Link>
            <Link
              to="/about"
              className="font-label-caps text-label-caps text-on-surface-variant hover:text-primary-container transition-colors"
            >
              Legacy
            </Link>
          </nav>

          {/* RIGHT: Icon actions */}
          <div className="flex items-center gap-4 ml-auto flex-shrink-0">
            <div className="w-px h-6 bg-outline-variant/30 hidden md:block" />

            {/* Admin Dashboard pill — desktop, admin only */}
            {isAdmin && (
              <Link
                to="/admin"
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 border border-primary/30 hover:bg-primary/20 transition-all"
                title="Admin Dashboard"
              >
                <LayoutDashboard className="h-3.5 w-3.5 text-primary" />
                <span className="font-label-caps text-[9px] tracking-widest uppercase text-primary">
                  Dashboard
                </span>
              </Link>
            )}

            {/* Search */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="text-primary hover:scale-95 p-1 transition-transform"
              title="Search Shop"
            >
              <Search className="h-6 w-6" />
            </button>

            {/* Account / Admin icon */}
            <Link
              to={isAdmin ? '/admin' : isAuthenticated ? '/account' : '/login'}
              className={`text-primary hover:scale-95 p-1 transition-transform ${isAuthenticated ? 'text-secondary-fixed-variant' : ''}`}
              title={isAdmin ? 'Admin Dashboard' : isAuthenticated ? 'My Account' : 'Sign In'}
            >
              <User className="h-6 w-6" />
            </Link>

            {/* Cart — hidden for admin */}
            {!isAdmin && (
              <Link
                to="/cart"
                className="text-primary hover:scale-95 p-1 transition-transform relative"
                title="Shopping Bag"
              >
                <ShoppingBag className="h-6 w-6" />
                {totalCartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-white text-[9px] rounded-full w-4 h-4 flex items-center justify-center font-bold font-mono">
                    {totalCartCount}
                  </span>
                )}
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Drawer Backdrop */}
      {isDrawerOpen && (
        <div
          onClick={toggleDrawer}
          className="fixed inset-0 z-[55] bg-dark-burgundy/40 backdrop-blur-xs transition-opacity"
        />
      )}

      {/* Side Drawer — slides from RIGHT */}
      <div
        className={`h-screen w-80 fixed right-0 top-0 z-[60] bg-dark-burgundy shadow-2xl p-stack-lg flex flex-col transition-transform duration-500 ease-in-out ${isDrawerOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        <div className="flex justify-between items-center mb-10">
          <Link
            to="/"
            onClick={toggleDrawer}
            className="font-headline-md text-headline-md text-secondary-fixed tracking-tighter uppercase"
          >
            Royal Gems
          </Link>
          <button onClick={toggleDrawer} className="text-secondary-fixed hover:text-white transition-colors p-1">
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="flex flex-col divide-y divide-border-sepia/20">
          <Link to="/shop" onClick={toggleDrawer}
            className="py-5 font-label-caps text-label-caps text-on-tertiary-container hover:text-secondary-fixed hover:pl-2 transition-all flex justify-between items-center group">
            Heritage Collection
            <span className="text-[10px] text-secondary-fixed opacity-0 group-hover:opacity-100 transition-opacity">DIAMOND</span>
          </Link>
          <Link to="/shop?category=Loose+Gemstones" onClick={toggleDrawer}
            className="py-5 font-label-caps text-label-caps text-on-tertiary-container hover:text-secondary-fixed hover:pl-2 transition-all flex justify-between items-center group">
            Loose Stones
            <span className="text-[10px] text-secondary-fixed opacity-0 group-hover:opacity-100 transition-opacity">GEM</span>
          </Link>
          <Link to="/contact" onClick={toggleDrawer}
            className="py-5 font-label-caps text-label-caps text-on-tertiary-container hover:text-secondary-fixed hover:pl-2 transition-all flex justify-between items-center group">
            Bespoke Service
            <span className="text-[10px] text-secondary-fixed opacity-0 group-hover:opacity-100 transition-opacity">DESIGN</span>
          </Link>
          <Link to="/about" onClick={toggleDrawer}
            className="py-5 font-label-caps text-label-caps text-on-tertiary-container hover:text-secondary-fixed hover:pl-2 transition-all flex justify-between items-center group">
            Our Legacy
            <span className="text-[10px] text-secondary-fixed opacity-0 group-hover:opacity-100 transition-opacity">HISTORY</span>
          </Link>

          {/* Admin link in drawer — always shown to admin */}
          {isAdmin && (
            <Link to="/admin" onClick={toggleDrawer}
              className="py-5 font-label-caps text-label-caps text-secondary-fixed hover:text-white hover:pl-2 transition-all flex justify-between items-center group">
              Admin Dashboard
              <span className="text-[10px] text-secondary-fixed opacity-0 group-hover:opacity-100 transition-opacity">TERMINAL</span>
            </Link>
          )}
        </nav>

        <div className="mt-auto space-y-4 pt-4 border-t border-border-sepia/20">
          {isAdmin ? (
            <Link
              to="/admin"
              onClick={toggleDrawer}
              className="w-full block text-center bg-primary text-on-primary py-3.5 font-label-caps text-label-caps tracking-widest border border-secondary hover:bg-primary-container transition-colors"
            >
              Go to Dashboard
            </Link>
          ) : (
            <Link
              to="/contact"
              onClick={toggleDrawer}
              className="w-full block text-center bg-primary text-on-primary py-3.5 font-label-caps text-label-caps tracking-widest border border-secondary hover:bg-primary-container transition-colors"
            >
              Book a Consultation
            </Link>
          )}
        </div>
      </div>

      {/* Live Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}