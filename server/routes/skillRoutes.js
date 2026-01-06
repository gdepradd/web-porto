const express = require('express')
const router = express.Router()
const Skill = require('../models/Skill')

// GET Semua Skill
router.get('/', async (req, res) => {
    try {
        const skills = await Skill.find()
        res.json(skills)
    } catch (err) { res.status(500).json({ message: err.message }) }
})

// POST Skill Baru
router.post('/', async (req, res) => {
    const skill = new Skill({ name: req.body.name })
    try {
        const newSkill = await skill.save()
        res.status(201).json(newSkill)
    } catch (err) { res.status(400).json({ message: err.message }) }
})

// DELETE Skill
router.delete('/:id', async (req, res) => {
    try {
        await Skill.findByIdAndDelete(req.params.id)
        res.json({ message: "Skill dihapus" })
    } catch (err) { res.status(500).json({ message: err.message }) }
})

module.exports = router