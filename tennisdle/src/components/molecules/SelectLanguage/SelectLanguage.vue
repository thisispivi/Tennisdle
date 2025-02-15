<template>
  <div class="select-language">
    <div class="select-language__button" @click="show = !show">
      <ItalyIcon v-if="$i18n.locale.includes('it')" />
      <UnitedKingdomIcon v-if="$i18n.locale.includes('en')" />
      <ChevronIcon
        class="select-language__button__chevron"
        :style="{ transform: show ? 'rotate(90deg)' : 'rotate(-90deg)' }"
      />
    </div>
    <Transition>
      <template v-if="show">
        <div class="select-language__dropdown">
          <div
            :class="{ active: $i18n.locale.includes('it') }"
            @click="onLanguageClick('it')"
          >
            <ItalyIcon />
            <span>Italiano</span>
          </div>
          <div
            :class="{ active: $i18n.locale.includes('en') }"
            @click="onLanguageClick('en')"
          >
            <UnitedKingdomIcon />
            <span>English</span>
          </div>
        </div>
      </template>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { ChevronIcon, ItalyIcon, UnitedKingdomIcon } from "../../../assets";
import i18n from "../../../i18n";
const show = ref(false);

const storedLocale = localStorage.getItem("locale");
if (storedLocale) i18n.global.locale = storedLocale as "en" | "it";
else localStorage.setItem("locale", i18n.global.locale as "en" | "it");

const onLanguageClick = (lang: "en" | "it") => {
  i18n.global.locale = lang;
  localStorage.setItem("locale", lang);
  show.value = false;
};
</script>

<style scoped lang="scss">
@use "../../../styles/variables.scss" as v;
@use "../../../styles/mixins.scss" as m;

.select-language {
  .select-language__button {
    display: flex;
    align-items: center;
    cursor: pointer;
    svg {
      width: 2rem;
      height: 2rem;
      margin-right: 0.3rem;
    }
    .select-language__button__chevron {
      width: 1.5rem;
      height: 1.5rem;
      stroke: v.$color200;
      margin: 0;
      @include m.transition(all, 0.4s, ease);
    }
  }
  .select-language__dropdown {
    position: absolute;
    top: 4rem;
    right: 2rem;
    background-color: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(0.063rem);
    border-radius: 1rem;
    box-shadow: rgba(0, 0, 0, 0.15) 0px 3px 3px 0px;
    padding: 0.5rem;
    div {
      display: flex;
      align-items: center;
      cursor: pointer;
      padding: 0.25rem 0.75rem;
      border-radius: 0.5rem;
      @include m.transition(all, 0.4s);
      &.active {
        background-color: v.$color700;
        color: v.$cardBackground;
      }
      svg {
        width: 1.5rem;
        height: 1.5rem;
        margin-right: 1rem;
      }
    }
  }
}

.v-enter-active,
.v-leave-active {
  opacity: 1;
  transform: translateY(0);
  @include m.transition(all, 0.4s, ease);
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
