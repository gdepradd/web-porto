<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

// --- STATE SKILL ---
const skills = ref([])
const newSkill = ref('')

// --- STATE CERTIFICATE ---
const certificates = ref([])
// Menambahkan 'id' untuk melacak sedang edit sertifikat mana
const certForm = ref({ id: null, title: '', issuer: '', issuedAt: '', expiresAt: '', link: '' })
const certFile = ref(null)
const isSubmitting = ref(false)
const isEditing = ref(false) // Penanda Mode Edit

// --- HELPER: Ubah Tanggal ISO ke Format Input (YYYY-MM-DD) ---
const formatDateForInput = (isoDate) => {
    if (!isoDate) return ''
    return new Date(isoDate).toISOString().split('T')[0]
}

// --- LOGIKA SKILL (Sama seperti sebelumnya) ---
const fetchSkills = async () => {
    try {
        const res = await axios.get('http://localhost:5000/api/skills')
        skills.value = res.data
    } catch (e) { console.error(e) }
}
const addSkill = async () => {
    if(!newSkill.value) return
    await axios.post('http://localhost:5000/api/skills', { name: newSkill.value })
    newSkill.value = ''
    fetchSkills()
}
const deleteSkill = async (id) => {
    if(confirm('Hapus skill ini?')) {
        await axios.delete(`http://localhost:5000/api/skills/${id}`)
        fetchSkills()
    }
}

// --- LOGIKA CERTIFICATE ---
const fetchCerts = async () => {
    try {
        const res = await axios.get('http://localhost:5000/api/certificates')
        certificates.value = res.data
    } catch (e) { console.error(e) }
}

const handleFileCert = (e) => { 
    certFile.value = e.target.files[0] 
}

// 1. Fungsi Klik Tombol EDIT
const editCert = (cert) => {
    isEditing.value = true
    // Isi form dengan data yang dipilih
    certForm.value = {
        id: cert._id,
        title: cert.title,
        issuer: cert.issuer,
        link: cert.link || '',
        issuedAt: formatDateForInput(cert.issuedAt),
        expiresAt: formatDateForInput(cert.expiresAt)
    }
    // Scroll ke atas agar user lihat formnya
    window.scrollTo({ top: 0, behavior: 'smooth' })
}

// 2. Fungsi BATAL Edit
const cancelEdit = () => {
    isEditing.value = false
    certForm.value = { id: null, title: '', issuer: '', issuedAt: '', expiresAt: '', link: '' }
    certFile.value = null
    // Reset input file secara manual (opsional, biar bersih)
    document.getElementById('fileInput').value = ''
}

// 3. Fungsi SIMPAN (Bisa Create atau Update)
const handleSubmitCert = async () => {
    isSubmitting.value = true
    const formData = new FormData()
    formData.append('title', certForm.value.title)
    formData.append('issuer', certForm.value.issuer)
    formData.append('issuedAt', certForm.value.issuedAt)
    // Kirim expiresAt hanya jika diisi (biar bisa null)
    if(certForm.value.expiresAt) formData.append('expiresAt', certForm.value.expiresAt)
    else formData.append('expiresAt', '') // Kirim string kosong biar backend tau mau di-null-kan
    
    if(certForm.value.link) formData.append('link', certForm.value.link)
    if(certFile.value) formData.append('image', certFile.value)

    try {
        if (isEditing.value) {
            // --- MODE UPDATE (PUT) ---
            await axios.put(`http://localhost:5000/api/certificates/${certForm.value.id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })
            alert('Sertifikat berhasil diupdate!')
        } else {
            // --- MODE CREATE (POST) ---
            await axios.post('http://localhost:5000/api/certificates', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })
            alert('Sertifikat berhasil ditambahkan!')
        }
        
        fetchCerts()
        cancelEdit() // Reset form setelah sukses
    } catch (e) { 
        alert('Gagal menyimpan: ' + e.message) 
    } finally { 
        isSubmitting.value = false 
    }
}

const deleteCert = async (id) => {
    if(confirm('Hapus sertifikat ini?')) {
        await axios.delete(`http://localhost:5000/api/certificates/${id}`)
        fetchCerts()
    }
}

onMounted(() => {
    fetchSkills()
    fetchCerts()
})
</script>

<template>
  <div class="min-h-screen bg-gray-100 p-6">
    <div class="max-w-4xl mx-auto space-y-8">
        
        <div class="flex justify-between items-center">
            <h1 class="text-2xl font-bold text-gray-800">Kelola Skill & Sertifikat</h1>
            <router-link to="/admin" class="text-blue-600 hover:underline">Kembali ke Dashboard</router-link>
        </div>

        <div class="bg-white p-6 rounded-lg shadow">
            <h2 class="text-xl font-bold mb-4 text-purple-700">Manajemen Skill</h2>
            <div class="flex gap-2 mb-4">
                <input v-model="newSkill" type="text" placeholder="Contoh: Vue.js" class="border p-2 rounded w-full">
                <button @click="addSkill" class="bg-purple-600 text-white px-4 rounded font-bold">Tambah</button>
            </div>
            <div class="flex flex-wrap gap-2">
                <span v-for="skill in skills" :key="skill._id" class="bg-purple-100 text-purple-800 px-3 py-1 rounded-full flex items-center gap-2">
                    {{ skill.name }}
                    <button @click="deleteSkill(skill._id)" class="text-red-500 font-bold hover:text-red-700">&times;</button>
                </span>
            </div>
        </div>

        <div class="bg-white p-6 rounded-lg shadow">
            <div class="flex justify-between items-center mb-4">
                <h2 class="text-xl font-bold" :class="isEditing ? 'text-yellow-600' : 'text-green-700'">
                    {{ isEditing ? 'Edit Sertifikat' : 'Tambah Sertifikat Baru' }}
                </h2>
                <button v-if="isEditing" @click="cancelEdit" class="text-sm text-gray-500 hover:text-red-500 underline">
                    Batal Edit
                </button>
            </div>
            
            <form @submit.prevent="handleSubmitCert" class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 border-b pb-8">
                <input v-model="certForm.title" type="text" placeholder="Nama Sertifikat" required class="border p-2 rounded">
                <input v-model="certForm.issuer" type="text" placeholder="Penerbit (Ex: Dicoding)" required class="border p-2 rounded">
                
                <div>
                    <label class="text-xs text-gray-500">Tanggal Terbit</label>
                    <input v-model="certForm.issuedAt" type="date" required class="border p-2 rounded w-full">
                </div>
                <div>
                    <label class="text-xs text-gray-500">Tanggal Expired (Opsional)</label>
                    <input v-model="certForm.expiresAt" type="date" class="border p-2 rounded w-full">
                </div>

                <div class="col-span-2">
                    <label class="text-xs text-gray-500">Link Kredensial (Opsional)</label>
                    <input v-model="certForm.link" type="url" placeholder="https://..." class="border p-2 rounded w-full">
                </div>

                <div class="col-span-2">
                    <label class="text-xs text-gray-500 mb-1 block">
                        {{ isEditing ? 'Upload Gambar Baru (Biarkan kosong jika tidak ingin mengubah gambar)' : 'Upload Gambar Sertifikat' }}
                    </label>
                    <input id="fileInput" @change="handleFileCert" type="file" :required="!isEditing" class="border p-2 rounded w-full bg-gray-50">
                </div>

                <div class="col-span-2">
                    <button type="submit" :disabled="isSubmitting" 
                            class="w-full py-2 rounded font-bold text-white transition"
                            :class="isEditing ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-600 hover:bg-green-700'">
                        {{ isSubmitting ? 'Menyimpan...' : (isEditing ? 'Update Perubahan' : 'Upload Sertifikat') }}
                    </button>
                </div>
            </form>

            <div class="space-y-4">
                <div v-for="cert in certificates" :key="cert._id" class="flex items-center gap-4 border p-4 rounded bg-gray-50 hover:bg-gray-100 transition">
                    <img :src="cert.image" class="w-16 h-16 object-cover rounded">
                    
                    <div class="flex-1">
                        <h4 class="font-bold">{{ cert.title }}</h4>
                        <p class="text-sm text-gray-600">{{ cert.issuer }}</p>
                        <p class="text-xs text-gray-400 mt-1" v-if="cert.link">Link: {{ cert.link }}</p>
                    </div>

                    <div class="flex flex-col gap-2">
                        <button @click="editCert(cert)" class="text-blue-600 font-bold text-sm hover:underline border border-blue-200 px-2 py-1 rounded bg-white">
                            Edit
                        </button>
                        <button @click="deleteCert(cert._id)" class="text-red-600 font-bold text-sm hover:underline border border-red-200 px-2 py-1 rounded bg-white">
                            Hapus
                        </button>
                    </div>
                </div>
            </div>
        </div>

    </div>
  </div>
</template>