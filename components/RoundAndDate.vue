<script setup lang="ts">
defineProps<{
  currentRound: number
  alreadyAnswered: boolean
  currentMonth: string
  currentDate: string
}>()
</script>

<template>
  <div class="mx-4 text-center font-black font-serif pb-4">
    <span v-if="!alreadyAnswered && currentRound < 4"
      >{{ numberAsString[currentRound + 1] }} of 4 rounds on
    </span>
    {{ mapMonthNumberToName(+currentMonth) }},
    {{ numberAsString[+currentDate] }}
  </div>
</template>
