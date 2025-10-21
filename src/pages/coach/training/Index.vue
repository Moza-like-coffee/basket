<script setup>
import CoachLayouts from '@/layouts/CoachLayouts.vue'
import { DataTable, Column, Dialog, ConfirmPopup, useConfirm } from 'primevue'
import { ref, computed, onMounted } from 'vue'
import { useTrainingStore } from '@/stores/training'
import { useToast } from 'primevue/usetoast'
import { FilterMatchMode } from '@primevue/core/api'

const toast = useToast()
const confirm = useConfirm()
const trainingStore = useTrainingStore()

const datas = ref([])
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
})
const loading = ref(true)
const saving = ref(false)
const visible = ref(false)
const selectedItem = ref(null)
const formErrors = ref({})

const schedules = computed(() =>
  trainingStore.schedules
    .map(schedule => ({
      label: new Date(schedule.date).toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      value: schedule.id,
      ...schedule,
    }))
    .sort((a, b) => new Date(b.date) - new Date(a.date))
)

async function fetchData() {
  loading.value = true
  try {
    await trainingStore.fetchSchedules()
    datas.value = trainingStore.schedules
  } catch (err) {
    console.error(err)
    toast.add({
      severity: 'error',
      summary: 'Gagal memuat data jadwal',
      life: 3000,
    })
  } finally {
    loading.value = false
  }
}

onMounted(fetchData)

function openDialog(item = null) {
  selectedItem.value = item
    ? { ...item }
    : { title: '', date: '' }
  formErrors.value = {}
  visible.value = true
}

function closeDialog() {
  visible.value = false
  selectedItem.value = null
  formErrors.value = {}
}

async function saveSchedule() {
  formErrors.value = {}
  
  // Validasi form
  if (!selectedItem.value.title?.trim()) {
    formErrors.value.title = 'Judul jadwal wajib diisi'
  }
  if (!selectedItem.value.date) {
    formErrors.value.date = 'Tanggal wajib diisi'
  }
  
  if (Object.keys(formErrors.value).length > 0) {
    return
  }

  saving.value = true
  try {
    if (selectedItem.value.id) {
      await trainingStore.update(selectedItem.value.id, {
        title: selectedItem.value.title,
        date: selectedItem.value.date
      })
      toast.add({ 
        severity: 'success', 
        summary: 'Berhasil!', 
        detail: 'Jadwal berhasil diupdate',
        life: 3000 
      })
    } else {
      await trainingStore.create({
        title: selectedItem.value.title,
        date: selectedItem.value.date
      })
      toast.add({ 
        severity: 'success', 
        summary: 'Berhasil!', 
        detail: 'Jadwal berhasil ditambahkan',
        life: 3000 
      })
    }
    fetchData()
    closeDialog()
  } catch (err) {
    console.error(err)
    if (err.response?.data?.errors) {
      const errors = err.response.data.errors
      Object.keys(errors).forEach(key => {
        formErrors.value[key] = errors[key][0]
      })
    } else {
      toast.add({ 
        severity: 'error', 
        summary: 'Error', 
        detail: 'Gagal menyimpan jadwal',
        life: 3000 
      })
    }
  } finally {
    saving.value = false
  }
}

const confirmDelete = (event, id) => {
  confirm.require({
    target: event.currentTarget,
    position: 'right',
    message: 'Apakah kamu yakin ingin menghapus jadwal ini?',
    icon: 'fa-regular fa-circle-exclamation',
    acceptLabel: 'Ya, Hapus',
    rejectLabel: 'Batal',
    acceptClass: 'p-button-danger p-button-sm !w-24 shadow-lg',
    rejectClass: 'p-button-secondary p-button-sm !w-24 shadow-lg',
    accept: async () => {
      try {
        await trainingStore.destroy(id)
        toast.add({
          severity: 'success',
          summary: 'Berhasil!',
          detail: 'Jadwal berhasil dihapus',
          life: 3000,
        })
        fetchData()
      } catch (err) {
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Gagal menghapus jadwal',
          life: 3000,
        })
      }
    },
  })
}

// Format tanggal untuk tampilan
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>

<template>
  <CoachLayouts>
    <ConfirmPopup
      :appendTo="'body'"
      :pt="{
        root: { class: '!rounded-lg !shadow-lg !text-sm' },
      }"
    />

    <div class="py-3 space-y-3">
      <!-- HEADER -->
      <div class="rounded-lg bg-white shadow px-5 py-3">
        <div class="flex justify-between items-center">
          <button
            @click="openDialog()"
            class="flex items-center gap-2 text-sm bg-piper-600 text-white rounded-lg px-5 py-2.5 font-medium cursor-pointer hover:bg-piper-700 transition-all duration-300 shadow-lg"
          >
            <i class="fa-solid fa-plus"></i>
            Tambah Jadwal
          </button>
          <div class="relative">
            <i class="fa-solid fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            <input
              type="text"
              v-model="filters['global'].value"
              placeholder="Cari jadwal..."
              class="border border-gray-300 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-piper-500 focus:border-transparent shadow-lg w-64"
            />
          </div>
        </div>
      </div>

      <!-- TABLE -->
      <div class="!rounded-lg !overflow-hidden shadow bg-white">
        <DataTable
          v-model:filters="filters"
          :value="datas"
          paginator
          :rows="10"
          dataKey="id"
          :loading="loading"
          :pt="{
            thead: { class: 'text-sm font-light bg-gray-50' },
            tbody: { class: 'text-sm font-light' },
            pcPaginator: { content: { class: 'text-xs' } },
          }"
        >
          <Column field="title" header="Judul Jadwal" class="min-w-48">
            <template #body="{ data }">
              <div class="font-medium text-gray-900">{{ data.title }}</div>
            </template>
          </Column>
          
          <Column field="date" header="Tanggal" class="min-w-48">
            <template #body="{ data }">
              <div class="text-gray-700">{{ formatDate(data.date) }}</div>
            </template>
          </Column>
         
          <Column field="action" header="Aksi" class="w-32">
            <template #body="{ data }">
              <div class="flex justify-center gap-2">
                <button
                  @click="openDialog(data)"
                  v-tooltip.left="{ value: 'Edit', showDelay: 500, hideDelay: 300 }"
                  class="cursor-pointer text-rhino-950"
                >
                  <i class="fa-solid fa-pen text-sm"></i>
                </button>
                <button
                  @click="confirmDelete($event, data.id)"
                  v-tooltip.left="{ value: 'Hapus', showDelay: 500, hideDelay: 300 }"
                  class="cursor-pointer text-rhino-950"
                >
                  <i class="fa-solid fa-trash text-sm"></i>
                </button>
              </div>
            </template>
          </Column>

          <template #empty>
            <div class="text-center py-8">
              <i class="fa-regular fa-calendar-xmark text-4xl text-gray-300 mb-3"></i>
              <div class="text-gray-500 text-sm">Tidak ada jadwal ditemukan.</div>
            </div>
          </template>
          
          <template #loading>
            <div class="text-center py-6">
              <span class="text-sm text-gray-600">Memuat data jadwal...</span>
            </div>
          </template>
        </DataTable>
      </div>
    </div>

    <!-- DIALOG FORM - IMPROVED -->
    <Dialog
      v-model:visible="visible"
      :header="selectedItem?.id ? 'Edit Jadwal Latihan' : 'Tambah Jadwal Latihan'"
      modal
      class="w-full max-w-md"
      :breakpoints="{ '960px': '75vw', '641px': '90vw' }"
      :pt="{
        root: { class: '!rounded-xl' },
        content: { class: 'pt-4' }
      }"
    >
      <div class="space-y-4">
        <!-- Judul Jadwal -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Judul Jadwal <span class="text-red-500">*</span>
          </label>
          <input
            v-model="selectedItem.title"
            placeholder="Masukkan judul jadwal latihan"
            :class="[
              'border rounded-lg px-4 py-3 w-full transition-all duration-200 focus:outline-none focus:ring-2',
              formErrors.title 
                ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                : 'border-gray-300 focus:ring-piper-500 focus:border-piper-500'
            ]"
          />
          <div v-if="formErrors.title" class="text-red-500 text-xs mt-1 flex items-center gap-1">
            <i class="fa-solid fa-circle-exclamation"></i>
            {{ formErrors.title }}
          </div>
        </div>

        <!-- Tanggal -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Tanggal <span class="text-red-500">*</span>
          </label>
          <input
            v-model="selectedItem.date"
            type="date"
            :class="[
              'border rounded-lg px-4 py-3 w-full transition-all duration-200 focus:outline-none focus:ring-2',
              formErrors.date 
                ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                : 'border-gray-300 focus:ring-piper-500 focus:border-piper-500'
            ]"
          />
          <div v-if="formErrors.date" class="text-red-500 text-xs mt-1 flex items-center gap-1">
            <i class="fa-solid fa-circle-exclamation"></i>
            {{ formErrors.date }}
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <button 
            @click="closeDialog" 
            :disabled="saving"
            class="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors duration-200 font-medium disabled:opacity-50"
          >
            Batal
          </button>
          <button
            @click="saveSchedule"
            :disabled="saving"
            class="px-5 py-2.5 rounded-lg bg-piper-600 text-white hover:bg-piper-700 transition-colors duration-200 font-medium disabled:opacity-50 flex items-center gap-2"
          >
            <i v-if="saving" class="fa-solid fa-spinner fa-spin"></i>
            <i v-else class="fa-solid fa-check"></i>
            {{ saving ? 'Menyimpan...' : (selectedItem?.id ? 'Update' : 'Simpan') }}
          </button>
        </div>
      </div>
    </Dialog>
  </CoachLayouts>
</template>

<style scoped>
/* Custom scrollbar untuk tabel */
:deep(.p-datatable-wrapper) {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 #f1f5f9;
}

:deep(.p-datatable-wrapper)::-webkit-scrollbar {
  height: 6px;
  width: 6px;
}

:deep(.p-datatable-wrapper)::-webkit-scrollbar-track {
  background: #f1f5f9;
}

:deep(.p-datatable-wrapper)::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

:deep(.p-datatable-wrapper)::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>