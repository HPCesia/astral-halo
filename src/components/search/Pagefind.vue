<script setup>
import { onMounted, ref } from 'vue';

const props = defineProps({
  inputId: {
    type: String,
    required: true,
  },
});

const bundlePath = `${import.meta.env.BASE_URL}pagefind/`;
const baseUrl = import.meta.env.BASE_URL;

const searchResults = ref([]);
const noResults = ref(false);
let pagefind = null;

const search = async (text) => {
  if (!pagefind) return;

  const searchResponse = await pagefind.debouncedSearch(text, 300);
  if (!searchResponse) return;
  const results = searchResponse.results;
  if (results.length === 0) {
    searchResults.value = [];
    noResults.value = true;
    return;
  }

  noResults.value = false;
  const processedResults = await Promise.all(
    results.map(async (result) => {
      const data = await result.data();
      return {
        url: data.url,
        title: data.meta.title,
        excerpt: data.excerpt,
      };
    })
  );
  searchResults.value = processedResults;
};

const setupSearch = () => {
  const searchInput = document.getElementById(props.inputId);
  if (!searchInput) {
    console.error(`Pagefind: Input element with id "${props.inputId}" not found`);
    return;
  }

  searchInput.addEventListener('input', (e) => search(e.target.value));
};

const setup = async () => {
  pagefind = await import(/* @vite-ignore */ `${bundlePath}pagefind.js`);
  await pagefind.options({
    baseUrl: baseUrl,
    basePath: bundlePath,
  });
  pagefind.init();
  setupSearch();
};

onMounted(() => {
  setup();
  document.addEventListener('astro:page-load', setup);
});

defineExpose({
  searchResults,
  noResults,
});
</script>

<template>
  <div class="w-full" data-pagefind-ui>
    <slot></slot>
    <div
      class="search-result mt-4 flex h-fit max-h-[calc(60vh-8rem)] flex-col items-center gap-2 overflow-y-auto text-center"
    >
      <template v-if="noResults"> No results found </template>
      <template v-else>
        <a
          v-for="result in searchResults"
          :key="result.url"
          :href="result.url"
          class="group hover:bg-primary/30 w-full rounded-md p-2 duration-150"
        >
          <div class="flex flex-row items-center gap-1 text-center">
            <span class="group-hover:text-primary text-lg duration-150"
              >{{ result.title }}<slot name="icon"></slot
            ></span>
          </div>
          <div class="text-sm opacity-60" v-html="result.excerpt"></div>
        </a>
      </template>
    </div>
  </div>
</template>

<style>
[data-pagefind-ui] mark {
  background-color: transparent;
  color: var(--color-secondary);
}
</style>
