<script setup lang="ts">
import { ref } from "vue";

const containerRef = ref<HTMLElement | null>(null);
</script>

<template>
  <div class="base">
    <div ref="containerRef" class="container">
      <slot />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "../../../styles/variables.scss" as v;
@use "../../../styles/mixins.scss" as m;
.base {
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow-y: auto;
  height: 100%;
  background: linear-gradient(
    135deg,
    v.$backgroundDark 0%,
    v.$headerBackgroundDark 100%
  );
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    @include m.transition;
  }
}
</style>
