<script setup lang="ts">
import { Wrap } from "../../molecules";
import { Player } from "../../../data/typings/Player";
import { DiffPill } from "../../atoms";
const { player, comparePlayer } = defineProps<{
  player: Player;
  comparePlayer: Player;
}>();

const allKeys: (keyof Player)[] = [
  "noAusOpenTitles",
  "noFrenchOpenTitles",
  "noWimbledonTitles",
  "noUSOpenTitles",
  "noTourFinalsTitles",
  "noOlympicTitles",
];
</script>

<template>
  <div class="guess">
    <Wrap>
      <div class="guess__player">
        <p>{{ comparePlayer.player }}</p>
      </div>
      <DiffPill
        v-for="key in allKeys"
        :key="key"
        :value="Number(player[key])"
        :compare-value="Number(comparePlayer[key])"
        :diff-threshold="3"
      />
    </Wrap>
  </div>
</template>

<style scoped lang="scss">
.guess {
  display: flex;
  flex-direction: column;
  align-items: center;
  .wrap {
    gap: 0.5rem;
    justify-content: center;
    align-items: center;
  }
}
</style>
