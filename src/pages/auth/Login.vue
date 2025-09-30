<script setup></script>
<template>
  <div class="h-screen w-full bg-[#ebebea] flex items-center justify-center py-2 px-5">
    <div class="w-full max-w-3xl mx-auto">
      <div class="p-5 bg-white rounded-lg border border-gray-300 shadow-lg">
        <div class="mb-5">
          <router-link :to="{ name: 'welcome' }" class="text-xl">LOGO</router-link>
        </div>
        <div>
          <p class="font-basketball text-3xl font-bold mb-2">Log In</p>
          <p>Akses akun anda menggunakan kredensial anda.</p>
        </div>
      </div>
    </div>
  </div>
</template>
