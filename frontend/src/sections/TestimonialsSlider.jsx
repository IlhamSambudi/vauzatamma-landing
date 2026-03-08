import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import { Star, Quote } from 'lucide-react'
import { getTestimonials } from '../services/api'

const FALLBACK = [
    { id: 1, name: 'Hj. Fatimah Zahra', city: 'Jakarta', rating: 5, content: 'Alhamdulillah, perjalanan umroh bersama Vauza Tamma sangat berkesan. Pembimbing ibadah sangat berpengalaman dan sabar.' },
    { id: 2, name: 'Ustaz Ridwan', city: 'Surabaya', rating: 5, content: 'Pelayanan luar biasa! Hotel dekat Masjidil Haram, makanan enak, dan teman seperjalanan yang solid.' },
    { id: 3, name: 'Ibu Siti Nurhaliza', city: 'Bandung', rating: 5, content: 'Sudah 2x umroh bersama Vauza Tamma. Profesional, amanah, dan biaya transparan. Insyaallah akan berangkat lagi!' },
    { id: 4, name: 'Bapak Ahmad Fauzi', city: 'Medan', rating: 5, content: 'Tidak mengira lancar sekali prosesnya. Dari visa hingga hotel, semua diurus dengan baik. Jazakallahu khairan!' },
]

export default function TestimonialsSlider() {
    const [testimonials, setTestimonials] = useState([])

    useEffect(() => {
        getTestimonials()
            .then((res) => {
                const data = res.data?.data
                setTestimonials(data?.length ? data : FALLBACK)
            })
            .catch(() => setTestimonials(FALLBACK))
    }, [])

    return (
        <section id="testimonials" className="section-pad bg-white">
            <div className="container-xl mx-auto">

                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-14"
                >
                    <p className="section-label">Testimoni Jamaah</p>
                    <h2 className="section-title">Kata Mereka <span className="gradient-text">Tentang Kami</span></h2>
                    <p className="section-sub mx-auto text-center">
                        Pengalaman nyata ribuan jamaah yang telah kami berangkatkan ke Tanah Suci.
                    </p>
                </motion.div>

                <Swiper
                    modules={[Autoplay, Pagination]}
                    slidesPerView={1}
                    spaceBetween={24}
                    autoplay={{ delay: 4500, disableOnInteraction: false }}
                    pagination={{ clickable: true }}
                    breakpoints={{
                        640: { slidesPerView: 2 },
                        1024: { slidesPerView: 3 },
                    }}
                    className="pb-12"
                >
                    {testimonials.map((t) => (
                        <SwiperSlide key={t.id || t.testimonial_id}>
                            <motion.div
                                whileHover={{ y: -4 }}
                                className="card p-6 h-full flex flex-col"
                            >
                                <Quote size={24} className="text-accent mb-4" />
                                <p className="text-gray-600 text-sm leading-relaxed italic flex-1 whitespace-pre-wrap">
                                    "{t.message || t.content || t.testimonial_text}"
                                </p>

                                <div className="mt-5 pt-4 border-t" style={{ borderColor: 'rgba(224,242,233,0.6)' }} >
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-sm shrink-0">
                                            {(t.name || t.customer_name || 'J').charAt(0)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-gray-900 text-sm truncate">{t.name || t.customer_name}</p>
                                            <p className="text-gray-400 text-xs">{t.city || t.location || 'Indonesia'}</p>
                                        </div>
                                        <div className="flex gap-0.5 shrink-0">
                                            {[...Array(t.rating || 5)].map((_, i) => (
                                                <Star key={i} size={11} style={{ color: '#e6b422', fill: '#e6b422' }} />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    )
}
