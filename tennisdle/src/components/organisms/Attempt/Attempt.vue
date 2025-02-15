<script setup lang="ts">
import { Wrap } from "../../molecules";
import { categories, Player } from "../../../typings/Player";
import { DiffPill } from "../../atoms";
const { playerToGuess: player, comparePlayer } = defineProps<{
  playerToGuess: Player;
  comparePlayer: Player;
}>();
</script>

<template>
  <div class="single-attempt">
    <Wrap>
      <div class="single-attempt__player">
        <img :src="comparePlayer.image" alt="avatar" />
        <p>{{ comparePlayer.player }}</p>
      </div>
      <DiffPill
        v-for="key in categories"
        :key="key"
        :compare-value="comparePlayer[key]"
        :diff-threshold="3"
        :player-key="key"
        :value="player[key]"
      />
    </Wrap>
  </div>
</template>

<style scoped lang="scss">
@use "../../../styles/variables.scss" as v;
.single-attempt {
  display: flex;
  flex-direction: column;
  align-items: center;
  .single-attempt__player {
    padding: 0.5rem;
    width: 16rem;
    height: 4rem;
    display: flex;
    align-items: center;
    background-color: v.$diffPillBackground;
    border-radius: 0.5rem;
    p {
      font-size: 1rem;
      font-weight: 600;
    }
    img {
      width: 3rem;
      height: 3rem;
      object-fit: cover;
      object-position: 50% 0;
      border-radius: 5rem;
      margin-right: 1rem;
    }
  }
  .wrap {
    gap: 0.5rem;
    justify-content: center;
    align-items: center;
  }
}
</style>
