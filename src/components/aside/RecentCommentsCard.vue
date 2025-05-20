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

// 根据评论系统类型加载不同的评论数据
async function loadComments() {
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
    comments.value = await provider.setup();
  } catch (error) {
    console.error('Failed to load recent comments:', error);
    comments.value = [];
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  loadComments();
});
</script>

<template>
  <div id="recent-comments-card" class="card border-base-300 bg-base-200/25 border">
    <div class="card-body px-4 py-2">
      <div class="card-title">
        {{ t.info.recentComments() }}
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
