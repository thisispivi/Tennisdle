<script setup lang="ts">
import { ref } from "vue";
import { Navbar } from "../../organisms";

const { currentPageKey } = defineProps<{ currentPageKey: string }>();

const containerRef = ref<HTMLElement | null>(null);
</script>

<template>
  <div class="base">
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
  overflow-x: hidden;
  height: 100%;
  background: v.$background;
  position: relative;
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: v.$headerHeight;
    width: 100%;
    height: 100%;
    overflow: hidden;
    z-index: 5;
    @include m.transition;
  }
}
</style>
