import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/AdminSidebar.tsx';
import { Loader2, Trash2, Edit, Plus, FileText, Upload, PlusCircle, CheckCircle, Image } from 'lucide-react';
import { formatPrice } from '../../lib/utils.ts';

export default function AdminProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Editing state toggles
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form Fields State
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    description: '',
    price: 350000,
    stoneType: 'Pigeon Blood Ruby',
    stoneColor: '#e63946',
    category: 'Loose Gemstones',
    treatments: 'None',
    origin: 'Burmese',
    caratWeight: '3.5',
    dimensions: '8.4 x 7.2 x 5.1 mm',
    clarity: 'Eye Clean VVS2'
  });

  // Image inputs states: accepts file or paste URL
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState('');

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    fetchProducts().finally(() => setIsLoading(false));
  }, []);

  const handleEditClick = (p: any) => {
    setEditingId(p.id);
    setFormData({
      id: p.id,
      name: p.name,
      description: p.description || '',
      price: p.price,
      stoneType: p.stoneType || 'Pigeon Blood Ruby',
      stoneColor: p.stoneColor || '#69001b',
      category: p.category || 'Loose Gemstones',
      treatments: p.treatments || 'None',
      origin: p.origin || 'Ceylon',
      caratWeight: p.caratWeight || '3.5',
      dimensions: p.dimensions || '',
      clarity: p.clarity || ''
    });
    setImageUrl(p.images?.[0] || '');
    setImageFile(null);
    setIsFormOpen(true);
  };

  const handleCreateClick = () => {
    setEditingId(null);
    setFormData({
      id: '',
      name: '',
      description: '',
      price: 150000,
      stoneType: 'Royal Blue Sapphire',
      stoneColor: '#002b5c',
      category: 'Loose Gemstones',
      treatments: 'Natural',
      origin: 'Ceylon',
      caratWeight: '4.2',
      dimensions: '9.0 x 8.1 x 5.8 mm',
      clarity: 'Slightly Included'
    });
    setImageUrl('');
    setImageFile(null);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to permanently withdraw this gemstone from the heritage inventory?')) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProducts(products.filter(p => p.id !== id));
        setSuccessMsg('Gemstone withdrawn successfully.');
        setTimeout(() => setSuccessMsg(''), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');

    // Prepare multipart form data for upload or raw state fields
    const payload = new FormData();
    payload.append('name', formData.name);
    payload.append('description', formData.description);
    payload.append('price', String(formData.price));
    payload.append('stoneType', formData.stoneType);
    payload.append('stoneColor', formData.stoneColor);
    payload.append('category', formData.category);
    payload.append('treatments', formData.treatments);
    payload.append('origin', formData.origin);
    payload.append('caratWeight', formData.caratWeight);
    payload.append('dimensions', formData.dimensions);
    payload.append('clarity', formData.clarity);

    if (imageFile) {
      payload.append('image', imageFile);
    } else if (imageUrl) {
      payload.append('imageUrl', imageUrl);
    }

    try {
      const url = editingId ? `/api/products/${editingId}` : '/api/products';
      const method = editingId ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        body: payload
      });

      if (res.ok) {
        setSuccessMsg(editingId ? 'Gemstone specification modified successfully.' : 'New gemstone registered to collection.');
        setIsFormOpen(false);
        await fetchProducts();
        setTimeout(() => setSuccessMsg(''), 4000);
      } else {
        const d = await res.json();
        setErrorMsg(d.error || 'Failed to complete write operation.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error occurred during submission.');
    }
  };

  return (
    <div className="bg-surface-bright min-h-screen text-on-surface flex select-none">
      <AdminSidebar />

      <main className="flex-1 pl-76 pr-8 py-10 select-text overflow-x-hidden min-h-screen">
        
        {/* Header Options bar */}
        <header className="mb-10 flex flex-wrap justify-between items-center gap-4">
          <div>
            <h1 className="font-headline-lg text-headline-lg text-primary uppercase">
              Vault Inventory
            </h1>
            <p className="font-body-md text-text-muted mt-1">
              Add new gemstones, modify carat specifications, or review lab credentials.
            </p>
          </div>
          <button
            onClick={handleCreateClick}
            className="bg-primary text-white hover:bg-primary-container px-6 py-3 font-label-caps text-[11px] tracking-widest uppercase font-semibold flex items-center gap-2 border border-secondary"
          >
            <PlusCircle className="h-4.5 w-4.5" /> Acquire New Specimen
          </button>
        </header>

        {/* Feedback logs */}
        {successMsg && (
          <div className="mb-6 p-4 bg-success-forest/10 border border-success-forest/30 text-success-forest font-body-sm text-[13px] flex items-center gap-2">
            <CheckCircle className="h-5 w-5" /> <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="mb-6 p-4 bg-error-container/40 border border-error/20 text-error-maroon font-body-sm text-[13px]">
            {errorMsg}
          </div>
        )}

        {isFormOpen ? (
          /* Adding or editing products layout details block */
          <form onSubmit={handleSubmit} className="bg-surface-parchment p-8 md:p-10 border border-border-sepia shadow-md space-y-6 max-w-4xl select-text mb-10">
            <div className="flex justify-between items-center pb-4 border-b">
              <h3 className="font-headline-sm text-headline-sm text-primary uppercase">
                {editingId ? 'Edit Gemstone details' : 'Register New Gemstone Specimen'}
              </h3>
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="font-label-caps text-[10px] tracking-widest text-text-muted"
              >
                CANCEL
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 font-body-sm text-[13px]">
              
              <div className="space-y-1.5 md:col-span-2">
                <label className="font-label-caps text-[10px] text-text-muted uppercase tracking-wider block font-bold">NAME / HEADING TITLE</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Mughal Pigeon Blood Ruby"
                  className="w-full bg-white border border-border-sepia/70 p-3 rounded-none focus:ring-1 focus:ring-primary focus:border-primary"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-label-caps text-[10px] text-text-muted uppercase tracking-wider block font-bold">ESTIMATED PRICE (INR)</label>
                <input
                  type="number"
                  required
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  className="w-full bg-white border border-border-sepia/70 p-3 rounded-none font-mono"
                />
              </div>

              <div className="space-y-1.5 md:col-span-3">
                <label className="font-label-caps text-[10px] text-text-muted uppercase tracking-wider block font-bold font-bold">CURATORIAL EVALUATION DESCRIPTION</label>
                <textarea
                  rows={3}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Provide precise details regarding light dispersion, inclusions and historical cutting styles..."
                  className="w-full bg-white border border-border-sepia/70 p-3 rounded-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-label-caps text-[10px] text-text-muted uppercase tracking-wider block font-bold">STONE TYPE</label>
                <input
                  type="text"
                  required
                  value={formData.stoneType}
                  onChange={(e) => setFormData({ ...formData, stoneType: e.target.value })}
                  placeholder="e.g. Pigeon Blood Ruby"
                  className="w-full bg-white border border-border-sepia/70 p-3 rounded-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-label-caps text-[10px] text-text-muted uppercase tracking-wider block font-bold">HEX SPECIFIED COLOR CHIP</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    required
                    value={formData.stoneColor}
                    onChange={(e) => setFormData({ ...formData, stoneColor: e.target.value })}
                    className="w-12 h-11 bg-white p-1 border cursor-pointer rounded-none outline-none"
                  />
                  <input
                    type="text"
                    required
                    value={formData.stoneColor}
                    onChange={(e) => setFormData({ ...formData, stoneColor: e.target.value })}
                    className="flex-1 bg-white border border-border-sepia/70 p-3 font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-label-caps text-[10px] text-text-muted uppercase tracking-wider block font-bold">CATEGORY</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-white border border-border-sepia/70 p-3 rounded-none font-bold"
                >
                  <option value="Loose Gemstones">Loose Gemstones</option>
                  <option value="Engagement Rings">Engagement Rings</option>
                  <option value="Artisan Necklaces">Artisan Necklaces</option>
                  <option value="Imperial Earrings">Imperial Earrings</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-label-caps text-[10px] text-text-muted uppercase tracking-wider block font-bold">CARAT WEIGHT</label>
                <input
                  type="text"
                  value={formData.caratWeight}
                  onChange={(e) => setFormData({ ...formData, caratWeight: e.target.value })}
                  className="w-full bg-white border border-border-sepia/70 p-3 rounded-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-label-caps text-[10px] text-text-muted uppercase tracking-wider block font-bold">ORIGIN GEOGRAPHY</label>
                <input
                  type="text"
                  value={formData.origin}
                  onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                  placeholder="Ceylon"
                  className="w-full bg-white border border-border-sepia/70 p-3 rounded-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-label-caps text-[10px] text-text-muted uppercase tracking-wider block font-bold">HISTORICAL TREATMENTS</label>
                <input
                  type="text"
                  value={formData.treatments}
                  onChange={(e) => setFormData({ ...formData, treatments: e.target.value })}
                  placeholder="None"
                  className="w-full bg-white border border-border-sepia/70 p-3 rounded-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-label-caps text-[10px] text-text-muted uppercase tracking-wider block font-bold">CLARITY SPEC</label>
                <input
                  type="text"
                  value={formData.clarity}
                  onChange={(e) => setFormData({ ...formData, clarity: e.target.value })}
                  placeholder="e.g. VVS2"
                  className="w-full bg-white border border-border-sepia/70 p-3 rounded-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-label-caps text-[10px] text-text-muted uppercase tracking-wider block font-bold">DIMENSIONS</label>
                <input
                  type="text"
                  value={formData.dimensions}
                  onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                  placeholder="e.g. 8x5x4 mm"
                  className="w-full bg-white border border-border-sepia/70 p-3 rounded-none"
                />
              </div>

              {/* Secure Asset Uploading & Paste Area block */}
              <div className="space-y-1.5 md:col-span-3 bg-surface-dim p-4 border border-dashed border-border-sepia/30">
                <span className="font-label-caps text-[10px] text-primary uppercase block tracking-wider font-bold mb-3">
                  Gemstone Portrayal Asset
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="font-body-sm text-[12px] text-text-muted block">Direct Cloudinary upload:</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files?.[0]) setImageFile(e.target.files[0]);
                      }}
                      className="w-full p-1 bg-white border text-[12px]"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="font-body-sm text-[12px] text-text-muted block">Or input external image URL:</span>
                    <input
                      type="text"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="https://lh3.googleusercontent.com/..."
                      className="w-full bg-white border p-2 text-[12px] focus:ring-0"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t flex justify-end gap-3 select-none">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="px-6 py-2.5 border border-border-sepia font-label-caps text-[11px] tracking-widest text-text-muted"
              >
                CANCEL
              </button>
              <button
                type="submit"
                className="px-8 py-2.5 bg-primary text-white font-label-caps text-[11px] tracking-widest uppercase font-semibold border border-primary hover:bg-primary-container"
              >
                SAVE INVENTORY SPECIMEN
              </button>
            </div>
          </form>
        ) : null}

        {/* Main List Table */}
        {isLoading ? (
          <div className="min-h-[300px] flex justify-center items-center">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
          </div>
        ) : products.length === 0 ? (
          <p className="font-body-md text-text-muted italic py-10 bg-surface-parchment/10 text-center border">
            Inventory is empty. Register first specimens.
          </p>
        ) : (
          <div className="overflow-x-auto bg-surface-parchment border border-border-sepia shadow-xs">
            <table className="w-full border-collapse text-left text-[14px]">
              <thead>
                <tr className="bg-surface-parchment text-primary border-b border-border-sepia font-label-caps text-[10px] tracking-wider uppercase font-bold text-center">
                  <th className="px-6 py-4">Portrayal</th>
                  <th className="px-6 py-4">GEM DETAILS</th>
                  <th className="px-6 py-4">SPECIFICATIONS</th>
                  <th className="px-6 py-4">PRICE</th>
                  <th className="px-6 py-4">EDIT / TERMINATE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-sepia/25">
                {products.map((item) => (
                  <tr key={item.id} className="hover:bg-white/40 transition-colors text-center text-on-surface">
                    <td className="px-6 py-4 w-28">
                      <div className="w-16 h-16 bg-white border border-border-sepia p-1 overflow-hidden mx-auto select-none">
                        <img
                          src={item.images?.[0]}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 text-left">
                      <p className="font-bold text-primary font-headline-sm text-[16px]">{item.name}</p>
                      <span className="inline-block mt-1 font-label-caps text-[9px] bg-primary-container/20 text-primary-container font-bold px-2 py-0.5 uppercase tracking-wider">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-left font-mono text-[12px] text-text-muted">
                      <p>Type: {item.stoneType}</p>
                      <p>Weight: {item.caratWeight} ct</p>
                      <p>Origin: {item.origin}</p>
                    </td>
                    <td className="px-6 py-4 font-semibold text-primary font-mono">{formatPrice(item.price)}</td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-3 select-none">
                        <button
                          onClick={() => handleEditClick(item)}
                          className="text-secondary hover:text-primary transition-all p-2 rounded-full hover:bg-white"
                          title="Edit Gem"
                        >
                          <Edit className="h-4.5 w-4.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="text-outline hover:text-red-700 transition-all p-2 rounded-full hover:bg-white"
                          title="Withdraw Gem"
                        >
                          <Trash2 className="h-4.5 w-4.5" />
                        </button>
                      </div>
                    </td>
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
