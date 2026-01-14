import { Editor } from "@tiptap/react";
import { A4_HEIGHT_PX, PAGE_GAP, MARGIN_TOP, MARGIN_BOTTOM } from "../constants";
import { CrossingElement } from "../types";
import { getComputedStyleValue, isNodeCrossing } from "../utils";
import { paginationPluginKey } from "./PaginationExtension";

// Nodes that should not be decorated directly - traversal continues to children
const BLACKLIST = ["orderedList", "bulletList", "listItem", "table"];
// Nodes that block traversal into children (handled as atomic units)
const PARENT_BLOCKER = ["tableRow"];

/**
 * Main decoration update function
 * Traverses the document and calculates spacer decorations for nodes
 * that cross page boundaries
 * 
 * @param editor - TipTap editor instance
 * @param marginTop - Top margin (header area) in pixels
 * @param marginBottom - Bottom margin (footer area) in pixels
 * @param pageGap - Gap between pages in pixels
 */
export const updateDecorations = (
  editor: Editor,
  marginTop: number = MARGIN_TOP,
  marginBottom: number = MARGIN_BOTTOM,
  pageGap: number = PAGE_GAP
): void => {
  const doc = editor.state.doc;
  const crossingElements: CrossingElement[] = [];

  // Track cumulative margin added by spacers
  let curMargin = 0;
  const offsetTopDict: Record<string, boolean> = {};

  doc.nodesBetween(0, doc.content.size, (node, pos) => {
    // Skip blacklisted nodes - continue to children
    if (BLACKLIST.includes(node.type.name)) return true;

    const pageRect = editor.view.dom.getBoundingClientRect();
    const dom = editor.view.nodeDOM(pos);

    if (dom && dom instanceof HTMLElement) {
      const nodeBefore = dom.previousElementSibling as HTMLElement | null;
      const nodeBeforeIsSpacer = nodeBefore?.classList.contains("spacer");
      
      const nodeMarginTop = Math.ceil(getComputedStyleValue(dom, "margin-top") ?? 0);
      const nodeMarginBottom = getComputedStyleValue(dom, "margin-bottom") ?? 0;

      // Subtract any previous spacer height to get true document position
      if (nodeBeforeIsSpacer) {
        curMargin -= getComputedStyleValue(nodeBefore!, "height") ?? 0;
      }

      let offsetTop = 0;
      let offsetBottom = 0;

      // Handle table rows specially - use getBoundingClientRect
      if (node.type.name === "tableRow") {
        const tableRowRect = dom.getBoundingClientRect();
        offsetTop = Math.ceil(tableRowRect.top - pageRect.top + curMargin);
        offsetBottom = offsetTop + tableRowRect.height + marginBottom;
      } else {
        // Standard elements use offsetTop
        offsetTop = Math.ceil(dom.offsetTop + curMargin);
        offsetBottom = offsetTop + dom.offsetHeight + nodeMarginBottom + nodeMarginTop;
      }

      // Check if node crosses page boundary (accounts for footer margin)
      const { isCrossing, startPage, endPage } = isNodeCrossing(
        offsetTop,
        offsetBottom,
        marginTop,
        marginBottom,
        pageGap
      );

      // Check if node is too tall for a single page (usable = total - header - footer)
      const usableHeight = A4_HEIGHT_PX - marginTop - marginBottom;
      const nodeHeight = dom.offsetHeight + nodeMarginTop + nodeMarginBottom;

      if (nodeHeight > usableHeight) {
        // For paragraphs/headings that are too tall, we could split them
        // For now, just allow them to span pages without spacer
        return true;
      }

      if (isCrossing) {
        // Calculate spacer height to push content to next page start + header margin
        const targetOffsetTop =
          (endPage + 1) * (A4_HEIGHT_PX + pageGap) + marginTop + nodeMarginTop;
        const marginToFix = Math.ceil(targetOffsetTop - offsetTop);

        // Track margin only once per offsetTop position
        const marginCounted = offsetTopDict[offsetTop.toString()];
        if (!marginCounted) {
          curMargin += marginToFix;
          offsetTopDict[offsetTop.toString()] = true;
        }

        crossingElements.push({
          from: pos,
          to: pos + node.nodeSize,
          startPage,
          endPage,
          marginToFix,
          crossingPoint: (startPage + 1) * A4_HEIGHT_PX,
          content: node.textContent?.slice(0, 10) ?? "",
          marginTop,
          node,
        });

        // Don't traverse children of crossing elements
        return false;
      } else if (PARENT_BLOCKER.includes(node.type.name)) {
        // Don't traverse into blocked parent nodes
        return false;
      }
    }

    return true;
  });

  // Build page break info for plugin state
  const pageBreaks = crossingElements.map((elem) => ({
    id: elem.node.attrs.id,
    marginToFix: elem.marginToFix,
  }));

  // Dispatch decoration update via transaction metadata
  const tr = editor.state.tr.setMeta(paginationPluginKey, { pageBreaks });
  editor.view.dispatch(tr);
};
