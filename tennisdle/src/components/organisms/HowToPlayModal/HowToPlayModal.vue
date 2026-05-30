<script setup lang="ts">
import { onMounted } from "vue";

import { CloseIcon } from "../../../assets";

const props = defineProps<{
  isOpen: boolean;
  onClose: () => void;
}>();

const emit = defineEmits<{
  (e: "first-visit"): void;
}>();

const handleClose = () => {
  localStorage.setItem("tennisdle-howtoplay-seen", "true");
  props.onClose();
};

onMounted(() => {
  const seen = localStorage.getItem("tennisdle-howtoplay-seen");
  if (!seen) {
    emit("first-visit");
  }
});
</script>

<template>
  <transition name="htp-modal-animation">
    <div v-show="props.isOpen" class="htp-modal" @click.self="handleClose">
      <transition name="htp-modal-animation-inner">
        <div v-show="props.isOpen" class="htp-modal__inner">
          <button
            class="htp-modal__close"
            :aria-label="$t('common.close')"
            @click="handleClose"
          >
            <CloseIcon />
          </button>

          <h2 class="htp-modal__title">{{ $t("howToPlay.title") }}</h2>

          <div class="htp-modal__steps">
            <div class="htp-modal__step">
              <span class="htp-modal__step-number">1</span>
              <p class="htp-modal__step-text">{{ $t("howToPlay.step1") }}</p>
            </div>

            <div class="htp-modal__step">
              <span class="htp-modal__step-number">2</span>
              <div class="htp-modal__step-text">
                <p>{{ $t("howToPlay.step2") }}</p>
                <div class="htp-modal__color-legend">
                  <div class="htp-modal__color-item">
                    <span
                      class="htp-modal__color-pill htp-modal__color-pill--green"
                    ></span>
                    <span>{{ $t("howToPlay.step2Green") }}</span>
                  </div>
                  <div class="htp-modal__color-item">
                    <span
                      class="htp-modal__color-pill htp-modal__color-pill--yellow"
                    ></span>
                    <span>{{ $t("howToPlay.step2Yellow") }}</span>
                  </div>
                  <div class="htp-modal__color-item">
                    <span
                      class="htp-modal__color-pill htp-modal__color-pill--gray"
                    ></span>
                    <span>{{ $t("howToPlay.step2Gray") }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="htp-modal__step">
              <span class="htp-modal__step-number">3</span>
              <p class="htp-modal__step-text">{{ $t("howToPlay.step3") }}</p>
            </div>

            <div class="htp-modal__step">
              <span class="htp-modal__step-number">4</span>
              <p class="htp-modal__step-text">{{ $t("howToPlay.step4") }}</p>
            </div>
          </div>

          <button class="htp-modal__close-btn" @click="handleClose">
            {{ $t("howToPlay.close") }}
          </button>
        </div>
      </transition>
    </div>
  </transition>
</template>

<style lang="scss" scoped>
@use "../../../styles/variables.scss" as v;
@use "../../../styles/mixins.scss" as m;

.htp-modal-animation-enter-active,
.htp-modal-animation-leave-active {
  @include m.transition(opacity, 0.3s, cubic-bezier(0.52, 0.02, 0.19, 1.02));
}

.htp-modal-animation-enter-from,
.htp-modal-animation-leave-to {
  opacity: 0;
}

.htp-modal-animation-inner-enter-active {
  @include m.transition(all, 0.3s, cubic-bezier(0.52, 0.02, 0.19, 1.02), 0.15s);
}

.htp-modal-animation-inner-leave-active {
  @include m.transition(all, 0.3s, cubic-bezier(0.52, 0.02, 0.19, 1.02));
}

.htp-modal-animation-inner-enter-from {
  opacity: 0;
  transform: scale(0.8);
}

.htp-modal-animation-inner-leave-to {
  transform: scale(0.8);
}

.htp-modal {
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
    width: 30rem;
    max-height: 90%;
    overflow-y: auto;
    padding: 2rem;
    @include m.glass-card(22px, 0.72);
    border-radius: v.$radius-lg;
    box-shadow: v.$shadow-lg;
    text-align: left;
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
    margin-bottom: 1.25rem;
    color: v.$fontColor;
    text-align: center;
  }

  &__steps {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  &__step {
    display: flex;
    gap: 1rem;
    align-items: flex-start;
    background: v.$surface-2;
    border-radius: v.$radius-md;
    padding: 1rem;
  }

  &__step-number {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    min-width: 2rem;
    background: v.$surface-3;
    border-radius: v.$radius-full;
    font-size: 0.9rem;
    font-weight: 700;
    color: v.$color900;
  }

  &__step-text {
    margin: 0;
    font-size: 0.95rem;
    color: v.$fontColor;
    line-height: 1.5;

    p {
      margin: 0 0 0.5rem;
    }
  }

  &__color-legend {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    margin-top: 0.25rem;
  }

  &__color-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.85rem;
    color: v.$fontColor;
    opacity: 0.9;
  }

  &__color-pill {
    display: inline-block;
    width: 1rem;
    height: 1rem;
    border-radius: 0.2rem;
    flex-shrink: 0;

    &--green {
      background-color: v.$success;
    }

    &--yellow {
      background-color: v.$warning;
    }

    &--gray {
      background-color: v.$surface-3;
    }
  }

  &__close-btn {
    display: block;
    width: 100%;
    margin-top: 1.5rem;
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: v.$radius-md;
    background-image: linear-gradient(to top, v.$color900, v.$color800);
    color: v.$background;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    @include m.transition(all, v.$transition-fast);
    @include m.focus-ring;

    &:hover {
      filter: brightness(0.85);
      transform: translateY(-1px);
    }

    &:active {
      transform: translateY(0);
    }
  }
}
</style>
