<script lang="ts" setup>
import { useDebounceFn } from '@vueuse/core'
import confetti from 'canvas-confetti'

useHead({
  htmlAttrs: { lang: 'en' },
  title: 'Guess the Song ♫',
  bodyAttrs: { class: 'bg-neutral-50' },
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

const searchQuery = defineModel('searchQuery', { type: String, default: '' })
const currentRound = ref(0)
const bass = ref() as Ref<HTMLAudioElement>
const drums = ref() as Ref<HTMLAudioElement>
const vocals = ref() as Ref<HTMLAudioElement>
const instru = ref() as Ref<HTMLAudioElement>
const searchHits = ref()
const answer = ref('')
const correctlyAnswered = ref(false)
const playLabel = ref('bass')

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
    skipCurrentRound(4)
    playCurrentStem()
    wow()
  } else {
    skipCurrentRound()
    answer.value = ''
    searchQuery.value = ''
  }
}

function playCurrentStem() {
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
  stopCurrentStem()
  if (currentRound.value === 1) playLabel.value = 'drums'
  if (currentRound.value === 2) playLabel.value = 'vocals'
  if (currentRound.value === 3) playLabel.value = 'track'
  if (currentRound.value > 3) playCurrentStem()
}
function audioSrc(short: string, stem: string) {
  return `/${short}/${stem}.mp3`
}
</script>

<template>
  <div class="grid justify-center place-content-center h-screen">
    <div
      class="grid justify-center sm:border sm:p-10 sm:rounded-lg sm:shadow-md"
    >
      <h1 class="text-2xl font-black mx-4 pb-10 drop-shadow-md font-serif">
        guess the song <sup class="text-lg">♫</sup>
      </h1>
      <div
        v-if="currentRound === 0"
        class="font-thin italic font-serif m-4 md:m-0 pb-8"
      >
        <p>1. Play the bass track and try to guess the song</p>
        <p>2. Search for the song and select your answer</p>
        <p>3. No clue? Skip the guess & play the next track</p>
        <p>4. Four rounds: bass, drums, vocals, instruments</p>
        <p>5. A new song challenge every day!</p>
      </div>
      <div class="mx-4 font-thin rounded border py-2 text-center">
        <span class="text-[12px] align-middle">ℹ️</span>️ YouTube views:
        {{ views }} | Year of release: {{ year }}
      </div>
      <div class="flex flex-row justify-between m-4 w-[350px] list">
        <button
          @click="playCurrentStem()"
          class="rounded shadow-sm border px-4 py-2"
        >
          <span class="text-[12px] align-middle pb-2">️🔊</span> {{ playLabel }}
        </button>
        <button
          @click="pauseCurrentStem"
          class="rounded shadow-sm border px-4 py-2"
        >
          <span class="text-[12px] align-middle">⏸️</span> pause
        </button>
        <button
          @click="stopCurrentStem"
          class="rounded shadow-sm border px-4 py-2"
        >
          <span class="text-[12px] align-middle">⏹️</span> stop
        </button>
        <audio :src="audioSrc(short, 'bass')" ref="bass" />
        <audio :src="audioSrc(short, 'drums')" ref="drums" />
        <audio :src="audioSrc(short, 'vocals')" ref="vocals" />
        <audio :src="audioSrc(short, 'instru')" ref="instru" />
      </div>

      <input
        v-if="currentRound < 4"
        type="text"
        v-model="searchQuery"
        @input="handleInput"
        placeholder="search song"
        class="m-4 max-w-[350px] p-2 border-b border-neutral-300 border-dotted bg-neutral-50"
      />

      <div
        v-if="!answer || (!correctlyAnswered && currentRound < 3)"
        class="max-w-[350px]"
      >
        <ClientOnly>
          <TransitionGroup name="list" tag="ul" class="m-4 max-h-[450px]">
            <li
              v-for="(hit, index) of searchHits"
              :key="hit.name"
              @click="selectAnswer(index)"
              class="cursor-pointer border-b border-dotted border-neutral-300 truncate w-[350px] my-2 px-2"
            >
              {{ hit.artist }} - {{ hit.name }}
            </li>
          </TransitionGroup>
        </ClientOnly>
      </div>
      <div v-if="currentRound < 4" class="mx-4 text-center">
        {{ currentRound + 1 }} of 4 rounds
      </div>
      <button
        v-if="currentRound < 4"
        @click="skipCurrentRound()"
        class="border rounded shadow-sm m-4 p-2 w-[350px]"
      >
        <span class="text-[10px] align-middle">⏭️</span> Skip Guess
      </button>
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
  </div>
</template>

<style>
.list-enter-active,
.list-leave-active {
  transition: all 1.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
