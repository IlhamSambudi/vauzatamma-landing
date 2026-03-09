import { motion } from 'framer-motion'
import { Shield, HeartHandshake, BadgeCheck, Clock, Users, Globe } from 'lucide-react'

const reasons = [
    {
        icon: Shield,
        title: 'PPIU Umroh Resmi Kemenag',
        desc: 'Kami terdaftar dan tersertifikasi oleh Kementerian Agama RI sebagai penyelenggara resmi PPIU Umroh dengan Akreditasi A.',
    },
    {
        icon: HeartHandshake,
        title: 'Pelayanan Penuh Kasih',
        desc: 'Tim pembimbing ibadah profesional mendampingi setiap langkah perjalanan Anda di Tanah Suci.',
    },
    {
        icon: BadgeCheck,
        title: 'Harga Transparan',
        desc: 'Tidak ada biaya tersembunyi. Semua biaya sudah termasuk dalam paket yang kami tawarkan.',
    },
    {
        icon: Clock,
        title: 'Jadwal Teratur',
        desc: 'Pemberangkatan terjadwal rapi sehingga jamaah dapat merencanakan perjalanan dengan tenang.',
    },
    {
        icon: Users,
        title: '10.000+ Jamaah',
        desc: 'Lebih dari satu dekade kepercayaan dengan ribuan jamaah yang telah kami berangkatkan.',
    },
    {
        icon: Globe,
        title: 'Hotel Bintang 5',
        desc: 'Akomodasi pilihan dekat Masjidil Haram dan Masjid Nabawi untuk kekhusyukan ibadah Anda.',
    },
]

export default function WhyUsSection() {
    return (
        <section id="about" className="section-pad bg-white">
            <div className="container-xl mx-auto">

                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.55 }}
                    className="text-center mb-16"
                >
                    <p className="section-label">Kenapa Memilih Kami</p>
                    <h2 className="section-title">
                        Perjalanan Ibadah yang{' '}
                        <span className="gradient-text">Berkualitas & Amanah</span>
                    </h2>
                    <p className="section-sub mx-auto text-center">
                        Kami berkomitmen memberikan pengalaman ibadah yang khusyuk, aman, dan berkesan bagi setiap jamaah.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {reasons.map((reason, i) => (
                        <motion.div
                            key={reason.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.45, delay: i * 0.08 }}
                            whileHover={{ y: -4 }}
                            className="card card-hover p-7 group"
                        >
                            <div className="w-11 h-11 rounded-xl bg-sage flex items-center justify-center mb-5 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                                <reason.icon size={20} className="text-primary group-hover:text-white transition-colors duration-300" />
                            </div>
                            <h3 className="font-bold text-gray-900 text-base mb-2">{reason.title}</h3>
                            <p className="text-gray-500 text-sm leading-relaxed">{reason.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
