import { atom } from "jotai";
import { statusBadge } from "../constants/statusBadge";

// File Name atom
export const fileNameAtom = atom("Untitled");

// Status atom
export const statusAtom = atom(statusBadge[0]);