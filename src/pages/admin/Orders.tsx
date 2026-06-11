import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/AdminSidebar.tsx';
import { Loader2, ClipboardList, CheckCircle, Package, ArrowUpRight, Award, Truck } from 'lucide-react';
import { formatPrice } from '../../lib/utils.ts';

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState('');

  const fetchAllOrders = async () => {
    try {
      const res = await fetch('/api/orders/my'); // loaded general registry as global auth allows full list
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    fetchAllOrders().finally(() => setIsLoading(false));
  }, []);

  const handleUpdateStatus = async (orderId: string, isPaid: boolean) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPaid }),
      });

      if (res.ok) {
        setSuccessMsg(`Order status successfully updated to: ${isPaid ? 'PAID / DISPATCHED' : 'PENDING'}`);
        await fetchAllOrders();
        setTimeout(() => setSuccessMsg(''), 4000);
      } else {
        const d = await res.json();
        alert(d.error || 'Failed to update ledger');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-surface-bright min-h-screen text-on-surface flex select-none">
      <AdminSidebar />

      <main className="flex-1 pl-76 pr-8 py-10 select-text overflow-x-hidden min-h-screen">
        
        {/* Header toolbar */}
        <header className="mb-10 flex flex-wrap justify-between items-center gap-4">
          <div>
            <h1 className="font-headline-lg text-headline-lg text-primary uppercase">
              Sales Ledger
            </h1>
            <p className="font-body-md text-text-muted mt-1">
              Verify customer acquisitions, update packing status, and coordinate secure delivery handovers.
            </p>
          </div>
        </header>

        {/* Feedback logs */}
        {successMsg && (
          <div className="mb-6 p-4 bg-success-forest/10 border border-success-forest/30 text-success-forest font-body-sm text-[13px] flex items-center gap-2">
            <CheckCircle className="h-5 w-5" /> <span>{successMsg}</span>
          </div>
        )}

        {/* List table */}
        {isLoading ? (
          <div className="min-h-[300px] flex justify-center items-center">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
          </div>
        ) : orders.length === 0 ? (
          <div className="py-20 text-center max-w-md mx-auto bg-surface-parchment p-8 border border-border-sepia shadow-xs">
            <ClipboardList className="h-10 w-10 text-primary opacity-60 mx-auto mb-4" />
            <h3 className="font-headline-sm text-primary uppercase">Ledger Empty</h3>
            <p className="font-body-sm text-text-muted mt-2">
              No acquisitions have been initialized through this session yet. Check back once users submit checkout terms.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto bg-surface-parchment border border-border-sepia shadow-xs">
            <table className="w-full border-collapse text-left text-[14px]">
              <thead>
                <tr className="bg-surface-parchment text-primary border-b border-border-sepia font-label-caps text-[10px] tracking-wider uppercase font-bold text-center">
                  <th className="px-6 py-4">ORDER ID</th>
                  <th className="px-6 py-4">DATE REGISTERED</th>
                  <th className="px-6 py-4">PATRON ID</th>
                  <th className="px-6 py-4">Status & Action</th>
                  <th className="px-6 py-4 text-right">VALUE (INR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-sepia/25">
                {orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-white/40 transition-colors text-center text-on-surface">
                    <td className="px-6 py-5 font-semibold text-primary font-mono">{ord.id}</td>
                    <td className="px-6 py-5 font-mono text-[13px]">{new Date(ord.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-5 text-left font-mono text-text-muted text-[13px]">
                      {ord.userId || 'Guest Client'}
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center justify-center gap-3">
                        <span className={`inline-block px-2.5 py-1 font-label-caps text-[9px] tracking-widest border font-bold uppercase ${
                          ord.isPaid
                            ? 'bg-success-forest/10 text-success-forest border-success-forest/30'
                            : 'bg-secondary-container/20 text-secondary border-secondary-container/30'
                        }`}>
                          {ord.isPaid ? 'PAID / DISPATCHED' : 'PENDING'}
                        </span>

                        {/* Interactive state updating trigger toggler details */}
                        <button
                          onClick={() => handleUpdateStatus(ord.id, !ord.isPaid)}
                          className="px-3.5 py-1 border border-primary text-primary font-label-caps hover:bg-primary hover:text-white transition-all text-[9px] tracking-widest uppercase font-semibold flex items-center gap-1 cursor-pointer"
                        >
                          <Truck className="h-3 w-3" /> Status Toggle
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-5 font-semibold text-primary text-right font-mono">{formatPrice(ord.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
