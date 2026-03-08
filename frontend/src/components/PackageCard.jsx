import { motion } from 'framer-motion'
import { Calendar, Users, Building2, Plane, Star, ArrowRight } from 'lucide-react'

const TIER_STYLE = {
    'net price': 'bg-blue-50 text-blue-700 border-blue-200',
    silver: 'bg-slate-100 text-slate-600 border-slate-300',
    gold: 'bg-amber-100 text-yellow-700 border-amber-300',
    platinum: 'bg-gradient-to-r from-gray-800 to-gray-900 text-white border-gray-700 shadow-sm'
}

const formatCurrency = (num) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num)

const formatDate = (dateStr) => {
    if (!dateStr) return '-'
    return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default function PackageCard({ pkg, index, onViewDetail }) {
    const lowestPrice = pkg.prices?.reduce(
        (min, p) => (p.price < min.price ? p : min),
        pkg.prices[0]
    )
    const nextDeparture = pkg.departures?.[0]
    const hotels = pkg.hotels || []
    const makkahHotel = hotels.find(h =>
        h.hotel_city?.toLowerCase().includes('makkah') || h.city?.toLowerCase().includes('makkah')
    )
    const madinahHotel = hotels.find(h =>
        h.hotel_city?.toLowerCase().includes('madinah') || h.city?.toLowerCase().includes('madinah')
    )
    const seats = nextDeparture?.available_seats ?? pkg.available_seats

    return (
        <motion.div
            initial={{ opacity: 0, y: 36 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: index * 0.09 }}
            className="card card-hover group flex flex-col overflow-hidden"
        >
            {/* Image / Banner */}
            <div className="relative h-48 bg-gradient-to-br from-sage to-accent/30 overflow-hidden">
                {pkg.assets?.[0]?.file_url ? (
                    <img
                        src={`/uploads/${pkg.assets[0].file_url}`}
                        alt={pkg.package_name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <span className="text-7xl opacity-15">🕌</span>
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-white/60 to-transparent" />

                {/* Type badge */}
                <div className="absolute top-3 left-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${pkg.package_type === 'haji'
                        ? 'bg-gold/90 text-white'
                        : 'bg-primary/90 text-white'
                        }`}>
                        {pkg.package_type || 'Umroh'}
                    </span>
                </div>

                {/* Seat badge */}
                {seats !== undefined && (
                    <div className="absolute top-3 right-3">
                        <span className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-white/90 backdrop-blur-sm ${seats < 10 ? 'text-red-500' : 'text-primary'
                            }`}>
                            <Users size={11} />
                            {seats} Kursi
                        </span>
                    </div>
                )}
            </div>

            {/* Body */}
            <div className="p-5 flex flex-col flex-1">
                <h3 className="font-bold text-gray-900 text-base leading-snug mb-3 group-hover:text-primary transition-colors line-clamp-2">
                    {pkg.package_name}
                </h3>

                <div className="space-y-2 text-sm mb-4">
                    {nextDeparture && (
                        <div className="flex items-center gap-2 text-gray-500">
                            <Calendar size={13} className="text-secondary shrink-0" />
                            <span>{formatDate(nextDeparture.departure_date)}</span>
                        </div>
                    )}
                    {pkg.airline?.airline_name && (
                        <div className="flex items-center gap-2 text-gray-500">
                            <Plane size={13} className="text-secondary shrink-0" />
                            <span>{pkg.airline.airline_name}</span>
                        </div>
                    )}
                    {makkahHotel && (
                        <div className="flex items-center gap-2 text-gray-500">
                            <Building2 size={13} className="text-gold shrink-0" />
                            <span><span className="text-gray-700 font-medium">Makkah:</span> {makkahHotel.hotel_name || makkahHotel.name}</span>
                        </div>
                    )}
                    {madinahHotel && (
                        <div className="flex items-center gap-2 text-gray-500">
                            <Building2 size={13} className="text-gold shrink-0" />
                            <span><span className="text-gray-700 font-medium">Madinah:</span> {madinahHotel.hotel_name || madinahHotel.name}</span>
                        </div>
                    )}
                </div>

                {/* Price tiers */}
                {pkg.prices?.length > 0 && (
                    <div className="mb-4 pt-3 border-t border-sage/40">
                        <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-2 font-semibold">Harga Mulai</p>
                        <div className="flex flex-wrap gap-1.5">
                            {pkg.prices.slice(0, 3).map((price, i) => (
                                <span key={i} className={`inline-flex flex-col items-start px-2.5 py-1.5 rounded-lg text-xs ${TIER_STYLE[price.tier?.toLowerCase()] || 'bg-gray-100 text-gray-600 border border-gray-200'}`}>
                                    <span className="font-semibold uppercase tracking-wide text-[9px] opacity-70">{price.tier}</span>
                                    <span className="font-bold">{formatCurrency(price.price)}</span>
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Stars */}
                <div className="flex items-center gap-0.5 mb-4">
                    {[...Array(5)].map((_, i) => (
                        <Star key={i} size={11} className="text-gold fill-gold" />
                    ))}
                    <span className="text-xs text-gray-400 ml-1.5">5.0 (Terpercaya)</span>
                </div>

                {/* CTA button */}
                <div className="mt-auto">
                    <button
                        onClick={() => onViewDetail(pkg.id)}
                        className="w-full flex items-center justify-center gap-2 border border-primary/30 hover:bg-primary hover:text-white text-primary bg-sage/30 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 group/btn"
                    >
                        Lihat Detail Paket
                        <ArrowRight size={15} className="group-hover/btn:translate-x-1 transition-transform duration-200" />
                    </button>
                </div>
            </div>
        </motion.div>
    )
}
