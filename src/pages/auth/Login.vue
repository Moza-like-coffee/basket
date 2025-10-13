<script setup>
import { RouterLink } from 'vue-router'

import GuestLayouts from '@/layouts/GuestLayouts.vue'
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const form = ref({
  username: null,
  password: null,
})

async function submit() {
  authStore.login(form.value)
}
</script>

<template>
  <GuestLayouts>
    <div class="p-3 h-full flex flex-col">
      <p class="text-end text-xs text-gray-600 relative z-20">
        Belum punya akun?
        <RouterLink :to="{ name: 'register' }" class="text-blue-500 hover:underline">
          Daftar Sekarang
        </RouterLink>
      </p>
      <div class="pb-2 h-full">
        <div class="flex items-center h-full w-full">
          <div class="w-full -mt-4 space-y-2">
            <div class="text-center mt-10">
              <h1 class="text-3xl font-bold text-rhino-950 font-basketball">Log in</h1>
              <p class="text-xs text-gray-400 font-basketball mt-1">
                Akses akun Anda menggunakan kredensial Anda
              </p>
            </div>

            <form @submit.prevent="submit" class="flex flex-col gap-4 mt-5 pb-3">
              <div class="flex flex-col gap-2">
                <div>
                  <input
                    v-model="form.username"
                    type="text"
                    placeholder="Masukkan Nama Pengguna/Email"
                    class="w-full rounded-xl px-3 py-2 text-black text-xs bg-white shadow-lg"
                    required
                  />
                </div>
              </div>
              <div class="flex flex-col gap-2">
                <div>
                  <input
                    v-model="form.password"
                    type="password"
                    placeholder="Masukkan Password"
                    class="w-full rounded-xl px-3 py-2 text-black text-xs bg-white shadow-lg"
                    required
                  />
                </div>
              </div>

              <!-- Button -->
              <button
                type="submit"
                class="w-full text-xs bg-piper-600 text-white py-2 rounded-xl hover:opacity-90 transition-all cursor-pointer duration-300 shadow-lg"
              >
                Masuk
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </GuestLayouts>
</template>
