<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter()

// Form Data (Image tidak masuk sini, dipisah)
const form = ref({
  title: '',
  description: '',
  tech: ''
})

// Variabel khusus untuk menampung file
const selectedFile = ref(null)
const isSubmitting = ref(false)

// Fungsi saat user memilih file
const handleFileChange = (event) => {
  selectedFile.value = event.target.files[0]
}

const handleSubmit = async () => {
  isSubmitting.value = true
  
  try {
    // KITA HARUS PAKAI FORM DATA UNTUK UPLOAD FILE
    const formData = new FormData()
    formData.append('title', form.value.title)
    formData.append('description', form.value.description)
    
    // Tech backend mintanya Array, tapi FormData kirimnya string
    // Kita kirim satu per satu agar backend (Multer) menerimanya sebagai array/list,
    // ATAU kirim string lalu biarkan backend tidak memprosesnya (tapi tadi backend kita terima raw body).
    // SOLUSI SIMPLE: Pisahkan koma manual lalu append satu per satu
    const techArray = form.value.tech.split(',').map(item => item.trim())
    techArray.forEach(tech => formData.append('tech[]', tech)) 
    // *Catatan: Express kadang baca 'tech[]' atau 'tech'. Kita coba kirim tech biasa.
    // Revisi: Kita kirim raw string aja biar aman, nanti backend terima string/array.
    // Tapi karena backend mengharapkan array di Schema, paling aman kirim looping:
    techArray.forEach(t => formData.append('tech', t))

    // Append File Gambar
    if (selectedFile.value) {
      formData.append('image', selectedFile.value)
    }

    // Kirim dengan Header khusus
    await axios.post('http://localhost:5000/api/projects', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    
    alert("Project dengan gambar berhasil diupload!")
    router.push('/admin')
    
  } catch (error) {
    console.error(error)
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
        <h1 class="text-2xl font-bold text-white">Tambah Project (Upload)</h1>
      </div>

      <form @submit.prevent="handleSubmit" class="p-8 space-y-6">
        
        <div>
          <label class="block text-gray-700 font-bold mb-2">Judul</label>
          <input v-model="form.title" type="text" required class="w-full border p-2 rounded">
        </div>

        <div>
          <label class="block text-gray-700 font-bold mb-2">Deskripsi</label>
          <textarea v-model="form.description" rows="3" required class="w-full border p-2 rounded"></textarea>
        </div>

        <div>
          <label class="block text-gray-700 font-bold mb-2">Teknologi (Pisahkan koma)</label>
          <input v-model="form.tech" type="text" required placeholder="Vue, Node" class="w-full border p-2 rounded">
        </div>

        <div>
          <label class="block text-gray-700 font-bold mb-2">Upload Gambar</label>
          <input @change="handleFileChange" type="file" accept="image/*" required 
                 class="w-full border p-2 rounded bg-gray-50">
          <p class="text-xs text-gray-500 mt-1">Format: JPG, PNG, JPEG</p>
        </div>

        <div class="flex justify-end pt-4 border-t">
          <button type="submit" :disabled="isSubmitting"
                  class="bg-blue-600 text-white px-6 py-2 rounded font-bold hover:bg-blue-700 disabled:bg-gray-400">
            {{ isSubmitting ? 'Uploading...' : 'Simpan Project' }}
          </button>
        </div>

      </form>
    </div>
  </div>
</template>