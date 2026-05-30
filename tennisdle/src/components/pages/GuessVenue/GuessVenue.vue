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
import { getDailyIndex,getDateAsKey } from "../../../utils/date";
import { SurrenderButton } from "../../atoms";
import { Lives } from "../../molecules";
import { Base } from "../../templates";

const typedVenues: Venue[] = venues as Venue[];

const store = useSelector((state) => state.venue);
const dispatch = useDispatch();

const search = ref("");
const isFocused = ref(false);
const inputRef = ref<HTMLInputElement | null>(null);
const activeIndex = ref(-1);

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

const currentImage = computed(() => {
  if (!currentVenue.value?.images?.length) return "";
  return currentVenue.value.images[0];
});

const revealedHints = computed(() => {
  const count = game.value?.hintsRevealed ?? 0;
  return currentVenue.value.hints.slice(0, count);
});

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
    <div v-if="game?.isWon" class="centered-explosion">
      <ConfettiExplosion
        :duration="3000"
        :stage-height="pageHeight"
        :stage-width="pageWidth"
        :particle-count="200"
      />
    </div>
    <Base>
      <div class="guess-venue__content">
        <div class="guess-venue__info">
          <Lives :lives-remaining="game?.lives ?? 6" />
          <SurrenderButton v-if="isGameActive" @surrender="onSurrender" />
        </div>

        <div class="guess-venue__image-container">
          <img
            v-if="currentImage"
            :src="currentImage"
            :alt="isEndGame ? currentVenue.tournament : 'Mystery venue'"
            class="guess-venue__photo"
          />
        </div>

        <div v-if="revealedHints.length > 0" class="guess-venue__hints">
          <div
            v-for="(hint, index) in revealedHints"
            :key="index"
            class="guess-venue__hint"
          >
            <span class="guess-venue__hint-icon">💡</span>
            <span>{{ hint }}</span>
          </div>
        </div>

        <div v-if="isGameActive" class="guess-venue__search">
          <div
            :class="[
              'guess-venue__input-wrapper',
              { 'guess-venue__input-wrapper--focused': isFocused },
            ]"
          >
            <svg
              class="guess-venue__search-icon"
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
              :placeholder="$t('search.venuePlaceholder')"
              :aria-label="$t('search.venuePlaceholder')"
              :aria-expanded="isOpen"
              aria-controls="venue-search-results"
              @keydown="onKeydown"
              @focus="isFocused = true"
              @blur="isFocused = false"
            />
          </div>
          <div
            v-if="isOpen"
            id="venue-search-results"
            class="guess-venue__results"
            role="listbox"
          >
            <div
              v-for="(result, index) in results"
              :key="result.id"
              class="guess-venue__result"
              role="option"
              :aria-selected="index === activeIndex"
              :class="{ 'guess-venue__result--active': index === activeIndex }"
              @click="selectTournament(result.tournament)"
              @mousemove="activeIndex = index"
              @mousedown.prevent
            >
              <p>{{ result.tournament }}</p>
            </div>
          </div>
        </div>

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

        <div v-if="isEndGame" class="guess-venue__reveal">
          <h2 :class="{ 'guess-venue__reveal--won': game?.isWon }">
            {{ currentVenue.tournament }}
          </h2>
          <div class="guess-venue__details">
            <span>{{ currentVenue.venueName }}</span>
            <span>{{ currentVenue.city }}, {{ currentVenue.country }}</span>
            <span class="guess-venue__surface">{{ currentVenue.surface }}</span>
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
    padding: 1.5rem 1rem;
    gap: 1.25rem;
    width: 100%;
    max-width: 44rem;
    animation: fadeInUp 0.4s cubic-bezier(0.4, 0, 0.2, 1) both;
  }

  &__info {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  &__image-container {
    position: relative;
    width: 22rem;
    height: 16rem;
    border-radius: v.$radius-lg;
    overflow: hidden;
    box-shadow: v.$shadow-lg;
    background: v.$surface-1;
    border: 1px solid v.$border-medium;

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
    transition: filter 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  }

  &__hints {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    max-width: 25rem;
    width: 100%;
  }

  &__hint {
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
    padding: 0.55rem 0.85rem;
    background-color: v.$surface-1;
    border-radius: v.$radius-md;
    font-size: 0.88rem;
    border: 1px solid v.$border-subtle;
    animation: fadeInUp 0.3s cubic-bezier(0.4, 0, 0.2, 1) both;
    color: v.$fontColor;

    &-icon {
      flex-shrink: 0;
    }
  }

  &__search {
    position: relative;
    width: 100%;
    max-width: 25rem;
    z-index: 15;
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

  &__search-icon {
    width: 1.1rem;
    height: 1.1rem;
    margin-left: 1.15rem;
    flex-shrink: 0;
    color: v.$fontSubtle;
    @include m.transition(color, v.$transition-fast);
  }

  &__input-wrapper--focused &__search-icon {
    color: v.$color900;
  }

  &__results {
    position: absolute;
    top: 3.15rem;
    width: 100%;
    background-color: v.$surface-2;
    border: 1px solid v.$border-medium;
    border-radius: v.$radius-md;
    box-shadow: v.$shadow-lg;
    max-height: 15rem;
    overflow-y: auto;
    padding: 0.3rem;
    animation: dropdownReveal 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    transform-origin: top;
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

  &__attempts {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
    justify-content: center;
    max-width: 25rem;

    .guess-venue__wrong {
      padding: 0.3rem 0.65rem;
      background-color: v.$surface-1;
      border: 1px solid v.$border-subtle;
      border-radius: v.$radius-sm;
      font-size: 0.8rem;
      color: v.$fontMuted;
      text-decoration: line-through;
    }
  }

  &__reveal {
    text-align: center;
    animation: fadeInUp 0.45s cubic-bezier(0.4, 0, 0.2, 1);

    h2 {
      margin: 0 0 0.6rem;
      font-size: 1.4rem;
      color: v.$error;
      font-weight: 600;

      &--won {
        color: v.$success;
      }
    }
  }

  &__details {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    color: v.$fontMuted;
    font-size: 0.9rem;
  }

  &__surface {
    display: inline-block;
    padding: 0.2rem 0.6rem;
    background: v.$surface-2;
    border: 1px solid v.$border-subtle;
    border-radius: v.$radius-sm;
    font-size: 0.78rem;
    margin-top: 0.25rem;
    color: v.$color900;
    font-weight: 600;
  }
}
</style>
