"use client";
import { useAtom } from "jotai";
import { fileNameAtom } from "../utils/atoms/atoms";

export default function FileName(){
    const [fileName, setFileName] = useAtom(fileNameAtom);
    

    return(
        
        <textarea rows={1} value={fileName} onChange={(e) => setFileName(e.target.value)} className="w-auto bg-transparent border-2 border-transparent hover:border-purple-800 focus:border-purple-800 focus:outline-none resize-none rounded-md transition-colors px-2 py-1 text-2xl font-semibold"/>
        
    )
}