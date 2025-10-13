<script setup>
import GuestLayouts from '@/layouts/GuestLayouts.vue'
import { useAuthStore } from '@/stores/auth'
import { ref } from 'vue'

const authStore = useAuthStore()
const form = ref({
  name: null,
  username: null,
  password: null,
  confirmedPassword: null,
  email: null,
})

async function submit() {
  authStore.register(form.value)
}
</script>

<template>
  <GuestLayouts>
    <div class="p-3 h-full flex flex-col">
      <p class="text-end text-xs text-gray-600 relative z-20">
        Sudah Punya Akun?
        <router-link :to="{ name: 'login' }" class="text-blue-500 hover:underline">
          Login
        </router-link>
      </p>
      <div class="pb-2 h-full">
        <div class="flex items-center h-full w-full">
          <div class="w-full -mt-4 space-y-2">
            <div class="text-center mt-10">
              <h1 class="text-3xl font-bold text-rhino-950 font-basketball">Daftar</h1>
              <p class="text-xs text-gray-400 font-basketball mt-1">
                Buat Akun untuk mendapatkan akses ke Aplikasi.
              </p>
            </div>
            <form @submit.prevent="submit" class="space-y-4">
              <div class="grid grid-cols-2 gap-3">
                <div class="flex flex-col gap-2">
                  <div>
                    <input
                      type="text"
                      v-model="form.name"
                      placeholder="Masukkan Nama Lengkap"
                      class="w-full rounded-xl px-3 py-2 text-black text-xs bg-white shadow-lg"
                      required
                    />
                  </div>
                </div>
                <div class="flex flex-col gap-2">
                  <div>
                    <input
                      type="text"
                      v-model="form.username"
                      placeholder="Masukkan Username"
                      class="w-full rounded-xl px-3 py-2 text-black text-xs bg-white shadow-lg"
                      required
                    />
                  </div>
                </div>
              </div>
              <div class="flex flex-col gap-2">
                <div>
                  <input
                    type="email"
                    v-model="form.email"
                    placeholder="Masukkan Email"
                    class="w-full rounded-xl px-3 py-2 text-black text-xs bg-white shadow-lg"
                    required
                  />
                </div>
              </div>
              <div class="flex flex-col gap-2">
                <div>
                  <input
                    type="password"
                    v-model="form.password"
                    placeholder="Masukkan Password"
                    class="w-full rounded-xl px-3 py-2 text-black text-xs bg-white shadow-lg"
                    required
                  />
                </div>
              </div>
              <div class="flex flex-col gap-2">
                <div>
                  <input
                    type="password"
                    v-model="form.confirmedPassword"
                    placeholder="Konfirmasi Password"
                    class="w-full rounded-xl px-3 py-2 text-black text-xs bg-white shadow-lg"
                    required
                  />
                  <p
                    v-if="form.confirmedPassword && form.password !== form.confirmedPassword"
                    class="text-[10px] mt-1 text-red-500 pl-3"
                  >
                    Password Anda Tidak Valid
                  </p>
                </div>
              </div>

              <button
                type="submit"
                class="w-full text-xs bg-piper-600 text-white py-2 rounded-xl hover:opacity-90 transition-all cursor-pointer duration-300 shadow-lg"
              >
                Daftar
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </GuestLayouts>
</template>
