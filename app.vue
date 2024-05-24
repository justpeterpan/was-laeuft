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
