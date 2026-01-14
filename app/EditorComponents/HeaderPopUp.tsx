"use client";

import { useAtom } from "jotai";
import { footerAtom, headerAtom } from "./utils/atoms/atoms";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCurrentEditor } from "@tiptap/react";

export default function HeaderFooterPopUp({type, onBack}: {type: "header" | "footer"; onBack: () => void}){
    const { editor } = useCurrentEditor();
    const [header, setHeader] = useAtom(headerAtom);
    const [footer, setFooter] = useAtom(footerAtom);

    const handleHeaderChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setHeader(e.target.value);
    }

    const handleFooterChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setFooter(e.target.value);
    }

    const handleSubmit = () => {
        if (!editor) {
            // console.log('No editor available');
            return;
        }
        
        // console.log('Updating header/footer:', type, header, footer);
        
        if (type === "header") {
            editor.chain().updateHeaderContent(header, '').run();
        } else {
            editor.chain().updateFooterContent(footer, 'Page {page} of {total}').run();
        }
        
        // Force a view update by dispatching an empty transaction
        // This triggers the pagination plugin to re-check options vs storage
        const { state, view } = editor;
        view.dispatch(state.tr);
        
        // console.log('Header/footer update complete');
        onBack();
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSubmit();
        }
    }

    return(
        <div className="flex flex-col gap-2 h-100 w-100 border border-border bg-foreground/5 m-auto z-50 p-4 rounded-md">
            <div className="flex justify-between">
                <h2 className="text-lg font-semibold">Edit {type === "header" ? "Header" : "Footer"}</h2>
                <button onClick={onBack}><X size={20} /></button>
            </div>
            {type === "header" ? 
            <textarea rows={1} value={header} onChange={(e) => handleHeaderChange(e)} onKeyDown={handleKeyDown} className="w-auto bg-transparent border-2 border-border  hover:border-purple-800 focus:border-purple-800 focus:outline-none resize-none rounded-md transition-colors px-2 py-1 text-2xl font-semibold"/> 
            : <textarea rows={1} value={footer} onChange={(e) => handleFooterChange(e)} onKeyDown={handleKeyDown} className="w-auto bg-transparent border-2 border-border hover:border-purple-800 focus:border-purple-800 focus:outline-none resize-none rounded-md transition-colors px-2 py-1 text-2xl font-semibold"/>}

            <Button variant="ghost" onClick={handleSubmit}>Done</Button>
        </div>
    )
}