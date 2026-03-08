const db = require('../config/db')

/**
 * leads schema: id, name, phone, package_interest, message, created_at
 * (no email or package_type)
 */
exports.createLead = async (req, res) => {
    try {
        const { name, phone, message, package_interest } = req.body
        if (!name || !phone) return res.status(400).json({ success: false, message: 'Nama dan nomor HP wajib diisi' })

        await db.query(
            'INSERT INTO leads (name, phone, package_interest, message, created_at) VALUES ($1,$2,$3,$4,NOW())',
            [name, phone, package_interest || null, message || null]
        )
        res.status(201).json({ success: true, message: 'Pesan berhasil terkirim. Tim kami akan segera menghubungi Anda.' })
    } catch (err) {
        console.error('createLead error:', err)
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
}

exports.getLeads = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM leads ORDER BY created_at DESC')
        res.json({ success: true, data: result.rows })
    } catch (err) {
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
}
