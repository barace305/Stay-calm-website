export default function About() {
  return (
    <section id="about" className="py-24 bg-navy-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-navy-950 via-navy-900 to-navy-950" />
      <div className="relative z-10 max-w-5xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Content */}
          <div>
            <span className="text-gold-400 text-sm font-semibold tracking-widest uppercase">About Us</span>
            <h2 className="font-serif text-4xl sm:text-5xl font-bold text-white mt-3 mb-6">
              Built on <span className="text-gold-400">Trust</span>
            </h2>
            <div className="space-y-4 text-navy-300 leading-relaxed text-lg">
              <p>
                Stay Calm helps people connect with trusted professionals after stressful situations. Whether you've been in an accident or just need guidance navigating what comes next, we're here to make sure you're not alone.
              </p>
              <p>
                Our network is built on relationships — not volume. Every professional in our referral network is vetted, experienced, and committed to putting people first.
              </p>
              <p>
                We started with car accident referrals in the South, and we're expanding into new areas of service because everyone deserves calm in the chaos.
              </p>
            </div>

            {/* Stats */}
            <div className="mt-10 grid grid-cols-3 gap-6">
              <div>
                <div className="font-serif text-3xl font-bold text-gold-400">3</div>
                <div className="text-navy-400 text-sm mt-1">States Served</div>
              </div>
              <div>
                <div className="font-serif text-3xl font-bold text-gold-400">100+</div>
                <div className="text-navy-400 text-sm mt-1">Trusted Partners</div>
              </div>
              <div>
                <div className="font-serif text-3xl font-bold text-gold-400">24hr</div>
                <div className="text-navy-400 text-sm mt-1">Response Time</div>
              </div>
            </div>
          </div>

          {/* Right: Visual element */}
          <div className="relative">
            <div className="bg-navy-800/40 border border-navy-700/40 rounded-2xl p-10 relative overflow-hidden">
              {/* Decorative gradient */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-gold-500/5 rounded-full blur-2xl" />

              <div className="relative z-10 space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-400 shrink-0 mt-1">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">Vetted Professionals</h4>
                    <p className="text-navy-400 text-sm">Every partner in our network is thoroughly reviewed and trusted.</p>
                  </div>
                </div>

                <div className="border-t border-navy-700/40" />

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-400 shrink-0 mt-1">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">Fast Response</h4>
                    <p className="text-navy-400 text-sm">We connect you quickly — because timing matters when you need help.</p>
                  </div>
                </div>

                <div className="border-t border-navy-700/40" />

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-400 shrink-0 mt-1">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">People First</h4>
                    <p className="text-navy-400 text-sm">We're not a law firm. We're a bridge to people who care.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
