import { useCallback, useEffect } from "react";
import { Editor } from "@tiptap/react";
import { updateDecorations } from "../Extensions/updateDecorations";
import { PAGE_GAP, MARGIN_TOP, MARGIN_BOTTOM } from "../constants";

/**
 * React hook for managing pagination decorations
 * Sets up ResizeObserver to trigger recalculation when editor height changes
 * 
 * @param editor - TipTap editor instance
 * @param marginTop - Top margin (header area) in pixels (default: 96px)
 * @param marginBottom - Bottom margin (footer area) in pixels (default: 96px)
 * @param pageGap - Gap between pages in pixels (default: 76px)
 * @returns Manual refresh function
 */
export const usePagination = (
  editor: Editor | null,
  marginTop: number = MARGIN_TOP,
  marginBottom: number = MARGIN_BOTTOM,
  pageGap: number = PAGE_GAP
) => {
  useEffect(() => {
    if (!editor) return;

    // Initial decoration calculation
    updateDecorations(editor, marginTop, marginBottom, pageGap);

    // Track height to avoid unnecessary updates
    let previousHeight = Math.floor(editor.view.dom.clientHeight);

    // ResizeObserver triggers recalculation on height changes
    const observer = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        const newHeight = Math.floor(entry.contentRect.height);
        if (newHeight !== previousHeight) {
          previousHeight = newHeight;
          updateDecorations(editor, marginTop, marginBottom, pageGap);
        }
      });
    });

    // Observe the editor DOM element
    observer.observe(editor.view.dom);

    // Cleanup on unmount
    return () => {
      observer.disconnect();
    };
  }, [editor, pageGap, marginTop, marginBottom]);

  // Manual refresh function for external triggers
  const refresh = useCallback(() => {
    if (editor) {
      updateDecorations(editor, marginTop, marginBottom, pageGap);
    }
  }, [editor, marginTop, marginBottom, pageGap]);

  return refresh;
};

export default usePagination;
