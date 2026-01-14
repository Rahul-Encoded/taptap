import { A4_HEIGHT_PX } from "./constants";
import { SplitNodeAttribute } from "./types";

/**
 * Extract a computed CSS value from an element
 */
export const getComputedStyleValue = (
  element: HTMLElement,
  property: string
): number | undefined => {
  try {
    const styleMap = element.computedStyleMap();
    const value = styleMap.get(property) as { value: number } | undefined;
    return value?.value;
  } catch {
    // Fallback for browsers that don't support computedStyleMap
    const computed = getComputedStyle(element);
    const value = computed.getPropertyValue(property);
    return value ? parseFloat(value) : undefined;
  }
};

/**
 * Get a split node data attribute value
 */
export const getSplitNodeAttribute = (
  element: HTMLElement,
  attribute: SplitNodeAttribute
): number | undefined => {
  const value = element.getAttribute(attribute);
  if (!value) return undefined;
  return Number(value);
};

/**
 * Get the margin-top of the first child element
 */
export const getFirstChildMarginTop = (element: Node): number => {
  if (element instanceof HTMLElement) {
    const child = element.children[0];
    if (child instanceof HTMLElement) {
      return getComputedStyleValue(child, "margin-top") ?? 0;
    }
  }
  return 0;
};

/**
 * Get the margin-top of the next sibling element
 */
export const getSiblingMarginTop = (element: Node): number => {
  if (element instanceof HTMLElement) {
    const sibling = element.nextSibling;
    if (sibling instanceof HTMLElement) {
      return (
        (getComputedStyleValue(sibling, "margin-top") ?? 0) +
        (getFirstChildMarginTop(sibling) ?? 0)
      );
    }
  }
  return 0;
};

/**
 * Get distance from element bottom to next sibling top
 */
export const getDistanceFromNextSibling = (element: Node): number => {
  if (element instanceof HTMLElement) {
    const sibling = element.nextSibling;
    if (sibling instanceof HTMLElement) {
      return sibling.offsetTop - element.offsetTop - element.offsetHeight;
    }
  }
  return 0;
};

/**
 * Check if margins between element and next sibling are collapsing
 */
export const hasNextSiblingMarginCollapse = (element: Node): boolean => {
  if (element instanceof HTMLElement) {
    const distance = getDistanceFromNextSibling(element);
    const siblingMarginTop = getSiblingMarginTop(element);
    const currentMarginBottom = getComputedStyleValue(element, "margin-bottom") ?? 0;
    return distance < siblingMarginTop + currentMarginBottom;
  }
  return false;
};

/**
 * Determine if a node crosses a page boundary
 * @param offsetTop - Node's top position relative to document start
 * @param offsetBottom - Node's bottom position
 * @param marginTop - Top margin (header area) in pixels
 * @param marginBottom - Bottom margin (footer area) in pixels
 * @param pageGap - Gap between pages in pixels
 */
export const isNodeCrossing = (
  offsetTop: number,
  offsetBottom: number,
  marginTop: number,
  marginBottom: number,
  pageGap: number
): { isCrossing: boolean; startPage: number; endPage: number } => {
  const pageHeight = A4_HEIGHT_PX + pageGap;
  
  // The page the node starts on (0-indexed)
  const startPage = Math.floor(offsetTop / pageHeight);
  // The page the node ends on (0-indexed)
  const endPage = Math.floor(offsetBottom / pageHeight);

  // Where the content area ends on the current page (accounting for bottom margin/footer)
  const contentEnd = startPage * pageHeight + A4_HEIGHT_PX - marginBottom;

  const pageDiff = startPage !== endPage;
  const topCrossing = offsetTop > contentEnd;
  const bottomCrossing = offsetBottom > contentEnd;

  const isCrossing = topCrossing || bottomCrossing || pageDiff;

  return {
    isCrossing,
    startPage,
    endPage: pageDiff ? endPage - 1 : endPage,
  };
};

/**
 * Throttle function to limit execution rate
 */
export const throttle = <T extends (...args: Parameters<T>) => void>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let lastFunc: ReturnType<typeof setTimeout>;
  let lastRan: number;
  
  return function (this: void, ...args: Parameters<T>) {
    if (!lastRan || Date.now() - lastRan >= limit) {
      func.apply(this, args);
      lastRan = Date.now();
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(() => {
        func.apply(this, args);
        lastRan = Date.now();
      }, limit - (Date.now() - lastRan));
    }
  };
};
