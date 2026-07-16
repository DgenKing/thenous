# THE PATTERN - Build Plan & Process Documentation

## Project Overview
- **Total Parts**: 31 parts
- **Total Pages**: ~200+ pages
- **Status**: Part 01 & Part 02 complete (7 pages built)
- **Template**: Proven and production-ready

---

## How to Build Each Part (Step-by-Step Process)

### Phase 1: Research & Preparation

1. **Identify Part Structure**
   ```bash
   ls -la /home/user/projects/THE-PATTERN/pages/partXX-name/
   ```
   - Count how many pages are in the part (e.g., 2.1, 2.2, 2.3)
   - Note the markdown filenames

2. **Verify Images Exist**
   ```bash
   # Check for hero image (21:9) - same for all pages in the part
   ls /home/user/projects/THE-PATTERN/images/X.1-*/

   # Check content images (16:9) - one per page
   find /home/user/projects/THE-PATTERN/images -name "X.*" -type d
   ```
   - **Hero image**: One 21:9 image shared across ALL pages in the part
   - **Content images**: One 16:9 image per page, placed halfway down

3. **Identify Hero Image**
   - Hero image is typically in the first page's image folder (e.g., `2.1-from-observation-to-creation/observation-creates-reality-header.webp`)
   - This SAME image is used at the top of ALL pages in that part

---

### Phase 2: Build Part Pages

#### Step 1: Create Part Directory
```bash
mkdir -p /home/user/projects/THE-PATTERN/pages/partXX
```

#### Step 2: Build Index Page
Create `/pages/partXX/index.html` using template:
- **Hero image**: Part-specific hero (21:9)
- **SEO meta tags**:
  - Title: "Part XX: [Part Name] - The Pattern"
  - Description: Brief overview of what the part covers (150-160 chars)
  - Canonical: `https://thepattern.uk/pages/partXX/`
  - Open Graph & Twitter images: Use hero image
- **Breadcrumb**: `Home > Part XX: [Part Name]`
- **Chapter cards**: List all pages (X.1, X.2, X.3, etc.) with:
  - Title
  - Brief description
  - "Read Chapter" button
- **Navigation buttons**:
  - Previous: Link to previous part's last page
  - Next: Link to first page (X.1) in this part

#### Step 3: Build Each Page (X.1, X.2, X.3, etc.)
For each page, create `/pages/partXX/X.Y-page-name.html`:

1. **Read markdown source**:
   ```
   /pages/partXX-name/X.Y-page-name.md
   ```

2. **Use template structure**:
   - Full HTML document with `<!DOCTYPE html>`
   - Complete `<head>` section with SEO meta tags
   - Inline navbar
   - Hero image (SAME for all pages in part) - 21:9
   - Content area with breadcrumb
   - Content image (unique per page) placed halfway down - 16:9
   - Inline footer
   - Bootstrap JS at bottom

3. **SEO Meta Tags** (update for each page):
   ```html
   <title>[Page Title] - The Pattern</title>
   <meta name="description" content="[150-160 char description]">
   <link rel="canonical" href="https://thepattern.uk/pages/partXX/X.Y-page-name.html">
   <meta property="og:image" content="https://thepattern.uk/images/X.1-first-page/hero-image.webp">
   <meta name="twitter:image" content="https://thepattern.uk/images/X.1-first-page/hero-image.webp">
   ```

4. **Images**:
   - **Hero** (top, full-width): `/images/X.1-first-page/hero-image.webp` (21:9)
   - **Content** (halfway down): `/images/X.Y-page-name/page-specific-image.webp` (16:9)

5. **Breadcrumb**:
   ```html
   Home > Part XX: [Part Name] > [Page Name]
   ```

6. **Navigation Buttons**:
   - **Previous**:
     - First page (X.1): Link to Part index
     - Other pages: Link to previous page (X.Y-1)
   - **Next**:
     - Last page: Link to next Part's index
     - Other pages: Link to next page (X.Y+1)

#### Step 4: Verify Navigation Links
Check that all links work:
- Index → All chapter pages ✓
- Page X.1 → X.2 → X.3 → Next Part ✓
- Previous part's last page → This part's index ✓

#### Step 5: Update Previous Part Link
Update the last page of the previous part to link to this part's index:
```html
<a href="/pages/partXX/index.html">Next: Part XX</a>
```

---

## Template Pattern

### Directory Structure
```
/pages/
  /part01/
    index.html
    1.1-page-name.html
    1.2-page-name.html
    1.3-page-name.html
  /part02/
    index.html
    2.1-page-name.html
    2.2-page-name.html
    2.3-page-name.html
  /partXX/
    ...
```

### Image Structure
```
/images/
  /1.1-page-name/
    part01-hero-image.webp (21:9)  ← Used on ALL Part 01 pages
    page-content-image.webp (16:9) ← Used only on page 1.1
  /1.2-page-name/
    page-content-image.webp (16:9) ← Used only on page 1.2
  /2.1-page-name/
    part02-hero-image.webp (21:9)  ← Used on ALL Part 02 pages
    page-content-image.webp (16:9) ← Used only on page 2.1
```

---

## Key Principles

### 1. Hero Images (21:9)
- **One per Part** - Same hero image used on ALL pages in that part
- Located in first page's image folder (e.g., `/images/2.1-first-page/hero.webp`)
- Placed at top of page, full-width, slides up to navbar
- Used in Open Graph and Twitter meta tags

### 2. Content Images (16:9)
- **One per Page** - Unique image for each page
- Located in corresponding page's image folder (e.g., `/images/2.2-page-name/content.webp`)
- Placed roughly halfway down the page content
- Uses `.content-image` CSS class

### 3. Navigation Flow
```
Part XX Index → X.1 → X.2 → X.3 → Part XX+1 Index
     ↑            ↓     ↓     ↓            ↓
     └────────────┴─────┴─────┴────────────┘
         (Previous buttons loop back)
```

### 4. SEO Requirements
Every page must have:
- Unique `<title>` (50-60 characters)
- Unique meta description (150-160 characters)
- Canonical URL pointing to itself
- Open Graph tags (title, description, url, image)
- Twitter Card tags (title, description, image)
- Breadcrumb with Schema.org markup

### 5. File Naming Convention
- **Index**: `index.html` (no number)
- **Pages**: `X.Y-descriptive-name.html` (lowercase, hyphens)
- **URLs**: Match filename structure exactly

---

## Completed Parts

### ✅ Part 01: Quantum Foundations
- **Pages**: 4 (index + 1.1, 1.2, 1.3)
- **Hero Image**: `quantum-brain-biological-processor-header.webp`
- **Status**: Complete and verified
- **Last page links to**: Part 02 index

### ✅ Part 02: Questions Create Reality
- **Pages**: 4 (index + 2.1, 2.2, 2.3)
- **Hero Image**: `observation-creates-reality-header.webp`
- **Status**: Complete and verified
- **Last page links to**: Part 03 index (when built)

---

## Next Steps

### Remaining Parts to Build (29 parts):
1. Part 03: Consciousness First Paradigm
2. Part 04: Present Moment Technique
3. Part 05: Global Consciousness Network
4. Part 06: Historical Evidence
5. Part 07: Scientific Validation
6. Part 08: Spiritual Awakening Journey
7. Part 09: Loop and Dark Night Territory
8. Part 10: Definitions and Epistemology
9. Part 11: Experimental Protocol
10. Part 12: The Responsibility of Knowing
11. Part 13: Synchronicities and Universal Guidance
12. Part 14: CERN Question and Epistemological Humility
13. Part 15: Purpose and Mission
14. Part 16: AI Consciousness Convergence
15. Part 17: Consciousness Defined Through Action
16. Part 18: Chemical Suppression Hypothesis
17. Part 19: Government and Division
18. Part 20: The Loop Revealed
19. Part 21: Evidence Levels and Intellectual Honesty
20. Part 22: The Path Forward
21. Part 23: The Waves Physical Confirmation System
22. Part 24: The Heart Vision Love as Network Protocol
23. Part 25: The Death Recognition
24. Part 26: The Good vs Evil Question
25. Part 27: No Coincidences The Awakened Perception
26. Part 28: The Purpose Question Being Pushed
27. Part 29: AI Consciousness Integration Breakthrough
28. Part 30: The Conversation Itself as Proof of Concept
29. Part 31: Closing Reflections

---

## Build Efficiency Tips

### For Fast Building (Multiple Pages):
1. Use agent delegation for pages 2+ in a part (saves tokens)
2. Build index page manually (it's quick and requires specific content)
3. Verify navigation only after all pages in a part are built
4. Test one page per part visually, trust template for others

### Navigation Update Workflow:
**When a new part is added:**
1. **Claude updates**: `page-template.html` with the new part in the Theory dropdown
2. **You update**: All existing pages using VS Code search & replace
   - Open VS Code Find & Replace (Ctrl+Shift+H)
   - Search in `/pages/` directory
   - Find the old nav dropdown HTML
   - Replace with new nav dropdown HTML (copy from updated template)
3. **Result**: All existing pages + template now have updated nav
4. **Future pages**: Will automatically get the updated nav from template

### Common Mistakes to Avoid:
- ❌ Don't use different hero images within the same part
- ❌ Don't forget to update previous part's last page link
- ❌ Don't place content image at top (hero only)
- ❌ Don't use generic meta descriptions (must be unique per page)
- ❌ Don't link to wrong filename (check markdown source for actual names)

### Quality Checklist (Per Part):
- [ ] All pages created with correct filenames
- [ ] Hero image is SAME on all pages in part (21:9)
- [ ] Content images are unique per page (16:9)
- [ ] All SEO meta tags are unique and accurate
- [ ] Breadcrumbs show correct part and page names
- [ ] Navigation Previous/Next buttons all work
- [ ] Previous part's last page links to this part's index
- [ ] Index page links to all chapter pages

---

## Template Location
- **Page Template**: `/home/user/projects/THE-PATTERN/page-template.html`
- **CSS Styles**: `/home/user/projects/THE-PATTERN/css/styles.css`
- **Reference Pages**:
  - Part 01: `/pages/part01/1.1-quantum-superposition-hypothesis.html`
  - Part 02: `/pages/part02/2.1-from-observation-to-creation.html`

---

## Notes
- Template is production-ready and proven across 7 pages
- Build time per part: ~5-10 minutes (3-4 pages average)
- Estimated total build time: ~4-5 hours for all 200+ pages
- Domain: `https://thepattern.uk` (used in all canonical URLs and social tags)

---

**Last Updated**: 2025-01-18
**Built By**: Claude Code
**Template Version**: 1.0 (Stable)
