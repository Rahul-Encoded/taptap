import { DropdownMenu, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAtom } from "jotai";
import { pageSizeAtom } from "./utils/atoms/atoms";
import { DropdownMenuContent } from "@radix-ui/react-dropdown-menu";

import { ChevronDownIcon } from "lucide-react";

export default function PageSizeDropDown() {
    const [pageSize, setPageSize] = useAtom(pageSizeAtom)
    const sizes = ["A4", "A3", "A5", "Legal", "Letter", "Tabloid"]
    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 border border-border rounded-md p-2 text-sm">{pageSize}<ChevronDownIcon size={12}/></DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white">
                <DropdownMenuGroup>
                {sizes.map((size) => (
                    <DropdownMenuItem key={size} onSelect={() => {setPageSize(size)}}>{size}</DropdownMenuItem>
                ))}
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}