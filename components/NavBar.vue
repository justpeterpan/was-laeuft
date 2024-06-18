<template>
  <nav class="px-8 py-4 absolute w-full">
    <ul class="flex flex-row-reverse">
      <li class="mt-2">
        <UPopover
          :popper="{ placement: 'bottom', offsetDistance: -20 }"
          :ui="{
            width: 'max-w-max',
            base: 'h-32 px-2 py-1 text-sm font-thin italic font-serif p-4 relative',
          }"
          mode="hover"
        >
          <template #panel>
            <div class="">
              <p>1. Play the bass track and try to guess the song</p>
              <p>2. Type your guess and select your answer</p>
              <p>3. No clue? Skip the guess & play the next track</p>
              <p>4. Four rounds: bass, drums, vocals, instruments</p>
              <p>5. A new song challenge every day!</p>
            </div>
          </template>
          <UIcon name="i-heroicons-question-mark-circle" class="h-6 w-6 p-2" />
        </UPopover>
      </li>
    </ul>
  </nav>
</template>
