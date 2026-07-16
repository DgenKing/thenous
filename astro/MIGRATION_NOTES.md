# Migration Notes

## Phase 1

- Created a static Astro project with strict TypeScript, the sitemap integration, and the check integration package.

## Phase 3

- The appendix source files do not include an H1 despite the source-material convention. Their titles were derived from their filename slugs; their bodies were otherwise copied unchanged.
- Hero image metadata is set only when the corresponding source image directory contains a verified filename matching `*header*.webp`.

## Phase 4

- Six legacy SEO descriptions are outside the requested 150–160-character range (source range: 136–194). They are retained verbatim to preserve the original published metadata; the collection validation therefore allows the final audit range of 50–200 characters.
- Collection titles for the 11 legacy pages use their original visible H1 values, preserving the page heading users saw in the source pages. The original head descriptions and verified hero/OG paths are retained.
