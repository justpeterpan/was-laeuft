import confetti from 'canvas-confetti'

function randomInRange(min: number, max: number) {
  return Math.random() * (max - min) + min
}

export function wow() {
  confetti({
    origin: { y: 0.5, x: 0.5 },
    angle: randomInRange(55, 125),
    spread: randomInRange(50, 70),
    particleCount: randomInRange(50, 100),
  })
}

export function mapMonthNumberToName(monthNumber: number) {
  switch (monthNumber) {
    case 1:
      return 'January'
    case 2:
      return 'February'
    case 3:
      return 'March'
    case 4:
      return 'April'
    case 5:
      return 'May'
    case 6:
      return 'June'
    case 7:
      return 'July'
    case 8:
      return 'August'
    case 9:
      return 'September'
    case 10:
      return 'October'
    case 11:
      return 'November'
    case 12:
      return 'December'
  }
}

export const numberAsString: { [key: number]: string } = {
  1: '1ˢᵗ',
  2: '2ⁿᵈ',
  3: '3ʳᵈ',
  4: '4ᵗʰ',
  5: '5ᵗʰ',
  6: '6ᵗʰ',
  7: '7ᵗʰ',
  8: '8ᵗʰ',
  9: '9ᵗʰ',
  10: '10ᵗʰ',
  11: '11ᵗʰ',
  12: '12ᵗʰ',
  13: '13ᵗʰ',
  14: '14ᵗʰ',
  15: '15ᵗʰ',
  16: '16ᵗʰ',
  17: '17ᵗʰ',
  18: '18ᵗʰ',
  19: '19ᵗʰ',
  20: '20ᵗʰ',
  21: '21ˢᵗ',
  22: '22ⁿᵈ',
  23: '23ʳᵈ',
  24: '24ᵗʰ',
  25: '25ᵗʰ',
  26: '26ᵗʰ',
  27: '27ᵗʰ',
  28: '28ᵗʰ',
  29: '29ᵗʰ',
  30: '30ᵗʰ',
  31: '31ˢᵗ',
}

const date = new Date()

export const today = `${date.getFullYear()}${(date.getMonth() + 1)
  .toString()
  .padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}`
