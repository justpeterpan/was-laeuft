<script setup lang="ts">
defineProps<{ words: Array<string>; isShown: Array<boolean> }>()
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
