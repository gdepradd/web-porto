<script setup>
// Kita pakai data dummy yang sama
import { projects } from '../../data/projects.js'
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <nav class="bg-white shadow p-4 mb-8">
      <div class="max-w-6xl mx-auto flex justify-between items-center">
        <h1 class="text-xl font-bold text-gray-800">Admin Dashboard</h1>
        <router-link to="/" class="text-red-500 hover:text-red-700">Logout</router-link>
      </div>
    </nav>

    <div class="max-w-6xl mx-auto px-4">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-gray-700">Daftar Project</h2>
        <button class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">
          + Tambah Project
        </button>
      </div>

      <div class="bg-white rounded-lg shadow overflow-hidden">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Judul</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teknologi</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="item in projects" :key="item.id">
              <td class="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{{ item.title }}</td>
              <td class="px-6 py-4">
                <span class="text-sm text-gray-500">{{ item.tech.join(', ') }}</span>
              </td>
              <td class="px-6 py-4 text-right space-x-2">
                <button class="text-blue-600 hover:text-blue-900">Edit</button>
                <button class="text-red-600 hover:text-red-900">Hapus</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>