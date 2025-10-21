<script setup>
import CoachLayouts from '@/layouts/CoachLayouts.vue'
import { Column, DataTable, Dialog } from 'primevue'
import { ref, onMounted, computed } from 'vue'
import { useAttendanceStore } from '@/stores/attendance'
import { useTrainingStore } from '@/stores/training'
import { useMemberStore } from '@/stores/member'
import { useUIStore } from '@/stores/ui'
import { QrcodeStream, QrcodeDropZone, QrcodeCapture } from 'vue-qrcode-reader'

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
const scanResult = ref(null)
const scanLoading = ref(false)

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

// Hanya tampilkan member dengan status active
const activeMembers = computed(() => {
  return memberStore.datas.filter(member => member.status === 'active')
})

const mergedAttendances = computed(() => {
  return activeMembers.value.map(member => {
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
  } finally {
    saving.value = false
  }
}

// QR SCANNER METHODS
function openQRScanner() {
  if (!selectedSchedule.value) {
    uiStore.showToast('error', 'Silakan pilih jadwal latihan terlebih dahulu.')
    return
  }
  showQRScanner.value = true
  qrError.value = ''
  scanResult.value = null
}

function closeQRScanner() {
  showQRScanner.value = false
  qrError.value = ''
  scanResult.value = null
}

async function onQRCodeDetected(detectedCodes) {
  if (detectedCodes.length === 0) return
  
  const detectedCode = detectedCodes[0]
  const rawValue = detectedCode.rawValue
  
  if (!rawValue) {
    qrError.value = 'QR Code tidak valid'
    return
  }

  scanLoading.value = true
  qrError.value = ''

  try {
    // Process QR code data
    await processQRCode(rawValue)
  } catch (error) {
    console.error('Error processing QR code:', error)
    qrError.value = 'Gagal memproses QR Code: ' + error.message
  } finally {
    scanLoading.value = false
  }
}

async function processQRCode(qrData) {
  try {
    // Validasi base64
    if (!isValidBase64(qrData)) {
      qrError.value = 'Format QR Code tidak valid'
      return
    }

    // Simpan absensi via QR scan
    const result = await attendanceStore.scanQRAttendance(qrData, selectedSchedule.value)
    
    scanResult.value = {
      success: true,
      message: result.message,
      memberName: result.data.member?.name || 'Unknown Member'
    }

    // Auto close setelah 2 detik jika sukses
    setTimeout(() => {
      closeQRScanner()
      fetchData()
    }, 2000)

  } catch (error) {
    scanResult.value = {
      success: false,
      message: error.response?.data?.message || 'Gagal melakukan absensi'
    }
  }
}

function isValidBase64(str) {
  try {
    return btoa(atob(str)) === str
  } catch (err) {
    return false
  }
}

function onCameraError(error) {
  console.error('Camera error:', error)
  if (error.name === 'NotAllowedError') {
    qrError.value = 'Akses kamera ditolak. Silakan izinkan akses kamera.'
  } else if (error.name === 'NotFoundError') {
    qrError.value = 'Kamera tidak ditemukan.'
  } else if (error.name === 'NotSupportedError') {
    qrError.value = 'Browser tidak mendukung akses kamera.'
  } else if (error.name === 'NotReadableError') {
    qrError.value = 'Kamera sedang digunakan oleh aplikasi lain.'
  } else {
    qrError.value = 'Terjadi error pada kamera: ' + error.message
  }
}

function onCameraInit(promise) {
  promise.then(() => {
    cameraPermission.value = 'granted'
    qrError.value = ''
  }).catch((error) => {
    onCameraError(error)
    cameraPermission.value = 'denied'
  })
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
              <p>Tidak ada data anggota aktif</p>
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

    <!-- MODAL QR SCANNER -->
    <Dialog v-model:visible="showQRScanner" header="Scan QR Code Absensi" :modal="true" :closable="!scanLoading" class="w-full max-w-2xl">
      <div class="space-y-4">
        <!-- Camera Error Message -->
        <div v-if="qrError && !scanResult" class="bg-red-50 border border-red-200 rounded-lg p-4">
          <div class="flex items-center gap-2">
            <i class="pi pi-exclamation-triangle text-red-500" style="font-size:1.2rem"></i>
            <p class="text-red-700 text-sm">{{ qrError }}</p>
          </div>
        </div>

        <!-- Scan Result -->
        <div v-if="scanResult" :class="['border rounded-lg p-4', scanResult.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200']">
          <div class="flex items-center gap-2">
            <i :class="[scanResult.success ? 'pi pi-check-circle text-green-500' : 'pi pi-exclamation-circle text-red-500', 'text-xl']"></i>
            <div>
              <p :class="['font-medium', scanResult.success ? 'text-green-800' : 'text-red-800']">
                {{ scanResult.message }}
              </p>
              <p v-if="scanResult.memberName" class="text-sm text-green-600 mt-1">
                Member: <strong>{{ scanResult.memberName }}</strong>
              </p>
            </div>
          </div>
        </div>

        <!-- QR Scanner -->
        <div v-if="!scanResult" class="relative">
          <div class="border-2 border-dashed border-gray-300 rounded-lg overflow-hidden bg-gray-50">
            <qrcode-stream
              v-if="showQRScanner && !scanLoading"
              @detect="onQRCodeDetected"
              @error="onCameraError"
              @init="onCameraInit"
              :camera="cameraPermission === 'denied' ? 'off' : 'auto'"
              class="w-full h-64 md:h-96"
            >
              <div v-if="scanLoading" class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div class="text-white text-center">
                  <i class="pi pi-spin pi-spinner text-2xl mb-2"></i>
                  <p>Memproses QR Code...</p>
                </div>
              </div>
            </qrcode-stream>
            
            <!-- Camera Placeholder jika error -->
            <div v-if="cameraPermission === 'denied'" class="h-64 md:h-96 flex items-center justify-center flex-col gap-3">
              <i class="pi pi-video text-4xl text-gray-400"></i>
              <p class="text-gray-500 text-center px-4">Tidak dapat mengakses kamera. Pastikan Anda memberikan izin akses kamera.</p>
              <button @click="closeQRScanner" class="px-4 py-2 bg-gray-500 text-white rounded-lg text-sm hover:bg-gray-600 transition-colors">
                Tutup
              </button>
            </div>
          </div>

          <!-- Scanner Guide -->
          <div class="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div class="border-2 border-piper-500 rounded-lg w-48 h-48 md:w-64 md:h-64 bg-transparent"></div>
          </div>
        </div>

        <!-- Instructions -->
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 class="font-medium text-blue-800 mb-2 flex items-center gap-2">
            <i class="pi pi-info-circle"></i> Petunjuk Scan QR
          </h3>
          <ul class="text-blue-700 text-sm space-y-1">
            <li>• Pastikan QR Code berada dalam area kotak scanner</li>
            <li>• Pastikan pencahayaan cukup</li>
            <li>• Jaga jarak yang tepat dari kamera</li>
            <li>• Absensi otomatis tersimpan ketika QR terdeteksi</li>
          </ul>
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-end gap-2 pt-2">
          <button 
            @click="closeQRScanner" 
            :disabled="scanLoading"
            class="px-4 py-2 text-sm rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Tutup
          </button>
        </div>
      </div>
    </Dialog>
  </CoachLayouts>
</template>