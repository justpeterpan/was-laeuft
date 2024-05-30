type Song = {
  views: string
  year: number
  link: string
  title: string
  artist: string
  cover: string
  short: string
}

type SongsData = {
  [date: string]: Song
}

export default defineEventHandler(async (event) => {
  // prettier-ignore
  const songs = await $fetch<SongsData>(`${useRuntimeConfig().public.bucket}/songs.json`)
  const { d } = await readBody(event)
  return songs[d as keyof typeof songs]
})
