const express = require('express')
const router = express.Router()
const Profile = require('../models/Profile')
const multer = require('multer')
const path = require('path')

// Konfigurasi Upload (Sama persis dengan Project)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/')
    },
    filename: (req, file, cb) => {
        cb(null, 'profile-' + Date.now() + path.extname(file.originalname))
    }
})
const upload = multer({ storage: storage })

// 1. GET: Ambil Data Profil
router.get('/', async (req, res) => {
    try {
        // Cari data pertama yang ditemukan
        let profile = await Profile.findOne()

        // Kalau belum ada (masih baru), kirim data dummy biar tidak error
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

// 2. POST/PUT: Simpan atau Update Profil
// Kita pakai POST saja biar gampang, fungsinya "Upsert" (Update kalau ada, Insert kalau belum)
router.post('/', upload.single('image'), async (req, res) => {
    try {
        // Data yang mau disimpan
        let updateData = {
            name: req.body.name,
            role: req.body.role,
            description: req.body.description
        }

        // Kalau ada gambar baru, update path gambarnya
        if (req.file) {
            updateData.image = `http://localhost:5000/uploads/${req.file.filename}`
        }

        // Cari 1 data, lalu update. Kalau tidak ada, buat baru (upsert: true).
        const profile = await Profile.findOneAndUpdate(
            {}, // Kriteria: Kosong (artinya ambil dokumen pertama apa saja)
            updateData,
            { new: true, upsert: true }
        )

        res.json(profile)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

module.exports = router