const mongoose = require('mongoose')

const ProjectSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    tech: [String],
    image: String,
    category: { type: String, required: true } // <--- TAMBAHAN BARU
})

module.exports = mongoose.model('Project', ProjectSchema)