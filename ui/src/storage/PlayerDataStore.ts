import { create } from 'zustand';

interface PlayerData {
  source: number;
}

interface PlayerDataStore {
  playerData: PlayerData;
  setPlayerData: (data: PlayerData) => void;
}

export const usePlayerDataStore = create<PlayerDataStore>((set) => ({
  playerData: null,
  setPlayerData: (data) => {
    set({ playerData: data });
  },
}));
