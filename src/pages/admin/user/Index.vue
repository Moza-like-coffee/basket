<script setup>
import AdminLayouts from '@/layouts/AdminLayouts.vue'
import { Column, DataTable } from 'primevue'
import { ref, onMounted, computed } from 'vue'
import { FilterMatchMode } from '@primevue/core/api'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import ConfirmPopup from 'primevue/confirmpopup'
import { useConfirm } from 'primevue/useconfirm'
import { useToast } from 'primevue/usetoast'

const router = useRouter()
const userStore = useUserStore()
const confirm = useConfirm()
const toast = useToast()

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
    message: 'Apakah kamu yakin ingin menghapus user ini?',
    icon: 'pi pi-exclamation-triangle text-yellow-500',
    acceptLabel: 'Ya, Hapus',
    rejectLabel: 'Batal',
    acceptClass: 'p-button-danger p-button-sm',
    rejectClass: 'p-button-secondary p-button-sm',
    accept: async () => {
      try {
        const res = await userStore.destroy(id)
        console.log('destroy response:', res)
        await userStore.getAll()

        toast.add({
          severity: 'success',
          summary: 'Berhasil',
          detail: 'User telah dihapus.',
          life: 2000,
        })
      } catch (err) {
        console.error('Gagal menghapus user:', err)

        toast.add({
          severity: 'error',
          summary: 'Gagal',
          detail: 'Terjadi kesalahan saat menghapus user. Cek console/network.',
          life: 3000,
        })
      }
    },
    reject: () => {
      toast.add({
        severity: 'info',
        summary: 'Dibatalkan',
        detail: 'Aksi dibatalkan.',
        life: 1500,
      })
    },
  })
}
</script>


<template>
  <AdminLayouts>
    <div class="py-3 space-y-3">
      <ConfirmPopup />
      <Toast />

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
                  @click="confirmDelete($event, data.id)"
                  class="cursor-pointer text-rhino-950 hover:text-red-600 transition-colors duration-200"
                  v-tooltip.left="{ value: 'Hapus', showDelay: 1000, hideDelay: 300 }"
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
