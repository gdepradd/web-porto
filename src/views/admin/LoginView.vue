<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const username = ref('')
const password = ref('')

// Fungsi Login Dummy
const handleLogin = () => {
  // Ceritanya validasi sederhana
  if (username.value === 'admin' && password.value === 'putugede') {
    alert('Login Berhasil!')
    router.push('/admin') // Arahkan ke Dashboard
  } else {
    alert('Username/Password salah! (Coba: admin/admin)')
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded-lg shadow-md w-96">
      <h1 class="text-2xl font-bold mb-6 text-center text-gray-800">Admin Login</h1>
      
      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label class="block text-gray-600 text-sm mb-1">Username</label>
          <input v-model="username" type="text" class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500">
        </div>
        
        <div>
          <label class="block text-gray-600 text-sm mb-1">Password</label>
          <input v-model="password" type="password" class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500">
        </div>

        <button type="submit" class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
          Masuk
        </button>
      </form>
      
      <div class="mt-4 text-center">
        <router-link to="/" class="text-sm text-gray-500 hover:text-blue-600">Kembali ke Home</router-link>
      </div>
    </div>
  </div>
</template>