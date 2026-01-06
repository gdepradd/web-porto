const mongoose = require('mongoose')

const ProfileSchema = new mongoose.Schema({
    name: String,          // Contoh: "Budi Santoso"
    role: String,          // Contoh: "Fullstack Developer"
    description: String,   // Bio singkat
    image: String,
    github: String,
    linkedin: String,
    instagram: String,
    email: String
})

module.exports = mongoose.model('Profile', ProfileSchema)