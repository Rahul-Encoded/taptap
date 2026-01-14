import { Extension } from "@tiptap/core";
import { Node } from "@tiptap/pm/model";
import { Plugin, PluginKey } from "@tiptap/pm/state";
import { Decoration, DecorationSet } from "@tiptap/pm/view";
import { PaginationPluginState } from "../types";

// Plugin key for accessing pagination state and dispatching updates
export const paginationPluginKey = new PluginKey<PaginationPluginState>(
  "paginationDecoration"
);

export interface PaginationExtensionOptions {
  /** Top/bottom page margin in pixels (default: 96px = 1 inch) */
  pageMargin: number;
  /** Gap between pages in pixels (default: 76px) */
  pageGap: number;
}

/**
 * TipTap extension for document pagination
 * Creates invisible spacer decorations to push content past page boundaries
 */
export const PaginationExtension = Extension.create<PaginationExtensionOptions>({
  name: "pagination",

  addOptions() {
    return {
      pageMargin: 96,
      pageGap: 76,
    };
  },

  addProseMirrorPlugins() {
    return [
      new Plugin<PaginationPluginState>({
        key: paginationPluginKey,

        state: {
          init(): PaginationPluginState {
            return { pageBreaks: [] };
          },
          apply(tr, value): PaginationPluginState {
            // Check for pagination metadata in transaction
            const meta = tr.getMeta(paginationPluginKey);
            return meta ? meta : value;
          },
        },

        props: {
          decorations(state) {
            const pluginState = paginationPluginKey.getState(state);
            const ids = pluginState?.pageBreaks.map((pb) => pb.id) || [];

            if (ids.length === 0) {
              return DecorationSet.empty;
            }

            // Find nodes that need decorations
            const nodesToDecorate: {
              node: Node;
              pos: number;
              marginToFix: number;
            }[] = [];

            state.doc.descendants((node, pos) => {
              if (ids.includes(node.attrs.id)) {
                nodesToDecorate.push({
                  node,
                  pos,
                  marginToFix:
                    pluginState?.pageBreaks.find(
                      (pb) => pb.id === node.attrs.id
                    )?.marginToFix || 0,
                });
              }
            });

            // Create decoration pairs for each crossing node
            const decorations = nodesToDecorate.flatMap((item) => [
              // Spacer widget before the node
              Decoration.widget(
                item.pos,
                () => {
                  const spacer = document.createElement("div");
                  spacer.style.height = `${item.marginToFix}px`;
                  spacer.className = "spacer";
                  return spacer;
                },
                { side: -1 } // Insert before content
              ),
              // Node decoration for debugging/styling
              Decoration.node(item.pos, item.pos + item.node.nodeSize, {
                class: "page-break-node",
                "data-margin-added": `${item.marginToFix}`,
              }),
            ]);

            return DecorationSet.create(state.doc, decorations);
          },
        },
      }),
    ];
  },
});

export default PaginationExtension;
