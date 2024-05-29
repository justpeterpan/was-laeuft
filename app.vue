<script lang="ts" setup>
const route = useRoute()

const date = new Date()
const today = `${date.getFullYear()}${(date.getMonth() + 1)
  .toString()
  .padStart(2, '0')}${date.getDate()}`

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

const slideDirection = ref<'slide-left' | 'slide-right'>('slide-right')

function handleSlide(direction: 'left' | 'right') {
  slideDirection.value = `slide-${direction}`
}

// watch(
//   () => route.params.id,
//   async (newId) => {
//     // console.log(newId)
//   }
// )

onMounted(() => {
  words.forEach((_, index) => {
    setTimeout(() => {
      isShown.value[index] = true
    }, index * 300)
  })
})

const words = ['guess', 'the', 'song']
const isShown = ref(words.map(() => false))
</script>

<template>
  <div class="grid justify-center place-content-center min-h-svh">
    <nav class="px-8 py-4 absolute w-full">
      <ul class="flex flex-row-reverse">
        <li class="mt-2">
          <UPopover
            :popper="{ placement: 'bottom', offsetDistance: -20 }"
            :ui="{
              width: 'max-w-max',
              base: 'h-32 px-2 py-1 text-sm font-thin italic font-serif p-4 relative',
            }"
            mode="hover"
          >
            <template #panel>
              <div class="">
                <p>1. Play the bass track and try to guess the song</p>
                <p>2. Type your guess and select your answer</p>
                <p>3. No clue? Skip the guess & play the next track</p>
                <p>4. Four rounds: bass, drums, vocals, instruments</p>
                <p>5. A new song challenge every day!</p>
              </div>
            </template>
            <UIcon
              name="i-heroicons-question-mark-circle"
              class="h-6 w-6 p-2"
            />
          </UPopover>
        </li>
      </ul>
    </nav>

    <div class="flex flex-row place-content-center items-center gap-1 pb-10">
      <NuxtLink to="/">
        <h1 class="text-2xl font-black drop-shadow-md font-serif">
          <span
            v-for="(word, index) in words"
            :key="index"
            :class="{ show: isShown[index] }"
          >
            {{ word }}
          </span>
        </h1>
      </NuxtLink>
      <sup class="text-xl font-black font-serif text-primary">♫</sup>
    </div>
    <NuxtPage :transition="{ name: slideDirection, mode: 'out-in' }" />
    <div class="mx-4 sm:mx-0 grid grid-flow-col grid-cols-3 pt-10 items-center">
      <NuxtLink
        v-if="updateDate(useRoute().params.id as string, -1) >= $config.public.init"
        :to="`/${updateDate(route.params.id as string, -1)}`"
        class="cursor-pointer max-w-min"
        @click="handleSlide('right')"
        ><UIcon name="i-heroicons-arrow-left-circle-solid" class="w-6 h-6"
      /></NuxtLink>
      <div class="place-self-center col-start-2">
        <UIcon name="i-heroicons-calendar-days-20-solid" class="w-6 h-6" />
      </div>
      <NuxtLink
        v-if="updateDate(route.params.id as string, 1) <= today"
        :to="updateDate(route.params.id as string, 1) < today ? `/${updateDate(route.params.id as string, 1)}` : '/'"
        class="cursor-pointer place-self-end col-start-3"
        @click="handleSlide('left')"
        ><UIcon name="i-heroicons-arrow-right-circle-solid" class="w-6 h-6"
      /></NuxtLink>
    </div>
  </div>
</template>

<style>
h1 {
  display: flex;
  gap: 0.5rem;
}

h1 span {
  display: inline-block;
  transform: translateY(100%);
  opacity: 0;
  transition: transform 0.5s ease, opacity 0.5s ease;
}

h1 span.show {
  transform: translateY(0);
  opacity: 1;
}

.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.2s;
}
.slide-left-enter-from {
  opacity: 0;
  transform: translate(50px, 0);
}
.slide-left-leave-to {
  opacity: 0;
  transform: translate(-50px, 0);
}
.slide-right-enter-from {
  opacity: 0;
  transform: translate(-50px, 0);
}
.slide-right-leave-to {
  opacity: 0;
  transform: translate(50px, 0);
}
</style>
