<script setup lang="ts">
const words = ['guess', 'the', 'song']
const isShown = ref(words.map(() => false))

onMounted(() => {
  words.forEach((_, index) => {
    setTimeout(() => {
      isShown.value[index] = true
    }, index * 300)
  })
})
</script>

<template>
  <div class="flex flex-row place-content-center items-center gap-1 pb-10">
    <NuxtLink to="/">
      <h1 class="text-2xl font-black drop-shadow-md font-serif">
        <span
          v-for="(word, index) in words"
          :key="index"
          :class="{ show: isShown[index] }"
        >
          {{ word }}
        </span>
      </h1>
    </NuxtLink>
    <sup class="text-xl font-black font-serif text-primary">♫</sup>
  </div>
</template>

<style scoped>
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
</style>
