<script setup lang="ts">
defineProps<{
  currentRound: number
  alreadyAnswered: boolean
  correctlyAnswered: boolean
  progress: number
  isPlaying: boolean
  cover: string
  link: string
  title: string
  artist: string
  year: number
}>()

defineEmits(['playCurrentStem'])
</script>
<template>
  <div
    v-if="alreadyAnswered || correctlyAnswered || currentRound > 3"
    class="max-w-[300px] sm:max-w-[350px] m-4"
  >
    <p v-if="!alreadyAnswered" class="italic font-serif font-medium pb-2">
      {{
        correctlyAnswered ? 'Well done!' : 'No worries! Better luck next time!'
      }}
    </p>
    <div>
      <div class="relative grid items-center place-items-center">
        <img
          :src="cover"
          alt="album cover of the song"
          class="mb-2 w-[300px] sm:w-[350px] shadow-md border border-neutral-300 rounded-lg"
        />
        <div
          class="absolute bottom-2 rounded-bl-lg rounded-br-lg h-4 w-full"
          :style="{
            background: `linear-gradient(to right, #FACC15 ${progress}%, transparent ${progress}%)`,
          }"
        />
        <div
          class="absolute cursor-pointer pt-2 pb-0.5 px-2 bg-black/80 rounded-full opacity-90"
          @click="$emit('playCurrentStem')"
        >
          <UIcon
            :name="
              isPlaying
                ? 'i-heroicons-pause-circle'
                : 'i-heroicons-play-circle-16-solid'
            "
            class="w-8 h-8 shadow-md bg-white rounded-full"
          />
        </div>
      </div>
      <NuxtLink
        :to="link"
        target="_blank"
        class="flex flex-row items-center gap-2"
      >
        ♫ {{ artist }} - {{ title }} ({{ year }})
      </NuxtLink>
    </div>
  </div>
</template>
