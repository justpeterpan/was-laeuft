<template>
  <div
    class="grid grid-cols-7 grid-rows-6 place-items-center w-full h-full rounded gap-1"
  >
    <div
      v-for="day of days"
      :key="day"
      class="uppercase text-sm font-extralight"
    >
      {{ day }}
    </div>
    <div v-for="empty in firstDay" :key="'empty' + empty" />
    <div v-for="day in daysInMonth" class="w-full h-full">
      <div
        v-if="
          `${year}${(month + 1).toString().padStart(2, '0')}${(day + 1)
            .toString()
            .padStart(2, '0')}` <= config.public.init || currentDate < day
        "
        class="w-full h-full font-extralight items-center justify-items-center grid rounded"
        :class="{
          'border-primary border-2 font-bold':
            day === Number(route.params.id?.slice(-2)) ?? currentDate,
          'border bg-neutral-400/5 border-neutral-400/5 text-neutral-400/40 dark:text-white/10 dark:bg-white/5 dark:border-white/5':
            `${year}${(month + 1).toString().padStart(2, '0')}${(day + 1)
              .toString()
              .padStart(2, '0')}` <= config.public.init || currentDate < day,
        }"
      >
        {{ day.toString().padStart(2, '0') }}
      </div>
      <NuxtLink
        v-else
        :to="
          `${year}${(month + 1).toString().padStart(2, '0')}${(day + 1)
            .toString()
            .padStart(2, '0')}` <
          `${year}${(month + 1).toString().padStart(2, '0')}${(currentDate + 1)
            .toString()
            .padStart(2, '0')}`
            ? toLink(day)
            : '/'
        "
        class="cursor-pointer w-full h-full font-extralight border bg-neutral-400/10 dark:bg-white/10 border-neutral-400/15 dark:border-white/10 items-center justify-items-center grid rounded hover:bg-neutral-400/20 dark:hover:bg-white/20"
        :class="{
          'dark:!border-white/75 !border-neutral-400/75 border font-bold':
            day === Number(route.params.id?.slice(-2)) ||
            (typeof route.params.id === 'undefined' && day === currentDate),
          '!bg-green-500/50 hover:!bg-green-500/75': state.has(
            `${year}${(month + 1).toString().padStart(2, '0')}${day
              .toString()
              .padStart(2, '0')}`
          ),
        }"
      >
        {{ day.toString().padStart(2, '0') }}
      </NuxtLink>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useStorage } from '@vueuse/core'

const route = useRoute()
const config = useRuntimeConfig()

const state = useStorage('answers', new Set())

const currentDate = new Date().getDate()
const month = new Date().getMonth()
const year = new Date().getFullYear()

const firstDay = new Date(2024, month, 1).getDay()
const daysInMonth = new Date(2024, month + 1, 0).getDate()
const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

// prettier-ignore
function toLink(day: number) {
  return '/' + year + (month + 1).toString().padStart(2, '0') + day.toString().padStart(2, '0')
}
</script>
