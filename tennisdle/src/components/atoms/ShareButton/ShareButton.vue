<script setup lang="ts">
import { ref } from "vue";

import { GuessStatus } from "../../../typings/GuessStatus";
import { Player } from "../../../typings/Player";
import { areCountriesInSameContinent, countries } from "../../../utils/country";

const props = defineProps<{
  gameMode: string;
  isAtp: boolean;
  attempts: Player[];
  playerToGuess: Player;
  livesRemaining: number;
  isWon: boolean;
}>();

const copied = ref(false);

const getStatusEmoji = (status: GuessStatus): string => {
  switch (status) {
    case GuessStatus.EQUAL:
      return "🟩";
    case GuessStatus.IN_THRESHOLD:
      return "🟨";
    default:
      return "⬛";
  }
};

const getFieldStatus = (
  key: keyof Player,
  guessValue: number | boolean | string | null,
  targetValue: number | boolean | string | null,
  threshold: number
): GuessStatus => {
  if (guessValue === null || targetValue === null) return GuessStatus.WRONG;

  if (typeof guessValue === "boolean") {
    return guessValue === targetValue ? GuessStatus.EQUAL : GuessStatus.WRONG;
  }

  if (
    key === "country" &&
    typeof guessValue === "string" &&
    typeof targetValue === "string"
  ) {
    const gc = countries[guessValue as keyof typeof countries];
    const tc = countries[targetValue as keyof typeof countries];
    if (gc === tc) return GuessStatus.EQUAL;
    if (areCountriesInSameContinent(guessValue, targetValue))
      return GuessStatus.IN_THRESHOLD;
    return GuessStatus.WRONG;
  }

  const diff = Math.abs(Number(guessValue) - Number(targetValue));
  if (diff === 0) return GuessStatus.EQUAL;
  if (diff <= threshold) return GuessStatus.IN_THRESHOLD;
  return GuessStatus.WRONG;
};

const categories: { key: keyof Player; threshold: number }[] = [
  { key: "birthDate", threshold: 3 },
  { key: "country", threshold: 0 },
  { key: "height", threshold: 0.05 },
  { key: "isRightHanded", threshold: 0 },
  { key: "isTwoHandedBackhand", threshold: 0 },
  { key: "noAusOpenTitles", threshold: 3 },
  { key: "noFrenchOpenTitles", threshold: 3 },
  { key: "noWimbledonTitles", threshold: 3 },
  { key: "noUSOpenTitles", threshold: 3 },
  { key: "noTourFinalsTitles", threshold: 3 },
];

const generateShareText = (): string => {
  const circuit = props.isAtp ? "ATP" : "WTA";
  const mode = props.gameMode.charAt(0).toUpperCase() + props.gameMode.slice(1);
  const result = props.isWon ? `${props.livesRemaining}/6 ❤️` : "X/6 ❤️";

  const rows = props.attempts
    .slice()
    .reverse()
    .map((attempt) =>
      categories
        .map((cat) =>
          getStatusEmoji(
            getFieldStatus(
              cat.key,
              props.playerToGuess[cat.key],
              attempt[cat.key],
              cat.threshold
            )
          )
        )
        .join("")
    )
    .join("\n");

  return `Tennisdle ${mode} ${circuit}\n${result}\n\n${rows}\n\ntennisdle.pivi.dev`;
};

const share = async () => {
  const text = generateShareText();
  try {
    await navigator.clipboard.writeText(text);
    copied.value = true;
    setTimeout(() => (copied.value = false), 2000);
  } catch {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
    copied.value = true;
    setTimeout(() => (copied.value = false), 2000);
  }
};
</script>

<template>
  <button class="share-btn" @click="share">
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
      <polyline points="16 6 12 2 8 6" />
      <line x1="12" y1="2" x2="12" y2="15" />
    </svg>
    <span>{{ copied ? $t("share.copied") : $t("share.button") }}</span>
  </button>
</template>

<style lang="scss" scoped>
@use "sass:color";
@use "../../../styles/variables.scss" as v;
@use "../../../styles/mixins.scss" as m;

.share-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.65rem 1.25rem;
  border: none;
  border-radius: v.$radius-md;
  background-color: v.$surface-3;
  color: v.$fontColor;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  @include m.transition(all, v.$transition-fast);
  @include m.focus-ring;

  svg {
    width: 1.1rem;
    height: 1.1rem;
  }

  &:hover {
    background-color: color.adjust(v.$surface-3, $lightness: 5%);
    transform: translateY(-1px);
  }
}
</style>
