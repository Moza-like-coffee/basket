<script setup>
import MemberLayouts from '@/layouts/MemberLayouts.vue'
import { Column, DataTable, useConfirm } from 'primevue'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import ConfirmPopup from 'primevue/confirmpopup'
import { usePaymentStore } from '@/stores/payment'

const router = useRouter()
const paymentStore = usePaymentStore()
const confirm = useConfirm()

const datas = ref([])
const loading = ref(true)

async function fetchData() {
  datas.value = paymentStore.datas
  loading.value = false
}

onMounted(async () => {
  const withVariable = ''
  await paymentStore.getByParentId(withVariable)
  fetchData()
})
</script>

<template>
  <MemberLayouts>
    <ConfirmPopup
      :appendTo="'body'"
      :position="'topleft'"
      :pt="{
        root: {
          class: '!rounded-lg !shadow-lg !text-sm',
        },
      }"
    />
    <div class="py-3 space-y-3">
      <div class="!rounded-lg !overflow-hidden shadow bg-white">
        <DataTable
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
          <Column field="reference_code" header="Kode Pembayaran">
            <template #body="{ data }">
              {{ data.reference_code }}
            </template>
          </Column>
          <Column
            field="total_amount"
            header="Total"
            class="w-40"
            :pt="{
              columnHeaderContent: {
                class: '!justify-center',
              },
            }"
          >
            <template #body="{ data }">
              <p class="text-center">
                {{
                  Number(data.total_amount || 0).toLocaleString('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })
                }}
              </p>
            </template>
          </Column>
          <Column
            field="status"
            header="Status"
            :pt="{
              columnHeaderContent: {
                class: '!justify-center',
              },
            }"
          >
            <template #body="{ data }">
              <div
                class="text-center rounded-lg px-3 py-1 w-min mx-auto whitespace-nowrap border shadow-lg text-xs"
                :class="
                  data?.status == 'UNPAID' || data?.status == 'PENDING'
                    ? 'border-gray-500 text-gray-500 bg-gray-100'
                    : data?.status == 'SUCCESS'
                      ? 'border-green-500 text-green-500 bg-green-100'
                      : data?.status == 'FAILED'
                        ? 'border-red-500 text-red-500 bg-red-100'
                        : ''
                "
              >
                <p>
                  {{
                    data?.status == 'UNPAID'
                      ? 'Belum Dibayar'
                      : data?.status == 'PENDING'
                        ? 'Pending'
                        : data?.status == 'SUCCESS'
                          ? 'Sudah Dibayar'
                          : data?.status == 'FAILED'
                            ? 'Pembayaran Gagal'
                            : ''
                  }}
                </p>
              </div>
            </template>
          </Column>
          <Column field="action" header="">
            <template #body="{ data }">
              <div class="flex justify-center gap-3">
                <router-link
                  :to="{
                    name: 'payment.show',
                    params: {
                      id: data?.id,
                    },
                  }"
                  v-tooltip.left="{ value: 'Show', showDelay: 1000, hideDelay: 300 }"
                  class="cursor-pointer text-rhino-950"
                >
                  <i class="fa-solid fa-eye"></i>
                </router-link>
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
