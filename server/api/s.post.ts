type Song = {
  views: string;
  year: number;
  link: string;
  title: string;
  artist: string;
  cover: string;
  short: string;
};

type SongsData = {
  [date: string]: Song;
};



export default defineEventHandler(async (event) => {
  const songs = await $fetch<SongsData>(`${useRuntimeConfig().public.bucket}/songs.json`)
  const { d } = await readBody(event)
  if (!d) {
    const date = new Date()
    const today = `${date.getFullYear()}${(date.getMonth() + 1)
      .toString()
      .padStart(2, '0')}${date.getDate()}`
    return songs[today as keyof typeof songs]
  }
  return songs[d as keyof typeof songs]
})
