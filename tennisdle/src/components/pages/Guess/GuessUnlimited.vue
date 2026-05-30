<script setup lang="ts">
import { computed, ref, watch } from "vue";
import ConfettiExplosion from "vue-confetti-explosion";

import { useDispatch, useSelector } from "../../../redux/helpers";
import {
  addAttempt,
  checkGame,
  continueGame as continueGameReducer,
  setNextPlayer,
  surrender as surrenderAction,
} from "../../../redux/slices/unlimited/slice";
import { retrieveUnlimitedGame } from "../../../redux/slices/unlimited/utils";
import { RootState } from "../../../redux/store";
import { Player } from "../../../typings/Player";
import { ShareButton, Streak, SurrenderButton } from "../../atoms";
import { Lives, Search } from "../../molecules";
import { Attempt, AttemptHeader, Modal } from "../../organisms";
import { Base } from "../../templates";

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

const onSurrender = () => {
  dispatch(surrenderAction({ isAtp }));
};

const isModalOpen = ref(true);
const onClose = () => (isModalOpen.value = false);

const continueGame = () => {
  dispatch(continueGameReducer({ isAtp }));
  setTimeout(() => {
    dispatch(setNextPlayer({ isAtp }));
  }, 300);
};

const isGameActive = computed(() => !game.value.isWon && game.value.lives > 0);

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
    >
      <template #actions>
        <ShareButton
          v-if="game.lives === 0 || game.isWon"
          game-mode="unlimited"
          :is-atp="isAtp"
          :attempts="attempts"
          :player-to-guess="playerToGuess"
          :lives-remaining="game.lives"
          :is-won="game.isWon"
        />
      </template>
    </Modal>
    <Base>
      <div class="guess__content">
        <div class="guess__info">
          <Streak :winning-streak="winningStreak" />
          <Lives :lives-remaining="game.lives" />
          <SurrenderButton v-if="isGameActive" @surrender="onSurrender" />
        </div>
        <Search
          v-if="isGameActive"
          :all-players="players"
          :select-player="attemptPlayer"
          :already-attempted="game.attempts"
        />
        <AttemptHeader :is-atp="isAtp" />
        <div class="attempt__content__items">
          <div
            v-if="attempts.length === 0 && isGameActive"
            class="attempt__empty-state"
          >
            <p>{{ $t("search.placeholder") }} above to start guessing!</p>
          </div>
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
  .guess__content {
    height: calc(100% - 1rem);
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    max-width: 74rem;
    padding: 1.4rem 0.8rem 0.8rem;
    .guess__info {
      margin-top: 0.5rem;
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.65rem 0.85rem;
      border-radius: v.$radius-full;
      border: 1px solid v.$border-subtle;
      background: v.$surface-1;
    }
    .search {
      margin-top: 1.1rem;
      margin-bottom: 1.1rem;
    }
    .attempt__content__items {
      width: 100%;
      overflow-y: auto;
      padding: 0.5rem;
      border-radius: v.$radius-lg;
      border: 1px solid v.$border-subtle;
      background: v.$surface-1;
      .single-attempt {
        padding: 0.75rem;
      }
      .attempt__empty-state {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 2rem 1rem;
        p {
          color: v.$fontSubtle;
          font-size: 0.88rem;
          text-align: center;
        }
      }
    }
  }
}
</style>
