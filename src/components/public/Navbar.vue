<template>
  <nav class="bg-white shadow-md fixed w-full top-0 z-50">
    <div class="max-w-6xl mx-auto px-4">
      <div class="flex justify-between items-center py-4">
        <div class="text-xl font-bold text-gray-800">
          Portofolio<span class="text-blue-600">Saya</span>
        </div>
        
        <div class="space-x-6 text-gray-600">
          <a href="#" class="hover:text-blue-600 transition">Home</a>
          <a href="#projects" class="hover:text-blue-600 transition">Projects</a>
          <router-link to="/login" class="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition">
            Login
          </router-link>
        </div>
      </div>
    </div>
  </nav>
</template>