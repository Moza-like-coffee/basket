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
  } finally {
    loading.value = false
  }
}

onMounted(fetchData)

function openDialog(item = null) {
  selectedItem.value = item
    ? { ...item }
    : { name: '', date: '', time: '', trainer: '', status: 'active' }
  visible.value = true
}

function closeDialog() {
  visible.value = false
  selectedItem.value = null
}

async function saveSchedule() {
  if (!selectedItem.value.name || !selectedItem.value.date || !selectedItem.value.time) {
    return toast.add({
      severity: 'error',
      summary: 'Isi semua data jadwal!',
      life: 3000,
    })
  }

  saving.value = true
  try {
    if (selectedItem.value.id) {
      await trainingStore.update(selectedItem.value.id, selectedItem.value)
      toast.add({ severity: 'success', summary: 'Jadwal berhasil diupdate', life: 3000 })
    } else {
      await trainingStore.create(selectedItem.value)
      toast.add({ severity: 'success', summary: 'Jadwal berhasil ditambahkan', life: 3000 })
    }
    fetchData()
    closeDialog()
  } catch (err) {
    console.error(err)
    toast.add({ severity: 'error', summary: 'Gagal menyimpan jadwal', life: 3000 })
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
          summary: 'Jadwal berhasil dihapus',
          life: 3000,
        })
        fetchData()
      } catch (err) {
        toast.add({
          severity: 'error',
          summary: 'Gagal menghapus jadwal',
          life: 3000,
        })
      }
    },
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
            class="text-sm bg-piper-600 text-white rounded-lg px-5 py-2 font-light cursor-pointer hover:opacity-90 transition-all duration-300 shadow-lg"
          >
            Tambahkan Jadwal +
          </button>
          <input
            type="text"
            v-model="filters['global'].value"
            placeholder="Cari...."
            class="border border-gray-300 rounded-lg px-2.5 py-2 text-sm focus:outline-0 shadow-lg"
          />
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
            thead: { class: 'text-sm font-light' },
            tbody: { class: 'text-sm font-light' },
            pcPaginator: { content: { class: 'text-xs' } },
          }"
        >
          <Column field="name" header="Nama Jadwal" />
          <Column field="date" header="Tanggal" class="w-40">
            <template #body="{ data }">
              {{ new Date(data.date).toLocaleDateString('id-ID') }}
            </template>
          </Column>
       
         
         
          <Column field="action" header="" class="w-32">
            <template #body="{ data }">
              <div class="flex justify-center gap-3">
                <button
                  @click="openDialog(data)"
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
            <div class="text-center text-sm py-6 text-gray-500">Tidak ada jadwal ditemukan.</div>
          </template>
          <template #loading>
            <div class="text-center text-sm py-6">Memuat data jadwal...</div>
          </template>
        </DataTable>
      </div>
    </div>

    <!-- DIALOG FORM -->
    <Dialog
      v-model:visible="visible"
      header="Form Jadwal Latihan"
      modal
      class="w-full max-w-md"
      :breakpoints="{ '960px': '75vw', '641px': '90vw' }"
    >
      <div class="space-y-3">
        <input
          v-model="selectedItem.name"
          placeholder="Nama Jadwal"
          class="border rounded-lg px-3 py-2 w-full"
        />
        <input
          v-model="selectedItem.date"
          type="date"
          placeholder="Tanggal"
          class="border rounded-lg px-3 py-2 w-full"
        />
        <input
          v-model="selectedItem.time"
          type="time"
          placeholder="Jam"
          class="border rounded-lg px-3 py-2 w-full"
        />
        <input
          v-model="selectedItem.trainer"
          placeholder="Nama Pelatih"
          class="border rounded-lg px-3 py-2 w-full"
        />
        <select v-model="selectedItem.status" class="border rounded-lg px-3 py-2 w-full">
          <option value="active">Aktif</option>
          <option value="inactive">Tidak Aktif</option>
        </select>

        <div class="flex justify-end gap-2 pt-2">
          <button @click="closeDialog" class="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200">
            Batal
          </button>
          <button
            @click="saveSchedule"
            :disabled="saving"
            class="px-4 py-2 rounded-lg bg-piper-600 text-white hover:bg-piper-700"
          >
            {{ saving ? 'Menyimpan...' : 'Simpan' }}
          </button>
        </div>
      </div>
    </Dialog>
  </CoachLayouts>
</template>
