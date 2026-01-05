<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const projects = ref([])

// 1. Fungsi Ambil Data (Sama seperti di Home)
const fetchProjects = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/projects')
    projects.value = response.data
  } catch (error) {
    console.error("Gagal ambil data:", error)
  }
}

// 2. Fungsi Hapus Data
const deleteProject = async (id) => {
  if (confirm("Yakin ingin menghapus project ini?")) {
    try {
      // Tembak API Delete ke Backend
      await axios.delete(`http://localhost:5000/api/projects/${id}`)
      
      // Refresh data di tabel tanpa reload halaman
      fetchProjects()
      alert("Project berhasil dihapus!")
    } catch (error) {
      alert("Gagal menghapus: " + error.message)
    }
  }
}

// Jalankan saat halaman dibuka
onMounted(() => {
  fetchProjects()
})
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <nav class="bg-white shadow p-4 mb-8">
      <div class="max-w-6xl mx-auto flex justify-between items-center">
        <h1 class="text-xl font-bold text-gray-800">Admin Dashboard</h1>
        <router-link to="/" class="text-sm text-gray-500 hover:text-blue-600">
          &larr; Lihat Website
        </router-link>
      </div>
    </nav>

    <div class="max-w-6xl mx-auto px-4">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-gray-700">Daftar Project (MongoDB)</h2>
        <router-link to="/admin/add" class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">
          + Tambah Project
        </router-link>
      </div>

      <div class="bg-white rounded-lg shadow overflow-hidden">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Judul</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Teknologi</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="item in projects" :key="item._id">
              <td class="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                {{ item.title }}
              </td>
              <td class="px-6 py-4">
                <div class="flex flex-wrap gap-1">
                  <span v-for="t in item.tech" :key="t" class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {{ t }}
                  </span>
                </div>
              </td>
              <td class="px-6 py-4 text-right space-x-2">
                <router-link 
                  :to="`/admin/edit/${item._id}`" 
                  class="text-blue-600 hover:text-blue-900 font-bold mr-2">
                  Edit
                </router-link>
                <button @click="deleteProject(item._id)" class="text-red-600 hover:text-red-900 font-bold">
                  Hapus
                </button>
              </td>
            </tr>
            
            <tr v-if="projects.length === 0">
              <td colspan="3" class="px-6 py-10 text-center text-gray-500">
                Belum ada data project.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>