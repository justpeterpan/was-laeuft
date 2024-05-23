export default defineEventHandler(async (event) => {
  type result = {
    results: {
      trackmatches: {
        track: any[]
      }
    }
  }
  const config = useRuntimeConfig()
  const { searchQuery } = await readBody(event)
  console.log('searchQuery', searchQuery)
  const response = await $fetch<result>(
    `http://ws.audioscrobbler.com/2.0/?method=track.search&track=${searchQuery}&api_key=${config.lastfm}&format=json`
  )
  return response
})
