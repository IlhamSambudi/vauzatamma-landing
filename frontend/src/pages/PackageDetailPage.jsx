import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getPackageById } from '../services/api'
import { Calendar, Users, Building2, Plane, ChevronLeft, CheckCircle, Download, MapPin, Loader2 } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import WhatsAppButton from '../components/WhatsAppButton'

const formatCurrency = (num) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num)

const formatDate = (dateStr) => {
    if (!dateStr) return '-'
    return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
}

const TIER_COLORS = {
    gold: 'border-gold-500 bg-gold-500/10',
    platinum: 'border-blue-400 bg-blue-400/10',
    silver: 'border-gray-400 bg-gray-400/10',
    vip: 'border-purple-400 bg-purple-400/10',
    regular: 'border-emerald-500 bg-emerald-500/10',
}

export default function PackageDetailPage() {
    const { id } = useParams()
    const [pkg, setPkg] = useState(null)
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState('overview')

    useEffect(() => {
        getPackageById(id)
            .then((res) => setPkg(res.data?.data || null))
            .catch(console.error)
            .finally(() => setLoading(false))
    }, [id])

    if (loading) return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center">
            <Loader2 className="animate-spin text-emerald-500" size={48} />
        </div>
    )

    if (!pkg) return (
        <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center gap-4">
            <p className="text-gray-400 text-lg">Paket tidak ditemukan.</p>
            <Link to="/" className="btn-primary">Kembali ke Beranda</Link>
        </div>
    )

    const tabs = ['overview', 'itinerary', 'hotels', 'pricing']

    return (
        <div className="bg-gray-950 min-h-screen">
            <Navbar />

            {/* Hero Banner */}
            <div className="relative h-72 md:h-96 overflow-hidden">
                {pkg.assets?.[0]?.file_url ? (
                    <img src={`/uploads/${pkg.assets[0].file_url}`} alt={pkg.package?.package_name} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-emerald-900 to-gray-900 flex items-center justify-center">
                        <span className="text-8xl opacity-20">🕌</span>
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/50 to-transparent" />
                <div className="absolute bottom-8 left-8 right-8">
                    <Link to="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-4 transition-colors">
                        <ChevronLeft size={16} /> Kembali
                    </Link>
                    <div className="flex items-center gap-3 mb-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${pkg.package?.package_type === 'haji' ? 'bg-gold-500 text-gray-900' : 'bg-emerald-600 text-white'
                            }`}>
                            {pkg.package?.package_type || 'Umroh'}
                        </span>
                    </div>
                    <h1 className="text-2xl md:text-4xl font-black text-white">{pkg.package?.package_name}</h1>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        {/* Tabs */}
                        <div className="flex gap-2 mb-8 border-b border-white/10 overflow-x-auto">
                            {tabs.map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-4 py-3 text-sm font-semibold capitalize whitespace-nowrap transition-all border-b-2 -mb-px ${activeTab === tab
                                        ? 'border-emerald-500 text-emerald-400'
                                        : 'border-transparent text-gray-500 hover:text-gray-300'
                                        }`}
                                >
                                    {tab === 'overview' ? 'Ringkasan' : tab === 'itinerary' ? 'Itinerary' : tab === 'hotels' ? 'Hotel' : 'Harga'}
                                </button>
                            ))}
                        </div>

                        {/* Overview */}
                        {activeTab === 'overview' && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                <p className="text-gray-400 leading-relaxed mb-8 whitespace-pre-wrap">{pkg.package?.description || 'Nikmati perjalanan ibadah yang khusyuk bersama tim profesional kami.'}</p>
                                {pkg.features?.length > 0 && (
                                    <div>
                                        <h3 className="text-white font-bold text-lg mb-4">Fasilitas Paket</h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {pkg.features.map((f, i) => (
                                                <div key={i} className="flex items-start gap-3">
                                                    <CheckCircle size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                                                    <span className="text-gray-300 text-sm">{f.feature_name || f.feature}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {pkg.airline && (
                                    <div className="mt-8 card-glass p-5 flex items-center gap-4">
                                        <Plane className="text-emerald-400" size={24} />
                                        <div>
                                            <p className="text-xs text-gray-500">Maskapai</p>
                                            <p className="text-white font-semibold">{pkg.airline.airline_name}</p>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {/* Itinerary */}
                        {activeTab === 'itinerary' && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                {pkg.itinerary?.length > 0 ? (
                                    <div className="space-y-4">
                                        {pkg.itinerary.map((day, i) => (
                                            <div key={i} className="card-glass p-5">
                                                <p className="text-emerald-400 font-bold text-sm mb-1">Hari {day.day_number || i + 1}</p>
                                                <p className="text-white font-semibold mb-2">{day.title || day.activity_title}</p>
                                                <p className="text-gray-400 text-sm whitespace-pre-wrap">{day.description || day.activity_description}</p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12 text-gray-500">
                                        <MapPin size={40} className="mx-auto mb-3 opacity-30" />
                                        <p>Itinerary belum tersedia. Hubungi tim kami untuk detail.</p>
                                    </div>
                                )}
                                {pkg.assets?.find(a => a.asset_type === 'itinerary') && (
                                    <a
                                        href={`/uploads/${pkg.assets.find(a => a.asset_type === 'itinerary').file_url}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-6 btn-outline flex items-center justify-center gap-2 w-full"
                                    >
                                        <Download size={16} /> Download Itinerary PDF
                                    </a>
                                )}
                            </motion.div>
                        )}

                        {/* Hotels */}
                        {activeTab === 'hotels' && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                <div className="grid sm:grid-cols-2 gap-5">
                                    {pkg.hotels?.map((hotel, i) => (
                                        <div key={i} className="card-glass p-5">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Building2 size={16} className="text-gold-400" />
                                                <span className="text-gold-400 text-xs font-semibold uppercase">{hotel.city || hotel.hotel_city}</span>
                                            </div>
                                            <p className="text-white font-bold">{hotel.hotel_name || hotel.name}</p>
                                            <p className="text-gray-500 text-xs mt-1">{hotel.star_rating || hotel.stars || 5}★ Hotel</p>
                                            {hotel.nights && <p className="text-gray-400 text-sm mt-2">{hotel.nights} malam</p>}
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* Pricing */}
                        {activeTab === 'pricing' && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    {pkg.prices?.map((price, i) => (
                                        <div key={i} className={`card-glass p-6 border ${TIER_COLORS[price.tier_name?.toLowerCase()] || 'border-white/10'}`}>
                                            <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">{price.tier_name}</p>
                                            <p className="text-3xl font-black text-white">{formatCurrency(price.price)}</p>
                                            {price.description && <p className="text-gray-500 text-xs mt-2">{price.description}</p>}
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-5">
                        {/* CTA Card */}
                        <div className="card-glass p-6 sticky top-24">
                            <p className="text-gray-400 text-xs mb-2">Harga mulai dari</p>
                            <p className="text-3xl font-black gradient-text mb-1">
                                {pkg.prices?.length > 0 ? formatCurrency(Math.min(...pkg.prices.map(p => p.price))) : 'Hubungi Kami'}
                            </p>
                            <p className="text-gray-500 text-xs mb-6">/orang</p>

                            {pkg.departures?.[0] && (
                                <div className="mb-5 space-y-2">
                                    <div className="flex items-center gap-2 text-sm text-gray-400">
                                        <Calendar size={14} className="text-emerald-500" />
                                        {formatDate(pkg.departures[0].departure_date)}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-400">
                                        <Users size={14} className="text-emerald-500" />
                                        {pkg.departures[0].available_seats} kursi tersisa
                                    </div>
                                </div>
                            )}

                            <a
                                href={`https://wa.me/628156666777?text=Assalamualaikum%2C%20saya%20ingin%20info%20lebih%20lanjut%20tentang%20paket%20${encodeURIComponent(pkg.package?.package_name || '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-primary w-full flex items-center justify-center gap-2 mb-3"
                            >
                                Daftar Sekarang
                            </a>
                            <a
                                href={`https://wa.me/628156666777?text=Assalamualaikum%20saya%20ingin%20konsultasi%20paket%20${encodeURIComponent(pkg.package?.package_name || '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-outline w-full flex items-center justify-center gap-2"
                            >
                                Konsultasi Dulu
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
            <WhatsAppButton />
        </div>
    )
}
