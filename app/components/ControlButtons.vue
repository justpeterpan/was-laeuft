<script setup lang="ts">
defineProps<{
  currentRound: number
  alreadyAnswered: boolean
  progress: number
  isPlaying: boolean
  playLabel: string
}>()

defineEmits(['playCurrentStem', 'skipCurrentRound'])
</script>
<template>
  <div
    v-if="currentRound < 4"
    class="grid gap-1 sm:gap-4 m-4 w-[300px] sm:w-[350px]"
    :class="[
      alreadyAnswered || currentRound >= 4 ? 'grid-cols-1' : 'grid-cols-2',
    ]"
  >
    <button
      @click="$emit('playCurrentStem')"
      :style="{
        background: `linear-gradient(to right, #FACC15 ${progress}%, transparent ${progress}%)`,
      }"
      class="rounded flex flex-row items-center justify-center flex-grow gap-1 shadow-sm border px-4 py-2"
    >
      <UIcon
        :name="
          isPlaying ? 'i-heroicons-pause-circle' : 'i-heroicons-play-circle'
        "
        class="text-lg align-middle"
      />
      <span class="align-middle">{{ playLabel }}</span>
    </button>
    <button
      v-if="!alreadyAnswered && currentRound < 4"
      @click="$emit('skipCurrentRound')"
      class="rounded flex flex-row items-center justify-center flex-grow gap-1 shadow-sm border px-4 py-2"
    >
      <UIcon name="i-heroicons-arrow-right-circle" class="text-lg" />skip guess
    </button>
  </div>
</template>
