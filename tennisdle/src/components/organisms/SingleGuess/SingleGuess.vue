<script setup lang="ts">
import { Wrap } from "../../molecules";
import { categories, Player } from "../../../data/typings/Player";
import { DiffPill } from "../../atoms";
const { player, comparePlayer } = defineProps<{
  player: Player;
  comparePlayer: Player;
}>();
</script>

<template>
  <div class="single-guess">
    <Wrap>
      <div class="single-guess__player">
        <img :src="comparePlayer.image" alt="avatar" />
        <p>{{ comparePlayer.player }}</p>
      </div>
      <DiffPill
        v-for="key in categories"
        :key="key"
        :compare-value="Number(comparePlayer[key])"
        :diff-threshold="3"
        :player-key="key"
        :value="Number(player[key])"
      />
    </Wrap>
  </div>
</template>

<style scoped lang="scss">
.single-guess {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.5rem;
  .single-guess__player {
    width: 16rem;
    display: flex;
    align-items: center;
    p {
      font-size: 1.1rem;
      font-weight: 600;
    }
    img {
      width: 3.5rem;
      height: 3.5rem;
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
