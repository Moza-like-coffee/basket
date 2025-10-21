<script setup>
import { usePaymentStore } from '@/stores/payment'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import Dialog from 'primevue/dialog'
import AdminLayouts from '@/layouts/AdminLayouts.vue'
import { ConfirmPopup, Image, useConfirm } from 'primevue'

const route = useRoute()
const paymentStore = usePaymentStore()
const payment = ref()
const confirm = useConfirm()

onMounted(async () => {
  await paymentStore.show(route.params.id)
  payment.value = paymentStore.data
})

const backendUrl = import.meta.env.VITE_APP_BACKEND_URL

const confirmPayment = (event) => {
  confirm.require({
    target: event.currentTarget,
    position: 'right',
    message: 'Apakah Kamu Yakin Ingin Mengkonfirmasi Pembayaran?',
    appendTo: 'body',
    icon: 'fa-regular fa-circle-exclamation',
    acceptLabel: 'Ya, Konfirmasi',
    rejectLabel: 'Batal',
    acceptClass: 'p-button-success p-button-sm !w-32 shadow-lg',
    rejectClass: 'p-button-secondary p-button-sm !w-32 shadow-lg',
    accept: async () => {
      const formData = new FormData()
      formData.append('id', payment.value.id)

      await paymentStore.confirmPayment(formData)
    },
  })
}
</script>
<template>
  <AdminLayouts>
    <ConfirmPopup
      :appendTo="'body'"
      :position="'topleft'"
      :pt="{
        root: {
          class: '!rounded-lg !shadow-lg !text-sm',
        },
      }"
    />
    <div class="py-3 grid grid-cols-3 gap-5" v-if="payment">
      <div class="col-span-2">
        <div class="rounded-lg bg-white shadow px-5 pb-3 pt-5 w-full">
          <div class="flex items-center justify-between border-b border-gray-300 pb-3">
            <div>
              <p class="font-semibold text-lg">Detail Pembayaran</p>
              <p class="text-xs text-gray-500">Kode Referensi : {{ payment?.reference_code }}</p>
            </div>
            <div>
              <p
                :class="
                  payment?.status == 'UNPAID' || payment?.status == 'PENDING'
                    ? 'border-gray-500 text-gray-500 bg-gray-100'
                    : payment?.status == 'SUCCESS'
                      ? 'border-green-500 text-green-500 bg-green-100'
                      : payment?.status == 'FAILED'
                        ? 'border-red-500 text-red-500 bg-red-100'
                        : ''
                "
                class="border px-3 py-1 rounded-lg text-xs"
              >
                {{
                  payment?.status == 'UNPAID'
                    ? 'Belum Dibayar'
                    : payment?.status == 'PENDING'
                      ? 'Pending'
                      : payment?.status == 'SUCCESS'
                        ? 'Sudah Dibayar'
                        : payment?.status == 'FAILED'
                          ? 'Pembayaran Gagal'
                          : ''
                }}
              </p>
            </div>
          </div>
          <div class="space-y-3 mt-3">
            <div
              v-for="(item, index) in payment?.details"
              :key="index"
              class="border border-gray-300 rounded-lg shadow px-5 py-3"
            >
              <div class="flex justify-between items-center">
                <div>
                  <p>
                    {{ item?.bill?.member?.name }}
                  </p>
                  <p class="text-xs">
                    {{
                      item?.bill?.bill_type == 'registration'
                        ? 'Biaya Pendaftaran'
                        : 'Iuran Bulanan'
                    }}
                  </p>
                </div>
                <div>
                  <p>
                    {{
                      Number(item?.bill?.amount || 0).toLocaleString('id-ID', {
                        style: 'currency',
                        currency: 'IDR',
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      })
                    }}
                  </p>
                </div>
              </div>
            </div>
            <div class="border border-gray-300 rounded-lg shadow px-5 py-3">
              <div class="flex justify-between items-center">
                <p class="font-bold">Total</p>
                <p class="font-bold">
                  {{
                    Number(payment?.total_amount || 0).toLocaleString('id-ID', {
                      style: 'currency',
                      currency: 'IDR',
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    })
                  }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div class="rounded-lg bg-white shadow px-5 pb-3 pt-5 w-full">
          <div class="border-b border-gray-300 pb-3">
            <p class="font-semibold text-lg">Bukti Pembayaran</p>
          </div>
          <div class="space-y-3 py-3 border-b border-gray-300">
            <Image
              :src="
                backendUrl + 'storage/files/payment/' + payment?.parent_id + '/' + payment?.file
              "
              alt="Bukti Pembayaran"
              class="w-full"
              preview
            />
          </div>
          <div class="flex gap-3 justify-end pt-3">
            <button
              @click="confirmPayment"
              v-if="payment?.status == 'PENDING'"
              class="text-green-500 border border-green-500 bg-green-100 rounded-lg px-3 py-2 w-full text-sm hover:opacity-90 duration-300 transition-all cursor-pointer"
            >
              Konfirmasi Pembayaran
            </button>
          </div>
        </div>
      </div>
    </div>
  </AdminLayouts>
</template>
