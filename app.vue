<script lang="ts" setup>
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
  <div class="grid justify-center place-content-center min-h-svh">
    <nav class="px-8 py-4 absolute w-full">
      <ul class="flex flex-row justify-between items-center">
        <li>
          <div class="flex flex-row items-center gap-1">
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
        </li>
        <li class="mt-2">
          <UPopover
            :popper="{ placement: 'bottom', offsetDistance: -20 }"
            :ui="{
              width: 'max-w-max',
              base: 'h-32 px-2 py-1 text-sm font-thin italic font-serif p-4 relative',
            }"
            mode="hover"
          >
            <template #panel>
              <div class="">
                <p>1. Play the bass track and try to guess the song</p>
                <p>2. Type your guess and select your answer</p>
                <p>3. No clue? Skip the guess & play the next track</p>
                <p>4. Four rounds: bass, drums, vocals, instruments</p>
                <p>5. A new song challenge every day!</p>
              </div>
            </template>
            <UIcon
              name="i-heroicons-question-mark-circle"
              class="h-6 w-6 p-2"
            />
          </UPopover>
        </li>
      </ul>
    </nav>

    <NuxtPage />
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
