<script setup lang="ts">
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

import {
  Logo,
  LogoText,
  NavbarGuideIcon,
  NavbarSettingsIcon,
  NavbarStatsIcon,
} from "../../../assets";
import i18n from "../../../i18n";
import HowToPlayModal from "../HowToPlayModal/HowToPlayModal.vue";
import SettingsModal from "../SettingsModal/SettingsModal.vue";
import StatsModal from "../StatsModal/StatsModal.vue";

const route = useRoute();
const routeName = computed(() => route.name?.toString() || "");
const pageName = computed(() =>
  routeName.value === "home" ? "" : routeName.value
);
const isHome = computed(() => routeName.value === "home");

const router = useRouter();
const toHome = () => {
  if (routeName.value !== "home") router.push({ name: "home" });
};

const isScrolled = ref(false);
const onScroll = (e: Event) => {
  const target = e.target as HTMLElement;
  isScrolled.value = target.scrollTop > 10;
};

const showStats = ref(false);
const showHelp = ref(false);
const showSettings = ref(false);
const currentLocale = ref(i18n.global.locale as "en" | "it");

const storedLocale = localStorage.getItem("locale");
if (storedLocale) {
  i18n.global.locale = storedLocale as "en" | "it";
  currentLocale.value = storedLocale as "en" | "it";
}

const setLanguage = (lang: "en" | "it") => {
  i18n.global.locale = lang;
  localStorage.setItem("locale", lang);
  currentLocale.value = lang;
};

defineExpose({ onScroll });
</script>

<template>
  <div
    :class="[
      'navbar',
      {
        'navbar--scrolled': isScrolled,
        'navbar--home': isHome,
        'navbar--game': !isHome,
      },
    ]"
  >
    <div
      class="navbar__website-logo"
      :title="$t('page.home.title')"
      @click="toHome"
    >
      <Logo class="logo" />
      <LogoText class="logo-text" />
    </div>
    <div class="navbar__page-title">
      <h2 v-if="pageName">{{ $t(`page.${pageName}.title`) }}</h2>
    </div>
    <div class="navbar__options">
      <button
        class="navbar__icon-btn"
        :aria-label="$t('howToPlay.title')"
        :title="$t('howToPlay.title')"
        @click="showHelp = true"
      >
        <NavbarGuideIcon />
      </button>
      <button
        class="navbar__icon-btn"
        :aria-label="$t('stats.title')"
        :title="$t('stats.title')"
        @click="showStats = true"
      >
        <NavbarStatsIcon />
      </button>
      <button
        class="navbar__icon-btn"
        :aria-label="$t('settings.title')"
        :title="$t('settings.title')"
        @click="showSettings = true"
      >
        <NavbarSettingsIcon />
      </button>
    </div>
  </div>

  <StatsModal :is-open="showStats" :on-close="() => (showStats = false)" />
  <HowToPlayModal :is-open="showHelp" :on-close="() => (showHelp = false)" />
  <SettingsModal
    :is-open="showSettings"
    :on-close="() => (showSettings = false)"
    :current-locale="currentLocale"
    :set-language="setLanguage"
  />
</template>

<style lang="scss">
@use "../../../styles/variables.scss" as v;
@use "../../../styles/mixins.scss" as m;

.navbar {
  display: flex;
  position: fixed;
  top: 0;
  left: 0;
  height: v.$headerHeight;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  padding-inline: 1.5rem;
  z-index: 10;
  background: rgba(11, 13, 18, 0.82);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid transparent;
  @include m.transition(all, v.$transition-normal);

  &--scrolled {
    background: rgba(11, 13, 18, 0.95);
    border-bottom-color: v.$border-subtle;
    box-shadow: 0 1px 12px rgba(0, 0, 0, 0.3);
  }

  $leftNRightWidth: 11rem;

  .navbar__website-logo {
    display: flex;
    align-items: center;
    width: $leftNRightWidth;
    flex-shrink: 0;
    cursor: pointer;
    @include m.transition(opacity, v.$transition-fast);

    &:hover {
      opacity: 0.75;
    }

    .logo-text {
      width: 100%;
      user-select: none;
    }
    .logo {
      width: 2.2rem;
      height: 2.2rem;
      margin-right: 0.4rem;
      flex-shrink: 0;
      .text-logo {
        display: none;
      }
    }
  }

  .navbar__page-title {
    width: 100%;
    display: flex;
    justify-content: center;
    padding-inline: 1rem;
    h2 {
      font-size: 1.15rem;
      font-weight: 600;
      color: v.$fontColor;
      line-height: 1.3;
      margin: 0;
      text-align: center;
      letter-spacing: -0.01em;
    }
  }

  .navbar__icon-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.25rem;
    height: 2.25rem;
    border: 1px solid v.$border-subtle;
    border-radius: v.$radius-full;
    background-color: transparent;
    cursor: pointer;
    padding: 0;
    @include m.transition(all, v.$transition-fast);

    svg {
      width: 1.1rem;
      height: 1.1rem;
      color: v.$fontMuted;
      fill: none;
      stroke: currentColor;
    }

    &:hover {
      background-color: v.$surface-2;
      border-color: v.$border-medium;
      svg {
        color: v.$color900;
      }
    }
  }

  .navbar__options {
    width: $leftNRightWidth;
    display: flex;
    justify-content: flex-end;
    flex-shrink: 0;
    gap: 0.45rem;
    align-items: center;
  }

  &.navbar--home {
    .navbar__options,
    .navbar__website-logo {
      width: auto;
    }
  }
}

@media screen and (max-width: 850px) {
  .navbar.navbar--game {
    padding-inline: 1rem;
    .navbar__options,
    .navbar__website-logo {
      width: 5rem;
    }
    .navbar__options {
      width: auto;
    }
    .navbar__website-logo {
      .text-logo {
        display: block !important;
      }
      .logo-text {
        display: none;
      }
    }
  }
}

@media screen and (max-width: 385px) {
  .navbar.navbar--game {
    padding-inline: 0.5rem;
    .navbar__options {
      width: 3.8rem;
    }
    .navbar__website-logo {
      width: 3rem;
    }
  }
}

@media screen and (max-width: 300px) {
  .navbar.navbar--game {
    .navbar__page-title {
      padding: 0;
    }
  }
}
</style>
