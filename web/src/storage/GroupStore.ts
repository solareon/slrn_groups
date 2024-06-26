import { create } from "zustand";
import { fetchReactNui } from "../utils/fetchReactNui";
import { Group } from "../types/Group";
import { GroupJobStep } from "../types/GroupJobStep";

interface GroupStore {
  currentGroups: Group[];
  getCurrentGroups: () => void;
  setGroups: (currentGroups: Group[]) => void;
}

export const useGroupStore = create<GroupStore>((set) => ({
  getCurrentGroups: async () => {
    const currentGroups = await fetchReactNui<Group[]>("getCurrentGroups", {}, [
      {
        id: 1,
        status: "open",
        GName: "Larrys Group",
        GPass: "password",
        leader: 1,
        members: [
          { name: "Larry", CID: "ABCD1234", Player: 1 },
          { name: "Barry", CID: "EFGH5678", Player: 2 },
          { name: "Harry", CID: "IJKL9101", Player: 3 },
        ],
        stage: [],
        ScriptCreated: false,
      },
      {
        id: 2,
        status: "open",
        GName: "Group 2",
        GPass: "password",
        leader: 2,
        members: [{ name: "Larry", CID: "ABCD1234", Player: 3 }],
        stage: [],
        ScriptCreated: false,
      },
      {
        id: 3,
        status: "open",
        GName: "Group 3",
        GPass: "password",
        leader: 3,
        members: [
          { name: "Larry", CID: "ABCD1234", Player: 1 },
          { name: "Barry", CID: "EFGH5678", Player: 3 },
        ],
        stage: [],
        ScriptCreated: false,
      },
      {
        id: 4,
        status: "open",
        GName: "Group 4",
        GPass: "password",
        leader: 4,
        members: [{ name: "Larry", CID: "ABCD1234", Player: 4 }],
        stage: [],
        ScriptCreated: false,
      },
    ]);
    set({ currentGroups });
  },
  setGroups: (currentGroups) => set({ currentGroups }),
}));
