<script setup>
import MemberLayouts from '@/layouts/MemberLayouts.vue'
import CoachLayouts from '@/layouts/CoachLayouts.vue'
import AdminLayouts from '@/layouts/AdminLayouts.vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const auth = authStore.decryptedUserData
</script>
<template>
  <MemberLayouts v-if="auth?.role == 'parent'">
    <div class="py-3 space-y-3">
      <div class="rounded-lg bg-white shadow p-5"></div>
    </div>
  </MemberLayouts>
  <CoachLayouts v-if="auth?.role == 'coach'">
    <div class="py-3 space-y-3">
      <div class="rounded-lg bg-white shadow p-5"></div>
    </div>
  </CoachLayouts>
  <AdminLayouts v-if="auth?.role == 'admin'">
    <div class="py-3 space-y-3">
      <div class="rounded-lg bg-white shadow p-5"></div>
    </div>
  </AdminLayouts>
</template>
