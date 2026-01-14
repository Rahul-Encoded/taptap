import { Extension } from "@tiptap/core";
import { Plugin, PluginKey } from "@tiptap/pm/state";

export interface UniqueIdOptions {
  /** Attribute name for the ID (default: 'id') */
  attributeName: string;
  /** Node types to add IDs to */
  types: string[];
  /** Function to generate IDs */
  createId: () => string;
}

/**
 * Custom UniqueId extension that doesn't bundle prosemirror
 * Adds unique IDs to specified node types for pagination tracking
 */
export const UniqueIdExtension = Extension.create<UniqueIdOptions>({
  name: "uniqueId",

  addOptions() {
    return {
      attributeName: "id",
      types: [],
      createId: () => Math.random().toString(36).slice(2, 11),
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          [this.options.attributeName]: {
            default: null,
            parseHTML: (element) =>
              element.getAttribute(`data-${this.options.attributeName}`),
            renderHTML: (attributes) => {
              if (!attributes[this.options.attributeName]) {
                return {};
              }
              return {
                [`data-${this.options.attributeName}`]:
                  attributes[this.options.attributeName],
              };
            },
          },
        },
      },
    ];
  },

  addProseMirrorPlugins() {
    const { attributeName, types, createId } = this.options;

    return [
      new Plugin({
        key: new PluginKey("uniqueId"),
        appendTransaction: (transactions, oldState, newState) => {
          const docChanged = transactions.some((tr) => tr.docChanged);
          if (!docChanged) return null;

          const tr = newState.tr;
          let modified = false;

          newState.doc.descendants((node, pos) => {
            if (types.includes(node.type.name)) {
              if (!node.attrs[attributeName]) {
                tr.setNodeMarkup(pos, undefined, {
                  ...node.attrs,
                  [attributeName]: createId(),
                });
                modified = true;
              }
            }
          });

          return modified ? tr : null;
        },
      }),
    ];
  },
});

export default UniqueIdExtension;
