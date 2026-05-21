import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'

const navigation = [
  { path: '/', label: 'Home' },
  { path: '/products', label: 'Products' },
  { path: '/solutions', label: 'Solutions' },
  { path: '/services', label: 'Services' },
  { path: '/industries', label: 'Industries' },
  { path: '/insights', label: 'Insights' },
  { path: '/contact', label: 'Contact' },
  { path: '/admin', label: 'Admin Panel' },
]

const regions = ['UAE', 'Uzbekistan', 'Global']
const locales = ['EN', 'RU', 'UZ']

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [locale, setLocale] = useState('EN')
  const [region, setRegion] = useState('UAE')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24)
    handleScroll()
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled ? 'backdrop-blur-xl shadow-md bg-white/90 border-b border-slate-100' : 'bg-transparent border-b border-transparent'
    }`}>
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-6 px-6 py-4 md:px-8">
        {/* Logo Section */}
        <NavLink to="/" className="flex items-center gap-3 group focus:outline-none">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-900 text-white font-bold tracking-wider shadow-lg shadow-slate-900/10 transition group-hover:scale-105">
            PS
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.32em] text-slate-500 group-hover:text-brand-700 transition">ProScient</p>
            <p className="text-sm font-semibold text-slate-900">Smart Science. Real Impact.</p>
          </div>
        </NavLink>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-4 xl:gap-6 xl:flex">
          {navigation.filter(item => item.path !== '/admin').map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `text-sm font-medium transition relative py-1 hover:text-slate-900 focus:outline-none ${
                  isActive ? 'text-brand-900 font-semibold' : 'text-slate-600'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {item.label}
                  {isActive && (
                    <motion.span
                      layoutId="activeNav"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-900 rounded-full"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Desktop Settings & Call to Action */}
        <div className="hidden items-center gap-3 xl:gap-4 xl:flex">
          {/* Region selector */}
          <div className="flex items-center gap-1 rounded-full border border-slate-200 bg-white p-1 text-xs text-slate-700 shadow-sm">
            {regions.map(item => (
              <button
                key={item}
                onClick={() => setRegion(item)}
                className={`rounded-full px-3 py-1.5 font-medium transition ${
                  item === region ? 'bg-brand-900 text-white' : 'text-slate-500 hover:text-slate-900'
                }`}
                type="button"
              >
                {item}
              </button>
            ))}
          </div>

          {/* Locale Selector */}
          <div className="flex items-center gap-1 rounded-full border border-slate-200 bg-white p-1 text-xs shadow-sm">
            {locales.map(item => (
              <button
                key={item}
                onClick={() => setLocale(item)}
                className={`rounded-full px-2.5 py-1.5 font-medium transition ${
                  item === locale ? 'bg-brand-900 text-white' : 'text-slate-500 hover:text-slate-900'
                }`}
                type="button"
              >
                {item}
              </button>
            ))}
          </div>

          <NavLink
            to="/contact"
            className="rounded-full bg-brand-700 px-5 py-2.5 text-sm font-semibold text-white transition-all shadow-[0_10px_25px_-5px_rgba(21,63,120,0.4)] hover:bg-brand-800 hover:shadow-[0_15px_30px_-5px_rgba(21,63,120,0.5)] active:scale-95"
          >
            Get Quote
          </NavLink>

          <NavLink
            to="/admin"
            className="rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 active:scale-95 shadow-sm"
          >
            Admin Panel
          </NavLink>
        </div>

        {/* Mobile Hamburger Menu Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition-all xl:hidden hover:bg-slate-50 active:scale-90"
          aria-label="Toggle menu"
          type="button"
        >
          <svg
            className="h-5 w-5 fill-none stroke-current stroke-2"
            viewBox="0 0 24 24"
          >
            <motion.path
              animate={mobileMenuOpen ? { d: 'M 18 6 L 6 18' } : { d: 'M 3 12 L 21 12' }}
              transition={{ duration: 0.2 }}
            />
            <motion.path
              animate={mobileMenuOpen ? { d: 'M 6 6 L 18 18' } : { d: 'M 3 6 L 21 6' }}
              transition={{ duration: 0.2 }}
            />
            <motion.path
              animate={mobileMenuOpen ? { opacity: 0 } : { opacity: 1, d: 'M 3 18 L 21 18' }}
              transition={{ duration: 0.2 }}
            />
          </svg>
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden border-b border-slate-200 bg-white/95 backdrop-blur-xl xl:hidden shadow-lg"
          >
            <div className="flex flex-col gap-5 px-6 py-6 border-t border-slate-100">
              <nav className="flex flex-col gap-4">
                {navigation.map(item => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `text-base font-semibold py-2 transition ${
                        isActive ? 'text-brand-900 border-l-4 border-brand-900 pl-3' : 'text-slate-600 hover:text-slate-900 pl-0'
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                ))}
              </nav>

              <hr className="border-slate-100" />

              {/* Mobile Selectors */}
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Region</p>
                  <div className="flex gap-2">
                    {regions.map(item => (
                      <button
                        key={item}
                        onClick={() => setRegion(item)}
                        className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                          item === region ? 'bg-brand-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                        type="button"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Language</p>
                  <div className="flex gap-2">
                    {locales.map(item => (
                      <button
                        key={item}
                        onClick={() => setLocale(item)}
                        className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                          item === locale ? 'bg-brand-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                        type="button"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 mt-2">
                <NavLink
                  to="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-full bg-brand-700 py-3 text-center text-sm font-semibold text-white transition hover:bg-brand-800 shadow-[0_10px_20px_-5px_rgba(21,63,120,0.4)]"
                >
                  Get Quote
                </NavLink>
                <NavLink
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-full border border-slate-200 bg-slate-50 py-3 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                >
                  Admin Panel
                </NavLink>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
