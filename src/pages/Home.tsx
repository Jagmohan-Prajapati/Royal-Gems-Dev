import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar.tsx';
import Footer from '../components/Footer.tsx';
import { ShieldCheck, Palette, FileSpreadsheet, Loader2 } from 'lucide-react';
import { formatPrice } from '../lib/utils.ts';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeatured = async () => {
      setIsLoading(true);
      try {
        const res = await fetch('/api/products?featured=true');
        if (res.ok) {
          const data = await res.json();
          setFeaturedProducts(data.products || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  // Static product list matching the HTML template if API returns empty list
  const fallbackFeatured = [
    {
      id: "mughal-sun-ruby",
      name: "Mughal Sun Ruby",
      description: "4.2 CARATS | JAIPUR CUT",
      price: 4250000,
      images: ["https://lh3.googleusercontent.com/aida-public/AB6AXuBbJXcOV0miWxDNlk6CPmsLvYZ_7kNwONo-SbmHkjr-4oGNwiw5SxYfG-83VLejGJGM1QmyrF2TZKAtgvNEzBW9SZljFLJ4SyxBcl0nGTvRja3UC5awqwUjdDGSAsI08SLXRT3biQPIwmg-IeA5m4OdwLlpA6yUZpGI4QNZ4VI2S2Unvchf86CIqAkmTQzZZkQngC4J-m55FPJyMSQNct6dNJGVDafXRtogqLOFrqjROAod-x3lAykjFLkVPenUZeEOTFeW5XYeTQFy"],
      treatments: "Unheated & Natural",
      origin: "Burmese",
      badge: "NEW ARRIVAL",
      caratWeight: "4.2"
    },
    {
      id: "emerald-verdant",
      name: "Emerald Verdant",
      description: "6.8 CARATS | COLOMBIAN",
      price: 1950000,
      images: ["https://lh3.googleusercontent.com/aida-public/AB6AXuDTjl83nrHq1BQpFqNzPyJm1kvodZ_OQIlBSYq-0IAx7vPTGyMbMUI9QYYFBgu9kvtwQNYpmoOxIpiz701ofJPNff7uhJmkcYrpvxxMd3QqV4QnEHgaPuC06Kgg9RbsUHlvPFnYNMBR8E4q2ZYhXVn1grRF0ffrg3f4pEiqSQK4BdpSTqaUumcchQc3HV4mi4SdDB-L_8N48Kx0cnEadxq0NH_yY8FU2J5oa_G7g-VX-81GxXoKq6bnhTT1-BVs3UlDJpBK_358WlCY"],
      treatments: "Minor Saturated Oil",
      origin: "Zambian",
      badge: "CERTIFIED",
      caratWeight: "6.8"
    },
    {
      id: "kashmir-sky-blue",
      name: "Kashmir Sky Blue",
      description: "3.5 CARATS | PAIR",
      price: 2800000,
      images: ["https://lh3.googleusercontent.com/aida-public/AB6AXuCoO49phvgFr9wQc-DtFzqGSkcsye7DZ5LuRhY-V0_G7qfZAY2d6DKSzNSf7xPo3YmrBJKZBi1soMjQsteYlbXEbUv2wDABhGnoIh-rtkIYhwLLT3MYydnFeMcnFIAAdx94BiNsKJDYIVzbQyLCDQZwS3YCyOH7gZOG3AH5v7_UluXDXyLvGeRTcKT858bbttr3sU7COivwS6fBaen_TelkVr_TbGkvhtoQQLR1gK43YfzK1dcbiSl7teDJrEW3po_1x5FLXj6r_vCj"],
      treatments: "None",
      origin: "Kashi",
      badge: "PAIR ACQUISITION",
      caratWeight: "3.5"
    },
    {
      id: "imperial-dewdrop",
      name: "Imperial Dewdrop",
      description: "5.0 CARATS | RAW CUT",
      price: 6400000,
      images: ["https://lh3.googleusercontent.com/aida-public/AB6AXuBBKYsDQiM4NUXCQVta-o0s9m8LOkSRE8k7nGs5djYwZpltRQ9Ev0qXMAJtPpUe38mPlMZZAyNVXig3VEX8cBhfgT9iwfhM9zu_h7iAYmxc9Cap7Bs0D_bWnOQ0kCQv6o5Zo4onxVrOw5eRHX-7jvKz0wekFT2F16nyA123oevdTPSgNohkTKM0Dr5HxxLz8xlad3NuVImbzVASNdfkfH977wz5vZOAp_LwBP7Y4cipaX2RS2lHSHJbWIbgScziWYL-RA0ZyEFbTckt"],
      treatments: "Natural",
      origin: "South Africa",
      badge: "RARE FIND",
      caratWeight: "5.0"
    }
  ];

  const productsToDisplay = featuredProducts.length > 0 ? featuredProducts : fallbackFeatured;

  const categories = [
    {
      name: "Ruby",
      query: "Pigeon Blood Ruby",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBF7EdvDeUMYrldP_B82jf3IZXmiCy7O9twXuq6Xn_Lget9QOTKxiUKVkk8LL7NOpsYqA8C71Dt-cRHRx2Bjvess_z_k3IFxYbyMChazPvc5p1RY3J-1N64Wq8L8jjq7SGQ1EiLIySwbfoXR6a5cRNXlWC-6jDryUGfBubGss5S_H6KjVrbMIzNUT1iXWZa7aEgQhvHmifJ4-Q5_nPSmbdKrFoQLC2OhoJ57EMEzZ3msRfOziC3a3GdacIzGgeOSn4mrNM8DFfJmgVe"
    },
    {
      name: "Emerald",
      query: "Zambian Emerald",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuD5NRK-DfTOIXt27ZjBZweWHSGHbHIWnPFiBFcd_QVV_seRWHZzar3Qj9Vh5hZv59wVOb6xjG-_o0-PoYp3-6567V2xb9YPjgNi8jGjn45HCmqwM7F3dMO4aRroEo90LkO-uOUmsA_GheYVu8KYpvdiEhQRZU48qOTH2GDdcuAcfmf52Wmd_ypo-hrvaRh0HHiVpLZBL6_e6R716pJz7aHKGxpNUInn67mc-7NJonLGfKr9W7exodhHb04E9a4NEthRykc731r7yrff"
    },
    {
      name: "Sapphire",
      query: "Royal Blue Sapphire",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCIMhu2S5BlvSKTiVcG539SCo9qN2bFtPckwDhRlleNvnqBHmB2UEuZ9xq-KsIgygXYGGGv69ejfjZVmhzJ0VEK4zDMRNVMfNglLGigJtcGRI5MGTy5J-28iv9QY_j500DU3fTtvwjPNEp79_7GcdeOJikSV-MjRu2TpJOi5EtvHsXgK7Qpn7gneI4LrANH66lnTTRak-vIUQRLv-pUjoPqLLDGN7-DOmIqYGmRbNOsEeCfFf-Q1ahUSO4SNcaV2KN0s6RMaX66CuZ1"
    },
    {
      name: "Diamond",
      query: "Fancy Yellow Diamond",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDAybp1-3X9RIccxQRZQFlFh52P4x_8tfKFMJOSj_otglvvmEAnw0n7bzqw5oApAAj8xhMXGMXeKqk7ohQ9AebuIOIvpwugsb_Upye8aToOjm4qO09eYQS6MVzf_8lu0ner0z5IEaq906a9AdSxkRcWBbxg16MnPnuAGXGZq9I1dYQ4gRYEq5PfALA7NzO3Zjw4tVOpsqaTXFRnOPUSGa-RWSxodacdYuLCO-rFkQeciZTHf5la8qdIrd39XuK8q-6zhns8mGwgVf5O"
    },
    {
      name: "Bespoke",
      query: "contact",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDf91mba0ZFqYl0frrTKlBreo6zjyDfafI11gls03TjbekT5W5XNg4U4FRKNViwG13tVrk78Goi9rtwoduVL1TfarRptCIpCuqB_XWddVgE3_iuZNCTO6tt5hJ3dIgCHCwt77w4mq_38iXx59fWUsJZxqMmIi5AD7a-_4axApOMYONDXtC1aQqrOZv0w7r13er21YQ_jkMCD3Lkh2MxuLFx8u5zzIt3JYbVYpNEP44gjBBiviToG17GF4W8WnOIYkk9U5c0MUYz-EIa"
    }
  ];

  return (
    <div className="bg-background text-on-surface font-body-md select-none pb-0">
      <Navbar />

      <main className="pt-20">
        {/* Hero Section */}
        <section className="h-[921px] grid grid-cols-1 md:grid-cols-2 relative overflow-hidden bg-surface-dim">
          <div className="absolute inset-0 mandala-bg z-0 pointer-events-none opacity-[0.04] bg-[radial-gradient(circle_at_center,rgba(0,0,0,0)_0%,rgba(0,0,0,0.15)_100%)]" />
          
          <div className="flex flex-col justify-center px-10 md:px-20 z-10 select-text">
            <span className="font-label-caps text-label-caps text-secondary mb-4 tracking-[0.3em] font-semibold text-[11px]">
              ESTABLISHED 1924
            </span>
            <h1 className="font-display-hero text-4xl md:text-display-hero text-primary max-w-lg mb-8 leading-[1.05]">
              Crafted from the Earth. <br />Worn by Royalty.
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-md mb-10 italic">
              For three generations, we have sourced the rarest of geological treasures, hand-carved to perfection by master artisans of the Pink City.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/shop"
                className="bg-primary text-on-primary border border-secondary px-8 py-4 font-label-caps text-label-caps hover:bg-primary-container transition-all text-center tracking-widest text-[11px]"
              >
                Explore Collection
              </Link>
              <Link
                to="/about"
                className="border border-primary text-primary px-8 py-4 font-label-caps text-label-caps hover:bg-surface-parchment transition-all text-center tracking-widest text-[11px]"
              >
                Our Legacy
              </Link>
            </div>
          </div>

          <div className="relative h-full hidden md:block">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDURksa5X-pi_vHmP9_cVEElKYc3Da94lnDoTxpOJI_xhEImhQQNGVs3CLct8xGcfOEp_1LmSylABzdhbj1l7jsSfdLiFToXJSq5VRgAtYviCNw9024E8nAf5cCuviFz2YIn_h35d7ixPfL_BQb3kQwHTqF-PWWZ_1MQpHy5yJEZibO6RWkK7RcBCXSQKRsLmkSFMUYeh_4y0592_TXcDiLKMoGSE4C2PW8zfNNbWzJTdPDaugCG3KeA_VO91SD_Z2f5Nk5gbUeNOVJ"
              alt="Close up of rubies"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute bottom-12 left-12 bg-surface/80 backdrop-blur-sm p-6 border border-border-sepia max-w-xs">
              <span className="font-label-caps text-[9px] block mb-2 opacity-60 tracking-wider">
                FEATURED GEMSTONE
              </span>
              <span className="font-headline-sm text-[20px] text-primary">
                Burmese Pigeon Blood Ruby
              </span>
            </div>
          </div>
        </section>

        {/* Category Strip */}
        <section className="py-[32px] bg-surface border-y border-border-sepia overflow-x-auto whitespace-nowrap">
          <div className="max-w-container-max mx-auto px-6 flex justify-center gap-12 items-center">
            {categories.map((cat) => (
              <div
                key={cat.name}
                onClick={() => {
                  if (cat.name === 'Bespoke') navigate('/contact');
                  else navigate(`/shop?stoneType=${encodeURIComponent(cat.query)}`);
                }}
                className="group cursor-pointer text-center inline-block"
              >
                <div className="w-20 h-28 rounded-full overflow-hidden mb-3 border border-border-sepia group-hover:border-primary transition-colors">
                  <img
                    src={cat.img}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <span className="font-label-caps text-[11px] font-semibold tracking-widest text-on-surface-variant group-hover:text-primary transition-colors block uppercase">
                  {cat.name}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Signature Stones Section */}
        <section className="py-20 px-4 md:px-gutter max-w-container-max mx-auto">
          <div className="text-center mb-16 select-text">
            <span className="font-label-caps text-label-caps text-secondary uppercase tracking-[0.2em] mb-4 block font-semibold text-[11px]">
              The Selection
            </span>
            <h2 className="font-headline-lg text-headline-lg text-primary">
              Signature Stones
            </h2>
            {/* Double Rule divider */}
            <div className="h-1.5 border-t border-b border-border-sepia/30 w-24 mx-auto my-4" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-gutter">
            {productsToDisplay.slice(0, 4).map((product, idx) => {
              // Badge selection
              const tag = product.badge || (idx === 0 ? "NEW ARRIVAL" : idx === 1 ? "CERTIFIED" : idx === 3 ? "RARE FIND" : undefined);
              return (
                <div
                  key={product.id || idx}
                  onClick={() => navigate(`/shop/${product.id}`)}
                  className="bg-surface-parchment p-4 border border-border-sepia group transition-all duration-300 hover:shadow-xl cursor-pointer"
                >
                  <div className="relative overflow-hidden mb-6 aspect-square bg-white border border-border-sepia/10">
                    <img
                      src={product.images?.[0]}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    {tag && (
                      <div className="absolute top-4 left-4 bg-primary text-on-primary px-3 py-1 font-label-caps text-[9px] tracking-widest uppercase">
                        {tag}
                      </div>
                    )}
                    <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="text-center px-2">
                    <h3 className="font-headline-sm text-[20px] text-primary mb-2 line-clamp-1 truncate">
                      {product.name}
                    </h3>
                    <p className="font-label-caps text-[10px] text-text-muted mb-4 uppercase tracking-wider">
                      {product.caratWeight ? `${product.caratWeight} CARATS` : 'CERTIFIED'} | {product.origin || 'JAIPUR CUT'}
                    </p>
                    <span className="inline-block font-label-caps text-[11px] text-primary border-b border-primary/30 hover:border-primary transition-all pb-1 tracking-widest font-semibold">
                      VIEW DETAILS
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Heritage Sourcing Story Banner */}
        <section className="relative h-[600px] w-full flex items-center overflow-hidden">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDk1McXjT1F-2r_jJUIz9oAj712TVNn6iR0Fo3xrk46aOjVfyleZQdcdU4GMNxwvliG41LUXaASnXkMeDcaB0m2-bMqQ24W221UFGGpho30erY57jmObHHEqDp2FwS6ypQennRHMg6ARga53YQdxM2YqKFPnobvifCxwpJs5EI16wG7tKzWMFmKt7A6c-zGB8fJ84mz8-bdvKhnMk2NMHzRMhYPT7Utk6YD83WDoaKN47b5vW3P8EKDxFwxAGrrEWfAB8ZKU8BrgiNK"
            alt="Jaipur Sourcing Palace Heritage"
            className="absolute inset-0 w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-dark-burgundy/40" />
          <div className="max-w-container-max mx-auto px-6 relative z-10 grid grid-cols-1 md:grid-cols-2">
            <div className="bg-surface-parchment/90 backdrop-blur-md p-10 border-l-4 border-primary">
              <span className="font-label-caps text-[11px] text-primary tracking-widest mb-4 block font-bold uppercase">
                Sourcing Story
              </span>
              <h2 className="font-headline-lg text-[32px] md:text-headline-lg text-primary mb-6">
                From the Mines of Burma to the Artisans of Jaipur
              </h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant mb-8 leading-relaxed">
                Every stone at Royal Gems begins its journey in the ancient mines of Burma and the heart of Jaipur. Our gem-hunters traverse continents to select rough stones of extraordinary character, which are then entrusted to families of artisans who have perfected the art of cutting for centuries.
              </p>
              <Link
                to="/about"
                className="bg-primary text-on-primary px-8 py-4 font-label-caps text-[11px] tracking-widest hover:bg-primary-container transition-all uppercase inline-block"
              >
                Discover Our Heritage
              </Link>
            </div>
          </div>
        </section>

        {/* Why Royal Gems pillars */}
        <section className="py-20 px-4 md:px-gutter max-w-container-max mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center items-start">
            <div className="flex flex-col items-center">
              <ShieldCheck className="h-12 w-12 text-secondary mb-6" />
              <h4 className="font-headline-sm text-headline-sm text-primary mb-4">Certified Sourcing</h4>
              <p className="font-body-md text-on-surface-variant px-4 leading-relaxed">
                Every gemstone is accompanied by an international laboratory certificate ensuring 100% ethical sourcing and authenticity.
              </p>
            </div>
            <div className="flex flex-col items-center border-y md:border-y-0 md:border-x border-border-sepia py-8 md:py-0 h-full">
              <Palette className="h-12 w-12 text-secondary mb-6" />
              <h4 className="font-headline-sm text-headline-sm text-primary mb-4">Artisanal Craft</h4>
              <p className="font-body-md text-on-surface-variant px-4 leading-relaxed">
                Hand-carved using ancestral techniques that maximize light play while preserving the stone's organic spirit.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <FileSpreadsheet className="h-12 w-12 text-secondary mb-6" />
              <h4 className="font-headline-sm text-headline-sm text-primary mb-4">Royal Lineage</h4>
              <p className="font-body-md text-on-surface-variant px-4 leading-relaxed">
                Supplying heritage jewelry to modern-day royalty and discerning collectors for nearly a century of excellence.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
