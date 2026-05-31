<script setup lang="ts">
import Fuse from "fuse.js";
import { computed, ref } from "vue";
import ConfettiExplosion from "vue-confetti-explosion";

import venues from "../../../assets/db/venues.json";
import { useDispatch, useSelector } from "../../../redux/helpers";
import {
  addAttempt,
  checkGame,
  surrender as surrenderAction,
} from "../../../redux/slices/venue/slice";
import { RootState } from "../../../redux/store";
import { Venue } from "../../../typings/Venue";
import { getDailyIndex, getDateAsKey } from "../../../utils/date";
import { SurrenderButton } from "../../atoms";
import { Lives } from "../../molecules";
import { Base } from "../../templates";

const NUM_LIVES = 6;

const typedVenues: Venue[] = venues as Venue[];

const store = useSelector((state) => state.venue);
const dispatch = useDispatch();

const search = ref("");
const isFocused = ref(false);
const inputRef = ref<HTMLInputElement | null>(null);
const activeIndex = ref(-1);
const imageError = ref(false);

const fuse = new Fuse(typedVenues, {
  includeScore: true,
  keys: ["tournament"],
  threshold: 0.4,
});

const dailyIndex = getDailyIndex(200);
const dailyVenue = typedVenues[dailyIndex % typedVenues.length];

dispatch(checkGame({ venueId: dailyVenue.id }));

const game = computed(() => {
  const s = store.value as RootState["venue"];
  return s.games[getDateAsKey()];
});

const currentVenue = computed(() => {
  if (!game.value) return dailyVenue;
  return (
    typedVenues.find((v) => v.id === game.value.currentVenueId) ?? dailyVenue
  );
});

const isGameActive = computed(
  () => game.value && !game.value.isWon && game.value.lives > 0
);
const isEndGame = computed(
  () => game.value && (game.value.isWon || game.value.lives === 0)
);
const isWon = computed(() => game.value?.isWon ?? false);
const isSurrendered = computed(() => game.value?.isSurrendered ?? false);

const currentImage = computed(() => {
  if (!currentVenue.value?.images?.length || imageError.value) return "";
  return currentVenue.value.images[0];
});

const surfaceClass = computed(() => {
  const s = currentVenue.value?.surface?.toLowerCase() ?? "";
  if (s.includes("clay")) return "surface--clay";
  if (s.includes("grass")) return "surface--grass";
  return "surface--hard";
});

// ── Progressive image blur ─────────────────────────────────────────────────
// 6 lives = max blur (no errors yet), 0 lives = sharp (end of game)
const imageBlur = computed(() => {
  if (isEndGame.value) return 0;
  const lives = game.value?.lives ?? NUM_LIVES;
  const blurMap: Record<number, number> = {
    6: 22,
    5: 17,
    4: 13,
    3: 9,
    2: 5,
    1: 2,
  };
  return blurMap[lives] ?? 0;
});

// ── Progressive hints ───────────────────────────────────────────────────────
// Surface  → after 1 error  (lives ≤ 5)
// Type     → when 3 lives left
// Country  → when 1 life left
const livesRemaining = computed(() => game.value?.lives ?? NUM_LIVES);

const showSurfaceHint = computed(() => livesRemaining.value <= NUM_LIVES - 1);
const showTypeHint = computed(() => livesRemaining.value <= 3);
const showCountryHint = computed(() => livesRemaining.value <= 1);

// ── Search ──────────────────────────────────────────────────────────────────
const results = computed(() => {
  if (!search.value.trim()) return [];
  return fuse
    .search(search.value, { limit: 10 })
    .map((r) => r.item)
    .filter((v) => !game.value?.attempts.includes(v.tournament));
});

const isOpen = computed(() => results.value.length > 0 && isFocused.value);

const selectTournament = (tournament: string) => {
  dispatch(
    addAttempt({
      attempt: tournament,
      correctTournament: currentVenue.value.tournament,
    })
  );
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
      if (selected) selectTournament(selected.tournament);
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

const onSurrender = () => {
  dispatch(surrenderAction());
};

const pageHeight = window.innerHeight;
const pageWidth = window.innerWidth;
</script>

<template>
  <div class="guess-venue">
    <div v-if="isWon" class="centered-explosion">
      <ConfettiExplosion
        :duration="3000"
        :stage-height="pageHeight"
        :stage-width="pageWidth"
        :particle-count="200"
      />
    </div>
    <Base>
      <div class="guess-venue__content">
        <!-- Header: lives + surrender -->
        <div class="guess-venue__info">
          <Lives :lives-remaining="game?.lives ?? 6" />
          <SurrenderButton v-if="isGameActive" @surrender="onSurrender" />
        </div>

        <!-- Venue image — always centred, blur decreases with each life lost -->
        <div
          :class="[
            'guess-venue__image-container',
            surfaceClass,
            { 'guess-venue__image-container--revealed': isEndGame },
          ]"
        >
          <img
            v-if="currentImage"
            :src="currentImage"
            :alt="isEndGame ? currentVenue.tournament : 'Mystery venue'"
            class="guess-venue__photo"
            :style="{ filter: imageBlur > 0 ? `blur(${imageBlur}px)` : 'none' }"
            @error="imageError = true"
          />
          <div v-else class="guess-venue__image-placeholder">
            <div class="guess-venue__court-lines" aria-hidden="true">
              <div class="court-line court-line--horizontal" />
              <div class="court-line court-line--vertical" />
              <div class="court-line court-line--center" />
              <div class="court-service-box" />
            </div>
            <span class="guess-venue__placeholder-label">
              {{ isEndGame ? currentVenue.tournament : "?" }}
            </span>
          </div>
        </div>

        <!-- Progressive hints -->
        <div
          v-if="showSurfaceHint || showTypeHint || showCountryHint"
          class="guess-venue__hints"
        >
          <Transition name="hint">
            <div
              v-if="showSurfaceHint"
              class="guess-venue__hint guess-venue__hint--surface"
            >
              <span class="guess-venue__hint-icon" aria-hidden="true">🎾</span>
              <span class="guess-venue__hint-label">Surface</span>
              <span class="guess-venue__hint-value">{{
                currentVenue.surface
              }}</span>
            </div>
          </Transition>
          <Transition name="hint">
            <div
              v-if="showTypeHint"
              class="guess-venue__hint guess-venue__hint--type"
            >
              <span class="guess-venue__hint-icon" aria-hidden="true">🏆</span>
              <span class="guess-venue__hint-label">Category</span>
              <span class="guess-venue__hint-value">{{
                currentVenue.category
              }}</span>
            </div>
          </Transition>
          <Transition name="hint">
            <div
              v-if="showCountryHint"
              class="guess-venue__hint guess-venue__hint--country"
            >
              <span class="guess-venue__hint-icon" aria-hidden="true">📍</span>
              <span class="guess-venue__hint-label">Country</span>
              <span class="guess-venue__hint-value">{{
                currentVenue.country
              }}</span>
            </div>
          </Transition>
        </div>

        <!-- Search input -->
        <div v-if="isGameActive" class="guess-venue__search">
          <div
            :class="[
              'guess-venue__input-wrapper',
              { 'guess-venue__input-wrapper--open': isOpen },
              { 'guess-venue__input-wrapper--focused': isFocused },
            ]"
          >
            <div
              class="guess-venue__input-bar"
              :class="{ 'guess-venue__input-bar--focused': isFocused }"
            >
              <svg
                class="guess-venue__search-icon"
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
                :placeholder="$t('search.venuePlaceholder')"
                :aria-label="$t('search.venuePlaceholder')"
                :aria-expanded="isOpen"
                aria-controls="venue-search-results"
                @keydown="onKeydown"
                @focus="isFocused = true"
                @blur="isFocused = false"
              />
            </div>

            <Transition name="venue-dropdown">
              <div
                v-if="isOpen"
                id="venue-search-results"
                class="guess-venue__dropdown"
                role="listbox"
              >
                <div
                  v-for="(result, index) in results"
                  :key="result.id"
                  class="guess-venue__result"
                  role="option"
                  :aria-selected="index === activeIndex"
                  :class="{
                    'guess-venue__result--active': index === activeIndex,
                  }"
                  @click="selectTournament(result.tournament)"
                  @mousemove="activeIndex = index"
                  @mousedown.prevent
                >
                  <p>{{ result.tournament }}</p>
                </div>
              </div>
            </Transition>
          </div>
        </div>

        <!-- Wrong attempts -->
        <div
          v-if="game?.attempts.length && isGameActive"
          class="guess-venue__attempts"
        >
          <p
            v-for="attempt in game.attempts"
            :key="attempt"
            class="guess-venue__wrong"
          >
            {{ attempt }}
          </p>
        </div>

        <!-- End game reveal -->
        <div v-if="isEndGame" class="guess-venue__reveal">
          <div
            :class="[
              'guess-venue__status-badge',
              isWon
                ? 'guess-venue__status-badge--won'
                : isSurrendered
                  ? 'guess-venue__status-badge--surrendered'
                  : 'guess-venue__status-badge--lost',
            ]"
          >
            <span v-if="isWon">Correct!</span>
            <span v-else-if="isSurrendered">Surrendered</span>
            <span v-else>Out of lives</span>
          </div>
          <h2
            :class="[
              'guess-venue__reveal-name',
              isWon
                ? 'guess-venue__reveal-name--won'
                : 'guess-venue__reveal-name--lost',
            ]"
          >
            {{ currentVenue.tournament }}
          </h2>
          <div class="guess-venue__details">
            <span class="guess-venue__detail-item">
              <span class="guess-venue__detail-icon" aria-hidden="true"
                >🏟️</span
              >
              {{ currentVenue.venueName }}
            </span>
            <span class="guess-venue__detail-item">
              <span class="guess-venue__detail-icon" aria-hidden="true"
                >📍</span
              >
              {{ currentVenue.city }}, {{ currentVenue.country }}
            </span>
            <span class="guess-venue__surface-pill" :class="surfaceClass">
              {{ currentVenue.surface }}
            </span>
          </div>
          <div
            v-if="!isWon && game?.attempts.length"
            class="guess-venue__end-attempts"
          >
            <p class="guess-venue__end-attempts-label">Your guesses:</p>
            <div class="guess-venue__end-attempts-list">
              <span
                v-for="attempt in game.attempts"
                :key="attempt"
                class="guess-venue__wrong"
              >
                {{ attempt }}
              </span>
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

/* Hint chip entrance */
.hint-enter-active {
  transition:
    opacity 0.35s ease,
    transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}
.hint-enter-from {
  opacity: 0;
  transform: translateY(-6px);
}

/* Venue dropdown */
.venue-dropdown-enter-active {
  transition:
    opacity 0.18s ease,
    transform 0.18s cubic-bezier(0.4, 0, 0.2, 1);
}
.venue-dropdown-leave-active {
  transition: opacity 0.12s ease;
}
.venue-dropdown-enter-from,
.venue-dropdown-leave-to {
  opacity: 0;
  transform: translateY(-4px) scaleY(0.96);
}

.guess-venue {
  height: 100%;
  width: 100%;

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
    padding: 1.5rem 1rem 2rem;
    gap: 1.25rem;
    width: 100%;
    max-width: 44rem;
    animation: fadeInUp 0.4s cubic-bezier(0.4, 0, 0.2, 1) both;
  }

  &__info {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.65rem 0.85rem;
    border-radius: v.$radius-full;
    border: 1px solid v.$border-subtle;
    background: v.$surface-1;
  }

  // ── Image ──────────────────────────────────────────────────────────────────
  &__image-container {
    position: relative;
    width: 22rem;
    height: 16rem;
    border-radius: v.$radius-lg;
    overflow: hidden;
    box-shadow: v.$shadow-lg;
    border: 1px solid v.$border-medium;
    @include m.transition(border-color, v.$transition-normal);

    &--revealed {
      border-color: v.$border-strong;
    }

    &.surface--clay {
      background: linear-gradient(
        135deg,
        #6b2c16 0%,
        #a04020 50%,
        #7a3218 100%
      );
    }
    &.surface--grass {
      background: linear-gradient(
        135deg,
        #1a4d2e 0%,
        #2d6a4f 50%,
        #1b4332 100%
      );
    }
    &.surface--hard {
      background: linear-gradient(
        135deg,
        #0d2b4a 0%,
        #1a4a7a 50%,
        #0f3460 100%
      );
    }

    @media (max-width: 430px) {
      width: 100%;
      max-width: 20rem;
      height: 14rem;
    }
  }

  &__photo {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    // The blur value is driven by inline :style; we add a smooth transition
    transition: filter 0.6s ease;
  }

  &__image-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }

  &__court-lines {
    position: absolute;
    inset: 0;
    opacity: 0.25;

    .court-line {
      position: absolute;
      background: rgba(255, 255, 255, 0.7);

      &--horizontal {
        left: 10%;
        right: 10%;
        top: 50%;
        height: 1px;
      }
      &--vertical {
        top: 10%;
        bottom: 10%;
        left: 50%;
        width: 1px;
      }
      &--center {
        left: 10%;
        right: 10%;
        top: 10%;
        bottom: 10%;
        background: transparent;
        border: 1px solid rgba(255, 255, 255, 0.7);
        width: auto;
        height: auto;
      }
    }

    .court-service-box {
      position: absolute;
      left: 25%;
      right: 25%;
      top: 30%;
      bottom: 30%;
      border: 1px solid rgba(255, 255, 255, 0.5);
    }
  }

  &__placeholder-label {
    position: relative;
    z-index: 1;
    font-size: 1.4rem;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.6);
    text-align: center;
    padding: 1rem;
    letter-spacing: 0.08em;
  }

  // ── Progressive hints ──────────────────────────────────────────────────────
  &__hints {
    display: flex;
    flex-direction: column;
    gap: 0.45rem;
    width: 100%;
    max-width: 25rem;
  }

  &__hint {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    padding: 0.55rem 0.9rem;
    border-radius: v.$radius-md;
    font-size: 0.88rem;
    border: 1px solid v.$border-subtle;
    background-color: v.$surface-1;

    &-icon {
      flex-shrink: 0;
      font-size: 1rem;
    }

    &-label {
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: v.$fontSubtle;
      flex-shrink: 0;
      min-width: 4rem;
    }

    &-value {
      font-weight: 600;
      color: v.$fontColor;
    }

    &--surface {
      border-color: rgba(200, 230, 78, 0.2);
      background-color: rgba(200, 230, 78, 0.06);
      .guess-venue__hint-label {
        color: rgba(200, 230, 78, 0.7);
      }
    }
    &--type {
      border-color: rgba(180, 138, 234, 0.2);
      background-color: rgba(180, 138, 234, 0.06);
      .guess-venue__hint-label {
        color: rgba(180, 138, 234, 0.7);
      }
    }
    &--country {
      border-color: rgba(52, 211, 153, 0.2);
      background-color: rgba(52, 211, 153, 0.06);
      .guess-venue__hint-label {
        color: rgba(52, 211, 153, 0.7);
      }
    }
  }

  // ── Search ──────────────────────────────────────────────────────────────────
  &__search {
    width: 100%;
    max-width: 25rem;
    /* Reserve space for the input bar height so layout doesn't shift */
    min-height: 2.85rem;
    position: relative;
    z-index: 20;
  }

  &__input-wrapper {
    position: absolute;
    left: 0;
    right: 0;
    border-radius: v.$radius-xl;

    &--open {
      .guess-venue__input-bar {
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
      }
    }
  }

  &__input-bar {
    display: flex;
    align-items: center;
    height: 2.85rem;
    border-radius: v.$radius-xl;
    background-color: v.$surface-2;
    box-shadow: 0 0 0 1.5px transparent;
    outline: none;
    @include m.transition(box-shadow background-color, v.$transition-normal);

    &--focused {
      box-shadow:
        0 0 0 1.5px v.$border-accent,
        0 0 12px rgba(200, 230, 78, 0.1);
      background-color: v.$surface-3;
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
  }

  &__search-icon {
    width: 1.1rem;
    height: 1.1rem;
    margin-left: 1.15rem;
    flex-shrink: 0;
    color: v.$fontSubtle;
    @include m.transition(color, v.$transition-fast);
  }

  &__input-bar--focused &__search-icon {
    color: v.$color900;
  }

  &__dropdown {
    position: relative;
    z-index: 1;
    background-color: v.$surface-2;
    border-bottom-left-radius: v.$radius-xl;
    border-bottom-right-radius: v.$radius-xl;
    box-shadow:
      0 0 0 1.5px v.$border-accent,
      v.$shadow-lg;
    overflow: hidden;
    max-height: 15rem;
    overflow-y: auto;
    padding: 0.3rem;
    transform-origin: top center;
    @include m.scrollbar-thin;
  }

  &__result {
    padding: 0.65rem 0.85rem;
    border-radius: v.$radius-sm;
    color: v.$fontColor;
    cursor: pointer;
    @include m.transition(all, v.$transition-fast);

    &:hover,
    &--active {
      background-color: v.$surface-3;
    }

    + .guess-venue__result {
      border-top: 1px solid v.$border-subtle;
    }

    p {
      margin: 0;
      font-size: 0.92rem;
      font-weight: 500;
    }
  }

  // ── Wrong attempts ──────────────────────────────────────────────────────────
  &__attempts {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
    justify-content: center;
    max-width: 25rem;
  }

  &__wrong {
    padding: 0.3rem 0.65rem;
    background-color: v.$error-dim;
    border: 1px solid rgba(248, 113, 113, 0.2);
    border-radius: v.$radius-sm;
    font-size: 0.8rem;
    color: v.$fontMuted;
    text-decoration: line-through;
  }

  // ── End game reveal ─────────────────────────────────────────────────────────
  &__reveal {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
    text-align: center;
    animation: fadeInUp 0.45s cubic-bezier(0.4, 0, 0.2, 1);
    padding: 1.25rem 1.5rem;
    background: v.$surface-1;
    border: 1px solid v.$border-medium;
    border-radius: v.$radius-lg;
    max-width: 25rem;
    width: 100%;
  }

  &__status-badge {
    display: inline-flex;
    align-items: center;
    padding: 0.3rem 0.9rem;
    border-radius: v.$radius-full;
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;

    &--won {
      background: v.$success-dim;
      border: 1px solid rgba(52, 211, 153, 0.3);
      color: v.$success;
    }
    &--lost {
      background: v.$error-dim;
      border: 1px solid rgba(248, 113, 113, 0.3);
      color: v.$error;
    }
    &--surrendered {
      background: v.$warning-dim;
      border: 1px solid rgba(251, 191, 36, 0.3);
      color: v.$warning;
    }
  }

  &__reveal-name {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 700;

    &--won {
      color: v.$success;
    }
    &--lost {
      color: v.$fontColor;
    }
  }

  &__details {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.35rem;
    color: v.$fontMuted;
    font-size: 0.9rem;
  }

  &__detail-item {
    display: flex;
    align-items: center;
    gap: 0.4rem;
  }

  &__detail-icon {
    font-size: 0.85rem;
  }

  &__surface-pill {
    display: inline-block;
    padding: 0.2rem 0.7rem;
    border-radius: v.$radius-sm;
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.04em;
    margin-top: 0.15rem;

    &.surface--clay {
      background: rgba(160, 64, 32, 0.2);
      border: 1px solid rgba(160, 64, 32, 0.4);
      color: #d4825a;
    }
    &.surface--grass {
      background: rgba(45, 106, 79, 0.2);
      border: 1px solid rgba(45, 106, 79, 0.4);
      color: #52b788;
    }
    &.surface--hard {
      background: rgba(26, 74, 122, 0.2);
      border: 1px solid rgba(26, 74, 122, 0.4);
      color: #74b9e8;
    }
  }

  &__end-attempts {
    width: 100%;
    border-top: 1px solid v.$border-subtle;
    padding-top: 0.75rem;
    margin-top: 0.25rem;
  }

  &__end-attempts-label {
    margin: 0 0 0.5rem;
    font-size: 0.75rem;
    color: v.$fontSubtle;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  &__end-attempts-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.35rem;
    justify-content: center;
  }
}
</style>
