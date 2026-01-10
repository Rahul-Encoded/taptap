import { atom } from "jotai";
import { statusBadges } from "../constants/statusBadge";

// File Name atom
export const fileNameAtom = atom("Untitled");

// Status atom
export const statusAtom = atom(statusBadges[0]);