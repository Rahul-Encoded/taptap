"use client"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SquarePen } from "lucide-react"
import { statusBadge } from "./utils/constants/statusBadge"
import StatusDropdownrow from "./StatusDropdownrow"
import { StatusBadge as StatusBadgeInterface } from "./utils/interfaces/statusBadge"
import { useAtom } from "jotai"
import { statusAtom } from "./utils/atoms/atoms"

export default function StatusSelector(){
    const [status, setStatus] = useAtom(statusAtom)

    return(
        <DropdownMenu>
            <DropdownMenuTrigger className="border-2 border-transparent hover:border-border rounded-full p-1 cursor-pointer "><SquarePen className="w-4 h-4"></SquarePen></DropdownMenuTrigger>
            <DropdownMenuContent className="w-40">
            <DropdownMenuLabel>Change Status</DropdownMenuLabel>
            <DropdownMenuSeparator></DropdownMenuSeparator>
            {statusBadge.map((status: StatusBadgeInterface) => (
                <DropdownMenuItem key={status.text}>
                    <StatusDropdownrow text={status.text} icon={status.icon} description={status.description} onClick={() => setStatus(status)} />
                </DropdownMenuItem>
            ))}
            </DropdownMenuContent>

        </DropdownMenu>
    )
}