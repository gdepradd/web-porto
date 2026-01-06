const express = require('express')
const router = express.Router()
const Project = require('../models/Project')
const multer = require('multer')
const path = require('path')

// --- KONFIGURASI MULTER (PENYIMPANAN) ---
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/') // Simpan di folder uploads
    },
    filename: (req, file, cb) => {
        // Namai file: timestamp-namaasli.jpg (agar tidak bentrok)
        cb(null, Date.now() + '-' + file.originalname)
    }
})
const upload = multer({ storage: storage })

// 1. GET: Ambil semua data (Kode Lama - Tidak Berubah)
router.get('/', async (req, res) => {
    try {
        const projects = await Project.find()
        res.json(projects)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

// 2. GET SINGLE (Kode Lama - Tidak Berubah)
router.get('/:id', async (req, res) => {
    try {
        const project = await Project.findById(req.params.id)
        if (!project) return res.status(404).json({ message: "Project tidak ditemukan" })
        res.json(project)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

// 3. POST: Tambah Project dengan Upload Gambar
// Perhatikan: upload.single('image') artinya menerima 1 file dari field bernama 'image'
router.post('/', upload.single('image'), async (req, res) => {

    // Cek apakah ada file yang diupload?
    // Jika ada, buat URL-nya. Jika tidak, pakai gambar placeholder.
    const imagePath = req.file
        ? `http://localhost:5000/uploads/${req.file.filename}`
        : 'https://placehold.co/600x400';

    const project = new Project({
        title: req.body.title,
        description: req.body.description,
        tech: req.body.tech, // Frontend harus kirim array tech
        image: imagePath, // Simpan URL gambar lokal
        category: req.body.category,
        github: req.body.github || ''
    })

    try {
        const newProject = await project.save()
        res.status(201).json(newProject)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

// 4. PUT: Update Project (Bisa ganti gambar, bisa tidak)
router.put('/:id', upload.single('image'), async (req, res) => {
    try {
        // Siapkan data update
        let updateData = {
            title: req.body.title,
            description: req.body.description,
            tech: req.body.tech,
            category: req.body.category,
            github: req.body.github || ''
        }

        // Kalau user upload gambar baru, update field image-nya
        if (req.file) {
            updateData.image = `http://localhost:5000/uploads/${req.file.filename}`
        }

        const updatedProject = await Project.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        )
        res.json(updatedProject)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

// 5. DELETE (Kode Lama - Tidak Berubah)
router.delete('/:id', async (req, res) => {
    try {
        await Project.findByIdAndDelete(req.params.id)
        res.json({ message: "Project berhasil dihapus" })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

module.exports = router