import { create } from "zustand";
import { Group } from "../types/Group";
import { Member } from "../types/Member";
import { GroupJobStep } from "../types/GroupJobStep";

interface GroupStore {
  currentGroups: Group[];
  currentGroup: Member[];
  inGroup: number | null;
  isLeader: boolean;
  setGroups: (currentGroups: Group[]) => void;
  setCurrentGroup: (currentGroup: Group) => void;
  setInGroup: (inGroup: boolean) => void;
  setIsLeader: (isLeader: boolean) => void;
}

export const useGroupStore = create<GroupStore>((set) => ({
  currentGroups: [],
  currentGroup: [],
  inGroup: false,
  isLeader: false,
  setGroups: (data) => {
    set({ currentGroups: data });
  },
  setCurrentGroup: (data) => {
    set({ currentGroup: data });
  },
  setInGroup: (data) => {
    set({ inGroup: data });
  },
  setIsLeader: (data) => {
    set({ isLeader: data });
  },
}));