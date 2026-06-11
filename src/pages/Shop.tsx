import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar.tsx';
import Footer from '../components/Footer.tsx';
import { Loader2, Heart, Award, ArrowUpRight } from 'lucide-react';
import { formatPrice } from '../lib/utils.ts';

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Filters State
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [priceRange, setPriceRange] = useState<number>(5000000);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [activeSort, setActiveSort] = useState('Heritage Priority');

  // Parse Params from Search Query
  const categoryParam = searchParams.get('category') || '';
  const stoneTypeParam = searchParams.get('stoneType') || '';
  const searchParam = searchParams.get('search') || '';

  // Options
  const stoneTypes = ['Royal Blue Sapphire', 'Pigeon Blood Ruby', 'Zambian Emerald', 'Basra Pearls'];
  const categories = ['Engagement Rings', 'Loose Gemstones', 'Artisan Necklaces', 'Imperial Earrings'];
  const colorChips = [
    { name: 'Ruby Dark', hex: '#69001b' },
    { name: 'Sapphire Dark', hex: '#002b5c' },
    { name: 'Emerald Emerald', hex: '#004b23' },
    { name: 'Basra Rose', hex: '#fceae3' },
    { name: 'Gold', hex: '#ffdeac' }
  ];

  // Fetch logic
  useEffect(() => {
    const fetchFilteredProducts = async () => {
      setIsLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (categoryParam) queryParams.set('category', categoryParam);
        if (stoneTypeParam) queryParams.set('stoneType', stoneTypeParam);
        if (searchParam) queryParams.set('search', searchParam);
        queryParams.set('sort', activeSort);

        const res = await fetch(`/api/products?${queryParams.toString()}`);
        if (res.ok) {
          const data = await res.json();
          // Client-side local filters for price and color spectrum
          let results = data.products || [];
          if (priceRange) {
            results = results.filter((p: any) => p.price <= priceRange);
          }
          if (selectedColors.length > 0) {
            results = results.filter((p: any) => selectedColors.includes(p.stoneColor));
          }
          setProducts(results);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFilteredProducts();
  }, [categoryParam, stoneTypeParam, searchParam, activeSort, priceRange, selectedColors]);

  const toggleCategory = (cat: string) => {
    const nextParams = new URLSearchParams(searchParams);
    if (categoryParam === cat) {
      nextParams.delete('category');
    } else {
      nextParams.set('category', cat);
    }
    setSearchParams(nextParams);
  };

  const toggleStoneType = (type: string) => {
    const nextParams = new URLSearchParams(searchParams);
    if (stoneTypeParam === type) {
      nextParams.delete('stoneType');
    } else {
      nextParams.set('stoneType', type);
    }
    setSearchParams(nextParams);
  };

  const toggleColor = (hex: string) => {
    if (selectedColors.includes(hex)) {
      setSelectedColors(selectedColors.filter(c => c !== hex));
    } else {
      setSelectedColors([...selectedColors, hex]);
    }
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPriceRange(Number(e.target.value));
  };

  const clearAllFilters = () => {
    setSearchParams(new URLSearchParams());
    setPriceRange(5000000);
    setSelectedColors([]);
    setActiveSort('Heritage Priority');
  };

  return (
    <div className="bg-surface min-h-screen text-on-surface font-body-md select-none pb-0">
      <Navbar />

      <main className="pt-32 pb-20 max-w-container-max mx-auto px-4 md:px-gutter">
        {/* Editorial Header */}
        <header className="mb-10 text-center select-text">
          <h2 className="font-headline-lg text-headline-lg text-primary mb-2">The Collection</h2>
          <div className="flex justify-center items-center gap-4 mb-4">
            <div className="h-px w-12 bg-border-sepia" />
            <span className="font-label-caps text-label-caps text-text-muted font-semibold tracking-widest text-[11px] uppercase">
              Established 1924
            </span>
            <div className="h-px w-12 bg-border-sepia" />
          </div>
          <p className="font-body-sm text-text-muted italic max-w-md mx-auto">
            Sourced ethically and hand-carved to maximize light dispersion under Master Curator observation.
          </p>
        </header>

        {/* Filters and Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
          
          {/* Left Sidebar (Sticky Filters) */}
          <aside className="lg:col-span-3 lg:sticky lg:top-32 h-fit space-y-8 pr-4">
            {/* Clear All Option */}
            {(categoryParam || stoneTypeParam || searchParam || selectedColors.length > 0 || priceRange < 5000000) && (
              <button
                onClick={clearAllFilters}
                className="w-full text-center py-2 border border-primary text-primary hover:bg-primary hover:text-white font-label-caps text-[10px] tracking-widest transition-all mb-4"
              >
                CLEAR ALL SELECTED
              </button>
            )}

            {/* Filter: Stone Types */}
            <section className="bg-surface-parchment/30 p-4 border border-border-sepia/25">
              <h3 className="font-label-caps text-[11px] font-bold text-primary mb-4 tracking-widest uppercase">
                Stone Type
              </h3>
              <ul className="space-y-3 font-body-sm">
                {stoneTypes.map((type) => {
                  const isChecked = stoneTypeParam === type;
                  return (
                    <li
                      key={type}
                      onClick={() => toggleStoneType(type)}
                      className="flex items-center gap-3 group cursor-pointer"
                    >
                      <span
                        className={`w-4 h-4 border flex items-center justify-center transition-all ${
                          isChecked
                            ? 'border-primary bg-primary text-white'
                            : 'border-outline-variant/60 bg-white group-hover:border-primary'
                        }`}
                      >
                        {isChecked && <span className="text-[10px]">✓</span>}
                      </span>
                      <span
                        className={`transition-colors text-[13px] ${
                          isChecked ? 'text-primary font-semibold' : 'text-on-surface-variant group-hover:text-primary'
                        }`}
                      >
                        {type}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </section>

            {/* Divider rule */}
            <div className="h-1.5 border-t border-b border-border-sepia/15 w-full my-4" />

            {/* Filter: Color Spectrum */}
            <section className="bg-surface-parchment/30 p-4 border border-border-sepia/25">
              <h3 className="font-label-caps text-[11px] font-bold text-primary mb-4 tracking-widest uppercase">
                Color Spectrum
              </h3>
              <div className="flex flex-wrap gap-3">
                {colorChips.map((chip) => {
                  const isSelected = selectedColors.includes(chip.hex);
                  return (
                    <button
                      key={chip.name}
                      onClick={() => toggleColor(chip.hex)}
                      style={{ backgroundColor: chip.hex }}
                      className={`w-8 h-8 rounded-full transition-transform active:scale-90 ${
                        isSelected
                          ? 'ring-2 ring-primary ring-offset-2 scale-110'
                          : 'ring-1 ring-outline-variant/30 hover:scale-105'
                      }`}
                      title={chip.name}
                    />
                  );
                })}
              </div>
            </section>

            <div className="h-1.5 border-t border-b border-border-sepia/15 w-full my-4" />

            {/* Filter: Category */}
            <section className="bg-surface-parchment/30 p-4 border border-border-sepia/25">
              <h3 className="font-label-caps text-[11px] font-bold text-primary mb-4 tracking-widest uppercase">
                Category
              </h3>
              <ul className="space-y-3 font-body-sm">
                {categories.map((cat) => {
                  const isChecked = categoryParam === cat;
                  return (
                    <li
                      key={cat}
                      onClick={() => toggleCategory(cat)}
                      className={`text-[13px] cursor-pointer transition-all ${
                        isChecked
                          ? 'text-primary font-bold border-l-2 border-primary pl-2'
                          : 'text-on-surface-variant hover:text-primary pl-0 hover:pl-2'
                      }`}
                    >
                      {cat}
                    </li>
                  );
                })}
              </ul>
            </section>

            <div className="h-1.5 border-t border-b border-border-sepia/15 w-full my-4" />

            {/* Filter: Price Range */}
            <section className="bg-surface-parchment/30 p-4 border border-border-sepia/25">
              <h3 className="font-label-caps text-[11px] font-bold text-primary mb-4 tracking-widest uppercase">
                Max Price
              </h3>
              <div className="space-y-4">
                <input
                  type="range"
                  min={100000}
                  max={5000000}
                  step={50000}
                  value={priceRange}
                  onChange={handlePriceChange}
                  className="w-full accent-primary bg-outline-variant/30 h-1 cursor-pointer"
                />
                <div className="flex justify-between font-label-caps text-[10px] text-text-muted tracking-wider">
                  <span>₹1,00,000</span>
                  <span className="text-primary font-semibold font-mono text-[11px]">
                    {formatPrice(priceRange)}
                  </span>
                  <span>₹50,00,000+</span>
                </div>
              </div>
            </section>
          </aside>

          {/* Right Column (Products Grid) */}
          <div className="lg:col-span-9 space-y-6">
            
            {/* Grid Controls banner */}
            <div className="flex flex-wrap justify-between items-center bg-surface-parchment/20 p-4 border-b border-outline-variant/30 gap-4">
              <p className="font-body-sm text-text-muted">
                Showing{' '}
                <span className="text-on-surface font-semibold font-mono">
                  {products.length}
                </span>{' '}
                exceptional treasures
              </p>

              <div className="flex items-center gap-2">
                <span className="font-label-caps text-label-caps text-text-muted uppercase text-[10px] tracking-wider">
                  Sort By:
                </span>
                <select
                  value={activeSort}
                  onChange={(e) => setActiveSort(e.target.value)}
                  className="bg-transparent border-none font-label-caps text-label-caps text-primary focus:ring-0 focus:outline-none cursor-pointer text-[11px] tracking-widest font-bold"
                >
                  <option value="Heritage Priority">Heritage Priority</option>
                  <option value="Price: High to Low">Price: High to Low</option>
                  <option value="Price: Low to High">Price: Low to High</option>
                  <option value="New Acquisitions">New Acquisitions</option>
                </select>
              </div>
            </div>

            {/* Main Grid */}
            {isLoading ? (
              <div className="min-h-[400px] flex flex-col justify-center items-center gap-3">
                <Loader2 className="h-10 w-10 text-primary animate-spin" />
                <p className="font-label-caps text-label-caps text-text-muted opacity-80 uppercase tracking-widest animate-pulse">
                  Opening the Heritage Vault...
                </p>
              </div>
            ) : products.length === 0 ? (
              <div className="min-h-[400px] flex flex-col justify-center items-center text-center p-8 bg-surface-parchment/10 border border-dashed border-border-sepia/20">
                <p className="font-headline-sm text-headline-sm text-primary mb-2">No Treasures Found</p>
                <p className="font-body-md text-text-muted max-w-xs mb-6">
                  We currently lack stones matching your pricing or selection parameters. Modify your criteria to search.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="bg-primary text-on-primary font-label-caps text-label-caps tracking-widest px-8 py-3"
                >
                  RESET FILTERS
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-gutter">
                {products.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => navigate(`/shop/${product.id}`)}
                    className="product-card group relative bg-surface-parchment border border-border-sepia/30 overflow-hidden flex flex-col transition-all duration-300 hover:shadow-2xl cursor-pointer"
                  >
                    <div className="aspect-square w-full overflow-hidden relative">
                      <img
                        src={product.images?.[0]}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        referrerPolicy="no-referrer"
                      />
                      <div className="hover-overlay absolute inset-0 bg-dark-burgundy/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button className="bg-primary text-white font-label-caps text-[11px] px-6 py-3 tracking-widest hover:bg-primary-container transition-colors flex items-center gap-1 uppercase">
                          Acquire <ArrowUpRight className="h-4 w-4" />
                        </button>
                      </div>
                      {product.featured && (
                        <div className="absolute top-4 right-4 bg-primary text-white px-3 py-1 font-label-caps text-[9px] tracking-widest uppercase">
                          Featured
                        </div>
                      )}
                    </div>

                    <div className="p-stack-md flex flex-col gap-2 bg-white/50 backdrop-blur-sm flex-grow">
                      <div className="flex justify-between items-start">
                        <h4 className="font-headline-sm text-[20px] text-on-surface line-clamp-1 truncate group-hover:text-primary transition-colors">
                          {product.name}
                        </h4>
                        <Heart className="h-4.5 w-4.5 text-outline-variant hover:text-primary transition-colors mt-1 flex-shrink-0" />
                      </div>
                      <span className="inline-block font-label-caps text-[9px] font-bold text-primary-container bg-primary-fixed/20 px-2 py-0.5 w-fit uppercase tracking-wider">
                        {product.stoneType || product.category}
                      </span>
                      <p className="font-headline-sm text-headline-sm text-secondary font-semibold font-mono mt-2">
                        {formatPrice(product.price)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
