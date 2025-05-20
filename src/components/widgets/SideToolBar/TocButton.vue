<script setup lang="ts">
import { t } from '@utils/i18n';
import { onMounted, onUnmounted, ref } from 'vue';

const isOpen = ref(false);
const isWideScreen = ref(false);
const hasToc = ref(false);
const tocWrapper = ref<HTMLElement | null>(null);

const handleResize = () => {
  if (window.innerWidth > 1280) {
    isWideScreen.value = true;
  } else {
    isWideScreen.value = false;
  }
};

onMounted(() => {
  const setup = () => {
    const toc = document.getElementById('toc');
    if (toc && tocWrapper.value) {
      hasToc.value = true;
      const remainAttrs = ['class', 'style'];
      tocWrapper.value.innerHTML = '';
      tocWrapper.value.appendChild(toc.cloneNode(true));
      tocWrapper.value.children[0].id = 'stb-toc-content';
      Array.from(tocWrapper.value.children[0].attributes).forEach((attr) => {
        if (!remainAttrs.includes(attr.name)) {
          tocWrapper.value!.children[0].removeAttribute(attr.name);
        }
      });
    }
    window.addEventListener('resize', handleResize);
    handleResize();
  };
  const cleanup = () => {
    isOpen.value = false;
    if (tocWrapper.value) tocWrapper.value.innerHTML = '';
    hasToc.value = false;
    window.removeEventListener('resize', handleResize);
    isWideScreen.value = false;
  };

  document.addEventListener('astro:page-load', setup);
  setup();
  document.addEventListener('astro:before-swap', cleanup);
});

onUnmounted(() => {
  if (tocWrapper.value) tocWrapper.value.innerHTML = '';
  hasToc.value = false;
  window.removeEventListener('resize', handleResize);
  isWideScreen.value = false;
});
</script>

<template>
  <div
    :class="{
      hidden: !hasToc || isWideScreen,
    }"
  >
    <button
      ref="buttonRef"
      class="btn btn-circle btn-secondary btn-sm"
      @click="isOpen = !isOpen"
      :title="t.info.toc()"
      :aria-label="t.info.toc()"
      :aria-expanded="isOpen"
      :aria-controls="'stb-toc-wrapper'"
    >
      <slot name="icon" />
    </button>
    <div
      ref="tocWrapper"
      id="stb-toc-wrapper"
      class="rounded-box absolute w-[calc(100vw-4rem)] -translate-x-1/2 -translate-y-1/2 max-w-72 backdrop-blur-md duration-300 text-base-content text-start"
      :inert="!isOpen || isWideScreen"
      :class="{
        '-translate-x-[calc(100%+0.5rem)]! -translate-y-[calc(100%-2.5rem)]!':
          isOpen && !isWideScreen,
        'scale-0 opacity-0': !isOpen || isWideScreen,
      }"
    />
  </div>
</template>
