<script setup lang="ts">
import { Players } from "../../../typings/Player";
import { Wrap } from "../../molecules";
import { PlayerCard } from "../../molecules";
import { Base } from "../../templates";

const { players } = defineProps<{ players: Players }>();
</script>

<template>
  <div class="all">
    <Base>
      <Wrap>
        <PlayerCard
          v-for="player in players"
          :key="player.player"
          :player="player"
        />
      </Wrap>
    </Base>
  </div>
</template>

<style lang="scss">
.all {
  width: 100%;
  min-height: 100%;

  .wrap {
    width: 100%;
    padding: 0.5rem 1rem 1.5rem;
    gap: 1.35rem;
  }
}

@media (max-width: 410px) {
  .all {
    .wrap {
      padding-inline: 0.25rem;
    }
  }
}
</style>
