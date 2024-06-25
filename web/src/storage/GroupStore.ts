import { create } from 'zustand';
import { Group } from '../types/Group';
import { GroupJobStep } from '../types/GroupJobStep';

interface GroupStore {
    groups: Group[];
    setGroups: (groups: Group[]) => void;
}

const initialSteps: GroupJobStep[] = [
    { id: 1, name: 'Step 1', isDone: false },
    { id: 2, name: 'Step 2', isDone: false },
    { id: 3, name: 'Step 3', isDone: false },
];

export const useGroupStore = create<GroupStore>((set) => ({
    groups: [
        {
            id: 1,
            status: 'open',
            GName: 'Larrys Group',
            GPass: 'password',
            leader: 1,
            members: [{ name: 'Larry', CID: 'ABCD1234', Player: 1 },
               { name: 'Barry', CID: 'EFGH5678', Player: 2 },
               { name: 'Harry', CID: 'IJKL9101', Player: 3 }],
            stage: initialSteps,
            ScriptCreated: false,
        },
        {
            id: 2,
            status: 'open',
            GName: 'Group 2',
            GPass: 'password',
            leader: 2,
            members: [{ name: 'Larry', CID: 'ABCD1234', Player: 3 }],
            stage: initialSteps,
            ScriptCreated: false,
        },
        {
            id: 3,
            status: 'open',
            GName: 'Group 3',
            GPass: 'password',
            leader: 3,
            members: [{ name: 'Larry', CID: 'ABCD1234', Player: 1 },
               { name: 'Barry', CID: 'EFGH5678', Player: 3 }],
            stage: initialSteps,
            ScriptCreated: false,
        },
        {
            id: 4,
            status: 'open',
            GName: 'Group 4',
            GPass: 'password',
            leader: 4,
            members: [{ name: 'Larry', CID: 'ABCD1234', Player: 4 }],
            stage: initialSteps,
            ScriptCreated: false,
        }
    ],
    setGroups: (groups) => set({ groups }),
}));
