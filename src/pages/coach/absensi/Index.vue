<script setup>
import CoachLayouts from '@/layouts/CoachLayouts.vue'
import { Column, DataTable, Dialog } from 'primevue'
import { ref, onMounted, computed } from 'vue'
import { useAttendanceStore } from '@/stores/attendance'
import { useTrainingStore } from '@/stores/training'
import { useMemberStore } from '@/stores/member'
import { useUIStore } from '@/stores/ui'
import { QrcodeStream } from 'vue-qrcode-reader'

const attendanceStore = useAttendanceStore()
const trainingStore = useTrainingStore()
const memberStore = useMemberStore()
const uiStore = useUIStore()

// STATE
const selectedSchedule = ref('')
const loading = ref(false)
const showModal = ref(false)
const showQRScanner = ref(false)
const selectedMember = ref(null)
const formStatus = ref('present')
const formReason = ref('')
const searchQuery = ref('')
const saving = ref(false)
const cameraPermission = ref(null)
const qrError = ref('')

// COMPUTED
const schedules = computed(() => {
  return trainingStore.schedules
    .map(schedule => ({
      label: new Date(schedule.date).toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      value: schedule.id,
      date: schedule.date
    }))
    .sort((a, b) => new Date(b.date) - new Date(a.date))
})

const mergedAttendances = computed(() => {
  return memberStore.datas.map(member => {
    const attendance = attendanceStore.attendances.find(
      a => a.member_id === member.id && a.training_schedule_id === selectedSchedule.value
    )
    return {
      id: member.id,
      name: member.name,
      gender: member.gender === 'Laki Laki' ? 'Laki-laki' : member.gender === 'Perempuan' ? 'Perempuan' : 'N/A',
      status: attendance
        ? attendance.status === 'present'
          ? 'Hadir'
          : attendance.status === 'absent'
          ? 'Tidak Hadir'
          : attendance.status
        : 'Belum Absen',
      reason: attendance?.reason || '-',
      attendance_id: attendance?.id || null
    }
  })
})

const filteredAttendances = computed(() => {
  if (!searchQuery.value) return mergedAttendances.value
  const query = searchQuery.value.toLowerCase()
  return mergedAttendances.value.filter(member =>
    member.name.toLowerCase().includes(query)
  )
})

// METHODS
function openAttendanceModal(member) {
  selectedMember.value = member
  formStatus.value = member.status === 'Hadir' ? 'present' : member.status === 'Tidak Hadir' ? 'absent' : 'present'
  formReason.value = member.reason !== '-' ? member.reason : ''
  showModal.value = true
}

function openQRScanner() {
  if (!selectedSchedule.value) {
    uiStore.showToast('error', 'Silakan pilih jadwal latihan terlebih dahulu.')
    return
  }
  showQRScanner.value = true
}

function handleQRScan(result) {
  if (result && result.member_id) {
    const member = memberStore.datas.find(m => m.id === result.member_id)
    if (!member) {
      uiStore.showToast('error', 'Member tidak ditemukan.')
      return
    }
    const existingAttendance = attendanceStore.attendances.find(
      a => a.member_id === member.id && a.training_schedule_id === selectedSchedule.value
    )
    if (existingAttendance) {
      uiStore.showToast('info', `${member.name} sudah melakukan absensi.`)
    } else {
      processQRAttendance(member.id)
    }
  }
  showQRScanner.value = false
}

async function processQRAttendance(memberId) {
  saving.value = true
  const form = {
    member_id: memberId,
    training_schedule_id: selectedSchedule.value,
    status: 'present',
    reason: null
  }

  try {
    await attendanceStore.addAttendance(form)
    uiStore.showToast('success', 'Absensi berhasil disimpan via QR code.')
    await fetchData()
  } catch (error) {
    console.error('Gagal menyimpan absensi QR:', error)
    uiStore.showToast('error', 'Gagal menyimpan absensi. Silakan coba lagi.')
  } finally {
    saving.value = false
  }
}

async function saveManualAttendance() {
  if (!selectedSchedule.value) {
    uiStore.showToast('error', 'Silakan pilih jadwal latihan terlebih dahulu.')
    return
  }
  if (formStatus.value === 'absent' && !formReason.value.trim()) {
    uiStore.showToast('error', 'Harap isi alasan ketidakhadiran.')
    return
  }

  saving.value = true
  const form = {
    member_id: selectedMember.value.id,
    training_schedule_id: selectedSchedule.value,
    status: formStatus.value,
    reason: formStatus.value === 'absent' ? formReason.value : null
  }

  try {
    if (selectedMember.value.attendance_id) {
      await attendanceStore.updateAttendance(selectedMember.value.attendance_id, form)
    } else {
      await attendanceStore.addAttendance(form)
    }
    uiStore.showToast('success', 'Absensi berhasil disimpan.')
    showModal.value = false
    await fetchData()
  } catch (error) {
    console.error('Gagal menyimpan absensi:', error)
    uiStore.showToast('error', 'Gagal menyimpan absensi. Silakan coba lagi.')
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
    if (schedules.value.length > 0 && !selectedSchedule.value) {
      selectedSchedule.value = schedules.value[0].value
    }
  } catch (error) {
    console.error('Error fetching data:', error)
    uiStore.showToast('error', 'Gagal memuat data. Silakan refresh halaman.')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchData()
})
</script>

<template>
  <CoachLayouts>
    <div class="py-3 space-y-3">
      <!-- HEADER -->
      <div class="rounded-lg bg-white shadow px-5 py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div class="flex flex-col md:flex-row items-start md:items-center gap-3 w-full md:w-auto">
          <div class="w-full md:w-64">
            <label class="block text-sm font-medium text-gray-700 mb-1">Pilih Jadwal Latihan</label>
            <select v-model="selectedSchedule" class="border border-gray-300 rounded-lg px-3 py-2 w-full shadow-sm focus:ring-2 focus:ring-piper-500 focus:border-piper-500">
              <option disabled value="">Pilih Jadwal</option>
              <option v-for="schedule in schedules" :key="schedule.value" :value="schedule.value">{{ schedule.label }}</option>
            </select>
          </div>
          <div class="w-full md:w-64">
            <label class="block text-sm font-medium text-gray-700 mb-1">Cari Anggota</label>
            <div class="relative">
              <input v-model="searchQuery" type="text" placeholder="Cari nama anggota..." class="border border-gray-300 rounded-lg px-3 py-2 pl-9 w-full shadow-sm focus:ring-2 focus:ring-piper-500 focus:border-piper-500">
              <span class="absolute left-3 top-2.5 text-gray-400"><i class="pi pi-search" style="font-size:0.9rem"></i></span>
            </div>
          </div>
        </div>
        <button @click="openQRScanner" :disabled="!selectedSchedule" class="w-full md:w-auto flex items-center justify-center gap-2 bg-rhino-700 hover:bg-rhino-900 text-white px-4 py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm">
          <i class="pi pi-qrcode" style="font-size:1rem"></i>
          <span>Scan QR Code</span>
        </button>
      </div>

      <!-- TABLE -->
      <div class="rounded-lg overflow-hidden shadow bg-white">
        <DataTable :value="filteredAttendances" paginator :rows="10" dataKey="id" :loading="loading" stripedRows removableSort class="p-datatable-sm">
          <Column field="name" header="Nama Anggota" sortable>
            <template #body="{ data }">
              <div class="flex justify-between items-center">
                <span class="font-medium">{{ data.name }}</span>
                <button @click="openAttendanceModal(data)" :class="['text-xs rounded-md px-3 py-1.5 transition-all duration-200 font-medium', data.status==='Hadir'?'bg-green-100 text-green-700 hover:bg-green-200':data.status==='Tidak Hadir'?'bg-red-100 text-red-700 hover:bg-red-200':'bg-piper-600 text-white hover:bg-piper-700']">{{ data.status==='Belum Absen'?'Absen':'Ubah' }}</button>
              </div>
            </template>
          </Column>
          <Column field="gender" header="Jenis Kelamin" class="w-32 text-center" sortable />
          <Column field="status" header="Status" class="w-32 text-center" sortable>
            <template #body="{ data }">
              <span :class="['px-3 py-1.5 rounded-full text-xs font-medium inline-block min-w-24', data.status==='Hadir'?'bg-green-100 text-green-700':data.status==='Tidak Hadir'?'bg-red-100 text-red-700':'bg-gray-100 text-gray-600']">{{ data.status }}</span>
            </template>
          </Column>
          <Column field="reason" header="Alasan" class="w-48">
            <template #body="{ data }">
              <div class="truncate max-w-xs" :title="data.reason">{{ data.reason }}</div>
            </template>
          </Column>
          <template #empty>
            <div class="text-center py-8 text-gray-500">
              <i class="pi pi-users" style="font-size:2rem; margin-bottom:0.5rem;"></i>
              <p>Tidak ada data anggota</p>
            </div>
          </template>
        </DataTable>
      </div>
    </div>

    <!-- MODAL ABSEN MANUAL -->
    <Dialog v-model:visible="showModal" :header="selectedMember ? `Absen: ${selectedMember.name}` : 'Absen Manual'" :modal="true" :closable="!saving" class="w-full max-w-md">
      <div v-if="selectedMember" class="space-y-4">
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p class="text-sm text-blue-700">
            <span class="font-medium">Status saat ini:</span>
            <span :class="['ml-1 font-medium', selectedMember.status==='Hadir'?'text-green-600':selectedMember.status==='Tidak Hadir'?'text-red-600':'text-gray-600']">{{ selectedMember.status }}</span>
          </p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Status Kehadiran</label>
          <select v-model="formStatus" class="border border-gray-300 rounded-lg w-full px-3 py-2.5 text-sm focus:ring-2 focus:ring-piper-500 focus:border-piper-500" :disabled="saving">
            <option value="present">Hadir</option>
            <option value="absent">Tidak Hadir</option>
          </select>
        </div>
        <div v-if="formStatus==='absent'">
          <label class="block text-sm font-medium text-gray-700 mb-1">Alasan <span class="text-red-500">*</span></label>
          <textarea v-model="formReason" rows="3" placeholder="Masukkan alasan ketidakhadiran..." class="border border-gray-300 rounded-lg w-full px-3 py-2.5 text-sm focus:ring-2 focus:ring-piper-500 focus:border-piper-500" :disabled="saving"></textarea>
        </div>
        <div class="flex justify-end gap-2 pt-2">
          <button @click="showModal=false" :disabled="saving" class="px-4 py-2 text-sm rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">Batal</button>
          <button @click="saveManualAttendance" :disabled="saving || (formStatus==='absent' && !formReason.trim())" class="px-4 py-2 text-sm rounded-lg bg-piper-600 text-white hover:bg-piper-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
            <i v-if="saving" class="pi pi-spin pi-spinner" style="font-size:0.9rem"></i> {{ saving?'Menyimpan...':'Simpan' }}
          </button>
        </div>
      </div>
    </Dialog>

    <!-- MODAL SCAN QR -->
    <Dialog v-model:visible="showQRScanner" header="Scan QR Code Absensi" :modal="true" :closable="true" class="w-full max-w-md">
      <div class="space-y-4">
        <div class="bg-piper-50 border border-piper-200 rounded-lg p-3">
          <p class="text-sm text-piper-700"><i class="pi pi-info-circle mr-1"></i>Pastikan jadwal latihan sudah dipilih sebelum scan QR code.</p>
        </div>

        <div class="bg-gray-100 rounded-lg p-4 text-center">
          <QrcodeStream
            @decode="handleQRScan"
            @init="cameraPermission.value = true"
            @error="qrError.value = $event.message"
            class="w-full h-64 mx-auto"
          />
          <p v-if="qrError" class="text-red-500 text-sm mt-2">{{ qrError }}</p>
        </div>

         <div class="text-sm text-gray-600">
          <p class="font-medium">Cara penggunaan:</p>
          <ul class="list-disc list-inside mt-1 space-y-1">
            <li>Pastikan QR code anggota terlihat jelas di kamera</li>
            <li>Scan QR code untuk mencatat kehadiran secara otomatis</li>
            <li>Status akan berubah menjadi "Hadir" setelah berhasil scan</li>
          </ul>
        </div>

        <div class="flex justify-end gap-2 pt-2">
          <button @click="showQRScanner=false" class="px-4 py-2 text-sm rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors">Tutup</button>
        </div>
      </div>
    </Dialog>
  </CoachLayouts>
</template>
