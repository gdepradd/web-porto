const express = require('express')
const router = express.Router()
const Certificate = require('../models/Certificate')
const upload = require('../utils/cloudinary') // Import Cloudinary

// 1. GET ALL
router.get('/', async (req, res) => {
    try {
        const certs = await Certificate.find().sort({ issuedAt: -1 })
        res.json(certs)
    } catch (err) { res.status(500).json({ message: err.message }) }
})

// 2. POST (Upload Sertifikat)
router.post('/', upload.single('image'), async (req, res) => {
    try {
        // Ambil URL dari Cloudinary
        const imagePath = req.file ? req.file.path : ''

        const cert = new Certificate({
            title: req.body.title,
            issuer: req.body.issuer,
            issuedAt: req.body.issuedAt,
            expiresAt: req.body.expiresAt || null,
            link: req.body.link || '',
            image: imagePath
        })
        const newCert = await cert.save()
        res.status(201).json(newCert)
    } catch (err) { res.status(400).json({ message: err.message }) }
})

// 3. PUT (Update Sertifikat)
router.put('/:id', upload.single('image'), async (req, res) => {
    try {
        let updateData = {
            title: req.body.title,
            issuer: req.body.issuer,
            issuedAt: req.body.issuedAt,
            link: req.body.link || ''
        }

        // Logika tanggal expired
        if (req.body.expiresAt) {
            updateData.expiresAt = req.body.expiresAt
        } else {
            updateData.expiresAt = null
        }

        // Kalau ganti gambar
        if (req.file) {
            updateData.image = req.file.path
        }

        const updatedCert = await Certificate.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        )
        res.json(updatedCert)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

// 4. DELETE
router.delete('/:id', async (req, res) => {
    try {
        await Certificate.findByIdAndDelete(req.params.id)
        res.json({ message: "Sertifikat dihapus" })
    } catch (err) { res.status(500).json({ message: err.message }) }
})

module.exports = router