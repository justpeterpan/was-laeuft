<script lang="ts" setup>
useHead({
  htmlAttrs: { lang: 'en' },
  title: 'Guess the Song ♫',
  link: [
    { rel: 'icon', type: 'image/png', href: '/favicon.png' },
    { rel: 'apple-touch-icon', type: 'image/png', href: '/favicon.png' },
  ],
})
</script>

<template>
  <div class="grid justify-center place-content-center min-h-svh">
    <nav class="p-4 absolute w-full">
      <ul class="flex flex-row-reverse justify-between">
        <UPopover
          :popper="{ placement: 'bottom', offsetDistance: -6, arrow: true }"
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
          <li>
            <UIcon
              name="i-heroicons-question-mark-circle"
              class="h-6 w-6 p-2"
            />
          </li>
        </UPopover>
      </ul>
    </nav>
    <NuxtPage />
  </div>
</template>
