<script setup>
import { useAuthStore } from '@/stores/auth'
import { Menu } from 'primevue'
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import Logo from '@/assets/images/logo.png'

const route = useRoute()
const profileMenu = ref()
const profileMenuToggle = (event) => {
  profileMenu.value.toggle(event)
}

const authStore = useAuthStore()

async function logout() {
  authStore.logout()
}

const sideBarItems = ref([
  {
    icon: 'fa-solid fa-grid-2',
    label: 'Dashboard',
    to: 'dashboard',
  },
  {
    icon: 'fa-solid fa-users-line',
    label: 'Member',
    to: 'dashboard',
  },
  {
    icon: 'fa-solid fa-timer',
    label: 'Jadwal Latihan',
    to: 'dashboard',
  },
  {
    icon: 'fa-solid fa-money-bills',
    label: 'Tagihan',
    to: 'dashboard',
  },
])
</script>
<template>
  <div class="min-h-screen w-full bg-gray-200 font-poppins">
    <div class="flex h-full w-full">
      <div class="p-3 h-full w-72 fixed left-0 top-0 flex-none">
        <div class="h-full bg-rhino-950 w-full rounded-lg p-3 flex flex-col gap-3 shadow-lg">
          <div class="border-b border-gray-300 h-16 flex items-center">
            <router-link
              :to="{ name: 'welcome' }"
              class="bg-white w-full rounded-lg p-1 flex items-center justify-center mb-3"
            >
              <img :src="Logo" class="h-11" alt="" />
            </router-link>
          </div>
          <div class="h-full overflow-y-scroll no-scrollbar">
            <div
              v-for="(item, index) in sideBarItems"
              :key="index"
              class="p-3 text-white rounded-lg hover:bg-piper-600 transition-all duration-300 cursor-pointer"
            >
              <router-link :to="{ name: item.to }" class="flex gap-3 items-center text-sm">
                <i :class="item.icon"></i>
                <p>{{ item.label }}</p>
              </router-link>
            </div>
          </div>
        </div>
      </div>
      <div class="min-h-screen pl-72 py-3 pr-3 w-full">
        <div
          class="w-full bg-rhino-950 h-16 rounded-lg shadow-lg flex items-center justify-between py-3 px-5"
        >
          <p class="text-white font-medium text-xl">{{ route?.meta?.title }}</p>
          <div class="flex gap-3">
            <div>
              <svg viewBox="0 0 24 24" class="w-7 h-7" fill="white">
                <g id="SVGRepo_iconCarrier">
                  <path
                    d="M19.3399 14.49L18.3399 12.83C18.1299 12.46 17.9399 11.76 17.9399 11.35V8.82C17.9399 6.47 16.5599 4.44 14.5699 3.49C14.0499 2.57 13.0899 2 11.9899 2C10.8999 2 9.91994 2.59 9.39994 3.52C7.44994 4.49 6.09994 6.5 6.09994 8.82V11.35C6.09994 11.76 5.90994 12.46 5.69994 12.82L4.68994 14.49C4.28994 15.16 4.19994 15.9 4.44994 16.58C4.68994 17.25 5.25994 17.77 5.99994 18.02C7.93994 18.68 9.97994 19 12.0199 19C14.0599 19 16.0999 18.68 18.0399 18.03C18.7399 17.8 19.2799 17.27 19.5399 16.58C19.7999 15.89 19.7299 15.13 19.3399 14.49Z"
                  ></path>
                  <path
                    d="M14.8297 20.01C14.4097 21.17 13.2997 22 11.9997 22C11.2097 22 10.4297 21.68 9.87969 21.11C9.55969 20.81 9.31969 20.41 9.17969 20C9.30969 20.02 9.43969 20.03 9.57969 20.05C9.80969 20.08 10.0497 20.11 10.2897 20.13C10.8597 20.18 11.4397 20.21 12.0197 20.21C12.5897 20.21 13.1597 20.18 13.7197 20.13C13.9297 20.11 14.1397 20.1 14.3397 20.07C14.4997 20.05 14.6597 20.03 14.8297 20.01Z"
                  ></path>
                </g>
              </svg>
            </div>
            <div class="border border-gray-400"></div>
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
        <slot />
      </div>
    </div>
  </div>
</template>
