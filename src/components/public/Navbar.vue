<template>
  <nav class="fixed w-full z-50 bg-gray-900/90 backdrop-blur-sm border-b border-gray-800">
    <div class="max-w-6xl mx-auto px-6">
      <div class="flex justify-between items-center h-16">
        <a href="#home" class="flex items-center gap-4 group">
          <img 
            src="/G-Logo-removebg-preview.png" 
            alt="Logo" 
            class="w-14 h-14 object-contain transition duration-300 group-hover:scale-105"
          >
          
          <span class="text-xl md:text-2xl font-bold text-white tracking-wider">
            Gede Pradnyananda
          </span>
        </a>

        <div class="hidden md:flex space-x-8 text-sm font-medium text-gray-300">
          <a href="#home" class="hover:text-green-400 transition">Home</a>
          <a href="#about" class="hover:text-green-400 transition">About</a>
          <a href="#portfolio" class="hover:text-green-400 transition">Portfolio</a>
          <a href="#contact" class="hover:text-green-400 transition">Contact</a>
        </div>
        
       
      </div>
    </div>
  </nav>
</template>