<script setup lang="ts">
import { Base } from "../../templates";
import { ref } from "vue";
import { Attempt, GuessHeader } from "../../organisms";
import { Search } from "../../molecules";
import { Player } from "../../../data/typings/Player";

const { loader } = defineProps<{
  loader: () => { players: Player[]; playerToGuess: Player };
}>();
const { players, playerToGuess } = loader();

const playerKeys = players.map((p) => p.player);

const attempts = ref<Player[]>([]);
const attemptPlayer = (playerKey: string) => {
  const idx = playerKeys.indexOf(playerKey);
  if (idx === -1) return;
  const playerObj = players[idx];
  attempts.value.unshift(playerObj);

  if (playerObj.player === playerToGuess.player) alert("WIN");
};
const getAlreadyAttempted = () => attempts.value.map((p) => p.player);
</script>

<template>
  <div class="guess">
    <Base :current-page-key="'guess'">
      <div class="guess__content">
        <Search
          :all-keys="playerKeys"
          :select-player="attemptPlayer"
          :already-attempted="getAlreadyAttempted()"
        />
        <GuessHeader />
        <div class="guess__content__items">
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
    .guess__content__items {
      overflow-y: auto;
      .single-guess {
        padding: 0.75rem;
      }
    }
  }
}
</style>
