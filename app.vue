<script lang="ts" setup>
import { useDebounceFn } from '@vueuse/core'
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
const playLabel = ref('play bass')

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
  answer.value = `${searchHits.value[index].artist} - ${searchHits.value[index].name}`
  searchQuery.value = `${searchHits.value[index].artist} - ${searchHits.value[index].name}`
  if (
    answer.value.toLowerCase().trim().includes(title.toLowerCase().trim()) &&
    answer.value.toLowerCase().trim().includes(artist.toLowerCase().trim())
  ) {
    correctlyAnswered.value = true
    skipCurrentRound(3)
    stopCurrentStem()
    playCurrentStem()
  } else {
    stopCurrentStem()
    skipCurrentRound()
  }
}

function playCurrentStem() {
  if (currentRound.value === 0) {
    bass.value.play()
  } else if (currentRound.value === 1) {
    bass.value.play()
    drums.value.play()
  } else if (currentRound.value === 2) {
    bass.value.play()
    drums.value.play()
    vocal.value.play()
  } else if (currentRound.value >= 3) {
    bass.value.play()
    drums.value.play()
    vocal.value.play()
    instru.value.play()
  }
}

function pauseCurrentStem() {
  if (currentRound.value === 0) {
    bass.value.pause()
  } else if (currentRound.value === 1) {
    bass.value.pause()
    drums.value.pause()
  } else if (currentRound.value === 2) {
    bass.value.pause()
    drums.value.pause()
    vocal.value.pause()
  } else if (currentRound.value >= 3) {
    bass.value.pause()
    drums.value.pause()
    vocal.value.pause()
    instru.value.pause()
  }
}

function stopCurrentStem() {
  if (currentRound.value === 0) {
    bass.value.pause()
    bass.value.currentTime = 0
  } else if (currentRound.value === 1) {
    bass.value.pause()
    bass.value.currentTime = 0
    drums.value.pause()
    drums.value.currentTime = 0
  } else if (currentRound.value === 2) {
    bass.value.pause()
    bass.value.currentTime = 0
    drums.value.pause()
    drums.value.currentTime = 0
    vocal.value.pause()
    vocal.value.currentTime = 0
  } else if (currentRound.value >= 3) {
    bass.value.pause()
    bass.value.currentTime = 0
    drums.value.pause()
    drums.value.currentTime = 0
    vocal.value.pause()
    vocal.value.currentTime = 0
    instru.value.pause()
    instru.value.currentTime = 0
  }
}
function skipCurrentRound(skip = 1) {
  currentRound.value += skip
  stopCurrentStem()
  if (currentRound.value === 1) playLabel.value = 'play bass & drums'
  if (currentRound.value === 2) playLabel.value = 'play bass & drums & vocals'
  if (currentRound.value === 3) playLabel.value = 'play track'
}
</script>

<template>
  <div>
    <div>
      <button @click="playCurrentStem()">{{ playLabel }}</button>
      <button @click="pauseCurrentStem">pause</button>
      <button @click="stopCurrentStem">stop</button>
      <audio src="./data/dbtml/bass.mp3" ref="bass" />
      <audio src="./data/dbtml/drums.mp3" ref="drums" />
      <audio src="./data/dbtml/vocal.mp3" ref="vocal" />
      <audio src="./data/dbtml/instru.mp3" ref="instru" />
    </div>

    <input
      type="text"
      v-model="searchQuery"
      @input="handleInput"
      placeholder="search song"
    />
    <button @click="skipCurrentRound()">Skip Guess</button>
    <div v-if="!answer">
      <ul>
        <li
          v-for="(hit, index) of searchHits"
          :key="id"
          @click="selectAnswer(index)"
          style="cursor: pointer; width: max-content"
        >
          {{ hit.artist }} - {{ hit.name }}
        </li>
      </ul>
    </div>
    <div v-if="correctlyAnswered || currentRound > 3">
      Well done! You guessed it right!
      <div>{{ artist }} - {{ title }}</div>
      <NuxtLink :to="link" target="_blank">youtube</NuxtLink>
    </div>
  </div>
</template>
