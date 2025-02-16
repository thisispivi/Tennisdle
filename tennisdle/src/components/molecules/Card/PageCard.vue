<script lang="ts" setup>
import { useRouter } from "vue-router";

const { path, imageUrl, imageAlt, title } = defineProps<{
  path: string;
  imageUrl: string;
  imageAlt: string;
  title: string;
}>();

const router = useRouter();
const navigateTo = () => {
  if (path) router.push(path);
};
</script>

<template>
  <div class="page-card" @click="navigateTo">
    <img :src="imageUrl" :alt="imageAlt" :class="`overlay ${title}`" />
    <div class="page-card__content">
      <h2>{{ $t(`page.${title}.title`) }}</h2>
      <p>{{ $t(`page.${title}.description`) }}</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "../../../styles/variables.scss" as v;
@use "../../../styles/mixins.scss" as m;

.page-card {
  $borderRadius: 1rem;
  height: 17rem;
  width: 25rem;
  padding: 1rem 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 0.35rem 0.5rem 0.1rem rgba(0, 0, 0, 0.1);
  position: relative;
  border-radius: $borderRadius;
  cursor: pointer;
  @include m.transition(0.3s, all, ease);
  &:hover {
    transform: scale(1.05);
  }

  * {
    flex-shrink: 0;
  }

  .overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: calc(100% - 0.6rem);
    object-fit: cover;
    opacity: 0.7;
    border-radius: $borderRadius;
  }

  .page-card__content {
    width: 100%;
    position: absolute;
    background-color: #1e1e1ecc;
    font-weight: 600;
    left: 0;
    bottom: 0;
    border-radius: $borderRadius;
    padding: 1rem 1.25rem;
    backdrop-filter: blur(0.5rem);

    h2 {
      margin: 0;
      color: v.$color700;
      margin-bottom: 0.7rem;
      font-size: 1.5rem;
    }
  }
}
</style>
