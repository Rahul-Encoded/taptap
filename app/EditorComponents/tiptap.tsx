"use client"
import { EditorContent, useEditor, EditorProvider, EditorContext } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit'
import { useAtom } from 'jotai';
import { 
  PaginationPlus,
  PAGE_SIZES
} from 'tiptap-pagination-plus'
import { footerAtom, headerAtom, pageSizeAtom } from './utils/atoms/atoms';
import { useState } from 'react';
import { useAtomValue } from 'jotai';
import HeaderFooterPopUp from './HeaderPopUp';
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
import { TableKitPlus } from 'tiptap-table-plus';

const lowlight = createLowlight(all)

export default function TipTapEditor(){
  const [popUp, setPopUp] = useState(false);
  const [type, setType] = useState<"header" | "footer">("header");
  const [header, setHeader] = useAtom(headerAtom);
  const [footer, setFooter] = useAtom(footerAtom);
  const pageSize = useAtomValue(pageSizeAtom);
  

  const editor = useEditor({
    onCreate: ({ editor }) => {
      editor.chain().focus()
        .updatePageSize(PAGE_SIZES[pageSize])
        .updateMargins({ top: 30, bottom: 30, left: 60, right: 60 })
        .updateHeaderContent('Document Title', 'Page {page}')
        .updateFooterContent('Confidential', 'Page {page} of {total}')
        .run()
    },  
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Underline,
      [TextStyleKit],
      Color,
      Highlight.configure({ multicolor: true }),
      Link,
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
        pageGap: 50,            // Gap between pages in pixels
        pageGapBorderSize: 1,   // Border size for page gaps
        pageGapBorderColor: "#e5e5e5", // Border color for page gaps
        pageBreakBackground: "#ffffff",  // Background color for page gaps
        footerRight: "Page {page}",  // Custom HTML content to display in the footer right side
        footerLeft: footer,         // Custom HTML content to display in the footer left side
        headerRight: "",        // Custom HTML content to display in the header right side
        headerLeft: header,         // Custom HTML content to display in the header left side
        marginTop: 20,          // Top margin for pages
        marginBottom: 20,       // Bottom margin for pages
        marginLeft: 50,         // Left margin for pages
        marginRight: 50,        // Right margin for pages
        contentMarginTop: 10,   // Top margin for content within pages
        contentMarginBottom: 10, // Bottom margin for content within pages
        
        // Optional: Click callbacks
        onHeaderClick: ({ event, pageNumber }: { event: React.MouseEvent; pageNumber: number }) => {
          console.log(`Header clicked on page ${pageNumber}`)
          setPopUp(true)
          setType("header")
          setHeader(`${header}`)
        },
        onFooterClick: ({ event, pageNumber }: { event: React.MouseEvent; pageNumber: number }) => {
          console.log(`Footer clicked on page ${pageNumber}`)
          setPopUp(true)
          setType("footer")
          setFooter(`${footer}`)
        },
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
        <div className='inset-50 fixed z-50'>
          {popUp && <HeaderFooterPopUp type={type} onBack={() => setPopUp(false)} />}
        </div>
      </EditorContext.Provider>
    </div>
  );
}
