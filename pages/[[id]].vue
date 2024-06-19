<script lang="ts" setup>
import { useDebounceFn, useStorage } from '@vueuse/core'
import type { SongsData } from '~/types'

definePageMeta({ middleware: 'redirect' })

const { params } = useRoute()
const toast = useToast()
const state = useStorage('answers', new Set())

const props = defineProps<{ songs: SongsData }>()

const s = computed(() => props.songs[params.id ? (params.id as string) : today])

const currentDate = params.id
  ? (params.id as string).substring(6, 8)
  : today.substring(6, 8)
const currentMonth = params.id
  ? (params.id as string).substring(4, 6)
  : today.substring(4, 6)

const searchQuery = ref('')
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

const normalize = (t: string) => t.toLowerCase().trim()

function selectAnswer(index: number) {
  const { artist, name } = searchHits.value[index]
  searchHits.value = []
  answer.value = `${artist} - ${name}`
  searchQuery.value = answer.value

  const normalizedAnswer = normalize(answer.value)
  const normalizedTitle = normalize(s.value.title)
  const normalizedArtist = normalize(s.value.artist)

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
    if (stems[i]) stems[i].currentTime = 0
  }

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

onMounted(() => {
  bass.value.load()
  drums.value.load()
  vocals.value.load()
  instru.value.load()
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
const filepath = computed(() => `/stems/${s.value.short}`)
</script>

<template>
  <div class="grid justify-center place-content-center">
    <div
      class="grid justify-center sm:border border-white/15 sm:p-10 sm:rounded-lg sm:shadow-md"
    >
      <div class="hidden">
        <audio :src="`${filepath}/bass.mp3`" ref="bass" preload="auto" />
        <audio :src="`${filepath}/drums.mp3`" ref="drums" preload="auto" />
        <audio :src="`${filepath}/vocals.mp3`" ref="vocals" preload="auto" />
        <audio :src="`${filepath}/instru.mp3`" ref="instru" preload="auto" />
      </div>

      <RoundAndDate
        :current-round="currentRound"
        :already-answered="alreadyAnswered()"
        :current-date="currentDate"
        :current-month="currentMonth"
      />
      <ControlButtons
        :current-round="currentRound"
        :already-answered="alreadyAnswered()"
        :progress="progress"
        :is-playing="isPlaying"
        :play-label="playLabel"
        @skip-current-round="skipCurrentRound"
        @play-current-stem="playCurrentStem"
      />

      <SongDetails
        :current-round="currentRound"
        :already-answered="alreadyAnswered()"
        :views="s.views"
        :year="s.year"
      />

      <SongSearch
        :current-round="currentRound"
        :already-answered="alreadyAnswered()"
        @handle-input="handleInput"
        v-model="searchQuery"
      />

      <SongResults
        :current-round="currentRound"
        :search-hits="searchHits"
        @select-answer="selectAnswer($event)"
      />

      <WinView
        :current-round="currentRound"
        :already-answered="alreadyAnswered()"
        :correctly-answered="correctlyAnswered"
        :progress="progress"
        :is-playing="isPlaying"
        :cover="s.cover"
        :link="s.link"
        :title="s.title"
        :artist="s.artist"
        :year="s.year"
        @play-current-stem="playCurrentStem"
      />
    </div>
    <UNotifications color="primary" />
  </div>
</template>
