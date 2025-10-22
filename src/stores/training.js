import { defineStore, acceptHMRUpdate } from 'pinia'
import api from '@/config/axios.js'
import { useUIStore } from '@/stores/ui'
import { useResponseStore } from '@/stores/response'

export const useTrainingStore = defineStore('training', {
  state: () => ({
    datas: [],
    currentSchedule: null,
  }),

  getters: {
    formattedSchedules: (state) => {
      return state.schedules.map((schedule) => ({
        ...schedule,
        displayText: `${schedule.title} - ${new Date(schedule.date).toLocaleDateString('id-ID')}`,
      }))
    },
  },

  actions: {
    async get() {
      const uiStore = useUIStore()
      uiStore.isLoading = true
      try {
        const response = await api.get('/training/schedule')
        this.datas = response.data.data
      } catch (error) {
        console.error('Gagal mengambil jadwal latihan:', error)
        throw error
      } finally {
        uiStore.isLoading = false
      }
    },

    async create(form) {
      const uiStore = useUIStore()
      const responseStore = useResponseStore()
      uiStore.startLoading()
      try {
        const response = await api.post('/training/schedule', form)
        responseStore.addSuccess(response.data.message)
        this.datas.push(response.data.data)
      } catch (error) {
        console.log(error)
        if (error.response && error.response.status !== 422) throw error
        const errors = error.response.data?.errors
        Object.values(errors).forEach((fieldErrors) => {
          if (Array.isArray(fieldErrors)) {
            fieldErrors.forEach((err) => responseStore.addError(err))
          }
        })
      } finally {
        uiStore.stopLoading()
      }
    },

    async update(id, form) {
      const uiStore = useUIStore()
      const responseStore = useResponseStore()
      uiStore.startLoading()
      try {
        const response = await api.put(`/training/schedule/${id}`, form)

        const updatedItem = response.data.data
        const index = this.datas.findIndex((item) => item.id === id)
        if (index !== -1) {
          this.datas[index] = updatedItem
        }
        responseStore.addSuccess(response.data.message)
      } catch (error) {
        console.log(error)
        if (error.response && error.response.status !== 422) throw error
        const errors = error.response.data?.errors
        Object.values(errors).forEach((fieldErrors) => {
          if (Array.isArray(fieldErrors)) {
            fieldErrors.forEach((err) => responseStore.addError(err))
          }
        })
        throw error
      } finally {
        uiStore.stopLoading()
      }
    },

    async destroy(id) {
      const uiStore = useUIStore()
      const responseStore = useResponseStore()
      uiStore.startLoading()
      try {
        const response = await api.delete(`/training/schedule/${id}`)
        responseStore.addSuccess(response.data.message)
        this.datas = this.datas.filter((data) => {
          return data.id !== id
        })
      } catch (error) {
        console.log(error)
        if (error.response && error.response.status !== 422) throw error
        const errors = error.response.data?.errors
        Object.values(errors).forEach((fieldErrors) => {
          if (Array.isArray(fieldErrors)) {
            fieldErrors.forEach((err) => responseStore.addError(err))
          }
        })
      } finally {
        uiStore.stopLoading()
      }
    },

    setCurrentSchedule(schedule) {
      this.currentSchedule = schedule
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useTrainingStore, import.meta.hot))
}
