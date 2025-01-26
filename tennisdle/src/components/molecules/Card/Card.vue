<script lang="ts" setup>
import { Player } from "data/typings/player";
const { player } = defineProps<{ player: Player }>();

function calculateAge(birthDate: number) {
  const age_dt = new Date(Date.now() - new Date(birthDate).getTime());
  return Math.abs(age_dt.getUTCFullYear() - 1970);
}

const data = [
  { key: "age", value: calculateAge(player.birthDate) },
  { key: "height", value: player.height + "m" },
  { key: "yearTurnedPro", value: player.yearTurnedPro },
  { key: "yearRetired", value: player.yearRetired },
  { key: "isRightHanded", value: player.isRightHanded },
  { key: "isTwoHandedBackhand", value: player.isTwoHandedBackhand },
  { key: "careerTitles", value: player.careerTitles },
  { key: "highestRanking", value: player.highestRanking },
  { key: "noAusOpenTitles", value: player.noAusOpenTitles },
  { key: "noFrenchOpenTitles", value: player.noFrenchOpenTitles },
  { key: "noWimbledonTitles", value: player.noWimbledonTitles },
  { key: "noUSOpenTitles", value: player.noUSOpenTitles },
  { key: "noTourFinalsTitles", value: player.noTourFinalsTitles },
  { key: "noOlympicTitles", value: player.noOlympicTitles },
];
</script>

<template>
  <div class="card">
    <h3>{{ player.player }}</h3>
    <div class="card__content">
      <img :src="player.image" alt="avatar" />
      <div class="card__content__items">
        <div v-for="item in data" :key="item.key" class="card__content__item">
          <p class="card__content__item__label">
            {{ $t(`card.label.${item.key}`) }}
          </p>
          <b>{{ item.value }}</b>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "../../../styles/variables.scss" as v;
.card {
  height: 25rem;
  padding: 1rem 1.5rem;
  width: auto;
  background-color: v.$headerBackgroundDark;
  border-radius: 0.5rem;
  box-shadow: 0 0.35rem 0.5rem 0.1rem rgba(0, 0, 0, 0.1);

  h3 {
    margin-top: 0rem;
    color: v.$color900;
  }

  .card__content {
    display: flex;
    img {
      height: 19.5rem;
      width: 15rem;
      object-fit: cover;
      object-position: 50% 0;
      border-radius: 0.25rem;
    }
    .card__content__item {
      margin-left: 1.5rem;
      display: flex;
      justify-content: space-between;
      font-size: 0.9rem;
      p {
        margin: 0;
        margin-right: 1rem;
      }
      b {
        color: v.$color600;
      }
    }
  }
}
</style>
