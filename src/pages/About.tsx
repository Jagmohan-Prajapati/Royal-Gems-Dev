import React from 'react';
import Navbar from '../components/Navbar.tsx';
import Footer from '../components/Footer.tsx';
import { Award, Compass, Eye } from 'lucide-react';

export default function About() {
  return (
    <div className="bg-surface font-body-md text-on-surface select-none pb-0">
      <Navbar />

      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative h-[819px] w-full overflow-hidden flex items-center justify-center">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDrG0iB49oDI5Uk5au1zc1IPLezu8wXoojRWDTSmOU3rJcxGovxe5-YDA40ciX-nDir048NK_Bwt9uwf870ZH8gOAEky04x0dvWAMnKDSYHIKbB2m2dfjPEP-byhiYA18Wenem7SzL9qY4k_i3wgyvZqPUB8CF_YV3YDKOfpXqLCnAQdulkoTe7bYkBOt3lW1a92v7p5pN5A6E6Qih-TK8pvj0SXok7uzz7pwuGgVMBLcouP7UcfNwFjVYnbSDoSyCnBVFYhO9V5KP9"
            alt="Gemstone Workshop"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-[12s] scale-102 hover:scale-105"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-dark-burgundy/40" />
          <div className="relative z-10 text-center text-surface-bright max-w-4xl px-4 select-text">
            <h1 className="font-display-hero text-[44px] md:text-display-hero mb-6">Our Heritage</h1>
            <div className="w-24 h-1 bg-secondary-fixed mx-auto mb-8" />
            <p className="font-body-lg text-body-lg max-w-2xl mx-auto opacity-90 italic">
              A century of unrivaled craftsmanship, preserving the luminous spirit of the royal courts for the modern connoisseur.
            </p>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-20 px-gutter max-w-container-max mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="border-l-4 border-primary pl-8">
              <span className="font-label-caps text-primary block mb-4 uppercase tracking-[0.2em] font-semibold text-[11px]">
                The Legacy
              </span>
              <blockquote className="font-headline-lg text-headline-lg italic leading-tight text-primary">
                "True luxury is a dialogue between the earth's raw beauty and the artisan's patient soul."
              </blockquote>
              <p className="mt-6 font-body-md text-text-muted">— Maharaja Ranjit Singh II, Founder</p>
            </div>
            <div className="space-y-6">
              <h2 className="font-headline-md text-headline-md text-on-surface">A Century of Splendor</h2>
              <p className="font-body-md text-on-surface-variant leading-relaxed">
                Founded in 1924 within the golden city of Jodhpur, Royal Gems began as a private atelier for the Rajput nobility. Our founders were not merely jewelers, but custodians of history, tasked with preserving the intricate 'Kundan' and 'Meenakari' techniques that have defined Indian regal adornment for millennia.
              </p>
              <p className="font-body-md text-on-surface-variant leading-relaxed">
                Today, we blend this profound heritage with contemporary architectural precision. Every gemstone is hand-selected from ethical sources, then subjected to the meticulous gaze of our master cutters who transform nature's whispers into timeless masterpieces.
              </p>
            </div>
          </div>
        </section>

        {/* Heritage Timeline */}
        <section className="py-20 bg-surface-parchment overflow-hidden">
          <div className="max-w-container-max mx-auto px-gutter">
            <div className="text-center mb-16">
              <h2 className="font-headline-lg text-headline-lg text-primary">Milestones of Excellence</h2>
              <div className="h-1 w-20 border-t border-b border-secondary/30 mx-auto my-3" />
            </div>
            <div className="relative">
              {/* Connector Line */}
              <div className="absolute top-1/2 left-0 w-full h-[2px] bg-secondary/30 -translate-y-1/2 hidden md:block" />
              <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter relative z-10">
                {/* Timeline Item 1 */}
                <div className="group">
                  <div className="bg-surface p-8 border border-border-sepia shadow-sm relative transition-all duration-300 hover:-translate-y-2">
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-primary rounded-full border-4 border-surface-parchment" />
                    <span className="font-headline-sm text-primary block mb-2">1924</span>
                    <h3 className="font-label-caps text-on-surface mb-2 font-semibold">The Foundation</h3>
                    <p className="font-body-sm text-on-surface-variant text-[13px] leading-relaxed">
                      Opening of the first Royal Gems atelier in Jodhpur, catering exclusively to royal commissions.
                    </p>
                  </div>
                </div>
                {/* Timeline Item 2 */}
                <div className="group mt-12 md:mt-0">
                  <div className="bg-surface p-8 border border-border-sepia shadow-sm relative transition-all duration-300 hover:-translate-y-2">
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-primary rounded-full border-4 border-surface-parchment" />
                    <span className="font-headline-sm text-primary block mb-2">1958</span>
                    <h3 className="font-label-caps text-on-surface mb-2 font-semibold">Global Recognition</h3>
                    <p className="font-body-sm text-on-surface-variant text-[13px] leading-relaxed">
                      The house is awarded the "Gem of the East" title at the Paris Exhibition of Fine Jewelry.
                    </p>
                  </div>
                </div>
                {/* Timeline Item 3 */}
                <div className="group mt-12 md:mt-0">
                  <div className="bg-surface p-8 border border-border-sepia shadow-sm relative transition-all duration-300 hover:-translate-y-2">
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-primary rounded-full border-4 border-surface-parchment" />
                    <span className="font-headline-sm text-primary block mb-2">1992</span>
                    <h3 className="font-label-caps text-on-surface mb-2 font-semibold">Bespoke Evolution</h3>
                    <p className="font-body-sm text-on-surface-variant text-[13px] leading-relaxed">
                      Launching the Digital Design Vault, marrying 3D precision with ancestral hand-sketching.
                    </p>
                  </div>
                </div>
                {/* Timeline Item 4 */}
                <div className="group mt-12 md:mt-0">
                  <div className="bg-surface p-8 border border-border-sepia shadow-sm relative transition-all duration-300 hover:-translate-y-2">
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-primary rounded-full border-4 border-surface-parchment" />
                    <span className="font-headline-sm text-primary block mb-2">2024</span>
                    <h3 className="font-label-caps text-on-surface mb-2 font-semibold">Centenary</h3>
                    <p className="font-body-sm text-on-surface-variant text-[13px] leading-relaxed">
                      Celebrating 100 years of splendor with the launch of the 'Sun & Stars' High Jewelry collection.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 px-gutter max-w-container-max mx-auto">
          <div className="text-center mb-16">
            <span className="font-label-caps text-primary block mb-2 font-semibold uppercase tracking-widest text-[11px]">
              Our Pillars
            </span>
            <h2 className="font-headline-lg text-headline-lg text-on-surface">Foundational Values</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Value 1 */}
            <div className="text-center px-6 flex flex-col items-center">
              <div className="mb-8 inline-block p-6 bg-surface-parchment rounded-full text-primary border border-border-sepia/20">
                <Compass className="h-10 w-10 text-primary" />
              </div>
              <h3 className="font-headline-sm text-headline-sm text-primary mb-4">Master Craftsmanship</h3>
              <p className="font-body-md text-on-surface-variant">
                Each piece undergoes over 300 hours of meticulous hand-setting by artisans whose families have served Royal Gems for generations.
              </p>
            </div>
            {/* Value 2 */}
            <div className="text-center px-6 flex flex-col items-center">
              <div className="mb-8 inline-block p-6 bg-surface-parchment rounded-full text-primary border border-border-sepia/20">
                <Award className="h-10 w-10 text-primary" />
              </div>
              <h3 className="font-headline-sm text-headline-sm text-primary mb-4">Uncompromising Trust</h3>
              <p className="font-body-md text-on-surface-variant">
                Every gemstone is conflict-free and carries a double certification from GIA and our own Royal Heritage Council.
              </p>
            </div>
            {/* Value 3 */}
            <div className="text-center px-6 flex flex-col items-center">
              <div className="mb-8 inline-block p-6 bg-surface-parchment rounded-full text-primary border border-border-sepia/20">
                <Eye className="h-10 w-10 text-primary" />
              </div>
              <h3 className="font-headline-sm text-headline-sm text-primary mb-4">Conscious Luxury</h3>
              <p className="font-body-md text-on-surface-variant">
                Our workshops are powered by renewable energy, and we reinvest in the artisan communities that make our house possible.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
