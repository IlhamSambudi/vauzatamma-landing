const multer = require('multer')
const path = require('path')
const fs = require('fs')

const createStorage = (folder) =>
    multer.diskStorage({
        destination: (req, file, cb) => {
            const dir = path.join(__dirname, '../../uploads', folder)
            fs.mkdirSync(dir, { recursive: true })
            cb(null, dir)
        },
        filename: (req, file, cb) => {
            const ext = path.extname(file.originalname)
            cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`)
        },
    })

const imageFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true)
    else cb(new Error('Only image files are allowed'), false)
}

const pdfFilter = (req, file, cb) => {
    if (file.mimetype === 'application/pdf' || file.mimetype.startsWith('image/')) cb(null, true)
    else cb(new Error('Only PDF or image files are allowed'), false)
}

exports.uploadFlyer = multer({ storage: createStorage('flyers'), fileFilter: imageFilter, limits: { fileSize: 10 * 1024 * 1024 } })
exports.uploadGallery = multer({ storage: createStorage('gallery'), fileFilter: imageFilter, limits: { fileSize: 10 * 1024 * 1024 } })
exports.uploadItinerary = multer({ storage: createStorage('itinerary'), fileFilter: pdfFilter, limits: { fileSize: 20 * 1024 * 1024 } })
exports.uploadMix = multer({ storage: createStorage('packages/assets'), limits: { fileSize: 20 * 1024 * 1024 } }).any()

const mediaFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/') || file.mimetype === 'application/pdf') cb(null, true)
    else cb(new Error('Only images, videos, and PDFs are allowed'), false)
}
exports.uploadMedia = multer({ storage: createStorage('media'), fileFilter: mediaFilter, limits: { fileSize: 50 * 1024 * 1024 } })
