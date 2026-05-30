<script setup lang="ts">
import { NUM_LIVES } from "../../../utils/params";
import { Heart } from "../../atoms";

const { livesRemaining } = defineProps<{
  livesRemaining: number;
}>();
</script>

<template>
  <div
    class="lives"
    :title="`${livesRemaining}/${NUM_LIVES} lives remaining`"
    :aria-label="`${livesRemaining} of ${NUM_LIVES} lives remaining`"
  >
    <div v-for="i in NUM_LIVES" :key="i">
      <Heart :is-clicked="i <= livesRemaining" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.lives {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  cursor: default;
}
</style>
