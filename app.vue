<script lang="ts" setup>
export type Song = {
  views: string
  year: number
  link: string
  title: string
  artist: string
  cover: string
  short: string
}

export type SongsData = {
  [date: string]: Song
}

definePageMeta({ middleware: 'redirect' })

const route = useRoute()

const { data: songs } = await useFetch<SongsData>('/api/s')

const slideDirection = useSlideDirection()

function handleSlide(direction: 'left' | 'right') {
  slideDirection.value = `slide-${direction}`
}

onMounted(() => {
  words.forEach((_, index) => {
    setTimeout(() => {
      isShown.value[index] = true
    }, index * 300)
  })
})

const words = ['guess', 'the', 'song']
const isShown = ref(words.map(() => false))
</script>

<template>
  <NuxtLoadingIndicator color="#E6BC13" />
  <div class="grid justify-center place-content-center min-h-dvh">
    <NavBar />
    <AnimatedLogo :words="words" :isShown="isShown" />
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
h1 {
  display: flex;
  gap: 0.5rem;
}

h1 span {
  display: inline-block;
  transform: translateY(100%);
  opacity: 0;
  transition: transform 0.5s ease, opacity 0.5s ease;
}

h1 span.show {
  transform: translateY(0);
  opacity: 1;
}

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
