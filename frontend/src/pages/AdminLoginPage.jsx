import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { adminLogin } from '../services/api'
import { Lock, User, Eye, EyeOff } from 'lucide-react'

export default function AdminLoginPage() {
    const navigate = useNavigate()
    const [form, setForm] = useState({ username: '', password: '' })
    const [showPw, setShowPw] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        try {
            const res = await adminLogin(form)
            localStorage.setItem('admin_token', res.data.token)
            navigate('/admin/dashboard')
        } catch {
            setError('Username atau password salah.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-gray-50" />

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-3xl p-8 w-full max-w-md relative shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100"
            >
                <div className="text-center mb-8">
                    <div className="w-14 h-14 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md">
                        <span className="text-white font-bold text-2xl">ﻭ</span>
                    </div>
                    <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
                    <p className="text-gray-500 text-sm mt-1">Vauza Tamma Abadi</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs text-gray-600 mb-1.5 font-medium">Username</label>
                        <div className="relative">
                            <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                value={form.username}
                                onChange={(e) => setForm({ ...form, username: e.target.value })}
                                required
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-gray-900 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                                placeholder="Masukkan username"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs text-gray-600 mb-1.5 font-medium">Password</label>
                        <div className="relative">
                            <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type={showPw ? 'text' : 'password'}
                                value={form.password}
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                                required
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-12 py-3 text-gray-900 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPw(!showPw)}
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                            >
                                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <p className="text-red-600 text-xs bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60"
                    >
                        {loading && <span className="animate-spin border-2 border-white/30 border-t-white rounded-full w-4 h-4" />}
                        {loading ? 'Masuk...' : 'Masuk'}
                    </button>
                </form>

                <p className="text-center mt-6 text-gray-600 text-xs">
                    <a href="/" className="hover:text-gray-400 transition-colors">← Kembali ke Landing Page</a>
                </p>
            </motion.div>
        </div>
    )
}
