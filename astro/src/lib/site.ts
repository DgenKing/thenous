import { getCollection, type CollectionEntry } from 'astro:content';

export type Chapter = CollectionEntry<'chapters'>;

/** Numeric rank for a part folder; appendices (no partNN prefix) sort last. */
export function partRank(part: string): number {
  const m = part.match(/^part(\d+)/);
  return m ? Number(m[1]) : Number.MAX_SAFE_INTEGER;
}

export function chapterSlug(c: Chapter): string {
  return c.id.split('/').at(-1)!;
}

export function chapterPath(c: Chapter): string {
  return `/pages/${c.data.part}/${chapterSlug(c)}/`;
}

/** All chapters in reading order: part number, then chapter order. */
export async function sortedChapters(): Promise<Chapter[]> {
  const all = await getCollection('chapters');
  return all.sort(
    (a, b) => partRank(a.data.part) - partRank(b.data.part) || a.data.order - b.data.order,
  );
}

/** One nav link per part, in reading order. */
export async function partsNav(): Promise<{ title: string; href: string }[]> {
  const chapters = await sortedChapters();
  return [...new Map(chapters.map((c) => [c.data.part, c.data.partTitle])).entries()].map(
    ([part, title]) => ({ title, href: `/pages/${part}/` }),
  );
}
