import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore.ts';
import Navbar from '../components/Navbar.tsx';
import Footer from '../components/Footer.tsx';
import { Loader2, Plus, Minus, Check, ArrowRight, Expand, HelpCircle } from 'lucide-react';
import { formatPrice } from '../lib/utils.ts';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const addItem = useCartStore((state) => state.addItem);

  const [product, setProduct] = useState<any | null>(null);
  const [related, setRelated] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeImage, setActiveImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [addedAlert, setAddedAlert] = useState(false);
  const [isAcquireLoading, setIsAcquireLoading] = useState(false);

  // Accordion Toggles
  const [openAccordion, setOpenFaq] = useState<string | null>('cert');

  useEffect(() => {
    const fetchProductDetails = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/products/${id}`);
        if (res.ok) {
          const data = await res.json();
          setProduct(data.product);
          if (data.product?.images?.[0]) {
            setActiveImage(data.product.images[0]);
          }
          
          // Fetch related of same category
          const category = data.product?.category || 'Loose Gemstones';
          const rRes = await fetch(`/api/products?category=${encodeURIComponent(category)}`);
          if (rRes.ok) {
            const rData = await rRes.json();
            // Filter current
            const filtered = (rData.products || []).filter((p: any) => p.id !== id);
            setRelated(filtered);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchProductDetails();
      setQuantity(1);
      setAddedAlert(false);
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface flex flex-col justify-center items-center gap-3">
        <Loader2 className="h-10 w-10 text-primary animate-spin" />
        <p className="font-label-caps text-label-caps text-text-muted opacity-80 uppercase tracking-widest animate-pulse">
          Examing the Crystalline Structure...
        </p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="bg-surface min-h-screen text-on-surface">
        <Navbar />
        <div className="pt-40 pb-20 text-center max-w-md mx-auto">
          <h2 className="font-headline-md text-headline-md text-primary">Stone Not Found</h2>
          <p className="font-body-md text-text-muted mt-2 mb-6">
            This geological marvel appears to have been acquired by another collector or removed from the inventory.
          </p>
          <Link
            to="/shop"
            className="bg-primary text-on-primary font-label-caps text-label-caps tracking-widest px-8 py-3"
          >
            RETURN TO SHOP
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images?.[0] || '',
      category: product.category,
      stoneType: product.stoneType,
      quantity,
    });
    setAddedAlert(true);
    setTimeout(() => setAddedAlert(false), 3000);
  };

  const handleAcquireNow = () => {
    setIsAcquireLoading(true);
    addItem({
      id: product.id,
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images?.[0] || '',
      category: product.category,
      stoneType: product.stoneType,
      quantity: 1,
    });
    setTimeout(() => {
      setIsAcquireLoading(false);
      navigate('/cart');
    }, 500);
  };

  return (
    <div className="bg-surface font-body-md text-on-surface select-none pb-0">
      <Navbar />

      <main className="pt-24 min-h-screen relative overflow-hidden">
        {/* Motif absolute background */}
        <div className="absolute inset-0 mandala-bg pointer-events-none opacity-[0.03]" />

        <div className="max-w-container-max mx-auto px-4 md:px-gutter py-12 relative z-10">
          
          {/* Breadcrumbs */}
          <nav className="mb-12 flex flex-wrap gap-2 font-label-caps text-[10px] md:text-label-caps text-text-muted uppercase tracking-wider select-text">
            <Link to="/shop" className="hover:text-primary transition-colors">
              Collection
            </Link>
            <span>/</span>
            <Link to={`/shop?category=${encodeURIComponent(product.category)}`} className="hover:text-primary transition-colors">
              {product.category}
            </Link>
            <span>/</span>
            <span className="text-on-surface font-semibold">{product.name}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            
            {/* Left: Image Gallery */}
            <div className="flex flex-col gap-6">
              <div className="aspect-square bg-surface-parchment overflow-hidden border border-border-sepia relative group">
                <img
                  src={activeImage || product.images?.[0]}
                  alt={product.name}
                  className="w-full h-full object-cover transition-all duration-700 ease-in-out group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 right-4">
                  <span className="bg-primary text-white font-label-caps text-[9px] px-3 py-1 uppercase tracking-widest font-semibold">
                    Certified Authenticity
                  </span>
                </div>
              </div>

              {/* Thumbnails row */}
              {product.images && product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                  {product.images.map((img: string, idx: number) => {
                    const isActive = activeImage === img;
                    return (
                      <button
                        key={idx}
                        onClick={() => setActiveImage(img)}
                        className={`aspect-square bg-surface-parchment border transition-all p-1 ${
                          isActive
                            ? 'border-primary ring-1 ring-primary'
                            : 'border-border-sepia/70 hover:border-primary'
                        }`}
                      >
                        <img
                          src={img}
                          alt={`${product.name} thumb ${idx}`}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Right: Info Panel */}
            <div className="flex flex-col select-text">
              <header className="mb-6">
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <span className="font-label-caps text-[10px] bg-primary/10 text-primary px-3 py-1 uppercase tracking-wider font-semibold">
                    {product.category || 'Atelier Exclusive'}
                  </span>
                  <span className="font-label-caps text-[10px] border border-border-sepia text-text-muted px-3 py-1 uppercase tracking-wider">
                    Origin: {product.origin || 'Jaipur India'}
                  </span>
                </div>
                <h1 className="font-headline-lg text-[32px] md:text-headline-lg text-primary mb-4 leading-tight">
                  {product.name}
                </h1>
                <p className="font-headline-md text-headline-md text-secondary font-semibold font-mono">
                  {formatPrice(product.price)}
                </p>
              </header>

              <p className="font-body-md text-on-surface-variant leading-relaxed mb-6 italic">
                {product.description}
              </p>

              {/* Specifications table */}
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2.5 border-b border-border-sepia/30">
                  <span className="font-label-caps text-[11px] text-text-muted uppercase tracking-wider">
                    Carat Weight
                  </span>
                  <span className="font-body-md text-on-surface font-semibold font-mono">
                    {product.caratWeight || '4.82'} ct
                  </span>
                </div>
                <div className="flex justify-between items-center py-2.5 border-b border-border-sepia/30">
                  <span className="font-label-caps text-[11px] text-text-muted uppercase tracking-wider">
                    Dimensions
                  </span>
                  <span className="font-body-md text-on-surface font-mono">
                    {product.dimensions || '9.2 x 8.4 x 6.1 mm'}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2.5 border-b border-border-sepia/30">
                  <span className="font-label-caps text-[11px] text-text-muted uppercase tracking-wider">
                    Clarity
                  </span>
                  <span className="font-body-md text-on-surface">
                    {product.clarity || 'Eye Clean (VVS1)'}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2.5 border-b border-border-sepia/30">
                  <span className="font-label-caps text-[11px] text-text-muted uppercase tracking-wider">
                    Treatments
                  </span>
                  <span className="font-body-md text-on-surface">
                    {product.treatments || 'Unheated & Natural'}
                  </span>
                </div>
              </div>

              {/* Double Rule divider */}
              <div className="h-1.5 border-t border-b border-border-sepia/30 w-full my-6" />

              {/* Quantity Selector Option */}
              <div className="flex items-center gap-6 mb-8 select-none">
                <span className="font-label-caps text-label-caps text-text-muted uppercase tracking-wider">
                  Quantity
                </span>
                <div className="flex items-center border border-border-sepia/50 bg-white">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:bg-surface-parchment/50"
                  >
                    <Minus className="h-4.5 w-4.5 text-primary" />
                  </button>
                  <span className="px-5 font-headline-sm text-headline-sm font-mono text-[16px] text-primary">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 hover:bg-surface-parchment/50"
                  >
                    <Plus className="h-4.5 w-4.5 text-primary" />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-4 mb-10 select-none">
                <button
                  onClick={handleAddToCart}
                  className="w-full bg-primary text-white font-label-caps text-label-caps py-5 uppercase tracking-[0.2em] hover:bg-primary-container transition-colors duration-300 shadow-sm font-semibold text-[11px]"
                >
                  {addedAlert ? "✓ Item added in cart" : "Add to Heritage Collection"}
                </button>
                <button
                  onClick={handleAcquireNow}
                  disabled={isAcquireLoading}
                  className="w-full border-2 border-primary text-primary font-label-caps text-label-caps py-5 uppercase tracking-[0.2em] hover:bg-surface-parchment transition-colors duration-300 font-semibold text-[11px] flex items-center justify-center gap-2 "
                >
                  {isAcquireLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  ) : (
                    "Acquire Now"
                  )}
                </button>
              </div>

              {/* Accordions */}
              <div className="border-t border-border-sepia">
                <div className="border-b border-border-sepia">
                  <button
                    onClick={() => setOpenFaq(openAccordion === 'cert' ? null : 'cert')}
                    className="w-full flex justify-between items-center py-5 uppercase text-left tracking-wider font-label-caps text-[11px] font-bold text-primary"
                  >
                    <span>Certified Authenticity</span>
                    <span>{openAccordion === 'cert' ? '−' : '+'}</span>
                  </button>
                  {openAccordion === 'cert' && (
                    <p className="pb-5 font-body-sm text-[13px] text-text-muted leading-relaxed transition-all">
                      Every Royal Gem is accompanied by an international laboratory certificate (GIA or IGI). We guarantee the ethical sourcing and historical provenance of our Loose Stones, adhering to the highest standards of the heritage jewelry industry.
                    </p>
                  )}
                </div>

                <div className="border-b border-border-sepia">
                  <button
                    onClick={() => setOpenFaq(openAccordion === 'ship' ? null : 'ship')}
                    className="w-full flex justify-between items-center py-5 uppercase text-left tracking-wider font-label-caps text-[11px] font-bold text-primary"
                  >
                    <span>Shipping & Handling</span>
                    <span>{openAccordion === 'ship' ? '−' : '+'}</span>
                  </button>
                  {openAccordion === 'ship' && (
                    <p className="pb-5 font-body-sm text-[13px] text-text-muted leading-relaxed transition-all">
                      We provide complimentary, fully insured global shipping via specialized high-value couriers. Each gem is delivered in a handcrafted mahogany presentation case with moisture-controlled packaging.
                    </p>
                  )}
                </div>

                <div className="border-b border-border-sepia">
                  <button
                    onClick={() => setOpenFaq(openAccordion === 'ret' ? null : 'ret')}
                    className="w-full flex justify-between items-center py-5 uppercase text-left tracking-wider font-label-caps text-[11px] font-bold text-primary"
                  >
                    <span>Returns & Valuations</span>
                    <span>{openAccordion === 'ret' ? '−' : '+'}</span>
                  </button>
                  {openAccordion === 'ret' && (
                    <p className="pb-5 font-body-sm text-[13px] text-text-muted leading-relaxed transition-all">
                      Due to the unique nature of heritage stones, we offer a 14-day inspection period. Returns are accepted provided the laboratory seal remains intact and the stone matches its digital fingerprint in our archives.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Related / You May Also Like */}
          {related.length > 0 && (
            <section className="mt-24 select-none">
              <div className="flex items-center justify-between mb-12">
                <h3 className="font-headline-md text-headline-md text-primary uppercase tracking-wide">
                  You May Also Like
                </h3>
                <div className="h-px flex-grow mx-8 bg-border-sepia hidden md:block" />
                <Link
                  to="/shop"
                  className="font-label-caps text-[11px] tracking-widest text-secondary uppercase hover:text-primary transition-colors font-semibold"
                >
                  View All Loose Stones
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-gutter">
                {related.slice(0, 4).map((rel) => (
                  <div
                    key={rel.id}
                    onClick={() => navigate(`/shop/${rel.id}`)}
                    className="group cursor-pointer"
                  >
                    <div className="aspect-square bg-surface-parchment overflow-hidden border border-border-sepia mb-4 relative">
                      <img
                        src={rel.images?.[0]}
                        alt={rel.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute bottom-0 left-0 w-full p-4 translate-y-full group-hover:translate-y-0 transition-transform bg-primary/95 flex items-center justify-center">
                        <span className="text-white font-label-caps text-[10px] uppercase tracking-widest font-semibold flex items-center gap-1">
                          Quick View <ArrowRight className="h-3 w-3" />
                        </span>
                      </div>
                    </div>
                    <h4 className="font-headline-sm text-[20px] text-on-surface mb-1 truncate line-clamp-1">
                      {rel.name}
                    </h4>
                    <p className="font-label-caps text-[10px] text-text-muted uppercase tracking-wider mb-2">
                      {rel.caratWeight ? `${rel.caratWeight} ct` : 'Certified'} • {rel.origin || 'Ceylon'} Origin
                    </p>
                    <p className="font-headline-sm text-[16px] text-primary font-semibold font-mono">
                      {formatPrice(rel.price)}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
