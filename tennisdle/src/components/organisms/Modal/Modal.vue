<script setup lang="ts">
import { defineProps, ref, watch } from "vue";
import { CloseIcon } from "../../../assets";
import { PlayerCard } from "../../../components/molecules";
import { Player } from "../../../typings/Player";

const { isOpen, isWon, player, onClose } = defineProps<{
  isWon: boolean;
  isOpen: boolean;
  player: Player;
  onClose: () => void;
}>();

const i18nKey = ref(isWon ? "won" : "lost");

watch(
  () => isWon,
  (newVal) => {
    i18nKey.value = newVal ? "won" : "lost";
  }
);
</script>

<template>
  <transition name="modal-animation">
    <div v-show="isOpen" class="modal">
      <transition name="modal-animation-inner">
        <div v-show="isOpen" class="modal-inner">
          <CloseIcon class="modal-inner__close" @click="onClose" />
          <h2 class="modal-inner__title">
            {{ $t(`modal.${i18nKey}.title`) }}
          </h2>
          <p class="modal-inner__text">
            {{ $t(`modal.${i18nKey}.description`) }}
          </p>
          <div class="modal-inner__container">
            <PlayerCard :player="player" />
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<style lang="scss">
@use "../../../styles/variables.scss" as v;

.modal-animation-enter-active,
.modal-animation-leave-active {
  transition: opacity 0.3s cubic-bezier(0.52, 0.02, 0.19, 1.02);
}

.modal-animation-enter-from,
.modal-animation-leave-to {
  opacity: 0;
}

.modal-animation-inner-enter-active {
  transition: all 0.3s cubic-bezier(0.52, 0.02, 0.19, 1.02) 0.15s;
}

.modal-animation-inner-leave-active {
  transition: all 0.3s cubic-bezier(0.52, 0.02, 0.19, 1.02);
}

.modal-animation-inner-enter-from {
  opacity: 0;
  transform: scale(0.8);
}

.modal-animation-inner-leave-to {
  transform: scale(0.8);
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
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;

  .modal-inner {
    position: relative;
    max-width: 90%;
    max-height: 90%;
    overflow-y: auto;
    padding: 1rem;
    border-top: 1.5rem solid v.$diffPillBackground;
    border-bottom: 1.5rem solid v.$diffPillBackground;
    border-left: 1rem solid v.$diffPillBackground;
    border-right: 1rem solid v.$diffPillBackground;
    background-color: v.$diffPillBackground;
    border-radius: 0.75rem;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    text-align: center;
    animation: zoomIn 0.3s forwards;

    &__close {
      position: absolute;
      top: 0rem;
      right: 0.5rem;
      width: 1.5rem;
      height: 1.5rem;
      cursor: pointer;
    }

    &__title {
      font-size: 1.5rem;
      margin-top: 0;
      margin-bottom: 0.7rem;
      color: v.$color800;
    }

    &__text {
      font-size: 1rem;
      margin-bottom: 1.75rem;
    }

    &__container {
      .player-card__content {
        img {
          max-width: unset;
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
