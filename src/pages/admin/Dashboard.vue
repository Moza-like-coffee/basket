<script setup>
import AdminLayouts from '@/layouts/AdminLayouts.vue'
import { useDashboardStore } from '@/stores/dashboard'
import { onMounted, ref } from 'vue'

const dashboardStore = useDashboardStore()
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
      <div class="grid grid-cols-3 gap-3">
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
          class="bg-rhino-950 rounded-lg shadow h-20 cursor-pointer hover:scale-105 hover:opacity-95 transition-all duration-300"
        >
          <div class="flex gap-3 items-center h-full p-5">
            <div
              class="bg-piper-600 rounded-full p-3 flex items-center justify-center aspect-square"
            >
              <i class="fa-solid fa-money-check-dollar-pen text-2xl text-white"></i>
            </div>
            <div class="flex flex-col items-center w-full font-montserrat">
              <p class="text-3xl font-bold text-white">0</p>
              <p class="text-sm text-white">Pembayaran Tertunda</p>
            </div>
          </div>
        </router-link>
        <div
          class="bg-rhino-950 rounded-lg shadow h-20 cursor-pointer hover:scale-105 hover:opacity-95 transition-all duration-300"
        >
          <div class="flex gap-3 items-center h-full p-5">
            <div
              class="bg-piper-600 rounded-full p-3 flex items-center justify-center aspect-square"
            >
              <i class="fa-solid fa-money-bills text-2xl text-white"></i>
            </div>
            <div class="flex flex-col items-center w-full font-montserrat">
              <p class="text-3xl font-bold text-white">0</p>
              <p class="text-sm text-white">Tagihan</p>
            </div>
          </div>
        </div>
      </div>
      <div class="grid grid-cols-2 gap-3">
        <div class="h-80 w-full rounded-lg shadow bg-white"></div>
        <div class="h-80 w-full rounded-lg shadow bg-white"></div>
      </div>
      <div class="grid grid-cols-3 gap-3">
        <div class="h-80 w-full rounded-lg shadow bg-white col-span-2"></div>
        <div class="h-80 w-full rounded-lg shadow bg-white"></div>
      </div>
    </div>
  </AdminLayouts>
</template>
