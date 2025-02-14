<script setup lang="ts">
import { Player } from "../../../data/typings/Player";
import {
  ATPFinalsIcon,
  AustralianOpenIcon,
  BirthdayCakeIcon,
  CountryIcon,
  CupIcon,
  FrenchOpenIcon,
  HeightIcon,
  OlympicsIcon,
  RankingIcon,
  TurnedProIcon,
  USOpenIcon,
  WimbledonIcon,
} from "../../../assets";

const { playerKey } = defineProps<{ playerKey: keyof Player }>();
</script>

<template>
  <WimbledonIcon
    v-if="playerKey === 'noWimbledonTitles'"
    class="player-key-icon"
  />
  <FrenchOpenIcon
    v-else-if="playerKey === 'noFrenchOpenTitles'"
    class="player-key-icon"
  />
  <AustralianOpenIcon
    v-else-if="playerKey === 'noAusOpenTitles'"
    class="player-key-icon"
  />
  <USOpenIcon
    v-else-if="playerKey === 'noUSOpenTitles'"
    class="player-key-icon us-open-icon"
  />
  <ATPFinalsIcon
    v-else-if="playerKey === 'noTourFinalsTitles'"
    class="player-key-icon"
  />
  <OlympicsIcon
    v-else-if="playerKey === 'noOlympicTitles'"
    class="player-key-icon"
  />
  <RankingIcon
    v-else-if="playerKey === 'highestRanking'"
    class="player-key-icon"
  />
  <CupIcon v-else-if="playerKey === 'careerTitles'" class="player-key-icon" />
  <BirthdayCakeIcon
    v-else-if="playerKey === 'birthDate'"
    class="player-key-icon"
  />
  <HeightIcon v-else-if="playerKey === 'height'" class="player-key-icon" />
  <TurnedProIcon
    v-else-if="playerKey === 'yearTurnedPro'"
    class="player-key-icon"
  />
  <CountryIcon v-else-if="playerKey === 'country'" class="player-key-icon" />
  <p v-else-if="playerKey === 'isRightHanded'">RH</p>
  <p v-else-if="playerKey === 'isTwoHandedBackhand'">2HB</p>
</template>

<style scoped lang="scss">
.player-key-icon {
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
  outline: none !important;
}
</style>
