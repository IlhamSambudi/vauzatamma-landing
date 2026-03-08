import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { adminCreateFullPackage, adminGetAirlines, adminGetHotels } from '../services/api'
import { ArrowLeft, Plus, Trash2, Save, Loader2, UploadCloud, ChevronDown, X } from 'lucide-react'

// --- Reusable UI ---
function Section({ title, open = true, children }) {
    const [isOpen, setIsOpen] = useState(open)
    return (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-6">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full bg-gray-50/50 px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <div className="w-1.5 h-5 bg-primary rounded-full"></div>
                    <h2 className="text-base font-bold text-gray-900">{title}</h2>
                </div>
                <ChevronDown size={20} className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && <div className="p-6 space-y-6">{children}</div>}
        </div>
    )
}

function Field({ label, children }) {
    return (
        <div>
            <label className="block text-xs font-bold text-gray-600 mb-2">{label}</label>
            {children}
        </div>
    )
}

export default function AdminPackageCreatePage() {
    const navigate = useNavigate()
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')

    // External references
    const [airlines, setAirlines] = useState([])
    const [hotelsList, setHotelsList] = useState([])

    useEffect(() => {
        Promise.all([adminGetAirlines(), adminGetHotels()])
            .then(([resAir, resHot]) => {
                setAirlines(resAir.data?.data || [])
                setHotelsList(resHot.data?.data || [])
            })
            .catch(console.error)
    }, [])

    // --- State: Basic Info (packages) ---
    const [pkg, setPkg] = useState({
        package_code: '', package_name: '', program_type: 'umroh',
        plus_destination: '', airline_id: '', description: '',
        full_seat: '', remaining_seat: ''
    })

    // --- State: Related Tables Array ---
    const [departures, setDepartures] = useState([{ departure_date: '' }])
    const [prices, setPrices] = useState([{ tier: 'Net Price', price: '', upgrade_double: '', upgrade_triple: '' }])
    const [featuresText, setFeaturesText] = useState("Tiket Pesawat PP\nVisa Umroh\nHotel Makkah Madinah\nMakan 3x Sehari\nTour Guide / Muthawif")
    const [hotels, setHotels] = useState([{ hotel_id: '', city_type: 'Makkah', nights: '' }])

    // --- State: Files ---
    const [files, setFiles] = useState({
        flyer: null,
        cover: null,
        gallery: [], // We only support generic 'gallery' as one field, but since we use .any(), we can attach multiple
        itinerary_pdf: null
    })

    const handlePkg = (e) => setPkg({ ...pkg, [e.target.name]: e.target.value })

    // Listeners for dynamic arrays
    const addArr = (setter, emptyObj) => setter(prev => [...prev, emptyObj])
    const rmArr = (setter, idx) => setter(prev => prev.filter((_, i) => i !== idx))
    const updArr = (setter, idx, key, val) => setter(prev => {
        const next = [...prev]
        next[idx][key] = val
        return next
    })

    // Handle Form Submit
    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!pkg.package_name) return setError('Nama paket wajib diisi')
        setSaving(true); setError('')

        try {
            const formData = new FormData()

            // 1. Append JSON data
            formData.append('package', JSON.stringify(pkg))
            formData.append('departures', JSON.stringify(departures.filter(d => d.departure_date)))
            formData.append('prices', JSON.stringify(prices.filter(p => p.tier && p.price)))
            formData.append('hotels', JSON.stringify(hotels.filter(h => h.hotel_id)))

            // Features -> split by newline mapped to object
            const fList = featuresText.split('\n').map(t => t.trim()).filter(Boolean).map(text => ({ name: text, is_included: true }))
            formData.append('features', JSON.stringify(fList))

            // 2. Append Files
            if (files.flyer) formData.append('flyer', files.flyer)
            if (files.cover) formData.append('cover', files.cover)
            if (files.itinerary_pdf) formData.append('itinerary_pdf', files.itinerary_pdf)

            // Gallery files - we append multiple files under 'gallery'
            files.gallery.forEach(file => {
                formData.append('gallery', file)
            })

            await adminCreateFullPackage(formData)
            navigate('/admin/dashboard')
        } catch (err) {
            setError(err.response?.data?.message || 'Gagal menyimpan paket ke database')
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-800">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 px-8 py-5 flex items-center justify-between shadow-sm sticky top-0 z-10 w-full">
                <div className="flex items-center gap-4">
                    <Link to="/admin/dashboard" className="w-10 h-10 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-full flex items-center justify-center text-gray-500 transition-colors">
                        <ArrowLeft size={18} />
                    </Link>
                    <div>
                        <h1 className="text-xl font-bold text-gray-900 leading-none">Buat Paket Baru</h1>
                        <p className="text-xs text-gray-500 mt-1 font-medium">Lengkapi seluruh data paket hingga itinerary</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Link to="/admin/dashboard" className="px-5 py-2.5 text-sm font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all">Batal</Link>
                    <button onClick={handleSubmit} disabled={saving} className="px-6 py-2.5 text-sm font-bold text-white bg-primary hover:bg-primary/90 rounded-xl transition-all shadow-md shadow-primary/20 flex items-center gap-2 disabled:opacity-50">
                        {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                        Simpan Semua Data
                    </button>
                </div>
            </header>

            {/* ERROR ALERT */}
            {error && (
                <div className="max-w-4xl mx-auto w-full mt-6 px-4">
                    <div className="bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-xl flex items-center gap-3">
                        <div className="font-bold">Error:</div>{error}
                    </div>
                </div>
            )}

            {/* Form Content */}
            <main className="flex-1 max-w-4xl w-full mx-auto p-4 pb-20 mt-4 h-full">

                {/* --- Section 1: Basic Info --- */}
                <Section title="1. Informasi Dasar Paket (Tabel Packages)">
                    <div className="grid grid-cols-2 gap-5">
                        <Field label="Kode Paket"><input className="admin-input" name="package_code" value={pkg.package_code} onChange={handlePkg} placeholder="UMR-REG-001" /></Field>
                        <Field label="Nama Paket *"><input className="admin-input" name="package_name" value={pkg.package_name} onChange={handlePkg} placeholder="Umroh Reguler 9 Hari" /></Field>
                    </div>

                    <div className="grid grid-cols-3 gap-5">
                        <Field label="Tipe Program">
                            <select className="admin-input" name="program_type" value={pkg.program_type} onChange={handlePkg}>
                                <option value="umroh">Umroh Reguler</option>
                                <option value="haji">Haji Furoda/Khusus</option>
                                <option value="haji_plus">Umroh Plus</option>
                            </select>
                        </Field>
                        <Field label="Destinasi Plus">
                            <select className="admin-input" name="plus_destination" value={pkg.plus_destination} onChange={handlePkg}>
                                <option value="">- Tidak Ada -</option>
                                <option value="turki">Turki</option>
                                <option value="dubai">Dubai</option>
                                <option value="eropa">Eropa</option>
                                <option value="mesir">Mesir / Cairo</option>
                            </select>
                        </Field>
                        <Field label="Maskapai Penerbangan">
                            <select className="admin-input" name="airline_id" value={pkg.airline_id} onChange={handlePkg}>
                                <option value="">- Pilih Maskapai -</option>
                                {airlines.map(a => <option key={a.id} value={a.id}>{a.name} ({a.code})</option>)}
                            </select>
                        </Field>
                    </div>

                    <div className="grid grid-cols-2 gap-5">
                        <Field label="Total Seat (Kuota)"><input className="admin-input" type="number" name="full_seat" value={pkg.full_seat} onChange={handlePkg} placeholder="45" /></Field>
                        <Field label="Sisa Seat (Tersedia)"><input className="admin-input" type="number" name="remaining_seat" value={pkg.remaining_seat} onChange={handlePkg} placeholder="Kosongkan jika sama dengan total" /></Field>
                    </div>

                    <Field label="Deskripsi Pengantar">
                        <textarea className="admin-input min-h-[100px] resize-y" name="description" value={pkg.description} onChange={handlePkg} placeholder="Jelaskan secara ringkas tentang paket ini..." />
                    </Field>
                </Section>

                {/* --- Section 2: Departures --- */}
                <Section title="2. Jadwal Keberangkatan (Tabel Package Departures)">
                    <div className="space-y-3">
                        {departures.map((dep, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <input type="date" className="admin-input max-w-[250px]" value={dep.departure_date} onChange={e => updArr(setDepartures, i, 'departure_date', e.target.value)} />
                                {departures.length > 1 && (
                                    <button onClick={() => rmArr(setDepartures, i)} className="p-2.5 bg-red-50 text-red-500 rounded-xl hover:bg-red-100"><Trash2 size={16} /></button>
                                )}
                            </div>
                        ))}
                        <button onClick={() => addArr(setDepartures, { departure_date: '' })} className="text-sm font-bold text-primary flex items-center gap-2 mt-2 px-3 py-2 bg-primary/5 rounded-lg hover:bg-primary/10 w-max"><Plus size={16} /> Tambah Jadwal Baru</button>
                    </div>
                </Section>

                {/* --- Section 3: Prices --- */}
                <Section title="3. Harga & Tipe Kamar (Tabel Package Prices)">
                    <div className="space-y-4">
                        {prices.map((p, i) => (
                            <div key={i} className="group relative bg-gray-50 border border-gray-200 rounded-xl p-4 w-full flex flex-col md:flex-row gap-4">
                                <div className="flex-1">
                                    <label className="text-xs text-gray-500 mb-1 block">Tier</label>
                                    <select className="admin-input bg-white" value={p.tier} onChange={e => updArr(setPrices, i, 'tier', e.target.value)}>
                                        <option value="Net Price">Net Price</option>
                                        <option value="Silver">Silver</option>
                                        <option value="Gold">Gold</option>
                                        <option value="Platinum">Platinum</option>
                                    </select>
                                </div>
                                <div className="flex-1">
                                    <label className="text-xs text-gray-500 mb-1 block">Harga Dasar Rp. (Quad)</label>
                                    <input className="admin-input bg-white" type="number" placeholder="Contoh: 25000000" value={p.price} onChange={e => updArr(setPrices, i, 'price', e.target.value)} />
                                </div>
                                <div className="flex-1">
                                    <label className="text-xs text-gray-500 mb-1 block">Upgrade Double (+Rp.)</label>
                                    <input className="admin-input bg-white" type="number" placeholder="Contoh: 3000000" value={p.upgrade_double} onChange={e => updArr(setPrices, i, 'upgrade_double', e.target.value)} />
                                </div>
                                <div className="flex-1">
                                    <label className="text-xs text-gray-500 mb-1 block">Upgrade Triple (+Rp.)</label>
                                    <input className="admin-input bg-white" type="number" placeholder="Contoh: 1500000" value={p.upgrade_triple} onChange={e => updArr(setPrices, i, 'upgrade_triple', e.target.value)} />
                                </div>
                                {prices.length > 1 && (
                                    <button onClick={() => rmArr(setPrices, i)} className="md:absolute md:-right-3 md:-top-3 bg-red-500 text-white p-1.5 rounded-full shadow-md z-10 hover:bg-red-600"><X size={14} /></button>
                                )}
                            </div>
                        ))}
                        <button type="button" onClick={() => addArr(setPrices, { tier: 'Net Price', price: '', upgrade_double: '', upgrade_triple: '' })} className="text-sm font-bold text-primary flex items-center gap-2 mt-2 px-3 py-2 bg-primary/5 rounded-lg hover:bg-primary/10 w-max"><Plus size={16} /> Tambah Opsi Harga / Kamar</button>
                    </div>
                </Section>

                {/* --- Section 4: Hotels --- */}
                <Section title="4. Akomodasi Hotel (Tabel Package Hotels)">
                    <div className="space-y-4">
                        {hotels.map((h, i) => (
                            <div key={i} className="flex gap-4 items-end">
                                <div className="flex-1">
                                    <label className="text-xs text-gray-500 mb-1 block">Nama Hotel</label>
                                    <select className="admin-input" value={h.hotel_id} onChange={e => updArr(setHotels, i, 'hotel_id', e.target.value)}>
                                        <option value="">- Cari Hotel Database -</option>
                                        {hotelsList.map(hl => <option key={hl.id} value={hl.id}>{hl.name} ⭐{hl.star_rating} ({hl.city})</option>)}
                                    </select>
                                </div>
                                <div className="w-1/4">
                                    <label className="text-xs text-gray-500 mb-1 block">Tipe Kota</label>
                                    <select className="admin-input" value={h.city_type} onChange={e => updArr(setHotels, i, 'city_type', e.target.value)}>
                                        <option value="makkah">Makkah</option>
                                        <option value="madinah">Madinah</option>
                                        <option value="dubai">Dubai</option>
                                        <option value="turki">Turki</option>
                                    </select>
                                </div>
                                <div className="w-[100px]">
                                    <label className="text-xs text-gray-500 mb-1 block">Malam</label>
                                    <input className="admin-input" type="number" placeholder="10" value={h.nights} onChange={e => updArr(setHotels, i, 'nights', e.target.value)} />
                                </div>
                                {hotels.length > 1 && (
                                    <button onClick={() => rmArr(setHotels, i)} className="p-2.5 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 mb-0.5"><Trash2 size={16} /></button>
                                )}
                            </div>
                        ))}
                        <button onClick={() => addArr(setHotels, { hotel_id: '', city_type: 'makkah', nights: '' })} className="text-sm font-bold text-primary flex items-center gap-2 mt-2 px-3 py-2 bg-primary/5 rounded-lg hover:bg-primary/10 w-max"><Plus size={16} /> Tambah Hotel</button>
                    </div>
                </Section>

                {/* --- Section 5: Features --- */}
                <Section title="5. Fasilitas / Fitur Paket (Tabel Package Features)">
                    <Field label="Daftar Fasilitas (Pisahkan tiap poin dengan Enter/Baris Baru)">
                        <textarea
                            className="admin-input min-h-[160px] font-mono whitespace-pre text-sm resize-y"
                            value={featuresText}
                            onChange={e => setFeaturesText(e.target.value)}
                            placeholder="Tiket PP\nVisa Umroh\nHotel..."
                        />
                    </Field>
                </Section>

                {/* --- Section 6: Media / Assets --- */}
                <Section title="6 & 7. Media Promosi & Itinerary PDF">
                    <div className="grid grid-cols-2 gap-6 mb-6">
                        <div className="bg-emerald-50/50 border border-emerald-100 p-5 rounded-2xl flex flex-col items-center justify-center text-center">
                            <UploadCloud size={32} className="text-emerald-500 mb-2" />
                            <h4 className="font-bold text-gray-900 text-sm mb-1">Upload Flyer Poster</h4>
                            <p className="text-xs text-gray-500 mb-3">(JPG/PNG)</p>
                            <input type="file" accept="image/*" onChange={e => setFiles({ ...files, flyer: e.target.files[0] })} className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-emerald-100 file:text-emerald-700 hover:file:bg-emerald-200" />
                        </div>
                        <div className="bg-blue-50/50 border border-blue-100 p-5 rounded-2xl flex flex-col items-center justify-center text-center">
                            <UploadCloud size={32} className="text-blue-500 mb-2" />
                            <h4 className="font-bold text-gray-900 text-sm mb-1">Upload Itinerary / Brosur</h4>
                            <p className="text-xs text-gray-500 mb-3">(PDF)</p>
                            <input type="file" accept="application/pdf" onChange={e => setFiles({ ...files, itinerary_pdf: e.target.files[0] })} className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200" />
                        </div>
                    </div>

                    <div className="bg-gray-50/50 border border-gray-100 p-5 rounded-2xl">
                        <h4 className="font-bold text-gray-900 text-sm mb-1">Galeri Dokumentasi Multi-foto (Opsional)</h4>
                        <input type="file" multiple accept="image/*" onChange={e => setFiles({ ...files, gallery: Array.from(e.target.files) })} className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-gray-200 file:text-gray-700 hover:file:bg-gray-300 mt-2" />
                        {files.gallery.length > 0 && <p className="text-xs text-primary mt-2 font-bold">{files.gallery.length} foto dipilih</p>}
                    </div>
                </Section>
            </main>

            <style>{`
                .admin-input { 
                    width: 100%; background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 0.75rem; 
                    padding: 0.625rem 1rem; color: #111827; font-size: 0.875rem; font-weight: 500; 
                    outline: none; transition: all 0.2s; 
                }
                .admin-input:focus { background-color: #ffffff; border-color: #1d645b; box-shadow: 0 0 0 3px rgba(29, 100, 91, 0.1); }
            `}</style>
        </div>
    )
}
