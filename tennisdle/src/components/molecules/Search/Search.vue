<script setup lang="ts">
import Fuse from "fuse.js";
import { computed, ref } from "vue";

const { allKeys, selectPlayer, alreadyGuessed } = defineProps<{
  allKeys: string[];
  selectPlayer: (player: string) => void;
  alreadyGuessed: string[];
}>();

const search = ref("");
const onSearch = (e: Event) => {
  search.value = (e.target as HTMLInputElement).value;
};

const fuse = new Fuse(allKeys, { includeScore: true });
const results = computed(() =>
  fuse
    .search(search.value)
    .map((result) => result.item)
    .filter((item) => !alreadyGuessed.includes(item))
);

const selectPlayerWClose = (player: string) => {
  selectPlayer(player);
  search.value = "";
};
</script>

<template>
  <div class="search">
    <input
      v-model="search"
      type="text"
      placeholder="Search"
      @input="onSearch"
    />
    <ul>
      <li
        v-for="result in results"
        :key="result"
        @click="selectPlayerWClose(result)"
      >
        {{ result }}
      </li>
    </ul>
  </div>
</template>

<style scoped lang="scss">
.search {
  position: relative;
  input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 16px;
  }
  ul {
    position: absolute;
    width: 100%;
    background-color: #fff;
    border: 1px solid #ccc;
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin-top: 5px;
    padding: 0;
    max-height: 20rem;
    overflow-y: auto;
    z-index: 10;
    li {
      list-style: none;
      padding: 10px;
      border-bottom: 1px solid #ccc;
      color: black;
      &:last-child {
        border-bottom: none;
      }
    }
  }
}
</style>
