import fs from 'node:fs';
import path from 'node:path';

/** Read a WebP file's pixel dimensions (VP8 / VP8L / VP8X). */
function webpSize(file) {
  try {
    const b = fs.readFileSync(file);
    if (b.toString('ascii', 0, 4) !== 'RIFF' || b.toString('ascii', 8, 12) !== 'WEBP') return null;
    const fmt = b.toString('ascii', 12, 16);
    if (fmt === 'VP8 ') {
      return { w: b.readUInt16LE(26) & 0x3fff, h: b.readUInt16LE(28) & 0x3fff };
    }
    if (fmt === 'VP8L') {
      const b0 = b[21], b1 = b[22], b2 = b[23], b3 = b[24];
      return {
        w: 1 + (((b1 & 0x3f) << 8) | b0),
        h: 1 + (((b3 & 0x0f) << 10) | (b2 << 2) | ((b1 & 0xc0) >> 6)),
      };
    }
    if (fmt === 'VP8X') {
      return {
        w: 1 + (b[24] | (b[25] << 8) | (b[26] << 16)),
        h: 1 + (b[27] | (b[28] << 8) | (b[29] << 16)),
      };
    }
  } catch {
    /* unreadable */
  }
  return null;
}

/**
 * All of a page's body images (every non-header .webp in its folder), ordered
 * with the prompt.txt target first, then the rest alphabetically.
 */
function findContentImages(slug) {
  const dir = path.join('public', 'images', slug);
  let files;
  try {
    files = fs.readdirSync(dir);
  } catch {
    return [];
  }
  const webps = files.filter((f) => f.toLowerCase().endsWith('.webp') && !/header/i.test(f));
  if (webps.length === 0) return [];
  let target = null;
  try {
    const prompt = fs.readFileSync(path.join(dir, 'prompt.txt'), 'utf8');
    const m = prompt.match(/Target filename:\s*(.+\.webp)/i);
    if (m && webps.includes(m[1].trim())) target = m[1].trim();
  } catch {
    /* no prompt.txt */
  }
  const ordered = target ? [target, ...webps.filter((f) => f !== target).sort()] : webps.sort();
  return ordered.map((f) => {
    const size = webpSize(path.join(dir, f));
    return {
      src: `/images/${slug}/${f}`,
      alt: f.replace(/\.webp$/i, '').replace(/-/g, ' '),
      w: size?.w,
      h: size?.h,
    };
  });
}

/** True if the tree already contains an <img> (parts 1-3 have inline images). */
function containsImage(node) {
  if (node.type === 'element' && node.tagName === 'img') return true;
  return (node.children || []).some(containsImage);
}

/**
 * 1) Wrap each H2-delimited run of content in a <section class="doc-section">.
 * 2) Inject the page's own body image partway down the page (buried in the
 *    text at a section boundary), unless the markdown already has an inline image.
 */
export default function rehypeSectionize() {
  return (tree, file) => {
    // --- Inject the page's body image partway down the text (before sectioning),
    //     unless the markdown already has an inline image (parts 1-3). ---
    const alreadyHasImage = tree.children.some(containsImage);
    const src = file?.path || file?.history?.[file.history.length - 1];
    if (!alreadyHasImage && src) {
      const slug = path.basename(src).replace(/\.md$/, '');
      const images = findContentImages(slug);
      // Block-level elements we can insert after (skip headings so we don't split
      // a heading from its first line).
      const spots = [];
      tree.children.forEach((n, i) => {
        if (n.type === 'element' && !/^h[1-6]$/.test(n.tagName)) spots.push(i);
      });
      if (images.length > 0 && spots.length > 0) {
        let hash = 0;
        for (const c of slug) hash = (hash * 31 + c.charCodeAt(0)) >>> 0;
        const makeNode = (im) => ({
          type: 'element',
          tagName: 'img',
          properties: {
            className: ['content-image'],
            src: im.src,
            alt: im.alt,
            loading: 'lazy',
            ...(im.w && im.h ? { width: im.w, height: im.h } : {}),
          },
          children: [],
        });
        // One image: a single deterministic spot ~35-65% down. Multiple: spread
        // them evenly across the middle 20-80% of the text.
        const picks = images.map((im, k) => {
          const frac =
            images.length === 1
              ? 0.35 + ((hash % 1000) / 1000) * 0.3
              : 0.2 + (0.6 * (k + 1)) / (images.length + 1);
          const idx = Math.min(spots.length - 1, Math.max(0, Math.round(spots.length * frac)));
          return { childIndex: spots[idx], node: makeNode(im) };
        });
        // Insert from the bottom up so earlier splices don't shift later indices.
        picks
          .sort((a, b) => b.childIndex - a.childIndex)
          .forEach((p) => tree.children.splice(p.childIndex + 1, 0, p.node));
      }
    }

    // --- Group content into <section class="doc-section"> for the banded look. ---
    const newSection = (extra) => ({
      type: 'element',
      tagName: 'section',
      properties: { className: extra ? ['doc-section', extra] : ['doc-section'] },
      children: [],
    });
    const hasH2 = tree.children.some((n) => n.type === 'element' && n.tagName === 'h2');
    const sections = [];
    let current = null;
    const flush = () => {
      if (current && current.children.length) sections.push(current);
    };

    if (hasH2) {
      // Split on each H2 heading (real topic boundaries).
      for (const node of tree.children) {
        if (node.type === 'element' && node.tagName === 'h2') {
          flush();
          current = newSection();
          current.children.push(node);
        } else {
          if (!current) current = newSection('doc-intro');
          current.children.push(node);
        }
      }
      flush();
    } else {
      // No headings: chunk the prose into bands every ~4 block elements so the
      // page still gets visual rhythm (breaks are regular, not topic-based).
      const PER = 4;
      let count = 0;
      for (const node of tree.children) {
        if (!current) current = newSection();
        current.children.push(node);
        if (node.type === 'element' && !/^h[1-6]$/.test(node.tagName)) {
          count += 1;
          if (count >= PER) { flush(); current = null; count = 0; }
        }
      }
      flush();
    }

    if (sections.length > 0) tree.children = sections;
  };
}
