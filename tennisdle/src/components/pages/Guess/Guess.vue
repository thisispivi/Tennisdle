<script setup lang="ts">
import { Base } from "../../templates";
import { players } from "../../../assets/index";
import { ref } from "vue";
import { SingleGuess, GuessHeader } from "../../organisms";
import { Search } from "../../molecules";
import { Player } from "../../../data/typings/Player";

const numPlayers = players.length;
const playerKeys = players.map((p) => p.player);

const getRandomPlayer = () => {
  const randomIndex = Math.floor(Math.random() * numPlayers);
  console.log(players[randomIndex]);
  return players[randomIndex];
};
const player = ref<Player>(getRandomPlayer());

const guesses = ref<Player[]>([]);
const guessPlayer = (playerKey: string) => {
  const idx = playerKeys.indexOf(playerKey);
  if (idx === -1) return;
  const playerObj = players[idx];
  guesses.value.unshift(playerObj);

  if (playerObj.player === player.value.player) alert("WIN");
};
const getAlreadyGuessed = () => guesses.value.map((p) => p.player);
</script>

<template>
  <div class="guess">
    <Base>
      <div class="guess__content">
        <Search
          :all-keys="playerKeys"
          :select-player="guessPlayer"
          :already-guessed="getAlreadyGuessed()"
        />
        <GuessHeader />
        <div class="guess__content__items">
          <SingleGuess
            v-for="p in guesses"
            :key="p.player"
            :player="player"
            :compare-player="p"
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
