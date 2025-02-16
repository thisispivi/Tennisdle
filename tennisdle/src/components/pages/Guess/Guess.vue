<script setup lang="ts">
import { Base } from "../../templates";
import { Attempt, AttemptHeader } from "../../organisms";
import { Lives, Search } from "../../molecules";
import { Player } from "../../../typings/Player";
import { useDispatch, useSelector } from "../../../redux/helpers";
import { addAttempt, checkGame } from "../../../redux/slices/daily";
import { getDateAsKey } from "../../../utils/date";
import { computed } from "vue";
import ConfettiExplosion from "vue-confetti-explosion";

const { loader } = defineProps<{
  loader: () => { players: Player[]; playerToGuess: Player; isAtp: boolean };
}>();
const { players, playerToGuess, isAtp } = loader();
const playerKeys = players.map((p) => p.player);

const store = useSelector((state) => state.dailyAtp);
const dispatch = useDispatch();

dispatch(checkGame({ isAtp }));

const game = computed(
  () => store.value[isAtp ? "atpGames" : "wtaGames"][getDateAsKey()]
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
    <Base>
      <div class="guess__content">
        <Lives :lives-remaining="game.lives" />
        <Search
          :all-keys="playerKeys"
          :select-player="attemptPlayer"
          :already-attempted="game.attempts"
        />
        <AttemptHeader />
        <div class="attempt__content__items">
          <Attempt
            v-for="a in attempts"
            :key="a.player"
            :player-to-guess="playerToGuess"
            :compare-player="a"
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
      color: v.$color900;
    }
  }
  .guess__content {
    height: calc(100% - 2rem);
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    .lives {
      margin-top: 2rem;
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
      background-color: v.$color900;
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
