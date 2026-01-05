require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

// 1. IMPORT ROUTES (Pastikan path/lokasi file benar)
const projectRoutes = require('./routes/projectRoutes') // <--- CEK INI

const app = express()
const PORT = process.env.PORT || 5000
const path = require('path')

app.use(cors())
app.use(express.json())
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))
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

app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`)
})