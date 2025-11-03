import { defineStore, acceptHMRUpdate } from 'pinia'
import api from '@/config/axios.js'
import { useUIStore } from '@/stores/ui'
import { useResponseStore } from './response'
import router from '@/router'

export const useDashboardStore = defineStore('dashboard', {
  state: () => ({
    datas: [],
    data: {},
  }),
  actions: {
    async adminDashboard() {
      const uiStore = useUIStore()
      uiStore.isLoading = true
      try {
        const response = await api.get('/admin/dashboard')
        this.datas = response.data.data
      } catch (error) {
        console.log(error)
        if (error.response && error.response.status !== 422) throw error
      } finally {
        uiStore.isLoading = false
      }
    },
  },
})
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useDashboardStore, import.meta.hot))
}
