<script setup>
import { RouterLink } from "vue-router";
</script>

<template>
  <div class="h-screen w-full bg-[#ebebea] flex items-center justify-center p-5">
    <div class="w-full max-w-md">
     <div class="bg-white rounded-xl shadow-md border border-gray-200 px-10 pt-8 pb-16 flex flex-col">
        
        <!-- Back Button -->
        <button
        class="mb-4 flex items-center justify-center w-10 h-10 bg-white rounded-lg shadow hover:bg-gray-100 transition text-rhino-600"
        @click="$router.back()"
      
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

        <!-- Title -->
        <div class="text-center mb-10">
          <h1 class="text-3xl font-bold text-[#4878c8] mb-2">Log in</h1>
          <p class="text-sm text-gray-600">
            Akses akun Anda menggunakan kredensial Anda
          </p>
        </div>

        <!-- Form -->
        <form class="flex flex-col gap-6">
          <!-- Username -->
          <div class="flex flex-col gap-2">
            <label class="text-sm font-semibold text-[#4878c8]">Username</label>
            <div class="relative">
              <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-[#cc6633]">
                <i class="ri-user-3-line text-lg"></i>
              </span>
              <input
                type="text"
                placeholder="Nama Pengguna"
                autocomplete="username"
                class="w-full rounded-md border border-gray-300 pl-10 pr-3 py-2 
                       focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>
          </div>

          <!-- Password -->
          <div class="flex flex-col gap-2">
            <label class="text-sm font-semibold text-[#4878c8]">Password</label>
            <div class="relative">
              <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-[#cc6633]">
                <i class="ri-lock-2-line text-lg"></i>
              </span>
              <input
                type="password"
                placeholder="Kata Sandi"
                autocomplete="current-password"
                class="w-full rounded-md border border-gray-300 pl-10 pr-3 py-2 
                       focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>
          </div>

          <!-- Button -->
          <button
            type="submit"
            class="w-60 mx-auto bg-[#cc6633] text-white py-2 rounded-full 
                   hover:bg-orange-700 transition"
          >
            Masuk
          </button>
        </form>

        <!-- Register Link -->
        <p class="text-center text-sm text-gray-600 mt-10">
          Belum punya akun?
          <RouterLink
            :to="{ name: 'register' }"
            class="text-[#4878c8] hover:underline"
          >
            Daftar
          </RouterLink>
        </p>
      </div>
    </div>
  </div>
</template>

<style>
@import 'https://cdn.jsdelivr.net/npm/remixicon@3.5.0/fonts/remixicon.css';
</style>
