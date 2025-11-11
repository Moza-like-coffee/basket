<script setup>
import MemberLayouts from '@/layouts/MemberLayouts.vue'
import { usePaymentStore } from '@/stores/payment'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import QRISImage from '@/assets/images/payment/QRIS.jpg'
import Dialog from 'primevue/dialog'

const route = useRoute()
const paymentStore = usePaymentStore()
const payment = ref()
const dialogPayment = ref(false)

const form = ref({
  payment_method: '',
  file: null,
})

onMounted(async () => {
  await paymentStore.show(route.params.id)
  payment.value = paymentStore.data
})

const handleUploadFile = (event) => {
  const file = event.target.files[0]
  if (file) {
    form.value.file = file
  }
}

async function submit() {
  const formData = new FormData()
  formData.append('id', payment.value.id)
  formData.append('payment_method', form.value.payment_method)
  formData.append('file', form.value.file)

  await paymentStore.post(formData)
}
</script>
<template>
  <MemberLayouts>
    <div
      class="py-3"
      :class="payment?.status == 'UNPAID' ? 'grid grid-cols-3 gap-5' : ''"
      v-if="payment"
    >
      <div class="md:col-span-2 col-span-3">
        <div class="rounded-lg bg-white shadow px-5 pb-3 pt-5 w-full">
          <div class="flex items-center justify-between border-b border-gray-300 pb-3">
            <div>
              <p class="font-semibold md:text-lg text-base">Detail Pembayaran</p>
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
                  <p class="md:text-base text-sm">
                    {{ item?.bill?.member?.name }}
                  </p>
                  <p class="text-xs">
                    {{
                      item?.bill?.bill_type == 'registration'
                        ? 'Biaya Pendaftaran'
                        : 'Iuran Bulanan'
                    }}
                  </p>
                  <p v-if="item?.bill?.bill_type == 'monthly'" class="text-xs text-gray-500">
                    Periode
                    {{
                      new Date(item?.bill?.period_from).toLocaleDateString('id-ID', {
                        year: 'numeric',
                        month: 'long',
                      })
                    }}
                  </p>
                </div>
                <div>
                  <p class="md:text-base text-sm">
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
                <p class="font-bold md:text-base text-sm">Total</p>
                <p class="font-bold md:text-base text-sm">
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
      <div v-if="payment?.status == 'UNPAID'" class="md:col-span-1 col-span-3">
        <div class="rounded-lg bg-white shadow px-5 pb-3 pt-5 w-full">
          <div class="border-b border-gray-300 pb-3">
            <p class="font-semibold md:text-lg text-base">Informasi Pembayaran</p>
          </div>
          <div class="space-y-3 py-3 border-b border-gray-300">
            <div>
              <select
                v-model="form.payment_method"
                class="px-2.5 py-2 border border-gray-300 rounded-lg shadow text-xs md:text-sm w-full focus:outline-1 focus:outline-gray-500"
              >
                <option value="" disabled>Pilih Metode Pembayaran</option>
                <option value="transfer">Transfer</option>
                <option value="qris">QRIS</option>
              </select>
            </div>
            <div class="space-y-3" v-if="form.payment_method == 'transfer'">
              <div
                class="text-xs md:text-sm flex justify-between border rounded-lg p-3 border-gray-300"
              >
                <p>Bank BCA</p>
                <p>376123123</p>
              </div>
              <div
                class="text-xs md:text-sm flex justify-between border rounded-lg p-3 border-gray-300"
              >
                <p>Bank BRI</p>
                <p>376123123</p>
              </div>
              <div
                class="text-xs md:text-sm flex justify-between border rounded-lg p-3 border-gray-300"
              >
                <p>Bank BNI</p>
                <p>376123123</p>
              </div>
              <div
                class="text-xs md:text-sm flex justify-between border rounded-lg p-3 border-gray-300"
              >
                <p>Bank BSI</p>
                <p>376123123</p>
              </div>
            </div>
            <div
              v-if="form.payment_method == 'qris'"
              class="text-xs md:text-sm flex justify-between border rounded-lg p-3 border-gray-300"
            >
              <img :src="QRISImage" alt="" class="w-full" />
            </div>
          </div>
          <div class="flex gap-3 justify-end pt-3">
            <button
              @click="dialogPayment = true"
              v-if="payment?.status == 'UNPAID' && form.payment_method !== ''"
              class="text-green-500 border border-green-500 bg-green-100 rounded-lg px-3 py-2 w-full text-xs md:text-sm hover:opacity-90 duration-300 transition-all cursor-pointer"
            >
              Saya Sudah Membayar
            </button>

            <Dialog
              v-model:visible="dialogPayment"
              modal
              header="Upload Bukti Pembayaran"
              :style="{ width: '25rem' }"
              :pt="{
                title: {
                  class: '!text-lg',
                },
                header: {
                  class: '!py-2 border-b border-gray-200',
                },
                content: {
                  class: '!py-3',
                },
              }"
            >
              <form class="space-y-3" @submit.prevent="submit">
                <div>
                  <input
                    id="form-family-card"
                    type="file"
                    accept="image/*"
                    class="px-2.5 py-2 border border-gray-300 shadow text-xs md:text-sm rounded-lg w-full focus:outline-1 focus:outline-gray-500 cursor-pointer"
                    @change="handleUploadFile"
                    required
                  />
                </div>
                <button
                  type="submit"
                  class="w-full text-xs md:text-sm bg-piper-600 text-white rounded-lg px-5 py-2 font-light cursor-pointer hover:opacity-90 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Simpan
                </button>
              </form>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  </MemberLayouts>
</template>
