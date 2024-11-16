import { atom } from "recoil";

export type NavbarSelectedField =  "unread" | "read" | "favorites"

export const navbarAtom = atom<NavbarSelectedField>({
    key: "navbarAtom",
    default: "unread"
})