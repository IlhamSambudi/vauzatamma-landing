import { useState } from 'react'
import { motion } from 'framer-motion'
import { submitLead } from '../services/api'
import { Send, Phone, Mail, MapPin, CheckCircle } from 'lucide-react'

export default function CTASection() {
    const [form, setForm] = useState({ name: '', phone: '', email: '', message: '', package_type: 'umroh' })
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState('')

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        try {
            await submitLead(form)
            setSuccess(true)
        } catch {
            setError('Terjadi kesalahan. Silakan coba lagi atau hubungi via WhatsApp.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <section id="cta" className="section-pad bg-gradient-to-br from-primary to-secondary relative overflow-hidden">
            {/* Decorative circles */}
            <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-white/5 pointer-events-none" />
            <div className="absolute -bottom-20 -left-16 w-64 h-64 rounded-full bg-white/5 pointer-events-none" />

            <div className="container-xl mx-auto relative">
                <div className="grid md:grid-cols-2 gap-14 items-start">

                    {/* Left: Info */}
                    <motion.div
                        initial={{ opacity: 0, x: -32 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.55 }}
                    >
                        <p className="text-accent text-sm font-semibold uppercase tracking-widest mb-3">Hubungi Kami</p>
                        <h2 className="text-3xl md:text-4xl font-black text-white leading-tight mb-5">
                            Siap Wujudkan<br />
                            <span className="text-gold">Impian Suci Anda?</span>
                        </h2>
                        <p className="text-white/75 text-sm leading-relaxed mb-10 max-w-sm">
                            Tim konsultan ibadah kami siap membantu Anda memilih paket yang tepat dan mempersiapkan perjalanan yang khusyuk.
                        </p>

                        <div className="space-y-5 mb-10">
                            {[
                                { icon: Phone, label: 'WhatsApp / Telepon', value: '+62 812-3456-7890' },
                                { icon: Mail, label: 'Email', value: 'info@vauzatamma.com' },
                                { icon: MapPin, label: 'Kantor', value: 'Jl. Contoh No. 123, Jakarta Selatan' },
                            ].map(({ icon: Icon, label, value }) => (
                                <div key={label} className="flex items-start gap-4">
                                    <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
                                        <Icon size={16} className="text-white" />
                                    </div>
                                    <div>
                                        <p className="text-white/50 text-xs">{label}</p>
                                        <p className="text-white font-medium text-sm">{value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <a
                            href="https://wa.me/6281234567890?text=Assalamualaikum%20saya%20ingin%20info%20paket%20umroh"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-3 bg-[#25D366] hover:bg-[#1dbd5b] text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 shadow-lg"
                        >
                            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.558 4.115 1.531 5.837L0 24l6.335-1.561A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.797 9.797 0 0 1-5.023-1.38l-.36-.214-3.733.921.96-3.635-.235-.374A9.792 9.792 0 0 1 2.182 12C2.182 6.579 6.579 2.182 12 2.182S21.818 6.579 21.818 12 17.421 21.818 12 21.818z" />
                            </svg>
                            Chat via WhatsApp
                        </a>
                    </motion.div>

                    {/* Right: Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 32 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.55 }}
                        className="bg-white rounded-3xl p-8 shadow-2xl"
                    >
                        {success ? (
                            <div className="text-center py-10">
                                <CheckCircle size={52} className="text-primary mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Pesan Terkirim!</h3>
                                <p className="text-gray-500 text-sm">Tim kami akan menghubungi Anda dalam 1×24 jam. Jazakallahu khairan.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <h3 className="text-lg font-bold text-gray-900 mb-5">Konsultasi Gratis</h3>

                                <div>
                                    <label className="label">Nama Lengkap *</label>
                                    <input name="name" value={form.name} onChange={handleChange} required
                                        className="input" placeholder="Nama Anda" />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="label">No. HP / WA *</label>
                                        <input name="phone" value={form.phone} onChange={handleChange} required
                                            className="input" placeholder="+62..." />
                                    </div>
                                    <div>
                                        <label className="label">Email</label>
                                        <input name="email" type="email" value={form.email} onChange={handleChange}
                                            className="input" placeholder="email@anda.com" />
                                    </div>
                                </div>
                                <div>
                                    <label className="label">Jenis Paket</label>
                                    <select name="package_type" value={form.package_type} onChange={handleChange} className="input">
                                        <option value="umroh">Umroh</option>
                                        <option value="haji">Haji</option>
                                        <option value="haji_plus">Haji Plus</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="label">Pesan</label>
                                    <textarea name="message" value={form.message} onChange={handleChange} rows={3}
                                        className="input resize-none"
                                        placeholder="Pertanyaan atau pesan Anda..." />
                                </div>

                                {error && <p className="text-red-500 text-xs">{error}</p>}

                                <button type="submit" disabled={loading}
                                    className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60">
                                    {loading
                                        ? <span className="animate-spin border-2 border-white/40 border-t-white rounded-full w-4 h-4" />
                                        : <Send size={15} />}
                                    {loading ? 'Mengirim...' : 'Kirim Pesan'}
                                </button>
                                <p className="text-gray-400 text-xs text-center">
                                    Data Anda aman dan tidak akan disebarkan.
                                </p>
                            </form>
                        )}
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
