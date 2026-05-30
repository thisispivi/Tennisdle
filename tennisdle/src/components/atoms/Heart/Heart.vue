<script setup lang="ts">
const { isClicked, isBreaking } = defineProps<{
  isClicked: boolean;
  isBreaking?: boolean;
}>();
</script>

<template>
  <label :class="['container', { 'container--breaking': isBreaking }]">
    <input :checked="isClicked" type="checkbox" disabled />
    <div class="checkmark">
      <svg viewBox="0 0 256 256">
        <rect fill="none" height="256" width="256"></rect>
        <path
          d="M224.6,51.9a59.5,59.5,0,0,0-43-19.9,60.5,60.5,0,0,0-44,17.6L128,59.1l-7.5-7.4C97.2,28.3,59.2,26.3,35.9,47.4a59.9,59.9,0,0,0-2.3,87l83.1,83.1a15.9,15.9,0,0,0,22.6,0l81-81C243.7,113.2,245.6,75.2,224.6,51.9Z"
          stroke-width="0"
          stroke="none"
          fill="#242526"
        ></path>
      </svg>
    </div>
  </label>
</template>

<style scoped lang="scss">
@use "../../../styles/animations.scss";

.container {
  display: block;
  position: relative;
  user-select: none;
  transition: 100ms;

  &--breaking .checkmark {
    animation: heartBreak 0.5s ease-out forwards !important;
  }

  input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
    &:checked ~ .checkmark path {
      fill: #ff5353;
      stroke-width: 0;
    }
    &:checked ~ .checkmark {
      animation: like_effect 400ms ease;
      filter: drop-shadow(0 0 0.4rem rgba(255, 83, 83, 0.4));
    }
  }

  .checkmark {
    top: 0;
    left: 0;
    height: 2rem;
    width: 2rem;
    transition: 100ms;
    animation: dislike_effect 400ms ease;
  }
}

@keyframes like_effect {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes dislike_effect {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}
</style>
