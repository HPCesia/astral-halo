<script setup lang="ts">
import type {
  PagefindSearchResult,
  PagefindSearchResults,
} from '@/types/PagefindSearchAPI.d.ts';
import { t } from '@utils/i18n';
import { type Ref, onMounted, ref } from 'vue';

const isLoading = ref(false);

const props = defineProps({
  inputId: {
    type: String,
    required: true,
  },
});

const bundlePath = `${import.meta.env.BASE_URL}pagefind/`;
const baseUrl = import.meta.env.BASE_URL;

const searchResults: Ref<{ url: string; title: string; excerpt: string }[]> = ref([]);
const noResults = ref(false);
let pagefind: null | {
  init: () => Promise<void>;
  options: (options: { baseUrl: string; basePath: string }) => Promise<void>;
  debouncedSearch: (text: string, delay: number) => Promise<PagefindSearchResults> | null;
} = null;

let searchSequence = 0;

const search = async (text: string) => {
  const currentSequence = ++searchSequence;

  if (!text) {
    isLoading.value = false;
    searchResults.value = [];
    noResults.value = false;
    return;
  }

  if (!pagefind) {
    isLoading.value = true;
    return;
  }

  isLoading.value = true;

  try {
    const searchResponse = await pagefind.debouncedSearch(text, 300);

    if (currentSequence !== searchSequence) {
      return;
    }

    if (!searchResponse) {
      isLoading.value = false;
      return;
    }

    const results = searchResponse.results;
    if (results.length === 0) {
      searchResults.value = [];
      noResults.value = true;
      isLoading.value = false;
      return;
    }

    noResults.value = false;
    const processedResults = await Promise.all(
      results.map(async (result: PagefindSearchResult) => {
        const data = await result.data();
        return {
          url: data.url,
          title: data.meta.title,
          excerpt: data.excerpt,
        };
      })
    );

    if (currentSequence === searchSequence) {
      searchResults.value = processedResults;
      isLoading.value = false;
    }
  } catch (error) {
    if (currentSequence === searchSequence) {
      console.error('Search error:', error);
      isLoading.value = false;
      noResults.value = true;
      searchResults.value = [];
    }
  }
};

const setupSearch = () => {
  const searchInput = document.getElementById(props.inputId);
  if (!searchInput) {
    console.error(`Pagefind: Input element with id "${props.inputId}" not found`);
    return;
  }

  searchInput.addEventListener('input', (event: Event) => {
    const target = event.target as HTMLInputElement;
    const value = target.value.trim();
    search(value);
  });
};

const setup = async () => {
  pagefind = await import(/* @vite-ignore */ `${bundlePath}pagefind.js`);
  if (!pagefind) {
    console.error('Pagefind: Failed to load pagefind.js');
    return;
  }
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
      :aria-label="t.search.searchResults()"
      tabindex="-1"
    >
      <template v-if="isLoading">
        <div v-for="i in 2" :key="i" class="w-full rounded-md p-2">
          <div class="flex flex-row items-center gap-1">
            <span class="skeleton h-6 w-48"></span>
          </div>
          <div class="skeleton mt-2 h-4 w-full"></div>
          <div class="skeleton mt-1 h-4 w-3/4"></div>
        </div>
      </template>
      <template v-else-if="noResults">{{ t.search.noSearchResults() }}</template>
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
