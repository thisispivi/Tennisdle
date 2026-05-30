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
    @click="$emit('click')"
  >
    <span v-if="cellState.isEmpty && !isSelecting" class="grid-cell__plus"
      >+</span
    >
    <span v-else-if="isSelecting" class="grid-cell__selecting">...</span>
    <template v-else>
      <img
        v-if="playerImage"
        class="grid-cell__image"
        :src="playerImage"
        :alt="cellState.playerName ?? 'Player'"
      />
      <span class="grid-cell__player">{{ cellState.playerName }}</span>
    </template>
  </div>
</template>

<style lang="scss" scoped>
@use "../../../styles/variables.scss" as v;
@use "../../../styles/mixins.scss" as m;
@use "../../../styles/animations.scss";

.grid-cell {
  width: 7.4rem;
  height: 7.4rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid v.$border-subtle;
  border-radius: v.$radius-md;
  background: v.$surface-1;
  cursor: pointer;
  @include m.transition(all, v.$transition-fast);
  text-align: center;
  padding: 0;
  overflow: hidden;
  position: relative;

  @media (max-width: 430px) {
    width: 5.2rem;
    height: 5.2rem;
  }

  &--empty {
    &:hover {
      border-color: v.$border-accent;
      background: v.$surface-2;
      box-shadow: v.$shadow-glow;
    }
  }

  &--correct {
    background-color: v.$success-dim;
    border-color: rgba(52, 211, 153, 0.35);
    animation: scaleIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    cursor: default;
  }

  &--incorrect {
    background-color: v.$error-dim;
    border-color: rgba(248, 113, 113, 0.3);
    animation: scaleIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    cursor: default;
  }

  &--selecting {
    border-color: v.$color900;
    box-shadow: v.$shadow-glow;
    animation: pulseGlow 1.5s ease-in-out infinite;
  }

  &__plus {
    font-size: 1.4rem;
    color: v.$fontSubtle;
    font-weight: 300;
  }

  &__selecting {
    font-size: 1.1rem;
    color: v.$color900;
    font-weight: 600;
  }

  &__player {
    position: absolute;
    left: 0.25rem;
    right: 0.25rem;
    bottom: 0.25rem;
    font-size: 0.65rem;
    font-weight: 600;
    line-height: 1.2;
    word-break: break-word;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    padding: 0.2rem 0.25rem;
    border-radius: 0.35rem;
    background: rgba(11, 13, 18, 0.8);
    opacity: 0;
    @include m.transition(opacity, v.$transition-fast);
  }

  &__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: 50% 12%;
  }

  &:hover &__player {
    opacity: 1;
  }

  &--incorrect &__image {
    filter: grayscale(0.3) brightness(0.75);
  }
}
</style>
