import { useEffect } from 'react'
import Header from './Header'
import Footer from './Footer'

export function LegalSection({ title, children }) {
  return (
    <section>
      <h2 className="font-serif text-2xl font-bold text-white mb-4">{title}</h2>
      <div className="space-y-4 text-navy-200 leading-7">{children}</div>
    </section>
  )
}

export default function LegalPageLayout({ title, children }) {
  useEffect(() => {
    const previousTitle = document.title
    document.title = `${title} | Stay Calm`
    window.scrollTo(0, 0)

    return () => {
      document.title = previousTitle
    }
  }, [title])

  return (
    <div className="min-h-screen bg-navy-950 text-white">
      <Header homePath="/" />
      <main className="pt-40 sm:pt-48 pb-20 border-b border-navy-800/50">
        <article className="max-w-4xl mx-auto px-6">
          <header className="pb-10 mb-10 border-b border-navy-800/70">
            <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white mb-4">{title}</h1>
            <p className="text-gold-400 font-medium mb-5">Effective Date: August 11, 2026</p>
            <p className="text-navy-200 text-lg leading-8">
              Stay Calm is operated by Mine City LLC, a Florida limited liability company.
            </p>
          </header>
          <div className="space-y-12">{children}</div>
        </article>
      </main>
      <Footer homePath="/" />
    </div>
  )
}
