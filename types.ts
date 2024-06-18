type Song = {
  views: string
  year: number
  link: string
  title: string
  artist: string
  cover: string
  short: string
}

export type SongsData = { [date: string]: Song }
