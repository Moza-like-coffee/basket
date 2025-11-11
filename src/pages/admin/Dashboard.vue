<script setup>
import AdminLayouts from '@/layouts/AdminLayouts.vue'
import { useAuthStore } from '@/stores/auth'
import { useDashboardStore } from '@/stores/dashboard'
import { onMounted, ref } from 'vue'

const dashboardStore = useDashboardStore()
const authStore = useAuthStore()
const datas = ref()

function fetchData() {
  datas.value = dashboardStore.datas
}

onMounted(async () => {
  await dashboardStore.adminDashboard()
  fetchData()
})
</script>
<template>
  <AdminLayouts>
    <div class="py-3 space-y-3">
      <div class="grid md:grid-cols-3 gap-3">
        <router-link
          :to="{ name: 'admin.member.index' }"
          class="bg-rhino-950 rounded-lg shadow h-20 cursor-pointer hover:scale-105 hover:opacity-95 transition-all duration-300"
        >
          <div class="flex gap-3 items-center h-full p-5">
            <div
              class="bg-piper-600 rounded-full p-3 flex items-center justify-center aspect-square"
            >
              <i class="fa-solid fa-users text-2xl text-white"></i>
            </div>
            <div class="flex flex-col items-center w-full font-montserrat">
              <p class="text-3xl font-bold text-white">{{ datas?.member ?? 0 }}</p>
              <p class="text-sm text-white">Member</p>
            </div>
          </div>
        </router-link>
        <router-link
          :to="{ name: 'admin.payment.index' }"
          class="bg-rhino-950 rounded-lg shadow h-20 cursor-pointer hover:scale-105 hover:opacity-95 transition-all duration-300"
        >
          <div class="flex gap-3 items-center h-full p-5">
            <div
              class="bg-piper-600 rounded-full p-3 flex items-center justify-center aspect-square"
            >
              <i class="fa-solid fa-money-check-dollar-pen text-2xl text-white"></i>
            </div>
            <div class="flex flex-col items-center w-full font-montserrat">
              <p class="text-3xl font-bold text-white">{{ datas?.payment ?? 0 }}</p>
              <p class="text-sm text-white">Pembayaran Tertunda</p>
            </div>
          </div>
        </router-link>
        <router-link
          :to="{ name: 'admin.bill.index' }"
          class="bg-rhino-950 rounded-lg shadow h-20 cursor-pointer hover:scale-105 hover:opacity-95 transition-all duration-300"
        >
          <div class="flex gap-3 items-center h-full p-5">
            <div
              class="bg-piper-600 rounded-full p-3 flex items-center justify-center aspect-square"
            >
              <i class="fa-solid fa-money-bills text-2xl text-white"></i>
            </div>
            <div class="flex flex-col items-center w-full font-montserrat">
              <p class="text-3xl font-bold text-white">{{ datas?.bill ?? 0 }}</p>
              <p class="text-sm text-white">Tagihan</p>
            </div>
          </div>
        </router-link>
      </div>
      <!-- <div class="grid grid-cols-2 gap-3">
        <div class="h-80 w-full rounded-lg shadow bg-white"></div>
        <div class="h-80 w-full rounded-lg shadow bg-white"></div>
      </div>
      <div class="grid grid-cols-3 gap-3">
        <div class="h-80 w-full rounded-lg shadow bg-white col-span-2"></div>
        <div class="h-80 w-full rounded-lg shadow bg-white"></div>
      </div> -->
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
  </AdminLayouts>
</template>
