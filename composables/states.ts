export const useSlideDirection = () =>
  useState<'slide-left' | 'slide-right'>('direction', () => 'slide-right')
