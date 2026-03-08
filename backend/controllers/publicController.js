const db = require('../config/db')

/**
 * testimonials: id, name, city, message, photo_url, created_at
 * (no is_approved column in actual schema)
 */
exports.getTestimonials = async (req, res) => {
    try {
        const result = await db.query(`
            SELECT * FROM testimonials ORDER BY created_at DESC LIMIT 20
        `)
        res.json({ success: true, data: result.rows })
    } catch (err) {
        console.error('getTestimonials error:', err)
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
}

/**
 * gallery: id, title, image_url, created_at
 */
exports.getGallery = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM gallery ORDER BY created_at DESC LIMIT 50')
        res.json({ success: true, data: result.rows })
    } catch (err) {
        console.error('getGallery error:', err)
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
}

/**
 * faq: id, question, answer, created_at
 * (no is_active/sort_order in actual schema)
 */
exports.getFaq = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM faq ORDER BY created_at ASC')
        res.json({ success: true, data: result.rows })
    } catch (err) {
        console.error('getFaq error:', err)
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
}
