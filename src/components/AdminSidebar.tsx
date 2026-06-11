import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Diamond, ShoppingBag, ArrowLeft, LogOut, Settings, Award } from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';

export default function AdminSidebar() {
  const { logout } = useAuth();
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
    <aside className="w-72 bg-dark-burgundy h-screen fixed left-0 top-0 flex flex-col z-40 border-r border-border-sepia/20 shadow-2xl">
      {/* Top logo */}
      <div className="p-8 border-b border-border-sepia/20">
        <h1 className="font-headline-sm text-headline-sm text-secondary-fixed tracking-tighter uppercase select-none">
          Royal Gems
        </h1>
        <p className="font-label-caps text-[10px] text-on-tertiary-container/60 mt-1 uppercase tracking-widest">
          CURATOR TERMINAL
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-grow py-6 overflow-y-auto space-y-1">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className={`flex items-center px-8 py-3.5 transition-all duration-300 font-body-md ${
                    isActive
                      ? 'text-secondary-fixed bg-primary-container/20 border-r-3 border-secondary-fixed'
                      : 'text-surface-variant hover:text-secondary-fixed hover:pl-10'
                  }`}
                >
                  <Icon className="h-5 w-5 mr-4 text-secondary-fixed-dim" />
                  <span>{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="px-8 my-6">
          <div className="h-px bg-border-sepia/20 w-full" />
        </div>

        <ul className="space-y-1">
          <li>
            <Link
              to="/"
              className="flex items-center px-8 py-3.5 text-surface-variant hover:text-secondary-fixed hover:pl-10 transition-all duration-300"
            >
              <ArrowLeft className="h-5 w-5 mr-4 text-on-tertiary-container/60" />
              <span>Back To Atelier</span>
            </Link>
          </li>
          <li>
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-8 py-3.5 text-error-maroon hover:text-red-400 hover:pl-10 transition-all duration-300 text-left"
            >
              <LogOut className="h-5 w-5 mr-4" />
              <span>Exit Terminal</span>
            </button>
          </li>
        </ul>
      </nav>

      {/* Sidebar Footer */}
      <div className="p-8 border-t border-border-sepia/20">
        <div className="flex items-center gap-3 bg-white/5 p-3 border border-border-sepia/20">
          <Award className="h-6 w-6 text-secondary-fixed" />
          <div>
            <p className="font-label-caps text-[10px] text-secondary-fixed uppercase tracking-wider">
              AUTHORIZED UNIT
            </p>
            <p className="font-body-sm text-[12px] text-surface-variant opacity-80">
              Head Curator
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
