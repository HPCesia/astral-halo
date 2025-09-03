import { t } from '@utils/i18n';
import type { ParentComponent } from 'solid-js';
import { createSignal, onCleanup, onMount } from 'solid-js';

const TocButton: ParentComponent = (props) => {
  const [isOpen, setIsOpen] = createSignal(false);
  const [isWideScreen, setIsWideScreen] = createSignal(false);
  const [hasToc, setHasToc] = createSignal(false);
  let tocWrapperRef: HTMLDivElement | undefined;
  let buttonRef: HTMLButtonElement | undefined;

  const handleResize = () => {
    setIsWideScreen(window.innerWidth > 1280);
  };

  const setup = () => {
    const toc = document.getElementById('toc');
    const wrapper = tocWrapperRef;
    if (toc && wrapper) {
      wrapper.innerHTML = '';
      wrapper.appendChild(toc.cloneNode(true));
      (wrapper.children[0] as HTMLElement).id = 'stb-toc-content';

      const remainAttrs = ['class', 'style'];
      Array.from((wrapper.children[0] as Element).attributes).forEach((attr) => {
        if (!remainAttrs.includes(attr.name)) {
          (wrapper.children[0] as Element).removeAttribute(attr.name);
        }
      });

      setHasToc(true);
    } else {
      setHasToc(false);
    }

    window.addEventListener('resize', handleResize);
    handleResize(); // 初始一次
  };

  const cleanup = () => {
    setIsOpen(false);
    setHasToc(false);
    tocWrapperRef!.innerHTML = '';
    window.removeEventListener('resize', handleResize);
    setIsWideScreen(false);
  };

  onMount(() => {
    document.addEventListener('astro:page-load', setup);
    setup();
    document.addEventListener('astro:before-swap', cleanup);

    onCleanup(() => {
      document.removeEventListener('astro:page-load', setup);
      document.removeEventListener('astro:before-swap', cleanup);
      cleanup();
      setIsOpen(false);
      tocWrapperRef!.innerHTML = '';
    });
  });

  return (
    <div
      classList={{
        hidden: !hasToc() || isWideScreen(),
      }}
    >
      <button
        ref={buttonRef}
        type="button"
        class="btn btn-circle btn-secondary btn-sm"
        title={t.info.toc()}
        aria-label={t.info.toc()}
        aria-expanded={isOpen()}
        aria-controls="stb-toc-wrapper"
        onClick={() => setIsOpen((v) => !v)}
      >
        {props.children}
      </button>

      <div
        ref={tocWrapperRef}
        id="stb-toc-wrapper"
        classList={{
          'rounded-box absolute w-[calc(100vw-4rem)] -translate-x-1/2 -translate-y-1/2 max-w-72 backdrop-blur-md duration-300 text-base-content text-start': true,
          'scale-0 opacity-0': !isOpen() || isWideScreen(), // closed
          '-translate-x-[calc(100%+0.5rem)]! -translate-y-[calc(100%-2.5rem)]!':
            isOpen() && !isWideScreen(),
          hidden: !hasToc() || isWideScreen(),
        }}
        inert={!isOpen() || isWideScreen()}
      />
    </div>
  );
};

export default TocButton;
