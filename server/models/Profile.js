const mongoose = require('mongoose')

const ProfileSchema = new mongoose.Schema({
    name: String,          // Contoh: "Budi Santoso"
    role: String,          // Contoh: "Fullstack Developer"
    description: String,   // Bio singkat
    image: String          // URL Foto Profil
})

module.exports = mongoose.model('Profile', ProfileSchema)