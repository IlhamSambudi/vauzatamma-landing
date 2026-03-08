import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getFaq } from '../services/api'
import { ChevronDown } from 'lucide-react'

const FALLBACK = [
    { id: 1, question: 'Berapa lama proses pendaftaran umroh?', answer: 'Proses pendaftaran membutuhkan waktu 7–14 hari kerja, termasuk pengurusan visa dan dokumen lainnya.' },
    { id: 2, question: 'Dokumen apa saja yang diperlukan?', answer: 'Anda memerlukan paspor (minimal 6 bulan berlaku), KTP, KK, buku nikah/akta lahir, pas foto, dan vaksin meningitis.' },
    { id: 3, question: 'Apakah ada cicilan untuk paket umroh?', answer: 'Ya, kami menyediakan program cicilan yang fleksibel. Hubungi tim kami untuk informasi lebih lanjut.' },
    { id: 4, question: 'Apakah ada pembimbing ibadah resmi?', answer: 'Setiap grup dipimpin oleh ustaz pembimbing bersertifikat dari Kemenag yang berpengalaman membimbing ibadah di Tanah Suci.' },
    { id: 5, question: 'Bagaimana dengan anak di bawah umur?', answer: 'Anak-anak diizinkan berangkat umroh dengan persyaratan dokumen tertentu. Tim kami akan memandu proses pendaftaran anak.' },
    { id: 6, question: 'Apa yang termasuk dalam paket All-Inclusive?', answer: 'Tiket pesawat (PP), akomodasi hotel, konsumsi 3x sehari, transportasi, biaya visa, perlengkapan ibadah, dan bimbingan ibadah.' },
]

export default function FAQSection() {
    const [faqs, setFaqs] = useState([])
    const [open, setOpen] = useState(null)

    useEffect(() => {
        getFaq()
            .then((res) => {
                const data = res.data?.data
                setFaqs(data?.length ? data : FALLBACK)
            })
            .catch(() => setFaqs(FALLBACK))
    }, [])

    return (
        <section id="faq" className="section-pad bg-white">
            <div className="max-w-3xl mx-auto px-4 sm:px-6">

                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-14"
                >
                    <p className="section-label">FAQ</p>
                    <h2 className="section-title">Pertanyaan <span className="gradient-text">Yang Sering Ditanyakan</span></h2>
                </motion.div>

                <div className="space-y-3">
                    {faqs.map((faq, i) => (
                        <motion.div
                            key={faq.id || faq.faq_id || i}
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.35, delay: i * 0.05 }}
                            className="bg-white rounded-2xl border border-sage/50 shadow-card overflow-hidden"
                        >
                            <button
                                onClick={() => setOpen(open === i ? null : i)}
                                className="w-full flex items-center justify-between px-6 py-4.5 text-left hover:bg-sage/20 transition-colors duration-150 py-5"
                            >
                                <span className="font-semibold text-gray-900 text-sm pr-4">{faq.question}</span>
                                <motion.div
                                    animate={{ rotate: open === i ? 180 : 0 }}
                                    transition={{ duration: 0.22 }}
                                    className="shrink-0"
                                >
                                    <ChevronDown size={17} className="text-secondary" />
                                </motion.div>
                            </button>

                            <AnimatePresence>
                                {open === i && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.25 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="px-6 pb-5 pt-1 text-gray-500 text-sm leading-relaxed border-t border-sage/40">
                                            {faq.answer}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
