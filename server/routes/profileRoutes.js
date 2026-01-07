const express = require('express')
const router = express.Router()
const Profile = require('../models/Profile')

// 1. IMPORT UPLOAD CLOUDINARY (Bukan Multer Biasa)
const upload = require('../utils/cloudinary')

// GET: Ambil Data Profil
router.get('/', async (req, res) => {
    try {
        let profile = await Profile.findOne()
        if (!profile) {
            profile = {
                name: "Nama Anda",
                role: "Web Developer",
                description: "Deskripsi singkat tentang diri Anda.",
                image: "https://placehold.co/400"
            }
        }
        res.json(profile)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

// POST: Simpan atau Update Profil
router.post('/', upload.single('image'), async (req, res) => {
    try {
        // Data text dari form
        let updateData = {
            name: req.body.name,
            role: req.body.role,
            description: req.body.description,
            github: req.body.github,
            linkedin: req.body.linkedin,
            instagram: req.body.instagram,
            email: req.body.email
        }

        // 2. LOGIKA GAMBAR CLOUDINARY
        // Kalau user upload gambar, Cloudinary otomatis kasih URL di req.file.path
        if (req.file) {
            updateData.image = req.file.path
        }

        // Cari 1 data, lalu update. Kalau tidak ada, buat baru (upsert: true).
        const profile = await Profile.findOneAndUpdate(
            {},
            updateData,
            { new: true, upsert: true }
        )

        res.json(profile)
    } catch (err) {
        console.error(err) // Biar error kelihatan di terminal
        res.status(400).json({ message: err.message })
    }
})

module.exports = router