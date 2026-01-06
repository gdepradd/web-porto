const mongoose = require('mongoose')

const ProjectSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    tech: [String],
    image: String,
    category: { type: String, required: true },
    github: { type: String, required: false } // <--- TAMBAHAN (Opsional)
})

module.exports = mongoose.model('Project', ProjectSchema)