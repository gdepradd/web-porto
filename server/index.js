require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

// 1. IMPORT ROUTES (Pastikan path/lokasi file benar)
const projectRoutes = require('./routes/projectRoutes')
const profileRoutes = require('./routes/profileRoutes')
const skillRoutes = require('./routes/skillRoutes')
const certificateRoutes = require('./routes/certificateRoutes')
const app = express()
const PORT = process.env.PORT || 5000
const path = require('path')

app.use(cors())
app.use(express.json())
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))
app.use('/api/profile', profileRoutes)
app.use('/api/skills', skillRoutes)
app.use('/api/certificates', certificateRoutes)
process.on('unhandledRejection', (reason, promise) => {
    console.error('🔴 UNHANDLED REJECTION DETECTED:', JSON.stringify(reason, null, 2));
});
// 2. KONEKSI DB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ Berhasil connect ke MongoDB!"))
    .catch((err) => console.log("❌ Gagal connect:", err))

// 3. DAFTARKAN RUTE (PENTING!)
// Taruh ini SEBELUM app.listen dan SETELAH middleware
app.use('/api/projects', projectRoutes) // <--- CEK INI

// Route Test Biasa (Halaman Depan)
app.get('/', (req, res) => {
    res.send('Server Utama Jalan!')
})
app.use((err, req, res, next) => {
    console.error("❌ ERROR FULL DETAIL:", JSON.stringify(err, null, 2));
    res.status(500).json({
        message: "Upload Gagal",
        error_detail: err
    });
});
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server berjalan di http://localhost:${PORT}`)
    })
}
module.exports = app