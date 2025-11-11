<script setup>
import AdminLayouts from '@/layouts/AdminLayouts.vue'
import { Column, DataTable } from 'primevue'
import { ref, onMounted, computed } from 'vue'
import { FilterMatchMode } from '@primevue/core/api'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import ConfirmPopup from 'primevue/confirmpopup'
import { useConfirm } from 'primevue/useconfirm'

const router = useRouter()
const userStore = useUserStore()
const confirm = useConfirm()

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
})

const users = computed(() => userStore.datas)
const loading = computed(() => users.value.length === 0)

onMounted(async () => {
  await userStore.getAll()
})

const confirmDelete = (event, id) => {
  confirm.require({
    target: event.currentTarget,
    position: 'right',
    message: 'Apakah Kamu Yakin Ingin Menghapus Data Ini?',
    appendTo: 'body',
    icon: 'fa-regular fa-circle-exclamation',
    acceptLabel: 'Ya, Hapus',
    rejectLabel: 'Batal',
    acceptClass: 'p-button-danger p-button-sm !w-24 shadow-lg',
    rejectClass: 'p-button-secondary p-button-sm !w-24 shadow-lg',
    accept: async () => {
      await userStore.destroy(id)
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
    <div class="py-3 space-y-3">
      <!-- Header -->
      <div class="rounded-lg bg-white shadow px-5 py-3">
        <div class="flex justify-between items-center">
          <router-link
            :to="{ name: 'admin.user.create' }"
            class="md:text-sm text-xs bg-piper-600 text-white rounded-lg px-5 py-2 font-light cursor-pointer hover:opacity-90 transition-all duration-300 shadow-lg"
          >
            Tambah +
          </router-link>

          <input
            type="text"
            v-model="filters['global'].value"
            placeholder="Cari user..."
            class="border border-gray-300 rounded-lg px-2.5 py-2 md:text-sm text-xs focus:outline-0 shadow-lg"
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
            thead: { class: 'md:text-sm text-xs font-light' },
            tbody: { class: 'md:text-sm text-xs font-light' },
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
                <div>
                  <button
                    @click="router.push({ name: 'admin.user.edit', params: { id: data.id } })"
                    class="cursor-pointer text-rhino-950"
                    v-tooltip.left="{ value: 'Edit', showDelay: 1000, hideDelay: 300 }"
                  >
                    <i class="fa-solid fa-pen"></i>
                  </button>
                </div>
                <div class="relative inline-block">
                  <button
                    @click="confirmDelete($event, data.id)"
                    class="cursor-pointer text-rhino-950 hover:text-red-600 transition-colors duration-200"
                    v-tooltip.left="{ value: 'Hapus', showDelay: 1000, hideDelay: 300 }"
                  >
                    <i class="fa-solid fa-trash"></i>
                  </button>
                </div>
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
