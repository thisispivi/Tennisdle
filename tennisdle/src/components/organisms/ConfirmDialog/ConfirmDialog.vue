<script setup lang="ts">
const props = defineProps<{
  isOpen: boolean;
  title: string;
  description: string;
  confirmText: string;
  cancelText: string;
  onConfirm: () => void;
  onCancel: () => void;
}>();
</script>

<template>
  <transition name="confirm-dialog">
    <div
      v-show="props.isOpen"
      class="confirm-dialog"
      @click.self="props.onCancel"
    >
      <transition name="confirm-dialog-inner">
        <div v-show="props.isOpen" class="confirm-dialog__inner">
          <h3 class="confirm-dialog__title">{{ props.title }}</h3>
          <p class="confirm-dialog__description">{{ props.description }}</p>
          <div class="confirm-dialog__actions">
            <button class="btn btn--secondary" @click="props.onCancel">
              {{ props.cancelText }}
            </button>
            <button class="btn btn--danger" @click="props.onConfirm">
              {{ props.confirmText }}
            </button>
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<style lang="scss" scoped>
@use "sass:color";
@use "../../../styles/variables.scss" as v;
@use "../../../styles/mixins.scss" as m;

.confirm-dialog-enter-active,
.confirm-dialog-leave-active {
  @include m.transition(opacity, 0.2s, ease);
}
.confirm-dialog-enter-from,
.confirm-dialog-leave-to {
  opacity: 0;
}
.confirm-dialog-inner-enter-active {
  @include m.transition(all, 0.25s, cubic-bezier(0.34, 1.56, 0.64, 1), 0.1s);
}
.confirm-dialog-inner-leave-active {
  @include m.transition(all, 0.15s, ease);
}
.confirm-dialog-inner-enter-from {
  opacity: 0;
  transform: scale(0.9);
}
.confirm-dialog-inner-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

.confirm-dialog {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(10px);
  z-index: 2000;

  &__inner {
    @include m.glass-card(22px, 0.72);
    border-radius: v.$radius-lg;
    padding: 2rem;
    max-width: 24rem;
    width: 90%;
    box-shadow: v.$shadow-lg;
    text-align: center;
  }

  &__title {
    margin: 0 0 0.75rem;
    font-size: 1.25rem;
    color: v.$fontColor;
  }

  &__description {
    margin: 0 0 1.5rem;
    font-size: 0.95rem;
    opacity: 0.85;
    line-height: 1.5;
  }

  &__actions {
    display: flex;
    gap: 0.75rem;
    justify-content: center;
  }

  .btn {
    padding: 0.6rem 1.25rem;
    border: none;
    border-radius: v.$radius-md;
    font-size: 0.95rem;
    font-weight: 600;
    cursor: pointer;
    @include m.transition(all, v.$transition-fast);
    @include m.focus-ring;

    &--secondary {
      background-color: v.$surface-3;
      color: v.$fontColor;

      &:hover {
        background-color: color.adjust(v.$surface-3, $lightness: 5%);
      }
    }

    &--danger {
      background-color: v.$error;
      color: white;

      &:hover {
        filter: brightness(0.85);
      }
    }
  }
}
</style>
