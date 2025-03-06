<script setup lang="ts">
import { computed } from "vue";
import { GuessDistance, GuessStatus } from "../../../typings/GuessStatus";
import { TriangleIcon } from "../../../assets";
import { areCountriesInSameContinent, countries } from "../../../utils/country";
import { CountryFlag } from "..";
import { Player } from "../../../typings/Player";

const { value, compareValue, diffThreshold, playerKey } = defineProps<{
  playerKey: keyof Player;
  value: number | boolean | string | null;
  compareValue: number | boolean | string | null;
  diffThreshold: number;
}>();

const status = computed(() => {
  const checkNumber = (value: number, compareValue: number) => {
    if (Math.abs(value - compareValue) === 0) return GuessStatus.EQUAL;
    if (Math.abs(value - compareValue) <= diffThreshold)
      return GuessStatus.IN_THRESHOLD;
    return GuessStatus.WRONG;
  };

  const checkBoolean = (value: boolean, compareValue: boolean) =>
    value === compareValue ? GuessStatus.EQUAL : GuessStatus.WRONG;

  const checkCountry = (value: string, compareValue: string) => {
    const country = countries[value as keyof typeof countries];
    const compareCountry = countries[compareValue as keyof typeof countries];
    if (country === compareCountry) return GuessStatus.EQUAL;
    if (areCountriesInSameContinent(value, compareValue))
      return GuessStatus.IN_THRESHOLD;
    return GuessStatus.WRONG;
  };

  switch (typeof value) {
    case "number":
      return checkNumber(value as number, compareValue as number);
    case "boolean":
      return checkBoolean(value as boolean, compareValue as boolean);
    case "string":
      if (playerKey === "country")
        return checkCountry(value as string, compareValue as string);
      else return checkNumber(Number(value), Number(compareValue));
    default:
      return GuessStatus.WRONG;
  }
});

const higherOrLower = computed(() => {
  return status.value === GuessStatus.EQUAL
    ? GuessDistance.EXACT
    : Number(value) > Number(compareValue)
      ? GuessDistance.HIGHER
      : GuessDistance.LOWER;
});
</script>

<template>
  <div :class="`diff-pill diff-pill--${status} ${playerKey}`">
    <b v-if="playerKey === 'height'">{{ Number(compareValue).toFixed(2) }}m</b>
    <b v-else-if="playerKey === 'isRightHanded'">
      {{ $t(`player.label.${compareValue ? "right" : "left"}HandedShort`) }}
    </b>
    <b v-else-if="playerKey === 'isTwoHandedBackhand'">
      {{
        $t(`player.label.${compareValue ? "one" : "two"}HandedBackhandShort`)
      }}
    </b>
    <CountryFlag
      v-else-if="typeof compareValue === 'string' && playerKey === 'country'"
      :country-code="countries[compareValue as keyof typeof countries]"
    />
    <b v-else>
      {{ compareValue }}
    </b>
    <TriangleIcon
      v-if="typeof compareValue !== 'boolean' && playerKey !== 'country'"
      :class="`triangle-icon triangle-icon--${higherOrLower}`"
    />
  </div>
</template>

<style scoped lang="scss">
@use "../../../styles/variables.scss" as v;
.diff-pill {
  display: flex;
  padding: 0.5rem 0.75rem;
  height: 4rem;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: bold;
  text-align: center;
  background-color: v.$diffPillBackground;
  justify-content: space-evenly;
  align-items: center;
  width: 4rem;

  &.country {
    padding: 0.5rem;
  }

  &.diff-pill--equal {
    background-color: #43a865;
    color: v.$diffPillBackground;
    .triangle-icon:deep(path) {
      fill: v.$diffPillBackground;
    }
  }
  &.diff-pill--in-threshold {
    background-color: #b8b105;
    color: v.$diffPillBackground;
    .triangle-icon:deep(path) {
      fill: v.$diffPillBackground;
    }
  }

  &.highestRanking {
    .triangle-icon {
      transform: rotate(180deg);
      &.triangle-icon--lower {
        transform: rotate(0deg);
      }
    }
  }

  .triangle-icon {
    margin-left: 0.5rem;
    width: 1rem;
    height: 1rem;
    :deep(path) {
      fill: white;
    }
    &.triangle-icon--exact {
      display: none;
    }
    &.triangle-icon--lower {
      transform: rotate(180deg);
    }
  }

  .player-key-icon {
    margin-right: 0.5rem;
    height: 2.75rem;
    width: 2.75rem;
  }
}
</style>
