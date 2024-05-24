export default defineEventHandler(async (event) => {
  type result = {
    results: {
      trackmatches: {
        track: { name: string; artist: string }[]
      }
    }
  }
  const config = useRuntimeConfig()
  const { searchQuery } = await readBody(event)
  const response = await $fetch<result>(
    `http://ws.audioscrobbler.com/2.0/?method=track.search&track=${searchQuery}&api_key=${config.lastfm}&format=json`
  )
  const slimResponse = response.results.trackmatches.track.map((track) => ({
    name: track.name,
    artist: track.artist,
  }))
  return slimResponse.slice(0, 5)
})
