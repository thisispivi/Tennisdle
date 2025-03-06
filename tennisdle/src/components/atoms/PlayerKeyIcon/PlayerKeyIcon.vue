<script setup lang="ts">
import { Player } from "../../../typings/Player";
import {
  ATPFinalsIcon,
  AustralianOpenIcon,
  BackhandIcon,
  BirthdayCakeIcon,
  CountryIcon,
  CupIcon,
  FrenchOpenIcon,
  HandIcon,
  HeightIcon,
  OlympicsIcon,
  RankingIcon,
  TurnedProIcon,
  USOpenIcon,
  WimbledonIcon,
  WTAFinalsIcon,
} from "../../../assets";

const { playerKey, isAtp } = defineProps<{
  playerKey: keyof Player;
  isAtp: boolean;
}>();
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
    v-else-if="playerKey === 'noTourFinalsTitles' && isAtp"
    class="player-key-icon"
  />
  <WTAFinalsIcon
    v-else-if="playerKey === 'noTourFinalsTitles' && !isAtp"
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
  <HandIcon
    v-else-if="playerKey === 'isRightHanded'"
    class="player-key-icon hand-icon"
  />
  <BackhandIcon v-else-if="playerKey === 'isTwoHandedBackhand'" />
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
