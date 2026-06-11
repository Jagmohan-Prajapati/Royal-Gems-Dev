import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Loader2 } from 'lucide-react';
import { formatPrice } from '../lib/utils.ts';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 80);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }
    const delayDebounce = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/products?search=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data.products || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-dark-burgundy/80 backdrop-blur-sm flex justify-center start-0 p-4 md:p-12 transition-all duration-300">
      <div className="bg-surface-parchment w-full max-w-2xl h-fit border border-border-sepia p-6 md:p-8 flex flex-col relative mt-20 animate-in fade-in zoom-in duration-300 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-primary hover:text-primary-container transition-colors"
        >
          <X className="h-6 w-6" />
        </button>

        <h3 className="font-headline-sm text-headline-sm text-primary mb-6 uppercase tracking-widest border-b border-border-sepia/30 pb-2">
          Search the Heritage Atelier
        </h3>

        <div className="relative flex items-center mb-6">
          <input
            ref={inputRef}
            type="text"
            placeholder="Search loose stones, collections..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-white border border-secondary/30 pl-12 pr-4 py-4 font-body-md text-body-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-text-muted"
          />
          <Search className="absolute left-4 h-5 w-5 text-text-muted" />
          {isLoading && <Loader2 className="absolute right-4 h-5 w-5 animate-spin text-primary" />}
        </div>

        {results.length > 0 ? (
          <div className="max-h-[300px] overflow-y-auto divide-y divide-border-sepia/20 pr-2">
            {results.map((product) => (
              <div
                key={product.id}
                onClick={() => {
                  navigate(`/shop/${product.id}`);
                  onClose();
                }}
                className="flex items-center gap-4 py-4 cursor-pointer hover:bg-white/40 transition-colors group"
              >
                <div className="w-16 h-16 bg-white border border-border-sepia/20 flex-shrink-0">
                  <img
                    src={product.images?.[0]}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex-grow">
                  <h4 className="font-body-md font-medium text-on-surface group-hover:text-primary transition-colors">
                    {product.name}
                  </h4>
                  <p className="font-label-caps text-[10px] text-text-muted uppercase">
                    {product.stoneType || product.category}
                  </p>
                </div>
                <p className="font-headline-sm text-headline-sm text-secondary">
                  {formatPrice(product.price)}
                </p>
              </div>
            ))}
          </div>
        ) : query && !isLoading ? (
          <p className="text-center font-body-sm text-text-muted italic py-6">
            No rare treasures match your search term
          </p>
        ) : (
          <div className="py-4">
            <p className="font-label-caps text-[11px] text-text-muted uppercase tracking-widest mb-3">
              SUGGESTED FILTERS
            </p>
            <div className="flex flex-wrap gap-2">
              {['Ruby', 'Sapphire', 'Emerald', 'Diamond', 'Bespoke'].map((category) => (
                <button
                  key={category}
                  onClick={() => setQuery(category)}
                  className="px-3 py-1.5 border border-border-sepia/30 hover:border-primary text-text-muted hover:text-primary font-label-caps text-[10px] bg-white transition-colors"
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
