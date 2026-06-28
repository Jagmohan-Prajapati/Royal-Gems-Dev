import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Diamond, ShoppingBag, ArrowLeft, LogOut, Award } from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';

export default function AdminSidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const menuItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Products', path: '/admin/products', icon: Diamond },
    { name: 'Orders', path: '/admin/orders', icon: ShoppingBag },
  ];

  return (
    <aside className="w-64 min-h-screen bg-dark-burgundy flex flex-col flex-shrink-0">

      {/* Logo */}
      <div className="px-6 py-7 border-b border-white/10">
        <h1 className="font-display text-[18px] tracking-[0.12em] text-white uppercase">
          Royal Gems
        </h1>
        <p className="font-label-caps text-[9px] tracking-widest text-white/50 uppercase mt-1">
          Curator Terminal
        </p>
      </div>

      {/* Nav */}
      <nav className="flex-1 flex flex-col gap-1 px-3 py-5">
        {menuItems.map(({ name, path, icon: Icon }) => {
          const isActive = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className={`flex items-center gap-3 px-4 py-3 font-label-caps text-[11px] tracking-widest uppercase transition-all rounded-sm
                ${isActive
                  ? 'bg-white/15 text-white border-l-2 border-secondary'
                  : 'text-white/70 hover:text-white hover:bg-white/10 border-l-2 border-transparent'
                }`}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              {name}
            </Link>
          );
        })}

        <div className="h-px bg-white/10 my-3 mx-1" />

        <Link
          to="/"
          className="flex items-center gap-3 px-4 py-3 font-label-caps text-[11px] tracking-widest uppercase text-white/70 hover:text-white hover:bg-white/10 transition-all rounded-sm"
        >
          <ArrowLeft className="h-4 w-4 flex-shrink-0" />
          Back to Atelier
        </Link>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 font-label-caps text-[11px] tracking-widest uppercase text-white/70 hover:text-white hover:bg-white/10 transition-all rounded-sm w-full text-left"
        >
          <LogOut className="h-4 w-4 flex-shrink-0" />
          Exit Terminal
        </button>
      </nav>

      {/* Footer */}
      <div className="px-6 py-5 border-t border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-secondary/30 border border-secondary/50 flex items-center justify-center">
            <Award className="h-4 w-4 text-secondary" />
          </div>
          <div>
            <p className="font-label-caps text-[9px] tracking-widest text-white/40 uppercase">Authorized Unit</p>
            <p className="font-body text-[12px] text-white truncate max-w-[120px]">
              {user?.email || 'Head Curator'}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}