<script setup lang="ts">
import { computed } from "vue";
import { GuessDistance, GuessStatus } from "../../../data/typings/GuessStatus";
import { TriangleIcon } from "../../../assets";
import { Player } from "data/typings/Player";

const { value, compareValue, diffThreshold, playerKey } = defineProps<{
  playerKey: keyof Player;
  value: number;
  compareValue: number;
  diffThreshold: number;
}>();

const status = computed(() => {
  return Math.abs(value - compareValue) === 0
    ? GuessStatus.EQUAL
    : Math.abs(value - compareValue) <= diffThreshold
      ? GuessStatus.IN_THRESHOLD
      : GuessStatus.WRONG;
});

const higherOrLower = computed(() => {
  return status.value === GuessStatus.EQUAL
    ? GuessDistance.EXACT
    : value > compareValue
      ? GuessDistance.HIGHER
      : GuessDistance.LOWER;
});
</script>

<template>
  <div :class="`diff-pill diff-pill--${status} ${playerKey}`">
    <p>
      {{ playerKey === "height" ? compareValue.toFixed(2) : compareValue
      }}{{ playerKey === "height" ? "m" : "" }}
    </p>
    <TriangleIcon :class="`triangle-icon triangle-icon--${higherOrLower}`" />
  </div>
</template>

<style scoped lang="scss">
@use "../../../styles/variables.scss" as v;
.diff-pill {
  display: flex;
  padding: 0.5rem;
  height: 4rem;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: bold;
  text-align: center;
  background-color: v.$headerBackgroundDark;
  justify-content: space-evenly;
  align-items: center;
  width: 4rem;
  p {
    font-size: 1.1rem;
  }

  &.diff-pill--equal {
    background-color: #43a865;
    color: v.$headerBackgroundDark;
    .triangle-icon:deep(path) {
      fill: v.$headerBackgroundDark;
    }
  }
  &.diff-pill--in-threshold {
    background-color: #b8b105;
    color: v.$headerBackgroundDark;
    .triangle-icon:deep(path) {
      fill: v.$headerBackgroundDark;
    }
  }

  &.highestRanking {
    .triangle-icon {
      transform: rotate(180deg);
      &.triangle-icon--lower {
        transform: rotate(0deg);
      }
    }
  }

  .triangle-icon {
    margin-left: 0.5rem;
    width: 1rem;
    height: 1rem;
    :deep(path) {
      fill: white;
    }
    &.triangle-icon--exact {
      display: none;
    }
    &.triangle-icon--lower {
      transform: rotate(180deg);
    }
  }

  .player-key-icon {
    margin-right: 0.5rem;
    height: 2.75rem;
    width: 2.75rem;
  }
}
</style>
