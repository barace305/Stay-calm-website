export default function Footer() {
  return (
    <footer className="bg-navy-950 border-t border-navy-800/50">
      {/* CTA Banner */}
      <div className="max-w-5xl mx-auto px-6 py-16 text-center">
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white mb-4">
          Need Help? <span className="text-gold-400">Stay Calm.</span>
        </h2>
        <p className="text-navy-300 text-lg mb-8 max-w-xl mx-auto">
          Our team is ready to connect you with the right professional. No cost, no obligation.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-gold-500 to-gold-600 text-navy-950 font-semibold text-lg rounded-xl hover:from-gold-400 hover:to-gold-500 transition-all duration-300 shadow-lg shadow-gold-500/20 hover:shadow-gold-500/40 hover:-translate-y-0.5"
          >
            Get Help Today
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
          <a
            href="tel:4049901344"
            id="footer-call-now"
            className="inline-flex items-center gap-2 px-8 py-4 border border-gold-500/40 text-gold-400 font-semibold text-lg rounded-xl hover:bg-gold-500/10 hover:border-gold-400 transition-all duration-300"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            Call (404) 990-1344
          </a>
        </div>
      </div>

      {/* Footer bottom */}
      <div className="border-t border-navy-800/50">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img
                  src="/logo.png"
                  alt="Stay Calm"
                  className="h-[200px] sm:h-[300px] w-auto object-contain -my-16 sm:-my-24 -ml-4"
                />
              </div>
              <p className="text-navy-400 text-sm leading-relaxed mb-4">
                The fastest growing referral network in the South. Connecting people with trusted professionals.
              </p>
              <a
                href="https://staycalm.today"
                className="text-gold-400 text-sm font-medium hover:text-gold-300 transition-colors"
              >
                StayCalm.Today
              </a>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm tracking-wider uppercase">Quick Links</h4>
              <ul className="space-y-3">
                {[
                  { label: 'How It Works', href: '#how-it-works' },
                  { label: 'Service Areas', href: '#services' },
                  { label: 'About Us', href: '#about' },
                  { label: 'Get Help', href: '#contact' },
                ].map((link) => (
                  <li key={link.href}>
                    <a href={link.href} className="text-navy-400 text-sm hover:text-gold-400 transition-colors duration-300">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm tracking-wider uppercase">Contact</h4>
              <ul className="space-y-3 text-navy-400 text-sm">
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-gold-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <a href="tel:4049901344" className="hover:text-gold-400 transition-colors">(404) 990-1344</a>
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-gold-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <a href="mailto:help@staycalm.today" className="hover:text-gold-400 transition-colors">help@staycalm.today</a>
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-gold-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <a href="https://staycalm.today" className="hover:text-gold-400 transition-colors">StayCalm.Today</a>
                </li>
              </ul>

              {/* Social */}
              <div className="flex items-center gap-4 mt-6">
                {['Facebook', 'Instagram', 'Twitter'].map((social) => (
                  <a
                    key={social}
                    href="#"
                    aria-label={social}
                    className="w-9 h-9 rounded-lg bg-navy-800/50 border border-navy-700/40 flex items-center justify-center text-navy-400 hover:text-gold-400 hover:border-gold-500/30 transition-all duration-300"
                  >
                    {social === 'Facebook' && (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>
                    )}
                    {social === 'Instagram' && (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" strokeWidth="2"/><circle cx="12" cy="12" r="5" strokeWidth="2"/><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor"/></svg>
                    )}
                    {social === 'Twitter' && (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                    )}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-navy-800/50 mt-10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-navy-500 text-xs">
              © {new Date().getFullYear()} StayCalm.Today — All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-navy-500 text-xs hover:text-navy-300 transition-colors">Privacy Policy</a>
              <a href="#" className="text-navy-500 text-xs hover:text-navy-300 transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
