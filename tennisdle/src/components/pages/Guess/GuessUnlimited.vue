<script setup lang="ts">
import { Base } from "../../templates";
import { Attempt, AttemptHeader } from "../../organisms";
import { Lives, Search } from "../../molecules";
import { Streak } from "../../atoms";
import { Player } from "../../../typings/Player";
import { useDispatch, useSelector } from "../../../redux/helpers";
import {
  addAttempt,
  checkGame,
  continueGame as continueGameReducer,
  setNextPlayer,
} from "../../../redux/slices/unlimited/slice";
import { computed, ref, watch } from "vue";
import { retrieveUnlimitedGame } from "../../../redux/slices/unlimited/utils";
import { RootState } from "../../../redux/store";
import { Modal } from "../../organisms";
import ConfettiExplosion from "vue-confetti-explosion";

const { loader } = defineProps<{
  loader: () => { players: Player[]; isAtp: boolean };
}>();
const { players, isAtp } = loader();

const store = useSelector((state) => state.unlimited);
const dispatch = useDispatch();

dispatch(checkGame({ isAtp }));

const game = ref(
  retrieveUnlimitedGame(store.value as RootState["unlimited"], isAtp)
);

watch(
  () => store.value,
  (newValue) => {
    game.value = retrieveUnlimitedGame(
      newValue as RootState["unlimited"],
      isAtp
    );
  }
);

const playerToGuessKey = computed(() => game.value.toGuess);
const playerToGuess = computed(() => {
  const player = players.find((p) => p.player === playerToGuessKey.value);
  if (!player) throw new Error("Player to guess not found");
  return player;
});

const attempts = computed(() =>
  game.value.attempts
    .map((a) => {
      const player = players.find((p) => p.player === a);
      return player;
    })
    .filter((p) => p !== undefined)
);

const attemptPlayer = (playerKey: string) =>
  dispatch(addAttempt({ attempt: playerKey, isAtp }));

const isModalOpen = ref(true);
const onClose = () => (isModalOpen.value = false);

const continueGame = () => {
  dispatch(continueGameReducer({ isAtp }));
  setTimeout(() => {
    dispatch(setNextPlayer({ isAtp }));
  }, 300);
};

const pageHeight = window.innerHeight;
const pageWidth = window.innerWidth;

const winningStreak = computed(() => game.value.guessed.length);
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
      :is-open="isModalOpen && (game.lives === 0 || game.isWon)"
      :on-close="onClose"
      :on-continue="continueGame"
      :game-mode="'unlimited'"
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
