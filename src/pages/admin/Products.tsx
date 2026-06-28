import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/AdminSidebar.tsx';
import { Loader2, Trash2, Edit, Plus, CheckCircle } from 'lucide-react';
import { formatPrice } from '../../lib/utils.ts';

// ─── Gemstone colour palette ────────────────────────────────────────────────
const STONE_COLORS = [
  { label: 'Pigeon Blood Red', hex: '#69001b' },
  { label: 'Deep Crimson', hex: '#990012' },
  { label: 'Rose Pink', hex: '#e8758a' },
  { label: 'Royal Blue', hex: '#002b5c' },
  { label: 'Cornflower Blue', hex: '#4169b0' },
  { label: 'Teal Blue', hex: '#007078' },
  { label: 'Vivid Green', hex: '#004b23' },
  { label: 'Mint Green', hex: '#3cb371' },
  { label: 'Tsavorite Green', hex: '#228b22' },
  { label: 'Canary Yellow', hex: '#ffdeac' },
  { label: 'Golden Orange', hex: '#d2691e' },
  { label: 'Cognac Orange', hex: '#a0522d' },
  { label: 'Violet Purple', hex: '#4b0082' },
  { label: 'Lilac Lavender', hex: '#c9a0dc' },
  { label: 'Padparadscha', hex: '#ff7f50' },
  { label: 'Champagne', hex: '#f7e7ce' },
  { label: 'Cream Pearl', hex: '#fceae3' },
  { label: 'Icy White', hex: '#f5f5f0' },
  { label: 'Smoky Grey', hex: '#808080' },
  { label: 'Jet Black', hex: '#1a1a1a' },
];

const EMPTY_FORM = {
  id: '', name: '', description: '',
  price: 150000,
  stoneType: 'Royal Blue Sapphire',
  stoneColor: '#002b5c',
  category: 'Loose Gemstones',
  treatments: 'Natural',
  origin: 'Ceylon',
  caratWeight: '4.2',
  dimensions: '9.0 x 8.1 x 5.8 mm',
  clarity: 'Slightly Included',
  featured: false,
};

export default function AdminProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ ...EMPTY_FORM });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState('');

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products || []);
      }
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    setIsLoading(true);
    fetchProducts().finally(() => setIsLoading(false));
  }, []);

  // ── Open create / edit form ────────────────────────────────────────────────
  const handleCreateClick = () => {
    setEditingId(null);
    setFormData({ ...EMPTY_FORM });
    setImageUrl('');
    setImageFile(null);
    setErrorMsg('');
    setIsFormOpen(true);
  };

  const handleEditClick = (p: any) => {
    setEditingId(p.id);
    setFormData({
      id: p.id,
      name: p.name,
      description: p.description || '',
      price: p.price,
      stoneType: p.stoneType || '',
      stoneColor: p.stoneColor || '#002b5c',
      category: p.category || 'Loose Gemstones',
      treatments: p.treatments || 'None',
      origin: p.origin || 'Ceylon',
      caratWeight: p.caratWeight || '3.5',
      dimensions: p.dimensions || '',
      clarity: p.clarity || '',
      featured: p.featured || false,
    });
    setImageUrl(p.images?.[0] || '');
    setImageFile(null);
    setErrorMsg('');
    setIsFormOpen(true);
  };

  // ── Delete ─────────────────────────────────────────────────────────────────
  const handleDelete = async (id: string) => {
    if (!confirm('Permanently withdraw this specimen from the heritage inventory?')) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProducts(products.filter(p => p.id !== id));
        flash('success', 'Gemstone withdrawn from inventory.');
      }
    } catch (err) { console.error(err); }
  };

  // ── Submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg(''); setErrorMsg('');

    // Send as JSON (image handled separately via /api/upload if file provided)
    let finalImageUrl = imageUrl;

    if (imageFile) {
      const fd = new FormData();
      fd.append('file', imageFile);
      try {
        const upRes = await fetch('/api/upload', { method: 'POST', body: fd });
        const upData = await upRes.json();
        if (!upRes.ok) throw new Error(upData.error || 'Image upload failed');
        finalImageUrl = upData.url;
      } catch (err: any) {
        setErrorMsg(err.message);
        return;
      }
    }

    const body = {
      name: formData.name,
      description: formData.description,
      price: Number(formData.price),
      stoneType: formData.stoneType,
      stoneColor: formData.stoneColor,
      category: formData.category,
      treatments: formData.treatments,
      origin: formData.origin,
      caratWeight: Number(formData.caratWeight),
      dimensions: formData.dimensions,
      clarity: formData.clarity,
      featured: formData.featured,
      ...(finalImageUrl ? { images: [finalImageUrl] } : {}),
    };

    try {
      const url = editingId ? `/api/products/${editingId}` : '/api/products';
      const method = editingId ? 'PATCH' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Write operation failed');
      flash('success', editingId ? 'Gemstone updated successfully.' : 'New gemstone registered.');
      setIsFormOpen(false);
      await fetchProducts();
    } catch (err: any) {
      setErrorMsg(err.message || 'Submission error');
    }
  };

  const flash = (type: 'success' | 'error', msg: string) => {
    if (type === 'success') { setSuccessMsg(msg); setTimeout(() => setSuccessMsg(''), 4000); }
    else { setErrorMsg(msg); setTimeout(() => setErrorMsg(''), 5000); }
  };

  const selectedColor = STONE_COLORS.find(c => c.hex === formData.stoneColor);

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex bg-background">
      <AdminSidebar />

      <main className="flex-1 overflow-auto px-8 py-10">

        {/* Page header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl text-on-surface uppercase tracking-widest mb-1">Vault Inventory</h1>
            <p className="font-body text-[13px] text-on-surface-variant">Add gemstones, modify carat specifications or review lab credentials.</p>
          </div>
          <button
            onClick={handleCreateClick}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-white font-label-caps text-[11px] tracking-widest uppercase hover:bg-primary/90 transition-all border border-secondary"
          >
            <Plus className="h-4 w-4" />
            Acquire New Specimen
          </button>
        </div>

        {/* Feedback */}
        {successMsg && (
          <div className="mb-5 p-3 bg-success-forest/10 border border-success-forest/30 flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-success-forest flex-shrink-0" />
            <p className="font-body text-[13px] text-success-forest">{successMsg}</p>
          </div>
        )}
        {errorMsg && (
          <div className="mb-5 p-3 bg-error/10 border border-error/30 font-body text-[13px] text-error">{errorMsg}</div>
        )}

        {/* ── Add / Edit Form ── */}
        {isFormOpen && (
          <div className="mb-10 bg-surface border border-border-sepia/40 p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl text-on-surface uppercase tracking-widest">
                {editingId ? 'Edit Gemstone Details' : 'Register New Specimen'}
              </h2>
              <button onClick={() => setIsFormOpen(false)} className="font-label-caps text-[10px] tracking-widest text-on-surface-variant hover:text-primary">
                CANCEL
              </button>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

              {/* Name */}
              <Field label="Name / Heading Title">
                <input type="text" required value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Mughal Pigeon Blood Ruby"
                  className={inputCls} />
              </Field>

              {/* Price */}
              <Field label="Estimated Price (INR)">
                <input type="number" required value={formData.price}
                  onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
                  className={`${inputCls} font-mono`} />
              </Field>

              {/* Stone Type */}
              <Field label="Stone Type">
                <input type="text" required value={formData.stoneType}
                  onChange={e => setFormData({ ...formData, stoneType: e.target.value })}
                  placeholder="e.g. Pigeon Blood Ruby"
                  className={inputCls} />
              </Field>

              {/* Stone Colour — dropdown with swatch */}
              <Field label="Stone Colour">
                <div className="flex gap-2 items-center">
                  {/* Live preview swatch */}
                  <div
                    className="w-11 h-11 flex-shrink-0 border border-border-sepia/60"
                    style={{ backgroundColor: formData.stoneColor }}
                    title={selectedColor?.label ?? formData.stoneColor}
                  />
                  <select
                    value={formData.stoneColor}
                    onChange={e => setFormData({ ...formData, stoneColor: e.target.value })}
                    className={`${inputCls} flex-1`}
                  >
                    {STONE_COLORS.map(c => (
                      <option key={c.hex} value={c.hex}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>
                <p className="font-mono text-[10px] text-on-surface-variant mt-1">{formData.stoneColor}</p>
              </Field>

              {/* Category */}
              <Field label="Category">
                <select value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value })}
                  className={inputCls}
                >
                  <option value="Loose Gemstones">Loose Gemstones</option>
                  <option value="Engagement Rings">Engagement Rings</option>
                  <option value="Artisan Necklaces">Artisan Necklaces</option>
                  <option value="Imperial Earrings">Imperial Earrings</option>
                </select>
              </Field>

              {/* Origin */}
              <Field label="Origin Geography">
                <input type="text" value={formData.origin}
                  onChange={e => setFormData({ ...formData, origin: e.target.value })}
                  placeholder="e.g. Ceylon, Burmese, Zambian"
                  className={inputCls} />
              </Field>

              {/* Carat Weight */}
              <Field label="Carat Weight">
                <input type="text" value={formData.caratWeight}
                  onChange={e => setFormData({ ...formData, caratWeight: e.target.value })}
                  placeholder="e.g. 3.5"
                  className={inputCls} />
              </Field>

              {/* Clarity */}
              <Field label="Clarity Specification">
                <input type="text" value={formData.clarity}
                  onChange={e => setFormData({ ...formData, clarity: e.target.value })}
                  placeholder="e.g. Eye Clean VVS2"
                  className={inputCls} />
              </Field>

              {/* Treatments */}
              <Field label="Historical Treatments">
                <input type="text" value={formData.treatments}
                  onChange={e => setFormData({ ...formData, treatments: e.target.value })}
                  placeholder="e.g. None / Minor Heat"
                  className={inputCls} />
              </Field>

              {/* Dimensions */}
              <Field label="Dimensions">
                <input type="text" value={formData.dimensions}
                  onChange={e => setFormData({ ...formData, dimensions: e.target.value })}
                  placeholder="e.g. 8.4 x 7.2 x 5.1 mm"
                  className={inputCls} />
              </Field>

              {/* Featured toggle */}
              <Field label="Feature on Homepage">
                <label className="flex items-center gap-3 cursor-pointer mt-1">
                  <input type="checkbox" checked={formData.featured}
                    onChange={e => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4 accent-primary" />
                  <span className="font-body text-[13px] text-on-surface-variant">
                    Show in Featured Collection
                  </span>
                </label>
              </Field>

              {/* Description — full width */}
              <div className="md:col-span-2 xl:col-span-3 space-y-1.5">
                <label className={labelCls}>Curatorial Evaluation Description</label>
                <textarea rows={3} required value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Provide precise details regarding light dispersion, inclusions and historical cutting styles…"
                  className={`${inputCls} resize-none`} />
              </div>

              {/* Image upload / URL — full width */}
              <div className="md:col-span-2 xl:col-span-3 bg-surface-parchment border border-dashed border-border-sepia/40 p-5 space-y-4">
                <span className="font-label-caps text-[10px] text-primary uppercase tracking-wider font-bold block">
                  Gemstone Portrayal Asset
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="font-body text-[12px] text-on-surface-variant block">Upload to Cloudinary:</span>
                    <input type="file" accept="image/*"
                      onChange={e => { if (e.target.files?.[0]) setImageFile(e.target.files[0]); }}
                      className="w-full p-1 bg-white border border-border-sepia/50 text-[12px]" />
                    {imageFile && <p className="font-body text-[11px] text-success-forest">✓ {imageFile.name}</p>}
                  </div>
                  <div className="space-y-1">
                    <span className="font-body text-[12px] text-on-surface-variant block">Or paste external URL:</span>
                    <input type="text" value={imageUrl}
                      onChange={e => setImageUrl(e.target.value)}
                      placeholder="https://example.com/gem.jpg"
                      className="w-full bg-white border border-border-sepia/50 p-2 text-[12px] focus:ring-1 focus:ring-primary outline-none" />
                    {imageUrl && !imageFile && (
                      <img src={imageUrl} alt="preview" className="h-16 w-16 object-cover border border-border-sepia mt-1" referrerPolicy="no-referrer" />
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="md:col-span-2 xl:col-span-3 pt-4 border-t border-border-sepia/30 flex justify-end gap-3">
                <button type="button" onClick={() => setIsFormOpen(false)}
                  className="px-6 py-2.5 border border-border-sepia font-label-caps text-[11px] tracking-widest text-on-surface-variant hover:text-on-surface transition-colors">
                  CANCEL
                </button>
                <button type="submit"
                  className="px-8 py-2.5 bg-primary text-white font-label-caps text-[11px] tracking-widest uppercase border border-secondary hover:bg-primary/90 transition-all">
                  SAVE SPECIMEN
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ── Product Table ── */}
        {isLoading ? (
          <div className="min-h-[300px] flex justify-center items-center gap-3 text-on-surface-variant">
            <Loader2 className="h-7 w-7 text-primary animate-spin" />
            <span className="font-label-caps text-[11px] tracking-widest uppercase">Loading Vault…</span>
          </div>
        ) : products.length === 0 ? (
          <div className="py-20 text-center bg-surface border border-border-sepia/30">
            <p className="font-body text-[14px] text-on-surface-variant italic">Inventory is empty. Register first specimens.</p>
          </div>
        ) : (
          <div className="overflow-x-auto bg-surface-parchment border border-border-sepia shadow-sm">
            <table className="w-full border-collapse text-left text-[14px]">
              <thead>
                <tr className="bg-surface-parchment border-b border-border-sepia font-label-caps text-[10px] tracking-wider uppercase text-on-surface-variant">
                  <th className="px-5 py-4">Portrayal</th>
                  <th className="px-5 py-4">Gem Details</th>
                  <th className="px-5 py-4">Specifications</th>
                  <th className="px-5 py-4">Colour</th>
                  <th className="px-5 py-4">Price</th>
                  <th className="px-5 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-sepia/25">
                {products.map((item: any) => {
                  const colorEntry = STONE_COLORS.find(c => c.hex === item.stoneColor);
                  return (
                    <tr key={item.id} className="hover:bg-white/40 transition-colors text-on-surface">
                      <td className="px-5 py-4 w-24">
                        <div className="w-14 h-14 bg-white border border-border-sepia p-0.5 overflow-hidden">
                          <img src={item.images?.[0]} alt={item.name}
                            className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <p className="font-display text-[15px] text-primary">{item.name}</p>
                        <span className="font-label-caps text-[9px] bg-primary/10 text-primary px-2 py-0.5 uppercase tracking-wider mt-1 inline-block">
                          {item.category}
                        </span>
                      </td>
                      <td className="px-5 py-4 font-mono text-[12px] text-on-surface-variant space-y-0.5">
                        <p>Type: {item.stoneType}</p>
                        <p>Weight: {item.caratWeight} ct</p>
                        <p>Origin: {item.origin}</p>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 border border-border-sepia/50 flex-shrink-0"
                            style={{ backgroundColor: item.stoneColor }} />
                          <span className="font-body text-[12px] text-on-surface-variant">
                            {colorEntry?.label ?? item.stoneColor}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4 font-semibold text-primary font-mono">{formatPrice(item.price)}</td>
                      <td className="px-5 py-4">
                        <div className="flex justify-center gap-2">
                          <button onClick={() => handleEditClick(item)}
                            className="p-2 text-secondary hover:text-primary hover:bg-white rounded-sm transition-all" title="Edit">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button onClick={() => handleDelete(item.id)}
                            className="p-2 text-on-surface-variant hover:text-red-700 hover:bg-white rounded-sm transition-all" title="Delete">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}

// ── Shared helpers ──────────────────────────────────────────────────────────
const inputCls = 'w-full bg-white border border-border-sepia/70 px-3 py-2.5 text-[13px] text-on-surface focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all appearance-none';
const labelCls = 'font-label-caps text-[10px] tracking-widest text-on-surface-variant uppercase block mb-1.5 font-bold';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-0">
      <label className={labelCls}>{label}</label>
      {children}
    </div>
  );
}
