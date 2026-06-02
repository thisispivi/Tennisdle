<script setup lang="ts">
import { GridCellState } from "../../../typings/Grid";

defineProps<{
  cellState: GridCellState;
  isSelecting: boolean;
  playerImage?: string;
}>();

defineEmits<{
  click: [];
}>();
</script>

<template>
  <div
    :class="[
      'grid-cell',
      {
        'grid-cell--empty': cellState.isEmpty,
        'grid-cell--correct': !cellState.isEmpty && cellState.isCorrect,
        'grid-cell--incorrect': !cellState.isEmpty && !cellState.isCorrect,
        'grid-cell--selecting': isSelecting,
      },
    ]"
    role="button"
    tabindex="0"
    @click="$emit('click')"
    @keydown.enter="$emit('click')"
    @keydown.space.prevent="$emit('click')"
  >
    <span v-if="cellState.isEmpty && !isSelecting" class="grid-cell__plus">
      <span class="grid-cell__plus-mark">+</span>
      <span class="grid-cell__plus-text">Pick</span>
    </span>
    <span v-else-if="isSelecting" class="grid-cell__selecting">
      <span></span><span></span><span></span>
    </span>
    <template v-else>
      <img
        v-if="playerImage"
        class="grid-cell__image"
        :src="playerImage"
        :alt="cellState.playerName ?? 'Player'"
      />
      <span class="grid-cell__shade"></span>
      <span class="grid-cell__status">{{
        cellState.isCorrect ? "✓" : "×"
      }}</span>
      <span class="grid-cell__player">{{ cellState.playerName }}</span>
    </template>
  </div>
</template>

<style lang="scss" scoped>
@use "../../../styles/variables.scss" as v;
@use "../../../styles/mixins.scss" as m;
@use "../../../styles/animations.scss";

.grid-cell {
  width: var(--grid-cell-size, 7.4rem);
  height: var(--grid-cell-size, 7.4rem);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: v.$radius-md;
  background:
    radial-gradient(
      circle at 50% 28%,
      rgba(255, 255, 255, 0.06),
      transparent 34%
    ),
    v.$surface-1;
  cursor: pointer;
  @include m.transition(all, v.$transition-fast);
  text-align: center;
  padding: 0;
  overflow: hidden;
  position: relative;

  &--empty {
    border-style: dashed;

    &::before {
      content: "";
      position: absolute;
      inset: 0.35rem;
      border: 1px solid rgba(255, 255, 255, 0.045);
      border-radius: calc(v.$radius-md - 0.18rem);
      pointer-events: none;
    }

    &:hover {
      border-color: v.$border-accent;
      background:
        radial-gradient(
          circle at 50% 28%,
          rgba(200, 230, 78, 0.12),
          transparent 38%
        ),
        v.$surface-2;
      box-shadow: v.$shadow-glow;
      transform: translateY(-2px);
    }
  }

  &--correct {
    background:
      linear-gradient(
        180deg,
        rgba(52, 211, 153, 0.2),
        rgba(52, 211, 153, 0.06)
      ),
      v.$surface-1;
    border-color: rgba(52, 211, 153, 0.35);
    animation: scaleIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    cursor: default;
  }

  &--incorrect {
    background:
      linear-gradient(
        180deg,
        rgba(248, 113, 113, 0.16),
        rgba(248, 113, 113, 0.05)
      ),
      v.$surface-1;
    border-color: rgba(248, 113, 113, 0.3);
    animation: scaleIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    cursor: default;
  }

  &--selecting {
    border-color: v.$color900;
    box-shadow: v.$shadow-glow;
    background:
      radial-gradient(circle, rgba(200, 230, 78, 0.16), transparent 55%),
      v.$surface-2;
    animation: pulseGlow 1.5s ease-in-out infinite;
  }

  &__plus {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
    color: v.$fontSubtle;
  }

  &__plus-mark {
    display: grid;
    place-items: center;
    width: 2.15rem;
    height: 2.15rem;
    border: 1px solid v.$border-subtle;
    border-radius: v.$radius-full;
    background: rgba(255, 255, 255, 0.035);
    font-size: 1.35rem;
    font-weight: 300;
    line-height: 1;
  }

  &__plus-text {
    font-size: 0.62rem;
    font-weight: 800;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  &__selecting {
    display: flex;
    gap: 0.28rem;

    span {
      width: 0.42rem;
      height: 0.42rem;
      border-radius: v.$radius-full;
      background: v.$color900;
      animation: pulseGlow 1.1s ease-in-out infinite;

      &:nth-child(2) {
        animation-delay: 0.12s;
      }

      &:nth-child(3) {
        animation-delay: 0.24s;
      }
    }
  }

  &__player {
    position: absolute;
    left: 0.4rem;
    right: 0.4rem;
    bottom: 0.4rem;
    color: v.$fontColor;
    font-size: 0.68rem;
    font-weight: 600;
    line-height: 1.2;
    word-break: break-word;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    padding: 0.25rem 0.35rem;
    border-radius: v.$radius-sm;
    background: rgba(11, 13, 18, 0.72);
    backdrop-filter: blur(8px);
    box-shadow: 0 1px 6px rgba(0, 0, 0, 0.34);
  }

  &__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: 50% 12%;
    transform: scale(1.02);
  }

  &__shade {
    position: absolute;
    inset: 0;
    background:
      linear-gradient(180deg, transparent 38%, rgba(11, 13, 18, 0.82)),
      linear-gradient(0deg, rgba(11, 13, 18, 0.08), rgba(11, 13, 18, 0.08));
  }

  &__status {
    position: absolute;
    top: 0.4rem;
    right: 0.4rem;
    display: grid;
    place-items: center;
    width: 1.35rem;
    height: 1.35rem;
    border-radius: v.$radius-full;
    color: v.$background;
    font-size: 0.9rem;
    font-weight: 900;
    box-shadow: v.$shadow-sm;
  }

  &--correct &__status {
    background: v.$success;
  }

  &--incorrect &__status {
    background: v.$error;
  }

  &--incorrect &__image {
    filter: grayscale(0.3) brightness(0.75);
  }
}
</style>
