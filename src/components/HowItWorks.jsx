const steps = [
  {
    num: '01',
    title: 'Tell Us What Happened',
    desc: 'Fill out a simple form with the details of your situation. It takes less than two minutes.',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    ),
  },
  {
    num: '02',
    title: 'We Connect You',
    desc: 'Our team reviews your case and matches you with the right trusted professional in your area.',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    num: '03',
    title: 'You Get Help',
    desc: 'Your matched professional reaches out directly. No runaround, no waiting — real help, fast.',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-navy-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-navy-950 via-navy-900 to-navy-950" />
      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-gold-400 text-sm font-semibold tracking-widest uppercase">Simple Process</span>
          <h2 className="font-serif text-4xl sm:text-5xl font-bold text-white mt-3 mb-4">
            How It Works
          </h2>
          <p className="text-navy-300 text-lg max-w-xl mx-auto">
            Three simple steps to getting the help you deserve.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <div
              key={step.num}
              className="group relative bg-navy-800/30 border border-navy-700/40 rounded-2xl p-8 hover:border-gold-500/30 hover:bg-navy-800/50 transition-all duration-500 hover:-translate-y-1"
            >
              {/* Step number */}
              <span className="text-6xl font-bold text-navy-700/30 absolute top-6 right-6 font-serif group-hover:text-gold-500/10 transition-colors duration-500">
                {step.num}
              </span>

              {/* Icon */}
              <div className="w-14 h-14 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-400 mb-6 group-hover:bg-gold-500/20 transition-all duration-300">
                {step.icon}
              </div>

              <h3 className="font-serif text-xl font-semibold text-white mb-3">{step.title}</h3>
              <p className="text-navy-300 leading-relaxed">{step.desc}</p>

              {/* Connector line (desktop) */}
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 w-8 border-t border-dashed border-navy-600/50" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
