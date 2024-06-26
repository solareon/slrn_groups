import { create } from "zustand";
import { Group } from "../types/Group";
import { GroupJobStep } from "../types/GroupJobStep";

interface GroupStore {
  currentGroups: Group[];
  currentGroup: Group;
  inGroup: boolean;
  setGroups: (currentGroups: Group[]) => void;
  setCurrentGroup: (currentGroup: Group) => void;
  setInGroup: (inGroup: boolean) => void;
}

export const useGroupStore = create<GroupStore>((set) => ({
  currentGroups: [],
  inGroup: false,
  setGroups: (data) => set({ currentGroups: data }),
  setCurrentGroup: (data) => set({ currentGroup: data }),
  setInGroup: (data) => set({ inGroup: data }),
}));