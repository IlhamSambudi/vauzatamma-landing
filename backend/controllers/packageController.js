const packageService = require('../services/packageService')

exports.getPackages = async (req, res) => {
    try {
        const packages = await packageService.getPackages()
        res.json({ success: true, data: packages })
    } catch (err) {
        console.error('getPackages error:', err)
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
}

exports.getPackageById = async (req, res) => {
    try {
        const pkg = await packageService.getPackageById(req.params.id)
        if (!pkg) return res.status(404).json({ success: false, message: 'Package not found' })
        res.json({ success: true, data: pkg })
    } catch (err) {
        console.error('getPackageById error:', err)
        res.status(500).json({ success: false, message: 'Internal server error' })
    }
}
