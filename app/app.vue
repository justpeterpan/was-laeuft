<script lang="ts" setup>
import type { SongsData } from '~/types'

definePageMeta({ middleware: 'redirect' })
const route = useRoute()
const { data: songs } = await useFetch<SongsData>('/api/s')
const slideDirection = useSlideDirection()

function handleSlide(direction: 'left' | 'right') {
  slideDirection.value = `slide-${direction}`
}
</script>

<template>
  <NuxtLoadingIndicator color="#E6BC13" />
  <div class="grid justify-center place-content-center min-h-dvh">
    <NavBar />
    <AnimatedLogo />
    <NuxtPage
      :songs="songs"
      :transition="{ name: slideDirection, mode: 'out-in' }"
      class="dark:sm:bg-[#121212] dark:z-50 dark:sm:rounded-lg dark:sm:shadow-2xl"
    />
    <BottomNav :id="(route.params.id as string)" @handle-slide="handleSlide" />
    <NoiseBackground />
  </div>
</template>

<style>
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.2s;
}
.slide-left-enter-from {
  opacity: 0;
  transform: translate(50px, 0);
}
.slide-left-leave-to {
  opacity: 0;
  transform: translate(-50px, 0);
}
.slide-right-enter-from {
  opacity: 0;
  transform: translate(-50px, 0);
}
.slide-right-leave-to {
  opacity: 0;
  transform: translate(50px, 0);
}
</style>
