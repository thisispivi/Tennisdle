<script setup lang="ts">
import { Base } from "../../templates";
import { Wrap } from "../../molecules";
import { PlayerCard } from "../../molecules";
import { Players } from "../../../typings/Player";

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
@use "../../../styles/variables.scss" as v;
.all {
  height: 100%;
  width: 100%;
  .all__header {
    height: 5rem;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-inline: 2rem;
    h1 {
      color: v.$color800;
    }
  }
  .wrap {
    padding-inline: 1.5rem;
    height: calc(100% - 2rem);
  }
}

@media (max-width: 410px) {
  .all {
    .wrap {
      padding-inline: 0;
    }
  }
}
</style>
