<script setup>
import { ref, onMounted,computed } from 'vue'
import api from '../../utils/api'
import Navbar from '../../components/public/Navbar.vue'
const formatDate = (dateString) => {
    if(!dateString) return 'Seumur Hidup'
    const options = { year: 'numeric', month: 'short' }
    return new Date(dateString).toLocaleDateString('id-ID', options)
}
// Data dari Backend
const projects = ref([])
const selectedCategory = ref('Semua')
const profile = ref({
    name: 'Loading...',
    role: '',
    description: '',
    image: ''
})

// Data Skill (Hardcode dulu sesuai referensi gambar)
const skills = ref([])
const certificates = ref([])
const fetchSkills = async () => {
    try {
        const res = await api.get('/api/skills')
        skills.value = res.data
    } catch (e) { console.error(e) }
}

const fetchCerts = async () => {
    try {
        const res = await api.get('/api/certificates')
        certificates.value = res.data
    } catch (e) { console.error(e) }
}
const fetchProjects = async () => {
  try {
    const response = await api.get('/api/projects')
    
    // 🛡️ PENGECEKAN KEAMANAN:
    // Cuma terima kalau bentuknya Array (List)
    if (Array.isArray(response.data)) {
        projects.value = response.data
    } else {
        console.error("Bukan Array! Isinya:", response.data)
        projects.value = [] // Paksa jadi array kosong biar gak error
    }
  } catch (error) { 
    console.error(error)
    projects.value = [] // Kalau error, kosongin aja
  }
}

const fetchProfile = async () => {
  try {
    const res = await api.get('/api/profile')
    if (res.data) profile.value = res.data
  } catch (error) { console.error(error) }
}
const categories = computed(() => {
  // Ambil semua kategori dari project yang ada
  const allCats = projects.value.map(p => p.category).filter(cat => cat)
  // Hilangkan duplikat pakai Set, lalu tambahkan 'Semua' di depan
  return ['Semua', ...new Set(allCats)]
})

// 2. LOGIKA FILTER PROJECT
const filteredProjects = computed(() => {
  if (selectedCategory.value === 'Semua') {
    return projects.value
  }
  return projects.value.filter(project => project.category === selectedCategory.value)
})
onMounted(() => {
  fetchProjects()
  fetchProfile()
  fetchSkills()
  fetchCerts()
})
</script>

<template>
  <div class="relative bg-gray-900 text-gray-100 min-h-screen font-sans selection:bg-green-500 selection:text-white overflow-hidden">
    
    <div class="absolute inset-0 h-screen z-0 overflow-hidden">
        
        <img 
            src="/real_bg.png" 
            alt="AI Background" 
            class="w-full h-full object-cover object-center opacity-60" 
        />

        <div class="absolute inset-0 bg-gray-900/50 mix-blend-multiply"></div>

        <div class="absolute bottom-0 left-0 w-full h-3/4 bg-gradient-to-b from-transparent via-gray-900/80 to-gray-900"></div>
    </div>


    <div class="relative z-10">
    <Navbar />

    <section id="home" class="h-screen flex flex-col justify-center px-6 max-w-6xl mx-auto pt-16">
      <div class="space-y-4 animate-fade-in-up">
        <h1 class="text-5xl md:text-7xl font-bold text-white tracking-tight">
          {{ profile.name }}
        </h1>
        <p class="text-xl md:text-2xl text-gray-400">
          I'm a passionate <span class="text-green-500 font-bold border-b-2 border-green-500">AI/Data Engineer</span>
        </p>
        
      </div>
    </section>

    <section id="about" class="py-24 px-6 bg-gray-900">
      <div class="max-w-6xl mx-auto">
        <div class="flex items-center gap-2 mb-12">
            <div class="h-1 w-10 bg-green-500"></div>
            <h2 class="text-sm font-bold tracking-widest text-green-500 uppercase">About Me</h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
             <img 
                v-if="profile.image" 
                :src="profile.image" 
                alt="Profile" 
                class="w-full h-[500px] object-cover rounded-lg grayscale hover:grayscale-0 transition duration-500 shadow-2xl"
              >
              <div v-else class="w-full h-[500px] bg-gray-800 rounded-lg animate-pulse"></div>
          </div>

          <div>
            <h3 class="text-3xl font-bold text-white mb-6">Learn more about me</h3>
            <p class="text-gray-400 leading-relaxed mb-6 whitespace-pre-line">
              {{ profile.description }}
            </p>
            
            <ul class="space-y-2 text-gray-300 mb-8">
                <li class="flex items-center gap-2"><span class="text-green-500">▹</span> Natural Language Processing</li>
                <li class="flex items-center gap-2"><span class="text-green-500">▹</span> Computer Vision</li>
                <li class="flex items-center gap-2"><span class="text-green-500">▹</span> Large Language Model</li>
            </ul>
          </div>
        </div>

        <div class="mt-20">
            <div class="flex items-center gap-2 mb-8">
                <div class="h-1 w-10 bg-green-500"></div>
                <h2 class="text-sm font-bold tracking-widest text-green-500 uppercase">My Skills</h2>
            </div>
            
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div v-for="item in skills" :key="item._id" 
                     class="bg-gray-800 border border-gray-700 p-4 rounded hover:border-green-500 transition cursor-default text-center">
                    <span class="font-bold text-gray-200">{{ item.name }}</span>
                </div>
                
                <div v-if="skills.length === 0" class="col-span-4 text-gray-500 text-sm">Loading skills...</div>
            </div>
      </div>

      <div class="mt-20">
        <div class="flex items-center gap-2 mb-8">
            <div class="h-1 w-10 bg-green-500"></div>
            <h2 class="text-sm font-bold tracking-widest text-green-500 uppercase">Certifications</h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
    <div v-for="cert in certificates" :key="cert._id" class="group relative bg-gray-800 rounded-lg overflow-hidden border border-gray-700 hover:shadow-lg hover:border-green-500 transition duration-300">
        
        <div class="absolute top-0 right-0 bg-red-600 text-white text-xs p-1 z-50" v-if="!cert.link">
            No Link
        </div>

        <a 
            v-if="cert.link" 
            :href="cert.link" 
            target="_blank" 
            class="absolute inset-0 z-20 cursor-pointer"
            title="Klik untuk melihat sertifikat"
        ></a>

        <div class="h-48 overflow-hidden bg-gray-700 relative">
            <img :src="cert.image" :alt="cert.title" class="w-full h-full object-cover group-hover:scale-105 transition duration-500">
            
            <div v-if="cert.link" class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition backdrop-blur-sm z-10 pointer-events-none">
                <span class="text-white font-bold border-2 border-green-500 bg-green-500/20 px-4 py-2 rounded-full text-sm flex items-center gap-2">
                    Buka Sertifikat ↗
                </span>
            </div>
        </div>
        
        <div class="p-5">
            <h3 class="font-bold text-white text-lg mb-1 leading-tight group-hover:text-green-400 transition">{{ cert.title }}</h3>
            <p class="text-green-600 text-sm mb-4">{{ cert.issuer }}</p>
            
            <div class="flex justify-between items-center text-xs text-gray-500 border-t border-gray-700 pt-3">
                <span>Issued: {{ formatDate(cert.issuedAt) }}</span>
                <span v-if="cert.expiresAt">Exp: {{ formatDate(cert.expiresAt) }}</span>
                <span v-else class="text-green-600">Lifetime</span>
            </div>
        </div>

    </div>
</div>
    </div>
      </div>
    </section>
<section id="portfolio" class="py-24 px-6 bg-gray-800">
    <div class="max-w-6xl mx-auto">
      
      <div class="flex items-center gap-2 mb-8">
          <div class="h-1 w-10 bg-green-500"></div>
          <h2 class="text-sm font-bold tracking-widest text-green-500 uppercase">Selected Works</h2>
      </div>

      <div class="flex flex-wrap gap-4 mb-12 justify-center md:justify-start">
          <button 
              v-for="cat in categories" 
              :key="cat"
              @click="selectedCategory = cat"
              class="px-6 py-2 rounded-full border transition text-sm font-bold"
              :class="selectedCategory === cat 
                  ? 'bg-green-600 text-white border-green-600' 
                  : 'text-gray-400 border-gray-700 hover:border-green-500 hover:text-white'"
          >
              {{ cat }}
          </button>
      </div>

      <div v-if="filteredProjects.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    
        <div v-for="item in filteredProjects" :key="item._id" class="group relative bg-gray-900 rounded-xl overflow-hidden hover:shadow-2xl hover:shadow-green-900/20 transition duration-300 border border-gray-700 flex flex-col h-full">
          
          <a 
              v-if="item.github" 
              :href="item.github" 
              target="_blank" 
              class="absolute inset-0 z-20 cursor-pointer"
              title="Lihat Source Code di GitHub"
          ></a>

          <div class="relative overflow-hidden h-48">
              <img :src="item.image" :alt="item.title" class="w-full h-full object-cover group-hover:scale-110 transition duration-500">
              
              <div class="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded backdrop-blur-sm border border-gray-600 z-10">
                  {{ item.category }}
              </div>

              <div v-if="item.github" class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition backdrop-blur-sm z-10 pointer-events-none">
                   <div class="bg-gray-800 p-3 rounded-full border border-gray-600">
                       <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                   </div>
              </div>
          </div>
          
          <div class="p-6 flex-1 flex flex-col">
            <h3 class="text-xl font-bold text-white mb-2 group-hover:text-green-400 transition">
              {{ item.title }} 
              <span v-if="item.github" class="text-xs text-gray-500 font-normal ml-2">↗</span>
            </h3>
            
            <p class="custom-scroll text-gray-300 text-sm mb-4 h-24 overflow-y-auto pr-2 relative z-30">
              {{ item.description }}
            </p>
            
            <div class="flex flex-wrap gap-2 mt-auto">
              <span v-for="tech in item.tech" :key="tech" class="px-2 py-1 bg-gray-800 text-green-400 text-xs rounded border border-gray-700">
                {{ tech }}
              </span>
            </div>
          </div>

        </div>

      </div>
      
      <div v-else class="text-center text-gray-500 py-10">
          Tidak ada project di kategori "{{ selectedCategory }}".
      </div>

    </div>
  </section>

    <section id="contact" class="py-24 px-6 bg-gray-900 text-center relative overflow-hidden">
    <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gray-900 via-green-500 to-gray-900"></div>

    <div class="max-w-4xl mx-auto relative z-10">
        <h2 class="text-4xl font-bold text-white mb-6">Contact Me</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
            
            <a 
                v-if="profile.email" 
                :href="`https://mail.google.com/mail/?view=cm&fs=1&to=${profile.email}`" 
                target="_blank"
                class="group bg-gray-800 p-6 rounded-xl border border-gray-700 hover:border-red-500 hover:bg-gray-800/80 transition flex flex-col items-center gap-4">
                <div class="p-4 bg-gray-700 rounded-full group-hover:bg-red-500/20 group-hover:text-red-500 text-gray-300 transition">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                </div>
                <span class="font-bold text-gray-300 group-hover:text-white">Email Me</span>
            </a>

            <a v-if="profile.linkedin" :href="profile.linkedin" target="_blank" class="group bg-gray-800 p-6 rounded-xl border border-gray-700 hover:border-blue-500 hover:bg-gray-800/80 transition flex flex-col items-center gap-4">
                <div class="p-4 bg-gray-700 rounded-full group-hover:bg-blue-500/20 group-hover:text-blue-500 text-gray-300 transition">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
                </div>
                <span class="font-bold text-gray-300 group-hover:text-white">LinkedIn</span>
            </a>

            <a v-if="profile.github" :href="profile.github" target="_blank" class="group bg-gray-800 p-6 rounded-xl border border-gray-700 hover:border-white hover:bg-gray-800/80 transition flex flex-col items-center gap-4">
                <div class="p-4 bg-gray-700 rounded-full group-hover:bg-white/10 group-hover:text-white text-gray-300 transition">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
                </div>
                <span class="font-bold text-gray-300 group-hover:text-white">GitHub</span>
            </a>

            <a v-if="profile.instagram" :href="profile.instagram" target="_blank" class="group bg-gray-800 p-6 rounded-xl border border-gray-700 hover:border-pink-500 hover:bg-gray-800/80 transition flex flex-col items-center gap-4">
                <div class="p-4 bg-gray-700 rounded-full group-hover:bg-pink-500/20 group-hover:text-pink-500 text-gray-300 transition">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                </div>
                <span class="font-bold text-gray-300 group-hover:text-white">Instagram</span>
            </a>

        </div>
        
        <footer class="mt-20 border-t border-gray-800 pt-8 text-gray-600 text-sm">
            Made by {{ profile.name }} • 2026.
        </footer>
    </div>
</section>

      </div>
    </div>
</template>

<style>
html {
  scroll-behavior: smooth;
}
</style>

<style scoped>
/* CSS UNTUK SCROLLBAR GELAP */

/* 1. Chrome, Safari, Edge */
.custom-scroll::-webkit-scrollbar {
  width: 6px;
}

.custom-scroll::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scroll::-webkit-scrollbar-thumb {
  background-color: #374151; /* Gray-700 */
  border-radius: 20px;
}

.custom-scroll::-webkit-scrollbar-thumb:hover {
  background-color: #4b5563; /* Gray-600 */
}

/* 2. Firefox */
.custom-scroll {
  scrollbar-width: thin;
  scrollbar-color: #374151 transparent;
}
</style>