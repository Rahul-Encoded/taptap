import { Node } from "@tiptap/pm/model";

/**
 * Configuration options for the pagination extension
 */
export interface PaginationConfig {
  /** Top/bottom margin in pixels (default: 96px = 1 inch) */
  pageMargin: number;
  /** Gap between pages in pixels (default: 76px) */
  pageGap: number;
  /** Horizontal padding inside pages in pixels */
  pagePadding: number;
}

/**
 * Represents an element that crosses a page boundary
 * and needs a spacer to push it to the next page
 */
export interface CrossingElement {
  /** Start position in the document */
  from: number;
  /** End position in the document */
  to: number;
  /** Page number where the element starts (0-indexed) */
  startPage: number;
  /** Page number where the element ends (0-indexed) */
  endPage: number;
  /** Y-coordinate of the page break */
  crossingPoint: number;
  /** Height of spacer needed to push element to next page */
  marginToFix: number;
  /** Original top margin of the element */
  marginTop: number;
  /** Text content preview for debugging */
  content: string;
  /** The ProseMirror node */
  node: Node;
}

/**
 * Data attributes used on decorated elements
 */
export enum SplitNodeAttribute {
  ORIGINAL_MARGIN = "data-original-margin",
  MARGIN_ADDED = "data-margin-added",
}

/**
 * Page break info stored in plugin state
 */
export interface PageBreakInfo {
  /** Unique ID of the node */
  id: string;
  /** Height of spacer to add before this node */
  marginToFix: number;
}

/**
 * Plugin state for the pagination decoration plugin
 */
export interface PaginationPluginState {
  pageBreaks: PageBreakInfo[];
}
