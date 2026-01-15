import { Button } from "@/components/ui/button";
import { Printer, Loader2 } from "lucide-react";
import { useCurrentEditor } from '@tiptap/react';
import { useState } from "react";

export default function PrintButton() {
    const { editor } = useCurrentEditor();
    const [isExporting, setIsExporting] = useState(false);

    const handleExport = async () => {
        if (!editor || isExporting) return;

        setIsExporting(true);
        try {
            const html = editor.getHTML();

            const response = await fetch('/api/export-pdf', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ html }),
            });

            if (!response.ok) {
                console.error("Export failed status:", response.status, response.statusText);
                const errorText = await response.text();
                console.error("Export failed body:", errorText);
                try {
                     const errorData = JSON.parse(errorText);
                     console.error("Export failed json:", errorData);
                } catch (e) {
                    console.error("Response was not JSON");
                }
                alert("Failed to export PDF. Please try again.");
                return;
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `document_${new Date().toISOString().slice(0, 10)}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

        } catch (error) {
            console.error("Export error:", error);
            alert("An error occurred during export.");
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <Button 
            variant="outline" 
            onClick={handleExport} 
            disabled={isExporting}
            size="icon"
            title="Export to PDF"
        >
            {isExporting ? <Loader2 size={12} className="animate-spin" /> : <Printer size={16} />}
        </Button>
    )
}
