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
@use "../../../styles/mixins.scss" as m;
.player-card {
  height: auto;
  width: min(100%, 41rem);
  padding: 1.2rem;
  border-radius: v.$radius-lg;
  border: 1px solid v.$border-medium;
  background: v.$surface-1;
  box-shadow: v.$shadow-sm;
  @include m.transition(all, v.$transition-normal);

  &:hover {
    transform: translateY(-1px);
    box-shadow: v.$shadow-md;
    border-color: v.$border-strong;
  }

  h3 {
    margin: 0 0 0.9rem;
    color: v.$fontColor;
    display: flex;
    align-items: center;
    min-height: 1.5rem;
    img {
      height: 1.5rem;
      width: auto;
      margin-left: 0.5rem;
    }
  }

  .player-card__content {
    display: flex;
    gap: 1.1rem;
    img {
      height: 23rem;
      width: 15.5rem;
      object-fit: cover;
      object-position: 50% 0;
      border-radius: v.$radius-md;
      border: 1px solid v.$border-subtle;
      box-shadow: v.$shadow-sm;
    }
    .player-card__content__items {
      flex: 1;
      min-width: 0;
    }
    .player-card__content__item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 0.75rem;
      font-size: 0.95rem;
      border-bottom: 1px solid v.$border-subtle;
      padding-block: 0.35rem;
      p {
        margin: 0;
        margin-right: 0.4rem;
        text-align: left;
        opacity: 0.86;
        font-size: 0.9rem;
      }
      b {
        color: v.$color700;
        text-align: right;
      }
    }
  }
}

@media (max-width: 640px) {
  .player-card {
    width: 100%;
    .player-card__content {
      display: flex;
      flex-direction: column;
      img {
        width: 100%;
        max-width: 18.75rem;
        height: 19rem;
        align-self: center;
      }
    }
  }
}
</style>
