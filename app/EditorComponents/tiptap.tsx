"use client"
import { EditorContent, useEditor, EditorContext } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit'
import { useState, useMemo } from 'react';
import TipTapToolBar from './TipTapToolBar';

import Underline from '@tiptap/extension-underline'
import { TextStyleKit } from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'
import Highlight from '@tiptap/extension-highlight'
import Link from '@tiptap/extension-link'
import TextAlign from '@tiptap/extension-text-align'
import Subscript from '@tiptap/extension-subscript'
import Superscript from '@tiptap/extension-superscript'
import Blockquote from '@tiptap/extension-blockquote'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { all, createLowlight } from 'lowlight'
import Image from '@tiptap/extension-image';
import { ImageUploadNode } from '@/components/tiptap-node/image-upload-node';
import { handleImageUpload, MAX_FILE_SIZE } from '@/lib/tiptap-utils';

// Pagination imports
import { PaginationExtension } from './pagination/Extensions/PaginationExtension';
import { UniqueIdExtension } from './pagination/Extensions/UniqueIdExtension';
import { usePagination } from './pagination/hooks/usePagination';
import { useDocHeight } from './pagination/hooks/useDocHeight';
import { A4_HEIGHT_PX, PAGE_GAP, MARGIN_TOP, MARGIN_BOTTOM } from './pagination/constants';
import './pagination/pagination.css';

// Node styling imports
import "@/components/tiptap-node/blockquote-node/blockquote-node.scss"
import "@/components/tiptap-node/code-block-node/code-block-node.scss"
import "@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node.scss"
import "@/components/tiptap-node/list-node/list-node.scss"
import "@/components/tiptap-node/image-node/image-node.scss"
import "@/components/tiptap-node/heading-node/heading-node.scss"
import "@/components/tiptap-node/paragraph-node/paragraph-node.scss"

const lowlight = createLowlight(all)



export default function TipTapEditor() {
  const [pageCount, setPageCount] = useState(1);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        blockquote: false,
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
      }),
      // UniqueId extension for pagination node identification
      UniqueIdExtension.configure({
        attributeName: 'id',
        types: [
          'paragraph',
          'heading',
          'orderedList',
          'bulletList',
          'listItem',
          'table',
          'tableRow',
          'tableHeader',
          'tableCell',
          'blockquote',
          'codeBlock',
        ],
        createId: () => Math.random().toString(36).slice(2, 11),
      }),
      Underline,
      TextStyleKit,
      Color,
      Highlight.configure({ multicolor: true }),
      Link,
      Image,
      ImageUploadNode.configure({
        accept: 'image/*',
        maxSize: MAX_FILE_SIZE,
        limit: 3,
        upload: handleImageUpload,
        onError: (error) => console.error('Upload failed:', error),
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Subscript,
      Superscript,
      Blockquote,
      CodeBlockLowlight.configure({
        lowlight,
      }),
      // Custom pagination extension
      PaginationExtension.configure({
        pageMargin: MARGIN_TOP,
        pageGap: PAGE_GAP,
      }),
    ],
    // Add unique IDs to nodes on creation
    editorProps: {
      attributes: {
        class: 'paginated-editor-content',
      },
    },
    onUpdate: ({ editor }) => {
      // Update page count for overlays
      const docHeight = editor.view.dom.scrollHeight;
      const pages = Math.ceil((docHeight + PAGE_GAP) / (A4_HEIGHT_PX + PAGE_GAP));
      setPageCount(pages);
    },
  });

  // Custom pagination hooks (pass header and footer margins)
  usePagination(editor, MARGIN_TOP, MARGIN_BOTTOM, PAGE_GAP);
  useDocHeight(editor, PAGE_GAP);

  // Calculate page gap overlays
  const pageGapOverlays = useMemo(() => {
    return Array.from({ length: pageCount }).map((_, idx) => (
      <div
        key={`page-gap-${idx}`}
        className="page-gap-overlay"
        style={{
          top: `${(idx + 1) * (A4_HEIGHT_PX + PAGE_GAP) - PAGE_GAP}px`,
          height: PAGE_GAP,
        }}
      />
    ));
  }, [pageCount]);

  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2 w-full h-full">
      <EditorContext.Provider value={{ editor }}>
        <TipTapToolBar />
        <div className="editor-page-wrapper" id="printableArea">
          <div className="paginated-editor">
            <EditorContent
              editor={editor}
              className="w-full"
              id="editor"
            />
            {pageGapOverlays}
          </div>
        </div>
      </EditorContext.Provider>
    </div>
  );
}
