<script setup>
import CoachLayouts from '@/layouts/CoachLayouts.vue'
</script>
<template>
  <CoachLayouts>
    <div class="py-3 space-y-3">
      <div class="w-full rounded-lg shadow bg-white p-5">
        <i class="fa-regular fa-house-night text-2xl text-rhino-950"></i>
        <p class="text-3xl font-montserrat font-medium">
          Selamat Datang,
          <span class="font-semibold">{{ authStore?.decryptedUserData?.name }}</span> !!
        </p>
        <p class="text-xs text-gray-500">
          Selamat datang di aplikasi resmi Victoria Basketball! Nikmati kemudahan dalam mengelola
          jadwal latihan, mengikuti event, dan terus berkembang bersama komunitas basket terbaik.
        </p>
      </div>
    </div>
  </CoachLayouts>
</template>
