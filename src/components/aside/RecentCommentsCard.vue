<script setup lang="ts">
import { ArtalkProvider } from './recent-comments/Artalk';
import { TwikooProvider } from './recent-comments/Twikoo';
import { WalineProvider } from './recent-comments/Waline';
import type { CommentData } from './recent-comments/types';
import { asideConfig, commentConfig, siteConfig } from '@/config';
import { t } from '@utils/i18n';
import { onMounted, ref } from 'vue';

const comments = ref<CommentData[]>([]);
const loading = ref(true);

const cacheKey = 'recent-comments-cache';
const cacheExpireTime = 30 * 60 * 1000; // 30 min

interface CacheData {
  data: CommentData[];
  timestamp: number;
  provider: string;
}

function getFromCache(): CommentData[] | null {
  try {
    const cached = localStorage.getItem(cacheKey);
    if (!cached) return null;

    const cacheData: CacheData = JSON.parse(cached);

    // 检查缓存是否过期
    const isExpired = Date.now() - cacheData.timestamp > cacheExpireTime;
    if (isExpired) {
      localStorage.removeItem(cacheKey);
      return null;
    }

    // 检查评论系统是否变更
    if (cacheData.provider !== commentConfig.provider) {
      localStorage.removeItem(cacheKey);
      return null;
    }

    // 恢复 Date 对象（JSON 序列化会将 Date 转为字符串）
    return cacheData.data.map((comment) => ({
      ...comment,
      time: new Date(comment.time),
    }));
  } catch (error) {
    console.warn('Failed to read from cache:', error);
    localStorage.removeItem(cacheKey);
    return null;
  }
}

function saveToCache(data: CommentData[]): void {
  try {
    const cacheData: CacheData = {
      data,
      timestamp: Date.now(),
      provider: commentConfig.provider,
    };
    localStorage.setItem(cacheKey, JSON.stringify(cacheData));
  } catch (error) {
    console.warn('Failed to save to cache:', error);
  }
}

async function loadComments() {
  const cachedComments = getFromCache();
  if (cachedComments) {
    comments.value = cachedComments;
    loading.value = false;
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
    const data = await provider.setup();
    comments.value = data;
    saveToCache(data);
  } catch (error) {
    console.error('Failed to load recent comments:', error);
    comments.value = [];
  } finally {
    loading.value = false;
  }
}

function refreshComments() {
  localStorage.removeItem(cacheKey);
  loading.value = true;
  loadComments();
}

onMounted(() => {
  loadComments();
});
</script>

<template>
  <div id="recent-comments-card" class="card border-base-300 bg-base-200/25 border">
    <div class="card-body px-4 py-2">
      <div class="card-title flex justify-between">
        <span>{{ t.info.recentComments() }}</span>
        <button
          @click="refreshComments"
          class="btn btn-ghost btn-sm btn-square text-base"
          :disabled="loading"
          :title="t.common.refresh()"
          :aria-label="t.common.refresh()"
        >
          ↻
        </button>
      </div>
      <ul class="list">
        <template v-if="!loading">
          <li v-for="comment in comments" :key="comment.commentUrl" class="list-row px-0">
            <a class="avatar" :href="comment.commentUrl">
              <div class="w-16 min-w-16 rounded-md">
                <img :src="comment.avatarUrl" :alt="comment.author" />
              </div>
            </a>
            <div class="flex w-full flex-col justify-between">
              <a
                :href="comment.commentUrl"
                class="hover:text-primary line-clamp-2 w-full overflow-clip"
                v-html="comment.commentContent"
              ></a>
              <time :datetime="comment.time.toISOString()" class="text-base-content/60 text-xs">
                {{
                  comment.time.toLocaleDateString(siteConfig.lang.replace('_', '-'), {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                  })
                }}
              </time>
            </div>
          </li>
        </template>
        <template v-else>
          <li
            v-for="n in asideConfig.recentComment.count"
            :key="n"
            class="list-row comment-placeholder px-0"
          >
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
        </template>
      </ul>
    </div>
  </div>
</template>
