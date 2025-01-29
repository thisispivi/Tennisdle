<script lang="ts" setup>
const { countryCode } = defineProps<{ countryCode: string }>();
</script>

<template>
  <img
    class="country-flag"
    :src="`https://flagsapi.com/${countryCode}/flat/64.png`"
    :alt="`Flag of ${countryCode}`"
  />
</template>

<style scoped lang="scss">
.country-flag {
  width: 100%;
  height: 100%;
}
</style>
