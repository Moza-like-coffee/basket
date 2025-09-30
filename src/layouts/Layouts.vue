<script setup>
import Footer from '@/components/Footer.vue'
import NavigationBar from '@/components/NavigationBar.vue'
</script>
<template>
  <div>
    <NavigationBar />
    <div class="pt-16 min-h-screen w-full max-w-7xl mx-auto">
      <slot />
    </div>
    <Footer />
  </div>
</template>
