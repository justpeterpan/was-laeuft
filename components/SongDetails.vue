<script setup lang="ts">
defineProps<{
  currentRound: number
  alreadyAnswered: boolean
  views: string
  year: number
}>()
</script>
<template>
  <div
    v-if="currentRound < 4"
    class="mx-4 text-sm sm:text-base font-thin py-2 flex flex-row gap-1"
  >
    <div>
      YouTube views:
      {{ !alreadyAnswered && currentRound < 1 ? '???' : views }}
    </div>
    <div>|</div>
    <div>
      Year of release:
      {{ !alreadyAnswered && currentRound < 2 ? '???' : year }}
    </div>
  </div>
</template>
