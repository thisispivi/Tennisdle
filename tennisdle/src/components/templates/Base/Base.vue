<script setup lang="ts">
import { ref } from "vue";
import { Navbar } from "../../organisms";

const { currentPageKey } = defineProps<{ currentPageKey: string }>();

const containerRef = ref<HTMLElement | null>(null);
</script>

<template>
  <div class="base">
    <!-- <img src="/rf.jpg" alt="roger federer" class="overlay" /> -->
    <Navbar :current-page-key="currentPageKey" />
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
  background: v.$backgroundDark;
  position: relative;
  .overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0.1;
    object-position: 92% 50%;
    filter: blur(0.3rem);
  }
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: v.$headerHeight;
    width: 100%;
    height: calc(100% - #{v.$headerHeight + 2.5rem});
    z-index: 5;
    @include m.transition;
  }
}
</style>
