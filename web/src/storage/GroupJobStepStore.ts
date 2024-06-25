import { create } from 'zustand';
import { GroupJobStep } from '../types/GroupJobStep';

interface GroupJobStepStore {
    groupJobSteps: GroupJobStep[];
    setGroupJobSteps: (groupJobSteps: GroupJobStep[]) => void;
}

export const useGroupJobStepStore = create<GroupJobStepStore>((set) => ({
  groupJobSteps: [
    { id: 1, name: "Step 1", isDone: false },
    { id: 2, name: "Step 2", isDone: false },
    { id: 3, name: "Step 3", isDone: false },
  ],
  setGroupJobSteps: (data) => set({ groupJobSteps: data }),
}));