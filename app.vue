<script lang="ts" setup>
const searchQuery = defineModel('searchQuery', { type: String, default: '' })
const bass = ref() as Ref<HTMLAudioElement>
const drums = ref() as Ref<HTMLAudioElement>
const vocal = ref() as Ref<HTMLAudioElement>
const instru = ref() as Ref<HTMLAudioElement>
const searchHits = ref('')

function playBass() {
  bass.value.play()
}
function pauseBass() {
  bass.value.pause()
}
function stopBass() {
  bass.value.pause()
  bass.value.currentTime = 0
}
async function search() {
  console.log(searchQuery.value)
  const res = await $fetch('/api/l', {
    method: 'POST',
    body: JSON.stringify({ searchQuery: searchQuery.value }),
  })
  searchHits.value = res.results.trackmatches.track
}
</script>

<template>
  <div>
    <button @click="playBass">play</button>
    <button @click="pauseBass">pause</button>
    <button @click="stopBass">stop</button>
    <audio src="./data/dbtml/bass.mp3" ref="bass" />
    <audio src="./data/dbtml/drums.mp3" ref="drums" />
    <audio src="./data/dbtml/vocal.mp3" ref="vocal" />
    <audio src="./data/dbtml/instru.mp3" ref="instru" />
  </div>

  <input type="text" v-model="searchQuery" />
  <button @click="search">Search</button>
  {{ searchHits }}
</template>
