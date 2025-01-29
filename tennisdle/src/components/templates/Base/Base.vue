<script setup lang="ts">
import { ref } from "vue";
import { SelectLanguage } from "../../molecules";
import { Logo } from "../../../assets";

const containerRef = ref<HTMLElement | null>(null);
</script>

<template>
  <div class="base">
    <img src="/rf.jpg" alt="roger federer" class="overlay" />
    <div class="base__header">
      <Logo class="logo" />
      <SelectLanguage />
    </div>
    <div ref="containerRef" class="container">
      <slot />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "../../../styles/variables.scss" as v;
@use "../../../styles/mixins.scss" as m;
.base {
  $headerHeight: 10.5rem;
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
  .base__header {
    height: $headerHeight;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding-inline: 2rem;
    position: relative;
    .logo {
      height: 7.5rem;
    }
    .select-language {
      position: absolute;
      right: 2rem;
      top: 2rem;
    }
  }
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 2rem;
    width: 100%;
    height: calc(100% - #{$headerHeight + 2.5rem});
    z-index: 5;
    @include m.transition;
  }
}
</style>
