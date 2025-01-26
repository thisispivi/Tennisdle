<script setup>
import { Base } from "../../templates";
import { Wrap } from "../../organisms";
import { Card } from "../../molecules";
import { players } from "../../../assets/index";
import { SelectLanguage } from "../../molecules";
</script>

<template>
  <div class="all">
    <Base>
      <div class="all__header">
        <h1>{{ $t("page.all.title") }}</h1>
        <SelectLanguage />
      </div>
      <Wrap>
        <Card v-for="player in players" :key="player.player" :player="player" />
      </Wrap>
    </Base>
  </div>
</template>

<style lang="scss" scoped>
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
      color: v.$color900;
    }
  }
  .wrap {
    padding-inline: 1.5rem;
  }
}
</style>
