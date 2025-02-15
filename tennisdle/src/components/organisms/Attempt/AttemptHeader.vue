<script setup lang="ts">
import { Wrap } from "../../molecules";
import { PlayerKeyIcon } from "../../atoms";
import { categories } from "../../../typings/Player";
</script>

<template>
  <div class="attempt-header">
    <Wrap>
      <div class="attempt-header__player">{{ $t("player.label.name") }}</div>
      <div
        v-for="key in categories"
        :key="key"
        v-tooltip="$t(`player.tooltip.${key}`)"
        :class="`attempt-header__item ${key}`"
      >
        <PlayerKeyIcon :player-key="key" />
      </div>
    </Wrap>
  </div>
</template>

<style scoped lang="scss">
@use "../../../styles/variables.scss" as v;
.attempt-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.5rem 0.75rem;
  padding-bottom: 0.5rem;
  border-bottom: 0.128rem solid v.$color800o;
  .attempt-header__player {
    width: 16rem;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 4rem;
    border-radius: 0.5rem;
    background-color: v.$diffPillBackground;
  }
  .wrap {
    gap: 0.5rem;
    justify-content: center;
    align-items: center;
    .attempt-header__item {
      width: 4rem;
      height: 4rem;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 0.5rem;
      background-color: v.$diffPillBackground;
      padding: 0.5rem;
      text-align: center;
      svg {
        width: 2.5rem;
        height: 2.5rem;
      }
    }
  }
}
</style>
