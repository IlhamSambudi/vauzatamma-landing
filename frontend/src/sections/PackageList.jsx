// PackageList - fixed background using inline style
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { getPackages } from '../services/api'
import PackageCard from '../components/PackageCard'
import PackageDetailModal from '../components/PackageDetailModal'
import { Loader2 } from 'lucide-react'

export default function PackageList() {
    const [packages, setPackages] = useState([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState('all')
    const [selectedPackageId, setSelectedPackageId] = useState(null)

    useEffect(() => {
        getPackages()
            .then((res) => setPackages(res.data?.data || []))
            .catch(console.error)
            .finally(() => setLoading(false))
    }, [])

    const types = ['all', 'umroh', 'haji']
    const filtered = filter === 'all'
        ? packages
        : packages.filter(p => p.package_type?.toLowerCase() === filter)

    return (
        <section id="packages" className="section-pad" style={{ backgroundColor: '#f0faf4' }}>
            <div className="container-xl mx-auto">

                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.55 }}
                    className="text-center mb-14"
                >
                    <p className="section-label">Pilih Perjalanan Anda</p>
                    <h2 className="section-title">Paket <span className="gradient-text">Terbaik Kami</span></h2>
                    <p className="section-sub mx-auto text-center">
                        Berbagai pilihan paket haji dan umroh premium yang sesuai kebutuhan dan budget Anda.
                    </p>

                    {/* Filter tabs */}
                    <div className="flex justify-center gap-2 mt-8">
                        {types.map((t) => (
                            <button
                                key={t}
                                onClick={() => setFilter(t)}
                                className={`px-5 py-2 rounded-xl text-sm font-semibold capitalize transition-all duration-200 ${filter === t
                                    ? 'bg-primary text-white shadow-sm'
                                    : 'bg-white text-gray-500 border border-sage hover:border-secondary hover:text-primary'
                                    }`}
                            >
                                {t === 'all' ? 'Semua' : t.charAt(0).toUpperCase() + t.slice(1)}
                            </button>
                        ))}
                    </div>
                </motion.div>

                {loading ? (
                    <div className="flex justify-center items-center py-24">
                        <Loader2 className="animate-spin text-primary" size={40} />
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-24">
                        <p className="text-gray-400 text-base">Belum ada paket tersedia.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
                        {filtered.map((pkg, i) => (
                            <PackageCard
                                key={pkg.id || pkg.package_id || i}
                                pkg={pkg}
                                index={i}
                                onViewDetail={setSelectedPackageId}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Package detail modal */}
            {selectedPackageId && (
                <PackageDetailModal
                    packageId={selectedPackageId}
                    onClose={() => setSelectedPackageId(null)}
                />
            )}
        </section>
    )
}
