import { create } from 'zustand';
import { GroupJobStep } from '../types/GroupJobStep';
import { fetchReactNui } from '../utils/fetchReactNui';

interface GroupJobStepStore {
    groupJobSteps: GroupJobStep[];
    getGroupJobSteps: () => void;
    setGroupJobSteps: (groupJobSteps: GroupJobStep[]) => void;
}

export const useGroupJobStepStore = create<GroupJobStepStore>((set) => ({
  groupJobSteps: [],
  getGroupJobSteps: async () => {
    const groupJobSteps = await fetchReactNui<GroupJobStep[]>('getGroupJobSteps', {}, [
      { id: 1, name: 'Step 1', isDone: false },
      { id: 2, name: 'Step 2', isDone: false },
      { id: 3, name: 'Step 3', isDone: false },
    ]);
    set({ groupJobSteps });
  },
  setGroupJobSteps: (data) => set({ groupJobSteps: data }),
}));