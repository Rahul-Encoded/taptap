import { PageSizeKey } from "../atoms/atoms";

// Map display names to PAGE_SIZES keys
export const PAGE_SIZE_OPTIONS: { label: string; key: PageSizeKey }[] = [
    { label: "A4", key: "A4" },
    { label: "A3", key: "A3" },
    { label: "A5", key: "A5" },
    { label: "Legal", key: "LEGAL" },
    { label: "Letter", key: "LETTER" },
    { label: "Tabloid", key: "TABLOID" },
];