<script setup>
import MemberLayouts from '@/layouts/MemberLayouts.vue'
import { Column, DataTable, IconField, InputIcon, InputText, Toast, useToast } from 'primevue'
import { computed, onMounted, ref } from 'vue'
import { FilterMatchMode } from '@primevue/core/api'
import { useRouter } from 'vue-router'
import { useBillStore } from '@/stores/bill'
import { usePaymentStore } from '@/stores/payment'

const router = useRouter()
const billStore = useBillStore()
const paymentStore = usePaymentStore()
const toast = useToast()

const datas = ref([])
const payment = ref([])
const loading = ref(true)

const totalAmount = computed(() => {
  return form.value.checkbox.reduce((total, item) => {
    return total + Number(item.amount || 0)
  }, 0)
})

async function fetchData() {
  datas.value = billStore.datas.filter((data) => {
    return data.status == 'UNPAID'
  })
  payment.value = paymentStore.datas.filter((data) => {
    return data.status == 'UNPAID' || data.status == 'PENDING'
  })

  loading.value = false
}

const form = ref({
  checkbox: [],
  payment_method: 'transfer',
})

onMounted(async () => {
  const withVariable = 'member'
  await billStore.getByParentId(withVariable)
  await paymentStore.getByParentId()
  fetchData()
})

async function submit() {
  if (form.value.checkbox.length == 0) {
    toast.add({ severity: 'error', summary: 'Pilih Minimal 1 Tagihan Untuk Membayar', life: 3000 })
  } else {
    await billStore.post(form.value)
  }
}
</script>
<template>
  <MemberLayouts>
    <Toast
      :pt="{
        buttonContainer: {
          class: '!w-[28px] !h-[28px] !flex !items-center !justify-center',
        },
        closeButton: {
          class: '!my-auto',
        },
        messageContent: {
          class: '!items-center',
        },
      }"
    />
    <div class="py-3 space-y-3">
      <div class="rounded-lg bg-white shadow px-5 py-3">
        <div>
          <div class="flex justify-between items-center">
            <div>
              <p class="text-lg">
                {{
                  Number(totalAmount || 0).toLocaleString('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })
                }}
              </p>
            </div>
            <div class="flex gap-3">
              <router-link
                :to="{ name: 'payment.index' }"
                class="text-sm bg-piper-600 text-white rounded-lg px-5 py-2 font-light cursor-pointer hover:opacity-90 transition-all duration-300 shadow-lg relative"
              >
                <div
                  v-if="payment.length > 0"
                  class="absolute bg-red-600 w-5 h-5 rounded-full flex items-center justify-center -top-2 right-2 border border-rhino-900"
                >
                  <p class="text-[10px]">{{ payment.length }}</p>
                </div>
                <p>Riwayat Pembayaran</p>
              </router-link>
              <button
                @click="submit"
                class="text-sm bg-piper-600 text-white rounded-lg px-5 py-2 font-light cursor-pointer hover:opacity-90 transition-all duration-300 shadow-lg"
              >
                Bayar Sekarang
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="!rounded-lg !overflow-hidden shadow bg-white">
        <DataTable
          v-model:filters="filters"
          :value="datas"
          paginator
          :rows="10"
          dataKey="id"
          :loading="loading"
          :pt="{
            thead: {
              class: 'text-sm font-light',
            },
            tbody: {
              class: 'text-sm font-light',
            },
            pcPaginator: {
              content: {
                class: 'text-xs',
              },
            },
          }"
        >
          <Column field="checkbox" header="">
            <template #body="{ data }">
              <div class="flex items-start justify-center">
                <input type="checkbox" v-model="form.checkbox" class="w-5 h-5" :value="data" />
              </div>
            </template>
          </Column>
          <Column field="name" header="Nama Member">
            <template #body="{ data }">
              {{ data?.member?.name }}
            </template>
          </Column>
          <Column
            field="type"
            header="Jenis Tagihan"
            :pt="{
              columnHeaderContent: {
                class: '!justify-center',
              },
            }"
          >
            <template #body="{ data }">
              <p class="text-center">
                {{ data?.bill_type == 'registration' ? 'Biaya Pendaftaran' : 'Iuran Bulanan' }}
              </p>
            </template>
          </Column>
          <Column
            field="amount"
            header="Total Tagihan"
            :pt="{
              columnHeaderContent: {
                class: '!justify-center',
              },
            }"
          >
            <template #body="{ data }">
              <p class="text-center">
                {{
                  Number(data?.amount || 0).toLocaleString('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })
                }}
              </p>
            </template>
          </Column>
          <Column field="action" header="">
            <template #body="{ data }">
              <div class="flex justify-center gap-3">
                <button
                  @click="
                    router.push({
                      name: 'member.verification',
                      params: {
                        id: data.id,
                      },
                    })
                  "
                  v-if="!data?.file"
                  v-tooltip.left="{
                    value: 'Complete Verification',
                    showDelay: 1000,
                    hideDelay: 300,
                  }"
                  class="cursor-pointer text-rhino-950"
                >
                  <i class="fa-solid fa-badge-check"></i>
                </button>
                <button
                  @click="
                    router.push({
                      name: 'member.edit',
                      params: {
                        id: data.id,
                      },
                    })
                  "
                  v-tooltip.left="{ value: 'Edit', showDelay: 1000, hideDelay: 300 }"
                  class="cursor-pointer text-rhino-950"
                >
                  <i class="fa-solid fa-pen"></i>
                </button>
                <button
                  @click="confirmDelete($event, data.id)"
                  v-tooltip.left="{ value: 'Delete', showDelay: 1000, hideDelay: 300 }"
                  class="cursor-pointer text-rhino-950"
                >
                  <i class="fa-solid fa-trash"></i>
                </button>
              </div>
            </template>
          </Column>

          <template #empty>
            <div class="text-center text-sm">
              <p>Tidak ada data ditemukan.</p>
            </div>
          </template>
          <template #loading>
            <div class="text-center text-sm">
              <p>Mohon Tunggu, Sedang Memuat Data.......</p>
            </div>
          </template>
        </DataTable>
      </div>
    </div>
  </MemberLayouts>
</template>
