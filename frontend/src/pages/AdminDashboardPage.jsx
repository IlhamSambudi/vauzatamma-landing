import { useEffect, useState, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
    adminGetPackages, adminGetLeads, adminDeleteLead,
    adminGetGallery, adminUploadGallery, adminDeleteGallery, adminUpdateGallery,
    adminCreatePackage, adminUpdatePackage, adminDeletePackage,
    adminGetFaq, adminCreateFaq, adminUpdateFaq, adminDeleteFaq,
    adminGetTestimonials, adminCreateTestimonial, adminUpdateTestimonial, adminDeleteTestimonial,
    adminGetAirlines, adminCreateAirline, adminUpdateAirline, adminDeleteAirline,
    adminGetHotels, adminCreateHotel, adminUpdateHotel, adminDeleteHotel,
    adminGetMedia, adminUploadMedia, adminDeleteMedia,
    adminGetAccounts, adminCreateAccount, adminUpdateAccount, adminDeleteAccount,
} from '../services/api'
import {
    Package, Users, Image as ImageIcon, LogOut, Plus, Trash2, Edit,
    Loader2, X, LayoutDashboard, Search, MessageCircle, HelpCircle,
    Plane, Building2, FolderOpen, ShieldCheck, Link2, Star, Phone
} from 'lucide-react'
import logoImg from '../assets/logo.png'

/* ───── Sidebar tabs ───── */
const TABS = [
    { id: 'packages', label: 'Paket Umroh/Haji', icon: Package },
    { id: 'leads', label: 'Data Leads', icon: Users },
    { id: 'gallery', label: 'Galeri Foto', icon: ImageIcon },
    { id: 'testimonials', label: 'Testimoni', icon: MessageCircle },
    { id: 'faq', label: 'Kelola FAQ', icon: HelpCircle },
    { id: 'airlines', label: 'Maskapai', icon: Plane },
    { id: 'hotels', label: 'Hotel', icon: Building2 },
    { id: 'media', label: 'Media Library', icon: FolderOpen },
    { id: 'accounts', label: 'Admin Akun', icon: ShieldCheck },
]

const HEADER = {
    packages: { title: 'Paket Umroh/Haji', sub: 'Kelola data paket & harga' },
    leads: { title: 'Data Leads', sub: 'Daftar calon jamaah yang menghubungi' },
    gallery: { title: 'Galeri Foto', sub: 'Upload & kelola foto galeri' },
    testimonials: { title: 'Testimoni', sub: 'Kelola ulasan jamaah' },
    faq: { title: 'FAQ', sub: 'Pertanyaan yang sering ditanyakan' },
    airlines: { title: 'Maskapai', sub: 'Kelola data maskapai penerbangan' },
    hotels: { title: 'Hotel', sub: 'Kelola data hotel di Makkah & Madinah' },
    media: { title: 'Media Library', sub: 'File manager foto & dokumen' },
    accounts: { title: 'Admin Akun', sub: 'Kelola akun administrator' },
}

/* ───── Auth guard ───── */
function useAdminAuth() {
    const navigate = useNavigate()
    useEffect(() => {
        if (!localStorage.getItem('admin_token')) navigate('/admin/login')
    }, [navigate])
}

/* ── helpers ── */
const fmt = (d) => d ? new Date(d).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'
const fmtRp = (n) => n ? `Rp ${Number(n).toLocaleString('id-ID')}` : '-'

/* ── Shared UI ── */
function ModalWrapper({ title, onClose, children, maxW = 'max-w-2xl' }) {
    return (
        <div className="fixed inset-0 z-50 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={e => e.target === e.currentTarget && onClose()}>
            <motion.div
                initial={{ opacity: 0, scale: 0.96, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 20 }}
                className={`bg-white border border-gray-100 rounded-3xl w-full ${maxW} max-h-[90vh] flex flex-col shadow-2xl overflow-hidden`}
            >
                <div className="bg-white border-b border-gray-100 flex items-center justify-between p-6 shrink-0">
                    <h3 className="text-lg font-bold text-gray-900">{title}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 bg-gray-50 hover:bg-gray-100 rounded-full">
                        <X size={20} />
                    </button>
                </div>
                {children}
            </motion.div>
        </div>
    )
}
function Field({ label, children }) {
    return (
        <div>
            <label className="block text-xs text-gray-500 mb-1.5 font-medium px-1">{label}</label>
            {children}
        </div>
    )
}
function ModalFooter({ onClose, onSave, saving, saveLabel = 'Simpan' }) {
    return (
        <div className="bg-white border-t border-gray-100 flex items-center justify-end gap-3 p-5 shrink-0">
            <button onClick={onClose} disabled={saving} className="btn-secondary">Batal</button>
            <button onClick={onSave} disabled={saving} className="btn-primary">
                {saving ? <><Loader2 size={14} className="animate-spin mr-2" />Menyimpan...</> : saveLabel}
            </button>
        </div>
    )
}
function EmptyRow({ cols, msg = 'Belum ada data.' }) {
    return <tr><td colSpan={cols} className="text-center py-12 text-gray-400 text-sm">{msg}</td></tr>
}
function ActionBtns({ onEdit, onDelete }) {
    return (
        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            {onEdit && <button onClick={onEdit} className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg"><Edit size={15} /></button>}
            {onDelete && <button onClick={onDelete} className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg"><Trash2 size={15} /></button>}
        </div>
    )
}

/* ── Table wrapper ── */
function DataTable({ head, children }) {
    return (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
            <table className="w-full text-sm text-left">
                <thead className="bg-gray-50/80 border-b border-gray-200 text-gray-500 text-xs uppercase font-semibold">
                    <tr>{head.map((h, i) => <th key={i} className={`px-6 py-4 ${i === head.length - 1 ? 'text-right' : ''}`}>{h}</th>)}</tr>
                </thead>
                <tbody className="divide-y divide-gray-100">{children}</tbody>
            </table>
        </div>
    )
}

/* ─── TOP ACTION BAR ─── */
function TopBar({ children }) {
    return (
        <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-gray-200 shadow-sm mb-6">
            {children}
        </div>
    )
}

/* ══════════════════════════════════════════════
   MODALS
══════════════════════════════════════════════ */

/* Packages — simple edit (full create uses separate page) */
function PackageModal({ pkg, onClose, onSaved }) {
    const [form, setForm] = useState({
        package_name: pkg?.package_name || '',
        package_code: pkg?.package_code || '',
        program_type: pkg?.program_type || 'umroh',
        plus_destination: pkg?.plus_destination || '',
        description: pkg?.description || '',
        full_seat: pkg?.full_seat || '',
        remaining_seat: pkg?.remaining_seat ?? '',
        airline_id: pkg?.airline_id || '',
    })
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')
    const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

    const save = async () => {
        if (!form.package_name.trim()) { setError('Nama paket wajib diisi'); return }
        setSaving(true); setError('')
        try {
            if (pkg?.id) await adminUpdatePackage(pkg.id, form)
            else await adminCreatePackage(form)
            onSaved()
        } catch (e) { setError(e.response?.data?.message || 'Gagal menyimpan') }
        finally { setSaving(false) }
    }
    return (
        <ModalWrapper title={pkg ? 'Edit Paket' : 'Tambah Paket'} onClose={onClose}>
            <div className="p-6 space-y-4 overflow-y-auto flex-1">
                {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl">{error}</div>}
                <div className="grid grid-cols-2 gap-4">
                    <Field label="Nama Paket *"><input className="admin-input" value={form.package_name} onChange={e => set('package_name', e.target.value)} /></Field>
                    <Field label="Kode Paket"><input className="admin-input" value={form.package_code} onChange={e => set('package_code', e.target.value)} /></Field>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <Field label="Tipe Program">
                        <select className="admin-input" value={form.program_type} onChange={e => set('program_type', e.target.value)}>
                            <option value="umroh">Umroh</option>
                            <option value="haji">Haji</option>
                            <option value="haji_plus">Haji Plus</option>
                        </select>
                    </Field>
                    <Field label="Destinasi Plus"><input className="admin-input" value={form.plus_destination} onChange={e => set('plus_destination', e.target.value)} placeholder="Istanbul / Cairo" /></Field>
                </div>
                <Field label="Deskripsi"><textarea className="admin-input min-h-[80px] resize-none" value={form.description} onChange={e => set('description', e.target.value)} /></Field>
                <div className="grid grid-cols-2 gap-4">
                    <Field label="Total Seat"><input className="admin-input" type="number" value={form.full_seat} onChange={e => set('full_seat', e.target.value)} /></Field>
                    <Field label="Sisa Seat"><input className="admin-input" type="number" value={form.remaining_seat} onChange={e => set('remaining_seat', e.target.value)} /></Field>
                </div>
            </div>
            <ModalFooter onClose={onClose} onSave={save} saving={saving} saveLabel="Simpan Paket" />
        </ModalWrapper>
    )
}

/* Testimonials */
function TestimonialModal({ item, onClose, onSaved }) {
    const [form, setForm] = useState({ name: item?.name || '', city: item?.city || '', message: item?.message || '' })
    const [file, setFile] = useState(null)
    const [saving, setSaving] = useState(false)

    const save = async () => {
        if (!form.name || !form.message) return alert('Nama dan pesan wajib diisi')
        setSaving(true)
        try {
            const fd = new FormData()
            Object.entries(form).forEach(([k, v]) => fd.append(k, v))
            if (file) fd.append('file', file)
            if (item?.id) await adminUpdateTestimonial(item.id, fd)
            else await adminCreateTestimonial(fd)
            onSaved()
        } catch (e) { console.error(e) } finally { setSaving(false) }
    }
    return (
        <ModalWrapper title={item ? 'Edit Testimoni' : 'Tambah Testimoni'} onClose={onClose}>
            <div className="p-6 space-y-4 flex-1 overflow-y-auto">
                <div className="grid grid-cols-2 gap-4">
                    <Field label="Nama Jamaah *"><input className="admin-input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></Field>
                    <Field label="Kota Asal"><input className="admin-input" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} /></Field>
                </div>
                <Field label="Pesan / Testimoni *"><textarea className="admin-input min-h-[100px]" value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} /></Field>
                <Field label="Foto Jamaah (Opsional)">
                    <input type="file" accept="image/*" onChange={e => setFile(e.target.files[0])} className="admin-input file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
                </Field>
            </div>
            <ModalFooter onClose={onClose} onSave={save} saving={saving} saveLabel="Simpan Testimoni" />
        </ModalWrapper>
    )
}

/* FAQ */
function FaqModal({ item, onClose, onSaved }) {
    const [form, setForm] = useState({ question: item?.question || '', answer: item?.answer || '' })
    const [saving, setSaving] = useState(false)

    const save = async () => {
        if (!form.question || !form.answer) return alert('Pertanyaan dan jawaban wajib diisi')
        setSaving(true)
        try {
            if (item?.id) await adminUpdateFaq(item.id, form)
            else await adminCreateFaq(form)
            onSaved()
        } catch (e) { console.error(e) } finally { setSaving(false) }
    }
    return (
        <ModalWrapper title={item ? 'Edit FAQ' : 'Tambah FAQ'} onClose={onClose}>
            <div className="p-6 space-y-4 flex-1">
                <Field label="Pertanyaan *"><input className="admin-input" value={form.question} onChange={e => setForm({ ...form, question: e.target.value })} /></Field>
                <Field label="Jawaban *"><textarea className="admin-input min-h-[120px]" value={form.answer} onChange={e => setForm({ ...form, answer: e.target.value })} /></Field>
            </div>
            <ModalFooter onClose={onClose} onSave={save} saving={saving} saveLabel="Simpan FAQ" />
        </ModalWrapper>
    )
}

/* Airlines */
function AirlineModal({ item, onClose, onSaved }) {
    const [form, setForm] = useState({ name: item?.name || '', code: item?.code || '' })
    const [file, setFile] = useState(null)
    const [saving, setSaving] = useState(false)

    const save = async () => {
        if (!form.name) return alert('Nama maskapai wajib diisi')
        setSaving(true)
        try {
            const fd = new FormData()
            fd.append('name', form.name)
            fd.append('code', form.code)
            if (file) fd.append('file', file)

            if (item?.id) await adminUpdateAirline(item.id, fd)
            else await adminCreateAirline(fd)
            onSaved()
        } catch (e) { console.error(e) } finally { setSaving(false) }
    }
    return (
        <ModalWrapper title={item ? 'Edit Maskapai' : 'Tambah Maskapai'} onClose={onClose} maxW="max-w-lg">
            <div className="p-6 space-y-4 flex-1">
                <Field label="Nama Maskapai *"><input className="admin-input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Garuda Indonesia" /></Field>
                <div className="grid grid-cols-2 gap-4">
                    <Field label="Kode IATA"><input className="admin-input" value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} placeholder="GA" /></Field>
                    <Field label="Logo (Opsional)">
                        <input type="file" accept="image/*" onChange={e => setFile(e.target.files[0])} className="admin-input file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
                    </Field>
                </div>
            </div>
            <ModalFooter onClose={onClose} onSave={save} saving={saving} saveLabel="Simpan Maskapai" />
        </ModalWrapper>
    )
}

/* Hotels */
function HotelModal({ item, onClose, onSaved }) {
    const [form, setForm] = useState({ name: item?.name || '', city: item?.city || '', country: item?.country || 'Saudi Arabia', star_rating: item?.star_rating || 5 })
    const [saving, setSaving] = useState(false)

    const save = async () => {
        if (!form.name) return alert('Nama hotel wajib diisi')
        setSaving(true)
        try {
            if (item?.id) await adminUpdateHotel(item.id, form)
            else await adminCreateHotel(form)
            onSaved()
        } catch (e) { console.error(e) } finally { setSaving(false) }
    }
    return (
        <ModalWrapper title={item ? 'Edit Hotel' : 'Tambah Hotel'} onClose={onClose} maxW="max-w-lg">
            <div className="p-6 space-y-4 flex-1">
                <Field label="Nama Hotel *"><input className="admin-input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Pullman ZamZam Makkah" /></Field>
                <div className="grid grid-cols-2 gap-4">
                    <Field label="Kota">
                        <select className="admin-input" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })}>
                            <option value="">— Pilih Kota —</option>
                            <option value="Makkah">Makkah</option>
                            <option value="Madinah">Madinah</option>
                            <option value="Dubai">Dubai</option>
                            <option value="Turki">Turki</option>
                            <option value="Cappadocia">Cappadocia</option>
                            <option value="Istanbul">Istanbul</option>
                            <option value="Bursa">Bursa</option>
                        </select>
                    </Field>
                    <Field label="Bintang">
                        <select className="admin-input" value={form.star_rating} onChange={e => setForm({ ...form, star_rating: parseInt(e.target.value) })}>
                            {[5, 4, 3, 2, 1].map(s => <option key={s} value={s}>{s} Bintang</option>)}
                        </select>
                    </Field>
                </div>
                <Field label="Negara"><input className="admin-input" value={form.country} onChange={e => setForm({ ...form, country: e.target.value })} /></Field>
            </div>
            <ModalFooter onClose={onClose} onSave={save} saving={saving} saveLabel="Simpan Hotel" />
        </ModalWrapper>
    )
}

/* Admin Account */
function AccountModal({ item, onClose, onSaved }) {
    const [form, setForm] = useState({ username: item?.username || '', password: '' })
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')

    const save = async () => {
        if (!form.username) return setError('Username wajib diisi')
        if (!item && !form.password) return setError('Password wajib diisi untuk akun baru')
        setSaving(true); setError('')
        try {
            if (item?.id) await adminUpdateAccount(item.id, form)
            else await adminCreateAccount(form)
            onSaved()
        } catch (e) { setError(e.response?.data?.message || 'Gagal menyimpan') } finally { setSaving(false) }
    }
    return (
        <ModalWrapper title={item ? 'Edit Admin' : 'Tambah Admin'} onClose={onClose} maxW="max-w-md">
            <div className="p-6 space-y-4 flex-1">
                {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl">{error}</div>}
                <Field label="Username *"><input className="admin-input" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} /></Field>
                <Field label={item ? 'Password Baru (kosongkan jika tidak ganti)' : 'Password *'}>
                    <input type="password" className="admin-input" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="••••••••" />
                </Field>
            </div>
            <ModalFooter onClose={onClose} onSave={save} saving={saving} saveLabel="Simpan Akun" />
        </ModalWrapper>
    )
}

/* ══════════════════════════════════════════════
   MAIN DASHBOARD
══════════════════════════════════════════════ */
export default function AdminDashboardPage() {
    useAdminAuth()
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState('packages')
    const [loading, setLoading] = useState(true)

    // Data states
    const [packages, setPackages] = useState([])
    const [leads, setLeads] = useState([])
    const [gallery, setGallery] = useState([])
    const [testimonials, setTestimonials] = useState([])
    const [faqs, setFaqs] = useState([])
    const [airlines, setAirlines] = useState([])
    const [hotels, setHotels] = useState([])
    const [media, setMedia] = useState([])
    const [accounts, setAccounts] = useState([])

    // Modal state: { type: string|null, data: obj|null }
    const [modal, setModal] = useState({ type: null, data: null })
    const closeModal = () => setModal({ type: null, data: null })

    const fetchData = async () => {
        setLoading(true)
        try {
            const [pkgRes, leadRes, galRes, testiRes, faqRes, airRes, hotRes, medRes, accRes] = await Promise.all([
                adminGetPackages(), adminGetLeads(), adminGetGallery(),
                adminGetTestimonials(), adminGetFaq(),
                adminGetAirlines(), adminGetHotels(),
                adminGetMedia(), adminGetAccounts(),
            ])
            setPackages(pkgRes.data?.data || [])
            setLeads(leadRes.data?.data || [])
            setGallery(galRes.data?.data || [])
            setTestimonials(testiRes.data?.data || [])
            setFaqs(faqRes.data?.data || [])
            setAirlines(airRes.data?.data || [])
            setHotels(hotRes.data?.data || [])
            setMedia(medRes.data?.data || [])
            setAccounts(accRes.data?.data || [])
        } catch (e) {
            if (e.response?.status === 401) navigate('/admin/login')
        } finally { setLoading(false) }
    }

    useEffect(() => { fetchData() }, [])

    const onSaved = () => { closeModal(); fetchData() }

    const confirmDelete = async (fn) => {
        if (!confirm('Hapus permanen data ini?')) return
        try { await fn(); fetchData() } catch (e) { alert(e.response?.data?.message || 'Gagal menghapus') }
    }

    const logout = () => { localStorage.removeItem('admin_token'); navigate('/admin/login') }

    return (
        <div className="min-h-screen bg-gray-50 flex font-sans text-gray-800">
            {/* ── Sidebar ── */}
            <aside className="w-64 bg-white border-r border-gray-200 flex flex-col flex-shrink-0 shadow-sm z-10">
                <div className="p-6 border-b border-gray-100">
                    <img src={logoImg} alt="Vauza Tamma" className="h-10 w-auto object-contain" />
                    <p className="text-gray-400 text-[10px] mt-2 uppercase tracking-widest font-bold">Admin Workspace</p>
                </div>
                <nav className="flex-1 p-4 space-y-0.5 overflow-y-auto">
                    {TABS.map(({ id, label, icon: Icon }) => (
                        <button key={id} onClick={() => setActiveTab(id)}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeTab === id ? 'bg-primary/10 text-primary' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}
                        >
                            <Icon size={16} strokeWidth={activeTab === id ? 2.5 : 2} /> {label}
                        </button>
                    ))}
                </nav>
                <div className="p-4 border-t border-gray-100 space-y-1">
                    <Link to="/" className="w-full flex items-center gap-2 px-4 py-2.5 text-gray-500 hover:text-gray-900 text-sm font-medium rounded-xl hover:bg-white transition-all">← Ke Landing Page</Link>
                    <button onClick={logout} className="w-full flex items-center gap-2 px-4 py-2.5 text-red-500 hover:text-red-700 text-sm font-medium rounded-xl hover:bg-red-50 transition-all"><LogOut size={15} /> Keluar</button>
                </div>
            </aside>

            {/* ── Main ── */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden">
                <header className="bg-white border-b border-gray-200 px-8 py-5 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 text-primary rounded-lg"><LayoutDashboard size={18} /></div>
                        <div>
                            <h1 className="text-lg font-bold text-gray-900">{HEADER[activeTab]?.title}</h1>
                            <p className="text-xs text-gray-500 mt-0.5">{HEADER[activeTab]?.sub}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="relative hidden md:block">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input type="text" placeholder="Cari data..." className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:border-primary w-60 transition-all" />
                        </div>
                        <div className="w-9 h-9 bg-primary rounded-full flex items-center justify-center text-white font-bold shadow-md">A</div>
                    </div>
                </header>

                <div className="flex-1 overflow-auto p-8">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-full text-primary"><Loader2 className="animate-spin mb-4" size={40} /></div>
                    ) : (
                        <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>

                            {/* ── PACKAGES ── */}
                            {activeTab === 'packages' && (
                                <div className="space-y-6">
                                    <TopBar>
                                        <span className="font-bold text-gray-700 px-2">{packages.length} Paket Tersedia</span>
                                        <Link to="/admin/packages/create" className="btn-primary flex gap-2"><Plus size={17} /> Tambah Paket</Link>
                                    </TopBar>
                                    <DataTable head={['Paket', 'Program', 'Tgl Berangkat', 'Tier', 'Seat', 'Aksi']}>
                                        {packages.map(pkg => (
                                            <tr key={pkg.id} className="hover:bg-gray-50/50 group">
                                                <td className="px-6 py-4"><p className="font-bold text-gray-900">{pkg.package_name}</p><p className="text-xs text-gray-400 font-mono mt-0.5">{pkg.package_code || '-'}</p></td>
                                                <td className="px-6 py-4"><span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-md text-xs font-bold border border-emerald-200">{pkg.program_type?.toUpperCase()}</span></td>
                                                <td className="px-6 py-4 text-gray-700">{fmt(pkg.next_departure)}</td>
                                                <td className="px-6 py-4 flex flex-wrap gap-1.5 mt-2">
                                                    {(pkg.tier || 'Net Price').split(',').map(t => {
                                                        const tierName = t.trim()
                                                        let badgeClass = 'bg-gray-100 text-gray-600 border-gray-200'
                                                        if (tierName.toLowerCase() === 'net price') badgeClass = 'bg-blue-50 text-blue-700 border-blue-200'
                                                        if (tierName.toLowerCase() === 'silver') badgeClass = 'bg-slate-100 text-slate-600 border-slate-300'
                                                        if (tierName.toLowerCase() === 'gold') badgeClass = 'bg-amber-100 text-yellow-700 border-amber-300'
                                                        if (tierName.toLowerCase() === 'platinum') badgeClass = 'bg-gradient-to-r from-gray-800 to-gray-900 text-white border-gray-700 shadow-sm'
                                                        return <span key={tierName} className={`px-2.5 py-1 rounded-md text-[11px] font-bold border ${badgeClass}`}>{tierName.toUpperCase()}</span>
                                                    })}
                                                </td>
                                                <td className="px-6 py-4 text-center"><span className="font-bold">{pkg.remaining_seat ?? '-'}</span> <span className="text-gray-400 text-xs">/ {pkg.full_seat ?? '-'}</span></td>
                                                <td className="px-6 py-4"><ActionBtns onEdit={() => setModal({ type: 'pkg', data: pkg })} onDelete={() => confirmDelete(() => adminDeletePackage(pkg.id))} /></td>
                                            </tr>
                                        ))}
                                        {packages.length === 0 && <EmptyRow cols={6} />}
                                    </DataTable>
                                </div>
                            )}

                            {/* ── LEADS ── */}
                            {activeTab === 'leads' && (
                                <div className="space-y-6">
                                    <TopBar>
                                        <span className="font-bold text-gray-700 px-2">{leads.length} Lead Masuk</span>
                                        <span className="text-xs text-gray-400">Lead dikirim dari form landing page</span>
                                    </TopBar>
                                    <DataTable head={['Nama', 'WhatsApp', 'Minat Paket', 'Pesan', 'Masuk', 'Aksi']}>
                                        {leads.map(lead => (
                                            <tr key={lead.id} className="hover:bg-gray-50/50 group">
                                                <td className="px-6 py-4 font-bold text-gray-900">{lead.name}</td>
                                                <td className="px-6 py-4"><a href={`https://wa.me/${lead.phone?.replace(/[^0-9]/g, '')}`} target="_blank" className="text-primary hover:underline font-bold flex items-center gap-1"><Phone size={12} />{lead.phone}</a></td>
                                                <td className="px-6 py-4 text-xs font-bold uppercase text-gray-600">{lead.package_interest || '-'}</td>
                                                <td className="px-6 py-4 text-gray-500 max-w-xs truncate">{lead.message || '-'}</td>
                                                <td className="px-6 py-4 text-gray-500">{fmt(lead.created_at)}</td>
                                                <td className="px-6 py-4"><ActionBtns onDelete={() => confirmDelete(() => adminDeleteLead(lead.id))} /></td>
                                            </tr>
                                        ))}
                                        {leads.length === 0 && <EmptyRow cols={6} />}
                                    </DataTable>
                                </div>
                            )}

                            {/* ── GALLERY ── */}
                            {activeTab === 'gallery' && (
                                <div className="space-y-6">
                                    <TopBar>
                                        <span className="font-bold text-gray-700 px-2">{gallery.length} Foto</span>
                                        <label className="btn-primary flex items-center gap-2 cursor-pointer">
                                            <Plus size={17} /> Upload Foto
                                            <input type="file" accept="image/*" className="hidden" onChange={async e => {
                                                const fd = new FormData(); fd.append('file', e.target.files[0])
                                                await adminUploadGallery(fd); fetchData()
                                            }} />
                                        </label>
                                    </TopBar>
                                    {gallery.length === 0 ? (
                                        <div className="text-center py-20 text-gray-400">Belum ada foto. Upload foto pertama!</div>
                                    ) : (
                                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                                            {gallery.map(img => (
                                                <div key={img.id} className="relative group rounded-2xl overflow-hidden aspect-square border border-gray-200 shadow-sm">
                                                    <img src={img.image_url} alt={img.title || ''} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                                    {img.title && <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 p-3"><p className="text-white text-xs font-semibold truncate">{img.title}</p></div>}
                                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-opacity">
                                                        <button onClick={() => confirmDelete(() => adminDeleteGallery(img.id))} className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600"><Trash2 size={15} /></button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* ── TESTIMONIALS ── */}
                            {activeTab === 'testimonials' && (
                                <div className="space-y-6">
                                    <TopBar>
                                        <span className="font-bold text-gray-700 px-2">{testimonials.length} Testimoni</span>
                                        <button onClick={() => setModal({ type: 'testi', data: null })} className="btn-primary flex gap-2"><Plus size={17} /> Tambah</button>
                                    </TopBar>
                                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                                        {testimonials.map(item => (
                                            <div key={item.id} className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm relative group">
                                                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button onClick={() => setModal({ type: 'testi', data: item })} className="p-1.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg"><Edit size={13} /></button>
                                                    <button onClick={() => confirmDelete(() => adminDeleteTestimonial(item.id))} className="p-1.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg"><Trash2 size={13} /></button>
                                                </div>
                                                <div className="flex gap-3 items-center mb-3">
                                                    {item.photo_url
                                                        ? <img src={item.photo_url} className="w-11 h-11 rounded-full object-cover border border-gray-200" alt="" />
                                                        : <div className="w-11 h-11 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">{item.name?.[0]}</div>}
                                                    <div>
                                                        <p className="font-bold text-gray-900 text-sm">{item.name}</p>
                                                        <p className="text-xs text-gray-400">{item.city || 'Jamaah'}</p>
                                                    </div>
                                                </div>
                                                <p className="text-gray-600 text-sm line-clamp-4 italic">"{item.message}"</p>
                                            </div>
                                        ))}
                                        {testimonials.length === 0 && <div className="col-span-3 text-center py-16 text-gray-400">Belum ada testimoni.</div>}
                                    </div>
                                </div>
                            )}

                            {/* ── FAQ ── */}
                            {activeTab === 'faq' && (
                                <div className="space-y-6">
                                    <TopBar>
                                        <span className="font-bold text-gray-700 px-2">{faqs.length} FAQ</span>
                                        <button onClick={() => setModal({ type: 'faq', data: null })} className="btn-primary flex gap-2"><Plus size={17} /> Tambah FAQ</button>
                                    </TopBar>
                                    <DataTable head={['Pertanyaan', 'Jawaban', 'Aksi']}>
                                        {faqs.map(faq => (
                                            <tr key={faq.id} className="hover:bg-gray-50/50 group">
                                                <td className="px-6 py-4 font-bold text-gray-900 w-1/3">{faq.question}</td>
                                                <td className="px-6 py-4 text-gray-600 text-sm leading-relaxed">{faq.answer}</td>
                                                <td className="px-6 py-4"><ActionBtns onEdit={() => setModal({ type: 'faq', data: faq })} onDelete={() => confirmDelete(() => adminDeleteFaq(faq.id))} /></td>
                                            </tr>
                                        ))}
                                        {faqs.length === 0 && <EmptyRow cols={3} />}
                                    </DataTable>
                                </div>
                            )}

                            {/* ── AIRLINES ── */}
                            {activeTab === 'airlines' && (
                                <div className="space-y-6">
                                    <TopBar>
                                        <span className="font-bold text-gray-700 px-2">{airlines.length} Maskapai</span>
                                        <button onClick={() => setModal({ type: 'airline', data: null })} className="btn-primary flex gap-2"><Plus size={17} /> Tambah Maskapai</button>
                                    </TopBar>
                                    <DataTable head={['Maskapai', 'Kode IATA', 'Aksi']}>
                                        {airlines.map(a => (
                                            <tr key={a.id} className="hover:bg-gray-50/50 group">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        {a.logo_url ? <img src={a.logo_url} className="w-10 h-10 object-contain bg-white border border-gray-100 p-1 rounded-xl shadow-sm" alt={a.name} /> : <div className="w-10 h-10 bg-sky-100 rounded-xl flex items-center justify-center"><Plane size={16} className="text-sky-600" /></div>}
                                                        <span className="font-bold text-gray-900">{a.name}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4"><span className="font-mono font-bold text-gray-600 bg-gray-100 px-2 py-1 rounded-md text-xs">{a.code || '-'}</span></td>
                                                <td className="px-6 py-4"><ActionBtns onEdit={() => setModal({ type: 'airline', data: a })} onDelete={() => confirmDelete(() => adminDeleteAirline(a.id))} /></td>
                                            </tr>
                                        ))}
                                        {airlines.length === 0 && <EmptyRow cols={4} />}
                                    </DataTable>
                                </div>
                            )}

                            {/* ── HOTELS ── */}
                            {activeTab === 'hotels' && (() => {
                                const sortedHotels = (city) =>
                                    hotels
                                        .filter(h => h.city?.toLowerCase().includes(city.toLowerCase()))
                                        .sort((a, b) => (a.name || '').localeCompare(b.name || ''))

                                const otherHotels = () =>
                                    hotels
                                        .filter(h => !h.city?.toLowerCase().includes('makkah') && !h.city?.toLowerCase().includes('madinah'))
                                        .sort((a, b) => (a.name || '').localeCompare(b.name || ''))

                                const makkahHotels = sortedHotels('makkah')
                                const madinahHotels = sortedHotels('madinah')
                                const remainingHotels = otherHotels()

                                const HotelRow = ({ h }) => (
                                    <tr key={h.id} className="hover:bg-gray-50/50 group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 bg-amber-100 rounded-xl flex items-center justify-center"><Building2 size={15} className="text-amber-600" /></div>
                                                <span className="font-bold text-gray-900">{h.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4"><span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-md text-xs font-bold border border-emerald-100">{h.city || '-'}</span></td>
                                        <td className="px-6 py-4 text-amber-500 font-semibold">{'★'.repeat(h.star_rating || 5)}</td>
                                        <td className="px-6 py-4 text-gray-500 text-sm">{h.country || '-'}</td>
                                        <td className="px-6 py-4"><ActionBtns onEdit={() => setModal({ type: 'hotel', data: h })} onDelete={() => confirmDelete(() => adminDeleteHotel(h.id))} /></td>
                                    </tr>
                                )

                                return (
                                    <div className="space-y-6">
                                        <TopBar>
                                            <span className="font-bold text-gray-700 px-2">{hotels.length} Hotel Total</span>
                                            <button onClick={() => setModal({ type: 'hotel', data: null })} className="btn-primary flex gap-2"><Plus size={17} /> Tambah Hotel</button>
                                        </TopBar>

                                        {/* Makkah Group */}
                                        <div>
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center"><Building2 size={15} className="text-emerald-600" /></div>
                                                <h3 className="font-bold text-gray-800">Hotel Makkah <span className="text-sm font-normal text-gray-400 ml-1">({makkahHotels.length} hotel · urutan A-Z)</span></h3>
                                            </div>
                                            <DataTable head={['Nama Hotel', 'Kota', 'Bintang', 'Negara', 'Aksi']}>
                                                {makkahHotels.map(h => <HotelRow key={h.id} h={h} />)}
                                                {makkahHotels.length === 0 && <EmptyRow cols={5} />}
                                            </DataTable>
                                        </div>

                                        {/* Madinah Group */}
                                        <div>
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center"><Building2 size={15} className="text-blue-600" /></div>
                                                <h3 className="font-bold text-gray-800">Hotel Madinah <span className="text-sm font-normal text-gray-400 ml-1">({madinahHotels.length} hotel · urutan A-Z)</span></h3>
                                            </div>
                                            <DataTable head={['Nama Hotel', 'Kota', 'Bintang', 'Negara', 'Aksi']}>
                                                {madinahHotels.map(h => <HotelRow key={h.id} h={h} />)}
                                                {madinahHotels.length === 0 && <EmptyRow cols={5} />}
                                            </DataTable>
                                        </div>

                                        {/* Lainnya Group */}
                                        {remainingHotels.length > 0 && (
                                            <div>
                                                <div className="flex items-center gap-3 mb-3">
                                                    <div className="w-8 h-8 rounded-xl bg-purple-100 flex items-center justify-center"><Building2 size={15} className="text-purple-600" /></div>
                                                    <h3 className="font-bold text-gray-800">Hotel Lainnya <span className="text-sm font-normal text-gray-400 ml-1">({remainingHotels.length} hotel · urutan A-Z)</span></h3>
                                                </div>
                                                <DataTable head={['Nama Hotel', 'Kota', 'Bintang', 'Negara', 'Aksi']}>
                                                    {remainingHotels.map(h => <HotelRow key={h.id} h={h} />)}
                                                    {remainingHotels.length === 0 && <EmptyRow cols={5} />}
                                                </DataTable>
                                            </div>
                                        )}
                                    </div>
                                )
                            })()}

                            {/* ── MEDIA LIBRARY ── */}
                            {activeTab === 'media' && (
                                <div className="space-y-6">
                                    <TopBar>
                                        <span className="font-bold text-gray-700 px-2">{media.length} File</span>
                                        <label className="btn-primary flex items-center gap-2 cursor-pointer">
                                            <Plus size={17} /> Upload File
                                            <input type="file" accept="image/*,application/pdf" className="hidden" onChange={async e => {
                                                const fd = new FormData(); fd.append('file', e.target.files[0])
                                                try { await adminUploadMedia(fd); fetchData() } catch (err) { alert('Upload gagal') }
                                            }} />
                                        </label>
                                    </TopBar>
                                    {media.length === 0 ? (
                                        <div className="text-center py-20 text-gray-400 bg-white rounded-2xl border border-gray-200"><FolderOpen size={40} className="mx-auto mb-4 opacity-30" /><p>Belum ada file di media library.</p></div>
                                    ) : (
                                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                            {media.map(f => (
                                                <div key={f.id} className="relative group bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                                                    {f.file_type === 'image'
                                                        ? <img src={f.file_url} alt={f.file_name} className="w-full aspect-square object-cover" />
                                                        : <div className="w-full aspect-square flex flex-col items-center justify-center bg-red-50">
                                                            <FolderOpen size={28} className="text-red-400 mb-1" />
                                                            <p className="text-[10px] text-red-400 font-bold">PDF</p>
                                                        </div>}
                                                    <div className="p-2 border-t border-gray-100">
                                                        <p className="text-[10px] text-gray-500 truncate font-medium">{f.file_name}</p>
                                                    </div>
                                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-opacity">
                                                        <a href={f.file_url} target="_blank" className="bg-white/20 hover:bg-white/40 text-white p-2 rounded-lg"><Link2 size={14} /></a>
                                                        <button onClick={() => confirmDelete(() => adminDeleteMedia(f.id))} className="bg-red-500/90 hover:bg-red-600 text-white p-2 rounded-lg"><Trash2 size={14} /></button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* ── ADMIN ACCOUNTS ── */}
                            {activeTab === 'accounts' && (
                                <div className="space-y-6">
                                    <TopBar>
                                        <span className="font-bold text-gray-700 px-2">{accounts.length} Admin</span>
                                        <button onClick={() => setModal({ type: 'account', data: null })} className="btn-primary flex gap-2"><Plus size={17} /> Tambah Admin</button>
                                    </TopBar>
                                    <DataTable head={['Username', 'Dibuat', 'Aksi']}>
                                        {accounts.map(a => (
                                            <tr key={a.id} className="hover:bg-gray-50/50 group">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-9 h-9 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm">{a.username?.[0]?.toUpperCase()}</div>
                                                        <div>
                                                            <p className="font-bold text-gray-900">{a.username}</p>
                                                            <p className="text-xs text-gray-400">Administrator</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-gray-500 text-sm">{fmt(a.created_at)}</td>
                                                <td className="px-6 py-4"><ActionBtns onEdit={() => setModal({ type: 'account', data: a })} onDelete={() => confirmDelete(() => adminDeleteAccount(a.id))} /></td>
                                            </tr>
                                        ))}
                                        {accounts.length === 0 && <EmptyRow cols={3} />}
                                    </DataTable>
                                </div>
                            )}

                        </motion.div>
                    )}
                </div>
            </main>

            {/* ── Modals ── */}
            <AnimatePresence>
                {modal.type === 'pkg' && <PackageModal pkg={modal.data} onClose={closeModal} onSaved={onSaved} />}
                {modal.type === 'testi' && <TestimonialModal item={modal.data} onClose={closeModal} onSaved={onSaved} />}
                {modal.type === 'faq' && <FaqModal item={modal.data} onClose={closeModal} onSaved={onSaved} />}
                {modal.type === 'airline' && <AirlineModal item={modal.data} onClose={closeModal} onSaved={onSaved} />}
                {modal.type === 'hotel' && <HotelModal item={modal.data} onClose={closeModal} onSaved={onSaved} />}
                {modal.type === 'account' && <AccountModal item={modal.data} onClose={closeModal} onSaved={onSaved} />}
            </AnimatePresence>

            <style>{`
                .admin-input { width:100%; background:#f9fafb; border:1px solid #e5e7eb; border-radius:.75rem; padding:.625rem 1rem; color:#111827; font-size:.875rem; font-weight:500; outline:none; transition:all .2s; }
                .admin-input:focus { background:#fff; border-color:#1d645b; box-shadow:0 0 0 3px rgba(29,100,91,.1); }
                .btn-primary { display:flex; align-items:center; justify-content:center; padding:.625rem 1.25rem; background:#1d645b; color:white; font-size:.875rem; font-weight:700; border-radius:.75rem; transition:all .2s; }
                .btn-primary:hover { background:#175049; } .btn-primary:disabled { opacity:.5; cursor:not-allowed; } .btn-primary:active { transform:scale(.97); }
                .btn-secondary { display:flex; align-items:center; justify-content:center; padding:.625rem 1.25rem; background:#f3f4f6; color:#374151; font-size:.875rem; font-weight:700; border-radius:.75rem; transition:all .2s; }
                .btn-secondary:hover { background:#e5e7eb; }
            `}</style>
        </div>
    )
}
