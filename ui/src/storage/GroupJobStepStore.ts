import { create } from 'zustand';
import { GroupJobStep } from '../types/GroupJobStep';

interface GroupJobStepStore {
    groupJobSteps: GroupJobStep[];
    setGroupJobSteps: (groupJobSteps: GroupJobStep[]) => void;
}

export const useGroupJobStepStore = create<GroupJobStepStore>((set) => ({
  groupJobSteps: [],
  setGroupJobSteps: (data: GroupJobStep[]) => set({ groupJobSteps: data }),
}));