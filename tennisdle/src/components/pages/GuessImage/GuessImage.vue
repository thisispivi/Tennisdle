<script setup lang="ts">
import { computed } from "vue";
import ConfettiExplosion from "vue-confetti-explosion";

import { useDispatch, useSelector } from "../../../redux/helpers";
import {
  addAttempt,
  checkGame,
  surrender as surrenderAction,
} from "../../../redux/slices/image/slice";
import { RootState } from "../../../redux/store";
import { Player } from "../../../typings/Player";
import { getDailyIndex,getDateAsKey } from "../../../utils/date";
import { SurrenderButton } from "../../atoms";
import { Lives, Search } from "../../molecules";
import { Base } from "../../templates";

const { loader } = defineProps<{
  loader: () => { players: Player[]; isAtp: boolean };
}>();
const { players, isAtp } = loader();

const store = useSelector((state) => state.image);
const dispatch = useDispatch();

const playersWithImage = players.filter((p) => p.image && p.image.length > 0);
const dailyIndex = getDailyIndex(isAtp ? 0 : 100);
const dailyPlayer = playersWithImage[dailyIndex % playersWithImage.length];

dispatch(checkGame({ isAtp, playerName: dailyPlayer.player }));

const gameKey = isAtp ? "atpGames" : "wtaGames";

const game = computed(() => {
  const s = store.value as RootState["image"];
  return s[gameKey][getDateAsKey()];
});

const playerToGuess = computed(() => {
  if (!game.value) return dailyPlayer;
  return (
    players.find((p) => p.player === game.value.currentPlayer) ?? dailyPlayer
  );
});

const isGameActive = computed(
  () => game.value && !game.value.isWon && game.value.lives > 0
);
const isEndGame = computed(
  () => game.value && (game.value.isWon || game.value.lives === 0)
);

const attemptPlayer = (playerKey: string) => {
  dispatch(addAttempt({ attempt: playerKey, isAtp }));
};

const onSurrender = () => {
  dispatch(surrenderAction({ isAtp }));
};

const alreadyAttempted = computed(() => game.value?.attempts || []);

const pageHeight = window.innerHeight;
const pageWidth = window.innerWidth;
</script>

<template>
  <div class="guess-image">
    <div v-if="game?.isWon" class="centered-explosion">
      <ConfettiExplosion
        :duration="3000"
        :stage-height="pageHeight"
        :stage-width="pageWidth"
        :particle-count="200"
      />
    </div>
    <Base>
      <div class="guess-image__content">
        <div class="guess-image__info">
          <Lives :lives-remaining="game?.lives ?? 6" />
          <SurrenderButton v-if="isGameActive" @surrender="onSurrender" />
        </div>

        <div class="guess-image__image-container">
          <img
            v-if="playerToGuess"
            :src="playerToGuess.image"
            :alt="isEndGame ? playerToGuess.player : 'Mystery player'"
            class="guess-image__photo"
            :style="{ filter: `blur(${game?.blurLevel ?? 20}px)` }"
          />
          <div v-if="isEndGame" class="guess-image__reveal">
            <h2 :class="{ 'guess-image__reveal--won': game?.isWon }">
              {{ playerToGuess?.player }}
            </h2>
          </div>
        </div>

        <Search
          v-if="isGameActive"
          :all-players="players"
          :select-player="attemptPlayer"
          :already-attempted="alreadyAttempted"
        />

        <div
          v-if="alreadyAttempted.length > 0 && isGameActive"
          class="guess-image__attempts"
        >
          <p
            v-for="attempt in alreadyAttempted"
            :key="attempt"
            class="guess-image__wrong"
          >
            {{ attempt }}
          </p>
        </div>

        <p v-if="isEndGame" class="guess-image__daily-done">
          {{ $t("modal.daily.lost.description") }}
        </p>
      </div>
    </Base>
  </div>
</template>

<style lang="scss" scoped>
@use "../../../styles/variables.scss" as v;
@use "../../../styles/mixins.scss" as m;
@use "../../../styles/animations.scss";

.guess-image {
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
    max-width: 40rem;
    animation: fadeInUp 0.4s cubic-bezier(0.4, 0, 0.2, 1) both;
  }

  &__info {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  &__image-container {
    position: relative;
    width: 16rem;
    height: 20rem;
    border-radius: v.$radius-lg;
    overflow: hidden;
    box-shadow: v.$shadow-lg;
    background: v.$surface-1;
    border: 1px solid v.$border-medium;
  }

  &__photo {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: 50% 20%;
    transition: filter 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  }

  &__reveal {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 1.25rem 1rem;
    background: linear-gradient(transparent, rgba(11, 13, 18, 0.92));
    animation: fadeInUp 0.45s cubic-bezier(0.4, 0, 0.2, 1);

    h2 {
      margin: 0;
      font-size: 1.25rem;
      text-align: center;
      color: v.$error;
      font-weight: 600;

      &--won {
        color: v.$success;
      }
    }
  }

  &__attempts {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
    justify-content: center;
    max-width: 25rem;

    .guess-image__wrong {
      padding: 0.3rem 0.65rem;
      background-color: v.$surface-1;
      border: 1px solid v.$border-subtle;
      border-radius: v.$radius-sm;
      font-size: 0.8rem;
      color: v.$fontMuted;
      text-decoration: line-through;
    }
  }

  &__daily-done {
    text-align: center;
    color: v.$fontMuted;
    font-size: 0.9rem;
  }
}
</style>
