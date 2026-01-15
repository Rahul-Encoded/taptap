# TapTap - Tiptap Document Editor with Real-Time Pagination

A document editor built with Tiptap that displays visual page breaks matching word processor behavior, targeting accurate print output for A4 and other page sizes.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## Approach to Calculating Page Breaks

### Current Implementation: `tiptap-pagination-plus`

The production implementation uses the [`tiptap-pagination-plus`](https://www.npmjs.com/package/tiptap-pagination-plus) extension, which provides:

1. **Automatic page boundary detection** - The extension monitors editor content and calculates where page breaks should occur based on configured page dimensions.

2. **Visual page separation** - Pages are rendered with visual gaps between them, simulating how a printed document would appear.

3. **Dynamic recalculation** - As content changes (typing, pasting, deleting), page breaks are recalculated in real-time.

4. **Configurable dimensions** - Page size, margins, and gaps are configurable via extension options, allowing support for A4, Letter, Legal, and custom sizes.

### Key Configuration

```typescript
PaginationExtension.configure({
  pageHeight: 1123, // A4 height at 96 DPI (11.69 inches)
  pageWidth: 794, // A4 width at 96 DPI (8.27 inches)
  pageMargin: 96, // 1 inch margins
  pageGap: 76, // Visual gap between pages
});
```

### How It Works

The extension uses **ProseMirror decorations** to inject visual page indicators without modifying the underlying document model. This separation means:

- The document JSON remains clean and portable
- Page breaks are purely presentational
- Different page sizes can be applied without re-processing content

---

## Trade-offs and Limitations

### Current Limitations

| Area                    | Limitation                                                                                                                       |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| **Paragraph Splitting** | Long paragraphs that exceed page height are split at word boundaries—they don't simply overflow to the next page as a whole unit |
| **Table Handling**      | Tables crossing page boundaries may break awkwardly; individual cells aren't split                                               |
| **Print Accuracy**      | While targeting print parity, actual browser print rendering may differ slightly due to CSS page media handling                  |
| **Performance**         | Very large documents (100+ pages) may experience lag during recalculation                                                        |
| **Headers/Footers**     | Currently basic—custom header/footer content requires manual configuration                                                       |

### Design Trade-offs

| Decision                           | Trade-off                                                             |
| ---------------------------------- | --------------------------------------------------------------------- |
| **Using `tiptap-pagination-plus`** | Faster development vs. less control over internals                    |
| **Decorations over transforms**    | Clean document model vs. complexity in decoration management          |
| **Visual-only page breaks**        | Non-destructive editing vs. no actual page-break characters in export |
| **Fixed page dimensions**          | Simpler calculation vs. no responsive/fluid layout option             |

---

## What I Would Improve With More Time

### 1. Paragraph Splitting at Word Boundaries

Split long paragraphs when they exceed usable page height, finding natural break points at words rather than forcing entire paragraphs to new pages.

### 2. Smarter Table Pagination

Split tables at row boundaries and handle cells that contain large amounts of content more gracefully.

### 3. Orphan/Widow Control

Prevent single lines at the top or bottom of pages (orphans and widows) by adjusting break points.

### 4. Print-Perfect Export

Implement DOCX/PDF export that respects visual page breaks, ensuring what-you-see-is-what-you-get in exported documents.

### 5. Performance Optimization

- **Incremental updates**: Only recalculate affected pages on content changes
- **Virtualization**: For very long documents, only render visible pages plus a small buffer

### 6. Page Number Overlays

Show current page indicator as users scroll, and display page numbers in headers/footers.

---

## Experimental: Custom Pagination Implementation

In a separate `experiment` branch, I explored building pagination from scratch without relying on external packages. This was a learning exercise to understand the underlying mechanics.

### The Spacer Pattern

Unlike CSS `page-break-before` (which doesn't work in contenteditable), the custom system uses **invisible spacer divs** to push content past page boundaries.

### Algorithm Overview

1. **Traverse the document** node by node (paragraphs, headings, list items, etc.)
2. **Calculate each node's position** relative to page boundaries:
   - `offsetTop` = node's DOM offset + cumulative spacer heights
   - `offsetBottom` = offsetTop + node height + margins
3. **Detect boundary crossings** - a node crosses if:
   - Its top is past the page's content area, or
   - Its bottom is past the page's content area, or
   - It spans multiple pages
4. **Calculate spacer height** when crossing detected:
   ```
   targetTop = (nextPage * (pageHeight + gap)) + margin
   spacerHeight = targetTop - currentTop
   ```
5. **Create ProseMirror decorations** - invisible divs inserted before crossing nodes
6. **ResizeObserver triggers recalculation** on any content change

### Key Dimensions (A4 at 96 DPI)

| Measurement | Value                   |
| ----------- | ----------------------- |
| Page Height | 1123px (11.69 inches)   |
| Page Width  | 794px (8.27 inches)     |
| Margin      | 96px (1 inch)           |
| Page Gap    | 76px (visual separator) |

### Experimental Design Decisions

| Decision                             | Rationale                                             |
| ------------------------------------ | ----------------------------------------------------- |
| Custom `UniqueIdExtension`           | Avoids ProseMirror version conflicts from npm package |
| ResizeObserver over MutationObserver | More reliable for height-based recalculation          |
| Decoration widgets (not transforms)  | Keeps underlying document model clean                 |
| CSS variables for container height   | Allows dynamic sizing without re-renders              |

### Experimental File Structure

```
app/EditorComponents/pagination/
├── constants.ts              # A4 dimensions, margins, page gap
├── types.ts                  # TypeScript interfaces
├── utils.ts                  # Helper functions + isNodeCrossing()
├── pagination.css            # A4 styling, spacers, print styles
├── Extensions/
│   ├── PaginationExtension.ts    # TipTap extension with decoration plugin
│   ├── UniqueIdExtension.ts      # Assigns unique IDs to nodes
│   └── updateDecorations.ts      # Core pagination algorithm
└── hooks/
    ├── usePagination.ts      # ResizeObserver for dynamic updates
    └── useDocHeight.ts       # CSS variable for container height
```

### Lessons Learned from Custom Implementation

1. **DOM measurement is tricky** - Getting accurate element positions in contenteditable requires careful handling of margins, padding, and spacer offsets.
2. **ProseMirror decorations are powerful** - They allow separating presentation from document structure elegantly.
3. **ResizeObserver is essential** - It provides reliable updates when content dimensions change without manual event wiring.
4. **Throttling is necessary** - Without it, rapid typing causes performance issues due to constant recalculation.

---

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Editor**: Tiptap
- **Pagination**: `tiptap-pagination-plus` extension
- **State Management**: Jotai atoms for page size/margin state
- **Styling**: CSS with CSS variables for dynamic theming

---

## Learn More
