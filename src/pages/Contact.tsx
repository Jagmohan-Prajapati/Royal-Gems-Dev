import React, { useState } from 'react';
import Navbar from '../components/Navbar.tsx';
import Footer from '../components/Footer.tsx';
import { Mail, PhoneCall, MapPin, ChevronDown, CheckCircle } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '', email: '', subject: 'Bespoke Consultation', message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email) {
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: 'Bespoke Consultation', message: '' });
    }
  };

  const faqs = [
    {
      q: "How do I schedule a bespoke consultation?",
      a: "Consultations can be booked via our online inquiry form or by contacting our concierge directly. We offer both in-person appointments at our Jaipur flagship and virtual sessions for international clientele."
    },
    {
      q: "Are all your gemstones certified?",
      a: "Every gemstone at Royal Gems is accompanied by a certificate of authenticity from leading international laboratories such as GIA, IGI, or GRS, ensuring the highest standards of quality and ethical sourcing."
    },
    {
      q: "Do you offer international shipping?",
      a: "Yes, we provide secure, insured international shipping to most countries. Each shipment is carefully tracked and handled by our specialized logistics partners to ensure your piece arrives safely."
    },
    {
      q: "Can I redesign a family heirloom?",
      a: "Our heritage restoration service specializes in breathing new life into ancestral jewelry while preserving its emotional and historical essence. Contact us to discuss your specific piece with our master artisans."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-16 md:py-24">

        {/* Page Title */}
        <div className="text-center mb-16">
          <h1 className="font-display text-4xl md:text-5xl text-primary uppercase tracking-widest mb-4">
            Contact Our Atelier
          </h1>
          <p className="font-body text-on-surface-variant max-w-xl mx-auto text-[15px] leading-relaxed">
            Discover the art of bespoke adornment. Whether you seek a custom masterpiece or wish to inquire about our collections, our connoisseurs are here to assist you.
          </p>
        </div>

        {/* Contact Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-20">

          {/* Left Column: Form */}
          <div className="lg:col-span-7">
            <h2 className="font-display text-2xl text-on-surface uppercase tracking-widest mb-8">
              Inquiry Form
            </h2>

            {submitted ? (
              <div className="bg-surface-parchment border border-border-sepia p-10 text-center space-y-4">
                <CheckCircle className="h-10 w-10 text-success-forest mx-auto" />
                <h3 className="font-display text-xl text-on-surface uppercase tracking-wider">
                  Inquiry Transmitted
                </h3>
                <p className="font-body text-on-surface-variant text-[14px] leading-relaxed">
                  Your message has been safely logged in our Heritage Registry. A Royal Gems curator will contact your electronic mail within 24 hours.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-6 py-2 border border-primary text-primary font-label-caps text-[10px] tracking-widest hover:bg-surface-parchment"
                >
                  SEND ANOTHER
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block font-label-caps text-[10px] tracking-widest text-on-surface-variant uppercase mb-2">Name</label>
                  <input
                    type="text" name="name" required value={formData.name}
                    onChange={handleInputChange} placeholder="Your full name"
                    className="w-full bg-surface-bright border border-secondary/30 p-4 font-body text-[14px] text-on-surface focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
                  />
                </div>
                <div>
                  <label className="block font-label-caps text-[10px] tracking-widest text-on-surface-variant uppercase mb-2">Email</label>
                  <input
                    type="email" name="email" required value={formData.email}
                    onChange={handleInputChange} placeholder="email@example.com"
                    className="w-full bg-surface-bright border border-secondary/30 p-4 font-body text-[14px] text-on-surface focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
                  />
                </div>
                <div>
                  <label className="block font-label-caps text-[10px] tracking-widest text-on-surface-variant uppercase mb-2">Subject</label>
                  <select
                    name="subject" value={formData.subject} onChange={handleInputChange}
                    className="w-full bg-surface-bright border border-secondary/30 p-4 font-body text-[14px] text-on-surface focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all appearance-none"
                  >
                    <option value="Bespoke Consultation">Bespoke Consultation</option>
                    <option value="Collection Inquiry">Collection Inquiry</option>
                    <option value="Gemstone Certification">Gemstone Certification</option>
                    <option value="Press & Media">Press &amp; Media</option>
                  </select>
                </div>
                <div>
                  <label className="block font-label-caps text-[10px] tracking-widest text-on-surface-variant uppercase mb-2">Message</label>
                  <textarea
                    name="message" required value={formData.message}
                    onChange={handleInputChange} placeholder="How may we assist you?" rows={6}
                    className="w-full bg-surface-bright border border-secondary/30 p-4 font-body text-[14px] text-on-surface focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full md:w-auto px-12 py-4 bg-primary text-white font-label-caps text-[11px] uppercase tracking-widest border border-secondary hover:bg-primary/90 transition-all duration-300 active:scale-95"
                >
                  Send Message
                </button>
              </form>
            )}
          </div>

          {/* Right Column: Concierge Info */}
          <div className="lg:col-span-5 space-y-6">
            {/* Dark Burgundy Card — ALL text must be light */}
            <div className="bg-dark-burgundy p-8 md:p-10 shadow-xl">
              <h2 className="font-display text-xl text-white uppercase tracking-widest mb-1">
                Our Concierge
              </h2>
              <p className="font-label-caps text-[11px] text-white/60 uppercase tracking-widest mb-6">
                Available Monday – Saturday
              </p>
              <div className="h-px bg-white/10 w-full my-6" />

              <div className="space-y-8 select-text">
                {/* Email */}
                <div className="flex items-start gap-4">
                  <Mail className="h-6 w-6 text-secondary flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-label-caps text-[10px] uppercase text-white/60 tracking-wider mb-1 font-bold">
                      Electronic Mail
                    </h4>
                    <p className="font-body text-[15px] text-white hover:underline">
                      concierge@royalgems.com
                    </p>
                  </div>
                </div>
                {/* Phone */}
                <div className="flex items-start gap-4">
                  <PhoneCall className="h-6 w-6 text-secondary flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-label-caps text-[10px] uppercase text-white/60 tracking-wider mb-1 font-bold">
                      Telephone
                    </h4>
                    <p className="font-body text-[15px] text-white hover:underline">
                      +91 141 405 2000
                    </p>
                  </div>
                </div>
                {/* Address */}
                <div className="flex items-start gap-4">
                  <MapPin className="h-6 w-6 text-secondary flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-label-caps text-[10px] uppercase text-white/60 tracking-wider mb-1 font-bold">
                      Jaipur Flagship
                    </h4>
                    <p className="font-body text-[15px] text-white leading-relaxed">
                      The Johri Palace, Johari Bazaar,<br />Jaipur, Rajasthan 302003
                    </p>
                  </div>
                </div>
              </div>

              <div className="h-px bg-white/10 w-full my-6" />
              <div className="mt-4">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuD864FckN7QufAim56Q9B-6A2pAUrmjaDwWmi8eAb17IUzrb5tONNtqS06FC0mi5B4yS2Ehe6VnLe4HCN5nLSKLTyzQZ6CRRFioZTRJo9flcT6ObdOJdKmTBkR-EUqngFxvFiRMzMd7tFVmR-ON3p1Nw4oykwTtkpg9EvND-cA9qgsmnx5eq-g28FIl3y2SnMtldT23Jq_muk1nGwiAgRBESZ-8fqUHdXZ2ZWFw0crYNz1FuvrHIqu4T_kf-C-4SoIONc-5OwidfnLE"
                  alt="Flagship Exterior"
                  className="w-full h-48 object-cover border border-white/10"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

            {/* Map */}
            <div className="bg-surface-parchment p-6 border border-border-sepia">
              <div className="aspect-video w-full relative overflow-hidden">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCdxNb7C38WN13HmEZecBb13p8f5ZGq0AQrTzzP86Mp3qO1qN7t1Vzntb8h9lfFN7iKRSEefBYORMPlqepP7FCPnTgT4YN5vBpvbnXyRtN94a9WULpVOKX9X-sL_x6qxInHwQCDzOnkBM5okLWtgQrhCuq-mDw3eyQv7L66m-OZmjuiUzNfyQ1BgoE9WvQMnPkCNQFaOJBMq7jGyUC5cLvOogsRd6YGnVkMcAJLtPjkQKsXeckAnWiFDXoP4_1A4rsODOfXXJnkw1VZ"
                  alt="Jaipur district Map"
                  className="w-full h-full object-cover grayscale contrast-125 opacity-70"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <section className="max-w-4xl mx-auto border-t-2 border-double border-secondary/30 pt-16 select-text">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl text-primary uppercase tracking-widest">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = activeFaq === index;
              return (
                <div key={index} className="bg-surface-parchment border border-border-sepia">
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : index)}
                    className="flex justify-between items-center p-6 w-full text-left font-display text-[18px] text-on-surface"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`h-5 w-5 text-secondary flex-shrink-0 ml-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-6 font-body text-[14px] text-on-surface-variant leading-relaxed">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}