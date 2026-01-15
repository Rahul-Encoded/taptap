"use client"
import { EditorContent, useEditor, EditorContext } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit'
import { 
  PaginationPlus,
  PAGE_SIZES
} from 'tiptap-pagination-plus'
import { pageSizeAtom } from './utils/atoms/atoms';
import { useAtomValue } from 'jotai';
import TipTapToolBar from './TipTapToolBar';

import { TextStyle } from '@tiptap/extension-text-style'
import Highlight from '@tiptap/extension-highlight'
import TextAlign from '@tiptap/extension-text-align'
import Subscript from '@tiptap/extension-subscript'
import Superscript from '@tiptap/extension-superscript'
import Blockquote from '@tiptap/extension-blockquote'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { all, createLowlight } from 'lowlight'
import { TableKitPlus } from 'tiptap-table-plus';

const lowlight = createLowlight(all)

export default function TipTapEditor(){
  const pageSize = useAtomValue(pageSizeAtom);

  const editor = useEditor({
    onCreate: ({ editor }) => {
      editor.chain().focus()
        .updatePageSize(PAGE_SIZES[pageSize])
        .updateMargins({ top: 96, bottom: 96, left: 96, right: 96 })
        .run()
    },  
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        blockquote: false,
        codeBlock: false,
      }),
      TextStyle,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Subscript,
      Superscript,
      Blockquote,
      CodeBlockLowlight.configure({
        lowlight,
      }),
      TableKitPlus,
      PaginationPlus.configure({
        pageGap: 50,
        pageGapBorderSize: 1,
        pageGapBorderColor: "#e5e5e5",
        pageBreakBackground: "#ffffff",
        footerRight: "Page {page}",
        footerLeft: "",
        headerRight: "",
        headerLeft: "",
        marginTop: 96,
        marginBottom: 96,
        marginLeft: 96,
        marginRight: 96,
        contentMarginTop: 10,
        contentMarginBottom: 10,
      }),
    ],
  })

  if (!editor) {
    return null
  }

 return (
    <div className="flex flex-col gap-2 w-full">
      <EditorContext.Provider value={{ editor }}>
        <TipTapToolBar />
        <div className="overflow-x-auto m-auto" id="printableArea">
          <EditorContent
            editor={editor}
            className="w-full mb-5 mt-2 editor-container"
            id="editor"
          />
        </div>
      </EditorContext.Provider>
    </div>
  );
}
