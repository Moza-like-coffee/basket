<script setup>
import { Column, DataTable, IconField, InputIcon, InputText } from 'primevue'
import { computed, onMounted, ref } from 'vue'
import { FilterMatchMode } from '@primevue/core/api'
import { useRouter } from 'vue-router'
import { useBillStore } from '@/stores/bill'
import { usePaymentStore } from '@/stores/payment'
import { useResponseStore } from '@/stores/response'
import AdminLayouts from '@/layouts/AdminLayouts.vue'

const billStore = useBillStore()
const responseStore = useResponseStore()

const datas = ref([])
const loading = ref(true)

async function fetchData() {
  datas.value = billStore.datas.filter((data) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const dueDate = new Date(data.due_date)
    dueDate.setHours(0, 0, 0, 0)

    return data.status === 'UNPAID' && dueDate >= today
  })
  loading.value = false
}

onMounted(async () => {
  const withVariable = 'member'
  await billStore.get(withVariable)
  fetchData()
})
</script>
<template>
  <AdminLayouts>
    <div class="py-3 space-y-3">
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
