<script setup lang="ts">
import { SelectLanguage } from "../../molecules";
import { Logo, LogoText } from "../../../assets";
import { useRoute, useRouter } from "vue-router";

const routeName = useRoute().name?.toString() || "";
const pageName = routeName === "home" ? "" : routeName;

const router = useRouter();
const toHome = () => {
  if (routeName !== "home") router.push({ name: "home" });
};
</script>

<template>
  <div :class="`navbar ${routeName}`">
    <div class="navbar__website-logo" @click="toHome">
      <Logo class="logo" />
      <LogoText class="logo-text" />
    </div>
    <div class="navbar__page-title">
      <h2 v-if="pageName">{{ $t(`page.${pageName}.title`) }}</h2>
    </div>
    <div class="navbar__options">
      <SelectLanguage class="select-language" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "../../../styles/variables.scss" as v;
.navbar {
  display: flex;
  position: fixed;
  top: 0;
  left: 0;
  height: v.$headerHeight;
  width: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding-inline: 2rem;
  $leftNRightWidth: 12.4rem;
  .navbar__website-logo {
    display: flex;
    align-items: center;
    width: $leftNRightWidth;
    flex-shrink: 0;
    cursor: pointer;
    .logo-text {
      height: 1.8rem;
    }
    .logo {
      width: 2.5rem;
      height: 2.5rem;
      margin-right: 0.5rem;
      flex-shrink: 0;
    }
  }
  .navbar__page-title {
    width: 100%;
    display: flex;
    justify-content: center;
    padding-inline: 1rem;
    h2 {
      font-size: 1.5rem;
      font-weight: 600;
      color: v.$color900;
    }
  }
  .navbar__options {
    width: $leftNRightWidth;
    display: flex;
    justify-content: flex-end;
    flex-shrink: 0;
    .select-language {
      font-size: 1rem;
    }
  }

  &.home {
    .navbar__options,
    .navbar__website-logo {
      width: auto;
    }
  }
}

@media screen and (max-width: 850px) {
  .navbar {
    &.unlimited-atp {
      padding-inline: 1rem;
      .navbar__options,
      .navbar__website-logo {
        width: 5rem;
      }
      .navbar__website-logo {
        .logo-text {
          display: none;
        }
      }
    }
  }
}
</style>
