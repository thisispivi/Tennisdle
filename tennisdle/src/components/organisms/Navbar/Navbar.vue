<script setup lang="ts">
import { SelectLanguage } from "../../molecules";
import { Logo } from "../../../assets";
import { useRoute, useRouter } from "vue-router";

const routeName = useRoute().name?.toString() || "";
const pageName = routeName === "home" ? "" : routeName;

const router = useRouter();
const toHome = () => {
  if (routeName !== "home") router.push({ name: "home" });
};
</script>

<template>
  <div :class="`navbar ${pageName}`">
    <div class="navbar__website-logo" @click="toHome">
      <Logo class="logo" />
      <h1>Tennisdle</h1>
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
  cursor: pointer;
  $leftNRightWidth: 12.4rem;
  .navbar__website-logo {
    display: flex;
    align-items: center;
    width: $leftNRightWidth;
    flex-shrink: 0;
    h1 {
      font-size: 1.8rem;
      font-weight: 600;
    }
    .logo {
      width: 3.5rem;
      height: 3.5rem;
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
        h1 {
          display: none;
        }
      }
    }
  }
}
</style>
