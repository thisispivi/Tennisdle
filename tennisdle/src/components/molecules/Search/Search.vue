<script setup lang="ts">
import Fuse from "fuse.js";
import type { ComponentPublicInstance } from "vue";
import { computed, nextTick, ref, watch } from "vue";

import { Players } from "../../../typings/Player";

const props = defineProps<{
  allPlayers: Players;
  selectPlayer: (player: string) => void;
  alreadyAttempted: string[];
}>();

const MAX_RESULTS = 20;

const search = ref("");
const inputRef = ref<HTMLInputElement | null>(null);
const activeIndex = ref(-1);
const resultRefs = ref<HTMLElement[]>([]);
const isFocused = ref(false);
const pointerOverResults = ref(false);

type TemplateRefEl = Element | ComponentPublicInstance | null;

const setResultRef = (el: TemplateRefEl, index: number) => {
  if (!el) return;

  const node =
    el instanceof HTMLElement
      ? el
      : (el as ComponentPublicInstance).$el instanceof HTMLElement
        ? ((el as ComponentPublicInstance).$el as HTMLElement)
        : null;

  if (!node) return;
  resultRefs.value[index] = node;
};

const onSearch = (e: Event) => {
  search.value = (e.target as HTMLInputElement).value;
  if (activeIndex.value < 0) activeIndex.value = 0;
};

const fuse = computed(
  () =>
    new Fuse(props.allPlayers, {
      includeScore: true,
      keys: ["player"],
      threshold: 0.3,
    })
);
const normalizedSearch = computed(() => search.value.trim());
const results = computed(() =>
  normalizedSearch.value
    ? fuse.value
        .search(normalizedSearch.value, { limit: MAX_RESULTS })
        .map((result) => result.item)
        .filter((item) => !props.alreadyAttempted.includes(item.player))
    : props.allPlayers
        .filter((item) => !props.alreadyAttempted.includes(item.player))
        .slice(0, MAX_RESULTS)
);

const isOpen = computed(
  () =>
    isFocused.value && (results.value.length > 0 || !!normalizedSearch.value)
);

watch(normalizedSearch, () => {
  activeIndex.value = results.value.length > 0 ? 0 : -1;
});

watch(
  results,
  () => {
    resultRefs.value = [];
    if (activeIndex.value >= results.value.length) activeIndex.value = -1;
  },
  { flush: "post" }
);

watch(activeIndex, async (index) => {
  if (index < 0) return;
  await nextTick();
  resultRefs.value[index]?.scrollIntoView({ block: "nearest" });
});

const selectPlayerWClose = (player: string) => {
  props.selectPlayer(player);
  search.value = "";
  activeIndex.value = -1;
  inputRef.value?.focus();
};

const onKeydown = (e: KeyboardEvent) => {
  if (!isOpen.value) {
    if (
      (e.key === "ArrowDown" || e.key === "ArrowUp") &&
      results.value.length > 0
    ) {
      e.preventDefault();
      isFocused.value = true;
      activeIndex.value = e.key === "ArrowDown" ? 0 : results.value.length - 1;
      return;
    }
    if (e.key === "Escape" && search.value) {
      e.preventDefault();
      search.value = "";
      activeIndex.value = -1;
    }
    return;
  }

  switch (e.key) {
    case "ArrowDown": {
      e.preventDefault();
      activeIndex.value =
        activeIndex.value < results.value.length - 1
          ? activeIndex.value + 1
          : 0;
      break;
    }
    case "ArrowUp": {
      e.preventDefault();
      activeIndex.value =
        activeIndex.value > 0
          ? activeIndex.value - 1
          : results.value.length - 1;
      break;
    }
    case "Enter": {
      if (activeIndex.value < 0) return;
      e.preventDefault();
      const selected = results.value[activeIndex.value];
      if (selected) selectPlayerWClose(selected.player);
      break;
    }
    case "Escape": {
      e.preventDefault();
      search.value = "";
      activeIndex.value = -1;
      break;
    }
  }
};
</script>

<template>
  <div class="search">
    <div
      :class="[
        'search__input-wrapper',
        { 'search__input-wrapper--focused': isFocused },
      ]"
    >
      <svg
        class="search__icon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" stroke-linecap="round" />
      </svg>
      <input
        ref="inputRef"
        v-model="search"
        type="text"
        :placeholder="$t('search.placeholder')"
        :aria-label="$t('search.placeholder')"
        :aria-expanded="isOpen"
        aria-controls="search-results"
        :aria-activedescendant="
          activeIndex >= 0 ? `search-option-${activeIndex}` : undefined
        "
        @input="onSearch"
        @keydown="onKeydown"
        @focus="isFocused = true"
        @blur="
          () => {
            if (!pointerOverResults) isFocused = false;
          }
        "
      />
    </div>
    <div :class="`results-wrapper ${isOpen ? 'results-wrapper--active' : ''}`">
      <div class="box-fill"></div>
      <div
        id="search-results"
        class="results"
        :class="{ active: isOpen }"
        role="listbox"
        :aria-label="$t('search.placeholder')"
        @mouseenter="pointerOverResults = true"
        @mouseleave="pointerOverResults = false"
      >
        <div
          v-if="normalizedSearch && results.length === 0"
          class="result result--empty"
        >
          <p>{{ $t("search.noResults") }}</p>
        </div>
        <div
          v-for="(result, index) in results"
          :id="`search-option-${index}`"
          :key="result.player"
          :ref="(el) => setResultRef(el, index)"
          class="result"
          role="option"
          :aria-selected="index === activeIndex"
          :class="{ 'result--active': index === activeIndex }"
          @click="selectPlayerWClose(result.player)"
          @mousemove="activeIndex = index"
          @mousedown.prevent
        >
          <img :src="result.image" :alt="result.player" />
          <p>{{ result.player }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "sass:color";
@use "../../../styles/variables.scss" as v;
@use "../../../styles/mixins.scss" as m;

.search {
  position: relative;
  width: 100%;
  max-width: 100%;
  padding-inline: 1rem;
  min-height: 3rem;

  .search__input-wrapper {
    position: absolute;
    width: calc(100% - 2rem);
    height: 3rem;
    z-index: 15;
    border-radius: v.$radius-xl;
    background-color: v.$searchBarBackground;
    display: flex;
    align-items: center;
    border: 2px solid transparent;
    @include m.transition(all, v.$transition-normal);

    &--focused {
      border-color: rgba(200, 230, 78, 0.3);
      box-shadow: v.$shadow-glow;
      background-color: v.$surface-3;
    }

    .search__icon {
      width: 1.1rem;
      height: 1.1rem;
      margin-left: 1.15rem;
      flex-shrink: 0;
      color: v.$fontSubtle;
      @include m.transition(color, v.$transition-fast);
    }

    &--focused .search__icon {
      color: v.$color900;
    }

    input {
      width: 100%;
      height: 100%;
      border: 0;
      border-radius: v.$radius-xl;
      padding-left: 0.75rem;
      padding-right: 1.5rem;
      outline: none;
      font-size: 0.95rem;
      background-color: transparent;
      color: v.$fontColor;

      &::placeholder {
        color: v.$fontSubtle;
      }
    }
  }

  .results-wrapper {
    position: absolute;
    width: calc(100% - 2rem);
    background-color: v.$searchBarResultBackground;
    border-radius: v.$radius-xl;
    top: 0;
    z-index: 10;
    @include m.transition(all, v.$transition-normal);

    &.results-wrapper--active {
      border-bottom-right-radius: v.$radius-md;
      border-bottom-left-radius: v.$radius-md;
      border-bottom: 0.5rem solid v.$searchBarResultBackground;
      box-shadow: v.$shadow-lg;
      border: 1px solid v.$border-subtle;
      border-top: none;
      z-index: 20;
    }

    .box-fill {
      height: 3rem;
      pointer-events: none;
    }

    .results {
      overflow-y: auto;
      max-height: 0;
      transform-origin: top;
      @include m.transition(all, v.$transition-slow, ease);

      &.active {
        max-height: min(19rem, 40vh);
        padding: 0.35rem 0.25rem;
      }

      .result {
        list-style: none;
        margin: 0.2rem 0.35rem;
        padding: 0.7rem 0.85rem;
        border-bottom: none;
        border-radius: v.$radius-md;
        color: v.$fontColor;
        display: flex;
        align-items: center;
        gap: 0.85rem;
        cursor: pointer;
        background-color: transparent;
        @include m.transition(all, v.$transition-fast, ease);
        box-shadow: inset 0 -1px 0 v.$border-subtle;

        &:hover,
        &.result--active {
          background-color: v.$searchBarResultHoverBackground;
        }

        img {
          object-fit: cover;
          object-position: 50% 15%;
          border-radius: v.$radius-full;
          width: 2.75rem;
          height: 2.75rem;
          border: 1px solid v.$border-strong;
          box-shadow: v.$shadow-sm;
          flex: 0 0 auto;
        }

        p {
          margin: 0;
          font-size: 1.05rem;
          font-weight: 500;
          line-height: 1.2;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          min-width: 0;
        }

        &:last-child {
          box-shadow: none;
        }

        &--empty {
          cursor: default;
          opacity: 0.6;
          justify-content: center;
          &:hover {
            background-color: transparent;
          }
        }
      }
    }
  }
}
</style>
