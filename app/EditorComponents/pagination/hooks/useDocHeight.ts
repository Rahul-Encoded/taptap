import { useEffect } from "react";
import { Editor } from "@tiptap/react";
import { A4_HEIGHT_PX, PAGE_GAP } from "../constants";
import { throttle } from "../utils";

/**
 * Updates the CSS --doc-height variable based on page count
 */
const updateDocHeight = (editor: Editor, pageGap: number): void => {
  // Get current document height
  const docHeight = Math.round(editor.view.dom.scrollHeight);
  
  // Calculate number of pages needed
  const pages = Math.ceil((docHeight + pageGap) / (A4_HEIGHT_PX + pageGap));
  
  // Total height = pages * page height + gaps between pages
  const minHeight = pages * A4_HEIGHT_PX + (pages - 1) * pageGap;

  // Update CSS variable for editor container
  document.documentElement.style.setProperty("--doc-height", `${minHeight}px`);
};

// Throttled version to avoid excessive updates
const throttledUpdateDocHeight = throttle(updateDocHeight, 100);

/**
 * React hook for managing document height CSS variable
 * Ensures editor container height matches content pages
 * 
 * @param editor - TipTap editor instance
 * @param pageGap - Gap between pages in pixels (default: 76px)
 */
export const useDocHeight = (
  editor: Editor | null,
  pageGap: number = PAGE_GAP
): void => {
  useEffect(() => {
    if (!editor) return;

    // Initial calculation
    throttledUpdateDocHeight(editor, pageGap);

    // ResizeObserver for dynamic updates
    const observer = new ResizeObserver(() => {
      throttledUpdateDocHeight(editor, pageGap);
    });

    observer.observe(editor.view.dom);

    return () => {
      observer.disconnect();
    };
  }, [editor, pageGap]);
};

export default useDocHeight;
