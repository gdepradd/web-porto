const express = require('express')
const router = express.Router()
const Project = require('../models/Project')
const upload = require('../utils/cloudinary') // Import Cloudinary

// 1. GET ALL
router.get('/', async (req, res) => {
    try {
        const projects = await Project.find()
        res.json(projects)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

// 2. GET SINGLE
router.get('/:id', async (req, res) => {
    try {
        const project = await Project.findById(req.params.id)
        if (!project) return res.status(404).json({ message: "Project tidak ditemukan" })
        res.json(project)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

// 3. POST (Tambah Project Baru)
router.post('/', upload.single('image'), async (req, res) => {
    try {
        // Logika URL Gambar Cloudinary: req.file.path
        const imagePath = req.file ? req.file.path : 'https://placehold.co/600x400';

        const project = new Project({
            title: req.body.title,
            description: req.body.description,
            tech: req.body.tech, // Dikirim sebagai array/list dari frontend
            image: imagePath,
            category: req.body.category,
            github: req.body.github || ''
        })

        const newProject = await project.save()
        res.status(201).json(newProject)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

// 4. PUT (Update Project)
router.put('/:id', upload.single('image'), async (req, res) => {
    try {
        let updateData = {
            title: req.body.title,
            description: req.body.description,
            tech: req.body.tech,
            category: req.body.category,
            github: req.body.github
        }

        // Kalau ada gambar baru, update URL-nya pakai Cloudinary
        if (req.file) {
            updateData.image = req.file.path
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

// 5. DELETE
router.delete('/:id', async (req, res) => {
    try {
        await Project.findByIdAndDelete(req.params.id)
        res.json({ message: "Project berhasil dihapus" })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

module.exports = router