import axios from 'axios'

const api = axios.create({
    baseURL: '/api',
    headers: { 'Content-Type': 'application/json' },
})

// Attach JWT for admin routes
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('admin_token')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
})

api.interceptors.response.use(
    (res) => res,
    (err) => {
        if (err.response?.status === 401) {
            localStorage.removeItem('admin_token')
            window.location.href = '/admin/login'
        }
        return Promise.reject(err)
    }
)

// ── Public
export const getPackages = () => api.get('/packages')
export const getPackageById = (id) => api.get(`/packages/${id}`)
export const submitLead = (data) => api.post('/leads', data)
export const getTestimonials = () => api.get('/testimonials')
export const getGallery = () => api.get('/gallery')
export const getFaq = () => api.get('/faq')

// ── Admin: auth
export const adminLogin = (data) => api.post('/admin/login', data)

// ── Admin: packages
export const adminGetPackages = () => api.get('/admin/packages')
export const adminCreatePackage = (data) => api.post('/admin/packages', data)
export const adminCreateFullPackage = (fd) => api.post('/admin/packages/create-full', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
export const adminUpdatePackage = (id, data) => api.put(`/admin/packages/${id}`, data)
export const adminDeletePackage = (id) => api.delete(`/admin/packages/${id}`)
export const adminUploadFile = (fd) => api.post('/admin/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } })

// ── Admin: leads
export const adminGetLeads = () => api.get('/admin/leads')
export const adminDeleteLead = (id) => api.delete(`/admin/leads/${id}`)

// ── Admin: gallery
export const adminGetGallery = () => api.get('/admin/gallery')
export const adminUploadGallery = (fd) => api.post('/admin/gallery/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
export const adminUpdateGallery = (id, data) => api.put(`/admin/gallery/${id}`, data)
export const adminDeleteGallery = (id) => api.delete(`/admin/gallery/${id}`)

// ── Admin: FAQ
export const adminGetFaq = () => api.get('/admin/faq')
export const adminCreateFaq = (data) => api.post('/admin/faq', data)
export const adminUpdateFaq = (id, data) => api.put(`/admin/faq/${id}`, data)
export const adminDeleteFaq = (id) => api.delete(`/admin/faq/${id}`)

// ── Admin: testimonials
export const adminGetTestimonials = () => api.get('/admin/testimonials')
export const adminCreateTestimonial = (fd) => api.post('/admin/testimonials', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
export const adminUpdateTestimonial = (id, fd) => api.put(`/admin/testimonials/${id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
export const adminDeleteTestimonial = (id) => api.delete(`/admin/testimonials/${id}`)

// ── Admin: airlines
export const adminGetAirlines = () => api.get('/admin/airlines')
export const adminCreateAirline = (fd) => api.post('/admin/airlines', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
export const adminUpdateAirline = (id, fd) => api.put(`/admin/airlines/${id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
export const adminDeleteAirline = (id) => api.delete(`/admin/airlines/${id}`)

// ── Admin: hotels
export const adminGetHotels = () => api.get('/admin/hotels')
export const adminCreateHotel = (data) => api.post('/admin/hotels', data)
export const adminUpdateHotel = (id, data) => api.put(`/admin/hotels/${id}`, data)
export const adminDeleteHotel = (id) => api.delete(`/admin/hotels/${id}`)

// ── Admin: media library
export const adminGetMedia = () => api.get('/admin/media')
export const adminUploadMedia = (fd) => api.post('/admin/media/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
export const adminDeleteMedia = (id) => api.delete(`/admin/media/${id}`)

// ── Admin: accounts
export const adminGetAccounts = () => api.get('/admin/accounts')
export const adminCreateAccount = (data) => api.post('/admin/accounts', data)
export const adminUpdateAccount = (id, data) => api.put(`/admin/accounts/${id}`, data)
export const adminDeleteAccount = (id) => api.delete(`/admin/accounts/${id}`)

export default api
