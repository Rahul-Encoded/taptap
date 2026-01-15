import { atom } from "jotai";
import { statusBadges } from "../constants/statusBadge";

// File Name atom
export const fileNameAtom = atom("Untitled");

// Status atom
export const statusAtom = atom(statusBadges[0]);

// Page Size types and atom
export type PageSizeKey = "A4" | "A3" | "A5" | "LETTER" | "LEGAL" | "TABLOID";
export const pageSizeAtom = atom<PageSizeKey>("A4");