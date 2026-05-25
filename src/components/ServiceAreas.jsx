const areas = [
  {
    state: 'Georgia',
    cities: 'Atlanta, Savannah, Augusta, Macon',
    icon: '🍑',
  },
  {
    state: 'Florida',
    cities: 'Miami, Orlando, Tampa, Jacksonville',
    icon: '🌴',
  },
  {
    state: 'Texas',
    cities: 'Houston, Dallas, San Antonio, Austin',
    icon: '⭐',
  },
]

export default function ServiceAreas() {
  return (
    <section id="services" className="py-24 bg-navy-950 relative overflow-hidden">
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-gold-500/3 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />
      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-gold-400 text-sm font-semibold tracking-widest uppercase">Coverage</span>
          <h2 className="font-serif text-4xl sm:text-5xl font-bold text-white mt-3 mb-4">
            Service Areas
          </h2>
          <p className="text-navy-300 text-lg max-w-xl mx-auto">
            Currently serving the South — and growing fast.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {areas.map((area) => (
            <div
              key={area.state}
              className="group relative bg-navy-900/40 border border-navy-700/40 rounded-2xl p-8 text-center hover:border-gold-500/30 hover:bg-navy-800/40 transition-all duration-500 hover:-translate-y-1"
            >
              <div className="text-4xl mb-4">{area.icon}</div>
              <h3 className="font-serif text-2xl font-bold text-white mb-2">{area.state}</h3>
              <p className="text-navy-400 text-sm">{area.cities}</p>
              <div className="mt-6 inline-flex items-center gap-1 text-gold-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span>Active</span>
                <div className="w-2 h-2 rounded-full bg-gold-400 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
