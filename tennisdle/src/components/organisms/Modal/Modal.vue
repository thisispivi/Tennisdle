<script setup lang="ts">
import { CloseIcon } from "../../../assets";
import PlayerCard from "../../../components/molecules/Card/PlayerCard.vue";
import { Player } from "../../../typings/Player";

const { isWon, isLost, player, isOpen, onClose } = defineProps<{
  isWon: boolean;
  isLost: boolean;
  player: Player;
  isOpen: boolean;
  onClose: () => void;
}>();

const i18nKey = isWon ? "won" : "lost";
</script>

<template>
  <div v-if="(isWon || isLost) && isOpen" class="modal">
    <div class="modal__content">
      <CloseIcon class="modal__content__close" @click="onClose" />
      <h2 class="modal__content__title">{{ $t(`modal.${i18nKey}.title`) }}</h2>
      <p class="modal__content__text">
        {{ $t(`modal.${i18nKey}.description`) }}
      </p>
      <div class="modal__content__container">
        <PlayerCard :player="player" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "../../../styles/variables.scss" as v;

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;

  &__content {
    max-height: 90%;
    max-width: 90%;
    overflow-y: auto;
    padding: 0rem 1rem;
    border-top: 1.5rem solid v.$diffPillBackground;
    border-bottom: 1.5rem solid v.$diffPillBackground;
    border-left: 0.5rem solid v.$diffPillBackground;
    border-right: 0.5rem solid v.$diffPillBackground;
    background-color: v.$diffPillBackground;
    border-radius: 0.75rem;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    text-align: center;
    position: relative;

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
  }
}
</style>
