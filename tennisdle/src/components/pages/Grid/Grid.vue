<script setup lang="ts">
import Fuse from "fuse.js";
import { computed, ref } from "vue";
import ConfettiExplosion from "vue-confetti-explosion";

import {
  allAtpPlayers,
  allWtaPlayers,
  atpPlayers,
  wtaPlayers,
} from "../../../assets";
import categoriesData from "../../../assets/db/grid_categories.json";
import puzzlesData from "../../../assets/db/grid_puzzles.json";
import { useDispatch, useSelector } from "../../../redux/helpers";
import { checkGame, guessCell } from "../../../redux/slices/grid/slice";
import { RootState } from "../../../redux/store";
import { GridCategory, GridPuzzle } from "../../../typings/Grid";
import { getDailyIndex, getDateAsKey } from "../../../utils/date";
import { GridCell } from "../../organisms";
import { Base } from "../../templates";

const typedPuzzles: GridPuzzle[] = puzzlesData as unknown as GridPuzzle[];
const typedCategories: GridCategory[] = categoriesData as GridCategory[];

const store = useSelector((state) => state.grid);
const dispatch = useDispatch();

const allPlayers = [
  ...allAtpPlayers,
  ...allWtaPlayers,
  ...atpPlayers,
  ...wtaPlayers,
];
const uniquePlayers = allPlayers.filter(
  (player, index, self) =>
    self.findIndex((p) => p.player === player.player) === index
);

const fuse = new Fuse(uniquePlayers, {
  includeScore: true,
  keys: ["player"],
  threshold: 0.28,
});

const dailyIndex = getDailyIndex(400);
const currentPuzzle = typedPuzzles[dailyIndex % typedPuzzles.length];

dispatch(checkGame({ puzzleId: currentPuzzle.id }));

const game = computed(() => {
  const s = store.value as RootState["grid"];
  return s.games[getDateAsKey()];
});

const isComplete = computed(() => game.value?.isComplete ?? false);
const isPerfect = computed(
  () => isComplete.value && (game.value?.score ?? 0) === 9
);

const pageHeight = window.innerHeight;
const pageWidth = window.innerWidth;

const getCategoryLabel = (categoryId: string): string => {
  const cat = typedCategories.find((c) => c.id === categoryId);
  return cat ? cat.labelKey : categoryId;
};

const rowCategories = computed(() =>
  currentPuzzle.rows.map((id) => ({
    id,
    labelKey: getCategoryLabel(id),
  }))
);

const colCategories = computed(() =>
  currentPuzzle.cols.map((id) => ({
    id,
    labelKey: getCategoryLabel(id),
  }))
);

const selectingCell = ref<{ row: number; col: number } | null>(null);
const cellSearch = ref("");
const cellSearchFocused = ref(false);
const cellActiveIndex = ref(-1);
const cellInputRef = ref<HTMLInputElement | null>(null);

const cellSearchResults = computed(() => {
  if (!cellSearch.value.trim()) {
    return uniquePlayers
      .filter((p) => !game.value?.usedPlayers.includes(p.player))
      .slice(0, 12);
  }
  return fuse
    .search(cellSearch.value.trim(), { limit: 12 })
    .map((r) => r.item)
    .filter((p) => !game.value?.usedPlayers.includes(p.player));
});

const isCellSearchOpen = computed(
  () => cellSearchResults.value.length > 0 && cellSearchFocused.value
);

const onCellClick = (row: number, col: number) => {
  if (isComplete.value) return;
  const cell = game.value?.cells[row]?.[col];
  if (cell && !cell.isEmpty) return;

  selectingCell.value = { row, col };
  cellSearch.value = "";
  cellActiveIndex.value = -1;

  setTimeout(() => {
    cellInputRef.value?.focus();
  }, 50);
};

const getSolutionKey = (row: number, col: number): string => {
  const rowId = currentPuzzle.rows[row];
  const colId = currentPuzzle.cols[col];
  return `${rowId}_${colId}`;
};

const getPlayerImage = (playerName: string | null | undefined): string => {
  if (!playerName) return "";
  return uniquePlayers.find((p) => p.player === playerName)?.image ?? "";
};

const selectPlayer = (playerName: string) => {
  if (!selectingCell.value) return;

  const { row, col } = selectingCell.value;
  const solutionKey = getSolutionKey(row, col);
  const validPlayers = currentPuzzle.solutions[solutionKey] || [];

  dispatch(
    guessCell({
      row,
      col,
      playerName,
      validPlayers,
    })
  );

  selectingCell.value = null;
  cellSearch.value = "";
  cellActiveIndex.value = -1;
};

const cancelCellSearch = () => {
  selectingCell.value = null;
  cellSearch.value = "";
  cellActiveIndex.value = -1;
};

const onCellSearchKeydown = (e: KeyboardEvent) => {
  if (!isCellSearchOpen.value) {
    if (e.key === "Escape") {
      e.preventDefault();
      cancelCellSearch();
    }
    return;
  }

  switch (e.key) {
    case "ArrowDown": {
      e.preventDefault();
      cellActiveIndex.value =
        cellActiveIndex.value < cellSearchResults.value.length - 1
          ? cellActiveIndex.value + 1
          : 0;
      break;
    }
    case "ArrowUp": {
      e.preventDefault();
      cellActiveIndex.value =
        cellActiveIndex.value > 0
          ? cellActiveIndex.value - 1
          : cellSearchResults.value.length - 1;
      break;
    }
    case "Enter": {
      if (cellActiveIndex.value < 0) return;
      e.preventDefault();
      const selected = cellSearchResults.value[cellActiveIndex.value];
      if (selected) selectPlayer(selected.player);
      break;
    }
    case "Escape": {
      e.preventDefault();
      cancelCellSearch();
      break;
    }
  }
};
</script>

<template>
  <div class="grid-page">
    <div v-if="isPerfect" class="centered-explosion">
      <ConfettiExplosion
        :duration="3000"
        :stage-height="pageHeight"
        :stage-width="pageWidth"
        :particle-count="200"
      />
    </div>
    <Base>
      <div class="grid-page__content">
        <div class="grid-page__header">
          <h1 class="grid-page__title">{{ $t("page.grid.title") }}</h1>
          <div class="grid-page__counters">
            <span class="grid-page__counter grid-page__counter--score">
              {{ game?.score ?? 0 }}/9
            </span>
            <span
              v-if="!isComplete"
              class="grid-page__counter grid-page__counter--guesses"
            >
              {{ 9 - (game?.guessesUsed ?? 0) }} remaining
            </span>
          </div>
        </div>

        <div
          v-if="isComplete"
          class="grid-page__result-banner"
          :class="
            isPerfect
              ? 'grid-page__result-banner--perfect'
              : 'grid-page__result-banner--done'
          "
        >
          <span v-if="isPerfect">Perfect score! 9/9</span>
          <span v-else>Game over — {{ game?.score ?? 0 }}/9 correct</span>
        </div>

        <div class="grid-page__board">
          <div class="grid-page__corner"></div>
          <div
            v-for="col in colCategories"
            :key="col.id"
            class="grid-page__col-header"
          >
            <span>{{ $t(col.labelKey) }}</span>
          </div>

          <template v-for="(rowCat, rowIdx) in rowCategories" :key="rowCat.id">
            <div class="grid-page__row-header">
              <span>{{ $t(rowCat.labelKey) }}</span>
            </div>
            <GridCell
              v-for="(_, colIdx) in colCategories"
              :key="`${rowIdx}-${colIdx}`"
              :cell-state="
                game?.cells[rowIdx]?.[colIdx] ?? {
                  playerName: null,
                  isCorrect: false,
                  isEmpty: true,
                }
              "
              :player-image="
                getPlayerImage(game?.cells[rowIdx]?.[colIdx]?.playerName)
              "
              :is-selecting="
                selectingCell?.row === rowIdx && selectingCell?.col === colIdx
              "
              @click="onCellClick(rowIdx, colIdx)"
            />
          </template>
        </div>

        <div
          v-if="selectingCell"
          class="grid-page__search-overlay"
          @click.self="cancelCellSearch"
        >
          <div class="grid-page__search-container">
            <div class="grid-page__search-header">
              <p class="grid-page__search-label">
                {{
                  $t(getCategoryLabel(currentPuzzle.rows[selectingCell.row]))
                }}
                &amp;
                {{
                  $t(getCategoryLabel(currentPuzzle.cols[selectingCell.col]))
                }}
              </p>
              <div class="grid-page__search-meta">
                <span class="grid-page__search-remaining"
                  >🎯 {{ 9 - (game?.guessesUsed ?? 0) }} left</span
                >
                <button
                  class="grid-page__search-close"
                  @click="cancelCellSearch"
                >
                  &times;
                </button>
              </div>
            </div>
            <div
              :class="[
                'grid-page__input-wrapper',
                { 'grid-page__input-wrapper--focused': cellSearchFocused },
              ]"
            >
              <svg
                class="grid-page__search-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" stroke-linecap="round" />
              </svg>
              <input
                ref="cellInputRef"
                v-model="cellSearch"
                type="text"
                :placeholder="$t('search.placeholder')"
                @keydown="onCellSearchKeydown"
                @focus="cellSearchFocused = true"
                @blur="cellSearchFocused = false"
              />
            </div>
            <div
              v-if="isCellSearchOpen"
              class="grid-page__search-results"
              role="listbox"
            >
              <div
                v-for="(result, index) in cellSearchResults"
                :key="result.player"
                class="grid-page__search-result"
                role="option"
                :aria-selected="index === cellActiveIndex"
                :class="{
                  'grid-page__search-result--active': index === cellActiveIndex,
                }"
                @click="selectPlayer(result.player)"
                @mousemove="cellActiveIndex = index"
                @mousedown.prevent
              >
                <img :src="result.image" :alt="result.player" />
                <p>{{ result.player }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Base>
  </div>
</template>

<style lang="scss" scoped>
@use "sass:color";
@use "../../../styles/variables.scss" as v;
@use "../../../styles/mixins.scss" as m;
@use "../../../styles/animations.scss";

.grid-page {
  width: 100%;
  min-height: 100%;

  .centered-explosion {
    position: fixed;
    top: 25%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 100;
  }

  &__content {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1.5rem 1rem;
    gap: 1.25rem;
    width: 100%;
    max-width: 60rem;
    @include m.glass-card(14px, 0.45);
    border-radius: v.$radius-xl;
    animation: fadeInUp 0.4s cubic-bezier(0.4, 0, 0.2, 1) both;
  }

  &__header {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }

  &__title {
    margin: 0;
    color: v.$fontColor;
    text-align: center;
  }

  &__score {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 700;
    color: v.$success;
  }

  &__counters {
    display: flex;
    gap: 0.75rem;
    align-items: center;
    flex-wrap: wrap;
    justify-content: center;
  }

  &__counter {
    font-size: 0.85rem;
    font-weight: 600;
    padding: 0.25rem 0.7rem;
    border-radius: v.$radius-full;
    background: v.$surface-2;
    border: 1px solid v.$border-subtle;
    color: v.$fontMuted;

    &--score {
      color: v.$success;
      border-color: rgba(52, 211, 153, 0.25);
      background: rgba(52, 211, 153, 0.07);
    }

    &--guesses {
      color: v.$color900;
      border-color: rgba(200, 230, 78, 0.2);
      background: rgba(200, 230, 78, 0.06);
    }
  }

  &__result-banner {
    padding: 0.7rem 1.5rem;
    border-radius: v.$radius-md;
    font-size: 0.95rem;
    font-weight: 600;
    text-align: center;
    animation: scaleIn 0.35s cubic-bezier(0.4, 0, 0.2, 1);
    width: 100%;

    &--perfect {
      background: v.$success-dim;
      border: 1px solid rgba(52, 211, 153, 0.35);
      color: v.$success;
    }

    &--done {
      background: v.$surface-2;
      border: 1px solid v.$border-medium;
      color: v.$fontColor;
    }
  }

  &__board {
    display: grid;
    grid-template-columns: auto repeat(3, 7.4rem);
    grid-template-rows: auto repeat(3, 7.4rem);
    gap: 0.35rem;

    @media (max-width: 430px) {
      grid-template-columns: auto repeat(3, 5.2rem);
      grid-template-rows: auto repeat(3, 5.2rem);
      gap: 0.2rem;
    }
  }

  &__corner {
    width: 7.4rem;

    @media (max-width: 430px) {
      width: 5.2rem;
    }
  }

  &__col-header,
  &__row-header {
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 0.4rem;
    font-size: 0.68rem;
    font-weight: 600;
    color: v.$fontMuted;
    line-height: 1.2;
  }

  &__col-header {
    border-bottom: 2px solid rgba(200, 230, 78, 0.25);
  }

  &__row-header {
    border-right: 2px solid rgba(200, 230, 78, 0.25);
    width: 7.4rem;

    @media (max-width: 430px) {
      width: 5.2rem;
    }
  }

  &__search-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.65);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 50;
    padding: 1rem;
    animation: fadeIn 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  }

  &__search-container {
    width: 100%;
    max-width: 24rem;
    background-color: v.$surface-1;
    border-radius: v.$radius-lg;
    padding: 1.25rem;
    border: 1px solid v.$border-medium;
    box-shadow: v.$shadow-lg;
    animation: scaleIn 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  }

  &__search-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1rem;
  }

  &__search-label {
    margin: 0;
    font-size: 0.88rem;
    font-weight: 600;
    color: v.$color900;
    flex: 1;
    min-width: 0;
  }

  &__search-meta {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-shrink: 0;
  }

  &__search-remaining {
    font-size: 0.75rem;
    font-weight: 600;
    color: v.$color900;
    opacity: 0.8;
  }

  &__search-close {
    background: none;
    border: none;
    color: v.$fontMuted;
    font-size: 1.5rem;
    cursor: pointer;
    padding: 0 0.25rem;
    @include m.transition(color, v.$transition-fast);
    line-height: 1;

    &:hover {
      color: v.$fontColor;
    }
  }

  &__input-wrapper {
    display: flex;
    align-items: center;
    height: 2.85rem;
    border-radius: v.$radius-xl;
    background-color: v.$surface-2;
    border: 1.5px solid transparent;
    @include m.transition(all, v.$transition-normal);

    &--focused {
      border-color: rgba(200, 230, 78, 0.3);
      box-shadow: v.$shadow-glow;
      background-color: v.$surface-3;
    }

    input {
      width: 100%;
      height: 100%;
      border: 0;
      border-radius: v.$radius-xl;
      padding-left: 0.75rem;
      padding-right: 1rem;
      outline: none;
      font-size: 0.95rem;
      background-color: transparent;
      color: v.$fontColor;

      &::placeholder {
        color: v.$fontSubtle;
      }
    }
  }

  &__search-icon {
    width: 1.1rem;
    height: 1.1rem;
    margin-left: 1rem;
    flex-shrink: 0;
    color: v.$fontSubtle;
  }

  &__input-wrapper--focused &__search-icon {
    color: v.$color900;
  }

  &__search-results {
    margin-top: 0.5rem;
    max-height: 15rem;
    overflow-y: auto;
    border-radius: v.$radius-md;
    background-color: v.$surface-2;
    border: 1px solid v.$border-subtle;
    padding: 0.3rem;
    @include m.scrollbar-thin;
  }

  &__search-result {
    display: flex;
    align-items: center;
    gap: 0.7rem;
    padding: 0.55rem 0.75rem;
    border-radius: v.$radius-sm;
    cursor: pointer;
    @include m.transition(all, v.$transition-fast);

    &:hover,
    &--active {
      background-color: v.$surface-3;
    }

    + .grid-page__search-result {
      border-top: 1px solid v.$border-subtle;
    }

    img {
      object-fit: cover;
      object-position: 50% 15%;
      border-radius: v.$radius-full;
      width: 2.1rem;
      height: 2.1rem;
      border: 1px solid v.$border-medium;
      flex: 0 0 auto;
    }

    p {
      margin: 0;
      font-size: 0.9rem;
      font-weight: 500;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      min-width: 0;
    }
  }
}
</style>
