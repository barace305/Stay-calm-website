import Header from '../components/Header'
import Hero from '../components/Hero'
import HowItWorks from '../components/HowItWorks'
import ContactForm from '../components/ContactForm'
import ServiceAreas from '../components/ServiceAreas'
import About from '../components/About'
import Footer from '../components/Footer'

export default function Home() {
  return (
    <div className="min-h-screen bg-navy-950 text-white font-sans antialiased">
      <Header />
      <main>
        <Hero />
        <ContactForm />
        <HowItWorks />
        <ServiceAreas />
        <About />
      </main>
      <Footer />
    </div>
  )
}
