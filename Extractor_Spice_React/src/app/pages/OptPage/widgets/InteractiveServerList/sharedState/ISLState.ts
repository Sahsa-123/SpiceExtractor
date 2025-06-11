import { atom } from 'jotai';

type ISLStatus = "stable" | "editing" | "deleting" | "moovingUp" | "moovingDown";
export const ISLStateAtom = atom<ISLStatus>("stable");

export const ISLFetching = atom<boolean>(false)
