import songs from '~/data/songs.json'
export default defineEventHandler(async (event) => {
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
