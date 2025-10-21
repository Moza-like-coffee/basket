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
        <div v-for="(item, index) in payment?.details" :key="index">
          <div class="flex justify-between items-center">
            <div>
              <p>
                {{ item?.bill?.member?.name }}
              </p>
              <p>
                {{
                  item?.bill?.bill_type == 'registration' ? 'Biaya Pendaftaran' : 'Iuran Bulanan'
                }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </MemberLayouts>
</template>
