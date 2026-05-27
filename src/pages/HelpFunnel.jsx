import { useState, useEffect } from 'react';

export default function HelpFunnel() {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    city: '',
    accidentDate: '',
    description: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Funnel Form Submitted:', form);
    setSubmitted(true);
    // Google Ads conversion tracking — fires only on real form submit
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'conversion', {
        'send_to': 'AW-770750070/qPRlCNms778BEPbswu8C'
      });
    }
  };

  const inputClasses =
    "w-full px-4 py-3 bg-navy-900 border border-navy-700 rounded-lg text-white placeholder-navy-400 focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-colors";
  const labelClasses = "block text-sm font-medium text-navy-300 mb-1.5";

  const services = [
    { title: 'Attorneys', icon: 'M3 14l9-9 9 9M4 10h16v11H4z' },
    { title: 'Medical Providers', icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z' },
    { title: 'Vehicle Assistance', icon: 'M8 7h8M8 11h8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
    { title: 'Recovery Resources', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
    { title: 'Available 24/7', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' }
  ];

  return (
    <div className="min-h-screen bg-navy-950 text-white font-sans antialiased pb-20 sm:pb-0">
      {/* Minimal Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? 'bg-navy-950/95 backdrop-blur-md shadow-lg shadow-black/20 py-2' : 'bg-transparent py-4'
        }`}
      >
        <div className="max-w-4xl mx-auto px-6 flex justify-center">
          <a href="/" className="inline-block">
            <img
              src="/logo.png"
              alt="Stay Calm"
              className="h-[200px] sm:h-[350px] w-auto object-contain drop-shadow-lg -my-16 sm:-my-32"
            />
          </a>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative pt-36 sm:pt-48 pb-20 overflow-hidden">
          {/* Background Elements */}
          <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-gold-500/10 to-transparent pointer-events-none" />
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gold-500/5 rounded-full blur-[120px] pointer-events-none" />

          <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
            <h1 className="font-serif text-5xl sm:text-7xl font-bold mb-6 text-white leading-tight">
              Been In A <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-400 to-gold-600">Car Accident?</span>
            </h1>
            <h2 className="text-2xl sm:text-3xl text-gold-400 font-semibold mb-6">
              Stay Calm. We're Here To Help.
            </h2>
            <p className="text-navy-200 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
              We help connect people with attorneys, medical providers, vehicle assistance, and recovery resources.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
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
                href="#intake-form"
                className="w-full sm:w-auto px-10 py-5 border border-gold-500/40 text-gold-400 font-bold text-xl rounded-xl hover:bg-gold-500/10 hover:border-gold-400 transition-all duration-300 flex items-center justify-center gap-3"
              >
                Get Help Today
              </a>
            </div>
          </div>
        </section>

        {/* Services / Trust Section */}
        <section className="py-12 bg-navy-900 border-y border-navy-800/50">
          <div className="max-w-5xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
              {services.map((service, idx) => (
                <div key={idx} className="flex flex-col items-center text-center p-4 rounded-2xl bg-navy-800/30 border border-navy-700/50 hover:border-gold-500/30 transition-colors">
                  <div className="w-12 h-12 mb-3 rounded-full bg-navy-950 flex items-center justify-center border border-navy-700">
                    <svg className="w-6 h-6 text-gold-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={service.icon} />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-navy-200">{service.title}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Form Section */}
        <section id="intake-form" className="py-20 relative">
          <div className="max-w-3xl mx-auto px-6 relative z-10">
            <div className="bg-navy-950 border border-navy-800/80 rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gold-600 via-gold-400 to-gold-600" />
              
              <div className="text-center mb-10">
                <h3 className="font-serif text-3xl sm:text-4xl font-bold text-white mb-4">
                  Tell Us What Happened
                </h3>
                <p className="text-navy-300">
                  Fill out the form below and we will connect you with the right professionals.
                </p>
              </div>

              {submitted ? (
                <div className="py-16 text-center animate-fade-in">
                  <div className="w-20 h-20 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/30">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h4 className="text-2xl font-bold text-white mb-3">Thank you.</h4>
                  <p className="text-navy-300 text-lg">A representative will contact you shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className={labelClasses}>Full Name *</label>
                      <input id="name" name="name" type="text" required value={form.name} onChange={handleChange} className={inputClasses} />
                    </div>
                    <div>
                      <label htmlFor="phone" className={labelClasses}>Phone Number *</label>
                      <input id="phone" name="phone" type="tel" required value={form.phone} onChange={handleChange} className={inputClasses} />
                    </div>
                    <div>
                      <label htmlFor="email" className={labelClasses}>Email Address</label>
                      <input id="email" name="email" type="email" value={form.email} onChange={handleChange} className={inputClasses} />
                    </div>
                    <div>
                      <label htmlFor="city" className={labelClasses}>City / State *</label>
                      <input id="city" name="city" type="text" required value={form.city} onChange={handleChange} className={inputClasses} />
                    </div>
                    <div>
                      <label htmlFor="accidentDate" className={labelClasses}>Date of Accident</label>
                      <input id="accidentDate" name="accidentDate" type="date" value={form.accidentDate} onChange={handleChange} className={inputClasses} />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="description" className={labelClasses}>Brief Description</label>
                    <textarea id="description" name="description" rows={4} value={form.description} onChange={handleChange} className={`${inputClasses} resize-none`} placeholder="What happened?" />
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full py-4 bg-gradient-to-r from-gold-500 to-gold-600 text-navy-950 font-bold text-lg rounded-xl hover:from-gold-400 hover:to-gold-500 transition-all duration-300 shadow-lg shadow-gold-500/20 hover:shadow-gold-500/40 mt-4"
                  >
                    Get Help Today
                  </button>
                  <p className="text-center text-navy-400 text-sm mt-4">
                    Your information is secure and confidential.
                  </p>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Simple Footer */}
      <footer className="bg-navy-950 border-t border-navy-800/50 py-10">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <img src="/logo.png" alt="Stay Calm" className="h-[200px] sm:h-[300px] w-auto object-contain mx-auto mb-6 -my-16 sm:-my-24" />
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
