<script setup lang="ts">
import { ref } from "vue";
import { SelectLanguage } from "../../molecules";

const containerRef = ref<HTMLElement | null>(null);
</script>

<template>
  <div class="base">
    <div class="base__header">
      <img src="/Tennisdle.png" alt="logo" />
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
  $headerHeight: 10rem;
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
  .base__header {
    height: $headerHeight;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding-inline: 2rem;
    position: relative;
    img {
      width: 16rem;
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
    width: 100%;
    height: calc(100% - #{$headerHeight});
    @include m.transition;
  }
}
</style>
