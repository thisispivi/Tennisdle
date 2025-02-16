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
    <Base>
      <div class="title-container">
        <h1 class="welcome">{{ $t("page.home.welcome") }}</h1>
        <p class="description">{{ $t("page.home.description") }}</p>
      </div>
      <div class="home__all-pages">
        <PageCard v-for="page in pages" :key="page.title" v-bind="page" />
      </div>
    </Base>
  </div>
</template>

<style lang="scss">
@use "../../../styles/variables.scss" as v;
.home {
  height: 100%;
  width: 100%;
  .container {
    padding-block: 2rem;
    justify-content: center;
    .title-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      .description,
      .welcome {
        padding-inline: 2rem;
        margin: 0;
        text-align: center;
      }
      .welcome {
        color: v.$color700;
        margin-bottom: 1rem;
      }
      .description {
        font-size: 1.2rem;
        margin-bottom: 2rem;
      }
    }
    .home__all-pages {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 2rem;
      padding: 1rem 2rem;
      flex-wrap: wrap;
      overflow-x: hidden;
      width: 100%;
      max-width: 56rem;
      .page-card {
        .overlay {
          &.unlimited-atp {
            object-position: 92% 50%;
          }
          &.unlimited-wta {
            object-position: 60% 50%;
          }
          &.daily-atp {
            object-position: 67% 50%;
          }
          &.daily-wta {
            object-position: 38% 50%;
          }
        }
      }
    }
  }
}

@media (max-width: 430px) {
  .home__all-pages {
    .page-card {
      height: 18rem;
      width: 100%;
    }
  }
}
</style>
