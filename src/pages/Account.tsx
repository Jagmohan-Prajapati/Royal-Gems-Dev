import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.tsx';
import Navbar from '../components/Navbar.tsx';
import Footer from '../components/Footer.tsx';
import { useCartStore } from '../store/cartStore.ts';
import { LogOut, User as UserIcon, ListOrdered, MapPin, Key, Star, Trash2, Edit2, Loader2, Check } from 'lucide-react';
import { formatPrice } from '../lib/utils.ts';

export default function Account() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Tab State
  const [activeTab, setActiveTab] = useState<'orders' | 'profile' | 'addresses' | 'security'>('orders');

  // Backend state data
  const [orders, setOrders] = useState<any[]>([]);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Forms state
  const [profileEmail, setLoginEmail] = useState(user?.email || '');
  const [profileSuccessMsg, setProfileSuccessMsg] = useState('');

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Address Dialog states
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [addressFormId, setAddressFormId] = useState('');
  const [addForm, setAddForm] = useState({
    title: 'PRIMARY RESIDENCE',
    name: '',
    phone: '',
    street: '',
    city: '',
    pincode: '',
    country: 'India'
  });

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders/my');
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAddresses = async () => {
    try {
      const res = await fetch('/api/user/addresses');
      if (res.ok) {
        const data = await res.json();
        setAddresses(data.addresses || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    Promise.all([fetchOrders(), fetchAddresses()]).finally(() => setIsLoading(false));
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSuccessMsg('');
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: profileEmail }),
      });
      if (res.ok) {
        setProfileSuccessMsg('Profile security email updated successfully.');
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to update email');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordSuccess('');
    setPasswordError('');
    try {
      const res = await fetch('/api/user/change-password', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oldPassword, newPassword }),
      });
      if (res.ok) {
        setPasswordSuccess('Password was successfully rotated.');
        setOldPassword('');
        setNewPassword('');
      } else {
        const data = await res.json();
        setPasswordError(data.error || 'Password transition rejected');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteAddress = async (id: string) => {
    if (!confirm('Are you sure you want to remove this saved delivery address?')) return;
    try {
      const res = await fetch(`/api/user/addresses/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setAddresses(addresses.filter(a => a.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditAddressClick = (addr: any) => {
    setAddressFormId(addr.id);
    setAddForm({
      title: addr.title,
      name: addr.name,
      phone: addr.phone,
      street: addr.street,
      city: addr.city,
      pincode: addr.pincode,
      country: addr.country || 'India'
    });
    setIsEditingAddress(true);
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = addressFormId ? `/api/user/addresses/${addressFormId}` : '/api/user/addresses';
      const method = addressFormId ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(addForm),
      });

      if (res.ok) {
        setIsEditingAddress(false);
        setAddressFormId('');
        setAddForm({
          title: 'SECONDARY RESIDENCE',
          name: '',
          phone: '',
          street: '',
          city: '',
          pincode: '',
          country: 'India'
        });
        await fetchAddresses();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-surface-bright text-on-surface font-body-md select-none pb-0">
      <Navbar />

      <main className="pt-32 pb-20 min-h-screen">
        <div className="max-w-container-max mx-auto px-4 md:px-gutter grid grid-cols-1 md:grid-cols-12 gap-8 items-start">

          {/* Left Sidebar */}
          <aside className="md:col-span-3 space-y-6">
            <div className="bg-surface-parchment p-8 border border-border-sepia shadow-sm select-text text-center">

              {/* Arjun Malhotra approved luxury photo */}
              <div className="w-20 h-20 mx-auto mb-4 border-2 border-secondary p-1 overflow-hidden select-none">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuA15OqdnQ27b3c38RFzXoqE6wUhUYJQ38BVu2_Q7dYkdBZTTNIOqEk0lt0jNoFGCl6JB3pKLH6TdYUhnoz65-piuNrI0loex9iRPQ9vai2eGcIAZvU_4O8ArPDhaUjsdJ0HRSFDkYBbFC0XboCZAhcFQUd92am3IlFK19pX5QdJvA_HFc0qK1slKj5zZX3wmdacwD-xBzZxsd-oHKUYxnWOWuzDj4Vf0Dx0Mi0uuXW-_PDXMtqGZ4pR7AWLEWZKe2VS44dtr3vH_kK3"
                  alt="Profile"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              <h2 className="font-headline-sm text-headline-sm text-primary uppercase font-semibold">
                {user?.email.split('@')[0].toUpperCase()}
              </h2>
              <p className="font-body-sm text-body-sm text-text-muted mt-1 uppercase tracking-wider font-semibold text-[10px]">
                {user?.role === 'ADMIN' ? 'Supreme Curator' : 'Platinum Member'}
              </p>

              {/* Navigation items list */}
              <nav className="space-y-1 mt-8 select-none">
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`w-full flex items-center gap-3 px-4 py-3 font-label-caps text-label-caps transition-all text-left border-l-2 font-bold text-[11px] uppercase ${activeTab === 'orders'
                      ? 'bg-primary-container/10 text-primary border-primary'
                      : 'text-text-muted hover:text-primary hover:bg-primary-container/5 border-transparent'
                    }`}
                >
                  <ListOrdered className="h-4.5 w-4.5 text-primary" />
                  <span>My Orders</span>
                </button>
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center gap-3 px-4 py-3 font-label-caps text-label-caps transition-all text-left border-l-2 font-bold text-[11px] uppercase ${activeTab === 'profile'
                      ? 'bg-primary-container/10 text-primary border-primary'
                      : 'text-text-muted hover:text-primary hover:bg-primary-container/5 border-transparent'
                    }`}
                >
                  <UserIcon className="h-4.5 w-4.5 text-primary" />
                  <span>Profile Details</span>
                </button>
                <button
                  onClick={() => setActiveTab('addresses')}
                  className={`w-full flex items-center gap-3 px-4 py-3 font-label-caps text-label-caps transition-all text-left border-l-2 font-bold text-[11px] uppercase ${activeTab === 'addresses'
                      ? 'bg-primary-container/10 text-primary border-primary'
                      : 'text-text-muted hover:text-primary hover:bg-primary-container/5 border-transparent'
                    }`}
                >
                  <MapPin className="h-4.5 w-4.5 text-primary" />
                  <span>Addresses</span>
                </button>
                <button
                  onClick={() => setActiveTab('security')}
                  className={`w-full flex items-center gap-3 px-4 py-3 font-label-caps text-label-caps transition-all text-left border-l-2 font-bold text-[11px] uppercase ${activeTab === 'security'
                      ? 'bg-primary-container/10 text-primary border-primary'
                      : 'text-text-muted hover:text-primary hover:bg-primary-container/5 border-transparent'
                    }`}
                >
                  <Key className="h-4.5 w-4.5 text-primary" />
                  <span>Security</span>
                </button>

                <div className="pt-6 mt-6 border-t border-border-sepia">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 font-label-caps text-label-caps text-error-maroon hover:opacity-75 font-bold text-[11px] uppercase"
                  >
                    <LogOut className="h-4.5 w-4.5" />
                    <span>LOGOUT</span>
                  </button>
                </div>
              </nav>
            </div>
          </aside>

          {/* Right Main Content area */}
          <div className="md:col-span-9 max-w-full overflow-hidden select-text">
            {isLoading ? (
              <div className="min-h-[300px] flex justify-center items-center">
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
              </div>
            ) : (
              <div>

                {/* 1. ORDERS VIEW */}
                {activeTab === 'orders' && (
                  <div className="space-y-6">
                    <div className="border-b border-border-sepia/25 pb-4">
                      <h1 className="font-headline-lg text-headline-lg text-primary uppercase">
                        My Orders
                      </h1>
                    </div>

                    {orders.length === 0 ? (
                      <p className="font-body-md text-text-muted italic py-10 bg-surface-parchment/10 text-center border">
                        No previous collections acquisitions found under this email session.
                      </p>
                    ) : (
                      <div className="overflow-x-auto bg-surface-parchment border border-border-sepia shadow-xs">
                        <table className="w-full border-collapse text-left text-[14px]">
                          <thead>
                            <tr className="bg-surface-parchment text-primary border-b border-border-sepia font-label-caps text-[11px] tracking-wider uppercase font-bold text-center">
                              <th className="px-6 py-4">ORDER ID</th>
                              <th className="px-6 py-4">DATE</th>
                              <th className="px-6 py-4">Status</th>
                              <th className="px-6 py-4">TOTAL</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border-sepia/25">
                            {orders.map((ord) => (
                              <tr key={ord.id} className="hover:bg-white/40 transition-colors text-center text-on-surface">
                                <td className="px-6 py-6 font-semibold text-primary font-mono">{ord.id}</td>
                                <td className="px-6 py-6 font-mono text-[13px]">{new Date(ord.createdAt).toLocaleDateString()}</td>
                                <td className="px-6 py-6">
                                  <span className={`inline-block px-3 py-1 font-label-caps text-[10px] tracking-widest border font-bold uppercase ${ord.isPaid
                                      ? 'bg-success-forest/10 text-success-forest border-success-forest/30'
                                      : 'bg-secondary-container/20 text-secondary border-secondary-container/30'
                                    }`}>
                                    {ord.isPaid ? 'PAID / PROCESSING' : 'PENDING'}
                                  </span>
                                </td>
                                <td className="px-6 py-6 font-semibold text-primary font-mono">{formatPrice(ord.amount)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}

                {/* 2. PROFILE VIEW */}
                {activeTab === 'profile' && (
                  <div className="space-y-6">
                    <div className="border-b border-border-sepia/25 pb-4">
                      <h1 className="font-headline-lg text-headline-lg text-primary uppercase">
                        Profile Details
                      </h1>
                    </div>

                    <form onSubmit={handleUpdateProfile} className="bg-surface-parchment border border-border-sepia p-8 md:p-10 shadow-xs">
                      {profileSuccessMsg && (
                        <p className="mb-4 text-success-forest font-label-caps text-[11px] uppercase tracking-widest">
                          ✓ {profileSuccessMsg}
                        </p>
                      )}
                      <div className="space-y-4 max-w-md">
                        <div className="space-y-1">
                          <label className="font-label-caps text-[11px] text-primary font-bold uppercase tracking-wider block">
                            EMAIL ADDRESS
                          </label>
                          <input
                            type="email"
                            required
                            value={profileEmail}
                            onChange={(e) => setLoginEmail(e.target.value)}
                            className="w-full bg-white border border-border-sepia px-4 py-3 font-body-md text-[13px] focus:ring-1 focus:ring-primary rounded-none"
                          />
                        </div>
                        <button
                          type="submit"
                          className="bg-primary hover:bg-primary-container text-white px-8 py-3.5 font-label-caps text-[11px] tracking-widest uppercase font-semibold border border-primary duration-300"
                        >
                          SAVE PROFILE
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* 3. ADDRESSES VIEW */}
                {activeTab === 'addresses' && (
                  <div className="space-y-6">
                    <div className="border-b border-border-sepia/25 pb-4 flex justify-between items-center flex-wrap gap-4">
                      <h1 className="font-headline-lg text-headline-lg text-primary uppercase">
                        Saved Addresses
                      </h1>
                      <button
                        onClick={() => {
                          setAddressFormId('');
                          setAddForm({
                            title: 'PRIMARY RESIDENCE',
                            name: '',
                            phone: '',
                            street: '',
                            city: '',
                            pincode: '',
                            country: 'India'
                          });
                          setIsEditingAddress(true);
                        }}
                        className="bg-primary text-white hover:bg-primary-container px-6 py-2.5 font-label-caps text-[10px] tracking-widest uppercase font-semibold"
                      >
                        ADD NEW ADDRESS
                      </button>
                    </div>

                    {isEditingAddress ? (
                      /* Create / Edit Form layout */
                      <form onSubmit={handleSaveAddress} className="bg-surface-parchment border border-border-sepia p-8 md:p-10 shadow-xs space-y-4">
                        <h3 className="font-headline-sm text-primary uppercase pb-2 border-b">
                          {addressFormId ? 'Edit saved address' : 'Add new address'}
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="font-label-caps text-[10px] text-text-muted uppercase tracking-wider block font-bold">LABEL TITLE</label>
                            <input
                              type="text"
                              required
                              value={addForm.title}
                              onChange={(e) => setAddForm({ ...addForm, title: e.target.value })}
                              placeholder="e.g. PRIMARY RESIDENCE"
                              className="w-full bg-white border border-border-sepia p-3 text-[13px] rounded-none focus:ring-1 focus:ring-primary"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="font-label-caps text-[10px] text-text-muted uppercase tracking-wider block font-bold">FULL NAME</label>
                            <input
                              type="text"
                              required
                              value={addForm.name}
                              onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                              className="w-full bg-white border border-border-sepia p-3 text-[13px] rounded-none focus:ring-1 focus:ring-primary"
                            />
                          </div>
                          <div className="space-y-1 sm:col-span-2">
                            <label className="font-label-caps text-[10px] text-text-muted uppercase tracking-wider block font-bold">STREET ADDRESS</label>
                            <input
                              type="text"
                              required
                              value={addForm.street}
                              onChange={(e) => setAddForm({ ...addForm, street: e.target.value })}
                              className="w-full bg-white border border-border-sepia p-3 text-[13px] rounded-none"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="font-label-caps text-[10px] text-text-muted uppercase tracking-wider block font-bold">CITY</label>
                            <input
                              type="text"
                              required
                              value={addForm.city}
                              onChange={(e) => setAddForm({ ...addForm, city: e.target.value })}
                              className="w-full bg-white border border-border-sepia p-3 text-[13px] rounded-none"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="font-label-caps text-[10px] text-text-muted uppercase tracking-wider block font-bold">POSTAL PINCODE</label>
                            <input
                              type="text"
                              required
                              value={addForm.pincode}
                              onChange={(e) => setAddForm({ ...addForm, pincode: e.target.value })}
                              className="w-full bg-white border border-border-sepia p-3 text-[13px] rounded-none"
                            />
                          </div>
                          <div className="space-y-1 sm:col-span-2">
                            <label className="font-label-caps text-[10px] text-text-muted uppercase tracking-wider block font-bold">PHONE NUMBER</label>
                            <input
                              type="tel"
                              required
                              value={addForm.phone}
                              onChange={(e) => setAddForm({ ...addForm, phone: e.target.value })}
                              className="w-full bg-white border border-border-sepia p-3 text-[13px] rounded-none"
                            />
                          </div>
                        </div>
                        <div className="pt-4 flex justify-end gap-3 select-none">
                          <button
                            type="button"
                            onClick={() => setIsEditingAddress(false)}
                            className="px-6 py-2 border border-border-sepia/70 font-label-caps text-[10px] tracking-widest text-text-muted"
                          >
                            CANCEL
                          </button>
                          <button
                            type="submit"
                            className="px-8 py-2 bg-primary text-white font-label-caps text-[10px] tracking-widest uppercase font-semibold border border-primary"
                          >
                            SAVE ADDRESS
                          </button>
                        </div>
                      </form>
                    ) : addresses.length === 0 ? (
                      <p className="font-body-md text-text-muted italic py-10 bg-surface-parchment/10 text-center border">
                        No saved delivery details found under this account session. Click add.
                      </p>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {addresses.map((address) => (
                          <div key={address.id} className="p-6 bg-surface-parchment border border-border-sepia relative shadow-xs group select-text">
                            <p className="font-label-caps text-[10px] text-primary mb-2 font-bold uppercase tracking-wider">{address.title || 'SECONDARY'}</p>
                            <p className="font-body-md font-semibold mb-1 text-[15px]">{address.name}</p>
                            <p className="font-body-sm text-text-muted leading-relaxed text-[13px]">
                              {address.street}<br />
                              {address.city}, {address.pincode}<br />
                              {address.country || 'India'}
                            </p>
                            <p className="font-body-sm text-text-muted mt-2 text-[12px] font-mono">{address.phone}</p>

                            {/* Editing buttons row */}
                            <div className="absolute top-4 right-4 flex gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity select-none">
                              <button
                                onClick={() => handleEditAddressClick(address)}
                                className="text-secondary hover:text-primary transition-all p-1"
                                title="Edit Address"
                              >
                                <Edit2 className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteAddress(address.id)}
                                className="text-outline hover:text-red-700 transition-all p-1"
                                title="Delete Address"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* 4. SECURITY (Password Update panel) */}
                {activeTab === 'security' && (
                  <div className="space-y-6">
                    <div className="border-b border-border-sepia/25 pb-4">
                      <h1 className="font-headline-lg text-headline-lg text-primary uppercase">
                        Security Settings
                      </h1>
                    </div>

                    <form onSubmit={handleChangePassword} className="bg-surface-parchment border border-border-sepia p-8 md:p-10 shadow-xs max-w-md">
                      {passwordSuccess && (
                        <p className="mb-4 text-success-forest font-label-caps text-[11px] uppercase tracking-widest">
                          ✓ {passwordSuccess}
                        </p>
                      )}
                      {passwordError && (
                        <p className="mb-4 text-error-maroon font-body-sm text-[13px]">
                          ⚠ {passwordError}
                        </p>
                      )}

                      <div className="space-y-4">
                        <div className="space-y-1">
                          <label className="font-label-caps text-[11px] text-primary font-bold uppercase tracking-wider block">
                            CURRENT PASSWORD
                          </label>
                          <input
                            type="password"
                            required
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            className="w-full bg-white border border-border-sepia px-4 py-3 font-body-md text-[13px] rounded-none focus:ring-1 focus:ring-primary"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="font-label-caps text-[11px] text-primary font-bold uppercase tracking-wider block">
                            NEW PASSWORD
                          </label>
                          <input
                            type="password"
                            required
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full bg-white border border-border-sepia px-4 py-3 font-body-md text-[13px] rounded-none focus:ring-1 focus:ring-primary"
                          />
                        </div>
                        <button
                          type="submit"
                          className="bg-primary hover:bg-primary-container text-white px-8 py-3.5 font-label-caps text-[11px] tracking-widest uppercase font-semibold border border-primary transition-all duration-300"
                        >
                          CHANGE PASSWORD
                        </button>
                      </div>
                    </form>
                  </div>
                )}

              </div>
            )}
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
