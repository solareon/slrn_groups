import { create } from 'zustand';
import { PlayerData } from '../types/PlayerData';

type PlayerDataStore = {
  playerData: PlayerData | null;
  setPlayerData: (data: PlayerData) => void;
}

export const usePlayerDataStore = create<PlayerDataStore>((set) => ({
  playerData: null,
  setPlayerData: (data) => {
    set({ playerData: data });
  },
}));
