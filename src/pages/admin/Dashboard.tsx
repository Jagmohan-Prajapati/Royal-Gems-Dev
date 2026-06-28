import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/AdminSidebar.tsx';
import { Loader2, DollarSign, Gem, ShoppingCart, ShieldCheck } from 'lucide-react';
import { formatPrice } from '../../lib/utils.ts';

interface Stats {
  revenue: number;
  ordersCount: number;
  productsCount: number;
}

interface RecentOrder {
  id: string;
  createdAt: string;
  amount: number;
  isPaid: boolean;
  status: string;
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({ revenue: 0, ordersCount: 0, productsCount: 0 });
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAdminStats = async () => {
      setIsLoading(true);
      setError('');
      try {
        const [prodRes, ordRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/orders'),
        ]);

        let productsCount = 0;
        if (prodRes.ok) {
          const pData = await prodRes.json();
          productsCount = pData.products?.length ?? 0;
        }

        let ordersCount = 0;
        let revenue = 0;
        let orders: RecentOrder[] = [];

        if (ordRes.ok) {
          const oData = await ordRes.json();
          orders = oData.orders ?? [];
          ordersCount = orders.length;
          revenue = orders
            .filter((o) => o.isPaid)
            .reduce((sum, o) => sum + o.amount, 0);
        }

        setStats({ revenue, ordersCount, productsCount });
        setRecentOrders(orders.slice(0, 5));
      } catch (err) {
        console.error('Dashboard fetch error:', err);
        setError('Unable to load dashboard data. Check your connection.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdminStats();
  }, []);

  const kpiCards = [
    { label: 'Total Revenue (Paid)', value: formatPrice(stats.revenue), icon: DollarSign, sub: 'From confirmed orders' },
    { label: 'Total Orders', value: String(stats.ordersCount), icon: ShoppingCart, sub: 'All time' },
    { label: 'Active Listings', value: String(stats.productsCount), icon: Gem, sub: 'Vault specimens' },
  ];

  const statusColor: Record<string, string> = {
    PENDING: 'text-amber-600 bg-amber-50 border-amber-200',
    PROCESSING: 'text-blue-700 bg-blue-50 border-blue-200',
    SHIPPED: 'text-indigo-700 bg-indigo-50 border-indigo-200',
    DELIVERED: 'text-green-700 bg-green-50 border-green-200',
    CANCELLED: 'text-red-700 bg-red-50 border-red-200',
  };

  return (
    <div className="min-h-screen flex bg-background">
      <AdminSidebar />

      <main className="flex-1 overflow-auto px-8 py-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-10">
          <div>
            <h1 className="font-display text-3xl text-on-surface uppercase tracking-widest mb-1">
              Atelier Overview
            </h1>
            <p className="font-body text-[13px] text-on-surface-variant">
              Live metrics drawn from the database. Refresh to update.
            </p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-success-forest/10 border border-success-forest/30">
            <ShieldCheck className="h-4 w-4 text-success-forest" />
            <span className="font-label-caps text-[9px] tracking-widest text-success-forest uppercase">
              Secure Session Active
            </span>
          </div>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-error/10 border border-error/30 font-body text-[13px] text-error">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center h-64 gap-3 text-on-surface-variant">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="font-label-caps text-[11px] tracking-widest uppercase">Loading Vault Data…</span>
          </div>
        ) : (
          <>
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
              {kpiCards.map(({ label, value, icon: Icon, sub }) => (
                <div key={label} className="bg-surface border border-border-sepia/40 p-6 flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-label-caps text-[9px] tracking-widest text-on-surface-variant uppercase mb-1">{label}</p>
                    <p className="font-display text-2xl text-on-surface tracking-wide">{value}</p>
                    <p className="font-body text-[11px] text-on-surface-variant mt-0.5">{sub}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Recent Orders */}
            <div className="bg-surface border border-border-sepia/40">
              <div className="px-6 py-5 border-b border-border-sepia/30 flex items-center justify-between">
                <h2 className="font-display text-lg text-on-surface uppercase tracking-widest">Recent Orders</h2>
                <a href="/admin/orders" className="font-label-caps text-[10px] tracking-widest text-primary hover:underline uppercase">
                  View All →
                </a>
              </div>

              {recentOrders.length === 0 ? (
                <div className="px-6 py-16 text-center">
                  <ShoppingCart className="h-8 w-8 text-on-surface-variant/30 mx-auto mb-3" />
                  <p className="font-body text-[14px] text-on-surface-variant">No orders have been placed yet.</p>
                  <p className="font-body text-[12px] text-on-surface-variant/60 mt-1">Orders will appear here once customers complete a purchase.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border-sepia/20">
                        {['Order ID', 'Date', 'Amount', 'Payment', 'Status'].map((h) => (
                          <th key={h} className="px-6 py-3 text-left font-label-caps text-[9px] tracking-widest text-on-surface-variant uppercase">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-sepia/20">
                      {recentOrders.map((ord) => (
                        <tr key={ord.id} className="hover:bg-surface-parchment transition-colors">
                          <td className="px-6 py-4 font-mono text-[12px] text-on-surface">{ord.id.slice(0, 8).toUpperCase()}</td>
                          <td className="px-6 py-4 font-body text-[13px] text-on-surface-variant">
                            {new Date(ord.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </td>
                          <td className="px-6 py-4 font-body text-[13px] text-on-surface font-semibold">{formatPrice(ord.amount)}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-block px-2 py-0.5 border font-label-caps text-[9px] tracking-widest uppercase ${ord.isPaid ? 'text-green-700 bg-green-50 border-green-200' : 'text-amber-600 bg-amber-50 border-amber-200'}`}>
                              {ord.isPaid ? 'Paid' : 'Pending'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-block px-2 py-0.5 border font-label-caps text-[9px] tracking-widest uppercase ${statusColor[ord.status] ?? 'text-on-surface-variant bg-surface border-border-sepia'}`}>
                              {ord.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Curator Guidelines */}
            <div className="mt-8 bg-surface-parchment border border-border-sepia/40 px-6 py-5">
              <h3 className="font-display text-[14px] text-on-surface uppercase tracking-widest mb-3">Curator Guidelines</h3>
              <ol className="space-y-2 list-decimal list-inside">
                {[
                  'Product additions trigger Cloudinary metadata registration immediately.',
                  'Never upload uncertified specimens without registering GIA security seals.',
                  'Order status changes are permanent and visible to the customer instantly.',
                ].map((note, i) => (
                  <li key={i} className="font-body text-[13px] text-on-surface-variant leading-relaxed">{note}</li>
                ))}
              </ol>
            </div>
          </>
        )}
      </main>
    </div>
  );
}