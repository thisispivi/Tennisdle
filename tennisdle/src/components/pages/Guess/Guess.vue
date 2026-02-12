<script setup lang="ts">
import { computed, ref } from "vue";
import ConfettiExplosion from "vue-confetti-explosion";

import { useDispatch, useSelector } from "../../../redux/helpers";
import { addAttempt, checkGame } from "../../../redux/slices/daily/slice";
import {
  calculateWinningStreak,
  retrieveDailyGame,
} from "../../../redux/slices/daily/utils";
import { RootState } from "../../../redux/store";
import { Player } from "../../../typings/Player";
import { Streak } from "../../atoms";
import { Lives, Search } from "../../molecules";
import { Attempt, AttemptHeader, Modal } from "../../organisms";
import { Base } from "../../templates";

const { loader } = defineProps<{
  loader: () => { players: Player[]; playerToGuess: Player; isAtp: boolean };
}>();
const { players, playerToGuess, isAtp } = loader();

const store = useSelector((state) => state.daily);
const dispatch = useDispatch();

dispatch(checkGame({ isAtp }));

const game = computed(() =>
  retrieveDailyGame(store.value as RootState["daily"], isAtp)
);

const attempts = computed(() =>
  game.value.attempts
    .map((a) => {
      const player = players.find((p) => p.player === a);
      return player;
    })
    .filter((p) => p !== undefined)
);

const attemptPlayer = (playerKey: string) => {
  dispatch(
    addAttempt({ attempt: playerKey, toGuess: playerToGuess.player, isAtp })
  );
};

const pageHeight = window.innerHeight;
const pageWidth = window.innerWidth;

const isModalOpen = ref(true);
const onClose = () => (isModalOpen.value = false);

const isEndGame = computed(() => game.value.lives === 0 || game.value.isWon);
const winningStreak = computed(() =>
  calculateWinningStreak(store.value as RootState["daily"], isAtp)
);
</script>

<template>
  <div class="guess">
    <div v-if="game.isWon" class="centered-explosion">
      <ConfettiExplosion
        :duration="3000"
        :stage-height="pageHeight"
        :stage-width="pageWidth"
        :particle-count="200"
      />
    </div>
    <Modal
      :is-won="game.isWon"
      :is-lost="game.lives === 0"
      :player="playerToGuess"
      :is-open="isModalOpen && (isEndGame || false)"
      :on-close="onClose"
      :game-mode="'daily'"
    />
    <Base>
      <div class="guess__content">
        <div class="guess__info">
          <Streak :winning-streak="winningStreak" />
          <Lives :lives-remaining="game.lives" />
        </div>
        <Search
          :all-players="players"
          :select-player="attemptPlayer"
          :already-attempted="game.attempts"
        />
        <AttemptHeader :is-atp="isAtp" />
        <div class="attempt__content__items">
          <Attempt
            v-for="attempt in attempts"
            :key="attempt.player"
            :player-to-guess="playerToGuess"
            :compare-player="attempt"
          />
        </div>
      </div>
    </Base>
  </div>
</template>

<style lang="scss" scoped>
@use "../../../styles/variables.scss" as v;
.guess {
  height: 100%;
  width: 100%;
  .centered-explosion {
    position: fixed;
    top: 25%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 100;
  }
  .guess__header {
    height: 5rem;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-inline: 2rem;
    h1 {
      color: v.$color800;
    }
  }
  .guess__content {
    height: calc(100% - 2rem);
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    .guess__info {
      margin-top: 2rem;
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    .search {
      margin-top: 1rem;
      margin-bottom: 2rem;
    }
    button {
      margin-top: 2rem;
      padding: 1rem 2rem;
      border: none;
      border-radius: 0.5rem;
      background-color: v.$color800;
      color: v.$color100;
      font-size: 1.5rem;
      cursor: pointer;
      &:hover {
        background-color: v.$color800;
      }
    }
    .attempt__content__items {
      overflow-y: auto;
      .single-attempt {
        padding: 0.75rem;
      }
    }
  }
}
</style>
