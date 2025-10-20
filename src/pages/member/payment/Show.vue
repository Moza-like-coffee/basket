<script setup>
import MemberLayouts from '@/layouts/MemberLayouts.vue'
import { usePaymentStore } from '@/stores/payment'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const paymentStore = usePaymentStore()
const payment = ref()

onMounted(async () => {
  await paymentStore.show(route.params.id)
  payment.value = paymentStore.data
})
</script>
<template>
  <MemberLayouts>
    <div class="py-3 space-y-3">
      <div class="rounded-lg bg-white shadow px-5 pb-3 pt-5 w-full">
        <p class="font-semibold text-lg">Detail Pembayaran</p>
        <p class="text-sm text-gray-500">Kode Referensi : {{ route.params.id }}</p>
        <div class="flex justify-between items-center"></div>
      </div>
    </div>
  </MemberLayouts>
</template>
