import { CircleCheck, FileSearch, NotebookPen } from "lucide-react";
import { StatusBadge } from "../interfaces/statusBadge";

export const statusBadge: StatusBadge[] = [
    {
        bgColor: "bg-orange-400/20",
        color: "text-orange-400",
        text: "Draft",
        icon: <NotebookPen size={14}></NotebookPen>,
        description: "Draft version - still being edited"
    },
    {
        bgColor: "bg-green-400/20",
        color: "text-green-400",
        text: "Approved",
        icon: <FileSearch size={14}></FileSearch>,
        description: "Approved and finalized"

    },
    {
        bgColor: "bg-blue-400/20",
        color: "text-blue-400",
        text: "Review",
        icon: <CircleCheck size={14}></CircleCheck>,
        description: "Ready for review"
    }
]
