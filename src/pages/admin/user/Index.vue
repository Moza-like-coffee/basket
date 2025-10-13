<script setup>
import AdminLayouts from '@/layouts/AdminLayouts.vue'
import { Column, DataTable } from 'primevue'
import { ref, onMounted, computed } from 'vue'
import { FilterMatchMode } from '@primevue/core/api'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
})

const users = computed(() => userStore.datas)
const loading = computed(() => {
  return users.value.length === 0
})

onMounted(async () => {
  await userStore.getAll()
})

async function removeUser(id) {
  if (!confirm('Yakin ingin menghapus user ini?')) return
  await userStore.destroy(id)
}
</script>

<template>
  <AdminLayouts>
    <div class="py-3 space-y-3">
      <!-- Header -->
      <div class="rounded-lg bg-white shadow px-5 py-3">
        <div class="flex justify-between items-center">
          <router-link
            :to="{ name: 'admin.user.create' }"
            class="text-sm bg-piper-600 text-white rounded-lg px-5 py-2 font-light cursor-pointer hover:opacity-90 transition-all duration-300 shadow-lg"
          >
            Tambah User Baru +
          </router-link>

          <input
            type="text"
            v-model="filters['global'].value"
            placeholder="Cari user..."
            class="border border-gray-300 rounded-lg px-2.5 py-2 text-sm focus:outline-0 shadow-lg"
          />
        </div>
      </div>

      <!-- Table -->
      <div class="!rounded-lg !overflow-hidden shadow bg-white">
        <DataTable
          v-model:filters="filters"
          :value="users"
          paginator
          :rows="10"
          dataKey="id"
          :loading="loading"
          :pt="{
            thead: { class: 'text-sm font-light' },
            tbody: { class: 'text-sm font-light' },
            pcPaginator: { content: { class: 'text-xs' } },
          }"
        >
          <Column field="name" header="Nama" />
          <Column field="username" header="Username" />
          <Column field="email" header="Email" />
          <Column field="role" header="Role" />

          <Column header="">
            <template #body="{ data }">
              <div class="flex justify-center gap-3">
                <button
                  @click="router.push({ name: 'admin.user.edit', params: { id: data.id } })"
                  class="cursor-pointer text-rhino-950"
                  v-tooltip.left="{ value: 'Edit', showDelay: 1000, hideDelay: 300 }"
                >
                  <i class="fa-solid fa-pen"></i>
                </button>

                <button
                  @click="removeUser(data.id)"
                  class="cursor-pointer text-rhino-950"
                  v-tooltip.left="{ value: 'Delete', showDelay: 1000, hideDelay: 300 }"
                >
                  <i class="fa-solid fa-trash"></i>
                </button>
              </div>
            </template>
          </Column>

          <template #empty>
            <div class="text-center text-sm">
              <p>Tidak ada user ditemukan.</p>
            </div>
          </template>

          <template #loading>
            <div class="text-center text-sm">
              <p>Memuat data user...</p>
            </div>
          </template>
        </DataTable>
      </div>
    </div>
  </AdminLayouts>
</template>
