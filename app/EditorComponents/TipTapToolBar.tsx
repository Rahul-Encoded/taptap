import { Toolbar, ToolbarGroup, ToolbarSeparator } from '@/components/tiptap-ui-primitive/toolbar'
import { Button } from '@/components/tiptap-ui-primitive/button'

import { Spacer } from '@/components/tiptap-ui-primitive/spacer'
import { ColorHighlightButton } from '@/components/tiptap-ui/color-highlight-button'
import { HeadingDropdownMenu } from '@/components/tiptap-ui/heading-dropdown-menu'
import { LinkPopover } from '@/components/tiptap-ui/link-popover'
import { ListDropdownMenu } from '@/components/tiptap-ui/list-dropdown-menu'
import { TextAlignButton } from '@/components/tiptap-ui/text-align-button'
import { MarkButton } from '@/components/tiptap-ui/mark-button'
import { UndoRedoButton } from '@/components/tiptap-ui/undo-redo-button'
import PageSizeDropDown from './PageSizeDropDown'
import { BlockquoteButton } from '@/components/tiptap-ui/blockquote-button'
import { CodeBlockButton } from '@/components/tiptap-ui/code-block-button'
import PrintButton from './PrintButton'


export default function TipTapToolBar() {
    
  return (
    <Toolbar variant="floating">
      <ToolbarGroup>
        <ColorHighlightButton />
        <HeadingDropdownMenu/>
        <LinkPopover/>
        <ListDropdownMenu/>
        <TextAlignButton align="left"/>
        <TextAlignButton align="center"/>
        <TextAlignButton align="right"/>
        <TextAlignButton align="justify"/>
        <MarkButton type="bold"/>
        <MarkButton type="italic"/>
        <MarkButton type="strike"/>
        <MarkButton type="code"/>
        <MarkButton type="underline"/>
        <MarkButton type="superscript"/>
        <MarkButton type="subscript"/>
        <UndoRedoButton action='undo'/>
        <UndoRedoButton action='redo'/>
        <BlockquoteButton/>
        <CodeBlockButton/>
      </ToolbarGroup>

      <ToolbarSeparator />
      

      <Spacer />
      <ToolbarGroup>
        <PrintButton/>
      <PageSizeDropDown/>
        <Button data-style="primary">Save</Button>
      </ToolbarGroup>
    </Toolbar>
  )
}