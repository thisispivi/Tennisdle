<script setup lang="ts">
import { computed, ref } from "vue";

import { CloseIcon } from "../../../assets";

interface GameStats {
  gamesPlayed: number;
  gamesWon: number;
  gamesLost: number;
  gamesSurrendered: number;
  currentStreak: number;
  maxStreak: number;
  guessDistribution: Record<number, number>;
}

interface AllStats {
  dailyAtp: GameStats;
  dailyWta: GameStats;
  unlimitedAtp: GameStats;
  unlimitedWta: GameStats;
}

const props = defineProps<{
  isOpen: boolean;
  onClose: () => void;
}>();

const tabs = [
  { key: "dailyAtp", labelKey: "stats.tabs.dailyAtp" },
  { key: "dailyWta", labelKey: "stats.tabs.dailyWta" },
  { key: "unlimitedAtp", labelKey: "stats.tabs.unlimitedAtp" },
  { key: "unlimitedWta", labelKey: "stats.tabs.unlimitedWta" },
] as const;

const activeTab = ref<keyof AllStats>("dailyAtp");

const allStats = computed<AllStats | null>(() => {
  try {
    const raw = localStorage.getItem("tennisdle-stats");
    if (!raw) return null;
    return JSON.parse(raw) as AllStats;
  } catch {
    return null;
  }
});

const currentStats = computed<GameStats | null>(() => {
  if (!allStats.value) return null;
  return allStats.value[activeTab.value] ?? null;
});

const winRate = computed(() => {
  if (!currentStats.value || currentStats.value.gamesPlayed === 0) return 0;
  return Math.round(
    (currentStats.value.gamesWon / currentStats.value.gamesPlayed) * 100
  );
});

const maxDistributionValue = computed(() => {
  if (!currentStats.value) return 0;
  const values = Object.values(currentStats.value.guessDistribution);
  return Math.max(...values, 1);
});
</script>

<template>
  <transition name="stats-modal-animation">
    <div v-show="props.isOpen" class="stats-modal" @click.self="props.onClose">
      <transition name="stats-modal-animation-inner">
        <div v-show="props.isOpen" class="stats-modal__inner">
          <button
            class="stats-modal__close"
            :aria-label="$t('common.close')"
            @click="props.onClose"
          >
            <CloseIcon />
          </button>

          <h2 class="stats-modal__title">{{ $t("stats.title") }}</h2>

          <div class="stats-modal__tabs">
            <button
              v-for="tab in tabs"
              :key="tab.key"
              :class="[
                'stats-modal__tab',
                { 'stats-modal__tab--active': activeTab === tab.key },
              ]"
              @click="activeTab = tab.key"
            >
              {{ $t(tab.labelKey) }}
            </button>
          </div>

          <div v-if="!allStats || !currentStats" class="stats-modal__empty">
            {{ $t("stats.noStats") }}
          </div>

          <template v-else>
            <div class="stats-modal__summary">
              <div class="stats-modal__stat">
                <span class="stats-modal__stat-value">{{
                  currentStats.gamesPlayed
                }}</span>
                <span class="stats-modal__stat-label">{{
                  $t("stats.gamesPlayed")
                }}</span>
              </div>
              <div class="stats-modal__stat">
                <span class="stats-modal__stat-value">{{ winRate }}%</span>
                <span class="stats-modal__stat-label">{{
                  $t("stats.winRate")
                }}</span>
              </div>
              <div class="stats-modal__stat">
                <span class="stats-modal__stat-value">{{
                  currentStats.currentStreak
                }}</span>
                <span class="stats-modal__stat-label">{{
                  $t("stats.currentStreak")
                }}</span>
              </div>
              <div class="stats-modal__stat">
                <span class="stats-modal__stat-value">{{
                  currentStats.maxStreak
                }}</span>
                <span class="stats-modal__stat-label">{{
                  $t("stats.maxStreak")
                }}</span>
              </div>
            </div>

            <div class="stats-modal__distribution">
              <h3 class="stats-modal__distribution-title">
                {{ $t("stats.guessDistribution") }}
              </h3>
              <div class="stats-modal__bars">
                <div
                  v-for="guess in 6"
                  :key="guess"
                  class="stats-modal__bar-row"
                >
                  <span class="stats-modal__bar-label">{{ guess }}</span>
                  <div class="stats-modal__bar-track">
                    <div
                      class="stats-modal__bar-fill"
                      :style="{
                        width:
                          ((currentStats.guessDistribution[guess] ?? 0) /
                            maxDistributionValue) *
                            100 +
                          '%',
                        minWidth:
                          (currentStats.guessDistribution[guess] ?? 0) > 0
                            ? '2rem'
                            : '0.5rem',
                      }"
                    >
                      {{ currentStats.guessDistribution[guess] ?? 0 }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>
      </transition>
    </div>
  </transition>
</template>

<style lang="scss" scoped>
@use "../../../styles/variables.scss" as v;
@use "../../../styles/mixins.scss" as m;

.stats-modal-animation-enter-active,
.stats-modal-animation-leave-active {
  @include m.transition(opacity, 0.3s, cubic-bezier(0.52, 0.02, 0.19, 1.02));
}

.stats-modal-animation-enter-from,
.stats-modal-animation-leave-to {
  opacity: 0;
}

.stats-modal-animation-inner-enter-active {
  @include m.transition(all, 0.3s, cubic-bezier(0.52, 0.02, 0.19, 1.02), 0.15s);
}

.stats-modal-animation-inner-leave-active {
  @include m.transition(all, 0.3s, cubic-bezier(0.52, 0.02, 0.19, 1.02));
}

.stats-modal-animation-inner-enter-from {
  opacity: 0;
  transform: scale(0.8);
}

.stats-modal-animation-inner-leave-to {
  transform: scale(0.8);
}

.stats-modal {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(10px);
  z-index: 1000;

  &__inner {
    position: relative;
    max-width: 90%;
    width: 28rem;
    max-height: 90%;
    overflow-y: auto;
    padding: 2rem;
    @include m.glass-card(22px, 0.72);
    border-radius: v.$radius-lg;
    box-shadow: v.$shadow-lg;
    text-align: center;
  }

  &__close {
    position: absolute;
    top: 0.75rem;
    right: 0.75rem;
    width: 2rem;
    height: 2rem;
    cursor: pointer;
    border: none;
    background: rgba(255, 255, 255, 0.1);
    border-radius: v.$radius-full;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.4rem;
    @include m.transition(all, v.$transition-fast);

    svg {
      width: 100%;
      height: 100%;
    }

    &:hover {
      background: rgba(255, 255, 255, 0.2);
      transform: rotate(90deg);
    }
  }

  &__title {
    font-size: 1.5rem;
    margin-top: 0;
    margin-bottom: 1rem;
    color: v.$fontColor;
  }

  &__tabs {
    display: flex;
    gap: 0.25rem;
    margin-bottom: 1.5rem;
    background: v.$surface-2;
    border-radius: v.$radius-md;
    padding: 0.25rem;
  }

  &__tab {
    flex: 1;
    padding: 0.5rem 0.25rem;
    border: none;
    border-radius: v.$radius-md;
    background: transparent;
    color: v.$fontColor;
    font-size: 0.75rem;
    font-weight: 600;
    cursor: pointer;
    @include m.transition(all, v.$transition-fast);

    &--active {
      background: v.$surface-3;
      color: v.$color900;
    }

    &:hover:not(&--active) {
      background: rgba(255, 255, 255, 0.05);
    }
  }

  &__empty {
    padding: 2rem 0;
    font-size: 1rem;
    opacity: 0.7;
    color: v.$fontColor;
  }

  &__summary {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 0.5rem;
    margin-bottom: 1.5rem;
  }

  &__stat {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
    padding: 0.75rem 0.25rem;
    background: v.$surface-2;
    border-radius: v.$radius-md;
  }

  &__stat-value {
    font-size: 1.25rem;
    font-weight: 700;
    @include m.gradient-text;
  }

  &__stat-label {
    font-size: 0.65rem;
    opacity: 0.7;
    color: v.$fontColor;
    text-transform: uppercase;
    letter-spacing: 0.03em;
  }

  &__distribution {
    text-align: left;
  }

  &__distribution-title {
    font-size: 0.95rem;
    margin: 0 0 0.75rem;
    color: v.$fontColor;
    font-weight: 600;
  }

  &__bars {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
  }

  &__bar-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  &__bar-label {
    width: 1rem;
    text-align: right;
    font-size: 0.85rem;
    font-weight: 600;
    color: v.$fontColor;
    flex-shrink: 0;
  }

  &__bar-track {
    flex: 1;
    height: 1.5rem;
    border-radius: v.$radius-sm;
    overflow: hidden;
  }

  &__bar-fill {
    height: 100%;
    background: v.$success;
    border-radius: v.$radius-sm;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-right: 0.5rem;
    font-size: 0.75rem;
    font-weight: 600;
    color: v.$fontColor;
    @include m.transition(width, v.$transition-normal);
  }
}

@media (max-width: 480px) {
  .stats-modal {
    &__summary {
      grid-template-columns: repeat(2, 1fr);
    }

    &__tabs {
      flex-wrap: wrap;
    }

    &__tab {
      flex: 1 1 40%;
    }
  }
}
</style>
