<script setup>
import MemberLayouts from '@/layouts/MemberLayouts.vue'
</script>
<template>
  <MemberLayouts>
    <div class="py-3 space-y-3">
      <div class="grid grid-cols-3 gap-3">
        <div class="bg-white rounded-lg shadow h-20"></div>
        <div class="bg-white rounded-lg shadow h-20"></div>
        <div class="bg-white rounded-lg shadow h-20"></div>
      </div>
      <div class="grid grid-cols-2 gap-3">
        <div class="h-80 w-full rounded-lg shadow bg-white"></div>
        <div class="h-80 w-full rounded-lg shadow bg-white"></div>
      </div>
      <div class="grid grid-cols-3 gap-3">
        <div class="h-80 w-full rounded-lg shadow bg-white col-span-2"></div>
        <div class="h-80 w-full rounded-lg shadow bg-white"></div>
      </div>
    </div>
  </MemberLayouts>
</template>
