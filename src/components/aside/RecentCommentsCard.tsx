import { ArtalkProvider } from './recent-comments/Artalk';
import { TwikooProvider } from './recent-comments/Twikoo';
import { WalineProvider } from './recent-comments/Waline';
import type { CommentData } from './recent-comments/types';
import { asideConfig, commentConfig, siteConfig } from '@/config';
import { t } from '@utils/i18n';
import type { Component } from 'solid-js';
import { For, Show, createSignal, onMount } from 'solid-js';

const cacheKey = 'recent-comments-cache';
const cacheExpireTime = 30 * 60 * 1000; // 30 min

interface CacheInfo {
  data: CommentData[];
  timestamp: number;
  provider: string;
}

function getFromCache(): CommentData[] | null {
  try {
    const cached = localStorage.getItem(cacheKey);
    if (!cached) return null;

    const tmp: CacheInfo = JSON.parse(cached);

    const expired = Date.now() - tmp.timestamp > cacheExpireTime;
    if (expired || tmp.provider !== commentConfig.provider) {
      localStorage.removeItem(cacheKey);
      return null;
    }

    return tmp.data.map((c) => ({ ...c, time: new Date(c.time) }));
  } catch {
    localStorage.removeItem(cacheKey);
    return null;
  }
}

function saveToCache(list: CommentData[]): void {
  try {
    const cacheObj: CacheInfo = {
      data: list,
      timestamp: Date.now(),
      provider: commentConfig.provider,
    };
    localStorage.setItem(cacheKey, JSON.stringify(cacheObj));
  } catch {
    /* ignore */
  }
}

const RecentComments: Component = () => {
  const [comments, setComments] = createSignal<CommentData[]>([]);
  const [loading, setLoading] = createSignal(true);

  const load = async () => {
    const cached = getFromCache();
    if (cached) {
      setComments(cached);
      setLoading(false);
      return;
    }

    const provider = (() => {
      switch (commentConfig.provider) {
        case 'twikoo':
          return TwikooProvider;
        case 'waline':
          return WalineProvider;
        case 'artalk':
          return ArtalkProvider;
        default:
          throw new Error(
            `Unsupported comment provider: '${commentConfig.provider}' for recent comments`
          );
      }
    })();

    try {
      const raw = await provider.setup();
      setComments(raw);
      saveToCache(raw);
    } catch (e) {
      console.error('Failed to load recent comments:', e);
      setComments([]);
    } finally {
      setLoading(false);
    }
  };

  onMount(load);

  const refresh = () => {
    localStorage.removeItem(cacheKey);
    setLoading(true);
    load();
  };

  return (
    <div id="recent-comments-card" class="card border-base-300 bg-base-200 border">
      <div class="card-body px-4 py-2">
        <div class="card-title flex justify-between">
          <span>{t.info.recentComments()}</span>
          <button
            class="btn btn-ghost btn-sm btn-square text-base"
            disabled={loading()}
            title={t.common.refresh()}
            aria-label={t.common.refresh()}
            onClick={refresh}
          >
            ↻
          </button>
        </div>

        <ul class="list">
          <Show when={loading()}>
            <For each={Array.from({ length: asideConfig.recentComment.count })}>
              {(_, _idx) => (
                <li class="list-row comment-placeholder px-0">
                  <div class="avatar">
                    <div class="skeleton w-16 min-w-16 rounded-md" />
                  </div>
                  <div class="flex w-full flex-col justify-between">
                    <div class="flex flex-col gap-2">
                      <div class="skeleton h-4 w-full" />
                      <div class="skeleton h-4 w-[100%-2rem]" />
                    </div>
                    <div class="skeleton h-4 w-10" />
                  </div>
                </li>
              )}
            </For>
          </Show>

          <Show when={!loading()}>
            <For each={comments()}>
              {(item) => (
                <li class="list-row px-0">
                  <a class="avatar" href={item.commentUrl}>
                    <div class="w-16 min-w-16 rounded-md">
                      <img src={item.avatarUrl} alt={item.author} />
                    </div>
                  </a>

                  <div class="flex w-full flex-col justify-between">
                    <a
                      href={item.commentUrl}
                      class="hover:text-primary line-clamp-2 w-full overflow-clip"
                      innerHTML={item.commentContent}
                    />
                    <time
                      datetime={item.time.toISOString()}
                      class="text-base-content/60 text-xs"
                      textContent={item.time.toLocaleDateString(
                        siteConfig.lang.replace('_', '-'),
                        {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                        }
                      )}
                    />
                  </div>
                </li>
              )}
            </For>
          </Show>
        </ul>
      </div>
    </div>
  );
};

export default RecentComments;
