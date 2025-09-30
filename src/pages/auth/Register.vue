<script setup>
import { ref } from 'vue'

const username = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
</script>

<template>
  <div class="flex justify-center items-center min-h-screen bg-[#BEBDBB]">
    <div class="bg-white shadow-2xl rounded-xl p-6 w-full max-w-sm">
      <button
        class="mb-4 flex items-center justify-center w-10 h-10 bg-white rounded-lg shadow hover:bg-gray-100 transition text-rhino-600"
        @click="$router.back()"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <h1 class="text-2xl font-bold text-center text-rhino-600">Sign up</h1>
      <p class="text-center text-sm text-gray-600 mb-6">Daftar dengan Victoria Basket</p>

      <form class="space-y-4">
        <!-- Username -->
        <div>
          <label class="block text-sm font-medium text-rhino-600 mb-1">Username</label>
          <div class="flex items-center bg-white rounded-md border border-[#BEBDBB] px-3 py-2 focus-within:border-piper-600 transition">
            <i class="ri-user-line text-piper-600 mr-2"></i>
            <input 
              type="text" 
              v-model="username"
              placeholder="Nama Pengguna" 
              class="w-full outline-none text-sm bg-transparent"
            />
          </div>
        </div>

        <!-- Email -->
        <div>
          <label class="block text-sm font-medium text-rhino-600 mb-1">Email</label>
          <div class="flex items-center bg-white rounded-md border border-[#BEBDBB] px-3 py-2 focus-within:border-piper-600 transition">
            <i class="ri-mail-line text-piper-600 mr-2"></i>
            <input 
              type="email" 
              v-model="email"
              placeholder="Alamat Email" 
              class="w-full outline-none text-sm bg-transparent"
            />
          </div>
        </div>

        <!-- Password -->
        <div>
          <label class="block text-sm font-medium text-rhino-600 mb-1">Password</label>
          <div class="flex items-center bg-white rounded-md border border-[#BEBDBB] px-3 py-2 focus-within:border-piper-600 transition">
            <i class="ri-lock-line text-piper-600 mr-2"></i>
            <input 
              type="password" 
              v-model="password"
              placeholder="Kata Sandi" 
              class="w-full outline-none text-sm bg-transparent"
            />
          </div>
        </div>

        <!-- Konfirmasi Password -->
        <div>
          <label class="block text-sm font-medium text-rhino-600 mb-1">Confirmation Password</label>
          <div class="flex items-center bg-white rounded-md border border-[#BEBDBB] px-3 py-2 focus-within:border-piper-600 transition">
            <i class="ri-lock-line text-piper-600 mr-2"></i>
            <input 
              type="password" 
              v-model="confirmPassword"
              placeholder="Konfirmasi Kata Sandi" 
              class="w-full outline-none text-sm bg-transparent"
            />
          </div>
        </div>

        <!-- Tombol daftar -->
        <div class="flex justify-center">
          <button 
            type="submit" 
            class="w-48 py-2 bg-piper-600 text-white rounded-full font-semibold hover:bg-piper-700 transition"
          >
            Daftar
          </button>
        </div>

        <p class="text-center text-sm text-gray-600 mt-2">
          Sudah memiliki akun? 
          <a href="login" class="text-rhino-600 font-medium hover:underline">Masuk</a>
        </p>
      </form>
    </div>
  </div>
</template>

<style scoped>
@import 'https://cdn.jsdelivr.net/npm/remixicon@3.5.0/fonts/remixicon.css';
</style>