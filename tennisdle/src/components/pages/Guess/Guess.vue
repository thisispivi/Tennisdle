<script setup lang="ts">
import { computed, ref } from "vue";
import ConfettiExplosion from "vue-confetti-explosion";

import { useDispatch, useSelector } from "../../../redux/helpers";
import {
  addAttempt,
  checkGame,
  surrender as surrenderAction,
} from "../../../redux/slices/daily/slice";
import {
  calculateWinningStreak,
  retrieveDailyGame,
} from "../../../redux/slices/daily/utils";
import { RootState } from "../../../redux/store";
import { Player } from "../../../typings/Player";
import { ShareButton, Streak, SurrenderButton } from "../../atoms";
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

const onSurrender = () => {
  dispatch(surrenderAction({ isAtp }));
};

const pageHeight = window.innerHeight;
const pageWidth = window.innerWidth;

const isModalOpen = ref(true);
const onClose = () => (isModalOpen.value = false);

const isEndGame = computed(() => game.value.lives === 0 || game.value.isWon);
const isGameActive = computed(() => !game.value.isWon && game.value.lives > 0);
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
    >
      <template #actions>
        <ShareButton
          v-if="isEndGame"
          game-mode="daily"
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

<style lang="scss">
@use "../../../styles/_guess-page.scss";
</style>
