<script setup lang="ts">
defineProps<{ id: string }>()
defineEmits(['handleSlide'])

function initialDate(date: string | undefined) {
  if (!date) return new Date()
  const year = parseInt(date.substring(0, 4), 10)
  const month = parseInt(date.substring(4, 6), 10) - 1
  const day = parseInt(date.substring(6, 8), 10)

  return new Date(year, month, day)
}

function updateDate(date: string | undefined, days: number) {
  const newDate = new Date(initialDate(date))
  newDate.setDate(newDate.getDate() + days)
  return `${newDate.getFullYear()}${(newDate.getMonth() + 1)
    .toString()
    .padStart(2, '0')}${newDate.getDate().toString().padStart(2, '0')}`
}
</script>

<template>
  <div class="mx-4 sm:mx-0 grid grid-flow-col grid-cols-3 pt-10 items-center">
    <NuxtLink
      v-if="updateDate(id, -1) >= $config.public.init"
      :to="`/${updateDate(id, -1)}`"
      class="cursor-pointer max-w-min"
      @click="$emit('handleSlide', 'right')"
      ><UIcon name="i-heroicons-arrow-left-circle-solid" class="w-6 h-6"
    /></NuxtLink>
    <div class="place-self-center col-start-2">
      <UPopover :popper="{ placement: 'top', offsetDistance: 4 }">
        <UIcon name="i-heroicons-calendar-days-20-solid" class="w-6 h-6" />
        <template #panel="{ close }">
          <div class="w-[330px] h-72">
            <CalView @close-popup="close" />
          </div>
        </template>
      </UPopover>
    </div>
    <NuxtLink
      v-if="updateDate(id, 1) <= today"
      :to="updateDate(id, 1) < today ? `/${updateDate(id, 1)}` : '/'"
      class="cursor-pointer place-self-end col-start-3"
      @click="$emit('handleSlide', 'left')"
    >
      <UIcon name="i-heroicons-arrow-right-circle-solid" class="w-6 h-6" />
    </NuxtLink>
  </div>
</template>
