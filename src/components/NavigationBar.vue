<script setup>
import { ref } from 'vue'

const navbarItem = ref([
  {
    label: 'Beranda',
  },
  {
    label: 'Tentang Kami',
  },
  {
    label: 'Info Latihan',
  },
  {
    label: 'Jajaran Pelatih & Staff',
  },
  {
    label: 'Berita Terkini & Prestasi',
  },
  {
    label: 'Lainnya',
  },
])
</script>
<template>
  <nav class="w-full font-montserrat h-16 fixed top-0 z-50">
    <div class="max-w-7xl bg-gradient-to-r from-rhino-900 to-rhino-950 h-16 w-full mx-auto px-10">
      <div class="flex gap-3 h-full items-center justify-between">
        <router-link :to="{ name: 'welcome' }" class="text-white">LOGO</router-link>
        <div class="flex h-full py-3 justify-center gap-1 items-center">
          <router-link
            v-for="(item, index) in navbarItem"
            :key="index"
            class="h-full md:flex items-center px-3 hidden"
          >
            <p class="text-sm text-gray-300 hover:text-white transition-colors duration-300">
              {{ item.label }}
            </p>
          </router-link>
        </div>
        <div class="flex items-center gap-3">
          <router-link :to="{ name: 'login' }">
            <div
              class="bg-white rounded-lg px-3 py-1 flex gap-1 items-center justify-center shadow-lg group hover:bg-piper-600 transition-colors duration-300"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                class="stroke-black w-4 h-4 group-hover:stroke-white transition-colors duration-300"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g id="SVGRepo_iconCarrier">
                  <path
                    d="M5 21C5 17.134 8.13401 14 12 14C15.866 14 19 17.134 19 21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></path>
                </g>
              </svg>
              <p class="text-xs text-black group-hover:text-white transition-colors duration-300">
                Login
              </p>
            </div>
          </router-link>
          <router-link :to="{ name: 'register' }">
            <div
              class="bg-piper-600 rounded-lg px-3 py-1 flex gap-1 items-center justify-center shadow-lg group hover:bg-white transition-colors duration-300"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                class="stroke-white w-4 h-4 group-hover:stroke-black transition-colors duration-300"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g id="SVGRepo_iconCarrier">
                  <path
                    d="M20 12C20 7.58172 16.4183 4 12 4M12 20C14.5264 20 16.7792 18.8289 18.2454 17"
                    stroke-width="1.5"
                    stroke-linecap="round"
                  ></path>
                  <path
                    d="M4 12H14M14 12L11 9M14 12L11 15"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></path>
                </g>
              </svg>
              <p class="text-xs text-white group-hover:text-black transition-colors duration-300">
                Daftar
              </p>
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </nav>
</template>
