<script setup lang="ts">
import { ref } from "vue";

import { ConfirmDialog } from "../../organisms";

const emit = defineEmits<{
  surrender: [];
}>();

const showConfirm = ref(false);

const onSurrender = () => {
  showConfirm.value = false;
  emit("surrender");
};
</script>

<template>
  <button
    class="surrender-btn"
    :title="$t('surrender.button')"
    @click="showConfirm = true"
  >
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
      <line x1="4" y1="22" x2="4" y2="15" />
    </svg>
    <span>{{ $t("surrender.button") }}</span>
  </button>

  <ConfirmDialog
    :is-open="showConfirm"
    :title="$t('surrender.confirm.title')"
    :description="$t('surrender.confirm.description')"
    :confirm-text="$t('surrender.confirm.yes')"
    :cancel-text="$t('surrender.confirm.no')"
    :on-confirm="onSurrender"
    :on-cancel="() => (showConfirm = false)"
  />
</template>

<style lang="scss" scoped>
@use "../../../styles/variables.scss" as v;
@use "../../../styles/mixins.scss" as m;

.surrender-btn {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 0.85rem;
  border: 1px solid v.$border-strong;
  border-radius: v.$radius-md;
  background-color: transparent;
  color: v.$fontColor;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  opacity: 0.7;
  @include m.transition(all, v.$transition-fast);
  @include m.focus-ring;

  svg {
    width: 1rem;
    height: 1rem;
  }

  &:hover {
    opacity: 1;
    border-color: v.$error;
    color: v.$error;
    background-color: v.$error-dim;
  }
}
</style>
