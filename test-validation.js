const { Client } = require('pg')
const bcrypt = require('bcryptjs')
const axios = require('axios')
const FormData = require('form-data')

async function runTests() {
    console.log('--- SYSTEM VALIDATION SCRIPT ---')

    // 1. Verify DB Tables
    const client = new Client({ connectionString: 'postgres://postgres:postgres@localhost:5433/vauza_db' })
    await client.connect()
    
    console.log('\n[1] Verifying database schema...')
    const res = await client.query(`
        SELECT tablename 
        FROM pg_catalog.pg_tables 
        WHERE schemaname = 'public';
    `)
    const tables = res.rows.map(r => r.tablename)
    const required = [
        'admins', 'airlines', 'hotels', 'packages', 'package_departures',
        'package_prices', 'package_features', 'package_hotels', 'package_assets',
        'itineraries', 'gallery', 'leads', 'faq', 'media_library', 'testimonials'
    ]
    let missing = required.filter(t => !tables.includes(t))
    if (missing.length > 0) {
        console.error('Missing tables:', missing)
    } else {
        console.log('All required tables exist:', required.join(', '))
    }

    // 2. Set Admin Password to 'password'
    console.log('\n[2] Seeding admin password...')
    const hash = bcrypt.hashSync('password', 10)
    await client.query('UPDATE admins SET password_hash = $1 WHERE username = $2', [hash, 'admin'])
    console.log('Admin password seeded.')
    
    // 3. Verify Backend Health
    console.log('\n[3] Verifying backend health...')
    try {
        const healthRes = await axios.get('http://localhost:5001/health')
        console.log('Health response:', healthRes.data)
    } catch (e) {
        console.error('Healthcheck failed:', e.message)
    }

    // 4. Verify API Routing
    console.log('\n[4] Verifying backend API routing...')
    try {
        await axios.get('http://localhost:5001/api')
    } catch (e) {
        console.log('API root response:', e.response ? e.response.data : e.message) // Expecting 404 Route not found
    }

    // 5. Test Login and Package Creation
    console.log('\n[5] Testing Package Creation Flow...')
    try {
        const loginRes = await axios.post('http://localhost:5001/api/admin/login', { username: 'admin', password: 'password' })
        const token = loginRes.data.token
        console.log('Login successful. Token acquired.')

        const fd = new FormData()
        fd.append('package', JSON.stringify({ package_name: 'Test Umroh', program_type: 'umroh', full_seat: 45 }))
        fd.append('departures', JSON.stringify([{ departure_date: '2026-05-08' }]))
        fd.append('prices', JSON.stringify([{ tier: 'quad', price: 38000000 }]))
        fd.append('features', JSON.stringify(['Tiket VIP', 'Hotel Premium']))
        fd.append('hotels', JSON.stringify([{ hotel_id: 1, stay_city: 'makkah', nights: 5 }]))

        const createRes = await axios.post('http://localhost:5001/api/admin/packages/create-full', fd, {
            headers: {
                ...fd.getHeaders(),
                'Authorization': `Bearer ${token}`
            }
        })
        console.log('Package Creation Result:', createRes.data)

        // Verify inserted records
        const pkgDb = await client.query('SELECT * FROM packages WHERE package_name = $1', ['Test Umroh'])
        const insertedId = pkgDb.rows[0].id
        console.log('Inserted Package ID:', insertedId)
        
        const depDb = await client.query('SELECT * FROM package_departures WHERE package_id = $1', [insertedId])
        console.log(`Departures inserted: ${depDb.rows.length}`)

        const prcDb = await client.query('SELECT * FROM package_prices WHERE package_id = $1', [insertedId])
        console.log(`Prices inserted: ${prcDb.rows.length}`)

        const ftDb = await client.query('SELECT * FROM package_features WHERE package_id = $1', [insertedId])
        console.log(`Features inserted: ${ftDb.rows.length}`)

        const htDb = await client.query('SELECT * FROM package_hotels WHERE package_id = $1', [insertedId])
        console.log(`Hotels inserted: ${htDb.rows.length}`)

    } catch (e) {
        console.error('Package creation failed:', e.response ? e.response.data : e.message)
    }

    await client.end()
    console.log('\n--- TESTS COMPLETED ---')
}

runTests()
