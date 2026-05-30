<script setup lang="ts">
import { CloseIcon, ItalyIcon, UnitedKingdomIcon } from "../../../assets";

const props = defineProps<{
  isOpen: boolean;
  onClose: () => void;
  currentLocale: "en" | "it";
  setLanguage: (lang: "en" | "it") => void;
}>();
</script>

<template>
  <transition name="settings-modal-animation">
    <div
      v-show="props.isOpen"
      class="settings-modal"
      @click.self="props.onClose"
    >
      <transition name="settings-modal-animation-inner">
        <div v-show="props.isOpen" class="settings-modal__inner">
          <button
            class="settings-modal__close"
            :aria-label="$t('common.close')"
            @click="props.onClose"
          >
            <CloseIcon />
          </button>

          <h2 class="settings-modal__title">{{ $t("settings.title") }}</h2>

          <div class="settings-modal__card">
            <div class="settings-modal__row">
              <span class="settings-modal__label">{{
                $t("settings.language")
              }}</span>
              <div class="settings-modal__language-toggle">
                <button
                  :class="[
                    'settings-modal__lang-btn',
                    {
                      'settings-modal__lang-btn--active':
                        props.currentLocale === 'en',
                    },
                  ]"
                  @click="props.setLanguage('en')"
                >
                  <UnitedKingdomIcon class="settings-modal__lang-icon" />
                  <span>{{ $t("settings.english") }}</span>
                </button>
                <button
                  :class="[
                    'settings-modal__lang-btn',
                    {
                      'settings-modal__lang-btn--active':
                        props.currentLocale === 'it',
                    },
                  ]"
                  @click="props.setLanguage('it')"
                >
                  <ItalyIcon class="settings-modal__lang-icon" />
                  <span>{{ $t("settings.italian") }}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<style lang="scss" scoped>
@use "../../../styles/variables.scss" as v;
@use "../../../styles/mixins.scss" as m;

.settings-modal-animation-enter-active,
.settings-modal-animation-leave-active {
  @include m.transition(opacity, 0.3s, cubic-bezier(0.52, 0.02, 0.19, 1.02));
}

.settings-modal-animation-enter-from,
.settings-modal-animation-leave-to {
  opacity: 0;
}

.settings-modal-animation-inner-enter-active {
  @include m.transition(all, 0.3s, cubic-bezier(0.52, 0.02, 0.19, 1.02), 0.15s);
}

.settings-modal-animation-inner-leave-active {
  @include m.transition(all, 0.3s, cubic-bezier(0.52, 0.02, 0.19, 1.02));
}

.settings-modal-animation-inner-enter-from {
  opacity: 0;
  transform: scale(0.8);
}

.settings-modal-animation-inner-leave-to {
  transform: scale(0.8);
}

.settings-modal {
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
    padding: 2rem;
    @include m.glass-card(22px, 0.72);
    border-radius: v.$radius-lg;
    box-shadow: v.$shadow-lg;
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
    color: v.$fontColor;
    margin: 0 0 1.5rem;
    text-align: center;
  }

  &__card {
    width: 100%;
    border-radius: v.$radius-lg;
    box-shadow: v.$shadow-lg;
    padding: 0.5rem;
    background: rgba(255, 255, 255, 0.02);
  }

  &__row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    padding: 1rem 1.25rem;
    border-radius: v.$radius-md;
    @include m.transition(background, v.$transition-fast);

    &:hover {
      background: rgba(255, 255, 255, 0.03);
    }
  }

  &__label {
    font-size: 1rem;
    font-weight: 500;
    color: v.$fontColor;
  }

  &__language-toggle {
    display: flex;
    gap: 0.25rem;
    background: v.$surface-2;
    border-radius: v.$radius-md;
    padding: 0.25rem;
  }

  &__lang-btn {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.5rem 0.85rem;
    border: none;
    border-radius: v.$radius-md;
    background: transparent;
    color: v.$fontColor;
    font-size: 0.9rem;
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

  &__lang-icon {
    width: 1.25rem;
    height: 1.25rem;
  }
}

@media (max-width: 520px) {
  .settings-modal {
    &__row {
      flex-direction: column;
      align-items: flex-start;
    }
  }
}
</style>
