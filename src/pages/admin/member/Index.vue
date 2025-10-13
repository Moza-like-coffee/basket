<script setup>
import AdminLayouts from '@/layouts/AdminLayouts.vue'
import { Column, DataTable, IconField, InputIcon, InputText } from 'primevue'
import { onMounted, ref } from 'vue'
import { FilterMatchMode } from '@primevue/core/api'
import { useMemberStore } from '@/stores/member'
import { useRouter } from 'vue-router'

const router = useRouter()
const memberStore = useMemberStore()

const datas = ref([])
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
})
const loading = ref(true)

async function fetchData() {
  datas.value = memberStore.datas
  loading.value = false
}

onMounted(async () => {
  const withVariable = 'file'
  await memberStore.get(withVariable)
  fetchData()
})

async function removeData(id) {
  await memberStore.destroy(id)
  fetchData()
}
</script>
<template>
  <adminLayouts>
    <div class="py-3 space-y-3">
      <div class="rounded-lg bg-white shadow px-5 py-3">
        <div>
          <div class="flex justify-between items-center">
            <div>
              <router-link
                :to="{ name: 'admin.member.create' }"
                class="text-sm bg-piper-600 text-white rounded-lg px-5 py-2 font-light cursor-pointer hover:opacity-90 transition-all duration-300 shadow-lg"
              >
                Tambahkan Member Baru +
              </router-link>
            </div>
            <div>
              <input
                type="text"
                v-model="filters['global'].value"
                placeholder="Cari...."
                class="border border-gray-300 rounded-lg px-2.5 py-2 text-sm focus:outline-0 shadow-lg"
              />
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
          <Column field="name" header="Nama">
            <template #body="{ data }">
              {{ data.name }}
            </template>
          </Column>
          <Column
            field="ku"
            header="KU"
            class="w-20"
            :pt="{
              columnHeaderContent: {
                class: '!justify-center',
              },
            }"
          >
            <template #body="{ data }">
              <p class="text-center">
                {{ new Date(data.date_of_birth).getFullYear() }}
              </p>
            </template>
          </Column>
          <Column
            field="gender"
            header="Jenis Kelamin"
            class="w-40"
            :pt="{
              columnHeaderContent: {
                class: '!justify-center',
              },
            }"
          >
            <template #body="{ data }">
              <p class="text-center">
                {{ data.gender }}
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
            <template #body> </template>
          </Column>
          <Column field="action" header="">
            <template #body="{ data }">
              <div class="flex justify-center gap-3">
                <button
                  @click="
                    router.push({
                      name: 'admin.member.verification',
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
                      name: 'admin.member.edit',
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
                  @click="removeData(data.id)"
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
  </adminLayouts>
</template>
