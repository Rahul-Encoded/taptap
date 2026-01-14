import { DropdownMenu, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAtom } from "jotai";
import { pageSizeAtom, PageSizeKey } from "./utils/atoms/atoms";
import { DropdownMenuContent } from "@radix-ui/react-dropdown-menu";
import { useCurrentEditor } from "@tiptap/react";
import { PAGE_SIZES } from "tiptap-pagination-plus";

import { ChevronDownIcon } from "lucide-react";
import { PAGE_SIZE_OPTIONS } from "./utils/constants/PageSizes";

export default function PageSizeDropDown() {
    const { editor } = useCurrentEditor();
    const [pageSize, setPageSize] = useAtom(pageSizeAtom);

    const handleSizeChange = (key: PageSizeKey) => {
        if (!editor) return;
        
        setPageSize(key);
        editor.chain().focus().updatePageSize(PAGE_SIZES[key]).run();
    };

    // Get display label for current size
    const currentLabel = PAGE_SIZE_OPTIONS.find(opt => opt.key === pageSize)?.label ?? pageSize;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 border border-border rounded-md p-2 text-sm">
                {currentLabel}
                <ChevronDownIcon size={12}/>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white">
                <DropdownMenuGroup>
                    {PAGE_SIZE_OPTIONS.map((option) => (
                        <DropdownMenuItem 
                            key={option.key} 
                            onSelect={() => handleSizeChange(option.key)}
                        >
                            {option.label}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
