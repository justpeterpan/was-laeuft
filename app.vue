<script lang="ts" setup>
import { useDebounceFn } from '@vueuse/core'
import confetti from 'canvas-confetti'

const colorMode = useColorMode()
const isDark = computed(() => colorMode.value === 'dark')
const toast = useToast()

useHead({
  htmlAttrs: { lang: 'en' },
  title: 'Guess the Song ♫',
  link: [
    { rel: 'icon', type: 'image/png', href: '/favicon.png' },
    { rel: 'apple-touch-icon', type: 'image/png', href: '/favicon.png' },
  ],
})

const { query } = useRoute()

const { year, artist, cover, views, link, short, title } = await $fetch(
  '/api/s',
  {
    method: 'POST',
    body: JSON.stringify({ d: query.d }),
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

const roundNumberAsString: { [key: number]: string } = {
  1: '1ˢᵗ',
  2: '2ⁿᵈ',
  3: '3ʳᵈ',
  4: '4ᵗʰ',
}

const searchQuery = defineModel('searchQuery', { type: String, default: '' })
const currentRound = ref(0)
const bass = ref() as Ref<HTMLAudioElement>
const drums = ref() as Ref<HTMLAudioElement>
const vocals = ref() as Ref<HTMLAudioElement>
const instru = ref() as Ref<HTMLAudioElement>
const isPlaying = ref(false)
const searchHits = ref()
const answer = ref('')
const correctlyAnswered = ref(false)
const playLabel = ref('bass')
const currentTime = ref(0)
const duration = ref(0)

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
}, 100)

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
      timeout: 1500,
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
  return `/${short}/${stem}.mp3`
}

onMounted(() => {
  currentTime.value = bass.value.currentTime
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
  <div class="grid justify-center place-content-center h-screen">
    <div
      class="grid justify-center sm:border sm:p-10 sm:rounded-lg sm:shadow-md"
    >
      <div class="flex flex-row items-center mx-4 gap-1 pb-10">
        <NuxtLink to="/">
          <h1 class="text-2xl font-black drop-shadow-md font-serif">
            guess the song
          </h1>
        </NuxtLink>
        <UTooltip
          :popper="{ placement: 'bottom', offsetDistance: -6, arrow: true }"
          :ui="{
            width: 'max-w-max',
            base: '[@media(pointer:coarse)]:hidden h-32 px-2 py-1 text-sm font-thin italic font-serif p-4 relative',
          }"
        >
          <template #text class="h-96">
            <div class="">
              <p>1. Play the bass track and try to guess the song</p>
              <p>2. Search for the song and select your answer</p>
              <p>3. No clue? Skip the guess & play the next track</p>
              <p>4. Four rounds: bass, drums, vocals, instruments</p>
              <p>5. A new song challenge every day!</p>
            </div>
          </template>
          <sup class="text-xl font-black font-serif text-primary">♫</sup>
        </UTooltip>
      </div>

      <div
        class="mx-4 font-thin rounded border py-2 text-center flex flex-row justify-center gap-1 items-center"
      >
        YouTube views: {{ views }} | Year of release: {{ year }}
      </div>
      <div
        class="grid gap-2 m-4 w-[350px]"
        :class="[currentRound >= 4 ? 'grid-cols-1' : 'grid-cols-2']"
      >
        <ClientOnly>
          <button
            @click="playCurrentStem()"
            :style="{
              background: `linear-gradient(to right, #FACC15 ${progress}%, ${
                isDark ? '#121212' : '#fff'
              } ${progress}%)`,
            }"
            class="rounded flex flex-row items-center justify-center flex-grow gap-1 shadow-sm border px-4 py-2"
          >
            <UIcon
              :name="
                isPlaying
                  ? 'i-heroicons-pause-circle'
                  : 'i-heroicons-play-circle'
              "
              class="text-lg align-middle"
            />
            <span class="align-middle">{{ playLabel }}</span>
          </button>
        </ClientOnly>
        <button
          v-if="currentRound < 4"
          @click="skipCurrentRound()"
          class="rounded flex flex-row items-center justify-center flex-grow gap-1 shadow-sm border px-4 py-2"
        >
          <UIcon name="i-heroicons-arrow-right-circle" class="text-lg" />skip
          guess
        </button>

        <audio :src="audioSrc(short, 'bass')" ref="bass" preload="auto" />
        <audio :src="audioSrc(short, 'drums')" ref="drums" />
        <audio :src="audioSrc(short, 'vocals')" ref="vocals" />
        <audio :src="audioSrc(short, 'instru')" ref="instru" />
      </div>

      <input
        v-if="currentRound < 4"
        type="text"
        v-model="searchQuery"
        @input="handleInput"
        placeholder="enter song title..."
        class="m-4 max-w-[350px] p-2 border-b border-neutral-300 border-dotted"
      />

      <div
        v-if="!answer || (!correctlyAnswered && currentRound < 3)"
        class="max-w-[350px] min-h-4 max-h-[190px]"
      >
        <ClientOnly>
          <ul class="m-4 max-h-[450px]">
            <li
              v-for="(hit, index) of searchHits"
              :key="hit.name + hit.artist"
              @click="selectAnswer(index)"
              class="cursor-pointer border-b border-dotted border-neutral-300 truncate w-[350px] my-2 px-2"
            >
              {{ hit.artist }} - {{ hit.name }}
            </li>
          </ul>
        </ClientOnly>
      </div>
      <div
        v-if="currentRound < 4"
        class="mx-4 text-center font-black font-serif"
      >
        {{ roundNumberAsString[currentRound + 1] }} of 4 rounds
      </div>

      <div
        v-if="correctlyAnswered || currentRound > 3"
        class="max-w-[350px] m-4"
      >
        <p class="italic font-serif font-medium pb-2">
          {{
            correctlyAnswered
              ? 'Well done!'
              : 'No worries! Better luck next time!'
          }}
        </p>
        <div>
          <img
            :src="cover"
            alt="album cover of the song"
            class="mb-2 w-[350px] shadow-md border border-neutral-300 rounded-md"
          />
          <NuxtLink :to="link" target="_blank">
            <span class="text-[10px] align-middle">📺</span> {{ artist }} -
            {{ title }} (YouTube)
          </NuxtLink>
        </div>
      </div>
    </div>
    <UNotifications color="primary" />
  </div>
</template>
