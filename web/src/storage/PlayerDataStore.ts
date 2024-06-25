import { create } from 'zustand';

interface PlayerData {
  source: number;
  citizenId: string;
}

interface PlayerDataStore {
  playerData: PlayerData;
  setPlayerData: (data: PlayerData) => void;
}

export const usePlayerDataStore = create<PlayerDataStore>((set) => ({
  playerData: {
    source: 1,
    citizenId: 'ABCD1234',
    name: 'Testicle',
  },
  setPlayerData: (data) => set({ playerData: data }),
}));
