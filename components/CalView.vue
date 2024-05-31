<template>
  <div class="grid h-full w-full grid-cols-9 auto-cols-fr">
    <div class="place-self-center">
      <div
        v-if="month + 1 !== +init.substring(4, 6)"
        class="max-w-max p-1 rounded-full cursor-pointer"
        @click="changeMonth(-1)"
      >
        <UIcon name="i-heroicons-chevron-left-16-solid" />
      </div>
    </div>
    <div
      class="grid grid-cols-7 place-items-center w-full h-full rounded gap-1 pt-8 pb-4 col-span-7"
      :class="[month === 5 ? 'grid-rows-7' : 'grid-rows-6']"
    >
      <div
        class="absolute top-3 w-[50%] left-[25%] font-extralight font-serif italic"
      >
        <UDivider>
          {{ mapMonthNumberToName(month + 1) }}
        </UDivider>
      </div>
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
          v-if="dateToCompare(day) <= init || currentDate < day"
          class="w-full h-full font-extralight items-center justify-items-center grid rounded"
          :class="{
            'border-primary border-2 font-bold':
              day === Number(route.params.id?.slice(-2)) ?? currentDate,
            'border bg-neutral-400/5 border-neutral-400/5 text-neutral-400/40 dark:text-white/10 dark:bg-white/5 dark:border-white/5':
              `${year}${(month + 1).toString().padStart(2, '0')}${(day + 1)
                .toString()
                .padStart(2, '0')}` <= init || currentDate < day,
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
            `${year}${(month + 1).toString().padStart(2, '0')}${(
              currentDate + 1
            )
              .toString()
              .padStart(2, '0')}`
              ? toLink(day)
              : '/'
          "
          class="cursor-pointer w-full h-full font-extralight border bg-neutral-400/10 dark:bg-white/10 border-neutral-400/15 dark:border-white/10 items-center justify-items-center grid rounded hover:bg-neutral-400/20 dark:hover:bg-white/20"
          :class="{
            'dark:!border-white/75 !border-neutral-400/75 border font-bold':
              day === Number(route.params.id?.slice(-2)) ||
              (route.params.id === '' && day === currentDate),
            '!bg-green-300/50 hover:!bg-green-300/75': state.has(
              `${year}${(month + 1).toString().padStart(2, '0')}${day
                .toString()
                .padStart(2, '0')}`
            ),
          }"
          @click="
            setSlideDirection(
              `${year}${(month + 1).toString().padStart(2, '0')}${day
                .toString()
                .padStart(2, '0')}`,
              route.params.id as string
            )
          "
        >
          {{ day.toString().padStart(2, '0') }}
        </NuxtLink>
      </div>
    </div>
    <div class="place-self-center">
      <div
        v-if="new Date().getMonth() + 1 > month + 1"
        class="max-w-max p-1 rounded-full place-self-center cursor-pointer"
        @click="changeMonth(1)"
      >
        <UIcon name="i-heroicons-chevron-right-16-solid" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useStorage } from '@vueuse/core'

const route = useRoute()
// prettier-ignore
const { public: { init } } = useRuntimeConfig()

const state = useStorage('answers', new Set())

const currentDate = new Date().getDate()
const month = ref(new Date().getMonth())
const year = ref(new Date().getFullYear())

const firstDay = computed(() => new Date(2024, month.value, 1).getDay())
const daysInMonth = computed(() => new Date(2024, month.value + 1, 0).getDate())
const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function dateToCompare(day: number) {
  return `${year.value}${(month.value + 1).toString().padStart(2, '0')}${(
    day + 1
  )
    .toString()
    .padStart(2, '0')}`
}

// prettier-ignore
function toLink(day: number) {
  return '/' + year.value + (month.value + 1).toString().padStart(2, '0') + day.toString().padStart(2, '0')
}

const emit = defineEmits(['closePopup'])
const useDirection = useSlideDirection()

function setSlideDirection(toDate: string, fromDate: string | undefined) {
  if (fromDate && toDate > fromDate) {
    useDirection.value = 'slide-left'
  } else {
    useDirection.value = 'slide-right'
  }
  emit('closePopup', true)
}

function changeMonth(direction: number) {
  month.value += direction
}
</script>
