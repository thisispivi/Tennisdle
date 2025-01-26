<script setup lang="ts">
import { computed } from "vue";
import { GuessDistance, GuessStatus } from "../../../data/typings/GuessStatus";
import { TriangleIcon } from "../../../assets";

const { value, compareValue, diffThreshold } = defineProps<{
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
  <div :class="`diff-pill diff-pill--${status}`">
    <p>{{ compareValue }}</p>
    <TriangleIcon :class="`triangle-icon triangle-icon--${higherOrLower}`" />
  </div>
</template>

<style scoped lang="scss">
@use "../../../styles/variables.scss" as v;
.diff-pill {
  display: flex;
  padding: 0.4rem 0.75rem;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: bold;
  text-align: center;
  background-color: v.$headerBackgroundDark;
  justify-content: center;
  align-items: center;
  &.diff-pill--equal {
    background-color: #43a865;
    color: v.$headerBackgroundDark;
    :deep(path) {
      fill: v.$headerBackgroundDark;
    }
  }
  &.diff-pill--in-threshold {
    background-color: #b8b105;
    color: v.$headerBackgroundDark;
    :deep(path) {
      fill: v.$headerBackgroundDark;
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
}
</style>
