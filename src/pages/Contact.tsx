import React, { useState } from 'react';
import Navbar from '../components/Navbar.tsx';
import Footer from '../components/Footer.tsx';
import { Mail, MapPin, ChevronDown, CheckCircle } from 'lucide-react';

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
      a: "Consultations can be booked via our online inquiry form or by writing directly to royalgemskolkata@gmail.com. We offer in-person appointments at our Kolkata studio and virtual sessions for outstation clientele."
    },
    {
      q: "Are all your gemstones certified?",
      a: "Every gemstone at Royal Gems is accompanied by a certificate of authenticity from leading international laboratories such as GIA, IGI, or GRS, ensuring the highest standards of quality and ethical sourcing."
    },
    {
      q: "Do you offer international shipping?",
      a: "Yes, we provide secure, insured shipping across India and internationally. Each shipment is carefully tracked and handled by our specialised logistics partners to ensure your piece arrives safely."
    },
    {
      q: "Can I redesign a family heirloom?",
      a: "Our heritage restoration service specialises in breathing new life into ancestral jewellery while preserving its emotional and historical essence. Contact us to discuss your specific piece with our master artisans."
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
            Whether you seek a custom masterpiece or wish to inquire about our collection, write to us and our curators will respond within 24 hours.
          </p>
        </div>

        {/* Contact Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-20">

          {/* Left: Form */}
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
                  Your message has been received. A Royal Gems curator will respond to your email within 24 hours.
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
                  <input type="text" name="name" required value={formData.name}
                    onChange={handleInputChange} placeholder="Your full name"
                    className="w-full bg-surface-bright border border-secondary/30 p-4 font-body text-[14px] text-on-surface focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all" />
                </div>
                <div>
                  <label className="block font-label-caps text-[10px] tracking-widest text-on-surface-variant uppercase mb-2">Email</label>
                  <input type="email" name="email" required value={formData.email}
                    onChange={handleInputChange} placeholder="email@example.com"
                    className="w-full bg-surface-bright border border-secondary/30 p-4 font-body text-[14px] text-on-surface focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all" />
                </div>
                <div>
                  <label className="block font-label-caps text-[10px] tracking-widest text-on-surface-variant uppercase mb-2">Subject</label>
                  <select name="subject" value={formData.subject} onChange={handleInputChange}
                    className="w-full bg-surface-bright border border-secondary/30 p-4 font-body text-[14px] text-on-surface focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all appearance-none">
                    <option value="Bespoke Consultation">Bespoke Consultation</option>
                    <option value="Collection Inquiry">Collection Inquiry</option>
                    <option value="Gemstone Certification">Gemstone Certification</option>
                    <option value="Press & Media">Press &amp; Media</option>
                  </select>
                </div>
                <div>
                  <label className="block font-label-caps text-[10px] tracking-widest text-on-surface-variant uppercase mb-2">Message</label>
                  <textarea name="message" required value={formData.message}
                    onChange={handleInputChange} placeholder="How may we assist you?" rows={6}
                    className="w-full bg-surface-bright border border-secondary/30 p-4 font-body text-[14px] text-on-surface focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all resize-none" />
                </div>
                <button type="submit"
                  className="w-full md:w-auto px-12 py-4 bg-primary text-white font-label-caps text-[11px] uppercase tracking-widest border border-secondary hover:bg-primary/90 transition-all duration-300 active:scale-95">
                  Send Message
                </button>
              </form>
            )}
          </div>

          {/* Right: Concierge Info */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-dark-burgundy p-8 md:p-10 shadow-xl">
              <h2 className="font-display text-xl text-white uppercase tracking-widest mb-1">
                Our Studio
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
                    <a
                      href="mailto:royalgemskolkata@gmail.com"
                      className="font-body text-[15px] text-white hover:underline break-all"
                    >
                      royalgemskolkata@gmail.com
                    </a>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start gap-4">
                  <MapPin className="h-6 w-6 text-secondary flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-label-caps text-[10px] uppercase text-white/60 tracking-wider mb-1 font-bold">
                      Kolkata Studio
                    </h4>
                    <p className="font-body text-[15px] text-white leading-relaxed">
                      13/H/29, Mayur Bhanj Road,<br />
                      Kolkata, West Bengal — 700023
                    </p>
                  </div>
                </div>
              </div>

              <div className="h-px bg-white/10 w-full mt-8" />
            </div>
          </div>
        </div>

        {/* FAQ */}
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