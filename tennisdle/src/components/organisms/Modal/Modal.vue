<script setup lang="ts">
import { computed } from "vue";

import { CloseIcon } from "../../../assets";
import { PlayerCard } from "../../../components/molecules";
import { Player } from "../../../typings/Player";

const props = withDefaults(
  defineProps<{
    gameMode: "daily" | "unlimited";
    isWon: boolean;
    isLost: boolean;
    isOpen: boolean;
    player: Player;
    onClose: () => void;
    onContinue?: () => void;
  }>(),
  { onContinue: undefined }
);

const i18nKey = computed(() => (props.isWon ? "won" : "lost"));
</script>

<template>
  <transition name="modal-animation">
    <div v-show="props.isOpen" class="modal" @click.self="props.onClose">
      <transition name="modal-animation-inner">
        <div v-show="props.isOpen" class="modal-inner">
          <button
            class="modal-inner__close"
            aria-label="Close"
            @click="props.onClose"
          >
            <CloseIcon />
          </button>
          <h2 class="modal-inner__title">
            {{ $t(`modal.${props.gameMode}.${i18nKey}.title`) }}
          </h2>
          <p class="modal-inner__text">
            {{ $t(`modal.${props.gameMode}.${i18nKey}.description`) }}
          </p>
          <div class="modal-inner__container">
            <PlayerCard :player="props.player" />
          </div>
          <div class="modal-inner__actions">
            <slot name="actions" />
            <button
              v-if="
                (props.isWon || props.isLost) &&
                props.onContinue &&
                props.gameMode === 'unlimited'
              "
              class="button button--primary"
              @click="props.onContinue"
            >
              <span>{{
                $t(
                  `modal.${props.gameMode}.${props.isWon ? "continue" : "newGame"}`
                )
              }}</span>
            </button>
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<style lang="scss">
@use "../../../styles/variables.scss" as v;
@use "../../../styles/mixins.scss" as m;

.modal-animation-enter-active,
.modal-animation-leave-active {
  @include m.transition(opacity, 0.25s, cubic-bezier(0.4, 0, 0.2, 1));
}

.modal-animation-enter-from,
.modal-animation-leave-to {
  opacity: 0;
}

.modal-animation-inner-enter-active {
  @include m.transition(all, 0.3s, cubic-bezier(0.4, 0, 0.2, 1), 0.1s);
}

.modal-animation-inner-leave-active {
  @include m.transition(all, 0.2s, cubic-bezier(0.4, 0, 0.2, 1));
}

.modal-animation-inner-enter-from {
  opacity: 0;
  transform: scale(0.9) translateY(8px);
}

.modal-animation-inner-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

.modal {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  z-index: 1000;

  .modal-inner {
    position: relative;
    max-width: 90%;
    max-height: 90%;
    overflow-y: auto;
    padding: 2rem;
    @include m.glass-card(18px, 0.65);
    border-radius: v.$radius-lg;
    box-shadow: v.$shadow-lg;
    text-align: center;

    &__close {
      position: absolute;
      top: 0.75rem;
      right: 0.75rem;
      width: 2rem;
      height: 2rem;
      cursor: pointer;
      border: none;
      background: rgba(255, 255, 255, 0.08);
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
        background: rgba(255, 255, 255, 0.15);
      }
    }

    &__title {
      font-size: 1.35rem;
      margin-top: 0;
      margin-bottom: 0.5rem;
      color: v.$fontColor;
    }

    &__text {
      font-size: 0.95rem;
      margin-bottom: 1.5rem;
      color: v.$fontMuted;
    }

    &__container {
      .player-card__content {
        img {
          max-width: unset;
        }
      }
    }

    &__actions {
      display: flex;
      gap: 0.75rem;
      justify-content: center;
      flex-wrap: wrap;
      margin-top: 1.5rem;
    }

    .button {
      padding: 0.7rem 1.5rem;
      border: none;
      border-radius: v.$radius-md;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      position: relative;
      @include m.transition(all, v.$transition-fast);
      @include m.focus-ring;

      &--primary {
        background: linear-gradient(135deg, v.$color900, v.$color800);
        color: v.$background;

        &:hover {
          filter: brightness(0.9);
          transform: translateY(-1px);
          box-shadow: v.$shadow-md;
        }

        &:active {
          transform: translateY(0);
        }
      }
    }
  }
}

@media (max-width: 640px) {
  .modal {
    .modal-inner {
      &__container {
        .player-card__content {
          img {
            max-width: unset;
            width: 100%;
          }
        }
      }
    }
  }
}
</style>
