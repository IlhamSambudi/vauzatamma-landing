import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import HomePage from './pages/HomePage'
import PackageDetailPage from './pages/PackageDetailPage'
import AdminLoginPage from './pages/AdminLoginPage'
import AdminDashboardPage from './pages/AdminDashboardPage'
import AdminPackageCreatePage from './pages/AdminPackageCreatePage'

function ProtectedRoute({ children }) {
    const token = localStorage.getItem('admin_token')
    return token ? children : <Navigate to="/admin/login" replace />
}

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/packages/:id" element={<PackageDetailPage />} />
                <Route path="/admin/login" element={<AdminLoginPage />} />
                <Route
                    path="/admin/dashboard"
                    element={
                        <ProtectedRoute>
                            <AdminDashboardPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/packages/create"
                    element={
                        <ProtectedRoute>
                            <AdminPackageCreatePage />
                        </ProtectedRoute>
                    }
                />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    )
}
