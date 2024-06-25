<script setup lang="ts">
defineProps<{ currentRound: number; searchHits: any }>()
defineEmits(['selectAnswer'])
</script>
<template>
  <div
    v-if="currentRound < 4"
    class="max-w-[300px] sm:max-w-[350px] min-h-4 max-h-[190px]"
  >
    <ul class="m-4 max-h-[450px]">
      <li
        v-for="(hit, index) of searchHits"
        :key="hit.name + hit.artist"
        @click="$emit('selectAnswer', index)"
        class="cursor-pointer border-b border-dotted border-neutral-300 truncate w-[300px] sm:w-[350px] my-2 px-2"
      >
        {{ hit.artist }} - {{ hit.name }}
      </li>
    </ul>
  </div>
</template>
