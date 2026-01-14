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
import { statusBadges } from "../utils/constants/statusBadge"
import StatusDropdownrow from "./StatusDropdownrow"
import { StatusBadge as StatusBadgeInterface } from "../utils/interfaces/statusBadge"
import { useAtom } from "jotai"
import { statusAtom } from "../utils/atoms/atoms"
import { cn } from "@/lib/utils"

export default function StatusSelector(){
    const [status, setStatus] = useAtom(statusAtom)

    return(
        <DropdownMenu>
            <DropdownMenuTrigger className="border-2 border-transparent hover:border-border rounded-full p-1 cursor-pointer "><SquarePen className="w-4 h-4"></SquarePen></DropdownMenuTrigger>
            <DropdownMenuContent className="w-60">
            <DropdownMenuLabel>Change Status</DropdownMenuLabel>
            <DropdownMenuSeparator></DropdownMenuSeparator>
            {statusBadges.map((statusBadge: StatusBadgeInterface) => (
                <DropdownMenuItem key={statusBadge.text} className={cn(statusBadge.text === status.text ? "bg-purple-400/50 text-purple-500" : "")}>
                    <StatusDropdownrow text={statusBadge.text} icon={statusBadge.icon} description={statusBadge.description} onClick={() => setStatus(statusBadge)} />
                </DropdownMenuItem>
            ))}
            </DropdownMenuContent>

        </DropdownMenu>
    )
}