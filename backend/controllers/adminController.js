const db = require('../config/db')

exports.getAirlines = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM airlines ORDER BY name ASC')
        res.json({ success: true, data: result.rows })
    } catch (err) {
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
}

exports.getHotels = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM hotels ORDER BY name ASC')
        res.json({ success: true, data: result.rows })
    } catch (err) {
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
}

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

/**
 * Admin login
 * admins schema: id, username, password_hash, created_at
 */
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body
        if (!username || !password)
            return res.status(400).json({ success: false, message: 'Username dan password wajib diisi' })

        const result = await db.query('SELECT * FROM admins WHERE username = $1', [username])
        if (!result.rows[0])
            return res.status(401).json({ success: false, message: 'Username atau password salah' })

        const admin = result.rows[0]
        const valid = await bcrypt.compare(password, admin.password_hash)
        if (!valid)
            return res.status(401).json({ success: false, message: 'Username atau password salah' })

        const token = jwt.sign(
            { id: admin.id, username: admin.username },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
        )

        res.json({ success: true, token, admin: { id: admin.id, username: admin.username } })
    } catch (err) {
        console.error('admin login error:', err)
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
}

/**
 * GET all packages — admin view (all, no filter)
 * packages: id, package_code, package_name, program_type, plus_destination,
 *           airline_id, description, full_seat, remaining_seat, created_at
 */
exports.getPackages = async (req, res) => {
    try {
        const result = await db.query(`
            SELECT p.*,
                al.name AS airline_name,
                (SELECT MIN(departure_date) FROM package_departures WHERE package_id = p.id) AS next_departure,
                (SELECT string_agg(tier, ', ') FROM package_prices WHERE package_id = p.id) AS tier
            FROM packages p
            LEFT JOIN airlines al ON al.id = p.airline_id
            ORDER BY p.created_at DESC
        `)
        res.json({ success: true, data: result.rows })
    } catch (err) {
        console.error('admin getPackages error:', err)
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
}

/**
 * CREATE package + insert into package_departures and package_prices
 */
exports.createPackage = async (req, res) => {
    try {
        const {
            package_name, package_code, program_type, plus_destination,
            description, full_seat, airline_id,
            departure_date,
            price_triple, price_double, price_quad
        } = req.body

        // Insert package
        const pkgResult = await db.query(`
            INSERT INTO packages
                (package_code, package_name, program_type, plus_destination, airline_id, description, full_seat, remaining_seat, created_at)
            VALUES ($1,$2,$3,$4,$5,$6,$7,$7,NOW())
            RETURNING *
        `, [
            package_code || null,
            package_name,
            program_type || 'umroh',
            plus_destination || null,
            airline_id || null,
            description || null,
            full_seat || 0
        ])

        const pkg = pkgResult.rows[0]

        // Insert departure if provided
        if (departure_date) {
            await db.query(
                'INSERT INTO package_departures (package_id, departure_date) VALUES ($1,$2)',
                [pkg.id, departure_date]
            )
        }

        // Insert prices if provided
        const pricePairs = [
            ['triple', price_triple],
            ['double', price_double],
            ['quad', price_quad],
        ]
        for (const [tier, price] of pricePairs) {
            if (price) {
                await db.query(
                    'INSERT INTO package_prices (package_id, tier, price) VALUES ($1,$2,$3)',
                    [pkg.id, tier, price]
                )
            }
        }

        res.status(201).json({ success: true, data: pkg })
    } catch (err) {
        console.error('createPackage error:', err)
        res.status(500).json({ success: false, message: 'Internal server error', detail: err.message })
    }
}

/**
 * UPDATE package + upsert departure/prices
 */
exports.updatePackage = async (req, res) => {
    try {
        const { id } = req.params
        const {
            package_name, package_code, program_type, plus_destination,
            description, full_seat, remaining_seat, airline_id,
            departure_date,
            price_triple, price_double, price_quad
        } = req.body

        const result = await db.query(`
            UPDATE packages SET
                package_code      = COALESCE($1, package_code),
                package_name      = $2,
                program_type      = COALESCE($3, program_type),
                plus_destination  = $4,
                airline_id        = $5,
                description       = $6,
                full_seat         = COALESCE($7, full_seat),
                remaining_seat    = COALESCE($8, remaining_seat)
            WHERE id = $9
            RETURNING *
        `, [package_code, package_name, program_type, plus_destination, airline_id, description, full_seat, remaining_seat, id])

        if (!result.rows[0]) return res.status(404).json({ success: false, message: 'Package not found' })

        // Upsert departure
        if (departure_date) {
            const existing = await db.query('SELECT id FROM package_departures WHERE package_id = $1 LIMIT 1', [id])
            if (existing.rows[0]) {
                await db.query('UPDATE package_departures SET departure_date=$1 WHERE package_id=$2', [departure_date, id])
            } else {
                await db.query('INSERT INTO package_departures (package_id, departure_date) VALUES ($1,$2)', [id, departure_date])
            }
        }

        // Upsert prices
        const pricePairs = [
            ['triple', price_triple],
            ['double', price_double],
            ['quad', price_quad],
        ]
        for (const [tier, price] of pricePairs) {
            if (price !== undefined && price !== '') {
                const ex = await db.query('SELECT id FROM package_prices WHERE package_id=$1 AND tier=$2 LIMIT 1', [id, tier])
                if (ex.rows[0]) {
                    await db.query('UPDATE package_prices SET price=$1 WHERE package_id=$2 AND tier=$3', [price, id, tier])
                } else {
                    await db.query('INSERT INTO package_prices (package_id, tier, price) VALUES ($1,$2,$3)', [id, tier, price])
                }
            }
        }

        res.json({ success: true, data: result.rows[0] })
    } catch (err) {
        console.error('updatePackage error:', err)
        res.status(500).json({ success: false, message: 'Internal server error', detail: err.message })
    }
}

/**
 * DELETE package (hard delete with cascade cleanup)
 */
exports.deletePackage = async (req, res) => {
    try {
        const { id } = req.params
        await db.query('DELETE FROM package_features  WHERE package_id = $1', [id])
        await db.query('DELETE FROM package_prices    WHERE package_id = $1', [id])
        await db.query('DELETE FROM package_departures WHERE package_id = $1', [id])
        await db.query('DELETE FROM package_hotels    WHERE package_id = $1', [id])
        await db.query('DELETE FROM package_assets    WHERE package_id = $1', [id])
        await db.query('DELETE FROM itineraries       WHERE package_id = $1', [id])
        await db.query('DELETE FROM packages          WHERE id = $1', [id])
        res.json({ success: true, message: 'Package deleted' })
    } catch (err) {
        console.error('deletePackage error:', err)
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
}

/**
 * Upload file to media_library
 * media_library: id, file_name, file_url, file_type, created_at
 */
exports.uploadFile = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' })
        const { package_id, asset_type } = req.body
        const fileUrl = req.file.filename

        await db.query(
            'INSERT INTO media_library (file_name, file_url, file_type, created_at) VALUES ($1,$2,$3,NOW())',
            [req.file.originalname, fileUrl, req.file.mimetype]
        )

        if (package_id) {
            await db.query(
                'INSERT INTO package_assets (package_id, asset_type, asset_url, created_at) VALUES ($1,$2,$3,NOW())',
                [package_id, asset_type || 'flyer', fileUrl]
            )
        }

        res.json({ success: true, file_url: fileUrl, message: 'File uploaded successfully' })
    } catch (err) {
        console.error('uploadFile error:', err)
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
}

/**
 * Gallery
 * gallery: id, title, image_url, created_at
 */
exports.getGallery = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM gallery ORDER BY created_at DESC')
        res.json({ success: true, data: result.rows })
    } catch (err) {
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
}

exports.uploadGallery = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' })
        const { title } = req.body
        const imageUrl = `/uploads/gallery/${req.file.filename}`

        await db.query(
            'INSERT INTO gallery (title, image_url, created_at) VALUES ($1,$2,NOW())',
            [title || req.file.originalname, imageUrl]
        )
        res.json({ success: true, image_url: imageUrl, message: 'Gallery image uploaded' })
    } catch (err) {
        console.error('uploadGallery error:', err)
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
}

exports.deleteGallery = async (req, res) => {
    try {
        await db.query('DELETE FROM gallery WHERE id = $1', [req.params.id])
        res.json({ success: true, message: 'Gallery item deleted' })
    } catch (err) {
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
}

/**
 * Leads — admin view
 * leads: id, name, phone, package_interest, message, created_at
 */
exports.getLeads = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM leads ORDER BY created_at DESC')
        res.json({ success: true, data: result.rows })
    } catch (err) {
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
}

/**
 * FAQ Management
 * faq: id, question, answer, created_at
 */
exports.getFaq = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM faq ORDER BY created_at ASC')
        res.json({ success: true, data: result.rows })
    } catch (err) {
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
}

exports.createFaq = async (req, res) => {
    try {
        const { question, answer } = req.body
        const result = await db.query(
            'INSERT INTO faq (question, answer, created_at) VALUES ($1,$2,NOW()) RETURNING *',
            [question, answer]
        )
        res.status(201).json({ success: true, data: result.rows[0] })
    } catch (err) {
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
}

exports.updateFaq = async (req, res) => {
    try {
        const { question, answer } = req.body
        const result = await db.query(
            'UPDATE faq SET question=$1, answer=$2 WHERE id=$3 RETURNING *',
            [question, answer, req.params.id]
        )
        res.json({ success: true, data: result.rows[0] })
    } catch (err) {
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
}

exports.deleteFaq = async (req, res) => {
    try {
        await db.query('DELETE FROM faq WHERE id=$1', [req.params.id])
        res.json({ success: true })
    } catch (err) {
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
}

/**
 * Testimonial Management
 * testimonials: id, name, city, message, photo_url, created_at
 */
exports.getTestimonials = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM testimonials ORDER BY created_at DESC')
        res.json({ success: true, data: result.rows })
    } catch (err) {
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
}

exports.createTestimonial = async (req, res) => {
    try {
        const { name, city, message } = req.body
        const photo_url = req.file ? `/uploads/gallery/${req.file.filename}` : null
        const result = await db.query(
            'INSERT INTO testimonials (name, city, message, photo_url, created_at) VALUES ($1,$2,$3,$4,NOW()) RETURNING *',
            [name, city, message, photo_url]
        )
        res.status(201).json({ success: true, data: result.rows[0] })
    } catch (err) {
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
}

exports.updateTestimonial = async (req, res) => {
    try {
        const { name, city, message } = req.body
        let query, params
        if (req.file) {
            const photo_url = `/uploads/gallery/${req.file.filename}`
            query = 'UPDATE testimonials SET name=$1, city=$2, message=$3, photo_url=$4 WHERE id=$5 RETURNING *'
            params = [name, city, message, photo_url, req.params.id]
        } else {
            query = 'UPDATE testimonials SET name=$1, city=$2, message=$3 WHERE id=$4 RETURNING *'
            params = [name, city, message, req.params.id]
        }
        const result = await db.query(query, params)
        res.json({ success: true, data: result.rows[0] })
    } catch (err) {
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
}

exports.deleteTestimonial = async (req, res) => {
    try {
        await db.query('DELETE FROM testimonials WHERE id=$1', [req.params.id])
        res.json({ success: true })
    } catch (err) {
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
}

/**
 * ----------------------------------------------------
 * createFullPackage (Multi-table transactional insert)
 * ----------------------------------------------------
 */
exports.createFullPackage = async (req, res) => {
    const client = await db.connect()

    try {
        await client.query('BEGIN')

        // 1. parse request body
        const pkg = JSON.parse(req.body.package || '{}')
        const departures = JSON.parse(req.body.departures || '[]')
        const prices = JSON.parse(req.body.prices || '[]')
        const features = JSON.parse(req.body.features || '[]')
        const hotels = JSON.parse(req.body.hotels || '[]')

        // Insert into 'packages' table
        const pkgRes = await client.query(
            `INSERT INTO packages 
            (package_code, package_name, program_type, plus_destination, description, full_seat, remaining_seat, airline_id, created_at) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW()) RETURNING id`,
            [
                pkg.package_code || `VT-${Date.now()}`,
                pkg.package_name, pkg.program_type || 'umroh',
                pkg.plus_destination, pkg.description, pkg.full_seat || null,
                pkg.remaining_seat || pkg.full_seat || null, pkg.airline_id || null
            ]
        )
        const newPackageId = pkgRes.rows[0].id

        // 2. Insert into 'package_departures'
        for (let dep of departures) {
            if (dep.departure_date) {
                await client.query(
                    'INSERT INTO package_departures (package_id, departure_date) VALUES ($1, $2)',
                    [newPackageId, dep.departure_date]
                )
            }
        }

        // 3. Insert into 'package_prices'
        for (let p of prices) {
            if (p.tier) {
                await client.query(
                    'INSERT INTO package_prices (package_id, tier, price, upgrade_double, upgrade_triple) VALUES ($1, $2, $3, $4, $5)',
                    [newPackageId, p.tier, p.price || 0, p.upgrade_double || 0, p.upgrade_triple || 0]
                )
            }
        }

        // 4. Insert into 'package_features'
        for (let feat of features) {
            const featureText = feat.name || feat.feature || feat
            if (featureText) {
                await client.query(
                    'INSERT INTO package_features (package_id, feature) VALUES ($1, $2)',
                    [newPackageId, featureText]
                )
            }
        }

        // 5. Insert into 'package_hotels'
        for (let h of hotels) {
            if (h.hotel_id) {
                await client.query(
                    'INSERT INTO package_hotels (package_id, hotel_id, stay_city, nights) VALUES ($1, $2, $3, $4)',
                    [newPackageId, h.hotel_id, h.city_type || h.stay_city, h.nights || 0]
                )
            }
        }

        // Processing Uploaded Files
        if (req.files && req.files.length > 0) {
            for (let file of req.files) {
                const filePath = `/uploads/packages/assets/${file.filename}`

                // 6. Insert into 'package_assets' (flyer, cover, gallery)
                if (['flyer', 'cover', 'gallery'].includes(file.fieldname)) {
                    await client.query(
                        'INSERT INTO package_assets (package_id, asset_type, asset_url, created_at) VALUES ($1, $2, $3, NOW())',
                        [newPackageId, file.fieldname, filePath]
                    )
                }

                // 7. Insert into 'itineraries' (PDF)
                if (file.fieldname === 'itinerary_pdf') {
                    await client.query(
                        'INSERT INTO itineraries (package_id, pdf_url, created_at) VALUES ($1, $2, NOW())',
                        [newPackageId, filePath]
                    )
                }
            }
        }

        await client.query('COMMIT')
        res.status(201).json({ success: true, message: 'Package created fully successfully!', package_id: newPackageId })
    } catch (err) {
        await client.query('ROLLBACK')
        console.error('createFullPackage Error:', err)
        res.status(500).json({ success: false, message: 'Internal server error while creating comprehensive package', error: err.message })
    } finally {
        client.release()
    }
}

// ─────────────────────── AIRLINES CRUD ───────────────────────
exports.createAirline = async (req, res) => {
    try {
        const { name, code } = req.body
        if (!name) return res.status(400).json({ success: false, message: 'Nama maskapai wajib diisi' })

        let logo_url = null
        if (req.file) {
            logo_url = `/uploads/flyers/${req.file.filename}` // or wherever upload middleware saves it
        }

        const r = await db.query(
            'INSERT INTO airlines (name, code, logo_url) VALUES ($1, $2, $3) RETURNING *',
            [name, code || null, logo_url]
        )
        res.status(201).json({ success: true, data: r.rows[0] })
    } catch (err) { res.status(500).json({ success: false, message: err.message }) }
}
exports.updateAirline = async (req, res) => {
    try {
        const { name, code } = req.body
        let query, params

        if (req.file) {
            const logo_url = `/uploads/flyers/${req.file.filename}`
            query = 'UPDATE airlines SET name=$1, code=$2, logo_url=$3 WHERE id=$4 RETURNING *'
            params = [name, code || null, logo_url, req.params.id]
        } else {
            query = 'UPDATE airlines SET name=$1, code=$2 WHERE id=$3 RETURNING *'
            params = [name, code || null, req.params.id]
        }

        const r = await db.query(query, params)
        if (!r.rows[0]) return res.status(404).json({ success: false, message: 'Maskapai tidak ditemukan' })
        res.json({ success: true, data: r.rows[0] })
    } catch (err) { res.status(500).json({ success: false, message: err.message }) }
}
exports.deleteAirline = async (req, res) => {
    try {
        await db.query('DELETE FROM airlines WHERE id=$1', [req.params.id])
        res.json({ success: true, message: 'Maskapai dihapus' })
    } catch (err) { res.status(500).json({ success: false, message: err.message }) }
}

// ─────────────────────── HOTELS CRUD ───────────────────────
exports.createHotel = async (req, res) => {
    try {
        const { name, city, country, star_rating } = req.body
        if (!name) return res.status(400).json({ success: false, message: 'Nama hotel wajib diisi' })
        const r = await db.query(
            'INSERT INTO hotels (name, city, country, star_rating) VALUES ($1, $2, $3, $4) RETURNING *',
            [name, city || null, country || null, star_rating || 5]
        )
        res.status(201).json({ success: true, data: r.rows[0] })
    } catch (err) { res.status(500).json({ success: false, message: err.message }) }
}
exports.updateHotel = async (req, res) => {
    try {
        const { name, city, country, star_rating } = req.body
        const r = await db.query(
            'UPDATE hotels SET name=$1, city=$2, country=$3, star_rating=$4 WHERE id=$5 RETURNING *',
            [name, city || null, country || null, star_rating || 5, req.params.id]
        )
        if (!r.rows[0]) return res.status(404).json({ success: false, message: 'Hotel tidak ditemukan' })
        res.json({ success: true, data: r.rows[0] })
    } catch (err) { res.status(500).json({ success: false, message: err.message }) }
}
exports.deleteHotel = async (req, res) => {
    try {
        await db.query('DELETE FROM hotels WHERE id=$1', [req.params.id])
        res.json({ success: true, message: 'Hotel dihapus' })
    } catch (err) { res.status(500).json({ success: false, message: err.message }) }
}

// ─────────────────────── MEDIA LIBRARY CRUD ───────────────────────
exports.getMediaLibrary = async (req, res) => {
    try {
        const r = await db.query('SELECT * FROM media_library ORDER BY created_at DESC')
        res.json({ success: true, data: r.rows })
    } catch (err) { res.status(500).json({ success: false, message: err.message }) }
}
exports.uploadMediaLibrary = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ success: false, message: 'File wajib diupload' })
        const fileUrl = `/uploads/media/${req.file.filename}`
        const fileType = req.file.mimetype.startsWith('image') ? 'image' : req.file.mimetype.startsWith('video') ? 'video' : 'document'
        const r = await db.query(
            'INSERT INTO media_library (file_name, file_url, file_type, created_at) VALUES ($1, $2, $3, NOW()) RETURNING *',
            [req.file.originalname, fileUrl, fileType]
        )
        res.status(201).json({ success: true, data: r.rows[0] })
    } catch (err) { res.status(500).json({ success: false, message: err.message }) }
}
exports.deleteMedia = async (req, res) => {
    try {
        await db.query('DELETE FROM media_library WHERE id=$1', [req.params.id])
        res.json({ success: true, message: 'File dihapus' })
    } catch (err) { res.status(500).json({ success: false, message: err.message }) }
}

// ─────────────────────── ADMINS CRUD ───────────────────────
exports.getAdmins = async (req, res) => {
    try {
        const r = await db.query('SELECT id, username, created_at FROM admins ORDER BY created_at DESC')
        res.json({ success: true, data: r.rows })
    } catch (err) { res.status(500).json({ success: false, message: err.message }) }
}
exports.createAdmin = async (req, res) => {
    try {
        const { username, password } = req.body
        if (!username || !password) return res.status(400).json({ success: false, message: 'Username dan password wajib diisi' })
        const hash = await bcrypt.hash(password, 12)
        const r = await db.query(
            'INSERT INTO admins (username, password_hash) VALUES ($1, $2) RETURNING id, username, created_at',
            [username, hash]
        )
        res.status(201).json({ success: true, data: r.rows[0] })
    } catch (err) {
        if (err.code === '23505') return res.status(400).json({ success: false, message: 'Username sudah digunakan' })
        res.status(500).json({ success: false, message: err.message })
    }
}
exports.updateAdmin = async (req, res) => {
    try {
        const { username, password } = req.body
        if (password) {
            const hash = await bcrypt.hash(password, 12)
            await db.query('UPDATE admins SET username=$1, password_hash=$2 WHERE id=$3', [username, hash, req.params.id])
        } else {
            await db.query('UPDATE admins SET username=$1 WHERE id=$2', [username, req.params.id])
        }
        res.json({ success: true, message: 'Admin diperbarui' })
    } catch (err) { res.status(500).json({ success: false, message: err.message }) }
}
exports.deleteAdmin = async (req, res) => {
    try {
        const count = await db.query('SELECT COUNT(*) FROM admins')
        if (parseInt(count.rows[0].count) <= 1)
            return res.status(400).json({ success: false, message: 'Tidak bisa hapus admin terakhir' })
        await db.query('DELETE FROM admins WHERE id=$1', [req.params.id])
        res.json({ success: true, message: 'Admin dihapus' })
    } catch (err) { res.status(500).json({ success: false, message: err.message }) }
}

// ─────────────────────── LEADS DELETE ───────────────────────
exports.deleteLead = async (req, res) => {
    try {
        await db.query('DELETE FROM leads WHERE id=$1', [req.params.id])
        res.json({ success: true, message: 'Lead dihapus' })
    } catch (err) { res.status(500).json({ success: false, message: err.message }) }
}

// ─────────────────────── GALLERY TITLE UPDATE ───────────────────────
exports.updateGallery = async (req, res) => {
    try {
        const { title } = req.body
        const r = await db.query('UPDATE gallery SET title=$1 WHERE id=$2 RETURNING *', [title, req.params.id])
        res.json({ success: true, data: r.rows[0] })
    } catch (err) { res.status(500).json({ success: false, message: err.message }) }
}
