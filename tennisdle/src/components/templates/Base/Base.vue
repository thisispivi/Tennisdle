<script setup lang="ts">
import { ref } from "vue";

defineProps({});

const containerRef = ref<HTMLElement | null>(null);
const headerClass = ref("header");
</script>

<template>
  <div class="base">
    <Header :class="headerClass" />
    <div ref="containerRef" class="container"></div>
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
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    @include m.transition;
  }
}
</style>
