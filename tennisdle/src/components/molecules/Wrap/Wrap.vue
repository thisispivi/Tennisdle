<template>
  <div class="wrap">
    <slot />
  </div>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
.wrap {
  display: flex;
  width: 100%;
  overflow-y: auto;
  height: 100%;
  flex-wrap: wrap;
  gap: 2rem;
  justify-content: center;
}
</style>
