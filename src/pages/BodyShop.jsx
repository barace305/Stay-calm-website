import { useState, useEffect } from 'react';

export default function BodyShop() {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    vehicleMake: '',
    vehicleModel: '',
    city: '',
    description: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    console.log('Body Shop Form Submitted:', form);

    const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY || '5366651c-0377-45ec-98e8-bbc97fcbd9a3';

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          access_key: accessKey,
          subject: `New Lead from Stay Calm (/body-shop Page): ${form.name}`,
          from_name: 'Stay Calm Website',
          page_submitted: '/body-shop Page Form',
          submitted_at: new Date().toLocaleString(),
          ...form
        })
      });

      const data = await response.json();
      if (data.success) {
        setSubmitted(true);
        if (typeof window.gtag === 'function') {
          window.gtag('event', 'conversion', {
            'send_to': 'AW-770750070/qPRlCNms778BEPbswu8C'
          });
        }
      } else {
        console.error('Form submission failed:', data.message);
        setError(data.message || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      console.error('Error submitting form:', err);
      setError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const inputClasses =
    "w-full px-4 py-3 bg-navy-900 border border-navy-700 rounded-lg text-white placeholder-navy-400 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-colors";
  const labelClasses = "block text-sm font-medium text-navy-300 mb-1.5";

  const trustElements = [
    { title: 'Fast Response', desc: 'Connecting you immediately with top-tier repair facilities.', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
    { title: 'Trusted Resources', desc: 'Vetted, certified auto body shops and professional technicians.', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
    { title: 'Quality Support', desc: 'Guidance and updates throughout the entire repair process.', icon: 'M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z' }
  ];

  return (
    <div className="min-h-screen bg-navy-950 text-white font-sans antialiased pb-20 sm:pb-0">
      {/* Minimal Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? 'bg-navy-950/95 backdrop-blur-md shadow-lg shadow-black/20 py-2' : 'bg-transparent py-4'
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 flex justify-center">
          <a href="/" className="inline-block">
            <img
              src="/logo.png"
              alt="Stay Calm Logo"
              className="h-[200px] sm:h-[350px] w-auto object-contain drop-shadow-lg -my-16 sm:-my-32"
            />
          </a>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative pt-36 sm:pt-48 pb-12 overflow-hidden">
          {/* Background Gradient Blurs */}
          <div className="absolute top-0 inset-x-0 h-[450px] bg-gradient-to-b from-gold-500/10 to-transparent pointer-events-none" />
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-gold-500/5 rounded-full blur-[100px] pointer-events-none" />

          <div className="max-w-6xl mx-auto px-6 relative z-10 text-center">
            <h1 className="font-serif text-5xl sm:text-7xl font-bold mb-6 text-white leading-tight">
              Need Vehicle <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-400 to-gold-600">Repair Assistance?</span>
            </h1>
            <p className="text-navy-200 text-lg sm:text-xl max-w-2xl mx-auto mb-8 leading-relaxed">
              Trusted repair resources, fast responses, and support available 24/7.
            </p>
            
            {/* Header Call-Now Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <a
                href="tel:4049901344"
                className="w-full sm:w-auto px-10 py-5 bg-gradient-to-r from-gold-500 to-gold-600 text-navy-950 font-bold text-xl rounded-xl hover:from-gold-400 hover:to-gold-500 transition-all duration-300 shadow-xl shadow-gold-500/20 hover:shadow-gold-500/40 hover:-translate-y-1 flex items-center justify-center gap-3"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Call Now
              </a>
              <a
                href="#request-form"
                className="w-full sm:w-auto px-10 py-5 border border-gold-500/40 text-gold-400 font-bold text-xl rounded-xl hover:bg-gold-500/10 hover:border-gold-400 transition-all duration-300 flex items-center justify-center gap-3"
              >
                Request Assistance
              </a>
            </div>
          </div>
        </section>

        {/* Category Identity Section (Trust Cards) */}
        <section className="py-10 bg-navy-900 border-y border-navy-800/50">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {trustElements.map((elem, idx) => (
                <div key={idx} className="flex gap-4 p-6 rounded-2xl bg-navy-800/30 border border-navy-700/50 hover:border-gold-500/30 transition-all duration-300">
                  <div className="w-12 h-12 rounded-full bg-navy-950 flex items-center justify-center border border-navy-700 shrink-0">
                    <svg className="w-6 h-6 text-gold-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={elem.icon} />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">{elem.title}</h3>
                    <p className="text-sm text-navy-300 leading-relaxed">{elem.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Content & Form Split Section */}
        <section id="request-form" className="py-20 relative">
          <div className="max-w-6xl mx-auto px-6 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              {/* Left Column: Visual Sourcing Image (Category Identity) */}
              <div className="lg:col-span-5 relative group">
                <div className="absolute -inset-1.5 bg-gradient-to-r from-gold-600 to-gold-400 rounded-2xl blur-lg opacity-40 group-hover:opacity-75 transition duration-1000 group-hover:duration-200" />
                <div className="relative bg-navy-950 rounded-2xl overflow-hidden border border-gold-500/20 aspect-[4/3] sm:aspect-square lg:aspect-[4/5] shadow-2xl">
                  <img
                    src="/body_shop_hero.png"
                    alt="Premium Auto Body Shop Repair Facility"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-transparent to-transparent opacity-60" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <span className="text-xs uppercase tracking-wider text-gold-400 font-semibold mb-1 block">Vehicle Repair</span>
                    <h4 className="text-xl font-serif font-bold text-white">High-Quality Body Shop Facilities</h4>
                  </div>
                </div>
              </div>

              {/* Right Column: Intake Form */}
              <div className="lg:col-span-7">
                <div className="bg-navy-950 border border-navy-800/80 rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gold-600 via-gold-400 to-gold-600" />
                  
                  <div className="mb-8">
                    <h3 className="font-serif text-3xl font-bold text-white mb-3">
                      Request Vehicle Repair Assistance
                    </h3>
                    <p className="text-navy-300 text-sm">
                      Fill out the form below. A Stay Calm representative will coordinate with certified body shops and contact you shortly.
                    </p>
                  </div>

                  {submitted ? (
                    <div className="py-12 text-center animate-fade-in">
                      <div className="w-16 h-16 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/30">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <h4 className="text-2xl font-bold text-white mb-2">Thank you.</h4>
                      <p className="text-navy-200">A Stay Calm representative will contact you shortly.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                          <label htmlFor="name" className={labelClasses}>Full Name *</label>
                          <input id="name" name="name" type="text" required value={form.name} onChange={handleChange} className={inputClasses} placeholder="John Doe" />
                        </div>
                        <div>
                          <label htmlFor="phone" className={labelClasses}>Phone Number *</label>
                          <input id="phone" name="phone" type="tel" required value={form.phone} onChange={handleChange} className={inputClasses} placeholder="(404) 990-1344" />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                          <label htmlFor="vehicleMake" className={labelClasses}>Vehicle Make *</label>
                          <input id="vehicleMake" name="vehicleMake" type="text" required value={form.vehicleMake} onChange={handleChange} className={inputClasses} placeholder="e.g., Toyota, Ford, Honda" />
                        </div>
                        <div>
                          <label htmlFor="vehicleModel" className={labelClasses}>Vehicle Model *</label>
                          <input id="vehicleModel" name="vehicleModel" type="text" required value={form.vehicleModel} onChange={handleChange} className={inputClasses} placeholder="e.g., Camry, Explorer, Civic" />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="city" className={labelClasses}>City *</label>
                        <input id="city" name="city" type="text" required value={form.city} onChange={handleChange} className={inputClasses} placeholder="Atlanta" />
                      </div>

                      <div>
                        <label htmlFor="description" className={labelClasses}>Description of Damage</label>
                        <textarea id="description" name="description" rows={4} value={form.description} onChange={handleChange} className={`${inputClasses} resize-none`} placeholder="Please describe the damage to your vehicle..." />
                      </div>
                      
                      {error && (
                        <p className="text-center text-red-500 text-sm font-semibold">
                          {error}
                        </p>
                      )}

                      <button
                        type="submit"
                        disabled={submitting}
                        className="w-full py-4 bg-gradient-to-r from-gold-500 to-gold-600 text-navy-950 font-bold text-lg rounded-xl hover:from-gold-400 hover:to-gold-500 transition-all duration-300 shadow-lg shadow-gold-500/20 hover:shadow-gold-500/40 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                      >
                        {submitting ? 'Submitting...' : 'Request Assistance'}
                      </button>
                      
                      <p className="text-center text-navy-400 text-xs">
                        Your information is secure and confidential.
                      </p>
                    </form>
                  )}
                </div>
              </div>

            </div>
          </div>
        </section>
      </main>

      {/* Simple Footer */}
      <footer className="bg-navy-950 border-t border-navy-800/50 py-10">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <img src="/logo.png" alt="Stay Calm Footer Logo" className="h-[200px] sm:h-[300px] w-auto object-contain mx-auto mb-6 -my-16 sm:-my-24" />
          <p className="text-navy-400 text-sm mb-4">
            Connecting people with trusted professionals in the South.
          </p>
          <a href="tel:4049901344" className="text-gold-400 font-semibold hover:text-gold-300 transition-colors">
            (404) 990-1344
          </a>
          <div className="mt-8 pt-6 border-t border-navy-800/50">
            <p className="text-navy-500 text-xs">
              © {new Date().getFullYear()} StayCalm.Today — All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Sticky Mobile Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-navy-950/95 backdrop-blur-md border-t border-navy-800/50 z-50 sm:hidden">
        <a
          href="tel:4049901344"
          className="w-full flex items-center justify-center gap-3 py-4 bg-gradient-to-r from-gold-500 to-gold-600 text-navy-950 font-bold text-lg rounded-xl shadow-lg shadow-gold-500/20 active:scale-[0.98] transition-transform"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          Call Now — 404-990-1344
        </a>
      </div>
    </div>
  );
}
