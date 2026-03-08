import { motion } from 'framer-motion'
import { ChevronDown, Phone } from 'lucide-react'
import heroBg from '../assets/bg.png'

const stats = [
    { value: '10K+', label: 'Jamaah' },
    { value: '9+', label: 'Tahun Pengalaman' },
    { value: '4.9★', label: 'Penilaian Jamaah' },
]

export default function HeroSection() {
    const scrollTo = (id) => {
        const el = document.querySelector(id)
        if (el) el.scrollIntoView({ behavior: 'smooth' })
    }

    return (
        <section id="hero" className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-[68px]">

            {/* Background image */}
            <div className="absolute inset-0">
                <img
                    src={heroBg}
                    alt="Masjid Al-Haram"
                    className="w-full h-full object-cover object-center scale-105"
                    style={{ filter: 'brightness(0.62) saturate(1.1)' }}
                />
                {/* Cinematic layered overlay */}
                <div className="absolute inset-0" style={{
                    background: 'linear-gradient(to bottom, rgba(6,20,15,0.55) 0%, rgba(6,20,15,0.25) 40%, rgba(6,20,15,0.70) 100%)'
                }} />
                {/* Vignette edges */}
                <div className="absolute inset-0" style={{
                    background: 'radial-gradient(ellipse at center, transparent 50%, rgba(4,14,10,0.6) 100%)'
                }} />
            </div>

            {/* Content */}
            <div className="relative z-10 text-center px-4 max-w-4xl mx-auto flex-1 flex flex-col items-center justify-center">

                {/* Trust badge */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                >
                    <span className="inline-flex items-center gap-2 rounded-full px-5 py-2 text-xs font-semibold mb-8 backdrop-blur-md border"
                        style={{
                            background: 'rgba(255,255,255,0.08)',
                            borderColor: 'rgba(230,180,34,0.45)',
                            color: '#f5d87a',
                            letterSpacing: '0.04em'
                        }}
                    >
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#e6b422' }} />
                        Terpercaya Sejak 2015 · PPIU Resmi Kemenag RI
                    </span>
                </motion.div>

                {/* Headline */}
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.25 }}
                    className="font-black leading-[1.08] tracking-tight mb-5"
                    style={{ fontSize: 'clamp(2.6rem, 7vw, 5rem)' }}
                >
                    <span className="text-white drop-shadow-lg">Haji &amp; Umroh</span>
                    <span className="block mt-2" style={{
                        background: 'linear-gradient(100deg, #c4f0e0 0%, #5ec4ad 55%, #3a9b8e 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                    }}>
                        Bersama Vauza Tamma
                    </span>
                </motion.h1>

                {/* Subtext */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="text-base md:text-lg max-w-xl mx-auto mb-10 leading-relaxed"
                    style={{ color: 'rgba(220,220,210,0.85)' }}
                >
                    Wujudkan impian suci Anda menuju Tanah Haram dengan layanan premium, amanah, dan penuh keberkahan bersama tim profesional kami.
                </motion.p>

                {/* CTA buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.55 }}
                    className="flex flex-col sm:flex-row gap-3 justify-center"
                >
                    {/* Green CTA button */}
                    <button
                        onClick={() => scrollTo('#packages')}
                        className="relative overflow-hidden rounded-xl px-8 py-3.5 text-sm font-bold transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg"
                        style={{
                            background: 'linear-gradient(135deg, #5ec4ad 0%, #2e9082 100%)',
                            color: '#ffffff',
                            boxShadow: '0 4px 24px rgba(46,144,130,0.40)',
                        }}
                    >
                        <span className="relative z-10">Lihat Paket</span>
                    </button>

                    {/* Glass outline button */}
                    <a
                        href="https://wa.me/6281234567890?text=Assalamualaikum%20saya%20ingin%20info%20paket%20umroh"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 rounded-xl px-8 py-3.5 text-sm font-semibold transition-all duration-300 hover:scale-105 active:scale-95 backdrop-blur-md border"
                        style={{
                            background: 'rgba(255,255,255,0.1)',
                            borderColor: 'rgba(255,255,255,0.35)',
                            color: '#ffffff',
                        }}
                    >
                        <Phone size={15} />
                        Konsultasi Sekarang
                    </a>
                </motion.div>

                {/* Stats — glassmorphism cards */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.75 }}
                    className="mt-16 flex flex-wrap justify-center gap-4"
                >
                    {stats.map((s, i) => (
                        <div
                            key={s.label}
                            className="flex flex-col items-center backdrop-blur-md rounded-2xl px-7 py-4 border transition-all duration-300 hover:scale-105"
                            style={{
                                background: i === 0
                                    ? 'linear-gradient(135deg, rgba(94,196,173,0.20) 0%, rgba(255,255,255,0.06) 100%)'
                                    : 'rgba(255,255,255,0.08)',
                                borderColor: i === 0
                                    ? 'rgba(94,196,173,0.45)'
                                    : 'rgba(255,255,255,0.18)',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                            }}
                        >
                            <span className="text-2xl font-black" style={{
                                background: 'linear-gradient(120deg, #c4f0e0 0%, #5ec4ad 60%, #3a9b8e 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                            }}>
                                {s.value}
                            </span>
                            <span className="text-xs mt-0.5 whitespace-nowrap" style={{ color: 'rgba(210,210,200,0.75)' }}>
                                {s.label}
                            </span>
                        </div>
                    ))}
                </motion.div>
            </div>

            {/* Scroll cue */}
            <motion.button
                onClick={() => scrollTo('#airlines')}
                className="relative z-10 mb-8"
                style={{ color: 'rgba(255,255,255,0.35)' }}
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                whileHover={{ color: 'rgba(230,180,34,0.8)' }}
            >
                <ChevronDown size={32} />
            </motion.button>
        </section>
    )
}
