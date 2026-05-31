<script setup lang="ts">
import { computed, ref } from "vue";
import ConfettiExplosion from "vue-confetti-explosion";

import { atpPlayers, wtaPlayers } from "../../../assets";
import categories from "../../../assets/db/top10_categories.json";
import { useDispatch, useSelector } from "../../../redux/helpers";
import {
  addAttempt,
  checkGame,
  surrender as surrenderAction,
} from "../../../redux/slices/top10/slice";
import { RootState } from "../../../redux/store";
import { Top10Category } from "../../../typings/Top10";
import { countries } from "../../../utils/country";
import { getDailyIndex, getDateAsKey } from "../../../utils/date";
import { SurrenderButton } from "../../atoms";
import CountryFlag from "../../atoms/CountryFlag/CountryFlag.vue";
import { Lives, Search } from "../../molecules";
import { Base } from "../../templates";

const typedCategories: Top10Category[] = categories as Top10Category[];

const store = useSelector((state) => state.top10);
const dispatch = useDispatch();

const dailyIndex = getDailyIndex(300);
const dailyCategory = typedCategories[dailyIndex % typedCategories.length];

dispatch(checkGame({ categoryId: dailyCategory.id }));

const game = computed(() => {
  const s = store.value as RootState["top10"];
  return s.games[getDateAsKey()];
});

const selectedCategory = computed(() => {
  if (!game.value) return dailyCategory;
  return (
    typedCategories.find((c) => c.id === game.value.categoryId) ?? dailyCategory
  );
});

const isGameActive = computed(
  () => game.value && !game.value.isComplete && game.value.lives > 0
);
const isEndGame = computed(
  () => game.value && (game.value.isComplete || game.value.lives === 0)
);
const isWon = computed(
  () => game.value?.isComplete && (game.value?.lives ?? 0) > 0
);
const isSurrendered = computed(() => game.value?.isSurrendered ?? false);

const allPlayers = computed(() => {
  return selectedCategory.value.isAtp ? atpPlayers : wtaPlayers;
});

const validPlayerNames = computed(() => {
  return selectedCategory.value.players.map((p) => p.player);
});

const alreadyAttempted = computed(() => {
  if (!game.value) return [];
  return [...game.value.guessedPlayers, ...game.value.wrongAttempts];
});

// Build a map of player name → ISO country code for flag hints
const playerFlagMap = computed<Record<string, string | null>>(() => {
  const map: Record<string, string | null> = {};
  selectedCategory.value.players.forEach((entry) => {
    const found = allPlayers.value.find((p) => p.player === entry.player);
    if (found?.country) {
      const key = found.country.replace(/\s/g, "") as keyof typeof countries;
      map[entry.player] = countries[key] ?? null;
    } else {
      map[entry.player] = null;
    }
  });
  return map;
});

const slots = computed(() => {
  return selectedCategory.value.players.map((entry) => {
    const isGuessed = game.value?.guessedPlayers.includes(entry.player);
    const isRevealed = isEndGame.value;
    return {
      rank: entry.rank,
      player: entry.player,
      value: entry.value,
      isGuessed: !!isGuessed,
      showPlayer: !!isGuessed || !!isRevealed,
      flagCode: playerFlagMap.value[entry.player] ?? null,
    };
  });
});

const showFlags = ref(false);

const attemptPlayer = (playerKey: string) => {
  dispatch(
    addAttempt({
      attempt: playerKey,
      validPlayers: validPlayerNames.value,
    })
  );
};

const onSurrender = () => {
  dispatch(surrenderAction());
};

const pageHeight = window.innerHeight;
const pageWidth = window.innerWidth;
</script>

<template>
  <div class="top10">
    <div v-if="game?.isComplete && game?.lives > 0" class="centered-explosion">
      <ConfettiExplosion
        :duration="3000"
        :stage-height="pageHeight"
        :stage-width="pageWidth"
        :particle-count="200"
      />
    </div>
    <Base>
      <div class="top10__game">
        <div class="top10__game-header">
          <h2 class="top10__game-title">{{ $t(selectedCategory.titleKey) }}</h2>
          <div class="top10__game-info">
            <Lives :lives-remaining="game?.lives ?? 6" />
            <SurrenderButton v-if="isGameActive" @surrender="onSurrender" />
            <!-- Flag hint toggle -->
            <button
              class="top10__flag-toggle"
              :class="{ 'top10__flag-toggle--active': showFlags }"
              :title="showFlags ? 'Hide flag hints' : 'Show flag hints'"
              @click="showFlags = !showFlags"
            >
              <span class="top10__flag-toggle-icon">🏳️</span>
              <span>Flags</span>
            </button>
          </div>
        </div>

        <div
          v-if="isEndGame"
          class="top10__result-banner"
          :class="
            isWon
              ? 'top10__result-banner--won'
              : isSurrendered
                ? 'top10__result-banner--surrendered'
                : 'top10__result-banner--lost'
          "
        >
          <span v-if="isWon">Perfect! You named all 10!</span>
          <span v-else-if="isSurrendered"
            >Surrendered — {{ game?.guessedPlayers.length ?? 0 }}/10 found</span
          >
          <span v-else
            >Out of lives — {{ game?.guessedPlayers.length ?? 0 }}/10
            found</span
          >
        </div>

        <Search
          v-if="isGameActive"
          :all-players="allPlayers"
          :select-player="attemptPlayer"
          :already-attempted="alreadyAttempted"
          :close-on-select="true"
        />

        <div class="top10__slots">
          <div
            v-for="(slot, idx) in slots"
            :key="slot.rank"
            :class="[
              'top10__slot',
              { 'top10__slot--guessed': slot.isGuessed },
              { 'top10__slot--revealed': !slot.isGuessed && isEndGame },
            ]"
            :style="{ '--slot-i': idx }"
          >
            <!-- Flag hint (left side) -->
            <div v-if="showFlags && slot.flagCode" class="top10__slot-flag">
              <CountryFlag :country-code="slot.flagCode" />
            </div>

            <span class="top10__slot-rank">{{ slot.rank }}</span>
            <span v-if="slot.showPlayer" class="top10__slot-player">{{
              slot.player
            }}</span>
            <span v-else class="top10__slot-hidden">?</span>
            <span v-if="slot.showPlayer" class="top10__slot-value">{{
              slot.value
            }}</span>
          </div>
        </div>

        <div
          v-if="game?.wrongAttempts.length && isGameActive"
          class="top10__wrong-attempts"
        >
          <p
            v-for="attempt in game.wrongAttempts"
            :key="attempt"
            class="top10__wrong"
          >
            {{ attempt }}
          </p>
        </div>
      </div>
    </Base>
  </div>
</template>

<style lang="scss" scoped>
@use "../../../styles/variables.scss" as v;
@use "../../../styles/mixins.scss" as m;
@use "../../../styles/animations.scss";

.top10 {
  width: 100%;
  min-height: 100%;

  .centered-explosion {
    position: fixed;
    top: 25%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 100;
  }

  &__game {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1.5rem 1.25rem 1.25rem;
    gap: 1rem;
    width: 100%;
    max-width: 36rem;
    @include m.glass-card(14px, 0.5);
    border-radius: v.$radius-xl;
    max-height: calc(100vh - v.$headerHeight - 2.3rem);
    overflow-y: auto;
    overflow-x: visible;
    padding-bottom: 1.5rem;
    position: relative;
    animation: fadeInUp 0.4s cubic-bezier(0.4, 0, 0.2, 1) both;
    @include m.scrollbar-thin;
  }

  &__game-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    width: 100%;
  }

  &__game-title {
    margin: 0;
    font-size: 1.2rem;
    text-align: center;
    color: v.$fontColor;
    max-width: 100%;
    word-break: break-word;
    font-weight: 600;
  }

  &__game-info {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    z-index: 3;
    flex-wrap: wrap;
    justify-content: center;
  }

  &__flag-toggle {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    padding: 0.45rem 0.75rem;
    border: 1px solid v.$border-strong;
    border-radius: v.$radius-md;
    background-color: transparent;
    color: v.$fontMuted;
    font-size: 0.82rem;
    font-weight: 500;
    cursor: pointer;
    @include m.transition(all, v.$transition-fast);

    &-icon {
      font-size: 0.9rem;
      line-height: 1;
    }

    &:hover {
      border-color: v.$color900;
      color: v.$color900;
      background-color: v.$color900o;
    }

    &--active {
      border-color: rgba(200, 230, 78, 0.5);
      background-color: v.$color900o;
      color: v.$color900;
    }
  }

  &__slots {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    width: 100%;
    overflow-y: visible;
    min-height: 0;
  }

  &__slot {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.6rem 1rem;
    border-radius: v.$radius-md;
    background-color: v.$surface-1;
    border: 1px solid v.$border-subtle;
    @include m.transition(all, v.$transition-fast);
    animation: fadeInUp 0.3s cubic-bezier(0.4, 0, 0.2, 1) both;
    animation-delay: calc(0.03s * var(--slot-i, 0));

    &--guessed {
      background-color: v.$success-dim;
      border-color: rgba(52, 211, 153, 0.35);
      animation: scaleIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    &--revealed {
      opacity: 0.55;
    }
  }

  &__slot-flag {
    width: 1.55rem;
    height: 1.1rem;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    border-radius: 2px;
    overflow: hidden;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
  }

  &__slot-rank {
    width: 1.65rem;
    height: 1.65rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: v.$radius-full;
    background-color: v.$surface-3;
    font-size: 0.78rem;
    font-weight: 700;
    flex-shrink: 0;
    color: v.$color900;
  }

  &__slot-player {
    flex: 1;
    font-weight: 500;
    font-size: 0.92rem;
  }

  &__slot-hidden {
    flex: 1;
    font-weight: 500;
    font-size: 1rem;
    color: v.$fontSubtle;
  }

  &__slot-value {
    font-size: 0.8rem;
    color: v.$fontMuted;
    font-weight: 600;
    padding: 0.15rem 0.5rem;
    background: v.$surface-2;
    border-radius: v.$radius-sm;
  }

  &__result-banner {
    padding: 0.65rem 1.25rem;
    border-radius: v.$radius-md;
    font-size: 0.9rem;
    font-weight: 600;
    text-align: center;
    width: 100%;
    animation: scaleIn 0.35s cubic-bezier(0.4, 0, 0.2, 1);

    &--won {
      background: v.$success-dim;
      border: 1px solid rgba(52, 211, 153, 0.35);
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

  &__wrong-attempts {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
    justify-content: center;
    max-width: 100%;
    overflow-y: visible;
    max-height: unset;
    margin-top: 0.75rem;
    padding-top: 0.75rem;
    border-top: 1px solid v.$border-subtle;
    width: 100%;
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
}

@media (max-height: 760px) {
  .top10 {
    &__game {
      max-height: calc(100vh - v.$headerHeight - 1.6rem);
      padding-bottom: 1rem;
    }

    &__slot {
      padding-block: 0.48rem;
    }
  }
}
</style>
