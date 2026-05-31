<script setup lang="ts">
import Fuse from "fuse.js";
import type { ComponentPublicInstance } from "vue";
import { computed, nextTick, ref, watch } from "vue";

import { Players } from "../../../typings/Player";

const props = defineProps<{
  allPlayers: Players;
  selectPlayer: (player: string) => void;
  alreadyAttempted: string[];
  closeOnSelect?: boolean;
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

const normalizeDiacritics = (str: string) =>
  str.normalize("NFD").replace(/\p{M}/gu, "");

const onSearch = (e: Event) => {
  search.value = (e.target as HTMLInputElement).value;
  if (activeIndex.value < 0) activeIndex.value = 0;
};

const fuse = computed(
  () =>
    new Fuse(props.allPlayers, {
      includeScore: true,
      keys: ["player"],
      threshold: 0.35,
      getFn: (obj, path) => {
        const val = (obj as unknown as Record<string, unknown>)[path as string];
        if (typeof val === "string") return normalizeDiacritics(val);
        return val as string;
      },
    })
);

const normalizedSearch = computed(() =>
  normalizeDiacritics(search.value.trim())
);

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
  if (props.closeOnSelect) {
    isFocused.value = false;
    inputRef.value?.blur();
  } else {
    inputRef.value?.focus();
  }
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
      isFocused.value = false;
      inputRef.value?.blur();
      break;
    }
  }
};
</script>

<template>
  <div class="search">
    <div
      class="search__container"
      :class="{ 'search__container--open': isOpen }"
    >
      <!-- Input bar -->
      <div
        class="search__input-bar"
        :class="{ 'search__input-bar--focused': isFocused }"
      >
        <svg
          class="search__icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" stroke-linecap="round" />
        </svg>
        <input
          ref="inputRef"
          v-model="search"
          type="text"
          autocomplete="off"
          spellcheck="false"
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

      <!-- Dropdown -->
      <Transition name="dropdown">
        <div
          v-if="isOpen"
          id="search-results"
          class="search__dropdown"
          role="listbox"
          :aria-label="$t('search.placeholder')"
          @mouseenter="pointerOverResults = true"
          @mouseleave="pointerOverResults = false"
        >
          <div
            v-if="normalizedSearch && results.length === 0"
            class="search__result search__result--empty"
          >
            <p>{{ $t("search.noResults") }}</p>
          </div>
          <div
            v-for="(result, index) in results"
            :id="`search-option-${index}`"
            :key="result.player"
            :ref="(el) => setResultRef(el, index)"
            class="search__result"
            role="option"
            :aria-selected="index === activeIndex"
            :class="{ 'search__result--active': index === activeIndex }"
            @click="selectPlayerWClose(result.player)"
            @mousemove="activeIndex = index"
            @mousedown.prevent
          >
            <img :src="result.image" :alt="result.player" />
            <p>{{ result.player }}</p>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "../../../styles/variables.scss" as v;
@use "../../../styles/mixins.scss" as m;

/* Dropdown open/close transition */
.dropdown-enter-active {
  transition:
    opacity 0.18s ease,
    transform 0.18s cubic-bezier(0.4, 0, 0.2, 1);
}
.dropdown-leave-active {
  transition:
    opacity 0.12s ease,
    transform 0.12s ease;
}
.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-6px) scaleY(0.95);
}

.search {
  position: relative;
  width: 100%;
  /* Reserve space for the input bar so layout doesn't shift */
  min-height: 3rem;

  &__container {
    position: absolute;
    left: 0;
    right: 0;
    /* Elevated while the dropdown is open so it sits above siblings */
    z-index: 40;
    border-radius: v.$radius-xl;

    &--open {
      .search__input-bar {
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
        /* Hide the bottom border so it merges seamlessly with the dropdown */
        box-shadow:
          0 0 0 1.5px rgba(200, 230, 78, 0.3),
          0 0 16px rgba(200, 230, 78, 0.12);
      }
    }
  }

  &__input-bar {
    display: flex;
    align-items: center;
    height: 3rem;
    border-radius: v.$radius-xl;
    background-color: v.$searchBarBackground;
    /* Use box-shadow instead of border to avoid the white-flash artefact */
    box-shadow: 0 0 0 1.5px transparent;
    outline: none;
    @include m.transition(box-shadow background-color, v.$transition-normal);

    &--focused {
      box-shadow:
        0 0 0 1.5px rgba(200, 230, 78, 0.3),
        0 0 16px rgba(200, 230, 78, 0.12);
      background-color: v.$surface-3;
    }
  }

  &__icon {
    width: 1.1rem;
    height: 1.1rem;
    margin-left: 1.15rem;
    flex-shrink: 0;
    color: v.$fontSubtle;
    @include m.transition(color, v.$transition-fast);

    .search__input-bar--focused & {
      color: v.$color900;
    }
  }

  input {
    width: 100%;
    height: 100%;
    border: 0;
    border-radius: inherit;
    padding-left: 0.75rem;
    padding-right: 1.5rem;
    outline: none;
    font-size: 0.95rem;
    background-color: transparent;
    color: v.$fontColor;
    caret-color: v.$color900;

    &::placeholder {
      color: v.$fontSubtle;
    }
  }

  &__dropdown {
    position: relative; /* sits in normal flow right below the input bar */
    z-index: 1;
    background-color: v.$searchBarResultBackground;
    border-bottom-left-radius: v.$radius-xl;
    border-bottom-right-radius: v.$radius-xl;
    box-shadow:
      0 0 0 1.5px rgba(200, 230, 78, 0.3),
      v.$shadow-lg;
    /* Clip to the rounded corners */
    overflow: hidden;
    transform-origin: top center;

    /* Scrollable list inside */
    > .search__result,
    > .search__result--empty {
      /* first child needs top padding gap */
    }

    /* Inner scroll container */
    max-height: min(19rem, 40vh);
    overflow-y: auto;
    padding: 0.35rem 0.25rem 0.45rem;
    @include m.scrollbar-thin;
  }

  &__result {
    list-style: none;
    margin: 0.2rem 0.35rem;
    padding: 0.65rem 0.85rem;
    border-radius: v.$radius-md;
    color: v.$fontColor;
    display: flex;
    align-items: center;
    gap: 0.85rem;
    cursor: pointer;
    background-color: transparent;
    @include m.transition(background-color, v.$transition-fast);
    box-shadow: inset 0 -1px 0 v.$border-subtle;

    &:hover,
    &--active {
      background-color: v.$searchBarResultHoverBackground;
    }

    &:last-child {
      box-shadow: none;
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
</style>
