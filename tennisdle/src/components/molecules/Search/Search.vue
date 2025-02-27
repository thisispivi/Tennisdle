<script setup lang="ts">
import Fuse from "fuse.js";
import { Players } from "../../../typings/Player";
import { computed, ref, defineProps } from "vue";

const { allPlayers, selectPlayer, alreadyAttempted } = defineProps<{
  allPlayers: Players;
  selectPlayer: (player: string) => void;
  alreadyAttempted: string[];
}>();

const MAX_RESULTS = 20;

const search = ref("");
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

const selectPlayerWClose = (player: string) => {
  selectPlayer(player);
  search.value = "";
};
</script>

<template>
  <div class="search">
    <input
      v-model="search"
      type="text"
      :placeholder="$t('search.placeholder')"
      :aria-label="$t('search.placeholder')"
      @input="onSearch"
    />
    <div
      :class="`results-wrapper ${results.length ? 'results-wrapper--active' : ''}`"
    >
      <div class="box-fill"></div>
      <div class="results" :class="{ active: results.length }">
        <div
          v-for="result in results"
          :key="result.player"
          class="result"
          role="button"
          aria-label="Select player {{ result.player }}"
          tabindex="0"
          @click="selectPlayerWClose(result.player)"
          @keydown.enter="selectPlayerWClose(result.player)"
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
      }
      .result {
        list-style: none;
        padding: 0.75rem 1rem;
        border-bottom: 0.063rem solid v.$color800o;
        color: v.$fontColor;
        display: flex;
        align-items: center;
        gap: 1rem;
        cursor: pointer;
        img {
          object-fit: cover;
          object-position: 50% 0;
          border-radius: 5rem;
          width: 2.5rem;
          height: 2.5rem;
        }
        p {
          font-size: 1.1rem;
          font-weight: 400;
        }
        &:last-child {
          border-bottom: none;
        }
        &:nth-child(odd) {
          filter: brightness(1.5);
        }
      }
    }
  }
}
</style>
