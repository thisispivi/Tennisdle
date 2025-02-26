<script setup lang="ts">
const { winningStreak } = defineProps<{ winningStreak: number }>();
</script>

<template>
  <div v-tooltip="$t(`streak.tooltip`)" class="streak">
    <img
      :src="`/imgs/${winningStreak === 0 ? 'streak-none.png' : 'streak.gif'}`"
      alt="streak"
    />
    <p>{{ winningStreak }}</p>
  </div>
</template>

<style lang="scss" scoped>
.streak {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  position: relative;
  $size: 3rem;
  width: $size;
  height: $size;
  img {
    position: absolute;
    height: $size;
    width: $size;
    top: -0.55rem;
    left: -0.25rem;
  }
  p {
    position: absolute;
    font-size: 1.5rem;
    color: black;
    font-weight: 700;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -46%);
    justify-content: center;
    text-align: center;
  }
}
</style>
