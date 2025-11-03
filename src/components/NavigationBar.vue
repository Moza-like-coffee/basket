<script setup>
import { ref } from 'vue'
import Logo from '@/assets/images/logo.png'
import { useAuthStore } from '@/stores/auth'
import { Menu } from 'primevue'

const authStore = useAuthStore()
const profileMenu = ref()
const profileMenuToggle = (event) => {
  profileMenu.value.toggle(event)
}
async function logout() {
  authStore.logout()
}

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
    <div
      class="max-w-7xl bg-gradient-to-r from-rhino-900 to-rhino-950 h-16 w-full mx-auto md:px-10 px-5"
    >
      <div class="flex gap-3 h-full items-center justify-between">
        <router-link :to="{ name: 'welcome' }" class="bg-white rounded-lg">
          <img :src="Logo" class="w-14" alt="" />
        </router-link>
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
        <div class="flex items-center gap-3" v-if="!authStore.authStatus">
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
        <div v-else>
          <div
            class="rounded-full w-7 h-7 bg-white flex items-center justify-center cursor-pointer"
            @click="profileMenuToggle"
          >
            <svg
              viewBox="0 0 24 24"
              class="w-6 h-6 fill-rhino-950"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g id="SVGRepo_iconCarrier">
                <circle cx="12" cy="6" r="4"></circle>
                <ellipse opacity="0.5" cx="12" cy="17" rx="7" ry="4"></ellipse>
              </g>
            </svg>
          </div>
          <Menu ref="profileMenu" :popup="true">
            <template #start>
              <div class="max-w-xs font-poppins">
                <div class="border-b w-full border-gray-300">
                  <span class="inline-flex items-center gap-1 px-2 py-2 w-full">
                    <router-link
                      :to="{ name: 'welcome' }"
                      class="text-black flex items-center gap-2"
                    >
                      <img :src="Logo" class="h-7" alt="" />
                      <p class="text-xs font-medium text-gray-600">Victoria Basketball</p>
                    </router-link>
                  </span>
                </div>
                <div class="border-b w-full border-gray-300">
                  <div>
                    <router-link
                      :to="{ name: 'dashboard' }"
                      class="text-sm hover:bg-gray-100 w-full text-start p-2 transition-all duration-300 cursor-pointer flex items-center gap-2"
                    >
                      <div class="rounded-full w-7 h-7 flex items-center justify-center">
                        <i class="fa-solid fa-grid-2 text-gray-500"></i>
                      </div>
                      <p class="text-xs">Dashboard</p>
                    </router-link>
                    <button
                      @click="logout"
                      class="text-sm hover:bg-gray-100 w-full text-start p-2 transition-all duration-300 cursor-pointer flex items-center gap-2"
                    >
                      <div class="rounded-full w-7 h-7 flex items-center justify-center">
                        <svg
                          viewBox="0 0 24 24"
                          class="fill-gray-500 w-6 h-6"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g id="SVGRepo_iconCarrier">
                            <path
                              fill-rule="evenodd"
                              clip-rule="evenodd"
                              d="M2 6.5C2 4.01472 4.01472 2 6.5 2H12C14.2091 2 16 3.79086 16 6V7C16 7.55228 15.5523 8 15 8C14.4477 8 14 7.55228 14 7V6C14 4.89543 13.1046 4 12 4H6.5C5.11929 4 4 5.11929 4 6.5V17.5C4 18.8807 5.11929 20 6.5 20H12C13.1046 20 14 19.1046 14 18V17C14 16.4477 14.4477 16 15 16C15.5523 16 16 16.4477 16 17V18C16 20.2091 14.2091 22 12 22H6.5C4.01472 22 2 19.9853 2 17.5V6.5ZM18.2929 8.29289C18.6834 7.90237 19.3166 7.90237 19.7071 8.29289L22.7071 11.2929C23.0976 11.6834 23.0976 12.3166 22.7071 12.7071L19.7071 15.7071C19.3166 16.0976 18.6834 16.0976 18.2929 15.7071C17.9024 15.3166 17.9024 14.6834 18.2929 14.2929L19.5858 13L11 13C10.4477 13 10 12.5523 10 12C10 11.4477 10.4477 11 11 11L19.5858 11L18.2929 9.70711C17.9024 9.31658 17.9024 8.68342 18.2929 8.29289Z"
                            ></path>
                          </g>
                        </svg>
                      </div>
                      <p class="text-xs">Logout</p>
                    </button>
                  </div>
                </div>
              </div>
            </template>
            <template #end>
              <div class="p-2 pt-0 flex gap-2 items-center max-w-xs font-poppins">
                <div
                  class="rounded-full w-7 h-7 bg-white flex items-center justify-center border border-gray-300"
                >
                  <svg
                    viewBox="0 0 24 24"
                    class="w-6 h-6 fill-rhino-950"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g id="SVGRepo_iconCarrier">
                      <circle cx="12" cy="6" r="4"></circle>
                      <ellipse opacity="0.5" cx="12" cy="17" rx="7" ry="4"></ellipse>
                    </g>
                  </svg>
                </div>
                <div class="grid grid-cols-1">
                  <p class="text-xs line-clamp-1">
                    {{ authStore?.decryptedUserData?.name }}
                  </p>
                  <p class="text-xs line-clamp-1 font-medium">
                    {{ authStore?.decryptedUserData?.email }}
                  </p>
                </div>
              </div>
            </template>
          </Menu>
        </div>
      </div>
    </div>
  </nav>
</template>
