<script setup>
import CoachLayouts from '@/layouts/CoachLayouts.vue'
import { DataTable, Column, Dialog, ConfirmPopup, useConfirm } from 'primevue'
import { ref, computed, onMounted } from 'vue'
import { useTrainingStore } from '@/stores/training'
import { useMemberStore } from '@/stores/member'
import { FilterMatchMode } from '@primevue/core/api'

const toast = useToast()
const confirm = useConfirm()
const trainingStore = useTrainingStore()

const datas = ref([])
const members = ref([])
const availableKUs = ref([])

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
  if (!form.value.title || !form.value.date || !form.value.ku) {
    alert('Harap lengkapi semua field yang wajib diisi!')
    return
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
    <Dialog v-model:visible="visible" :header="form?.id ? 'Edit Jadwal Latihan' : 'Tambah Jadwal Latihan'" modal
      class="w-full max-w-2xl" :breakpoints="{ '960px': '75vw', '641px': '90vw' }" :pt="{
        root: { class: '!rounded-xl' },
        content: { class: 'pt-4' },
      }">
      <div class="space-y-4">
        <!-- Judul Jadwal -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Judul Jadwal <span class="text-red-500">*</span>
          </label>
          <input v-model="form.title"
            class="px-2.5 py-2 border border-gray-300 shadow text-sm rounded-lg w-full focus:outline-1 focus:outline-gray-500"
            placeholder="Masukkan Judul" />
        </div>

        <!-- Tanggal -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Tanggal <span class="text-red-500">*</span>
          </label>
          <input v-model="form.date"
            class="px-2.5 py-2 border border-gray-300 shadow text-sm rounded-lg w-full focus:outline-1 focus:outline-gray-500"
            type="date" />
        </div>

        <!-- KU Selection -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Kelompok Umur (KU) <span class="text-red-500">*</span>
          </label>
          <Dropdown v-model="selectedKU" :options="availableKUs" optionLabel="" placeholder="Pilih KU" class="w-full"
            @change="onKUChange($event.value)" :pt="{
              root: { class: 'w-full' },
              input: { class: 'w-full text-sm py-2 px-2.5' }
            }">
            <template #value="slotProps">
              <span v-if="slotProps.value">{{ slotProps.value }}</span>
              <span v-else class="text-gray-400">Pilih KU</span>
            </template>
            <template #option="slotProps">
              <span>{{ slotProps.option }}</span>
            </template>
          </Dropdown>
          <p class="text-xs text-gray-500 mt-1">Pilih Kelompok Umur untuk menampilkan daftar member</p>
        </div>

        <!-- Member Selection -->
        <div v-if="selectedKU">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Pilih Member
          </label>
          
          <!-- Select All Checkbox -->
          <div v-if="filteredMembers.length > 0" class="mb-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div class="flex items-center space-x-3">
              <input type="checkbox" id="select-all" v-model="selectAllChecked" @change="toggleSelectAll"
                class="rounded border-gray-300 text-piper-600 focus:ring-piper-500" />
              <label for="select-all" class="flex-1 text-sm font-medium cursor-pointer">
                <span class="text-rhino-800">Pilih Semua Member</span>
                <span class="text-gray-500 text-xs ml-2">({{ filteredMembers.length }} member aktif tersedia)</span>
              </label>
            </div>
          </div>

          <div class="max-h-40 overflow-y-auto border border-gray-300 rounded-lg p-2">
            <div v-if="filteredMembers.length === 0" class="text-center text-gray-500 py-4">
              <i class="fa-solid fa-users-slash text-xl mb-2"></i>
              <p class="text-sm">Tidak ada member aktif untuk KU {{ selectedKU }}</p>
            </div>
            <div v-else class="space-y-2">
              <div v-for="member in filteredMembers" :key="member.id"
                class="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded">
                <input type="checkbox" :id="`member-${member.id}`" :value="member.id" v-model="form.member_ids"
                  class="rounded border-gray-300 text-piper-600 focus:ring-piper-500" />
                <label :for="`member-${member.id}`" class="flex-1 text-sm cursor-pointer">
                  <div class="font-medium">{{ member.name }}</div>
                  <div class="text-xs text-gray-500">
                    {{ member.gender }} • Status: <span class="text-green-600 font-medium">Aktif</span>
                  </div>
                </label>
              </div>
            </div>
          </div>
          
          <div v-if="form.member_ids?.length" class="mt-2 p-3 bg-piper-200 rounded-lg">
            <p class="text-sm font-medium text-rhino-800">
              Terpilih: {{ form.member_ids.length }} dari {{ filteredMembers.length }} member aktif
            </p>
            <p class="text-xs text-rhino-600 mt-1 truncate">{{ getSelectedMemberNames }}</p>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <button @click="closeDialog" :disabled="saving"
            class="text-sm bg-gray-200 rounded-lg px-5 py-2 font-medium cursor-pointer hover:opacity-90 transition-all duration-300 shadow-lg w-34">
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
