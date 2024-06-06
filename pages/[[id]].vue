<script lang="ts" setup>
import { useDebounceFn, useStorage } from '@vueuse/core'
import confetti from 'canvas-confetti'

definePageMeta({
  middleware: 'redirect',
})

const { params } = useRoute()
const toast = useToast()

const state = useStorage('answers', new Set())

const { year, artist, cover, views, link, short, title } = await $fetch(
  '/api/s',
  {
    lazy: true,
    server: false,
    method: 'POST',
    body: JSON.stringify({ d: params.id ? params.id : today }),
  }
)

function randomInRange(min: number, max: number) {
  return Math.random() * (max - min) + min
}

function wow() {
  confetti({
    origin: { y: 0.5, x: 0.5 },
    angle: randomInRange(55, 125),
    spread: randomInRange(50, 70),
    particleCount: randomInRange(50, 100),
  })
}

const currentDate = params.id
  ? (params.id as string).substring(6, 8)
  : today.substring(6, 8)
const currentMonth = params.id
  ? (params.id as string).substring(4, 6)
  : today.substring(4, 6)

const searchQuery = defineModel('searchQuery', { type: String, default: '' })
const currentRound = ref(alreadyAnswered() ? 4 : 0)
const bass = ref() as Ref<HTMLAudioElement>
const drums = ref() as Ref<HTMLAudioElement>
const vocals = ref() as Ref<HTMLAudioElement>
const instru = ref() as Ref<HTMLAudioElement>
const isPlaying = ref(false)
const searchHits = ref()
const answer = ref('')
const correctlyAnswered = ref(false)
const playLabel = ref(alreadyAnswered() ? 'track' : 'bass')
const currentTime = ref(0)
const duration = ref(0)

function alreadyAnswered() {
  return params.id ? state.value.has(params.id) : state.value.has(today)
}

const progress = computed(() => {
  return duration.value ? (currentTime.value / duration.value) * 100 : 0
})

async function search() {
  const res = await $fetch('/api/l', {
    method: 'POST',
    body: JSON.stringify({ searchQuery: searchQuery.value }),
  })
  searchHits.value = res
}

const handleInput = useDebounceFn(async () => {
  await search()
}, 300)

function selectAnswer(index: number) {
  const selectedHit = searchHits.value[index]
  searchHits.value = []
  answer.value = `${selectedHit.artist} - ${selectedHit.name}`
  searchQuery.value = answer.value

  const normalizedAnswer = answer.value.toLowerCase().trim()
  const normalizedTitle = title.toLowerCase().trim()
  const normalizedArtist = artist.toLowerCase().trim()

  if (
    normalizedAnswer.includes(normalizedTitle) &&
    normalizedAnswer.includes(normalizedArtist)
  ) {
    state.value.add(params.id ? params.id : today)
    correctlyAnswered.value = true
    stopCurrentStem()
    setTimeout(() => {
      skipCurrentRound(4)
    }, 100)
    isPlaying.value = true
    wow()
  } else {
    toast.add({
      icon: 'i-heroicons-hand-raised',
      title: 'Incorrect',
      closeButton: undefined,
      description: 'Try again!',
      timeout: 3500,
    })
    skipCurrentRound()
    stopCurrentStem()
    answer.value = ''
    searchQuery.value = ''
  }
}

function playCurrentStem() {
  if (isPlaying.value) {
    pauseCurrentStem()
    isPlaying.value = false
    return
  }

  isPlaying.value = true
  const stems = [bass.value, drums.value, vocals.value, instru.value]
  for (let i = 0; i <= currentRound.value; i++) {
    stems[i]?.play()
  }
}

function pauseCurrentStem() {
  const stems = [bass.value, drums.value, vocals.value, instru.value]
  for (let i = 0; i <= currentRound.value; i++) {
    stems[i]?.pause()
  }
}
function stopCurrentStem() {
  const stems = [bass.value, drums.value, vocals.value, instru.value]
  for (let i = 0; i <= currentRound.value; i++) {
    stems[i]?.pause()
    if (stems[i]) stems[i].currentTime = 0
  }
}

function skipCurrentRound(skip = 1) {
  currentRound.value += skip
  isPlaying.value = false
  if (currentRound.value <= 4) stopCurrentStem()
  if (currentRound.value === 1) playLabel.value = 'drums'
  if (currentRound.value === 2) playLabel.value = 'vocals'
  if (currentRound.value >= 3) playLabel.value = 'track'
  if (currentRound.value > 3) playCurrentStem()
}
function audioSrc(short: string, stem: string) {
  return `${useRuntimeConfig().public.bucket}/${short}/${stem}.mp3`
}

onMounted(() => {
  currentTime.value = bass.value.currentTime
})

onUpdated(() => {
  duration.value = bass.value.duration
})

watch(bass, (newValue) => {
  bass.value.ontimeupdate = () => {
    currentTime.value = newValue.currentTime
  }
  bass.value.onended = () => {
    isPlaying.value = false
    setTimeout(() => {
      currentTime.value = 0
    }, 500)
  }
})
</script>

<template>
  <div class="grid justify-center place-content-center">
    <div
      class="grid justify-center sm:border border-white/15 sm:p-10 sm:rounded-lg sm:shadow-md"
    >
      <div class="mx-4 text-center font-black font-serif pb-4">
        <span v-if="!alreadyAnswered() && currentRound < 4"
          >{{ numberAsString[currentRound + 1] }} of 4 rounds on
        </span>
        {{ mapMonthNumberToName(+currentMonth) }},
        {{ numberAsString[+currentDate] }}
      </div>
      <div
        v-if="currentRound < 4"
        class="grid gap-1 sm:gap-4 m-4 w-[300px] sm:w-[350px]"
        :class="[
          alreadyAnswered() || currentRound >= 4
            ? 'grid-cols-1'
            : 'grid-cols-2',
        ]"
      >
        <button
          @click="playCurrentStem()"
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
          v-if="!alreadyAnswered() && currentRound < 4"
          @click="skipCurrentRound()"
          class="rounded flex flex-row items-center justify-center flex-grow gap-1 shadow-sm border px-4 py-2"
        >
          <UIcon name="i-heroicons-arrow-right-circle" class="text-lg" />skip
          guess
        </button>
      </div>
      <div class="hidden">
        <audio :src="audioSrc(short, 'bass')" ref="bass" />
        <audio :src="audioSrc(short, 'drums')" ref="drums" />
        <audio :src="audioSrc(short, 'vocals')" ref="vocals" />
        <audio :src="audioSrc(short, 'instru')" ref="instru" />
      </div>

      <div
        v-if="currentRound < 4"
        class="mx-4 text-sm sm:text-base font-thin py-2 flex flex-row gap-1"
      >
        <div>
          YouTube views:
          {{ !alreadyAnswered() && currentRound < 1 ? '???' : views }}
        </div>
        <div>|</div>
        <div>
          Year of release:
          {{ !alreadyAnswered() && currentRound < 2 ? '???' : year }}
        </div>
      </div>

      <input
        v-if="!alreadyAnswered() && currentRound < 4"
        type="text"
        v-model="searchQuery"
        @input="handleInput"
        placeholder="type your guess here..."
        class="mx-4 mt-8 mb-2 max-w-[300px] sm:max-w-[350px] p-2 border-b border-neutral-300 border-dotted bg-transparent"
      />

      <div
        v-if="currentRound < 4"
        class="max-w-[300px] sm:max-w-[350px] min-h-4 max-h-[190px]"
      >
        <ul class="m-4 max-h-[450px]">
          <li
            v-for="(hit, index) of searchHits"
            :key="hit.name + hit.artist"
            @click="selectAnswer(index)"
            class="cursor-pointer border-b border-dotted border-neutral-300 truncate w-[300px] sm:w-[350px] my-2 px-2"
          >
            {{ hit.artist }} - {{ hit.name }}
          </li>
        </ul>
      </div>

      <div
        v-if="alreadyAnswered() || correctlyAnswered || currentRound > 3"
        class="max-w-[300px] sm:max-w-[350px] m-4"
      >
        <p v-if="!alreadyAnswered()" class="italic font-serif font-medium pb-2">
          {{
            correctlyAnswered
              ? 'Well done!'
              : 'No worries! Better luck next time!'
          }}
        </p>
        <div>
          <div class="relative grid items-center place-items-center">
            <img
              :src="cover"
              alt="album cover of the song"
              class="mb-2 w-[300px] sm:w-[350px] shadow-md border border-neutral-300 rounded-lg"
            />
            <div
              class="absolute bottom-2 rounded-bl-lg rounded-br-lg h-4 w-full"
              :style="{
                background: `linear-gradient(to right, #FACC15 ${progress}%, transparent ${progress}%)`,
              }"
            />
            <div
              class="absolute cursor-pointer pt-2 pb-0.5 px-2 bg-black/80 rounded-full opacity-90"
              @click="playCurrentStem()"
            >
              <UIcon
                :name="
                  isPlaying
                    ? 'i-heroicons-pause-circle'
                    : 'i-heroicons-play-circle-16-solid'
                "
                class="w-8 h-8 shadow-md bg-white rounded-full"
              />
            </div>
          </div>
          <NuxtLink
            :to="link"
            target="_blank"
            class="flex flex-row items-center gap-2"
          >
            ♫ {{ artist }} - {{ title }} ({{ year }})
          </NuxtLink>
        </div>
      </div>
    </div>
    <UNotifications color="primary" />
  </div>
</template>
