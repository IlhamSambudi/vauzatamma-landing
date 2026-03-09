import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getPackageById } from '../services/api'
import {
    X, Calendar, Users, Building2, Plane, CheckCircle,
    MapPin, Loader2, ArrowRight, Star, PhoneCall, FileDown
} from 'lucide-react'

const formatCurrency = (num) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num)

const formatDate = (dateStr) => {
    if (!dateStr) return '-'
    return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
}

const TIER_LABEL = {
    triple: 'Triple', double: 'Double', quad: 'Quad', vip: 'VIP', regular: 'Reguler',
    silver: 'Silver', gold: 'Gold', platinum: 'Platinum', net: 'Harga Net', 'net price': 'Harga Net'
}
const TIER_COLOR = {
    triple: 'bg-emerald-50  border-emerald-200  text-emerald-900',
    double: 'bg-blue-50     border-blue-200     text-blue-900',
    quad: 'bg-amber-50    border-amber-200    text-amber-900',
    vip: 'bg-purple-50   border-purple-200   text-purple-900',
    silver: 'bg-slate-50    border-slate-300    text-slate-900',
    gold: 'bg-amber-50    border-amber-300    text-amber-900',
    platinum: 'bg-violet-50   border-violet-300   text-violet-900',
    net: 'bg-emerald-50  border-emerald-200  text-emerald-900',
    'net price': 'bg-emerald-50 border-emerald-200 text-emerald-900',
}
// Icon accent colors per tier for upgrade pills
const TIER_BADGE = {
    silver: 'bg-slate-100  text-slate-600',
    gold: 'bg-amber-100  text-amber-700',
    platinum: 'bg-violet-100 text-violet-700',
    net: 'bg-emerald-100 text-emerald-700',
    'net price': 'bg-emerald-100 text-emerald-700',
}

export default function PackageDetailModal({ packageId, onClose }) {
    const [pkg, setPkg] = useState(null)
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState('overview')

    useEffect(() => {
        if (!packageId) return
        setLoading(true)
        getPackageById(packageId)
            .then(res => setPkg(res.data?.data || null))
            .catch(console.error)
            .finally(() => setLoading(false))
    }, [packageId])

    // Close on Escape
    const handleKeyDown = useCallback((e) => {
        if (e.key === 'Escape') onClose()
    }, [onClose])

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown)
        document.body.style.overflow = 'hidden'
        return () => {
            document.removeEventListener('keydown', handleKeyDown)
            document.body.style.overflow = ''
        }
    }, [handleKeyDown])

    const tabs = ['overview', 'hotels', 'pricing']

    const minPrice = pkg?.prices?.length > 0
        ? Math.min(...pkg.prices.map(p => parseFloat(p.price)))
        : null

    const waMsg = pkg?.package?.package_name
        ? `Assalamualaikum, saya ingin info lebih lanjut tentang paket ${pkg.package.package_name}`
        : 'Assalamualaikum, saya ingin info tentang paket umroh'

    return (
        <AnimatePresence>
            {/* Backdrop */}
            <motion.div
                key="backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            >
                {/* Modal panel */}
                <motion.div
                    key="panel"
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    transition={{ type: 'spring', damping: 26, stiffness: 300 }}
                    onClick={e => e.stopPropagation()}
                    className="bg-white rounded-3xl w-[95%] sm:w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl"
                >
                    {/* Header */}
                    <div className="relative h-40 bg-gradient-to-br from-emerald-700 to-emerald-500 flex-shrink-0 overflow-hidden">
                        {pkg?.assets?.[0]?.asset_url ? (
                            <img
                                src={pkg.assets[0].asset_url}
                                alt=""
                                className="w-full h-full object-cover opacity-60"
                            />
                        ) : (
                            <span className="absolute inset-0 flex items-center justify-center text-8xl opacity-10">🕌</span>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                        {/* Close button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 w-9 h-9 bg-white/20 hover:bg-white/35 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-colors"
                        >
                            <X size={18} />
                        </button>

                        <div className="absolute bottom-4 left-5 right-14">
                            {loading ? null : (
                                <>
                                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500 text-white mb-2 inline-block">
                                        {pkg?.package?.program_type || 'Umroh'}
                                    </span>
                                    <h2 className="text-white font-black text-lg leading-tight">
                                        {pkg?.package?.package_name || '—'}
                                    </h2>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Loading */}
                    {loading && (
                        <div className="flex-1 flex items-center justify-center">
                            <Loader2 className="animate-spin text-emerald-500" size={40} />
                        </div>
                    )}

                    {/* Content */}
                    {!loading && pkg && (
                        <>
                            {/* Key info bar */}
                            <div className="flex items-center gap-5 px-5 py-3 border-b border-gray-100 bg-emerald-50/50 text-xs flex-shrink-0 overflow-x-auto">
                                {pkg.departures?.[0] && (
                                    <div className="flex items-center gap-1.5 text-gray-600 whitespace-nowrap">
                                        <Calendar size={13} className="text-emerald-600" />
                                        <span>{formatDate(pkg.departures[0].departure_date)}</span>
                                    </div>
                                )}
                                {pkg.package?.remaining_seat != null && (
                                    <div className="flex items-center gap-1.5 text-gray-600 whitespace-nowrap">
                                        <Users size={13} className="text-emerald-600" />
                                        <span>{pkg.package.remaining_seat} kursi tersisa</span>
                                    </div>
                                )}
                                {pkg.airline?.name && (
                                    <div className="flex items-center gap-1.5 text-gray-600 whitespace-nowrap">
                                        <Plane size={13} className="text-emerald-600" />
                                        <span>{pkg.airline.name}</span>
                                    </div>
                                )}
                                {pkg.package?.plus_destination && (
                                    <div className="flex items-center gap-1.5 text-gray-600 whitespace-nowrap">
                                        <MapPin size={13} className="text-emerald-600" />
                                        <span>+{pkg.package.plus_destination}</span>
                                    </div>
                                )}
                            </div>

                            {/* Tabs */}
                            <div className="flex border-b border-gray-100 flex-shrink-0 px-5">
                                {tabs.map(tab => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`px-4 py-3 text-xs font-semibold border-b-2 -mb-px transition-all ${activeTab === tab
                                            ? 'border-emerald-500 text-emerald-600'
                                            : 'border-transparent text-gray-400 hover:text-gray-600'
                                            }`}
                                    >
                                        {tab === 'overview' ? 'Ringkasan & Fasilitas'
                                            : tab === 'hotels' ? 'Hotel'
                                                : 'Harga'}
                                    </button>
                                ))}
                            </div>

                            {/* Tab body — scrollable */}
                            <div className="flex-1 overflow-y-auto px-5 py-5">
                                {/* OVERVIEW */}
                                {activeTab === 'overview' && (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
                                        {pkg.package?.description && (
                                            <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">
                                                {pkg.package.description}
                                            </p>
                                        )}

                                        {pkg.departures?.length > 1 && (
                                            <div>
                                                <p className="text-[11px] text-gray-400 uppercase tracking-wider font-semibold mb-2">Jadwal Keberangkatan</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {pkg.departures.map((d, i) => (
                                                        <span key={i} className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-100 rounded-lg text-xs text-emerald-700 font-medium">
                                                            <Calendar size={11} />
                                                            {formatDate(d.departure_date)}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {pkg.features?.length > 0 && (
                                            <div>
                                                <p className="text-[11px] text-gray-400 uppercase tracking-wider font-semibold mb-3">Fasilitas Termasuk</p>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                    {pkg.features.map((f, i) => (
                                                        <div key={i} className="flex items-start gap-2.5">
                                                            <CheckCircle size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                                                            <span className="text-gray-700 text-sm">{typeof f === 'string' ? f : (f.feature || f.feature_name)}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Star rating */}
                                        <div className="flex items-center gap-1 pt-1">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} size={12} className="text-amber-400 fill-amber-400" />
                                            ))}
                                            <span className="text-xs text-gray-400 ml-1">Layanan Premium Terpercaya</span>
                                        </div>
                                    </motion.div>
                                )}

                                {/* HOTELS */}
                                {activeTab === 'hotels' && (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                        {pkg.hotels?.length > 0 ? (
                                            <div className="grid sm:grid-cols-2 gap-4">
                                                {pkg.hotels.map((hotel, i) => (
                                                    <div key={i} className="border border-gray-100 rounded-2xl p-4 bg-gray-50">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <Building2 size={13} className="text-amber-500" />
                                                            <span className="text-xs font-bold uppercase text-amber-600">
                                                                {hotel.stay_city || hotel.city}
                                                            </span>
                                                        </div>
                                                        <p className="font-bold text-gray-900 text-sm">{hotel.name || hotel.hotel_name}</p>
                                                        <p className="text-gray-400 text-xs mt-1">
                                                            {'★'.repeat(hotel.star_rating || 5)} Hotel
                                                        </p>
                                                        {hotel.nights && (
                                                            <p className="text-emerald-600 text-xs font-semibold mt-2">
                                                                {hotel.nights} malam
                                                            </p>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-gray-400 text-center py-8 text-sm">Info hotel belum tersedia.</p>
                                        )}
                                    </motion.div>
                                )}

                                {/* PRICING */}
                                {activeTab === 'pricing' && (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                                        {pkg.prices?.length > 0 ? (
                                            <>
                                                <p className="text-[11px] text-gray-400 uppercase tracking-wider font-semibold">
                                                    {pkg.prices.length > 1 ? 'Pilihan Tipe Paket' : 'Harga Paket'}
                                                </p>
                                                <div className="grid sm:grid-cols-2 gap-4">
                                                    {pkg.prices.map((p, i) => {
                                                        const tierKey = p.tier?.toLowerCase()
                                                        const colorClass = TIER_COLOR[tierKey] || 'bg-gray-50 border-gray-200 text-gray-900'
                                                        const badgeClass = TIER_BADGE[tierKey] || 'bg-gray-100 text-gray-600'
                                                        const hasTriple = parseFloat(p.upgrade_triple) > 0
                                                        const hasDouble = parseFloat(p.upgrade_double) > 0
                                                        return (
                                                            <div key={i} className={`border rounded-2xl p-5 ${colorClass}`}>
                                                                {/* Tier header */}
                                                                <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-1">
                                                                    {TIER_LABEL[tierKey] || p.tier}
                                                                </p>

                                                                {/* Base price (normal/quad) */}
                                                                <p className="text-2xl font-black">{formatCurrency(parseFloat(p.price))}</p>
                                                                <p className="text-[11px] opacity-50 mt-0.5 mb-4">/orang · kamar quad (4 orang)</p>

                                                                {/* Upgrade options */}
                                                                {(hasTriple || hasDouble) && (
                                                                    <div className="space-y-2 pt-3 border-t border-current/10">
                                                                        <p className="text-[10px] uppercase tracking-wide font-bold opacity-50 mb-2">Upgrade Kamar</p>
                                                                        {hasTriple && (
                                                                            <div className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold ${badgeClass}`}>
                                                                                <span>Triple (3 orang)</span>
                                                                                <span>+{formatCurrency(parseFloat(p.upgrade_triple))}</span>
                                                                            </div>
                                                                        )}
                                                                        {hasDouble && (
                                                                            <div className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold ${badgeClass}`}>
                                                                                <span>Double (2 orang)</span>
                                                                                <span>+{formatCurrency(parseFloat(p.upgrade_double))}</span>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            </>
                                        ) : (
                                            <p className="text-gray-400 text-center py-8 text-sm">Info harga belum tersedia.</p>
                                        )}
                                    </motion.div>
                                )}
                            </div>

                            {/* Footer CTA */}
                            <div className="flex-shrink-0 border-t border-gray-100 px-5 py-4 flex flex-col sm:flex-row items-center gap-3 bg-gray-50/80">
                                {minPrice && (
                                    <div className="sm:mr-auto">
                                        <p className="text-[10px] text-gray-400 uppercase tracking-wider">Harga mulai</p>
                                        <p className="text-lg font-black text-emerald-600">{formatCurrency(minPrice)}</p>
                                    </div>
                                )}
                                <a
                                    href={`https://wa.me/628156666777?text=${encodeURIComponent(waMsg)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors w-full sm:w-auto"
                                >
                                    <PhoneCall size={15} />
                                    Daftar / Konsultasi
                                </a>
                                {/* PDF Download button — only show if itinerary PDF exists */}
                                {pkg?.itinerary?.[0]?.pdf_url && (
                                    <a
                                        href={pkg.itinerary[0].pdf_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        download
                                        className="flex items-center justify-center gap-2 border border-emerald-200 text-emerald-600 hover:bg-emerald-50 font-semibold text-sm px-4 py-2.5 rounded-xl transition-colors w-full sm:w-auto"
                                    >
                                        <FileDown size={15} />
                                        Itinerary PDF
                                    </a>
                                )}
                                <button
                                    onClick={onClose}
                                    className="flex items-center justify-center gap-1.5 border border-gray-200 text-gray-500 hover:text-gray-700 hover:border-gray-300 font-medium text-sm px-4 py-2.5 rounded-xl transition-colors w-full sm:w-auto"
                                >
                                    Tutup <ArrowRight size={13} className="rotate-90" />
                                </button>
                            </div>
                        </>
                    )}

                    {/* Not found */}
                    {!loading && !pkg && (
                        <div className="flex-1 flex flex-col items-center justify-center gap-3 p-8">
                            <p className="text-gray-400">Data paket tidak ditemukan.</p>
                            <button onClick={onClose} className="text-sm text-emerald-600 font-medium underline">Tutup</button>
                        </div>
                    )}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}
