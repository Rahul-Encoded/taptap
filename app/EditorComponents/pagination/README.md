# Custom Tiptap Pagination

A custom pagination system for Tiptap that displays visual A4 page breaks, matching Word processor behavior.

## How Page Breaks Are Calculated

### The Spacer Pattern

Unlike CSS `page-break-before` (which doesn't work in contenteditable), this system uses **invisible spacer divs** to push content past page boundaries.

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

## Trade-offs and Limitations

### Current Limitations

1. **No automatic paragraph splitting** - If a paragraph is taller than the usable page height, it will span pages rather than being split at a word boundary.

2. **Table handling is basic** - Individual table rows are tracked, but tables as a whole may cross boundaries awkwardly if rows are very tall.

3. **No headers/footers yet** - The previous `tiptap-pagination-plus` package provided these; they need separate re-implementation.

4. **Print matching untested** - While the algorithm targets print accuracy, browser print rendering may still differ slightly from the visual editor.

5. **Performance** - Full document traversal on every change could be slow for very large documents (hundreds of pages). Currently throttled but not virtualized.

### Design Decisions

| Decision                             | Rationale                                             |
| ------------------------------------ | ----------------------------------------------------- |
| Custom UniqueIdExtension             | Avoids prosemirror version conflicts from npm package |
| ResizeObserver over MutationObserver | More reliable for height-based recalculation          |
| Decoration widgets (not transforms)  | Keeps underlying document model clean                 |
| CSS variables for container height   | Allows dynamic sizing without re-renders              |

## Future Improvements

With more time, the following enhancements would make the system production-ready:

### 1. Paragraph Splitting

Split long paragraphs at word boundaries when they exceed page height:

```typescript
if (nodeHeight > usableHeight) {
  const splitPoint = findWordBreakAt(content, targetHeight);
  splitNodeAt(pos, splitPoint);
}
```

### 2. Headers and Footers

Re-implement as decorations rendered at fixed positions:

```typescript
Decoration.widget(pageStartPos, () => renderHeader(pageNumber));
Decoration.widget(pageEndPos, () => renderFooter(pageNumber, totalPages));
```

### 3. Page Numbers

Overlay component showing current page as user scrolls:

```tsx
<PageIndicator currentPage={visiblePage} totalPages={pageCount} />
```

### 4. Print Preview Mode

Side-by-side view comparing editor rendering to actual print output.

### 5. Performance: Incremental Updates

Only recalculate affected pages when content changes mid-document:

```typescript
const affectedPages = getAffectedPageRange(changedPos);
updateDecorationsForPages(affectedPages);
```

### 6. Export Integration

Ensure DOCX/PDF export respects the same page breaks:

```typescript
// Convert spacer decorations to actual page break elements in export
if (isSpacer(node)) {
  docx.addPageBreak();
}
```

## File Structure

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

## Usage

```tsx
import { PaginationExtension } from './pagination/Extensions/PaginationExtension';
import { UniqueIdExtension } from './pagination/Extensions/UniqueIdExtension';
import { usePagination } from './pagination/hooks/usePagination';
import { useDocHeight } from './pagination/hooks/useDocHeight';
import './pagination/pagination.css';

const editor = useEditor({
  extensions: [
    StarterKit,
    UniqueIdExtension.configure({
      types: ['paragraph', 'heading', 'listItem', ...],
    }),
    PaginationExtension.configure({
      pageMargin: 96,
      pageGap: 76,
    }),
  ],
});

usePagination(editor);
useDocHeight(editor);
```
