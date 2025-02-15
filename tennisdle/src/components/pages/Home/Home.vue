<script setup lang="ts">
import PageCard from "../../molecules/Card/PageCard.vue";
import { Base } from "../../templates";

const generatePagesData = (mode: string, category: string) => ({
  path: `/${mode}/${category}`,
  imageUrl: `/covers/${mode}-${category}.jpg`,
  imageAlt: `${mode}-${category}`,
  title: `${mode}-${category}`,
});

const pages = [
  generatePagesData("daily", "atp"),
  generatePagesData("unlimited", "atp"),
  generatePagesData("daily", "wta"),
  generatePagesData("unlimited", "wta"),
];
</script>

<template>
  <div class="home">
    <Base :current-page-key="'home'">
      <div class="home__all-pages">
        <PageCard v-for="page in pages" :key="page.title" v-bind="page" />
      </div>
    </Base>
  </div>
</template>

<style lang="scss" scoped>
.home {
  height: 100%;
  width: 100%;
  .home__all-pages {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 2rem;
    padding: 2rem;
    flex-wrap: wrap;
  }
}
</style>
