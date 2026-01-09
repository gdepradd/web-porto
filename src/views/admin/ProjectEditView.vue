<script setup>
import { ref, onMounted } from 'vue'
// Sesuaikan jumlah titik '../' dengan lokasi file Anda sekarang
import api from '../../utils/api'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// 1. Tambahkan 'category' di form
const form = ref({
  title: '',
  description: '',
  tech: '',
  image: '',
  category: '',
  github:''
})

const isSubmitting = ref(false)

// Ambil data lama
const fetchProject = async () => {
  try {
    const id = route.params.id
    // Cukup panggil path belakangnya saja
    const response = await api.get(`/api/projects/${id}`)
    
    // Masukkan data ke form
    form.value.title = response.data.title
    form.value.description = response.data.description
    form.value.image = response.data.image
    
    // Pastikan kategori terisi. Jika kosong di database, set string kosong.
    form.value.category = response.data.category || '' 
    form.value.github = response.data.github || ''
    // Tech array jadi string
    if (response.data.tech) {
        form.value.tech = response.data.tech.join(', ')
    }
    
  } catch (error) {
    alert("Gagal mengambil data project")
    router.push('/admin')
  }
}

// Simpan Perubahan
const handleUpdate = async () => {
  isSubmitting.value = true
  
  try {
    const techArray = form.value.tech.split(',').map(item => item.trim())
    const id = route.params.id

    // Konfigurasi Upload (Multipart Form Data)
    // Kita pakai FormData biar aman kalau nanti mau nambah fitur upload gambar baru di edit
    // Tapi karena backend kita di route PUT menerima JSON (kecuali Anda ubah jadi upload.single),
    // Mari kita cek backend Anda.
    
    // JIKA BACKEND ANDA PAKAI MULTER DI ROUTE PUT (Sesuai tutorial upload gambar sebelumnya):
    const formData = new FormData()
    formData.append('title', form.value.title)
    formData.append('description', form.value.description)
    formData.append('category', form.value.category) // <--- PENTING: Kirim Kategori
    formData.append('github', form.value.github)
    // Kirim tech sebagai array (looping) agar multer backend bisa baca
    techArray.forEach(t => formData.append('tech[]', t)) 
    
    // Image URL (jika tidak diganti, backend biasanya pakai logika lama)
    // Tapi backend PUT kita sebelumnya menangani Update Gambar jika ada file baru.
    // Jika tidak ada file baru, dia pakai data lama. Jadi aman.
    
    // PENTING: Karena route PUT kita di tutorial sebelumnya sudah pakai 'upload.single', 
    // maka kita harus kirim pake FormData, bukan JSON biasa.
    
    await api.put(`/api/projects/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    })
    
    alert("Project berhasil diupdate!")
    router.push('/admin')
    
  } catch (error) {
    alert("Gagal update: " + error.message)
    console.error(error)
  } finally {
    isSubmitting.value = false
  }
}

onMounted(() => {
  fetchProject()
})
</script>

<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center p-6">
    <div class="bg-white rounded-lg shadow-lg w-full max-w-2xl overflow-hidden">
      
      <div class="bg-yellow-500 p-6">
        <h1 class="text-2xl font-bold text-white">Edit Project</h1>
        <p class="text-yellow-100 text-sm">Update informasi karya Anda.</p>
      </div>

      <form @submit.prevent="handleUpdate" class="p-8 space-y-6">
        
        <div>
          <label class="block text-gray-700 font-bold mb-2">Judul Project</label>
          <input v-model="form.title" type="text" required
                 class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-500 outline-none">
        </div>

        <div>
          <label class="block text-gray-700 font-bold mb-2">Kategori</label>
          <select v-model="form.category" required class="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white focus:ring-2 focus:ring-yellow-500">
            <option value="" disabled>Pilih Kategori</option>
            <option value="Data Engineering">Data Engineering</option>
            <option value="LLM">LLM</option>
            <option value="Computer Vision">Computer Vision</option>
            <option value="NLP">NLP</option>
            <option value="IoT">IoT</option>
            <option value="Data Analysis">CI/CD</option>
          </select>
        </div>
        <div>
          <label class="block text-gray-700 font-bold mb-2">Link Repository GitHub</label>
          <input v-model="form.github" type="url" placeholder="https://github.com/gdepradd/repo"
                 class="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white focus:ring-2 focus:ring-yellow-500 outline-none">
        </div>
        <div>
          <label class="block text-gray-700 font-bold mb-2">Deskripsi Singkat</label>
          <textarea v-model="form.description" rows="3" required
                    class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-500 outline-none"></textarea>
        </div>

        <div>
          <label class="block text-gray-700 font-bold mb-2">Teknologi (Pisahkan dengan koma)</label>
          <input v-model="form.tech" type="text" required
                 class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-500 outline-none">
        </div>

        <div class="flex items-center justify-end gap-4 pt-4 border-t">
          <router-link to="/admin" class="text-gray-500 hover:text-gray-700 font-medium">Batal</router-link>
          
          <button type="submit" :disabled="isSubmitting"
                  class="bg-yellow-500 text-white px-6 py-2 rounded-lg hover:bg-yellow-600 transition font-bold disabled:bg-yellow-300">
            {{ isSubmitting ? 'Menyimpan...' : 'Update Project' }}
          </button>
        </div>

      </form>
    </div>
  </div>
</template>