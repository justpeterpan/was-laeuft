<template>
  <div class="grid h-full w-full grid-cols-9 auto-cols-fr">
    <div class="place-self-center">
      <div
        v-if="monthFromParams + 1 !== +firstMonthWithSongs"
        class="max-w-max p-1 rounded-full cursor-pointer"
        @click="changeMonth(-1)"
      >
        <UIcon name="i-heroicons-chevron-left-16-solid" />
      </div>
    </div>
    <div
      class="grid grid-cols-7 place-items-center w-full h-full rounded gap-1 pt-8 pb-4 col-span-7"
      :class="[monthFromParams === 5 ? 'grid-rows-7' : 'grid-rows-6']"
    >
      <div
        class="absolute top-3 w-[50%] left-[25%] font-extralight font-serif italic"
      >
        <UDivider>
          {{ mapMonthNumberToName(monthFromParams + 1) }}
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
          v-if="
            dayOfMonth(day, 1) <= +init ||
            (monthFromParams + 1 >= currentMonth && currentDate < day)
          "
          class="w-full h-full font-extralight items-center justify-items-center grid rounded"
          :class="{
            'border bg-neutral-400/5 border-neutral-400/5 text-neutral-400/40 dark:text-white/10 dark:bg-white/5 dark:border-white/5':
              dayOfMonth(day, 1) <= +init || currentDate < day,
          }"
        >
          {{ day.toString().padStart(2, '0') }}
        </div>
        <NuxtLink
          v-else
          :to="dayOfMonth(day) < currentDay() ? toLink(day) : '/'"
          class="cursor-pointer w-full h-full font-extralight border bg-neutral-400/10 dark:bg-white/10 border-neutral-400/15 dark:border-white/10 items-center justify-items-center grid rounded hover:bg-neutral-400/20 dark:hover:bg-white/20"
          :class="{
            'dark:!border-white/75 !border-neutral-400/75 border font-bold':
              day === Number(id?.slice(-2)) ||
              (id === '' &&
                day === currentDate &&
                monthFromParams === currentMonthParams),
            '!bg-green-300/50 hover:!bg-green-300/75': state.has(
              dayOfMonth(day).toString()
            ),
          }"
          @click="setSlideDirection(dayOfMonth(day).toString(), id as string)"
        >
          {{ day.toString().padStart(2, '0') }}
        </NuxtLink>
      </div>
    </div>
    <div class="place-self-center">
      <div
        v-if="currentMonth > monthFromParams + 1"
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

// prettier-ignore
const { params: { id } } = useRoute()
// prettier-ignore
const { public: { init } } = useRuntimeConfig()

const state = useStorage('answers', new Set())

const firstMonthWithSongs = init.substring(4, 6)

const currentDate = new Date().getDate()
const currentMonth = new Date().getMonth() + 1

const currentMonthParams = ref(
  id !== '' ? +id?.slice(4, 6) - 1 : currentMonth - 1
)
const monthFromParams = ref(id !== '' ? +id?.slice(4, 6) - 1 : currentMonth - 1)
const year = ref(new Date().getFullYear())

const firstDay = computed(() =>
  new Date(2024, monthFromParams.value, 1).getDay()
)
const daysInMonth = computed(() =>
  new Date(2024, monthFromParams.value + 1, 0).getDate()
)
const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

// prettier-ignore
function toLink(day: number) {
  return '/' + year.value + (monthFromParams.value + 1).toString().padStart(2, '0') + day.toString().padStart(2, '0')
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

function dayOfMonth(day: number, offset: number = 0) {
  return parseInt(
    `${year.value}${(monthFromParams.value + 1).toString().padStart(2, '0')}${(
      day + offset
    )
      .toString()
      .padStart(2, '0')}`
  )
}

function currentDay() {
  return parseInt(
    `${year.value}${currentMonth.toString().padStart(2, '0')}${currentDate
      .toString()
      .padStart(2, '0')}`
  )
}

function changeMonth(direction: number) {
  monthFromParams.value += direction
}
</script>
