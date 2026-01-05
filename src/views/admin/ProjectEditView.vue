<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute() // Untuk mengambil ID dari URL browser

const form = ref({
  title: '',
  description: '',
  tech: '',
  image: ''
})

const isSubmitting = ref(false)

// 1. Ambil data lama saat halaman dibuka
const fetchProject = async () => {
  try {
    const id = route.params.id // Ambil ID dari URL
    const response = await axios.get(`http://localhost:5000/api/projects/${id}`)
    
    // Masukkan ke form
    form.value.title = response.data.title
    form.value.description = response.data.description
    form.value.image = response.data.image
    
    // Khusus array tech, kita gabung jadi string lagi pakai koma
    form.value.tech = response.data.tech.join(', ')
    
  } catch (error) {
    alert("Gagal mengambil data project")
    router.push('/admin')
  }
}

// 2. Simpan Perubahan (Update)
const handleUpdate = async () => {
  isSubmitting.value = true
  
  try {
    const techArray = form.value.tech.split(',').map(item => item.trim())
    const id = route.params.id

    // Pakai axios.put untuk update
    await axios.put(`http://localhost:5000/api/projects/${id}`, {
      title: form.value.title,
      description: form.value.description,
      tech: techArray,
      image: form.value.image
    })
    
    alert("Project berhasil diupdate!")
    router.push('/admin')
    
  } catch (error) {
    alert("Gagal update: " + error.message)
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
                 class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-500 outline-none transition">
        </div>

        <div>
          <label class="block text-gray-700 font-bold mb-2">Deskripsi Singkat</label>
          <textarea v-model="form.description" rows="3" required
                    class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-500 outline-none transition"></textarea>
        </div>

        <div>
          <label class="block text-gray-700 font-bold mb-2">Teknologi (Pisahkan dengan koma)</label>
          <input v-model="form.tech" type="text" required
                 class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-500 outline-none transition">
        </div>

        <div>
          <label class="block text-gray-700 font-bold mb-2">URL Gambar</label>
          <input v-model="form.image" type="url" required
                 class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-500 outline-none transition">
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