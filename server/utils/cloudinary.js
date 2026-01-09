const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const path = require('path');

// 1. Konfigurasi Cloudinary (Pastikan Env Var di Vercel sudah benar namanya)
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 2. Setup Storage Langsung ke Cloudinary (Bukan ke Disk Laptop)
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'portfolio_uploads', // Nama folder nanti di dashboard Cloudinary
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
        // public_id: (req, file) => 'computed-filename-using-request',
    },
});

// 3. Init Multer dengan Storage Cloudinary
const upload = multer({ storage: storage });

module.exports = upload;