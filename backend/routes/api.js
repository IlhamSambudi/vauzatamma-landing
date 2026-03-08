const express = require('express')
const router = express.Router()
const packageController = require('../controllers/packageController')
const leadController = require('../controllers/leadController')
const publicController = require('../controllers/publicController')
const adminController = require('../controllers/adminController')
const auth = require('../middleware/auth')
const { uploadFlyer, uploadGallery, uploadMix, uploadMedia } = require('../middleware/upload')

// Public routes
router.get('/packages', packageController.getPackages)
router.get('/packages/:id', packageController.getPackageById)
router.post('/leads', leadController.createLead)
router.get('/testimonials', publicController.getTestimonials)
router.get('/gallery', publicController.getGallery)
router.get('/faq', publicController.getFaq)

// Admin auth
router.post('/admin/login', adminController.login)

// Packages
router.get('/admin/packages', auth, adminController.getPackages)
router.post('/admin/packages', auth, adminController.createPackage)
router.post('/admin/packages/create-full', auth, uploadMix, adminController.createFullPackage)
router.put('/admin/packages/:id', auth, adminController.updatePackage)
router.delete('/admin/packages/:id', auth, adminController.deletePackage)
router.post('/admin/upload', auth, uploadFlyer.single('file'), adminController.uploadFile)

// Leads
router.get('/admin/leads', auth, leadController.getLeads)
router.delete('/admin/leads/:id', auth, adminController.deleteLead)

// Gallery
router.get('/admin/gallery', auth, adminController.getGallery)
router.post('/admin/gallery/upload', auth, uploadGallery.single('file'), adminController.uploadGallery)
router.put('/admin/gallery/:id', auth, adminController.updateGallery)
router.delete('/admin/gallery/:id', auth, adminController.deleteGallery)

// FAQ
router.get('/admin/faq', auth, adminController.getFaq)
router.post('/admin/faq', auth, adminController.createFaq)
router.put('/admin/faq/:id', auth, adminController.updateFaq)
router.delete('/admin/faq/:id', auth, adminController.deleteFaq)

// Testimonials
router.get('/admin/testimonials', auth, adminController.getTestimonials)
router.post('/admin/testimonials', auth, uploadGallery.single('file'), adminController.createTestimonial)
router.put('/admin/testimonials/:id', auth, uploadGallery.single('file'), adminController.updateTestimonial)
router.delete('/admin/testimonials/:id', auth, adminController.deleteTestimonial)

// Airlines CRUD
router.get('/admin/airlines', auth, adminController.getAirlines)
router.post('/admin/airlines', auth, uploadFlyer.single('file'), adminController.createAirline)
router.put('/admin/airlines/:id', auth, uploadFlyer.single('file'), adminController.updateAirline)
router.delete('/admin/airlines/:id', auth, adminController.deleteAirline)

// Hotels CRUD
router.get('/admin/hotels', auth, adminController.getHotels)
router.post('/admin/hotels', auth, adminController.createHotel)
router.put('/admin/hotels/:id', auth, adminController.updateHotel)
router.delete('/admin/hotels/:id', auth, adminController.deleteHotel)

// Media Library
router.get('/admin/media', auth, adminController.getMediaLibrary)
router.post('/admin/media/upload', auth, uploadMedia.single('file'), adminController.uploadMediaLibrary)
router.delete('/admin/media/:id', auth, adminController.deleteMedia)

// Admin Accounts CRUD
router.get('/admin/accounts', auth, adminController.getAdmins)
router.post('/admin/accounts', auth, adminController.createAdmin)
router.put('/admin/accounts/:id', auth, adminController.updateAdmin)
router.delete('/admin/accounts/:id', auth, adminController.deleteAdmin)

module.exports = router
