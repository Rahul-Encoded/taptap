"use client";

import { useAtom } from "jotai";
import { footerAtom, headerAtom } from "./NavbarComponents/utils/atoms/atoms";
import { X } from "lucide-react";

export default function HeaderFooterPopUp({type, onBack}: {type: "header" | "footer"; onBack: () => void}){
    const [header, setHeader] = useAtom(headerAtom);
    const [footer, setFooter] = useAtom(footerAtom);

    const handleHeaderChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setHeader(e.target.value);
    }

    const handleFooterChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setFooter(e.target.value);
    }


    return(
        <div className="flex flex-col gap-2 h-100 w-100 border border-border bg-foreground/5 m-auto z-50 p-4 rounded-md">
            <div className="flex justify-between">
                <h2 className="text-lg font-semibold">Edit Header & Popup</h2>
                <button onClick={onBack}><X size={20} /></button>
            </div>
            {type === "header" ? 
            <textarea rows={1} value={header} onChange={(e) => handleHeaderChange(e)} className="w-auto bg-transparent border-2 border-transparent  hover:border-purple-800 focus:border-purple-800 focus:outline-none resize-none rounded-md transition-colors px-2 py-1 text-2xl font-semibold"/> 
            : <textarea rows={1} value={footer} onChange={(e) => handleFooterChange(e)} className="w-auto bg-transparent border-2 border-transparent hover:border-purple-800 focus:border-purple-800 focus:outline-none resize-none rounded-md transition-colors px-2 py-1 text-2xl font-semibold"/>}
        </div>
    )
}