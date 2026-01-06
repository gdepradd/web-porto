const mongoose = require('mongoose')

const CertificateSchema = new mongoose.Schema({
    title: { type: String, required: true },
    issuer: { type: String, required: true }, // Penerbit (misal: Google, Dicoding)
    issuedAt: { type: Date, required: true },
    expiresAt: { type: Date }, // Opsional (bisa null kalau lifetime)
    image: { type: String, required: true },
    link: { type: String }
})

module.exports = mongoose.model('Certificate', CertificateSchema)