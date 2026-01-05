<script setup lang="ts">
import Fuse from "fuse.js";
import { Players } from "../../../typings/Player";
import { computed, nextTick, ref, watch } from "vue";
import type { ComponentPublicInstance } from "vue";

const { allPlayers, selectPlayer, alreadyAttempted } = defineProps<{
  allPlayers: Players;
  selectPlayer: (player: string) => void;
  alreadyAttempted: string[];
}>();

const MAX_RESULTS = 20;

const search = ref("");
const inputRef = ref<HTMLInputElement | null>(null);
const activeIndex = ref(-1);
const resultRefs = ref<HTMLElement[]>([]);

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
};

const fuse = new Fuse(allPlayers, { includeScore: true, keys: ["player"] });
const results = computed(() =>
  fuse
    .search(search.value, { limit: MAX_RESULTS })
    .map((result) => result.item)
    .filter((item) => !alreadyAttempted.includes(item.player))
);

const isOpen = computed(() => results.value.length > 0);

watch(search, () => {
  activeIndex.value = -1;
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
  selectPlayer(player);
  search.value = "";
  activeIndex.value = -1;
  inputRef.value?.focus();
};

const onKeydown = (e: KeyboardEvent) => {
  if (!isOpen.value) {
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
    />
    <div
      :class="`results-wrapper ${results.length ? 'results-wrapper--active' : ''}`"
    >
      <div class="box-fill"></div>
      <div
        id="search-results"
        class="results"
        :class="{ active: results.length }"
        role="listbox"
        :aria-label="$t('search.placeholder')"
      >
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
@use "../../../styles/variables.scss" as v;
@use "../../../styles/mixins.scss" as m;

.search {
  position: relative;
  width: 100%;
  max-width: 25rem;
  padding-inline: 1rem;
  height: 3rem;
  input {
    width: calc(100% - 2rem);
    height: 3rem;
    border: 0;
    border-radius: 1.5rem;
    padding-inline: 2rem;
    outline: none;
    position: absolute;
    z-index: 15;
    font-size: 1.1rem;
    background-color: v.$searchBarBackground;
    color: v.$fontColor;
  }
  .results-wrapper {
    position: absolute;
    width: calc(100% - 2rem);
    background-color: v.$searchBarResultBackground;
    border-radius: 1.5rem;
    top: 0rem;
    z-index: 10;
    &.results-wrapper--active {
      border-bottom-right-radius: 1rem;
      border-bottom-left-radius: 1rem;
      border-bottom: 0.75rem solid v.$searchBarResultBackground;
      box-shadow: 0 0.6rem 0.9rem rgba(0, 0, 0, 0.7);
    }
    .box-fill {
      height: 3rem;
    }
    .results {
      overflow-y: auto;
      max-height: 0rem;
      @include m.transition(all, 0.5s, ease);
      &.active {
        max-height: 20rem;
        padding: 0.35rem 0.25rem;
      }

      .result {
        list-style: none;
        margin: 0.2rem 0.35rem;
        padding: 0.7rem 0.85rem;
        border-bottom: none;
        border-radius: 0.9rem;

        color: v.$fontColor;
        display: flex;
        align-items: center;
        gap: 0.85rem;
        cursor: pointer;

        background-color: transparent;
        @include m.transition(background-color, 0.15s, ease);

        // subtle separation without harsh borders
        box-shadow: inset 0 -1px 0 rgba(255, 255, 255, 0.06);

        &:hover {
          background-color: v.$searchBarResultHoverBackground;
        }

        &.result--active {
          background-color: v.$searchBarResultHoverBackground;
        }

        img {
          object-fit: cover;
          object-position: 50% 15%;
          border-radius: 999rem;
          width: 2.75rem;
          height: 2.75rem;
          border: 1px solid rgba(255, 255, 255, 0.12);
          box-shadow: 0 0.25rem 0.6rem rgba(0, 0, 0, 0.35);
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
      }
    }
  }
}
</style>
