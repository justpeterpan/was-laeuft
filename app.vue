<script lang="ts" setup>
import { useDebounceFn } from '@vueuse/core'
useHead({
  htmlAttrs: { lang: 'en' },
  title: 'Guess the Song ♫',
  bodyAttrs: { class: 'bg-neutral-50' },
})
const id = useId()

const { artist, title, link, views, year } = await $fetch('/api/s')

const searchQuery = defineModel('searchQuery', { type: String, default: '' })
const currentRound = ref(0)
const bass = ref() as Ref<HTMLAudioElement>
const drums = ref() as Ref<HTMLAudioElement>
const vocal = ref() as Ref<HTMLAudioElement>
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
    skipCurrentRound(3)
  } else {
    skipCurrentRound()
  }
  stopCurrentStem()
  playCurrentStem()
}

function playCurrentStem() {
  const stems = [bass.value, drums.value, vocal.value, instru.value]
  for (let i = 0; i <= currentRound.value; i++) {
    stems[i]?.play()
  }
}

function pauseCurrentStem() {
  const stems = [bass.value, drums.value, vocal.value, instru.value]
  for (let i = 0; i <= currentRound.value; i++) {
    stems[i]?.pause()
  }
}
function stopCurrentStem() {
  const stems = [bass.value, drums.value, vocal.value, instru.value]
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
}
</script>

<template>
  <div class="grid justify-center place-content-center h-screen">
    <h1 class="text-2xl font-black mx-4 pb-10 drop-shadow-md">
      guess the song <sup>♫</sup>
    </h1>
    <div class="font-thin italic font-serif m-4 md:m-0 pb-8">
      <p>1. Play the bass track and try to guess the song</p>
      <p>2. Search for the song and select your answer</p>
      <p>3. No clue? Skip the guess & play the next track</p>
      <p>4. Four rounds: bass, drums, vocals, instruments</p>
    </div>
    <div class="flex flex-row justify-between m-4 w-[350px] list">
      <button
        @click="playCurrentStem()"
        class="rounded shadow-sm border px-4 py-2"
      >
        🔈️ {{ playLabel }}
      </button>
      <button
        @click="pauseCurrentStem"
        class="rounded shadow-sm border px-4 py-2"
      >
        ⏸️ pause
      </button>
      <button
        @click="stopCurrentStem"
        class="rounded shadow-sm border px-4 py-2"
      >
        ⏹️ stop
      </button>
      <audio src="/dbtml/bass.mp3" ref="bass" />
      <audio src="/dbtml/drums.mp3" ref="drums" />
      <audio src="/dbtml/vocals.mp3" ref="vocal" />
      <audio src="/dbtml/instru.mp3" ref="instru" />
    </div>

    <input
      type="text"
      v-model="searchQuery"
      @input="handleInput"
      placeholder="search song"
      class="m-4 max-w-[350px] p-2 border-b border-neutral-300 border-dotted bg-neutral-50"
    />

    <div v-if="!answer" class="max-w-[350px]">
      <ClientOnly>
        <TransitionGroup name="list" tag="ul" class="m-4 max-h-[450px]">
          <li
            v-for="(hit, index) of searchHits"
            :key="id"
            @click="selectAnswer(index)"
            class="cursor-pointer border-b border-dotted border-neutral-300 truncate w-[350px] my-2 px-2"
          >
            {{ hit.artist }} - {{ hit.name }}
          </li>
        </TransitionGroup>
      </ClientOnly>
    </div>
    <button
      @click="skipCurrentRound()"
      class="border rounded shadow-sm m-4 p-2 w-[350px]"
    >
      ⏭️ Skip Guess
    </button>
    <div v-if="correctlyAnswered || currentRound > 3" class="max-w-[350px] m-4">
      <p class="italic font-serif font-medium pb-2">
        Well done! You guessed it right! (or maybe not)
      </p>
      <NuxtLink :to="link" target="_blank">
        📺 {{ artist }} - {{ title }}
      </NuxtLink>
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
