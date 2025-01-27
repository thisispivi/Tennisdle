<script setup>
import { Base } from "../../templates";
import { players } from "../../../assets/index";
import { ref } from "vue";
import { SingleGuess, GuessHeader } from "../../organisms";

const numPlayers = players.length;

const getRandomPlayer = () => {
  const randomIndex = Math.floor(Math.random() * numPlayers);
  return players[randomIndex];
};

const player = players[1];

const guess = ref([getRandomPlayer()]);
const guessPlayer = () => {
  guess.value.push(getRandomPlayer());
};
</script>

<template>
  <div class="guess">
    <Base>
      <div class="guess__content">
        <p>{{ guess.player }}</p>
        <button @click="guessPlayer">{{ $t("page.unlimited.button") }}</button>
        <GuessHeader />
        <div class="guess__content__items">
          <SingleGuess
            v-for="p in guess"
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
        padding: 1.25rem;
      }
    }
  }
}
</style>
