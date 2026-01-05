<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter()

// Data Form Kosong
const form = ref({
  title: '',
  description: '',
  tech: '', // Nanti kita pisahkan jadi array
  image: ''
})

const isSubmitting = ref(false)

const handleSubmit = async () => {
  isSubmitting.value = true
  
  try {
    // 1. Ubah string teknologi "Vue, Node" menjadi array ["Vue", "Node"]
    const techArray = form.value.tech.split(',').map(item => item.trim())
    
    // 2. Kirim ke Backend
    await axios.post('http://localhost:5000/api/projects', {
      title: form.value.title,
      description: form.value.description,
      tech: techArray,
      image: form.value.image
    })
    
    // 3. Jika sukses, kembali ke dashboard
    alert("Project berhasil ditambahkan!")
    router.push('/admin')
    
  } catch (error) {
    alert("Gagal menyimpan: " + error.message)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center p-6">
    <div class="bg-white rounded-lg shadow-lg w-full max-w-2xl overflow-hidden">
      
      <div class="bg-blue-600 p-6">
        <h1 class="text-2xl font-bold text-white">Tambah Project Baru</h1>
        <p class="text-blue-100 text-sm">Isi detail karya terbaik Anda di sini.</p>
      </div>

      <form @submit.prevent="handleSubmit" class="p-8 space-y-6">
        
        <div>
          <label class="block text-gray-700 font-bold mb-2">Judul Project</label>
          <input v-model="form.title" type="text" required placeholder="Contoh: Aplikasi Kasir"
                 class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none transition">
        </div>

        <div>
          <label class="block text-gray-700 font-bold mb-2">Deskripsi Singkat</label>
          <textarea v-model="form.description" rows="3" required placeholder="Jelaskan fitur utama aplikasi ini..."
                    class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none transition"></textarea>
        </div>

        <div>
          <label class="block text-gray-700 font-bold mb-2">Teknologi (Pisahkan dengan koma)</label>
          <input v-model="form.tech" type="text" required placeholder="Vue, Laravel, MySQL"
                 class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none transition">
          <p class="text-xs text-gray-500 mt-1">*Contoh: Vue.js, Node.js, MongoDB</p>
        </div>

        <div>
          <label class="block text-gray-700 font-bold mb-2">URL Gambar (Link)</label>
          <input v-model="form.image" type="url" required placeholder="https://..."
                 class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none transition">
          <p class="text-xs text-gray-500 mt-1">
            *Tips: Gunakan <code>https://placehold.co/600x400</code> untuk gambar sementara.
          </p>
        </div>

        <div class="flex items-center justify-end gap-4 pt-4 border-t">
          <router-link to="/admin" class="text-gray-500 hover:text-gray-700 font-medium">Batal</router-link>
          
          <button type="submit" :disabled="isSubmitting"
                  class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-bold disabled:bg-blue-300">
            {{ isSubmitting ? 'Menyimpan...' : 'Simpan Project' }}
          </button>
        </div>

      </form>
    </div>
  </div>
</template>