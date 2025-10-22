<script setup>
import CoachLayouts from '@/layouts/CoachLayouts.vue'
import { DataTable, Column, Dialog, ConfirmPopup, useConfirm } from 'primevue'
import { ref, computed, onMounted } from 'vue'
import { useTrainingStore } from '@/stores/training'
import { FilterMatchMode } from '@primevue/core/api'

const confirm = useConfirm()
const trainingStore = useTrainingStore()
const datas = ref([])

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
})

const loading = ref(true)
const saving = ref(false)
const visible = ref(false)
const form = ref(null)

async function fetchData() {
  datas.value = trainingStore.datas
}

onMounted(async () => {
  loading.value = true
  await trainingStore.get()
  loading.value = false
  fetchData()
})

function openDialog(item = null) {
  form.value = item ? { ...item } : { title: '', date: '' }
  visible.value = true
}

function closeDialog() {
  visible.value = false
  form.value = null
}

async function saveSchedule() {
  saving.value = true
  if (form.value.id) {
    await trainingStore.update(form.value.id, {
      title: form.value.title,
      date: form.value.date,
    })
  } else {
    await trainingStore.create({
      title: form.value.title,
      date: form.value.date,
    })
  }
  saving.value = false
  fetchData()
  closeDialog()
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
      await trainingStore.destroy(id)
      fetchData()
    },
  })
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
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

          <Column field="action" header="" class="w-32">
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
      :header="form?.id ? 'Edit Jadwal Latihan' : 'Tambah Jadwal Latihan'"
      modal
      class="w-full max-w-md"
      :breakpoints="{ '960px': '75vw', '641px': '90vw' }"
      :pt="{
        root: { class: '!rounded-xl' },
        content: { class: 'pt-4' },
      }"
    >
      <div class="space-y-3">
        <!-- Judul Jadwal -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Judul Jadwal <span class="text-red-500">*</span>
          </label>
          <input
            v-model="form.title"
            class="px-2.5 py-2 border border-gray-300 shadow text-sm rounded-lg w-full focus:outline-1 focus:outline-gray-500"
            placeholder="Masukkan Judul"
          />
        </div>

        <!-- Tanggal -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Tanggal <span class="text-red-500">*</span>
          </label>
          <input
            v-model="form.date"
            class="px-2.5 py-2 border border-gray-300 shadow text-sm rounded-lg w-full focus:outline-1 focus:outline-gray-500"
            type="date"
          />
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <button
            @click="closeDialog"
            :disabled="saving"
            class="text-sm bg-gray-200 rounded-lg px-5 py-2 font-medium cursor-pointer hover:opacity-90 transition-all duration-300 shadow-lg w-34"
          >
            Batal
          </button>
          <button
            @click="saveSchedule"
            :disabled="saving"
            class="text-sm bg-piper-600 text-white rounded-lg px-5 py-2 cursor-pointer hover:opacity-90 transition-all duration-300 shadow-lg w-34 font-medium flex items-center gap-2 justify-center"
          >
            <i v-if="saving" class="fa-solid fa-spinner fa-spin"></i>
            <i v-else class="fa-solid fa-check"></i>
            <p>
              {{ saving ? 'Menyimpan...' : form?.id ? 'Update' : 'Simpan' }}
            </p>
          </button>
        </div>
      </div>
    </Dialog>
  </CoachLayouts>
</template>
