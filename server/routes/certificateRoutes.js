const express = require('express')
const router = express.Router()
const Certificate = require('../models/Certificate')
const multer = require('multer')
const path = require('path')

// Config Multer (Upload Gambar)
const storage = multer.diskStorage({
    destination: (req, file, cb) => { cb(null, 'uploads/') },
    filename: (req, file, cb) => { cb(null, 'cert-' + Date.now() + path.extname(file.originalname)) }
})
const upload = multer({ storage: storage })

// GET Semua Sertifikat
router.get('/', async (req, res) => {
    try {
        const certs = await Certificate.find().sort({ issuedAt: -1 }) // Urutkan dari terbaru
        res.json(certs)
    } catch (err) { res.status(500).json({ message: err.message }) }
})

// POST Sertifikat Baru
router.post('/', upload.single('image'), async (req, res) => {
    try {
        const imagePath = req.file ? `http://localhost:5000/uploads/${req.file.filename}` : ''

        const cert = new Certificate({
            title: req.body.title,
            issuer: req.body.issuer,
            issuedAt: req.body.issuedAt,
            expiresAt: req.body.expiresAt || null, // Bisa kosong
            image: imagePath,
            link: req.body.link || ''
        })
        const newCert = await cert.save()
        res.status(201).json(newCert)
    } catch (err) { res.status(400).json({ message: err.message }) }
})
router.put('/:id', upload.single('image'), async (req, res) => {
    try {
        // 1. Siapkan data yang mau diupdate (Text)
        let updateData = {
            title: req.body.title,
            issuer: req.body.issuer,
            issuedAt: req.body.issuedAt,
            link: req.body.link || '' // Update Link juga
        }

        // Cek tanggal expired (karena bisa null)
        if (req.body.expiresAt) {
            updateData.expiresAt = req.body.expiresAt
        } else {
            // Jika user mengosongkan tanggal, set ke null (lifetime)
            updateData.expiresAt = null
        }

        // 2. Cek Gambar: Kalau ada file baru, ganti path-nya
        if (req.file) {
            updateData.image = `http://localhost:5000/uploads/${req.file.filename}`
        }

        // 3. Eksekusi Update ke Database
        const updatedCert = await Certificate.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true } // Kembalikan data terbaru
        )

        res.json(updatedCert)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})
// DELETE Sertifikat
router.delete('/:id', async (req, res) => {
    try {
        await Certificate.findByIdAndDelete(req.params.id)
        res.json({ message: "Sertifikat dihapus" })
    } catch (err) { res.status(500).json({ message: err.message }) }
})

module.exports = router