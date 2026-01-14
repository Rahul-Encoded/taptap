"use client"
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit'
import { useAtom } from 'jotai';
import { 
  PaginationPlus,
  PAGE_SIZES
} from 'tiptap-pagination-plus'
import { footerAtom, headerAtom } from './NavbarComponents/utils/atoms/atoms';
import { useState } from 'react';
import HeaderFooterPopUp from './HeaderPopUp';
import TipTapToolBar from './TipTapToolBar';


export default function TipTapEditor(){
  const [popUp, setPopUp] = useState(false);
  const [type, setType] = useState<"header" | "footer">("header");
  const [header] = useAtom(headerAtom);
  const [footer] = useAtom(footerAtom);


const editor = useEditor({
  onCreate: () => {
    editor?.chain().focus()
  .updatePageSize(PAGE_SIZES.A4)
  .updateMargins({ top: 30, bottom: 30, left: 60, right: 60 })
  .updateHeaderContent('Document Title', 'Page {page}')
  .updateFooterContent('Confidential', 'Page {page} of {total}')
  .run()
  },  
  immediatelyRender: false,
  extensions: [
    StarterKit,
    PaginationPlus.configure({
      pageHeight: 800,        // Height of each page in pixels
      pageWidth: 789,         // Width of each page in pixels
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
      },
      onFooterClick: ({ event, pageNumber }: { event: React.MouseEvent; pageNumber: number }) => {
        console.log(`Footer clicked on page ${pageNumber}`)
        setPopUp(true)
        setType("footer")
      },
    }),
  ],
})

 return (
    <div className="flex flex-col gap-2 w-full">
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
    </div>
  );
}