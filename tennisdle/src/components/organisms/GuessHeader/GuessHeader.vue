<script setup lang="ts">
import { Wrap } from "../../molecules";
import { PlayerKeyIcon } from "../../atoms";
import { categories } from "../../../data/typings/Player";
</script>

<template>
  <div class="guess-header">
    <Wrap>
      <div class="guess-header__player">
        <p>{{ $t("player") }}</p>
      </div>
      <div
        v-for="key in categories"
        :key="key"
        :class="`guess-header__item ${key}`"
      >
        <PlayerKeyIcon :player-key="key" />
      </div>
    </Wrap>
  </div>
</template>

<style scoped lang="scss">
@use "../../../styles/variables.scss" as v;
.guess-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 0.128rem solid v.$color100;
  .guess-header__player {
    width: 16rem;
    display: flex;
    align-items: center;
    p {
      font-size: 1.1rem;
      font-weight: 600;
    }
  }
  .wrap {
    gap: 0.5rem;
    justify-content: center;
    align-items: center;
    .guess-header__item {
      width: 4rem;
      height: 4rem;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 0.5rem;
      background-color: v.$headerBackgroundDark;
      padding: 0.5rem;
      text-align: center;
      svg {
        width: 3rem;
        height: 3rem;
      }
      &.careerTitles {
        svg {
          width: 2.5rem;
          height: 2.5rem;
        }
      }
    }
  }
}
</style>
