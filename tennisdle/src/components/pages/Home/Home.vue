<script setup lang="ts">
import PageCard from "../../molecules/Card/PageCard.vue";
import { Base } from "../../templates";

interface PageData {
  path: string;
  imageUrl: string;
  imageAlt: string;
  title: string;
  index: number;
}

const generatePagesData = (
  mode: string,
  category: string,
  index: number,
  ext = ".jpg"
): PageData => ({
  path: `/${mode}/${category}`,
  imageUrl: `/covers/${mode}-${category}${ext}`,
  imageAlt: `${mode}-${category}`,
  title: `${mode}-${category}`,
  index,
});

const generateSimplePageData = (
  mode: string,
  index: number,
  ext = ".jpg"
): PageData => ({
  path: `/${mode}`,
  imageUrl: `/covers/${mode}${ext}`,
  imageAlt: mode,
  title: mode,
  index,
});

const classicPages = [
  generatePagesData("daily", "atp", 0),
  generatePagesData("daily", "wta", 1),
  generatePagesData("unlimited", "atp", 2),
  generatePagesData("unlimited", "wta", 3),
];

const challengePages = [
  generatePagesData("image", "atp", 0, ".svg"),
  generatePagesData("image", "wta", 1, ".svg"),
  generateSimplePageData("venue", 2, ".svg"),
  generateSimplePageData("top10", 3, ".svg"),
  generateSimplePageData("grid", 4, ".svg"),
];

const browsePages = [
  generatePagesData("all", "atp", 0),
  generatePagesData("all", "wta", 1),
];

const quickStats = [
  { key: "modes", value: "11+", icon: "🎾" },
  { key: "daily", value: "24h", icon: "📅" },
  { key: "challenge", value: "∞", icon: "🔁" },
];
</script>

<template>
  <div class="home">
    <Base>
      <section class="home__hero">
        <div class="home__hero-badge">{{ $t("page.home.badge") }}</div>
        <h1 class="home__hero-title">{{ $t("page.home.welcome") }}</h1>
        <p class="home__hero-description">{{ $t("page.home.description") }}</p>
        <div class="home__hero-stats">
          <div
            v-for="stat in quickStats"
            :key="stat.key"
            class="home__hero-stat"
          >
            <span class="home__hero-stat-value">{{ stat.value }}</span>
            <span class="home__hero-stat-label">{{
              $t(`page.home.quickStats.${stat.key}`)
            }}</span>
          </div>
        </div>
      </section>

      <div class="home__sections">
        <section class="home__section">
          <div class="home__section-heading">
            <h3 class="home__section-title">{{ $t("page.home.classic") }}</h3>
            <p class="home__section-subtitle">
              {{ $t("page.home.classicDescription") }}
            </p>
          </div>
          <div class="home__all-pages">
            <PageCard
              v-for="page in classicPages"
              :key="page.title"
              v-bind="page"
            />
          </div>
        </section>

        <section class="home__section">
          <div class="home__section-heading">
            <h3 class="home__section-title">
              {{ $t("page.home.challenges") }}
            </h3>
            <p class="home__section-subtitle">
              {{ $t("page.home.challengesDescription") }}
            </p>
          </div>
          <div class="home__all-pages">
            <PageCard
              v-for="page in challengePages"
              :key="page.title"
              v-bind="page"
            />
          </div>
        </section>

        <section class="home__section">
          <div class="home__section-heading">
            <h3 class="home__section-title">{{ $t("page.home.browse") }}</h3>
            <p class="home__section-subtitle">
              {{ $t("page.home.browseDescription") }}
            </p>
          </div>
          <div class="home__all-pages">
            <PageCard
              v-for="page in browsePages"
              :key="page.title"
              v-bind="page"
            />
          </div>
        </section>
      </div>
    </Base>
  </div>
</template>

<style lang="scss">
@use "../../../styles/variables.scss" as v;
@use "../../../styles/mixins.scss" as m;

.home {
  height: 100%;
  width: 100%;
  .container {
    padding-block: 1.5rem 2.5rem;
    justify-content: center;
    max-width: 100%;
    margin-inline: auto;

    .home__hero {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 100%;
      max-width: v.$content-max-width;
      margin-bottom: 2rem;
      padding: 2.5rem 2rem;
      border-radius: v.$radius-xl;
      @include m.glass-card(16px, 0.5);
      box-shadow: v.$shadow-md;
      text-align: center;
      animation: fadeInUp 0.5s cubic-bezier(0.4, 0, 0.2, 1) both;

      .home__hero-badge {
        color: v.$color900;
        font-size: 0.7rem;
        text-transform: uppercase;
        letter-spacing: 0.12em;
        font-weight: 700;
        margin-bottom: 0.75rem;
        padding: 0.3rem 0.85rem;
        border-radius: v.$radius-full;
        background: v.$color900o;
        border: 1px solid rgba(200, 230, 78, 0.15);
      }

      .home__hero-title {
        margin: 0 0 0.6rem;
        color: v.$fontColor;
        font-size: 1.85rem;
        font-weight: 700;
        letter-spacing: -0.02em;
      }

      .home__hero-description {
        margin: 0;
        font-size: 1rem;
        color: v.$fontMuted;
        max-width: 42rem;
      }

      .home__hero-stats {
        margin-top: 1.5rem;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 0.75rem;
      }

      .home__hero-stat {
        min-width: 7rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 0.7rem 1rem;
        border-radius: v.$radius-md;
        border: 1px solid v.$border-subtle;
        background: v.$surface-1;
      }

      .home__hero-stat-value {
        font-size: 1.15rem;
        font-weight: 700;
        @include m.gradient-text;
      }

      .home__hero-stat-label {
        margin-top: 0.15rem;
        font-size: 0.7rem;
        text-transform: uppercase;
        letter-spacing: 0.06em;
        color: v.$fontSubtle;
      }
    }

    .home__sections {
      width: 100%;
      max-width: v.$content-max-width;
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
      margin-inline: auto;
    }

    .home__section {
      width: 100%;
      padding: 1.5rem;
      border-radius: v.$radius-lg;
      @include m.glass-card(12px, 0.45);
      box-shadow: v.$shadow-sm;
      animation: fadeInUp 0.45s cubic-bezier(0.4, 0, 0.2, 1) both;

      &:nth-child(1) {
        animation-delay: 0.08s;
      }
      &:nth-child(2) {
        animation-delay: 0.16s;
      }
      &:nth-child(3) {
        animation-delay: 0.24s;
      }

      .home__section-heading {
        margin-bottom: 1.15rem;
      }

      .home__section-title {
        font-size: 1rem;
        font-weight: 600;
        color: v.$fontColor;
        margin: 0 0 0.3rem;
        @include m.accent-border(v.$color900);
        text-transform: uppercase;
        letter-spacing: 0.06em;
      }

      .home__section-subtitle {
        margin: 0;
        font-size: 0.88rem;
        color: v.$fontMuted;
        padding-left: 0.65rem;
      }
    }

    .home__all-pages {
      display: flex;
      justify-content: flex-start;
      align-items: stretch;
      gap: 1rem;
      flex-wrap: wrap;
      width: 100%;
      .page-card {
        .overlay {
          &.unlimited-atp {
            object-position: 95% 50%;
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
  .home {
    .container {
      .home__hero {
        padding: 1.75rem 1rem;
        .home__hero-title {
          font-size: 1.5rem;
        }
      }

      .home__all-pages {
        .page-card {
          height: 13rem !important;
          width: 100% !important;
        }
      }
    }
  }
}
</style>
