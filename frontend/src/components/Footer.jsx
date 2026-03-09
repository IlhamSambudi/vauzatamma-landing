import { Link } from 'react-router-dom'
import { Instagram, Facebook, Phone, Mail, MapPin } from 'lucide-react'

const quickLinks = [
    { label: 'Beranda', href: '#hero' },
    { label: 'Tentang Kami', href: '#about' },
    { label: 'Paket Umroh', href: '#packages' },
    { label: 'Galeri', href: '#gallery' },
    { label: 'FAQ', href: '#faq' },
    { label: 'Kontak', href: '#cta' },
]

const TikTokIcon = () => (
    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.78a4.85 4.85 0 0 1-1.01-.09z" />
    </svg>
)

const social = [
    { icon: Instagram, href: 'https://www.instagram.com/vauzatamma_umroh/', label: 'Instagram' },
    { icon: Facebook, href: 'https://web.facebook.com/vauzatammaabadi/', label: 'Facebook' },
    { icon: TikTokIcon, href: 'https://www.tiktok.com/@vauzatamma_umroh', label: 'TikTok' },
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
                            <p className="text-white/55 text-xs mt-3 leading-relaxed italic border-t border-white/10 pt-3">
                                "...Dan (di antara) kewajiban manusia terhadap Allah adalah melaksanakan ibadah haji ke Baitullah, yaitu bagi orang-orang yang mampu mengadakan perjalanan ke sana..."
                            </p>
                        </div>

                        {/* Social icons */}
                        <div className="flex gap-3">
                            {social.map(({ icon: Icon, href, label }) => (
                                <a
                                    key={label}
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={label}
                                    className="w-9 h-9 rounded-xl bg-white/10 hover:bg-primary flex items-center justify-center transition-colors duration-200 text-white/70 hover:text-white"
                                >
                                    <Icon size={16} />
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
                        <div className="space-y-3">
                            <div className="flex items-start gap-3">
                                <Phone size={14} className="text-accent mt-0.5 shrink-0" />
                                <div className="text-white/55 text-sm leading-snug space-y-0.5">
                                    <p>0815 6666 777</p>
                                    <p>0851 8310 6545</p>
                                    <p>0855 5111 5500</p>
                                    <p>0817 7665 5000</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Mail size={14} className="text-accent mt-0.5 shrink-0" />
                                <span className="text-white/55 text-sm leading-snug">vauzatammapremium77@gmail.com</span>
                            </div>
                            <div className="flex items-start gap-3">
                                <MapPin size={14} className="text-accent mt-1 shrink-0" />
                                <div className="text-white/55 text-sm leading-snug space-y-1.5">
                                    <p>Jl. Kauman 21, Kota Malang - Jawa Timur</p>
                                    <p>Jl. Kemang Timur No. 3F, Kemang - Jakarta Selatan</p>
                                    <p>Royal Residence Cluster Crown Hill B15 No. 61, Lakarsantri – Surabaya</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-14 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/30">
                    <p>© 2025 Vauza Tamma Abadi Haji & Umroh. Semua hak dilindungi.</p>
                    <p>PPIU Resmi Kemenag RI · SK No. U.493 Tahun 2021 · Akreditasi A</p>
                </div>
            </div>
        </footer>
    )
}
