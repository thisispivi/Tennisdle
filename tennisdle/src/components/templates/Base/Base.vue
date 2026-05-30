<script setup lang="ts">
import { ref } from "vue";

import { Navbar } from "../../organisms";

const navbarRef = ref<InstanceType<typeof Navbar> | null>(null);

const onScroll = (e: Event) => {
  navbarRef.value?.onScroll(e);
};
</script>

<template>
  <div class="base" @scroll="onScroll">
    <Navbar ref="navbarRef" />
    <div class="container">
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
  overflow-x: hidden;
  height: 100%;
  background: v.$background;
  position: relative;
  isolation: isolate;

  // Subtle radial glow in top center
  &::before {
    content: "";
    position: fixed;
    top: -20%;
    left: 50%;
    transform: translateX(-50%);
    width: 140%;
    height: 60%;
    background: radial-gradient(
      ellipse at center,
      rgba(180, 138, 234, 0.04) 0%,
      rgba(200, 230, 78, 0.02) 40%,
      transparent 70%
    );
    pointer-events: none;
    z-index: 0;
  }

  // Fine dot pattern
  &::after {
    content: "";
    position: fixed;
    inset: 0;
    background-image: radial-gradient(
      rgba(255, 255, 255, 0.03) 1px,
      transparent 1px
    );
    background-size: 24px 24px;
    pointer-events: none;
    z-index: 0;
  }

  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    margin-top: v.$headerHeight;
    width: 100%;
    max-width: 100%;
    min-height: 0;
    flex: 1;
    z-index: 5;
    @include m.transition;
    padding: 1.5rem 1rem 2.5rem;
  }
}
</style>
