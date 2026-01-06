<template>
  <nav class="fixed w-full z-50 bg-gray-900/90 backdrop-blur-sm border-b border-gray-800">
    <div class="max-w-6xl mx-auto px-6">
      <div class="flex justify-between items-center h-16">
        <a href="#home" class="text-xl font-bold text-white tracking-wider">
          Portofolio<span class="text-green-500">.</span>
        </a>

        <div class="hidden md:flex space-x-8 text-sm font-medium text-gray-300">
          <a href="#home" class="hover:text-green-400 transition">Home</a>
          <a href="#about" class="hover:text-green-400 transition">About</a>
          <a href="#portfolio" class="hover:text-green-400 transition">Portfolio</a>
          <a href="#contact" class="hover:text-green-400 transition">Contact</a>
        </div>
        
        <router-link to="/login" class="px-4 py-2 text-xs font-bold text-gray-900 bg-white rounded hover:bg-gray-200 transition">
            Login
        </router-link>
      </div>
    </div>
  </nav>
</template>