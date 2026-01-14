"use client"

import { forwardRef, useCallback, useState } from "react"
import { Table as TableIcon } from "lucide-react"
import { useTiptapEditor } from "@/hooks/use-tiptap-editor"
import { Button } from "@/components/tiptap-ui-primitive/button"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/tiptap-ui-primitive/dropdown-menu"
import { Card, CardBody } from "@/components/tiptap-ui-primitive/card"
import { Input } from "@/components/tiptap-ui-primitive/input"
import { cn } from "@/lib/tiptap-utils"

export interface TableDropdownMenuProps extends React.ComponentPropsWithoutRef<typeof Button> {
    editor?: any // Using any to avoid complex type issues for now, or could use Editor
}

export const TableDropdownMenu = forwardRef<HTMLButtonElement, TableDropdownMenuProps>(
  ({ editor: providedEditor, className, ...props }, ref) => {
    const { editor } = useTiptapEditor(providedEditor)
    const [isOpen, setIsOpen] = useState(false)
    const [rows, setRows] = useState(3)
    const [cols, setCols] = useState(3)

    const handleInsert = useCallback(() => {
        if (!editor) return

        editor
            .chain()
            .focus()
            .insertTable({ rows: Math.max(1, rows), cols: Math.max(1, cols), withHeaderRow: true })
            .run()
        
        setIsOpen(false)
    }, [editor, rows, cols])

    if (!editor) return null

    return (
      <DropdownMenu modal open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            data-style="ghost"
            aria-label="Insert Table"
            tooltip="Insert Table"
            className={cn(className)}
            {...props}
            ref={ref}
          >
            <TableIcon className="tiptap-button-icon" size={16} />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="start" className="w-48">
          <Card>
            <CardBody className="flex flex-col gap-3 p-3">
                <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-muted-foreground">Rows</label>
                    <Input 
                        type="number" 
                        value={rows} 
                        onChange={(e) => setRows(parseInt(e.target.value) || 0)} 
                        min={1}
                        className="h-8"
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-muted-foreground">Columns</label>
                    <Input 
                        type="number" 
                        value={cols} 
                        onChange={(e) => setCols(parseInt(e.target.value) || 0)} 
                        min={1}
                        className="h-8"
                    />
                </div>
                <Button 
                    onClick={handleInsert} 
                    data-style="primary" 
                    className="w-full h-8 text-xs"
                >
                    Insert Table
                </Button>
            </CardBody>
          </Card>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }
)

TableDropdownMenu.displayName = "TableDropdownMenu"
