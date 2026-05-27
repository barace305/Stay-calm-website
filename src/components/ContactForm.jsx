import { useState } from 'react'

export default function ContactForm() {
  const [form, setForm] = useState({
    name: '', phone: '', email: '', city: '', accidentDate: '',
    injured: '', contactTime: '', description: '',
  })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <section id="contact" className="py-24 bg-navy-950 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gold-500/5 rounded-full blur-3xl" />
        <div className="relative z-10 max-w-2xl mx-auto px-6 text-center">
          <div className="bg-navy-900/60 backdrop-blur-sm border border-navy-700/50 rounded-2xl p-12 shadow-2xl">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center">
              <svg className="w-8 h-8 text-navy-950" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="font-serif text-3xl font-bold text-white mb-3">Thank You</h3>
            <p className="text-navy-300 text-lg">We've received your information and will be in touch shortly. Stay calm — help is on the way.</p>
          </div>
        </div>
      </section>
    )
  }

  const inputClasses = "w-full px-4 py-3.5 bg-navy-800/50 border border-navy-600/50 rounded-xl text-white placeholder-navy-400 focus:outline-none focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/20 transition-all duration-300 text-sm"
  const labelClasses = "block text-sm font-medium text-navy-300 mb-2"

  return (
    <section id="contact" className="py-24 bg-navy-950 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gold-500/5 rounded-full blur-3xl" />
      <div className="relative z-10 max-w-3xl mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-12">
          <span className="text-gold-400 text-sm font-semibold tracking-widest uppercase">Get Started</span>
          <h2 className="font-serif text-4xl sm:text-5xl font-bold text-white mt-3 mb-4">
            Tell Us What Happened
          </h2>
          <p className="text-navy-300 text-lg max-w-xl mx-auto">
            Fill out the form below and a member of our team will reach out to connect you with the right help.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-navy-900/40 backdrop-blur-sm border border-navy-700/40 rounded-2xl p-8 sm:p-10 shadow-2xl shadow-black/20"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className={labelClasses}>Full Name *</label>
              <input id="name" name="name" type="text" required placeholder="John Doe" value={form.name} onChange={handleChange} className={inputClasses} />
            </div>
            <div>
              <label htmlFor="phone" className={labelClasses}>Phone Number *</label>
              <input id="phone" name="phone" type="tel" required placeholder="(555) 123-4567" value={form.phone} onChange={handleChange} className={inputClasses} />
            </div>
            <div>
              <label htmlFor="email" className={labelClasses}>Email Address</label>
              <input id="email" name="email" type="email" placeholder="john@email.com" value={form.email} onChange={handleChange} className={inputClasses} />
            </div>
            <div>
              <label htmlFor="city" className={labelClasses}>City / State *</label>
              <input id="city" name="city" type="text" required placeholder="" value={form.city} onChange={handleChange} className={inputClasses} />
            </div>
            <div>
              <label htmlFor="accidentDate" className={labelClasses}>Date of Accident</label>
              <input id="accidentDate" name="accidentDate" type="date" value={form.accidentDate} onChange={handleChange} className={inputClasses} />
            </div>
            <div>
              <label htmlFor="injured" className={labelClasses}>Were You Injured?</label>
              <select id="injured" name="injured" value={form.injured} onChange={handleChange} className={inputClasses}>
                <option value="">Select...</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
                <option value="unsure">Not Sure</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="contactTime" className={labelClasses}>Best Time To Contact</label>
              <select id="contactTime" name="contactTime" value={form.contactTime} onChange={handleChange} className={inputClasses}>
                <option value="">Select a time...</option>
                <option value="morning">Morning (8am – 12pm)</option>
                <option value="afternoon">Afternoon (12pm – 5pm)</option>
                <option value="evening">Evening (5pm – 8pm)</option>
                <option value="anytime">Anytime</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="description" className={labelClasses}>Short Description</label>
              <textarea id="description" name="description" rows={4} placeholder="Briefly describe what happened..." value={form.description} onChange={handleChange} className={`${inputClasses} resize-none`} />
            </div>
          </div>
          <button
            id="submit-form"
            type="submit"
            className="mt-8 w-full py-4 bg-gradient-to-r from-gold-500 to-gold-600 text-navy-950 font-bold text-lg rounded-xl hover:from-gold-400 hover:to-gold-500 transition-all duration-300 shadow-lg shadow-gold-500/20 hover:shadow-gold-500/40 hover:-translate-y-0.5 cursor-pointer"
          >
            Submit — Get Help Today
          </button>
          <p className="mt-4 text-center text-navy-500 text-xs">
            Your information is private and secure. We'll never share your data.
          </p>
        </form>
      </div>
    </section>
  )
}
