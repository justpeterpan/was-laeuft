<script setup lang="ts">
const searchQuery = defineModel<string>()
defineProps<{ currentRound: number; alreadyAnswered: boolean }>()
defineEmits(['handleInput'])
</script>

<template>
  <input
    v-if="!alreadyAnswered && currentRound < 4"
    type="text"
    v-model="searchQuery"
    @input="$emit('handleInput')"
    placeholder="type your guess here..."
    class="mx-4 mt-8 mb-2 max-w-[300px] sm:max-w-[350px] p-2 border-b border-neutral-300 border-dotted bg-transparent"
  />
</template>
