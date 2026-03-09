import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { getGallery } from '../services/api'
import { X, ZoomIn } from 'lucide-react'

const FALLBACK = [
    { id: 1, src: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=900&q=80', caption: 'Masjidil Haram, Makkah' },
    { id: 2, src: 'https://images.unsplash.com/photo-1564769662533-4f00a87b4056?auto=format&fit=crop&w=700&q=80', caption: 'Masjid Nabawi, Madinah' },
    { id: 3, src: 'https://images.unsplash.com/photo-1519058082700-08a0b56da9b4?auto=format&fit=crop&w=700&q=80', caption: "Ka'bah Al-Musyarrafah" },
    { id: 4, src: 'https://images.unsplash.com/photo-1443694400408-e6172a85b2e6?auto=format&fit=crop&w=700&q=80', caption: 'Kubah Masjid Nabawi' },
    { id: 5, src: 'https://images.unsplash.com/photo-1606040475932-96a1d4929e4b?auto=format&fit=crop&w=700&q=80', caption: 'Jamaah Haji di Arafah' },
    { id: 6, src: 'https://images.unsplash.com/photo-1568754690447-79bceadc0cf5?auto=format&fit=crop&w=700&q=80', caption: 'Gerbang Makkah Al-Mukarramah' },
]

export default function GalleryGrid() {
    const [gallery, setGallery] = useState([])
    const [lightbox, setLightbox] = useState(null)

    useEffect(() => {
        getGallery()
            .then((res) => setGallery(res.data?.data || []))
            .catch(console.error)
    }, [])

    const images = gallery.length > 0 ? gallery : FALLBACK

    return (
        <section id="gallery" className="section-pad" style={{ backgroundColor: '#f0faf4' }}>
            <div className="container-xl mx-auto">

                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-14"
                >
                    <p className="section-label">Galeri Foto</p>
                    <h2 className="section-title">Kenangan <span className="gradient-text">Perjalanan Suci</span></h2>
                    <p className="section-sub mx-auto text-center">Momen berharga jamaah kami di Tanah Haram.</p>
                </motion.div>

                <div className="grid grid-cols-2 md:grid-cols-3 auto-rows-[200px] md:auto-rows-[220px] gap-3">
                    {images.slice(0, 6).map((img, i) => {
                        // Bento layout patterns: 0=wide+tall, 1=normal, 2=wide, 3=tall, 4=normal, 5=normal
                        const bentoClass = [
                            'col-span-2 row-span-2',  // 0: big hero
                            'col-span-1 row-span-1',  // 1: normal
                            'col-span-1 row-span-1',  // 2: normal
                            'col-span-1 row-span-2',  // 3: tall
                            'col-span-1 row-span-1',  // 4: normal
                            'col-span-1 row-span-1',  // 5: normal
                        ][i] || 'col-span-1 row-span-1'
                        return (
                            <motion.div
                                key={img.id || i}
                                initial={{ opacity: 0, scale: 0.97 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: i * 0.07 }}
                                onClick={() => setLightbox(img)}
                                className={`${bentoClass} relative overflow-hidden rounded-2xl cursor-pointer group shadow-sm hover:shadow-xl transition-all duration-300`}
                            >
                                <img
                                    src={img.src || img.image_url || img.file_url || `/uploads/${img.file_path}`}
                                    alt={img.caption || img.title || 'Gallery'}
                                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                {/* Overlay on hover */}
                                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/25 transition-all duration-300 flex items-center justify-center">
                                    <ZoomIn size={28} className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 scale-90 group-hover:scale-100" />
                                </div>
                                {(img.caption || img.title) && (
                                    <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/50 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                        <p className="text-white text-xs font-semibold">{img.caption || img.title}</p>
                                    </div>
                                )}
                            </motion.div>
                        )
                    })}
                </div>
            </div>

            {/* Lightbox */}
            {lightbox && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
                    onClick={() => setLightbox(null)}
                >
                    <button
                        className="absolute top-5 right-5 text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors"
                        onClick={() => setLightbox(null)}
                    >
                        <X size={22} />
                    </button>
                    <img
                        src={lightbox.src || lightbox.file_url}
                        alt={lightbox.caption || 'Gallery'}
                        className="max-w-full max-h-[88vh] object-contain rounded-2xl shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    />
                    {lightbox.caption && (
                        <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white text-sm font-medium bg-black/40 px-4 py-2 rounded-full backdrop-blur-sm">
                            {lightbox.caption}
                        </p>
                    )}
                </motion.div>
            )}
        </section>
    )
}
