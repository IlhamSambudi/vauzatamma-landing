const db = require('../config/db')

/**
 * GET all packages with prices, departures, hotels, airline
 * Schema: packages(id, package_code, package_name, program_type, plus_destination,
 *         airline_id, description, full_seat, remaining_seat, created_at)
 */
const getPackages = async () => {
  const result = await db.query(`
        SELECT
            p.*,
            (
                SELECT json_agg(json_build_object(
                    'id', pd.id,
                    'departure_date', pd.departure_date
                ) ORDER BY pd.departure_date ASC)
                FROM package_departures pd
                WHERE pd.package_id = p.id
            ) AS departures,
            (
                SELECT json_agg(json_build_object(
                    'tier', pp.tier,
                    'price', pp.price,
                    'upgrade_double', pp.upgrade_double,
                    'upgrade_triple', pp.upgrade_triple
                ))
                FROM package_prices pp
                WHERE pp.package_id = p.id
            ) AS prices,
            (
                SELECT json_agg(json_build_object(
                    'hotel_name', h.name,
                    'city', h.city,
                    'country', h.country,
                    'star_rating', h.star_rating,
                    'nights', ph.nights,
                    'stay_city', ph.stay_city
                ))
                FROM package_hotels ph
                JOIN hotels h ON ph.hotel_id = h.id
                WHERE ph.package_id = p.id
            ) AS hotels,
            (
                SELECT json_build_object('name', al.name, 'code', al.code, 'logo_url', al.logo_url)
                FROM airlines al
                WHERE al.id = p.airline_id
            ) AS airline,
            (
                SELECT json_agg(json_build_object('asset_type', pa.asset_type, 'asset_url', pa.asset_url))
                FROM package_assets pa
                WHERE pa.package_id = p.id
            ) AS assets,
            (
                SELECT json_agg(feature)
                FROM package_features pf
                WHERE pf.package_id = p.id
            ) AS features
        FROM packages p
        ORDER BY p.created_at DESC
    `)
  return result.rows
}

/**
 * Get single package with full details
 */
const getPackageById = async (id) => {
  const [pkgResult, departuresResult, pricesResult, featuresResult, hotelsResult, assetsResult, itineraryResult] =
    await Promise.all([
      db.query(`
                SELECT p.*, al.name AS airline_name, al.code AS airline_code, al.logo_url
                FROM packages p
                LEFT JOIN airlines al ON al.id = p.airline_id
                WHERE p.id = $1
            `, [id]),
      db.query('SELECT * FROM package_departures WHERE package_id = $1 ORDER BY departure_date ASC', [id]),
      db.query('SELECT * FROM package_prices WHERE package_id = $1', [id]),
      db.query('SELECT * FROM package_features WHERE package_id = $1', [id]),
      db.query(`
                SELECT h.*, ph.nights, ph.stay_city
                FROM package_hotels ph
                JOIN hotels h ON ph.hotel_id = h.id
                WHERE ph.package_id = $1
            `, [id]),
      db.query('SELECT * FROM package_assets WHERE package_id = $1', [id]),
      db.query('SELECT * FROM itineraries WHERE package_id = $1', [id]),
    ])

  if (!pkgResult.rows[0]) return null

  const pkg = pkgResult.rows[0]
  return {
    package: pkg,
    airline: pkg.airline_name ? { name: pkg.airline_name, code: pkg.airline_code, logo_url: pkg.logo_url } : null,
    departures: departuresResult.rows,
    prices: pricesResult.rows,
    features: featuresResult.rows,
    hotels: hotelsResult.rows,
    assets: assetsResult.rows,
    itinerary: itineraryResult.rows,
  }
}

module.exports = { getPackages, getPackageById }
