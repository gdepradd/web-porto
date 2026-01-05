const express = require('express')
const router = express.Router()
const Project = require('../models/Project') // Import model database
router.get('/isi-data', async (req, res) => {
    const dummyData = new Project({
        title: "Web Portofolio V1",
        description: "Project pertama saya menggunakan MEVN Stack (MongoDB, Express, Vue, Node).",
        tech: ["Vue.js", "Express", "MongoDB"],
        image: "https://placehold.co/600x400/orange/white?text=Real+Data"
    })

    try {
        await dummyData.save()
        res.send("✅ Berhasil! Data contoh sudah masuk ke MongoDB.")
    } catch (err) {
        res.send("Gagal: " + err.message)
    }
})
// 1. GET: Ambil semua data project
router.get('/', async (req, res) => {
    console.log("➡️ Ada permintaan masuk ke GET /api/projects") // CCTV 1
    try {
        const projects = await Project.find() // Cari semua di MongoDB
        console.log("✅ Data ditemukan di DB:", projects)
        res.json(projects) // Kirim hasilnya ke frontend
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

// 2. POST: Tambah project baru
router.post('/', async (req, res) => {
    const project = new Project({
        title: req.body.title,
        description: req.body.description,
        tech: req.body.tech, // Pastikan frontend kirim array string
        image: req.body.image
    })

    try {
        const newProject = await project.save() // Simpan ke MongoDB
        res.status(201).json(newProject)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

// 3. DELETE: Hapus project berdasarkan ID
router.delete('/:id', async (req, res) => {
    try {
        await Project.findByIdAndDelete(req.params.id)
        res.json({ message: "Project berhasil dihapus" })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})
router.get('/:id', async (req, res) => {
    try {
        const project = await Project.findById(req.params.id)
        if (!project) return res.status(404).json({ message: "Project tidak ditemukan" })
        res.json(project)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})
router.put('/:id', async (req, res) => {
    try {
        const updatedProject = await Project.findByIdAndUpdate(
            req.params.id,
            req.body, // Data baru dari form
            { new: true } // Agar yang dikembalikan adalah data yang sudah diupdate
        )
        res.json(updatedProject)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})
module.exports = router