import type {
  PagefindSearchResult,
  PagefindSearchResults,
} from '@/types/PagefindSearchAPI.d.ts';
import { t } from '@utils/i18n';
import { type JSX, type ParentComponent, createSignal, onMount } from 'solid-js';
import IMaterialSymboChevronRight from '~icons/material-symbols/chevron-right';
import IMaterialSymbolSearchRounded from '~icons/material-symbols/search-rounded';

type Props = {
  inputId: string;
  icon?: JSX.Element;
};

const bundlePath = `${import.meta.env.BASE_URL}pagefind`;
const baseUrl = import.meta.env.BASE_URL;
interface PagefindInstance {
  init(): Promise<void>;
  options(opts: { baseUrl: string; basePath: string }): Promise<void>;
  debouncedSearch(text: string, delay: number): Promise<PagefindSearchResults> | null;
}

const [isLoading, setIsLoading] = createSignal(false);
const [searchResults, setSearchResults] = createSignal<
  { url: string; title: string; excerpt: string }[]
>([]);
const [noResults, setNoResults] = createSignal(false);
let pagefind: PagefindInstance | null = null;
let searchSequence = 0;

async function search(text: string) {
  const currentSequence = ++searchSequence;
  if (!text) {
    setIsLoading(false);
    setSearchResults([]);
    setNoResults(false);
    return;
  }
  if (!pagefind) {
    setIsLoading(true);
    return;
  }
  setIsLoading(true);
  try {
    const searchResponse = await pagefind?.debouncedSearch(text, 300);
    if (currentSequence !== searchSequence) return;
    if (!searchResponse) {
      setIsLoading(false);
      return;
    }
    const { results } = searchResponse;
    if (results.length === 0) {
      setSearchResults([]);
      setNoResults(true);
      setIsLoading(false);
      return;
    }
    setNoResults(false);
    const processed = await Promise.all(
      results.map(async (r: PagefindSearchResult) => {
        const data = await r.data();
        return { url: data.url, title: data.meta.title, excerpt: data.excerpt };
      })
    );
    if (currentSequence === searchSequence) {
      setSearchResults(processed);
      setIsLoading(false);
    }
  } catch (error) {
    console.error('Search error:', error);
    if (currentSequence === searchSequence) {
      setIsLoading(false);
      setNoResults(true);
      setSearchResults([]);
    }
  }
}
function setupSearch(inputId: string) {
  const searchInput = document.getElementById(inputId) as HTMLInputElement | null;
  if (!searchInput) {
    console.error(`Pagefind: Input element with id "${inputId}" not found`);
    return;
  }
  searchInput.addEventListener('input', (e) => {
    const value = (e.target as HTMLInputElement).value.trim();
    search(value);
  });
}

const PagefindSearch: ParentComponent<Props> = (props) => {
  onMount(async () => {
    if (!pagefind) {
      pagefind = await import(/* @vite-ignore */ `${bundlePath}/pagefind.js`);
      if (!pagefind) {
        console.error('Pagefind: Failed to load pagefind.js');
        return;
      }
      await pagefind.options({ baseUrl, basePath: bundlePath });
      await pagefind.init();
    }
    setupSearch(props.inputId);

    document.addEventListener('astro:page-load', () => setupSearch(props.inputId));
  });
  return (
    <div class="w-full" data-pagefind-ui>
      <label class="input input-bordered flex w-full items-center gap-2">
        <input
          id="search-input"
          type="search"
          spellcheck="false"
          autocorrect="off"
          autocomplete="off"
          autocapitalize="off"
          class="grow"
          placeholder={t.button.search()}
        />
        <IMaterialSymbolSearchRounded height="1.875rem" width="1.875rem" />
      </label>
      <div
        class="search-result mt-4 flex h-fit max-h-[calc(60vh-8rem)] flex-col items-center gap-2 overflow-y-auto text-center"
        aria-label={t.search.searchResults()}
        tabindex="-1"
      >
        {isLoading()
          ? Array.from({ length: 2 }).map((_, _i) => (
              <div class="w-full rounded-md p-2">
                <div class="flex flex-row items-center gap-1">
                  <span class="skeleton h-6 w-48"></span>
                </div>
                <div class="skeleton mt-2 h-4 w-full"></div>
                <div class="skeleton mt-1 h-4 w-3/4"></div>
              </div>
            ))
          : noResults()
            ? t.search.noSearchResults()
            : searchResults().map((result) => (
                <a
                  href={result.url}
                  class="group hover:bg-primary/30 w-full rounded-md p-2 duration-150"
                >
                  <div class="flex flex-row items-center gap-1 text-center">
                    <span class="group-hover:text-primary text-lg duration-150">
                      {result.title}
                    </span>
                    <IMaterialSymboChevronRight height="1.25rem" width="1.25rem" />
                  </div>
                  <div
                    class="text-sm opacity-60"
                    innerHTML={result.excerpt.replaceAll(
                      '<mark>',
                      '<mark class="text-primary-content bg-primary/70">'
                    )}
                  />
                </a>
              ))}
      </div>
    </div>
  );
};

export default PagefindSearch;
