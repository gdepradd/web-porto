<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const form = ref({
  name: '',
  role: '',
  description: ''
})
const currentImage = ref('') // Untuk menampilkan foto yang sekarang
const selectedFile = ref(null)
const isSubmitting = ref(false)

// Ambil data profil saat ini
const fetchProfile = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/profile')
    // Isi form dengan data dari server
    if (response.data) {
        form.value.name = response.data.name
        form.value.role = response.data.role
        form.value.description = response.data.description
        currentImage.value = response.data.image
    }
  } catch (error) {
    console.error("Gagal ambil profil:", error)
  }
}

// Handle file change
const handleFileChange = (event) => {
  selectedFile.value = event.target.files[0]
}

// Simpan Data
const handleSave = async () => {
  isSubmitting.value = true
  const formData = new FormData()
  
  formData.append('name', form.value.name)
  formData.append('role', form.value.role)
  formData.append('description', form.value.description)
  if (selectedFile.value) {
    formData.append('image', selectedFile.value)
  }

  try {
    const res = await axios.post('http://localhost:5000/api/profile', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    // Update tampilan gambar dengan data baru
    currentImage.value = res.data.image
    alert("Profil berhasil disimpan!")
  } catch (error) {
    alert("Gagal update profil: " + error.message)
  } finally {
    isSubmitting.value = false
  }
}

onMounted(() => fetchProfile())
</script>

<template>
  <div class="min-h-screen bg-gray-100 p-6">
    <div class="max-w-2xl mx-auto bg-white rounded-lg shadow overflow-hidden">
      <div class="bg-purple-700 p-6 text-white flex justify-between items-center">
        <h1 class="text-2xl font-bold">Edit Profil Diri</h1>
        <router-link to="/admin" class="text-sm hover:underline">&larr; Kembali ke Dashboard</router-link>
      </div>

      <div class="p-8 space-y-6">
        
        <div class="flex flex-col items-center mb-6">
            <img :src="currentImage" alt="Profil" class="w-32 h-32 rounded-full object-cover border-4 border-purple-100 mb-2">
            <span class="text-sm text-gray-500">Foto Saat Ini</span>
        </div>

        <form @submit.prevent="handleSave" class="space-y-4">
            <div>
                <label class="block font-bold text-gray-700">Nama Lengkap</label>
                <input v-model="form.name" type="text" class="w-full border p-2 rounded">
            </div>
            <div>
                <label class="block font-bold text-gray-700">Role / Julukan</label>
                <input v-model="form.role" type="text" placeholder="Contoh: Frontend Developer" class="w-full border p-2 rounded">
            </div>
            <div>
                <label class="block font-bold text-gray-700">Deskripsi Singkat</label>
                <textarea v-model="form.description" rows="3" class="w-full border p-2 rounded"></textarea>
            </div>
            <div>
                <label class="block font-bold text-gray-700">Ganti Foto Profil</label>
                <input @change="handleFileChange" type="file" class="w-full border p-2 rounded bg-gray-50">
            </div>

            <button type="submit" :disabled="isSubmitting" 
                class="w-full bg-purple-600 text-white py-2 rounded font-bold hover:bg-purple-700 transition">
                {{ isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan' }}
            </button>
        </form>
      </div>
    </div>
  </div>
</template>