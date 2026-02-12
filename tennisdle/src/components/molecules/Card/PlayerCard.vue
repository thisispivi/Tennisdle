<script lang="ts" setup>
import { computed } from "vue";

import { Player } from "../../../typings/Player";
import { countries } from "../../../utils/country";
import { CountryFlag } from "../../atoms";

const { player } = defineProps<{ player: Player }>();

const data = computed(() => [
  { key: "age", value: player.birthDate },
  { key: "height", value: player.height ? `${player.height}m` : "-" },
  { key: "yearTurnedPro", value: player.yearTurnedPro || "-" },
  { key: "yearRetired", value: player.yearRetired || "-" },
  {
    key: "isRightHanded",
    value: player.isRightHanded !== null ? player.isRightHanded : "-",
  },
  { key: "isTwoHandedBackhand", value: player.isTwoHandedBackhand },
  {
    key: "careerTitles",
    value: player.careerTitles !== null ? player.careerTitles : "-",
  },
  { key: "highestRanking", value: player.highestRanking || "-" },
  { key: "noAusOpenTitles", value: player.noAusOpenTitles || 0 },
  { key: "noFrenchOpenTitles", value: player.noFrenchOpenTitles || 0 },
  { key: "noWimbledonTitles", value: player.noWimbledonTitles || 0 },
  { key: "noUSOpenTitles", value: player.noUSOpenTitles || 0 },
  { key: "noTourFinalsTitles", value: player.noTourFinalsTitles || 0 },
  { key: "noOlympicTitles", value: player.noOlympicTitles || 0 },
]);
</script>

<template>
  <div class="player-card">
    <h3>
      {{ player.player }}
      <CountryFlag
        v-if="player.country"
        :country-code="countries[player.country as keyof typeof countries]"
      />
    </h3>
    <div class="player-card__content">
      <img :src="player.image" alt="avatar" />
      <div class="player-card__content__items">
        <div
          v-for="item in data"
          :key="item.key"
          class="player-card__content__item"
        >
          <p class="player-card__content__item__label">
            {{ $t(`player.label.${item.key}`) }}
          </p>
          <b
            v-if="
              item.key !== 'isRightHanded' && item.key !== 'isTwoHandedBackhand'
            "
            >{{ item.value }}
          </b>
          <b v-if="item.key === 'isRightHanded'">
            {{
              item.value
                ? $t("player.label.rightHanded")
                : $t("player.label.leftHanded")
            }}
          </b>
          <b v-if="item.key === 'isTwoHandedBackhand'">
            {{
              item.value
                ? $t("player.label.twoHandedBackhand")
                : $t("player.label.oneHandedBackhand")
            }}
          </b>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "../../../styles/variables.scss" as v;
.player-card {
  height: auto;
  padding: 1.5rem;
  width: auto;
  background-color: v.$cardBackground;
  border-radius: 0.5rem;
  box-shadow: 0 0.35rem 0.5rem 0.1rem rgba(0, 0, 0, 0.1);

  h3 {
    margin-top: 0rem;
    color: v.$color800;
    display: flex;
    height: 1.5rem;
    img {
      height: 1.5rem;
      width: auto;
      margin-left: 0.5rem;
    }
  }

  .player-card__content {
    display: flex;
    gap: 1.5rem;
    img {
      height: 24rem;
      width: 16rem;
      object-fit: cover;
      object-position: 50% 0;
      border-radius: 0.25rem;
    }
    .player-card__content__item {
      display: flex;
      justify-content: space-between;
      font-size: 1rem;
      border-bottom: 1px solid #e0e0e023;
      padding-block: 0.2rem;
      p {
        margin: 0;
        margin-right: 0.8rem;
        text-align: left;
      }
      b {
        color: v.$color700;
      }
    }
  }
}

@media (max-width: 640px) {
  .player-card {
    height: auto;
    .player-card__content {
      display: flex;
      flex-direction: column;
      img {
        width: 80dvw;
        max-width: 18.75rem;
        height: 20rem;
      }
    }
  }
}
</style>
