<script setup>
import { Column, DataTable, useConfirm } from 'primevue'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import ConfirmPopup from 'primevue/confirmpopup'
import { usePaymentStore } from '@/stores/payment'
import AdminLayouts from '@/layouts/AdminLayouts.vue'

const paymentStore = usePaymentStore()
const confirm = useConfirm()

const datas = ref([])
const loading = ref(true)

async function fetchData() {
  datas.value = paymentStore.datas
  loading.value = false
}

onMounted(async () => {
  const withVariable = 'parent'
  await paymentStore.get(withVariable)
  fetchData()
})
</script>

<template>
  <AdminLayouts>
    <ConfirmPopup
      :appendTo="'body'"
      :position="'topleft'"
      :pt="{
        root: {
          class: '!rounded-lg !shadow-lg md:!text-sm text-xs',
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
              class: 'md:text-sm text-xs font-light',
            },
            tbody: {
              class: 'md:text-sm text-xs font-light',
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
          <Column field="reference_code" header="Nama Orang Tua">
            <template #body="{ data }">
              {{ data?.parent?.name }}
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
                    name: 'admin.payment.show',
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
            <div class="text-center md:text-sm text-xs">
              <p>Tidak ada data ditemukan.</p>
            </div>
          </template>
          <template #loading>
            <div class="text-center md:text-sm text-xs">
              <p>Mohon Tunggu, Sedang Memuat Data.......</p>
            </div>
          </template>
        </DataTable>
      </div>
    </div>
  </AdminLayouts>
</template>
