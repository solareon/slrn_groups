import { create } from "zustand";
import { Group } from "../types/Group";
import { GroupJobStep } from "../types/GroupJobStep";

interface GroupStore {
    groups: Group[];
    setGroups: (groups: Group[]) => void;
}

const initialSteps: GroupJobStep[] = [
    { id: 1, name: "Step 1", isDone: false },
    { id: 2, name: "Step 2", isDone: false },
    { id: 3, name: "Step 3", isDone: false },
];

export const useGroupStore = create<GroupStore>((set) => ({
    groups: [
        {
            id: 1,
            status: "open",
            GName: "Group 1",
            GPass: "password",
            Users: 1,
            leader: 1,
            members: [{ name: "Larry", CID: "ABCD1234", Player: 1 }],
            stage: initialSteps,
            ScriptCreated: false,
        },
        {
            id: 2,
            status: "open",
            GName: "Group 2",
            GPass: "password",
            Users: 2,
            leader: 2,
            members: [{ name: "Larry", CID: "ABCD1234", Player: 3 }],
            stage: initialSteps,
            ScriptCreated: false,
        },
    ],
    setGroups: (groups) => set({ groups }),
}));