<script setup>
import CoachLayouts from '@/layouts/CoachLayouts.vue'
import { DataTable, Column, Dialog } from 'primevue'
import { ref, computed, onMounted } from 'vue'
import { useAttendanceStore } from '@/stores/attendance'
import { useTrainingStore } from '@/stores/training'
import { useMemberStore } from '@/stores/member'
import { useUIStore } from '@/stores/ui'
import { QrcodeStream } from 'vue-qrcode-reader'
import { useToast } from 'primevue/usetoast'

const toast = useToast() 

const attendanceStore = useAttendanceStore()
const trainingStore = useTrainingStore()
const memberStore = useMemberStore()

const selectedSchedule = ref('')
const searchQuery = ref('')
const loading = ref(true)
const saving = ref(false)
const showModal = ref(false)
const showQRScanner = ref(false)
const qrError = ref('')

const selectedMember = ref(null)
const formStatus = ref('present')
const formReason = ref('')

const schedules = computed(() =>
  trainingStore.schedules
    .map(schedule => ({
      label: new Date(schedule.date).toLocaleDateString('id-ID', { 
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
      }),
      value: schedule.id,
      date: schedule.date
    }))
    .sort((a, b) => new Date(b.date) - new Date(a.date))
)

const mergedAttendances = computed(() =>
  memberStore.datas.map((member, index) => {
    const attendance = attendanceStore.attendances.find(
      a => a.member_id === member.id && a.training_schedule_id === selectedSchedule.value
    )
    return {
      id: member.id,
      KU: index + 1,
      name: member.name,
      gender: member.gender === 'Laki Laki' ? 'Laki-laki' : member.gender === 'Perempuan' ? 'Perempuan' : 'N/A',
      status: attendance
        ? attendance.status === 'present' ? 'Hadir'
        : attendance.status === 'absent' ? 'Tidak Hadir'
        : attendance.status
        : 'Belum Absen',
      reason: attendance?.reason || '-',
      attendance_id: attendance?.id || null
    }
  })
)

const filteredAttendances = computed(() => {
  if (!searchQuery.value) return mergedAttendances.value
  const q = searchQuery.value.toLowerCase()
  return mergedAttendances.value.filter(m => m.name.toLowerCase().includes(q))
})

function selectSchedule(id) {
  selectedSchedule.value = id
}

function openAttendanceModal(member) {
  selectedMember.value = member
  formStatus.value = member.status === 'Hadir' ? 'present' : member.status === 'Tidak Hadir' ? 'absent' : 'present'
  formReason.value = member.reason !== '-' ? member.reason : ''
  showModal.value = true
}

function handleQRScan(result) {
  if (!result?.member_id) {
    qrError.value = 'QR Code tidak valid.'
    return
  }
  qrError.value = ''
  const member = memberStore.datas.find(m => m.id === result.member_id)
  if (!member) return toast.add({ severity: 'error', summary: 'Member tidak ditemukan.', life: 3000 })

  const existing = attendanceStore.attendances.find(
    a => a.member_id === member.id && a.training_schedule_id === selectedSchedule.value
  )
  if (existing) toast.add({ severity: 'info', summary: `${member.name} sudah melakukan absensi.`, life: 3000 })
  else processQRAttendance(member.id)

  showQRScanner.value = false
}

async function processQRAttendance(memberId) {
  saving.value = true
  try {
    await attendanceStore.addAttendance({ member_id: memberId, training_schedule_id: selectedSchedule.value, status: 'present', reason: null })
    toast.add({ severity: 'success', summary: 'Absensi berhasil disimpan via QR code.', life: 3000 })
    await fetchData()
  } catch (e) {
    console.error(e)
    toast.add({ severity: 'error', summary: 'Gagal menyimpan absensi.', life: 3000 })
  } finally {
    saving.value = false
  }
}

async function saveManualAttendance() {
  if (!selectedSchedule.value) return toast.add({ severity: 'error', summary: 'Silakan pilih jadwal latihan terlebih dahulu.', life: 3000 })
  if (formStatus.value === 'absent' && !formReason.value.trim()) return toast.add({ severity: 'error', summary: 'Harap isi alasan ketidakhadiran.', life: 3000 })

  saving.value = true
  const form = { member_id: selectedMember.value.id, training_schedule_id: selectedSchedule.value, status: formStatus.value, reason: formStatus.value === 'absent' ? formReason.value : null }
  try {
    if (selectedMember.value.attendance_id) await attendanceStore.updateAttendance(selectedMember.value.attendance_id, form)
    else await attendanceStore.addAttendance(form)
    toast.add({ severity: 'success', summary: 'Absensi berhasil disimpan.', life: 3000 })
    showModal.value = false
    await fetchData()
  } catch (e) {
    console.error(e)
    toast.add({ severity: 'error', summary: 'Gagal menyimpan absensi.', life: 3000 })
  } finally {
    saving.value = false
  }
}

async function fetchData() {
  loading.value = true
  try {
    await Promise.all([
      trainingStore.fetchSchedules(),
      memberStore.getByParentId(),
      attendanceStore.fetchAttendances()
    ])
    if (trainingStore.schedules.length && !selectedSchedule.value) selectedSchedule.value = trainingStore.schedules[0].id
  } finally {
    loading.value = false
  }
}

onMounted(fetchData)
</script>

<template>
  <CoachLayouts>
    <div class="py-3 space-y-3">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center bg-white rounded-lg shadow px-5 py-4 gap-4">
        <button
          @click="showQRScanner = true"
          :disabled="!selectedSchedule"
          class="flex items-center gap-2 bg-piper-600 hover:bg-piper-700 text-white px-5 py-2 rounded-lg transition disabled:opacity-50 shadow cursor-pointer"
        >
          <i class="pi pi-qrcode"></i>
          <span>Scan QR Code</span>
        </button>

        <div class="relative w-full md:w-48">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Cari..."
            class="border border-gray-300 rounded-lg px-2.5 py-2 text-sm focus:outline-0 shadow-lg w-full"
          />
          <span class="absolute left-3 top-2.5 text-gray-400">
            <i class="pi pi-search"></i>
          </span>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow px-5 py-4">
        <h3 class="font-semibold text-gray-700 mb-3">Pilih Jadwal Latihan</h3>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          <div
            v-for="s in schedules"
            :key="s.value"
            @click="selectSchedule(s.value)"
            class="cursor-pointer rounded-lg border shadow-sm p-3 text-center text-sm transition-all"
            :class="[selectedSchedule === s.value ? 'bg-piper-600 text-white border-piper-600 shadow-md' : 'bg-white hover:bg-gray-50 border-gray-300 text-gray-700']"
          >
            <p class="font-medium">{{ s.label }}</p>
          </div>
        </div>
      </div>

    <!-- TABLE -->
      <div class="!rounded-lg !overflow-hidden shadow bg-white">
        <DataTable
          :value="filteredAttendances"
          paginator
          :rows="10"
          dataKey="id"
          :loading="loading"
          stripedRows
          removableSort
          class="p-datatable-sm"
          :pt="{
            thead: { class: 'text-sm font-light' },
            tbody: { class: 'text-sm font-light' },
            pcPaginator: { content: { class: 'text-xs' } },
          }"
        >
          <Column field="name" header="Nama" />

          <Column
            field="KU"
            header="KU"
            class="w-20 text-center"
            :pt="{ columnHeaderContent: { class: '!justify-center' } }"
          >
            <template #body="{ data }">
              <p class="text-center">{{ data.KU }}</p>
            </template>
          </Column>

          <Column
            field="gender"
            header="Jenis Kelamin"
            class="w-40 text-center"
            :pt="{ columnHeaderContent: { class: '!justify-center' } }"
          >
            <template #body="{ data }">
              <p class="text-center">{{ data.gender }}</p>
            </template>
          </Column>

          <Column
            field="status"
            header="Status"
            :pt="{ columnHeaderContent: { class: '!justify-center' } }"
          >
            <template #body="{ data }">
              <div
                class="text-center rounded-lg px-3 py-1 w-min mx-auto whitespace-nowrap border shadow-lg text-xs"
                :class="[
                  data.status === 'Hadir'
                    ? 'bg-green-300 text-green-800 border-green-800'
                    : data.status === 'Tidak Hadir'
                    ? 'bg-red-300 text-red-800 border-red-800'
                    : 'bg-gray-200 text-gray-800 border-gray-800'
                ]"
              >
                <p>{{ data.status }}</p>
              </div>
            </template>
          </Column>

          <Column
            field="reason"
            header="Alasan"
            class="w-48 text-center"
            :pt="{ columnHeaderContent: { class: '!justify-center' } }"
          >
            <template #body="{ data }">
              <p class="truncate block max-w-xs text-center" :title="data.reason">
                {{ data.reason || '-' }}
              </p>
            </template>
          </Column>

          <Column field="action" header="">
            <template #body="{ data }">
              <div class="flex justify-center gap-3">
                <button
                  @click="openAttendanceModal(data)"
                  v-tooltip.left="{
                    value: data.status === 'Belum Absen' ? 'Absen' : 'Ubah',
                    showDelay: 1000,
                    hideDelay: 300,
                  }"
                  :class="[
                    'text-xs rounded-md px-3 py-1.5 font-medium transition-all cursor-pointer',
                    data.status === 'Belum Absen'
                      ? 'bg-piper-600 text-white hover:bg-piper-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  ]"
                >
                  {{ data.status === 'Belum Absen' ? 'Absen' : 'Ubah' }}
                </button>
              </div>
            </template>
          </Column>

          <template #empty>
            <div class="text-center text-sm py-6 text-gray-500">
              <i class="pi pi-users text-xl mb-2"></i>
              <p>Tidak ada data anggota</p>
            </div>
          </template>

          <template #loading>
            <div class="text-center text-sm py-6">
              <p>Mohon Tunggu, Sedang Memuat Data.......</p>
            </div>
          </template>
        </DataTable>
      </div>


      <!-- MODAL ABSENSI -->
      <Dialog
        v-model:visible="showModal"
        :header="selectedMember ? `Absen: ${selectedMember.name}` : 'Absen Manual'"
        modal
        class="w-full max-w-md"
      >
        <div v-if="selectedMember" class="space-y-4">
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
            <p class="text-blue-700">
              <span class="font-medium">Status saat ini:</span>
              <span
                :class="[
                  'ml-1 font-medium',
                  selectedMember.status === 'Hadir'
                    ? 'text-green-600'
                    : selectedMember.status === 'Tidak Hadir'
                    ? 'text-red-600'
                    : 'text-gray-600'
                ]"
              >
                {{ selectedMember.status }}
              </span>
            </p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Status Kehadiran</label>
            <select
              v-model="formStatus"
              class="border border-gray-300 rounded-lg w-full px-3 py-2 text-sm focus:ring-2 focus:ring-piper-500 focus:border-piper-500 cursor-pointer"
              :disabled="saving"
            >
              <option value="present">Hadir</option>
              <option value="absent">Tidak Hadir</option>
            </select>
          </div>

          <div v-if="formStatus === 'absent'">
            <label class="block text-sm font-medium text-gray-700 mb-1">Alasan</label>
            <textarea
              v-model="formReason"
              rows="3"
              placeholder="Masukkan alasan ketidakhadiran..."
              class="border border-gray-300 rounded-lg w-full px-3 py-2 text-sm focus:ring-2 focus:ring-piper-500 focus:border-piper-500"
              :disabled="saving"
            ></textarea>
          </div>

          <div class="flex justify-end gap-2 pt-2">
            <button
              @click="showModal = false"
              class="px-4 py-2 text-sm rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 cursor-pointer"
            >
              Batal
            </button>
            <button
              @click="saveManualAttendance"
              :disabled="saving || (formStatus === 'absent' && !formReason.trim())"
              class="px-4 py-2 text-sm rounded-lg bg-piper-600 text-white hover:bg-piper-700 flex items-center gap-2 cursor-pointer"
            >
              <i v-if="saving" class="pi pi-spin pi-spinner text-sm"></i>
              {{ saving ? 'Menyimpan...' : 'Simpan' }}
            </button>
          </div>
        </div>
      </Dialog>

      <!-- MODAL QR -->
      <Dialog
        v-model:visible="showQRScanner"
        header="Scan QR Code Absensi"
        modal
        class="w-full max-w-md"
      >
        <div class="space-y-4">
          <div class="bg-piper-50 border border-piper-200 rounded-lg p-3 text-sm">
            <p class="text-piper-700">
              <i class="pi pi-info-circle mr-1"></i>
              Pastikan jadwal latihan sudah dipilih sebelum scan QR code.
            </p>
          </div>

          <div class="bg-gray-100 rounded-lg p-4 text-center">
            <QrcodeStream @decode="handleQRScan" class="w-full h-64 mx-auto" />
            <p v-if="qrError" class="text-red-500 text-sm mt-2">{{ qrError }}</p>
          </div>

          <div class="flex justify-end">
            <button
              @click="showQRScanner = false"
              class="px-4 py-2 text-sm rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </div>
      </Dialog>
    </div>
  </CoachLayouts>
</template>
