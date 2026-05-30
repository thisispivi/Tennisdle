<script lang="ts" setup>
import { useRouter } from "vue-router";

const { path, imageUrl, imageAlt, title, index } = defineProps<{
  path: string;
  imageUrl: string;
  imageAlt: string;
  title: string;
  index?: number;
}>();

const router = useRouter();
const navigateTo = () => {
  if (path) router.push(path);
};
</script>

<template>
  <div class="page-card" :style="{ '--i': index ?? 0 }" @click="navigateTo">
    <img :src="imageUrl" :alt="imageAlt" :class="`overlay ${title}`" />
    <div class="page-card__tint"></div>
    <div class="page-card__content">
      <span class="page-card__tag">{{ $t("page.home.mode") }}</span>
      <h2>{{ $t(`page.${title}.title`) }}</h2>
      <p>{{ $t(`page.${title}.description`) }}</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "../../../styles/variables.scss" as v;
@use "../../../styles/mixins.scss" as m;
@use "../../../styles/animations.scss";

.page-card {
  $borderRadius: v.$radius-lg;
  height: 15rem;
  width: 22rem;
  border-radius: $borderRadius;
  border: 1px solid v.$border-subtle;
  position: relative;
  cursor: pointer;
  overflow: hidden;
  animation: fadeInUp v.$transition-slow cubic-bezier(0.4, 0, 0.2, 1) both;
  animation-delay: calc(0.06s * var(--i, 0));
  @include m.transition(all, v.$transition-normal);

  &:hover {
    transform: translateY(-3px);
    border-color: v.$border-medium;
    box-shadow: v.$shadow-md;
  }

  * {
    flex-shrink: 0;
  }

  .overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0.5;
    border-radius: $borderRadius;
    @include m.transition(opacity, v.$transition-normal);
  }

  &:hover .overlay {
    opacity: 0.65;
  }

  .page-card__tint {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      165deg,
      rgba(11, 13, 18, 0.3) 0%,
      rgba(11, 13, 18, 0.7) 100%
    );
    z-index: 1;
  }

  .page-card__content {
    width: 100%;
    position: absolute;
    z-index: 2;
    background: linear-gradient(
      to top,
      rgba(11, 13, 18, 0.95) 0%,
      rgba(11, 13, 18, 0.7) 60%,
      transparent 100%
    );
    font-weight: 600;
    left: 0;
    bottom: 0;
    border-radius: $borderRadius;
    padding: 2.5rem 1.25rem 1.15rem;

    .page-card__tag {
      display: inline-block;
      font-size: 0.62rem;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: v.$color900;
      margin-bottom: 0.35rem;
      padding: 0.2rem 0.55rem;
      border-radius: v.$radius-full;
      border: 1px solid rgba(200, 230, 78, 0.2);
      background: rgba(200, 230, 78, 0.08);
    }

    h2 {
      margin: 0;
      color: v.$fontColor;
      margin-bottom: 0.35rem;
      font-size: 1.15rem;
      line-height: 1.3;
      font-weight: 600;
    }

    p {
      font-size: 0.82rem;
      color: v.$fontMuted;
      line-height: 1.45;
      font-weight: 400;
    }
  }
}
</style>
