"use client"
import { Badge } from "@/components/ui/badge";
import { statusBadge } from "./utils/constants/statusBadge";
import { cn } from "@/lib/utils";
import { useAtom } from "jotai";
import { statusAtom } from "./utils/atoms/atoms";

export default function StatusBadge(){
    const [status] = useAtom(statusAtom)
    return(
        <Badge variant="outline" className={cn(status.bgColor, status.color, "text-xs flex items-center gap-2 h-7 [&>svg]:size-4")}>
            {status.icon}
            {status.text}
        </Badge>
    )
}