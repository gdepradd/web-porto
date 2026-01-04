require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose') // <-- Baris ini yang tadi dicari komputer
const cors = require('cors')

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())

// KONEKSI MONGODB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ Berhasil connect ke MongoDB!"))
    .catch((err) => console.log("❌ Gagal connect:", err))

// Route Test dengan Cek Status DB (Kode yang tadi Anda coba)
app.get('/', (req, res) => {
    // Cek status koneksi (1 = Connected)
    const status = mongoose.connection.readyState === 1 ? '✅ Terhubung' : '❌ Belum Terhubung';
    res.send(`Server Backend Jalan! Status MongoDB: ${status}`);
})

app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`)
})