import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Phone } from 'lucide-react'
import logoImg from '../assets/logo.png'

const navLinks = [
    { label: 'Beranda', href: '#hero' },
    { label: 'Tentang Kami', href: '#about' },
    { label: 'Paket', href: '#packages' },
    { label: 'Galeri', href: '#gallery' },
    { label: 'FAQ', href: '#faq' },
    { label: 'Kontak', href: '#cta' },
]

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 40)
        window.addEventListener('scroll', onScroll)
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    const scrollTo = (href) => {
        setMenuOpen(false)
        const el = document.querySelector(href)
        if (el) el.scrollIntoView({ behavior: 'smooth' })
    }

    return (
        <motion.nav
            initial={{ y: -70, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                ? 'bg-white/90 backdrop-blur-xl border-b border-sage/40 shadow-sm'
                : 'bg-white/80 backdrop-blur-md border-b border-sage/40'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-[68px]">

                {/* Logo */}
                <Link to="/" className="flex items-center gap-2.5 shrink-0">
                    <img
                        src={logoImg}
                        alt="Vauza Tamma"
                        className="h-10 w-auto object-contain"
                    />
                </Link>

                {/* Desktop Nav — centered */}
                <ul className="hidden md:flex items-center gap-7 absolute left-1/2 -translate-x-1/2">
                    {navLinks.map((link) => (
                        <li key={link.href}>
                            <button
                                onClick={() => scrollTo(link.href)}
                                className="text-gray-600 hover:text-primary text-sm font-medium transition-colors duration-200 relative group"
                            >
                                {link.label}
                                <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-primary rounded-full group-hover:w-full transition-all duration-300" />
                            </button>
                        </li>
                    ))}
                </ul>

                {/* Right CTA */}
                <div className="hidden md:flex items-center gap-3">
                    <a
                        href="https://wa.me/6281234567890?text=Assalamualaikum%20saya%20ingin%20info%20paket%20umroh"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-primary flex items-center gap-2 text-sm px-5 py-2.5"
                    >
                        <Phone size={15} />
                        Konsultasi
                    </a>
                </div>

                {/* Mobile toggle */}
                <button
                    className="md:hidden text-gray-700 hover:text-primary transition-colors p-1.5"
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Toggle menu"
                >
                    {menuOpen ? <X size={22} /> : <Menu size={22} />}
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white border-t border-sage/40 overflow-hidden"
                    >
                        <ul className="px-5 py-4 space-y-1">
                            {navLinks.map((link) => (
                                <li key={link.href}>
                                    <button
                                        onClick={() => scrollTo(link.href)}
                                        className="block w-full text-left text-gray-600 hover:text-primary hover:bg-sage/40 px-3 py-2.5 rounded-lg text-sm font-medium transition-all"
                                    >
                                        {link.label}
                                    </button>
                                </li>
                            ))}
                            <li className="pt-3">
                                <a
                                    href="https://wa.me/6281234567890?text=Assalamualaikum%20saya%20ingin%20info%20paket%20umroh"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn-primary w-full flex items-center justify-center gap-2 text-sm"
                                >
                                    <Phone size={15} /> Konsultasi
                                </a>
                            </li>
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    )
}
