import { defineStore, acceptHMRUpdate } from 'pinia'
import api from '@/config/axios.js'
import { useUIStore } from '@/stores/ui'

export const useParentStore = defineStore('parent', {
  state: () => ({
    datas: [],
    data: {},
  }),
  actions: {
    async getByAuth() {
      const uiStore = useUIStore()
      uiStore.isLoading = true
      try {
        const response = await api.get('/getByAuth/parent')
        this.data = response.data.data
      } catch (error) {
        console.log(error)
      } finally {
        uiStore.isLoading = false
      }
    },
  },
})
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useParentStore, import.meta.hot))
}
