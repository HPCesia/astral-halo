import { inferRemoteSize } from 'astro:assets';

const cache = new Map<string, { width: number; height: number }>();

export async function getCachedRemoteImageSize(
  src: string
): Promise<{ width: number; height: number } | null> {
  if (cache.has(src)) {
    return cache.get(src)!;
  }

  try {
    const metadata = await inferRemoteSize(src);
    const dimensions = { width: metadata.width, height: metadata.height };

    cache.set(src, dimensions);

    return dimensions;
  } catch (error) {
    console.warn(
      `[WARN] Could not infer size for image "${src}": ${(error as Error).message}.`
    );
    return null;
  }
}
