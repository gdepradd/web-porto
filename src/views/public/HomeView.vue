<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import Navbar from '../../components/public/Navbar.vue'

// 1. Siapkan variabel kosong untuk menampung data
const projects = ref([])

// 2. Buat fungsi untuk ambil data dari Backend
const fetchProjects = async () => {
  try {
    // Tembak API Backend kita
    const response = await axios.get('http://localhost:5000/api/projects')
    
    // Masukkan hasil data ke variabel kita
    projects.value = response.data
    console.log("Data berhasil diambil:", projects.value)
    
  } catch (error) {
    console.error("Gagal mengambil data:", error)
  }
}

// 3. Jalankan fungsi ini OTOMATIS saat halaman dibuka
onMounted(() => {
  fetchProjects()
})
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <Navbar />

    <header class="pt-32 pb-20 px-6 text-center bg-white">
      <h1 class="text-5xl font-bold text-gray-900 mb-6">
        Halo, Saya <span class="text-blue-600">Developer</span>
      </h1>
      <p class="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
        Saya membangun solusi digital menggunakan teknologi web modern.
      </p>
      <a href="#projects" class="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-lg">
        Lihat Karya Saya
      </a>
    </header>

    <section id="projects" class="py-20 px-6 max-w-6xl mx-auto">
      <h2 class="text-3xl font-bold text-gray-800 mb-10 text-center">Project Terbaru</h2>
      
      <div v-if="projects.length === 0" class="text-center text-gray-500">
        Sedang memuat data dari server...
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        
        <div v-for="item in projects" :key="item._id" class="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition duration-300">
          
          <img :src="item.image" :alt="item.title" class="w-full h-48 object-cover">
          
          <div class="p-6">
            <h3 class="text-xl font-bold text-gray-900 mb-2">{{ item.title }}</h3>
            <p class="text-gray-600 text-sm mb-4">{{ item.description }}</p>
            
            <div class="flex flex-wrap gap-2">
              <span v-for="tech in item.tech" :key="tech" class="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                {{ tech }}
              </span>
            </div>
          </div>

        </div>

      </div>
    </section>
  </div>
</template>