import { Link } from 'react-router-dom'
import { Instagram, Youtube, Facebook, Phone, Mail, MapPin } from 'lucide-react'

const quickLinks = [
    { label: 'Beranda', href: '#hero' },
    { label: 'Tentang Kami', href: '#about' },
    { label: 'Paket Umroh', href: '#packages' },
    { label: 'Galeri', href: '#gallery' },
    { label: 'FAQ', href: '#faq' },
    { label: 'Kontak', href: '#cta' },
]

const social = [
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Youtube, href: '#', label: 'YouTube' },
]

export default function Footer() {
    const scrollTo = (href) => {
        const el = document.querySelector(href)
        if (el) el.scrollIntoView({ behavior: 'smooth' })
    }

    return (
        <footer className="bg-darksage text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

                    {/* Brand */}
                    <div className="md:col-span-2">
                        <div className="flex items-center gap-3 mb-5">
                            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
                                <span className="text-white font-bold text-lg leading-none">ﻭ</span>
                            </div>
                            <div>
                                <p className="font-bold text-white text-base">Vauza Tamma Abadi</p>
                                <p className="text-white/50 text-xs tracking-wider uppercase">Haji & Umroh</p>
                            </div>
                        </div>
                        <p className="text-white/60 text-sm leading-relaxed mb-6 max-w-xs">
                            Penyelenggara haji dan umroh terpercaya sejak 2015. Terdaftar resmi Kementerian Agama RI. Kami hadir untuk memberikan perjalanan suci yang penuh keberkahan.
                        </p>

                        {/* Arabic Verse */}
                        <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6">
                            <p className="text-white/80 text-right font-arabic text-base leading-loose">
                                وَلِلَّهِ عَلَى النَّاسِ حِجُّ الْبَيْتِ مَنِ اسْتَطَاعَ إِلَيْهِ سَبِيلاً
                            </p>
                            <p className="text-white/40 text-xs mt-1 text-right">
                                QS. Ali Imran: 97
                            </p>
                        </div>

                        {/* Social icons */}
                        <div className="flex gap-3">
                            {social.map(({ icon: Icon, href, label }) => (
                                <a
                                    key={label}
                                    href={href}
                                    aria-label={label}
                                    className="w-9 h-9 rounded-xl bg-white/10 hover:bg-primary flex items-center justify-center transition-colors duration-200"
                                >
                                    <Icon size={16} className="text-white/70 group-hover:text-white" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-semibold text-white text-sm mb-5 uppercase tracking-wider">Menu Cepat</h4>
                        <ul className="space-y-2.5">
                            {quickLinks.map((link) => (
                                <li key={link.href}>
                                    <button
                                        onClick={() => scrollTo(link.href)}
                                        className="text-white/55 hover:text-white text-sm transition-colors duration-150 text-left"
                                    >
                                        {link.label}
                                    </button>
                                </li>
                            ))}
                            <li>
                                <Link to="/admin/login" className="text-white/30 hover:text-white/50 text-xs transition-colors">
                                    Admin Panel
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="font-semibold text-white text-sm mb-5 uppercase tracking-wider">Kontak</h4>
                        <div className="space-y-4">
                            {[
                                { icon: Phone, text: '+62 812-3456-7890' },
                                { icon: Mail, text: 'info@vauzatamma.com' },
                                { icon: MapPin, text: 'Jl. Contoh No. 123, Jakarta Selatan 12345' },
                            ].map(({ icon: Icon, text }) => (
                                <div key={text} className="flex items-start gap-3">
                                    <Icon size={14} className="text-accent mt-0.5 shrink-0" />
                                    <span className="text-white/55 text-sm leading-snug">{text}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-14 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/30">
                    <p>© 2025 Vauza Tamma Abadi Haji & Umroh. Semua hak dilindungi.</p>
                    <p>PPIU Resmi Kemenag RI · Izin Usaha No. XXX/XXX/2015</p>
                </div>
            </div>
        </footer>
    )
}
